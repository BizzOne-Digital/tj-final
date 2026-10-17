"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export function LoginForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
      callbackUrl,
    });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password.");
      return;
    }
    window.location.href = callbackUrl;
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
      <input name="email" type="email" required className="input" placeholder="Email" />
      <input name="password" type="password" required className="input" placeholder="Password" />
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-royal-blue py-3 font-semibold text-white"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
      {error && <p className="text-sm text-red-300">{error}</p>}
    </form>
  );
}
