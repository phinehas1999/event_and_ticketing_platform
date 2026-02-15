import { requireAdmin } from "@/lib/guards";
import { db } from "@/db";
import { users } from "@/db/schema/users";
import { desc } from "drizzle-orm";
import AdminUserRow from "@/components/admin-user-row";

export default async function AdminUsersPage() {
  await requireAdmin();

  const list = await db.select().from(users).orderBy(desc(users.createdAt));

  return (
    <div className="min-h-screen pb-20 bg-background text-white">
      <main className="pt-24 px-6 max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-gray-400">
            View and edit user profiles and roles.
          </p>
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
