"use client";

import { useSession, signOut } from "next-auth/react";

import Link from "next/link";
import { Ticket } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-lg sm:text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-indigo-400 to-pink-400"
        >
          EventFlow
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/events"
            className="text-sm font-medium hover:text-indigo-400 transition-colors flex items-center gap-1"
          >
            Explore
          </Link>
          <Link
            href="/mytickets"
            className="hover:text-indigo-400 transition-colors flex items-center gap-1"
            title="My Tickets"
          >
            <Ticket className="w-5 h-5" />
          </Link>
          <div className="h-4 w-px bg-white/10" />
          {isLoggedIn ? (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="glass-button px-4 py-2 rounded-full text-sm font-semibold text-indigo-300"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium hover:text-white/80"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="glass-button px-4 py-2 rounded-full text-sm font-semibold text-indigo-300"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
