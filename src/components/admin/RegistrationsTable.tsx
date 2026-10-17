"use client";

import { useEffect, useState } from "react";

export function RegistrationsTable() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    fetch("/api/admin/registrations")
      .then((r) => r.json())
      .then(setItems);
  }, []);

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/admin/registrations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const refreshed = await fetch("/api/admin/registrations").then((r) => r.json());
    setItems(refreshed);
  }

  return (
    <table className="mt-6 w-full text-left text-sm">
      <thead>
        <tr className="border-b">
          <th className="py-2">School</th>
          <th>Contact</th>
          <th>Status</th>
          <th>Total</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {items.map((r) => {
          const snap = r.priceSnapshot as { totalCents?: number } | undefined;
          return (
            <tr key={String(r._id)} className="border-b">
              <td className="py-2">{String(r.schoolName)}</td>
              <td>{String(r.contactEmail)}</td>
              <td>{String(r.status)}</td>
              <td>${((snap?.totalCents ?? 0) / 100).toFixed(0)}</td>
              <td>
                <button
                  type="button"
                  className="text-blue-600"
                  onClick={() => updateStatus(String(r._id), "accepted")}
                >
                  Accept
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
