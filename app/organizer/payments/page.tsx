import Link from "next/link";
import { requireOrganizer } from "@/lib/guards";
import { db } from "@/db";
import { payments } from "@/db/schema/payments";
import { users } from "@/db/schema/users";
import { events } from "@/db/schema/events";
import { ticketTypes } from "@/db/schema/tickets";
import { eq } from "drizzle-orm";

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams?: { page?: string };
}) {
  const session = await requireOrganizer();
  const page = Math.max(1, parseInt(searchParams?.page || "1", 10) || 1);
  const pageSize = 10;
  const offset = (page - 1) * pageSize;

  // fetch one extra to know whether there's a next page
  const pendingRaw = await db
    .select({
      id: payments.id,
      amount: payments.amount,
      userName: users.name,
      userEmail: users.email,
      eventTitle: events.title,
      ticketName: ticketTypes.name,
    })
    .from(payments)
    .leftJoin(users, eq(payments.userId, users.id))
    .leftJoin(events, eq(payments.eventId, events.id))
    .leftJoin(ticketTypes, eq(payments.ticketTypeId, ticketTypes.id))
    .where(eq(payments.status, "PENDING"))
    // @ts-ignore: Drizzle chained where() typing quirk — intentionally ignore
    .where(eq(events.organizerId, session.user.id))
    .limit(pageSize + 1)
    .offset(offset);

  const hasNext = pendingRaw.length > pageSize;
  const pending = hasNext ? pendingRaw.slice(0, pageSize) : pendingRaw;

  return (
    <div className="min-h-screen pb-20">
      <main className="pt-24 px-6 max-w-4xl mx-auto">
        <header className="mb-6">
          <Link
            href="/organizer/dashboard"
            className="inline-flex items-center text-sm text-indigo-400 hover:text-indigo-300 mb-2"
          >
            ← Back to dashboard
          </Link>

          <h1 className="text-2xl font-bold">Pending Payments</h1>
          <p className="text-sm text-gray-400">
            Review and approve bank transfer payments.
          </p>
        </header>

        <div className="space-y-4">
          {pending.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              No pending payments.
            </div>
          ) : (
            pending.map((p: any) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-700/50"
              >
                <div>
                  <p className="text-sm font-medium">{p.userName}</p>
                  <p className="text-xs text-slate-400">
                    {p.userEmail} · {p.eventTitle}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-400">
                    ETB {(p.amount / 100).toFixed(2)}
                  </p>
                  <Link
                    href={`/organizer/payments/${p.id}`}
                    className="text-xs text-indigo-400 hover:text-indigo-300 mt-1 block"
                  >
                    Review
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          {page > 1 && (
            <Link
              href={`/organizer/payments?page=${page - 1}`}
              className="px-3 py-1 bg-white/5 rounded"
            >
              Prev
            </Link>
          )}
          {hasNext && (
            <Link
              href={`/organizer/payments?page=${page + 1}`}
              className="px-3 py-1 bg-white/5 rounded"
            >
              Next
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}
