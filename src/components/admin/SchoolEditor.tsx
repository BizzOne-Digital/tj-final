"use client";

import { useState } from "react";
import { useToast } from "@/components/admin/Toast";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import {
  ImageListField,
  inputClass,
  primaryButton,
  saveContentValues,
  secondaryButton,
} from "@/components/admin/fields";

export type CoachRow = { name: string; label: string; email: string };

export function SchoolEditor({
  slug,
  initial,
  defaults,
}: {
  slug: string;
  initial: {
    name: string;
    programLink: string;
    coaches: CoachRow[];
    teamImage: string;
    schedules: string[];
  };
  defaults: { teamImage: string; schedules: string[] };
}) {
  const toast = useToast();
  const [name, setName] = useState(initial.name);
  const [programLink, setProgramLink] = useState(initial.programLink);
  const [coaches, setCoaches] = useState<CoachRow[]>(initial.coaches);
  const [teamImage, setTeamImage] = useState(initial.teamImage);
  const [schedules, setSchedules] = useState<string[]>(initial.schedules);
  const [saving, setSaving] = useState(false);

  function updateCoach(i: number, patch: Partial<CoachRow>) {
    setCoaches(coaches.map((c, idx) => (idx === i ? { ...c, ...patch } : c)));
  }

  async function save() {
    if (!name.trim()) {
      toast.error("School name is required.");
      return;
    }
    if (coaches.some((c) => !c.name.trim())) {
      toast.error("Every coach needs a name (or remove the empty row).");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/schools/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          programLink,
          coaches: coaches.map((c) => ({ ...c, name: c.name.trim() })),
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        toast.error(json.error ?? `Could not save school details (${res.status}).`);
        return;
      }
      const media = await saveContentValues({
        [`school.${slug}.team`]: teamImage,
        [`school.${slug}.schedules`]: schedules,
      });
      if (!media.ok) {
        toast.error(media.error ?? "Could not save images.");
        return;
      }
      toast.success("School saved. The live site is updated.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl space-y-8 pb-24">
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">School details</h2>
        <label className="mt-4 block text-sm font-medium text-slate-800">
          School name
          <input className={inputClass} value={name} maxLength={120} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="mt-4 block text-sm font-medium text-slate-800">
          Program page / Facebook link
          <input
            className={inputClass}
            value={programLink}
            placeholder="https://…"
            onChange={(e) => setProgramLink(e.target.value)}
          />
        </label>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Coaches</h2>
        <p className="mt-1 text-sm text-slate-500">
          Shown in the Contact section of the team page. The label appears in brackets, e.g. &quot;4th Grade&quot;
          or &quot;Grades 5-6&quot;.
        </p>
        <div className="mt-4 space-y-3">
          {coaches.length === 0 ? <p className="text-sm text-slate-500">No coaches listed.</p> : null}
          {coaches.map((c, i) => (
            <div key={i} className="grid gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:grid-cols-[1fr_1fr_1fr_auto]">
              <input
                className={inputClass + " mt-0"}
                placeholder="Coach name"
                value={c.name}
                onChange={(e) => updateCoach(i, { name: e.target.value })}
              />
              <input
                className={inputClass + " mt-0"}
                placeholder="Label (e.g. Grades 3-4)"
                value={c.label}
                onChange={(e) => updateCoach(i, { label: e.target.value })}
              />
              <input
                className={inputClass + " mt-0"}
                placeholder="Email (optional)"
                value={c.email}
                onChange={(e) => updateCoach(i, { email: e.target.value })}
              />
              <button
                type="button"
                className={secondaryButton}
                onClick={() => setCoaches(coaches.filter((_, idx) => idx !== i))}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className={secondaryButton}
            onClick={() => setCoaches([...coaches, { name: "", label: "", email: "" }])}
          >
            + Add coach
          </button>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Team photo</h2>
        <div className="mt-3">
          <ImageUploadField
            value={teamImage}
            folder="gallery"
            onChange={(u) => setTeamImage(u || defaults.teamImage)}
            hint="Shown on the Teams page and the team profile. Removing it restores the original photo."
          />
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Schedule posters</h2>
        <p className="mt-1 text-sm text-slate-500">
          Shown on this team&apos;s page and on the Schedules page, in this order.
        </p>
        <ImageListField value={schedules} onChange={setSchedules} folder="pages" emptyLabel="No schedule posters." />
        <button
          type="button"
          className={secondaryButton + " mt-3"}
          onClick={() => setSchedules(defaults.schedules)}
        >
          Restore original posters
        </button>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur md:left-64">
        <div className="mx-auto max-w-3xl">
          <button type="button" onClick={save} disabled={saving} className={primaryButton}>
            {saving ? "Saving…" : "Save school"}
          </button>
        </div>
      </div>
    </div>
  );
}
