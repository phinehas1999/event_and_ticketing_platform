import { redirect } from "next/navigation";
import { db } from "@/db";
import { tickets } from "@/db/schema/tickets";
import { payments } from "@/db/schema/payments";
import { events } from "@/db/schema/events";
import { ticketTypes } from "@/db/schema/tickets";
import { eq, desc, and } from "drizzle-orm";
import { auth } from "@/auth";
import Navbar from "@/components/navbar";
import Link from "next/link";

export default async function MyTicketsPage() {
  const session = await auth();

  // DEBUG: Check terminal logs to see what the server sees
  console.log("SESSION STATUS:", session?.user ? "Logged In" : "Logged Out");
  console.log("USER ID:", session?.user?.id);

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/mytickets");
  }

  const userId = session.user.id;

  // We use leftJoin here. If it works now, it means your database records
  // had a missing link that innerJoin was hiding.
  const userTickets = await db
    .select({
      id: tickets.id,
      status: tickets.status,
      createdAt: tickets.createdAt,
      eventTitle: events.title,
      eventDate: events.startDate,
      eventLocation: events.location,
      eventSlug: events.slug,
      ticketTypeName: ticketTypes.name,
    })
    .from(tickets)
    .leftJoin(events, eq(tickets.eventId, events.id))
    .leftJoin(ticketTypes, eq(tickets.ticketTypeId, ticketTypes.id))
    .where(eq(tickets.userId, userId))
    .orderBy(desc(tickets.createdAt));

  // also show pending payments as provisional tickets
  const pendingPayments = await db
    .select({
      id: payments.id,
      createdAt: payments.createdAt,
      amount: payments.amount,
      eventTitle: events.title,
      eventDate: events.startDate,
      eventLocation: events.location,
      eventSlug: events.slug,
      ticketTypeName: ticketTypes.name,
      receiptImageUrl: payments.receiptImageUrl,
    })
    .from(payments)
    .leftJoin(events, eq(payments.eventId, events.id))
    .leftJoin(ticketTypes, eq(payments.ticketTypeId, ticketTypes.id))
    .where(and(eq(payments.userId, userId), eq(payments.status, "PENDING")))
    .orderBy(desc(payments.createdAt));

  const pendingAsTickets = pendingPayments.map((p) => ({
    id: `pending-${p.id}`,
    status: "PENDING",
    createdAt: p.createdAt,
    eventTitle: p.eventTitle,
    eventDate: p.eventDate,
    eventLocation: p.eventLocation,
    eventSlug: p.eventSlug,
    ticketTypeName: p.ticketTypeName,
    receiptImageUrl: p.receiptImageUrl,
  }));

  const combinedTickets = [...pendingAsTickets, ...userTickets].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <div className="min-h-screen pb-20 bg-background text-white">
      <Navbar />

      <main className="pt-24 px-6 max-w-5xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold mb-2">My Tickets</h1>
          <p className="text-gray-400">
            View and manage your upcoming event reservations.
          </p>
        </header>

        <div className="mb-8">
          <p className="text-gray-500 text-center max-w-xl mx-auto">
            If you've just purchased a ticket, it may take a while to appear
            here—even if you can see previous tickets. Please check back once
            your new ticket is approved.
          </p>
        </div>
        {combinedTickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/5 rounded-3xl bg-white/2">
            <div className="text-5xl mb-4">🎫</div>
            <h2 className="text-xl font-semibold mb-2">No tickets available</h2>
            <Link
              href="/events"
              className="bg-indigo-600 hover:bg-indigo-500 px-6 py-2 rounded-lg font-bold transition-colors"
            >
              Explore Events
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {combinedTickets.map((t) => (
              <div
                key={t.id}
                className="glass-card flex flex-col md:flex-row rounded-2xl border border-white/10 bg-white/5 overflow-hidden hover:border-white/20 transition-all"
              >
                {/* Status Color Strip */}
                <div
                  className={`w-full md:w-2 h-2 md:h-auto ${
                    t.status === "VALID"
                      ? "bg-green-500"
                      : t.status === "USED"
                        ? "bg-yellow-500"
                        : t.status === "PENDING"
                          ? "bg-amber-500"
                          : "bg-red-500"
                  }`}
                />

                <div className="p-6 grow flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          t.status === "VALID"
                            ? "bg-green-500/10 text-green-400"
                            : t.status === "CANCELLED"
                              ? "bg-red-500/10 text-red-400"
                              : t.status === "USED"
                                ? "bg-yellow-500/10 text-yellow-400"
                                : t.status === "PENDING"
                                  ? "bg-amber-500/10 text-amber-300"
                                  : "bg-gray-500/10 text-gray-400"
                        }`}
                      >
                        {t.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(t.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-white mb-1">
                      {t.eventTitle || "Unknown Event"}
                    </h2>
                    <p className="text-indigo-400 text-sm font-medium mb-4">
                      {t.ticketTypeName || "Standard"} Ticket
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        📅{" "}
                        {t.eventDate
                          ? new Date(t.eventDate).toLocaleDateString()
                          : "Date TBD"}
                      </span>
                      <span className="flex items-center gap-1">
                        📍 {t.eventLocation || "Location TBD"}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-white/5">
                    {t.eventSlug && (
                      <Link
                        href={`/events/${t.eventSlug}`}
                        className="flex-1 md:flex-none text-center px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-medium transition-colors"
                      >
                        Event Info
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
