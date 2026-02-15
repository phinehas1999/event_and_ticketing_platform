import { auth } from "@/auth";
import { db } from "@/db";
import { payments } from "@/db/schema/payments";
import { tickets } from "@/db/schema/tickets";
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
  if (!(session.user.role === "ORGANIZER" || session.user.role === "ADMIN")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id: paymentId } = (await params) as { id: string };

  const payment = await db
    .select()
    .from(payments)
    .where(eq(payments.id, paymentId))
    .then((r) => r[0]);

  if (!payment)
    return NextResponse.json({ error: "Payment not found" }, { status: 404 });
  const ev = await db
    .select()
    .from(events)
    .where(eq(events.id, payment.eventId))
    .then((r) => r[0]);

  if (!ev)
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  if (session.user.role !== "ADMIN" && ev.organizerId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // mark payment approved
  const [updated] = await db
    .update(payments)
    .set({
      status: "APPROVED",
      reviewedBy: session.user.id,
      reviewedAt: new Date(),
    })
    .where(eq(payments.id, paymentId))
    .returning();

  // create ticket for the buyer
  const [ticket] = await db
    .insert(tickets)
    .values({
      userId: payment.userId,
      eventId: payment.eventId,
      ticketTypeId: payment.ticketTypeId,
    })
    .returning();

  return NextResponse.json({ ok: true, payment: updated, ticket });
}
