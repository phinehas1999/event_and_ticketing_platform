"use client";
import Navbar from "@/components/navbar";
import EventCard from "@/components/event-card";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { fetchEvents, Event } from "@/lib/api";

const CITIES = ["All", "Addis Ababa", "Adama", "Bahir Dar", "Hawassa", "Mekelle", "Dire Dawa"];

export default function EventsPage() {
  const { data: session } = useSession();
  const user = session?.user;
  
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCity, setActiveCity] = useState("All");

  useEffect(() => {
    fetchEvents()
      .then(setEvents)
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = activeCity === "All" || 
      event.location.toLowerCase().includes(activeCity.toLowerCase());
    
    return matchesSearch && matchesCity;
  });

  return (
    <div className="min-h-screen pb-20 bg-background text-white">
      <Navbar />
      <div className="pt-24 px-6 max-w-7xl mx-auto">
        {user && (
          <div className="mb-6 text-lg font-medium">
            Hi, {user.name} <span className="text-gray-400">({user.email})</span>
          </div>
        )}

        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Explore Events</h1>
          <p className="text-gray-400">Find events happening in your city.</p>
        </div>

        <div className="space-y-6 mb-12">
          <div className="relative max-w-md">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Search by event name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-white/10 bg-white/5 text-sm focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Filter by City</span>
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
              {CITIES.map((city) => (
                <button
                  key={city}
                  onClick={() => setActiveCity(city)}
                  className={`whitespace-nowrap px-6 py-2 rounded-xl text-sm font-medium border transition-all ${
                    activeCity === city
                      ? "bg-white text-black border-white shadow-lg shadow-white/10"
                      : "bg-white/5 text-gray-400 border-white/5 hover:border-white/20 hover:bg-white/10"
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-20 text-gray-500 animate-pulse">Loading events...</div>
          ) : filteredEvents.length > 0 ? (
            filteredEvents.map((event) => <EventCard key={event.id} event={event} />)
          ) : (
            <div className="col-span-full text-center py-20 bg-white/2 rounded-3xl border border-dashed border-white/5">
              <p className="text-gray-500">No events found matching your criteria.</p>
              <button 
                onClick={() => {setSearchTerm(""); setActiveCity("All");}}
                className="mt-4 text-indigo-400 text-sm hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}