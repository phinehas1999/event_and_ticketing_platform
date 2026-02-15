"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function OrganizerPaymentReview({
  paymentId,
}: {
  paymentId: string;
}) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  async function action(path: string) {
    if (!confirm("Are you sure?")) return;
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/organizer/payments/${paymentId}/${path}`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Action failed");
      setMessage(
        path === "approve" ? "Payment approved." : "Payment rejected.",
      );
      // navigate back to payments list
      router.push("/organizer/payments");
    } catch (err: any) {
      setMessage(err?.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => action("approve")}
        disabled={loading}
        className="bg-emerald-500 hover:bg-emerald-400 px-4 py-2 rounded-md font-semibold"
      >
        Approve
      </button>

      <button
        onClick={() => action("reject")}
        disabled={loading}
        className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-md font-semibold"
      >
        Reject
      </button>

      {message && <p className="text-sm text-yellow-300 ml-3">{message}</p>}
    </div>
  );
}
