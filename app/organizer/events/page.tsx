import { requireOrganizer } from "@/lib/guards";
import { db } from "@/db";
import { events } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import Navbar from "@/components/navbar";
import { EventsTable } from "../dashboard/components/events-table";

export default async function OrganizerEventsPage() {
  const session = await requireOrganizer();

  if (!session.user.id) throw new Error("Missing user id");

  const myEvents = await db
    .select()
    .from(events)
    .where(eq(events.organizerId, session.user.id))
    .orderBy(desc(events.createdAt));

  return (
    <div className="min-h-screen pb-20 bg-background text-white">
      <Navbar />

      <main className="pt-24 px-6 max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Your Events</h1>
            <p className="text-gray-400 mt-1">
              Manage events you have created.
            </p>
          </div>
        </header>

        <div className="glass-card rounded-2xl overflow-hidden p-1">
          <EventsTable events={myEvents} />
        </div>
      </main>
    </div>
  );
}
