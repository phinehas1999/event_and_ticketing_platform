"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminCreateEventForm({
  organizers,
  bankAccounts,
}: any) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [organizerId, setOrganizerId] = useState(organizers?.[0]?.id ?? "");
  const [bankAccountId, setBankAccountId] = useState(
    bankAccounts?.[0]?.id ?? "",
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (organizers?.length && !organizerId) setOrganizerId(organizers[0].id);
    if (bankAccounts?.length && !bankAccountId)
      setBankAccountId(bankAccounts[0].id);
  }, [organizers, bankAccounts]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (
      !title ||
      !slug ||
      !startDate ||
      !endDate ||
      !location ||
      !organizerId ||
      !bankAccountId
    ) {
      setError("Please fill required fields");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/admin/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        slug,
        description,
        startDate,
        endDate,
        location,
        coverImageUrl,
        organizerId,
        bankAccountId,
      }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body?.error || "Failed to create event");
      setLoading(false);
      return;
    }

    router.push("/admin/events");
  }

  // filter bank accounts for selected organizer
  const filteredAccounts = (bankAccounts || []).filter(
    (b: any) => b.organizerId === organizerId,
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card p-6 rounded-2xl space-y-6 border border-white/10"
    >
      {error && (
        <div className="text-red-400 bg-red-500/10 p-3 rounded">{error}</div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Organizer
        </label>
        <select
          value={organizerId}
          onChange={(e) => setOrganizerId(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
        >
          {organizers.map((o: any) => (
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
          value={bankAccountId}
          onChange={(e) => setBankAccountId(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
          required
        >
          <option value="">Select account</option>
          {filteredAccounts.length > 0
            ? filteredAccounts.map((b: any) => (
                <option key={b.id} value={b.id}>
                  {b.bankName} — {b.accountNumber} ({b.accountHolder})
                </option>
              ))
            : bankAccounts.map((b: any) => (
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
          {loading ? "Creating..." : "Create Event"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/events")}
          className="text-sm text-gray-400 hover:text-white"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
