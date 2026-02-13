import Link from "next/link";
import { MoreHorizontal, Edit, Eye } from "lucide-react";

// Helper to color code statuses
const statusColors = {
  DRAFT: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  PENDING: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  PUBLISHED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  CANCELLED: "bg-red-500/10 text-red-400 border-red-500/20",
};

export function EventsTable({ events }: { events: any[] }) {
  if (events.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400">
        You haven't created any events yet.
      </div>
    );
  }

  return (
    <table className="w-full text-left text-sm">
      <thead className="bg-slate-900/50 text-slate-400 uppercase text-xs font-semibold">
        <tr>
          <th className="px-6 py-4">Event Name</th>
          <th className="px-6 py-4">Date</th>
          <th className="px-6 py-4">Location</th>
          <th className="px-6 py-4">Status</th>
          <th className="px-6 py-4 text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-800">
        {events.map((event) => (
          <tr key={event.id} className="hover:bg-slate-800/30 transition-colors">
            <td className="px-6 py-4 font-medium text-slate-200">
              {event.title}
            </td>
            <td className="px-6 py-4 text-slate-400">
              {new Date(event.startDate).toLocaleDateString()}
            </td>
            <td className="px-6 py-4 text-slate-400">
              {event.location}
            </td>
            <td className="px-6 py-4">
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[event.status as keyof typeof statusColors]}`}>
                {event.status}
              </span>
            </td>
            <td className="px-6 py-4 text-right">
              <div className="flex items-center justify-end gap-2">
                <Link href={`/organizer/events/${event.id}/edit`} className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors">
                  <Edit className="w-4 h-4" />
                </Link>
                <Link href={`/events/${event.slug}`} className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors">
                  <Eye className="w-4 h-4" />
                </Link>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}