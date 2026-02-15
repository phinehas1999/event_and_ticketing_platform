import Link from "next/link";
import { requireAdmin } from "@/lib/guards";
import { db } from "@/db";
import { events } from "@/db/schema/events";
import { users } from "@/db/schema/users";
import { eq, desc } from "drizzle-orm";
import AdminEventRow from "@/components/admin-event-row";

export default async function AdminEventsPage() {
  await requireAdmin();

  const rows = await db
    .select({ event: events, organizer: users })
    .from(events)
    .leftJoin(users, eq(events.organizerId, users.id))
    .orderBy(desc(events.createdAt));

  return (
    <div className="min-h-screen pb-20 bg-background text-white">
      <main className="pt-24 px-6 max-w-5xl mx-auto">
        <header className="mb-8">
          <Link
            href="/admin"
            className="inline-flex items-center text-sm text-indigo-400 hover:text-indigo-300 mb-2"
          >
            ← Back to dashboard
          </Link>

          <h1 className="text-3xl font-bold">Event Management</h1>
          <p className="text-gray-400">
            Create, edit, publish and unpublish events.
          </p>
        </header>

        <div className="mb-6">
          <Link
            href="/admin/events/new"
            className="inline-block bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-md font-medium"
          >
            + Create Event
          </Link>
        </div>

        <div className="grid gap-4">
          {rows.map((r: any) => (
            <AdminEventRow
              key={r.event.id}
              id={r.event.id}
              title={r.event.title}
              status={r.event.status}
              organizerName={r.organizer?.name}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
