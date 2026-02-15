import { auth } from "@/auth";
import { db } from "@/db";
import { events } from "@/db/schema/events";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const {
    title,
    slug,
    description,
    startDate,
    endDate,
    location,
    coverImageUrl,
    organizerId,
    bankAccountId,
  } = body as any;

  if (
    !title ||
    !slug ||
    !startDate ||
    !endDate ||
    !location ||
    !organizerId ||
    !bankAccountId
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  const [inserted] = await db
    .insert(events)
    .values({
      title,
      slug,
      description: description || "",
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      location,
      coverImageUrl: coverImageUrl || null,
      organizerId,
      bankAccountId,
    })
    .returning();

  return NextResponse.json({ ok: true, event: inserted });
}
