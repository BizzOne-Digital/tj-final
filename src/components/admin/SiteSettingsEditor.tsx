"use client";

import { useEffect, useState } from "react";
import { EmailSmtpPanel } from "@/components/admin/EmailSmtpPanel";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { useToast } from "@/components/admin/Toast";
import { HtmlField, inputClass, primaryButton } from "@/components/admin/fields";

type Settings = {
  announcement: { text: string; visible: boolean };
  headlines: { main: string; quote: string; supporting: string; secondary: string; hashtags: string };
  league: {
    registrationOpen: boolean;
    firstTeamFeeDollars: number;
    additionalTeamFeeDollars: number;
    teamsPerDivisionCapacity: number;
    activeSeasonSlug: string;
    nfhsStreamUrl: string;
    gearStoreUrl: string;
    aboutHtml: string;
    eligibilityHtml: string;
    notificationEmails: string;
  };
  contact: {
    primaryName: string;
    primaryEmail: string;
    primaryPhone: string;
    programEmail: string;
    mailingAddress: string;
    gameVenueName: string;
    gameVenueAddress: string;
    facebookPageName: string;
    facebookUrl: string;
  };
  brand: { emblem: string; seasonPoster: string };
};

function fromApi(d: Record<string, unknown>): Settings {
  const g = (o: unknown) => (o ?? {}) as Record<string, unknown>;
  const a = g(d.announcement);
  const h = g(d.headlines);
  const l = g(d.league);
  const c = g(d.contact);
  const b = g(d.brand);
  const s = (v: unknown) => (v == null ? "" : String(v));
  return {
    announcement: { text: s(a.text), visible: Boolean(a.visible) },
    headlines: {
      main: s(h.main),
      quote: s(h.quote),
      supporting: s(h.supporting),
      secondary: s(h.secondary),
      hashtags: s(h.hashtags),
    },
    league: {
      registrationOpen: Boolean(l.registrationOpen),
      firstTeamFeeDollars: Number(l.firstTeamFeeCents ?? 20000) / 100,
      additionalTeamFeeDollars: Number(l.additionalTeamFeeCents ?? 15000) / 100,
      teamsPerDivisionCapacity: Number(l.teamsPerDivisionCapacity ?? 8),
      activeSeasonSlug: s(l.activeSeasonSlug) || "2026-27",
      nfhsStreamUrl: s(l.nfhsStreamUrl),
      gearStoreUrl: s(l.gearStoreUrl),
      aboutHtml: s(l.aboutHtml),
      eligibilityHtml: s(l.eligibilityHtml),
      notificationEmails: Array.isArray(l.notificationEmails) ? (l.notificationEmails as string[]).join(", ") : "",
    },
    contact: {
      primaryName: s(c.primaryName),
      primaryEmail: s(c.primaryEmail),
      primaryPhone: s(c.primaryPhone),
      programEmail: s(c.programEmail),
      mailingAddress: s(c.mailingAddress),
      gameVenueName: s(c.gameVenueName),
      gameVenueAddress: s(c.gameVenueAddress),
      facebookPageName: s(c.facebookPageName),
      facebookUrl: s(c.facebookUrl),
    },
    brand: {
      emblem: s(g(b.emblem).url),
      seasonPoster: s(g(b.seasonPoster).url),
    },
  };
}

function Card({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold">{title}</h2>
      {hint ? <p className="mt-1 text-sm text-slate-500">{hint}</p> : null}
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function Text({
  label,
  value,
  onChange,
  type = "text",
  help,
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  help?: string;
}) {
  return (
    <label className="block text-sm font-medium text-slate-800">
      {label}
      <input type={type} className={inputClass} value={value} onChange={(e) => onChange(e.target.value)} />
      {help ? <span className="mt-1 block text-xs font-normal text-slate-500">{help}</span> : null}
    </label>
  );
}

export function SiteSettingsEditor() {
  const toast = useToast();
  const [data, setData] = useState<Settings | null>(null);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/site-settings")
      .then(async (r) => {
        const j = await r.json();
        if (!r.ok) throw new Error(j.error ?? "Could not load settings.");
        setData(fromApi(j));
      })
      .catch((e: Error) => setLoadError(e.message));
  }, []);

  if (loadError) return <p className="text-red-600">{loadError}</p>;
  if (!data) return <p>Loading…</p>;

  const set = <K extends keyof Settings>(section: K, patch: Partial<Settings[K]>) =>
    setData({ ...data, [section]: { ...data[section], ...patch } });

  async function save() {
    if (!data) return;
    setSaving(true);
    try {
      const emails = data.league.notificationEmails
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const res = await fetch("/api/admin/site-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          announcement: data.announcement,
          headlines: data.headlines,
          league: {
            registrationOpen: data.league.registrationOpen,
            firstTeamFeeCents: Math.round(Number(data.league.firstTeamFeeDollars) * 100),
            additionalTeamFeeCents: Math.round(Number(data.league.additionalTeamFeeDollars) * 100),
            teamsPerDivisionCapacity: Number(data.league.teamsPerDivisionCapacity),
            activeSeasonSlug: data.league.activeSeasonSlug,
            nfhsStreamUrl: data.league.nfhsStreamUrl,
            gearStoreUrl: data.league.gearStoreUrl,
            aboutHtml: data.league.aboutHtml,
            eligibilityHtml: data.league.eligibilityHtml,
            notificationEmails: emails,
          },
          contact: data.contact,
          brand: data.brand,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        toast.error(json.error ?? `Save failed (${res.status}).`);
        return;
      }
      toast.success("Settings saved. The live site is updated.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl space-y-6 pb-24">
      <Card title="Announcement bar" hint="A short message shown at the top of the site.">
        <Text
          label="Announcement text"
          value={data.announcement.text}
          onChange={(v) => set("announcement", { text: v })}
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={data.announcement.visible}
            onChange={(e) => set("announcement", { visible: e.target.checked })}
          />
          Show announcement
        </label>
      </Card>

      <Card title="Logos & posters">
        <ImageUploadField
          label="League emblem / logo"
          folder="misc"
          value={data.brand.emblem}
          onChange={(u) => set("brand", { emblem: u })}
          hint="Shown in the site header and footer."
        />
        <ImageUploadField
          label="Season poster"
          folder="misc"
          value={data.brand.seasonPoster}
          onChange={(u) => set("brand", { seasonPoster: u })}
        />
      </Card>

      <Card title="Headlines & hashtags">
        <Text label="Main headline" value={data.headlines.main} onChange={(v) => set("headlines", { main: v })} />
        <Text
          label="Tagline (footer, closing banner, scrolling strip)"
          value={data.headlines.secondary}
          onChange={(v) => set("headlines", { secondary: v })}
        />
        <label className="block text-sm font-medium text-slate-800">
          Supporting text (home hero)
          <textarea
            className={inputClass}
            rows={2}
            value={data.headlines.supporting}
            onChange={(e) => set("headlines", { supporting: e.target.value })}
          />
        </label>
        <Text label="Hashtags" value={data.headlines.hashtags} onChange={(v) => set("headlines", { hashtags: v })} />
      </Card>

      <Card title="Contact details" hint="Used in the footer, the Contact page and registration emails.">
        <Text label="Contact name" value={data.contact.primaryName} onChange={(v) => set("contact", { primaryName: v })} />
        <Text label="Primary email" value={data.contact.primaryEmail} onChange={(v) => set("contact", { primaryEmail: v })} />
        <Text label="Phone" value={data.contact.primaryPhone} onChange={(v) => set("contact", { primaryPhone: v })} />
        <Text label="Program office email" value={data.contact.programEmail} onChange={(v) => set("contact", { programEmail: v })} />
        <Text label="Mailing address" value={data.contact.mailingAddress} onChange={(v) => set("contact", { mailingAddress: v })} />
        <Text label="Game venue name" value={data.contact.gameVenueName} onChange={(v) => set("contact", { gameVenueName: v })} />
        <Text label="Game venue address" value={data.contact.gameVenueAddress} onChange={(v) => set("contact", { gameVenueAddress: v })} />
        <Text label="Facebook page name" value={data.contact.facebookPageName} onChange={(v) => set("contact", { facebookPageName: v })} />
        <Text label="Facebook link" value={data.contact.facebookUrl} onChange={(v) => set("contact", { facebookUrl: v })} />
      </Card>

      <Card title="Season & registration">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={data.league.registrationOpen}
            onChange={(e) => set("league", { registrationOpen: e.target.checked })}
          />
          Registration is open
        </label>
        <Text label="Active season" value={data.league.activeSeasonSlug} onChange={(v) => set("league", { activeSeasonSlug: v })} help="For example 2026-27" />
        <div className="grid gap-4 sm:grid-cols-3">
          <Text
            label="First team fee ($)"
            type="number"
            value={data.league.firstTeamFeeDollars}
            onChange={(v) => set("league", { firstTeamFeeDollars: Number(v) })}
          />
          <Text
            label="Additional team fee ($)"
            type="number"
            value={data.league.additionalTeamFeeDollars}
            onChange={(v) => set("league", { additionalTeamFeeDollars: Number(v) })}
          />
          <Text
            label="Teams per division"
            type="number"
            value={data.league.teamsPerDivisionCapacity}
            onChange={(v) => set("league", { teamsPerDivisionCapacity: Number(v) })}
          />
        </div>
      </Card>

      <Card title="Links">
        <Text label="NFHS streaming link" value={data.league.nfhsStreamUrl} onChange={(v) => set("league", { nfhsStreamUrl: v })} />
        <Text label="Gear store link (optional)" value={data.league.gearStoreUrl} onChange={(v) => set("league", { gearStoreUrl: v })} />
      </Card>

      <Card
        title="Longer text"
        hint="You can also edit these (and everything else on each page) under Page Content."
      >
        <div>
          <p className="text-sm font-medium text-slate-800">About text (home page)</p>
          <HtmlField value={data.league.aboutHtml} onChange={(v) => set("league", { aboutHtml: v })} />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-800">Eligibility text (League Information page)</p>
          <HtmlField value={data.league.eligibilityHtml} onChange={(v) => set("league", { eligibilityHtml: v })} rows={5} />
        </div>
      </Card>

      <EmailSmtpPanel
        notificationEmails={data.league.notificationEmails}
        onNotificationEmailsChange={(value) => set("league", { notificationEmails: value })}
      />

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur md:left-64">
        <div className="mx-auto max-w-3xl">
          <button type="button" onClick={save} disabled={saving} className={primaryButton}>
            {saving ? "Saving…" : "Save settings"}
          </button>
        </div>
      </div>
    </div>
  );
}
