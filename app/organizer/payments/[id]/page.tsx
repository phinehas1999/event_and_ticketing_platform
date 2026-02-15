import { notFound } from "next/navigation";
import Link from "next/link";
import { requireOrganizer } from "@/lib/guards";
import { db } from "@/db";
import { payments } from "@/db/schema/payments";
import { users } from "@/db/schema/users";
import { events } from "@/db/schema/events";
import { ticketTypes } from "@/db/schema/tickets";
import { eq } from "drizzle-orm";
import OrganizerPaymentReview from "@/components/organizer-payment-review";
import Lightbox from "@/components/lightbox";

export default async function OrganizerPaymentPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const session = await requireOrganizer();
  const { id } = (await params) as { id: string };

  const res = await db
    .select({
      payment: payments,
      user: users,
      event: events,
      ticketType: ticketTypes,
    })
    .from(payments)
    .leftJoin(users, eq(payments.userId, users.id))
    .leftJoin(events, eq(payments.eventId, events.id))
    .leftJoin(ticketTypes, eq(payments.ticketTypeId, ticketTypes.id))
    .where(eq(payments.id, id))
    .then((r) => r[0]);

  if (!res) {
    // attempt to find payment without joins to provide more diagnostic info
    const simple = await db
      .select()
      .from(payments)
      .where(eq(payments.id, id))
      .then((r) => r[0]);

    if (simple) {
      return (
        <div className="min-h-screen pb-20">
          <main className="pt-24 px-6 max-w-3xl mx-auto">
            <header className="mb-8">
              <h1 className="text-2xl font-bold">
                Payment Found — Unable to Load
              </h1>
              <p className="text-sm text-gray-400">
                A payment with that ID exists but the review page couldn't load
                joined data. This usually means the payment's event is not
                accessible to your organizer account or a join failed.
              </p>
            </header>

            <div className="p-4 rounded-md bg-white/3 border border-white/6">
              <p className="text-sm text-gray-300">Payment ID: {simple.id}</p>
              <p className="text-sm text-gray-300">
                Event ID: {simple.eventId}
              </p>
              <p className="text-sm text-gray-300">User ID: {simple.userId}</p>
              <p className="text-sm text-gray-300 mt-2">
                If you are the organizer for the event shown above, verify that
                your `session.user.id` matches the event's `organizer_id` in the
                database.
              </p>
            </div>

            <div className="mt-6">
              <a href="/organizer/payments" className="text-indigo-400">
                Back to payments list
              </a>
            </div>
          </main>
        </div>
      );
    }

    return (
      <div className="min-h-screen pb-20">
        <main className="pt-24 px-6 max-w-3xl mx-auto">
          <header className="mb-8">
            <h1 className="text-2xl font-bold">Payment Not Found</h1>
            <p className="text-sm text-gray-400">
              The payment ID you requested was not found. It may have been
              deleted or the ID is incorrect.
            </p>
          </header>
          <div className="mt-6">
            <a href="/organizer/payments" className="text-indigo-400">
              Back to payments list
            </a>
          </div>
        </main>
      </div>
    );
  }

  const { payment, user, event, ticketType } = res;

  return (
    <div className="min-h-screen pb-20">
      <main className="pt-24 px-6 max-w-3xl mx-auto">
        <header className="mb-8">
          <Link
            href="/organizer/payments"
            className="inline-flex items-center text-sm text-indigo-400 hover:text-indigo-300 mb-2"
          >
            ← Back to payments
          </Link>

          <h1 className="text-2xl font-bold">Review Payment</h1>
          <p className="text-sm text-gray-400">
            Approve or reject this bank transfer.
          </p>
        </header>

        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white/3 border border-white/6">
            <p className="text-sm text-gray-400">From</p>
            <p className="text-white font-medium">
              {user?.name || "Unknown user"}
            </p>
            <p className="text-xs text-gray-400">{user?.email}</p>
            <p className="text-xs text-gray-400 mt-1">
              Ticket Type: {ticketType?.name}
            </p>
            <p className="text-xs text-gray-400">Event: {event?.title}</p>
            <p className="text-sm font-bold text-emerald-300 mt-3">
              Amount: ETB {(payment.amount / 100).toFixed(2)}
            </p>
            {payment.note && (
              <p className="text-sm text-gray-300 mt-2">Note: {payment.note}</p>
            )}
          </div>

          <div className="p-6 rounded-2xl bg-white/3 border border-white/6">
            <h3 className="font-semibold text-white mb-2">Receipt</h3>
            {payment.receiptImageUrl ? (
              <div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={payment.receiptImageUrl}
                  alt="receipt"
                  className="w-full rounded-lg max-h-60 object-contain"
                />
                <div className="mt-2">
                  <Lightbox src={payment.receiptImageUrl} alt="receipt" />
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400">
                No receipt image provided.
              </p>
            )}
          </div>

          <OrganizerPaymentReview paymentId={payment.id} />
        </div>
      </main>
    </div>
  );
}
