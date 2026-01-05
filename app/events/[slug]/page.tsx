import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/navbar";
import { db } from "@/db";
import { events } from "@/db/schema/events";
import { users } from "@/db/schema/users"; 
import { ticketTypes } from "@/db/schema/tickets"; 
import { eq } from "drizzle-orm";
import { auth } from "@/auth";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function EventDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const session = await auth();
  const isLoggedIn = !!session?.user;

  const eventWithOrganizer = await db
    .select({
      event: events,
      organizerName: users.name,
    })
    .from(events)
    .leftJoin(users, eq(events.organizerId, users.id))
    .where(eq(events.slug, slug))
    .then((res) => res[0]);

  if (!eventWithOrganizer) {
    notFound();
  }

  const { event, organizerName } = eventWithOrganizer;

  const ticketsForEvent = await db
    .select()
    .from(ticketTypes)
    .where(eq(ticketTypes.eventId, event.id));

  const startDate = new Date(event.startDate);

  return (
    <div className="min-h-screen pb-20">
      <Navbar />
      <div className="relative h-[50vh] w-full">
        <div className="absolute inset-0 bg-linear-to-t from-background to-transparent z-10" />
        <img 
          src={event.coverImageUrl || "/placeholder.jpg"} 
          alt={event.title} 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute bottom-0 left-0 w-full z-20 px-6 pb-12">
          <div className="max-w-4xl mx-auto">
             <span className="inline-block px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-bold rounded-lg mb-4 border border-indigo-500/30">
                {event.status}
             </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{event.title}</h1>
            <div className="flex flex-wrap items-center gap-6 text-gray-300">
              <div className="flex items-center gap-2"><span>📅</span>{startDate.toLocaleDateString()}</div>
              <div className="flex items-center gap-2"><span>📍</span>{event.location}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 grid md:grid-cols-3 gap-12 mt-8">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-4">About the Event</h2>
          <p className="text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">{event.description}</p>
          
          <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="font-semibold text-white mb-4">Organizer</h3>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                {organizerName?.charAt(0) || "O"}
              </div>
              <div>
                <p className="text-white font-medium text-lg">{organizerName || "Unknown Organizer"}</p>
                <p className="text-sm text-gray-500">Verified Host</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="sticky top-24">
            <div className="glass-card p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
              <h3 className="text-xl font-bold mb-6">Tickets</h3>
              <div className="space-y-4 mb-8">
                {ticketsForEvent.map((ticket) => (
                  <div key={ticket.id} className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5">
                    <div>
                      <p className="text-gray-300 font-medium">{ticket.name}</p>
                      <p className="text-xs text-gray-500">{ticket.quantityTotal - (ticket.quantitySold ?? 0)} left</p>
                    </div>
                    <span className="font-semibold text-white">{(ticket.price / 100).toLocaleString()} ETB</span>
                  </div>
                ))}
              </div>

              <div className="text-center">
                {isLoggedIn ? (
                  <Link 
                    href={`/reserve/${event.slug}`} 
                    className="block w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-500 transition-colors text-center"
                  >
                    Reserve Now
                  </Link>
                ) : (
                  <>
                    <p className="text-sm text-gray-400 mb-3">Log in or sign up to reserve your spot.</p>
                    <Link 
                      href={`/signup?redirect=/events/${event.slug}`} 
                      className="block w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors text-center"
                    >
                      Sign up to Reserve
                    </Link>
                    <div className="mt-3">
                        <Link href="/login" className="text-sm text-indigo-400 hover:text-indigo-300">
                            Already have an account? Log in
                        </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}