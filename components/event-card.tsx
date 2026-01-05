import Link from "next/link";
import { Event } from "@/lib/api";

export default function EventCard({ event }: { event: Event }) {
  const date = new Date(event.startDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <Link href={`/events/${event.slug}`} className="group">
      <div className="glass-card rounded-2xl overflow-hidden h-full flex flex-col transition-transform group-hover:-translate-y-1">
        <div className="relative h-48 w-full overflow-hidden">
          <img 
            src={event.coverImageUrl || "/placeholder-event.jpg"} 
            alt={event.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10">
            <span className="text-white font-bold text-sm">{date}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col grow">
          <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">
            {event.title}
          </h3>
          <p className="text-gray-400 text-sm mb-4 line-clamp-1">
            {event.location}
          </p>

          <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
            <span className="text-indigo-400 text-sm font-medium">
              View Details
            </span>
            <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
              →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
