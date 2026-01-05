import { requireAdmin } from "@/lib/guards";

export default async function AdminPage() {
  await requireAdmin();

  return (
    <main style={{ padding: 32 }}>
      <h1>Admin Panel</h1>

      <ul>
        <li>Approve events</li>
        <li>Approve payments</li>
        <li>Manage users</li>
      </ul>
    </main>
  );
}
