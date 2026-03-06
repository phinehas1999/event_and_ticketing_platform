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
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-indigo-500/30">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-neutral-950 to-neutral-950" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-8">
              <span className="text-xs font-medium text-indigo-300 tracking-wide uppercase">
                Now Live in Ethiopia
              </span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
              Ticket your next <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                experience.
              </span>
            </h1>

            <p className="text-lg text-neutral-400 max-w-xl mb-10 leading-relaxed">
              A professional platform for organizers and attendees. Secure
              payments, instant QR delivery, and real-time analytics for events
              of any scale.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/events"
                className="bg-white text-neutral-950 px-8 py-4 rounded-lg font-bold transition-transform hover:-translate-y-0.5"
              >
                Browse Events
              </Link>
              <Link
                href="/signup"
                className="px-8 py-4 rounded-lg font-semibold text-white border border-white/10 hover:bg-white/5 transition-colors"
              >
                Start Organizing
              </Link>
            </div>
          </div>

          {/* Visual Element - Tilted Cards */}
          <div className="relative h-[600px] hidden lg:block w-full">
            {/* Decorative glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px]" />

            {/* Floating Elements Container */}
            <div className="relative w-full h-full perspective-distant">
              {/* Back Card (Ghost) */}
              <div className="absolute top-12 right-12 w-80 h-[28rem] bg-indigo-900/10 rounded-3xl border border-white/5 -rotate-6 backdrop-blur-sm" />

              {/* Middle Card (Secondary) */}
              <div className="absolute top-20 right-28 w-80 h-[28rem] bg-gray-900/40 rounded-3xl border border-white/10 -rotate-3 backdrop-blur-md shadow-2xl" />

              {/* Front Main Card (Hero) */}
              <div className="absolute top-28 right-44 w-80 h-[28rem] bg-neutral-900 rounded-3xl border border-white/10 shadow-2xl z-20 overflow-hidden flex flex-col transform hover:-translate-y-2 transition-all duration-500 hover:shadow-indigo-500/20">
                {/* Image Area Placeholder */}
                <div className="h-3/5 w-full bg-gradient-to-br from-indigo-600 to-purple-700 relative p-6 flex flex-col justify-end">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                  <div className="relative z-10">
                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-medium text-white border border-white/20 mb-3">
                      Up Next
                    </span>
                    <h3 className="text-2xl font-bold text-white leading-tight">
                      Afro Jazz Festival 2026
                    </h3>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-6 flex-1 flex flex-col justify-between bg-neutral-900">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <div className="w-4 h-4 rounded-full bg-gray-700" />
                      <span>Ghion Hotel, Addis Ababa</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <div className="w-4 h-4 rounded-full bg-gray-700" />
                      <span>Mar 12 • 6:00 PM</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className={`w-8 h-8 rounded-full border-2 border-black bg-gray-${800 - i * 100}`}
                        />
                      ))}
                    </div>
                    <div className="text-right">
                      <p className="text-indigo-400 font-bold text-lg">
                        500 ETB
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Ticket Stub */}
              <div className="absolute top-64 -right-4 w-48 h-24 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl z-30 shadow-xl rotate-12 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-xs text-gray-400 uppercase tracking-widest">
                    TICKET
                  </p>
                  <p className="text-white font-mono text-lg tracking-widest">
                    #A4-992
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats / Trust Banner */}
      <section className="border-b border-white/5 py-12 bg-neutral-900/30">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-between gap-8 text-center md:text-left">
          <div>
            <p className="text-3xl font-bold text-white">100%</p>
            <p className="text-neutral-500 text-sm uppercase tracking-wider mt-1">
              Secure Payments
            </p>
          </div>
          <div>
            <p className="text-3xl font-bold text-white">Instant</p>
            <p className="text-neutral-500 text-sm uppercase tracking-wider mt-1">
              Ticket Delivery
            </p>
          </div>
          <div>
            <p className="text-3xl font-bold text-white">24/7</p>
            <p className="text-neutral-500 text-sm uppercase tracking-wider mt-1">
              Customer Support
            </p>
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">Trending Events</h2>
            <p className="text-neutral-400">
              Don't miss out on what's happening now.
            </p>
          </div>
          <Link
            href="/events"
            className="text-indigo-400 hover:text-indigo-300 font-medium text-sm border-b border-indigo-400/0 hover:border-indigo-400 transition-all"
          >
            View all events
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            [1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[400px] bg-white/5 rounded-xl animate-pulse"
              />
            ))
          ) : featuredEvents.length > 0 ? (
            featuredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-neutral-500 bg-white/5 rounded-xl border border-white/5">
              <p>No featured events found at the moment.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
