"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminEventRow({
  id,
  title,
  status,
  organizerName,
}: any) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function togglePublish() {
    setLoading(true);
    const res = await fetch(`/api/admin/events/${id}/publish`, {
      method: "POST",
    });
    setLoading(false);
    if (res.ok) router.refresh();
    else alert("Failed to update event");
  }

  return (
    <div className="p-4 rounded-xl bg-white/3 border border-white/6 flex items-center justify-between">
      <div>
        <div className="text-sm text-gray-300">{organizerName || "—"}</div>
        <div className="font-semibold text-lg">{title}</div>
        <div className="text-xs text-gray-400 mt-1">Status: {status}</div>
      </div>

      <div className="flex items-center gap-3">
        <a
          href={`/admin/events/${id}`}
          className="px-3 py-1 bg-white/5 rounded text-sm"
        >
          Edit
        </a>
        <button
          onClick={togglePublish}
          disabled={loading}
          className="px-3 py-1 rounded text-sm bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50"
        >
          {status === "PUBLISHED" ? "Unpublish" : "Publish"}
        </button>
      </div>
    </div>
  );
}
