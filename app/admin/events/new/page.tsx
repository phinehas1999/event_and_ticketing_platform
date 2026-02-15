import { requireAdmin } from "@/lib/guards";
import Navbar from "@/components/navbar";
import AdminCreateEventForm from "@/components/admin-create-event-form";
import { db } from "@/db";
import { users } from "@/db/schema/users";
import { bankAccounts } from "@/db/schema/bankAccounts";
import { desc, sql } from "drizzle-orm";

export default async function AdminCreateEventPage() {
  await requireAdmin();

  // fetch organizers and bank accounts for selection
  const organizers = await db
    .select({ id: users.id, name: users.name, email: users.email })
    .from(users)
    .where(sql`role = 'ORGANIZER'`)
    .orderBy(desc(users.createdAt));

  const accounts = await db
    .select()
    .from(bankAccounts)
    .orderBy(desc(bankAccounts.createdAt));

  return (
    <div className="min-h-screen pb-20 bg-background text-white">
      <Navbar />

      <main className="pt-24 px-6 max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Create New Event (Admin)</h1>
          <p className="text-gray-400">
            Create an event on behalf of an organizer.
          </p>
        </header>

        <AdminCreateEventForm organizers={organizers} bankAccounts={accounts} />
      </main>
    </div>
  );
}
