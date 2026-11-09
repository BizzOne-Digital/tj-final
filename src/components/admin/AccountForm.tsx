"use client";

import { useState } from "react";
import { useToast } from "@/components/admin/Toast";
import { inputClass, primaryButton } from "@/components/admin/fields";

export function AccountForm() {
  const toast = useToast();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (next !== confirm) {
      toast.error("The new passwords do not match.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/account/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        toast.error(json.error ?? "Could not change password.");
        return;
      }
      toast.success("Password changed.");
      setCurrent("");
      setNext("");
      setConfirm("");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="max-w-md space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold">Change password</h2>
      <label className="block text-sm font-medium text-slate-800">
        Current password
        <input type="password" autoComplete="current-password" className={inputClass} value={current} onChange={(e) => setCurrent(e.target.value)} required />
      </label>
      <label className="block text-sm font-medium text-slate-800">
        New password (at least 8 characters)
        <input type="password" autoComplete="new-password" className={inputClass} value={next} onChange={(e) => setNext(e.target.value)} required minLength={8} />
      </label>
      <label className="block text-sm font-medium text-slate-800">
        Confirm new password
        <input type="password" autoComplete="new-password" className={inputClass} value={confirm} onChange={(e) => setConfirm(e.target.value)} required minLength={8} />
      </label>
      <button type="submit" className={primaryButton} disabled={saving}>
        {saving ? "Saving…" : "Change password"}
      </button>
    </form>
  );
}
