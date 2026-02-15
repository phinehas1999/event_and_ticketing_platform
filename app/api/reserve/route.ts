import { auth } from "@/auth";
import { db } from "@/db";
import { payments } from "@/db/schema/payments";
import { ticketTypes, tickets } from "@/db/schema/tickets";
import { events } from "@/db/schema/events";
import { eq } from "drizzle-orm";
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData();
  const ticketTypeId = form.get("ticketTypeId")?.toString();
  const slug = form.get("slug")?.toString();
  const file = form.get("screenshot") as File | null;

  if (!ticketTypeId || !slug || !file) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // validate ticket type and event
  const tt = await db
    .select()
    .from(ticketTypes)
    .where(eq(ticketTypes.id, ticketTypeId))
    .then((r) => r[0]);

  if (!tt)
    return NextResponse.json({ error: "Invalid ticket type" }, { status: 400 });

  const ev = await db
    .select()
    .from(events)
    .where(eq(events.slug, slug))
    .then((r) => r[0]);

  if (!ev)
    return NextResponse.json({ error: "Event not found" }, { status: 404 });

  // save file to public/uploads
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await fs.promises.mkdir(uploadsDir, { recursive: true });

  const safeName = (file as any).name || "screenshot";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}-${safeName}`;
  const filepath = path.join(uploadsDir, filename);

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  await fs.promises.writeFile(filepath, buffer);

  // create payment record
  const amount = tt.price;

  if (!session.user.id) {
    return NextResponse.json({ error: "User ID is missing" }, { status: 400 });
  }
  const [payment] = await db
    .insert(payments)
    .values({
      userId: session.user.id as string,
      eventId: ev.id,
      ticketTypeId: tt.id,
      amount,
      receiptImageUrl: `/uploads/${filename}`,
    })
    .returning();

  // do NOT create ticket yet — organizer must approve first
  return NextResponse.json({ ok: true, payment });
}
