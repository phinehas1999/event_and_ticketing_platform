import { requireAuth } from "@/lib/guards";

export default async function DashboardPage() {
  const session = await requireAuth();

  return (
    <main style={{ padding: 32 }}>
      <h1>User Dashboard</h1>
      <p>Welcome, {session.user.email}</p>
      {session.user.role}

      <ul>
        <li>Your tickets</li>
        <li>Payment requests</li>
      </ul>
    </main>
  );
}
