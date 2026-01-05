"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      setError("Signup failed");
      setLoading(false);
      return;
    }

    router.push("/login");
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-sm border rounded-lg p-6 space-y-4"
      >
        <h1 className="text-2xl font-semibold">Create account</h1>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="space-y-1">
          <label>Name</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1">
          <label>Email</label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1">
          <label>Password</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? "Creating..." : "Sign up"}
        </button>
      </form>
    </main>
  );
}
