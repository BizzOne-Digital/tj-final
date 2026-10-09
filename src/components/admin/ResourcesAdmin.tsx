"use client";

import { useEffect, useState } from "react";

export function ResourcesAdmin() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    fetch("/api/admin/resources").then((r) => r.json()).then(setItems);
  }, []);

  async function save(id: string, patch: Record<string, unknown>) {
    await fetch("/api/admin/resources", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...patch }),
    });
    const refreshed = await fetch("/api/admin/resources").then((r) => r.json());
    setItems(refreshed);
  }

  return (
    <ul className="mt-6 space-y-4">
      {items.map((r) => (
        <li key={String(r._id)} className="rounded border border-slate-200 bg-white p-4">
          <p className="font-medium">{String(r.title)}</p>
          <input
            className="mt-2 w-full rounded border px-2 py-1 text-sm"
            defaultValue={String(r.externalUrl ?? "")}
            onBlur={(e) => save(String(r._id), { externalUrl: e.target.value })}
          />
          {(r.adminFlags as { duplicateUrlNote?: string })?.duplicateUrlNote && (
            <p className="mt-1 text-xs text-amber-600">
              {(r.adminFlags as { duplicateUrlNote?: string }).duplicateUrlNote}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
