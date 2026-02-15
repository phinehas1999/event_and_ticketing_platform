"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import Link from "next/link";

type BankAccount = {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  organizerId: string;
};

export default function AdminEditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = useMemo(() => {
    const id = params?.id;
    return Array.isArray(id) ? id[0] : id;
  }, [params]);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [bankAccountId, setBankAccountId] = useState<string | null>(null);
  const [organizerId, setOrganizerId] = useState<string | null>(null);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [organizers, setOrganizers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function formatDateTimeLocal(value?: string | null) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    const offsetMinutes = date.getTimezoneOffset();
    const local = new Date(date.getTime() - offsetMinutes * 60 * 1000);
    return local.toISOString().slice(0, 16);
  }

  useEffect(() => {
    if (!eventId) {
      setLoadingEvent(false);
      return;
    }

    setLoadingEvent(true);
    fetch(`/api/admin/events/${eventId}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data || data.error)
          throw new Error(data?.error || "Failed to load event");
        const event = data;
        setTitle(event.title || "");
        setSlug(event.slug || "");
        setDescription(event.description || "");
        setStartDate(formatDateTimeLocal(event.startDate));
        setEndDate(formatDateTimeLocal(event.endDate));
        setLocation(event.location || "");
        setCoverImageUrl(event.coverImageUrl || "");
        setBankAccountId(event.bankAccountId || null);
        setOrganizerId(event.organizerId || null);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoadingEvent(false));
  }, [eventId]);

  useEffect(() => {
    fetch("/api/admin/organizers")
      .then((r) => r.json())
      .then((data) => setOrganizers(data || []))
      .catch(() => setOrganizers([]));

    fetch("/api/admin/bank-accounts")
      .then((r) => r.json())
      .then((data) => setBankAccounts(data || []))
      .catch(() => setBankAccounts([]));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (
      !title ||
      !slug ||
      !startDate ||
      !endDate ||
      !location ||
      !bankAccountId ||
      !organizerId
    ) {
      setError("Please fill required fields");
      return;
    }

    if (!eventId) {
      setError("Missing event id");
      return;
    }

    setLoading(true);

    const res = await fetch(`/api/admin/events/${eventId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        slug,
        description,
        startDate,
        endDate,
        location,
        coverImageUrl,
        bankAccountId,
        organizerId,
      }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body?.error || "Failed to update event");
      setLoading(false);
      return;
    }

    router.push("/admin/events");
  }

  const filteredAccounts = bankAccounts.filter(
    (b) => b.organizerId === organizerId,
  );

  return (
    <div className="min-h-screen pb-20 bg-background text-white">
      <Navbar />

      <main className="pt-24 px-6 max-w-3xl mx-auto">
        <header className="mb-8">
          <Link
            href="/admin/events"
            className="inline-flex items-center text-sm text-indigo-400 hover:text-indigo-300 mb-2"
          >
            ← Back to events
          </Link>

          <h1 className="text-3xl font-bold">Edit Event (Admin)</h1>
          <p className="text-gray-400">
            Update event details and organizer assignment.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="glass-card p-6 rounded-2xl space-y-6 border border-white/10"
        >
          {error && (
            <div className="text-red-400 bg-red-500/10 p-3 rounded">
              {error}
            </div>
          )}

          {loadingEvent ? (
            <div className="text-gray-400">Loading event...</div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Organizer
                </label>
                <select
                  value={organizerId ?? ""}
                  onChange={(e) => setOrganizerId(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                  required
                >
                  <option value="">Select organizer</option>
                  {organizers.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name || o.email}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Title
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Slug (url)
                </label>
                <input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                  placeholder="my-event-2026"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                  rows={6}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Start Date
                  </label>
                  <input
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    End Date
                  </label>
                  <input
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Location
                </label>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Cover Image URL
                </label>
                <input
                  value={coverImageUrl}
                  onChange={(e) => setCoverImageUrl(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Bank Account
                </label>
                <select
                  value={bankAccountId ?? ""}
                  onChange={(e) => setBankAccountId(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                  required
                >
                  <option value="">Select account</option>
                  {filteredAccounts.length > 0
                    ? filteredAccounts.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.bankName} — {b.accountNumber} ({b.accountHolder})
                        </option>
                      ))
                    : bankAccounts.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.bankName} — {b.accountNumber} ({b.accountHolder})
                        </option>
                      ))}
                </select>
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-xl"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/admin/events")}
                  className="text-sm text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </form>
      </main>
    </div>
  );
}
