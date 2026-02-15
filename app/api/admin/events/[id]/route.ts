import { auth } from "@/auth";
import { db } from "@/db";
import { events } from "@/db/schema/events";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } },
) {
  const session = await auth();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = (await params) as { id: string };
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const ev = await db
    .select()
    .from(events)
    .where(eq(events.id, id))
    .then((r) => r[0]);
  if (!ev) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(ev);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } },
) {
  const session = await auth();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = (await params) as { id: string };
  const body = await req.json().catch(() => ({}));
  const {
    title,
    slug,
    description,
    startDate,
    endDate,
    location,
    coverImageUrl,
    bankAccountId,
    organizerId,
  } = body as any;

  if (
    !title ||
    !slug ||
    !startDate ||
    !endDate ||
    !location ||
    !bankAccountId ||
    !organizerId
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  const [updated] = await db
    .update(events)
    .set({
      title,
      slug,
      description: description || "",
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      location,
      coverImageUrl: coverImageUrl || null,
      bankAccountId,
      organizerId,
    })
    .where(eq(events.id, id))
    .returning();

  return NextResponse.json({ ok: true, event: updated });
}
