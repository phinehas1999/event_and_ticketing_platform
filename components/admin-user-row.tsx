"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminUserRow({ user }: any) {
  const router = useRouter();
  const [role, setRole] = useState(user.role || "USER");
  const [loading, setLoading] = useState(false);

  async function updateRole(newRole: string) {
    setLoading(true);
    const res = await fetch(`/api/admin/users/${user.id}/role`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    setLoading(false);
    if (res.ok) {
      setRole(newRole);
      router.refresh();
    } else {
      alert("Could not update role");
    }
  }

  return (
    <div className="p-4 rounded-xl bg-white/3 border border-white/6 flex items-center justify-between">
      <div>
        <div className="font-semibold">{user.name || user.email}</div>
        <div className="text-xs text-gray-400">{user.email}</div>
      </div>

      <div className="flex items-center gap-3">
        <select
          value={role}
          onChange={(e) => updateRole(e.target.value)}
          disabled={loading}
          className="bg-white/5 px-2 py-1 rounded"
        >
          <option value="USER">USER</option>
          <option value="ORGANIZER">ORGANIZER</option>
          <option value="ADMIN">ADMIN</option>
          <option value="SUPPORT">SUPPORT</option>
        </select>
      </div>
    </div>
  );
}
