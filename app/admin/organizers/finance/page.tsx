import { requireAdmin } from "@/lib/guards";
import Navbar from "@/components/navbar";
import Link from "next/link";
import { db } from "@/db";
import { users, events, payments, tickets } from "@/db/schema";
import { sql, desc, eq, inArray, and } from "drizzle-orm";

async function getOrganizerFinance() {
  const organizers = await db
    .select({ id: users.id, name: users.name, email: users.email })
    .from(users)
    .where(sql`role = 'ORGANIZER'`)
    .orderBy(desc(users.createdAt));

  const rows = await Promise.all(
    organizers.map(async (org: any) => {
      const evs = await db
        .select({ id: events.id })
        .from(events)
        .where(eq(events.organizerId, org.id));
      const eventIds = evs.map((e: any) => e.id);
      if (eventIds.length === 0)
        return { id: org.id, name: org.name, ticketsSold: 0, revenue: 0 };

      const ticketsCountRes = await db
        .select({ cnt: sql<number>`count(*)` })
        .from(tickets)
        .where(inArray(tickets.eventId, eventIds));
      const ticketsSold = Number((ticketsCountRes as any)[0]?.cnt ?? 0);

      const revenueRes = await db
        .select({ rev: sql<number>`coalesce(sum(${payments.amount}), 0)` })
        .from(payments)
        .where(
          and(
            inArray(payments.eventId, eventIds),
            eq(payments.status, "APPROVED"),
          ),
        );
      const revenue = Number((revenueRes as any)[0]?.rev ?? 0);

      return { id: org.id, name: org.name, ticketsSold, revenue };
    }),
  );

  return rows;
}

export default async function OrganizersFinancePage() {
  await requireAdmin();
  const rows = await getOrganizerFinance();

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-ET", {
      style: "currency",
      currency: "ETB",
    }).format(amount / 100);

  return (
    <>
      <Navbar />
      <main className="min-h-screen p-8 pt-24 space-y-8 text-slate-50">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Organizers — Financials</h1>
            <p className="text-slate-400 mt-1">
              Tickets sold and revenue by organizer.
            </p>
          </div>
          <Link
            href="/admin"
            className="glass-button text-sm text-indigo-300 px-3 py-2 rounded-xl"
          >
            Back
          </Link>
        </header>

        <div className="glass-card p-6 rounded-2xl">
          {rows.length === 0 ? (
            <p className="text-gray-400">No organizers found.</p>
          ) : (
            <ul className="divide-y divide-white/6">
              {rows.map((r: any) => (
                <li
                  key={r.id}
                  className="py-4 flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium">{r.name || "(no name)"}</div>
                    <div className="text-xs text-gray-400">
                      Tickets sold: {r.ticketsSold}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      {formatCurrency(r.revenue)}
                    </div>
                    <Link
                      href={`/admin/organizers/${r.id}`}
                      className="text-sm text-indigo-300"
                    >
                      View
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </>
  );
}
