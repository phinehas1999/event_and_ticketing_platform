import { requireOrganizer } from "@/lib/guards";

export default async function OrganizerDashboardPage() {
  const session = await requireOrganizer();

  return (
    <main style={{ padding: 32 }}>
      <h1>Organizer Dashboard</h1>
      <p>Welcome, {session.user.name} ({session.user.email})</p>
      <p>Role: {session.user.role}</p>

      <ul>
        <li>Your events</li>
        <li>Ticket types</li>
        <li>Attendees</li>
      </ul>
    </main>
  );
}
