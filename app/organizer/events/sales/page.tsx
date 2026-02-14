import { requireOrganizer } from "@/lib/guards";
import { db } from "@/db";
import { events, ticketTypes } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import Navbar from "@/components/navbar";
import Link from "next/link";

export default async function EventSalesPage() {
  const session = await requireOrganizer();

  if (!session.user.id) throw new Error("Missing user id");

  // Aggregate tickets sold per event (include events with zero sold)
  const rows = await db
    .select({
      id: events.id,
      title: events.title,
      slug: events.slug,
      createdAt: events.createdAt,
      sold: sql<number>`coalesce(sum(${ticketTypes.quantitySold}), 0)`,
      revenueEtb: sql<number>`coalesce(sum(${ticketTypes.quantitySold} * (${ticketTypes.price} / 100.0)), 0)`,
      startingPriceEtb: sql<number>`coalesce(min(${ticketTypes.price}) / 100.0, 0)`,
    })
    .from(events)
    .leftJoin(ticketTypes, eq(ticketTypes.eventId, events.id))
    .where(eq(events.organizerId, session.user.id))
    .groupBy(events.id, events.title, events.slug, events.createdAt)
    .orderBy(events.createdAt);

  return (
    <div className="min-h-screen pb-20 bg-background text-white">
      <Navbar />

      <main className="pt-24 px-6 max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Ticket Sales by Event</h1>
          <p className="text-gray-400">
            Shows how many tickets have been sold for each of your events.
          </p>
        </header>

        <div className="glass-card rounded-2xl overflow-hidden p-1">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/50 text-slate-400 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Event</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Tickets Sold</th>
                <th className="px-6 py-4">Revenue</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {rows.map((r: any) => (
                <tr
                  key={r.id}
                  className="hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-slate-200">
                    {r.title}
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    {new Intl.NumberFormat("en-ET", {
                      style: "currency",
                      currency: "ETB",
                    }).format(r.startingPriceEtb ?? 0)}
                  </td>
                  <td className="px-6 py-4 text-slate-400">{r.sold ?? 0}</td>
                  <td className="px-6 py-4 text-slate-400">
                    {new Intl.NumberFormat("en-ET", {
                      style: "currency",
                      currency: "ETB",
                    }).format(r.revenueEtb ?? 0)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/events/${r.slug}`}
                      className="text-indigo-400 hover:text-indigo-300"
                    >
                      View Event
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
