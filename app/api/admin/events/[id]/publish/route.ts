import { auth } from "@/auth";
import { db } from "@/db";
import { events } from "@/db/schema/events";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } },
) {
  const session = await auth();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = (await params) as { id: string };

  const ev = await db
    .select()
    .from(events)
    .where(eq(events.id, id))
    .then((r) => r[0]);
  if (!ev) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const newStatus = ev.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";

  const [updated] = await db
    .update(events)
    .set({ status: newStatus })
    .where(eq(events.id, id))
    .returning();

  return NextResponse.json({ ok: true, event: updated });
}
