import { requireAdmin } from "@/lib/guards";
import Link from "next/link";
import { db } from "@/db";
import { users } from "@/db/schema/users";
import { desc, sql } from "drizzle-orm";
import AdminUserRow from "@/components/admin-user-row";

export default async function AdminOrganizersPage() {
  await requireAdmin();

  // Only select users with role = 'ORGANIZER'
  const list = await db
    .select()
    .from(users)
    .where(sql`role = 'ORGANIZER'`)
    .orderBy(desc(users.createdAt));

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

          <h1 className="text-3xl font-bold">Organizers</h1>
          <p className="text-gray-400">View and manage organizer accounts.</p>
        </header>

        <div className="grid gap-4">
          {list.map((u: any) => (
            <AdminUserRow key={u.id} user={u} />
          ))}
        </div>
      </main>
    </div>
  );
}
