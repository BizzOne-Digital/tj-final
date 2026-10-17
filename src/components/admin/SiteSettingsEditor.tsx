"use client";

import { useEffect, useState } from "react";
import { EmailSmtpPanel } from "@/components/admin/EmailSmtpPanel";

export function SiteSettingsEditor() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/site-settings")
      .then((r) => r.json())
      .then(setData);
  }, []);

  if (!data) return <p>Loading…</p>;

  const headlines = (data.headlines ?? {}) as Record<string, string>;
  const league = (data.league ?? {}) as Record<string, unknown>;
  const announcement = (data.announcement ?? {}) as Record<string, unknown>;
  const notificationEmails = Array.isArray(league.notificationEmails)
    ? (league.notificationEmails as string[]).join(", ")
    : "";

  async function save() {
    if (!data) return;
    setSaving(true);
    setMessage("");
    const headlines = (data.headlines ?? {}) as Record<string, string>;
    const league = (data.league ?? {}) as Record<string, unknown>;
    const announcement = (data.announcement ?? {}) as Record<string, unknown>;
    const emailsRaw = Array.isArray(league.notificationEmails)
      ? (league.notificationEmails as string[])
      : String(league.notificationEmails ?? "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
    const res = await fetch("/api/admin/site-settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        headlines,
        league: { ...league, notificationEmails: emailsRaw },
        announcement,
        motionIntensity: data.motionIntensity,
      }),
    });
    setSaving(false);
    setMessage(res.ok ? "Saved." : "Save failed.");
  }

  return (
    <div className="max-w-2xl space-y-4">
      <label className="block text-sm">
        Announcement bar
        <input
          className="mt-1 w-full rounded border px-3 py-2"
          value={String(announcement.text ?? "")}
          onChange={(e) =>
            setData({
              ...data,
              announcement: { ...announcement, text: e.target.value },
            })
          }
        />
      </label>
      <label className="flex gap-2 text-sm">
        <input
          type="checkbox"
          checked={Boolean(announcement.visible)}
          onChange={(e) =>
            setData({
              ...data,
              announcement: { ...announcement, visible: e.target.checked },
            })
          }
        />
        Show announcement
      </label>
      <label className="block text-sm">
        Main headline
        <input
          className="mt-1 w-full rounded border px-3 py-2"
          value={headlines.main ?? ""}
          onChange={(e) =>
            setData({
              ...data,
              headlines: { ...headlines, main: e.target.value },
            })
          }
        />
      </label>
      <label className="block text-sm">
        Registration open
        <input
          type="checkbox"
          className="ml-2"
          checked={Boolean(league.registrationOpen)}
          onChange={(e) =>
            setData({
              ...data,
              league: { ...league, registrationOpen: e.target.checked },
            })
          }
        />
      </label>
      <label className="block text-sm">
        First team fee (cents)
        <input
          type="number"
          className="mt-1 w-full rounded border px-3 py-2"
          value={Number(league.firstTeamFeeCents ?? 20000)}
          onChange={(e) =>
            setData({
              ...data,
              league: { ...league, firstTeamFeeCents: Number(e.target.value) },
            })
          }
        />
      </label>
      <label className="block text-sm">
        About HTML
        <textarea
          className="mt-1 w-full rounded border px-3 py-2 font-mono text-xs"
          rows={8}
          value={String(league.aboutHtml ?? "")}
          onChange={(e) =>
            setData({
              ...data,
              league: { ...league, aboutHtml: e.target.value },
            })
          }
        />
      </label>
      <EmailSmtpPanel
        notificationEmails={notificationEmails}
        onNotificationEmailsChange={(value) =>
          setData({
            ...data,
            league: {
              ...league,
              notificationEmails: value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
            },
          })
        }
      />

      <button
        type="button"
        onClick={save}
        disabled={saving}
        className="rounded-lg bg-blue-600 px-4 py-2 text-white"
      >
        {saving ? "Saving…" : "Save settings"}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}
