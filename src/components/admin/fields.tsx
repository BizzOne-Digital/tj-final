"use client";

import { useRef, useState } from "react";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

export const inputClass =
  "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

export const primaryButton =
  "rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60";
export const secondaryButton =
  "rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-60";

/** Rich text (HTML) editor: simple formatting toolbar + sandboxed preview. */
export function HtmlField({
  value,
  onChange,
  rows = 8,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [preview, setPreview] = useState(false);

  type Tool = { label: string; title: string; before: string; after: string; placeholder: string; link?: boolean };
  const tools: Tool[] = [
    { label: "B", title: "Bold", before: "<strong>", after: "</strong>", placeholder: "bold text" },
    { label: "I", title: "Italic", before: "<em>", after: "</em>", placeholder: "italic text" },
    { label: "¶", title: "Paragraph", before: "<p>", after: "</p>", placeholder: "Paragraph text" },
    { label: "H", title: "Heading", before: "<h3>", after: "</h3>", placeholder: "Heading" },
    { label: "• List", title: "Bulleted list", before: "<ul>\n<li>", after: "</li>\n</ul>", placeholder: "List item" },
    { label: "Link", title: "Link", before: "", after: "</a>", placeholder: "link text", link: true },
  ];

  function applyTool(tool: Tool) {
    const el = ref.current;
    if (!el) return;
    let before = tool.before;
    if (tool.link) {
      const url = window.prompt("Link address (https://…, mailto:… or /page)");
      if (!url) return;
      before = `<a href="${url.replace(/"/g, "&quot;")}">`;
    }
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end) || tool.placeholder;
    onChange(value.slice(0, start) + before + selected + tool.after + value.slice(end));
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + before.length, start + before.length + selected.length);
    });
  }

  return (
    <div className="mt-1">
      <div className="flex flex-wrap items-center gap-1 rounded-t-lg border border-b-0 border-slate-300 bg-slate-50 px-2 py-1">
        {tools.map((t) => (
          <button
            key={t.label}
            type="button"
            title={t.title}
            onClick={() => applyTool(t)}
            className="rounded px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200"
          >
            {t.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setPreview((p) => !p)}
          className="ml-auto rounded px-2 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-50"
        >
          {preview ? "Edit" : "Preview"}
        </button>
      </div>
      {preview ? (
        <iframe
          title="Preview"
          sandbox=""
          className="h-56 w-full rounded-b-lg border border-slate-300 bg-white"
          srcDoc={`<body style="font-family:system-ui,sans-serif;font-size:14px;line-height:1.5;color:#1e293b;padding:8px">${value}</body>`}
        />
      ) : (
        <textarea
          ref={ref}
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-b-lg border border-slate-300 bg-white px-3 py-2 font-mono text-xs text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      )}
    </div>
  );
}

/** Ordered list of images with add / remove / move. */
export function ImageListField({
  value,
  onChange,
  folder = "pages",
  emptyLabel = "No images yet.",
}: {
  value: string[];
  onChange: (v: string[]) => void;
  folder?: "products" | "gallery" | "pages" | "misc";
  emptyLabel?: string;
}) {
  const [adding, setAdding] = useState("");

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  return (
    <div className="mt-1 space-y-3">
      {value.length === 0 ? <p className="text-sm text-slate-500">{emptyLabel}</p> : null}
      {value.map((url, i) => (
        <div key={`${i}-${url}`} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <ImageUploadField
            value={url}
            folder={folder}
            onChange={(u) => {
              const next = [...value];
              if (u) next[i] = u;
              else next.splice(i, 1);
              onChange(next);
            }}
          />
          <div className="mt-2 flex gap-2">
            <button type="button" className={secondaryButton} onClick={() => move(i, -1)} disabled={i === 0}>
              Move up
            </button>
            <button
              type="button"
              className={secondaryButton}
              onClick={() => move(i, 1)}
              disabled={i === value.length - 1}
            >
              Move down
            </button>
          </div>
        </div>
      ))}
      <div className="rounded-lg border border-dashed border-slate-300 p-3">
        <ImageUploadField
          value={adding}
          folder={folder}
          label="Add another image"
          onChange={(u) => {
            if (u) {
              onChange([...value, u]);
              setAdding("");
            }
          }}
        />
      </div>
    </div>
  );
}

export type EditorField = {
  key: string;
  label: string;
  kind: "text" | "textarea" | "html" | "url" | "image" | "images";
  default: string | string[];
  help?: string;
};

export type FieldValue = string | string[];

export function isSameValue(a: FieldValue | undefined, b: FieldValue | undefined) {
  return JSON.stringify(a ?? "") === JSON.stringify(b ?? "");
}

/** Renders the right control for a field kind. */
export function FieldControl({
  field,
  value,
  onChange,
  folder = "pages",
}: {
  field: EditorField;
  value: FieldValue;
  onChange: (v: FieldValue) => void;
  folder?: "products" | "gallery" | "pages" | "misc";
}) {
  switch (field.kind) {
    case "text":
    case "url":
      return (
        <input
          className={inputClass}
          value={String(value ?? "")}
          maxLength={500}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "textarea":
      return (
        <textarea
          className={inputClass}
          rows={4}
          maxLength={5000}
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "html":
      return <HtmlField value={String(value ?? "")} onChange={onChange} />;
    case "image":
      return (
        <ImageUploadField
          value={String(value ?? "")}
          folder={folder}
          onChange={(u) => onChange(u || (typeof field.default === "string" ? field.default : ""))}
          hint={
            typeof field.default === "string" && field.default
              ? "Removing the image restores the original default image."
              : undefined
          }
        />
      );
    case "images":
      return (
        <ImageListField
          value={Array.isArray(value) ? value : []}
          onChange={onChange}
          folder={folder}
        />
      );
  }
}

export async function saveContentValues(
  values: Record<string, FieldValue | null>,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ values }),
    });
    const json = (await res.json().catch(() => ({}))) as {
      error?: string;
      fields?: Record<string, string>;
    };
    if (!res.ok) {
      const detail = json.fields ? " " + Object.values(json.fields).join(" ") : "";
      return { ok: false, error: (json.error ?? `Save failed (${res.status}).`) + detail };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}
