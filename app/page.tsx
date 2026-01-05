"use client";
import Link from "next/link";
import Navbar from "@/components/navbar";
import EventCard from "@/components/event-card";
import { useEffect, useState } from "react";
import { fetchEvents, Event } from "@/lib/api";

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents()
      .then(setEvents)
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  const featuredEvents = events.slice(0, 3);

  return (
    <div className="min-h-screen pb-20">
      <Navbar />

      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[128px]" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-medium text-gray-300">
              Live Ticketing Platform
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Discover <span className="text-indigo-400">Events</span>. <br />
            Create <span className="text-secondary">Memories</span>.
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            The easiest way to organize experiences and buy tickets in Ethiopia.
            Secure payments, instant delivery.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link
              href="/events"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-semibold transition-all hover:scale-105"
            >
              Browse Events
            </Link>
            <Link
              href="/signup"
              className="glass-button px-8 py-3 rounded-full font-semibold text-white hover:scale-105"
            >
              Start Organizing
            </Link>
          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-6 mt-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Trending Now</h2>
          <Link
            href="/events"
            className="text-indigo-400 hover:text-indigo-300"
          >
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="text-white">Loading events...</div>
          ) : featuredEvents.length > 0 ? (
            featuredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))
          ) : (
            <div className="text-white">No featured events found.</div>
          )}
        </div>
      </section>
    </div>
  );
}
