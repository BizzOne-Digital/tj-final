"use client";

import { useMemo, useState } from "react";
import { useToast } from "@/components/admin/Toast";
import {
  FieldControl,
  isSameValue,
  primaryButton,
  saveContentValues,
  secondaryButton,
  type EditorField,
  type FieldValue,
} from "@/components/admin/fields";

export type EditorSection = { id: string; label: string; fields: (EditorField & { fullKey: string })[] };

export function PageContentEditor({
  sections,
  overrides,
  viewPath,
  pageSlug,
}: {
  sections: EditorSection[];
  /** Currently stored overrides keyed by full key. */
  overrides: Record<string, FieldValue>;
  viewPath?: string;
  pageSlug: string;
}) {
  const toast = useToast();

  const initial = useMemo(() => {
    const m: Record<string, FieldValue> = {};
    for (const s of sections) {
      for (const f of s.fields) {
        const o = overrides[f.fullKey];
        m[f.fullKey] = o !== undefined ? o : f.default;
      }
    }
    return m;
  }, [sections, overrides]);

  const [saved, setSaved] = useState<Record<string, FieldValue>>(initial);
  const [values, setValues] = useState<Record<string, FieldValue>>(initial);
  const [saving, setSaving] = useState(false);

  const dirtyKeys = Object.keys(values).filter((k) => !isSameValue(values[k], saved[k]));

  async function save() {
    if (dirtyKeys.length === 0) return;
    setSaving(true);
    const payload: Record<string, FieldValue> = {};
    for (const k of dirtyKeys) payload[k] = values[k];
    const res = await saveContentValues(payload);
    setSaving(false);
    if (!res.ok) {
      toast.error(res.error ?? "Save failed.");
      return;
    }
    setSaved({ ...saved, ...payload });
    toast.success(`Saved ${dirtyKeys.length} change${dirtyKeys.length === 1 ? "" : "s"}. The live site is updated.`);
  }

  const total = sections.reduce((n, s) => n + s.fields.length, 0);

  return (
    <div className="pb-24">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        {viewPath ? (
          <a href={viewPath} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-700 hover:underline">
            View live page ↗
          </a>
        ) : null}
        <span className="text-slate-500">{total} editable fields</span>
      </div>

      {sections.length > 1 ? (
        <nav className="mt-4 flex flex-wrap gap-2" aria-label="Sections">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#sec-${pageSlug}-${s.id}`}
              className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs text-slate-700 hover:bg-slate-50"
            >
              {s.label.length > 40 ? s.label.slice(0, 38) + "…" : s.label}
            </a>
          ))}
        </nav>
      ) : null}

      <div className="mt-6 space-y-8">
        {sections.map((s) => (
          <section
            key={s.id}
            id={`sec-${pageSlug}-${s.id}`}
            className="scroll-mt-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-slate-900">{s.label}</h2>
            <div className="mt-4 space-y-6">
              {s.fields.map((f) => {
                const value = values[f.fullKey];
                const customised = !isSameValue(value, f.default);
                return (
                  <div key={f.fullKey}>
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="text-sm font-medium text-slate-800">{f.label}</label>
                      {customised ? (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-800">
                          Customised
                        </span>
                      ) : null}
                      {customised ? (
                        <button
                          type="button"
                          className="text-xs text-blue-700 hover:underline"
                          onClick={() => setValues({ ...values, [f.fullKey]: f.default })}
                        >
                          Reset to default
                        </button>
                      ) : null}
                    </div>
                    <FieldControl
                      field={f}
                      value={value}
                      onChange={(v) => setValues({ ...values, [f.fullKey]: v })}
                    />
                    {f.help ? <p className="mt-1 text-xs text-slate-500">{f.help}</p> : null}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur md:left-64">
        <div className="mx-auto flex max-w-4xl items-center gap-3">
          <button type="button" onClick={save} disabled={saving || dirtyKeys.length === 0} className={primaryButton}>
            {saving ? "Saving…" : "Save changes"}
          </button>
          <button
            type="button"
            className={secondaryButton}
            disabled={saving || dirtyKeys.length === 0}
            onClick={() => setValues(saved)}
          >
            Discard
          </button>
          <span className="text-sm text-slate-500">
            {dirtyKeys.length === 0 ? "No unsaved changes" : `${dirtyKeys.length} unsaved change${dirtyKeys.length === 1 ? "" : "s"}`}
          </span>
        </div>
      </div>
    </div>
  );
}
