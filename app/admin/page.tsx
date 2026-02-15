import { requireAdmin } from "@/lib/guards";
import Navbar from "@/components/navbar";
import Link from "next/link";
import { db } from "@/db";
import { events, users, payments } from "@/db/schema";
import { sql, desc } from "drizzle-orm";
import { CalendarDays, Users, CreditCard, Clock, Plus } from "lucide-react";
import { StatCard } from "@/app/organizer/dashboard/components/stat-card";

async function getAdminStats() {
  const totalEventsRes = await db
    .select({ cnt: sql<number>`count(*)` })
    .from(events);
  const totalEvents = Number((totalEventsRes as any)[0]?.cnt ?? 0);

  // Count only regular users (exclude organizers/admin/support)
  const totalUsersRes = await db
    .select({ cnt: sql<number>`count(*)` })
    .from(users)
    .where(sql`role = 'USER'`);
  const totalUsers = Number((totalUsersRes as any)[0]?.cnt ?? 0);

  const totalOrganizersRes = await db
    .select({ cnt: sql<number>`count(*)` })
    .from(users)
    .where(sql`role = 'ORGANIZER'`);
  const totalOrganizers = Number((totalOrganizersRes as any)[0]?.cnt ?? 0);

  const revenueRes = await db
    .select({ rev: sql<number>`coalesce(sum(${payments.amount}), 0)` })
    .from(payments)
    .where(sql`status = 'APPROVED'`);
  const revenue = Number((revenueRes as any)[0]?.rev ?? 0);

  const pendingPaymentsRes = await db
    .select({ cnt: sql<number>`count(*)` })
    .from(payments)
    .where(sql`status = 'PENDING'`);
  const pendingPayments = Number((pendingPaymentsRes as any)[0]?.cnt ?? 0);

  const recentEvents = await db
    .select({ id: events.id, title: events.title, status: events.status })
    .from(events)
    .orderBy(desc(events.createdAt))
    .limit(5);

  return {
    totalEvents,
    totalUsers,
    totalOrganizers,
    revenue,
    pendingPayments,
    recentEvents,
  };
}

export default async function AdminPage() {
  await requireAdmin();

  const stats = await getAdminStats();

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-ET", {
      style: "currency",
      currency: "ETB",
    }).format(amount / 100);

  return (
    <>
      <Navbar />
      <main className="min-h-screen p-8 pt-24 space-y-8 text-slate-50">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-indigo-400 to-violet-400">
              Admin Dashboard
            </h1>
            <p className="text-slate-400 mt-1">Administrator control panel.</p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/admin/events/new"
              className="glass-button flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-indigo-300 hover:text-white group"
            >
              <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Create Event
            </Link>
            <Link
              href="/admin/users"
              className="glass-button flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-indigo-300 hover:text-white group"
            >
              <Users className="w-4 h-4" />
              Users
            </Link>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Events"
            value={stats.totalEvents.toString()}
            icon={<CalendarDays className="w-6 h-6 text-indigo-400" />}
            cta={
              <Link
                href="/admin/events"
                className="text-sm text-indigo-300 hover:text-white"
              >
                View events
              </Link>
            }
          />
          <StatCard
            title="Total Users"
            value={stats.totalUsers.toString()}
            icon={<Users className="w-6 h-6 text-blue-400" />}
            cta={
              <Link
                href="/admin/users"
                className="text-sm text-indigo-300 hover:text-white"
              >
                View users
              </Link>
            }
          />
          <StatCard
            title="Total Organizers"
            value={stats.totalOrganizers.toString()}
            icon={<Users className="w-6 h-6 text-emerald-400" />}
            cta={
              <Link
                href="/admin/organizers"
                className="text-sm text-indigo-300 hover:text-white"
              >
                View organizers
              </Link>
            }
          />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-indigo-400" />
                Recent Events
              </h2>
              <Link
                href="/admin/events"
                className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                View All
              </Link>
            </div>

            <div className="glass-card rounded-2xl overflow-hidden p-1">
              <div className="p-4">
                {stats.recentEvents.length === 0 ? (
                  <p className="text-gray-400">No events yet.</p>
                ) : (
                  <ul className="space-y-3">
                    {stats.recentEvents.map((e: any) => (
                      <li
                        key={e.id}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <div className="font-medium">{e.title}</div>
                          <div className="text-xs text-gray-400">
                            Status: {e.status}
                          </div>
                        </div>
                        <Link
                          href={`/admin/events/${e.id}`}
                          className="text-sm text-indigo-300"
                        >
                          Edit
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-indigo-400" />
              Financials
            </h2>
            <div className="glass-card rounded-2xl p-6 h-fit">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">Total Revenue</div>
                  <div className="font-bold">
                    {formatCurrency(stats.revenue)}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">Pending Payments</div>
                  <div className="font-bold">{stats.pendingPayments}</div>
                </div>
                <div className="pt-2">
                  <Link
                    href="/admin/payments"
                    className="text-sm text-indigo-400"
                  >
                    Review Payments
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
