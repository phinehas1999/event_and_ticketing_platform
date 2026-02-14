// src/app/organizer/dashboard/page.tsx
import { requireOrganizer } from "@/lib/guards";
import { db } from "@/db"; // Assuming your db instance export
import { events, tickets, ticketTypes, payments } from "@/db/schema";
import { eq, desc, and, sql, inArray } from "drizzle-orm";
import Link from "next/link";
import {
  CalendarDays,
  Ticket,
  CreditCard,
  Plus,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import { StatCard } from "./components/stat-card";
import { EventsTable } from "./components/events-table";
import { PendingPaymentsList } from "./components/pending-payments";
import Navbar from "@/components/navbar";

async function getOrganizerStats(userId: string) {
  // 1. Fetch all events for this organizer
  const myEvents = await db
    .select()
    .from(events)
    .where(eq(events.organizerId, userId))
    .orderBy(desc(events.createdAt));

  const eventIds = myEvents.map((e) => e.id);

  // 2. If no events, return empty stats
  if (eventIds.length === 0) {
    return {
      events: [],
      stats: { revenue: 0, ticketsSold: 0, pendingPayments: 0 },
      recentPayments: [],
    };
  }

  // 3. Fetch Ticket Stats (Total Sold)
  const ticketStats = await db
    .select({
      sold: sql<number>`sum(${ticketTypes.quantitySold})`,
      revenue: sql<number>`sum(${ticketTypes.quantitySold} * ${ticketTypes.price})`,
    })
    .from(ticketTypes)
    .where(inArray(ticketTypes.eventId, eventIds));

  // 4. Fetch Pending Payments (Bank Transfers needing review)
  const pendingPayments = await db
    .select({
      id: payments.id,
      amount: payments.amount,
      userName: sql<string>`(SELECT name FROM users WHERE users.id = ${payments.userId})`,
      eventName: sql<string>`(SELECT title FROM events WHERE events.id = ${payments.eventId})`,
      createdAt: payments.createdAt,
    })
    .from(payments)
    .where(
      and(inArray(payments.eventId, eventIds), eq(payments.status, "PENDING")),
    )
    .limit(5);

  return {
    events: myEvents,
    stats: {
      revenue: ticketStats[0]?.revenue || 0,
      ticketsSold: ticketStats[0]?.sold || 0,
      pendingPayments: pendingPayments.length,
    },
    recentPayments: pendingPayments,
  };
}

export default async function OrganizerDashboardPage() {
  const session = await requireOrganizer();
  if (!session.user.id) {
    throw new Error("User ID is missing from session.");
  }
  const data = await getOrganizerStats(session.user.id);

  // Formatter for currency (ETB)
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-ET", {
      style: "currency",
      currency: "ETB",
    }).format(amount / 100);

  return (
    <>
      <Navbar />
      <main className="min-h-screen p-8 pt-24 space-y-8 text-slate-50">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-indigo-400 to-violet-400">
              Organizer Dashboard
            </h1>
            <p className="text-slate-400 mt-1">
              Welcome back, {session.user.name}. Here's what's happening with
              your events.
            </p>
          </div>
          <Link
            href="/organizer/events/new"
            className="glass-button flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-indigo-300 hover:text-white group"
          >
            <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Create New Event
          </Link>
        </header>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Revenue"
            value={formatCurrency(data.stats.revenue)}
            icon={<CreditCard className="w-6 h-6 text-emerald-400" />}
            trend="+12% from last month"
          />
          <Link href="/organizer/events/sales" className="group">
            <StatCard
              title="Tickets Sold"
              value={data.stats.ticketsSold.toString()}
              icon={<Ticket className="w-6 h-6 text-blue-400" />}
              cta={
                <span className="text-sm text-indigo-300 hover:text-white flex items-center gap-1">
                  View more
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              }
            />
          </Link>
          <StatCard
            title="Pending Approvals"
            value={data.stats.pendingPayments.toString()}
            icon={<Clock className="w-6 h-6 text-amber-400" />}
            alert={data.stats.pendingPayments > 0}
          />
        </section>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Events List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-indigo-400" />
                Your Events
              </h2>
              <Link
                href="/organizer/events"
                className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                View All <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="glass-card rounded-2xl overflow-hidden p-1">
              <EventsTable events={data.events} />
            </div>
          </div>

          {/* Right Column: Pending Actions */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-400" />
              Recent Payments
            </h2>
            <div className="glass-card rounded-2xl p-6 h-fit">
              <PendingPaymentsList payments={data.recentPayments} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
