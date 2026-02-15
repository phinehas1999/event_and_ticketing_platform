"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  slug: string;
  tickets: Array<{ id: string; name: string; price: number }>;
}

export default function ReserveForm({ slug, tickets }: Props) {
  const [ticketTypeId, setTicketTypeId] = useState(tickets?.[0]?.id || "");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!ticketTypeId) return setMessage("Select a ticket type");
    if (!file) return setMessage("Please upload a screenshot");

    setLoading(true);
    setMessage(null);

    try {
      const fd = new FormData();
      fd.append("ticketTypeId", ticketTypeId);
      fd.append("slug", slug);
      fd.append("screenshot", file);

      const res = await fetch("/api/reserve", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Upload failed");

      setMessage(
        "Reservation submitted — payment is pending organizer approval.",
      );
      // navigate to mytickets where pending payments are visible
      router.push("/mytickets");
    } catch (err: any) {
      setMessage(err?.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Select Ticket Type
        </label>
        <select
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
          value={ticketTypeId}
          onChange={(e) => setTicketTypeId(e.target.value)}
        >
          {tickets.map((t) => (
            <option key={t.id} value={t.id} className="bg-neutral-900">
              {t.name} — {(t.price / 100).toLocaleString()} ETB
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Transaction Screenshot
        </label>
        <div
          className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-indigo-500/50 transition-colors cursor-pointer"
          onClick={() => document.getElementById("screenshot-input")?.click()}
        >
          <p className="text-sm text-gray-500">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-gray-600 mt-1">PNG, JPG up to 5MB</p>
          <input
            id="screenshot-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          {file && (
            <p className="text-xs mt-2 text-gray-300">Selected: {file.name}</p>
          )}
        </div>
      </div>

      {message && <p className="text-sm text-yellow-300">{message}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-500/20"
      >
        {loading ? "Submitting..." : "Submit Reservation"}
      </button>
    </form>
  );
}
