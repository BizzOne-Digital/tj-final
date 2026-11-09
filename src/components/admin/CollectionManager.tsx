"use client";

import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/components/admin/Toast";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { HtmlField, inputClass, primaryButton, secondaryButton } from "@/components/admin/fields";

export type ClientField = {
  name: string;
  label: string;
  kind: "text" | "textarea" | "html" | "image" | "number" | "checkbox" | "select" | "date" | "tags" | "email";
  required?: boolean;
  options?: string[];
  help?: string;
};

export type ClientCollection = {
  key: string;
  label: string;
  singular: string;
  fields: ClientField[];
  titleField: string;
  subtitleField?: string;
  publicPath?: string;
  canImportDefaults?: boolean;
};

type Rec = Record<string, unknown> & { _id?: string };

function blank(fields: ClientField[]): Rec {
  const r: Rec = {};
  for (const f of fields) {
    r[f.name] =
      f.kind === "checkbox" ? false : f.kind === "number" ? 0 : f.kind === "select" ? f.options?.[0] ?? "" : "";
  }
  return r;
}

export function CollectionManager({ collection }: { collection: ClientCollection }) {
  const toast = useToast();
  const base = `/api/admin/collections/${collection.key}`;
  const [items, setItems] = useState<Rec[] | null>(null);
  const [editing, setEditing] = useState<Rec | null>(null);
  const [saving, setSaving] = useState(false);

  const [reloadKey, setReloadKey] = useState(0);
  const load = useCallback(() => setReloadKey((k) => k + 1), []);

  useEffect(() => {
    let cancelled = false;
    fetch(base)
      .then(async (res) => ({ ok: res.ok, json: (await res.json().catch(() => ({}))) as { items?: Rec[]; error?: string } }))
      .then(({ ok, json }) => {
        if (cancelled) return;
        if (!ok) {
          toast.error(json.error ?? "Could not load items.");
          setItems([]);
          return;
        }
        setItems(json.items ?? []);
      })
      .catch(() => {
        if (!cancelled) {
          toast.error("Could not load items.");
          setItems([]);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [base, reloadKey, toast]);

  async function save() {
    if (!editing) return;
    setSaving(true);
    try {
      const isNew = !editing._id;
      const res = await fetch(isNew ? base : `${base}/${editing._id}`, {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ record: editing }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        toast.error(json.error ?? `Save failed (${res.status}).`);
        return;
      }
      toast.success(`${isNew ? "Created" : "Saved"}. The live site is updated.`);
      setEditing(null);
      load();
    } finally {
      setSaving(false);
    }
  }

  async function remove(rec: Rec) {
    if (!rec._id) return;
    if (!window.confirm(`Delete this ${collection.singular}? This cannot be undone.`)) return;
    const res = await fetch(`${base}/${rec._id}`, { method: "DELETE" });
    const json = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) {
      toast.error(json.error ?? "Delete failed.");
      return;
    }
    toast.success("Deleted.");
    setEditing(null);
    load();
  }

  async function importDefaults() {
    const res = await fetch(base, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "import-defaults" }),
    });
    const json = (await res.json().catch(() => ({}))) as { error?: string; imported?: number };
    if (!res.ok) {
      toast.error(json.error ?? "Import failed.");
      return;
    }
    toast.success(`Imported ${json.imported ?? 0} article(s).`);
    load();
  }

  if (editing) {
    return (
      <div className="max-w-3xl space-y-5">
        <h2 className="text-lg font-semibold">
          {editing._id ? `Edit ${collection.singular}` : `New ${collection.singular}`}
        </h2>
        {collection.fields.map((f) => (
          <div key={f.name}>
            {f.kind !== "checkbox" ? (
              <label className="text-sm font-medium text-slate-800">
                {f.label}
                {f.required ? <span className="text-red-600"> *</span> : null}
              </label>
            ) : null}
            {renderControl(f, editing, setEditing)}
            {f.help ? <p className="mt-1 text-xs text-slate-500">{f.help}</p> : null}
          </div>
        ))}
        <div className="flex flex-wrap gap-2 pt-2">
          <button type="button" className={primaryButton} onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </button>
          <button type="button" className={secondaryButton} onClick={() => setEditing(null)} disabled={saving}>
            Cancel
          </button>
          {editing._id ? (
            <button
              type="button"
              className="ml-auto rounded-lg border border-red-300 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50"
              onClick={() => remove(editing)}
              disabled={saving}
            >
              Delete
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className={primaryButton}
          onClick={() => setEditing(blank(collection.fields))}
        >
          + Add {collection.singular}
        </button>
        {collection.publicPath ? (
          <a href={collection.publicPath} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-700 hover:underline">
            View live page ↗
          </a>
        ) : null}
      </div>

      {items === null ? <p className="mt-6 text-sm text-slate-500">Loading…</p> : null}
      {items && items.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
          <p>No {collection.label.toLowerCase()} yet.</p>
          {collection.canImportDefaults ? (
            <button type="button" className={secondaryButton + " mt-3"} onClick={importDefaults}>
              Import the built-in articles so I can edit them
            </button>
          ) : null}
        </div>
      ) : null}
      <ul className="mt-6 space-y-2">
        {items?.map((it) => (
          <li key={String(it._id)}>
            <button
              type="button"
              onClick={() => setEditing(it)}
              className="flex w-full items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-4 text-left shadow-sm hover:border-blue-300"
            >
              <span className="min-w-0">
                <span className="block truncate font-medium text-slate-900">
                  {String(it[collection.titleField] ?? "(untitled)")}
                </span>
                {collection.subtitleField ? (
                  <span className="block truncate text-xs text-slate-500">
                    {String(it[collection.subtitleField] ?? "")}
                  </span>
                ) : null}
              </span>
              {it.publicationStatus === "draft" ? (
                <span className="shrink-0 rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-700">Draft</span>
              ) : null}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function renderControl(f: ClientField, rec: Rec, set: (r: Rec) => void) {
  const value = rec[f.name];
  const update = (v: unknown) => set({ ...rec, [f.name]: v });
  switch (f.kind) {
    case "textarea":
      return (
        <textarea className={inputClass} rows={3} value={String(value ?? "")} onChange={(e) => update(e.target.value)} />
      );
    case "html":
      return <HtmlField value={String(value ?? "")} onChange={update} rows={12} />;
    case "image":
      return <ImageUploadField value={String(value ?? "")} folder="gallery" onChange={update} />;
    case "number":
      return (
        <input
          type="number"
          className={inputClass}
          value={Number(value ?? 0)}
          onChange={(e) => update(e.target.value === "" ? 0 : Number(e.target.value))}
        />
      );
    case "checkbox":
      return (
        <label className="flex items-center gap-2 text-sm font-medium text-slate-800">
          <input type="checkbox" checked={Boolean(value)} onChange={(e) => update(e.target.checked)} />
          {f.label}
        </label>
      );
    case "select":
      return (
        <select className={inputClass} value={String(value ?? "")} onChange={(e) => update(e.target.value)}>
          {f.options?.map((o) => (
            <option key={o} value={o}>
              {o.charAt(0).toUpperCase() + o.slice(1)}
            </option>
          ))}
        </select>
      );
    case "date":
      return <input type="date" className={inputClass} value={String(value ?? "")} onChange={(e) => update(e.target.value)} />;
    default:
      return <input className={inputClass} value={String(value ?? "")} onChange={(e) => update(e.target.value)} />;
  }
}
