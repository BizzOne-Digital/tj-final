import type { CmsField } from "@/lib/cms/registry";
import { sanitizeRichHtml, sanitizeUrl } from "@/lib/cms/sanitize";

const IMAGE_URL = /^(\/[^/\\].*|https:\/\/.+)$/;

export type Normalised =
  | { ok: true; value: string | string[] | null }
  | { ok: false; error: string };

export function sameAsDefault(field: CmsField, value: string | string[]): boolean {
  if (Array.isArray(field.default) || Array.isArray(value)) {
    return JSON.stringify(field.default) === JSON.stringify(value);
  }
  return field.default === value;
}

/** Validate/sanitise one value. `null` result = "remove override, use default". */
export function normaliseValue(field: CmsField, raw: string | string[] | null): Normalised {
  if (raw === null) return { ok: true, value: null };

  switch (field.kind) {
    case "text": {
      if (typeof raw !== "string") return { ok: false, error: "Expected text." };
      if (raw.length > 500) return { ok: false, error: "Text is too long (max 500 characters)." };
      const v = raw.trim();
      return { ok: true, value: v === "" || sameAsDefault(field, v) ? null : v };
    }
    case "textarea": {
      if (typeof raw !== "string") return { ok: false, error: "Expected text." };
      if (raw.length > 5000) return { ok: false, error: "Text is too long (max 5000 characters)." };
      const v = raw.trim();
      return { ok: true, value: v === "" || sameAsDefault(field, v) ? null : v };
    }
    case "html": {
      if (typeof raw !== "string") return { ok: false, error: "Expected HTML text." };
      if (raw.length > 100_000) return { ok: false, error: "Content is too long." };
      const trimmed = raw.trim();
      if (trimmed === "" || sameAsDefault(field, trimmed)) return { ok: true, value: null };
      const clean = sanitizeRichHtml(trimmed).trim();
      return { ok: true, value: clean === "" ? null : clean };
    }
    case "url": {
      if (typeof raw !== "string") return { ok: false, error: "Expected a link." };
      const v = raw.trim();
      if (v === "") return { ok: true, value: null };
      const clean = sanitizeUrl(v);
      if (!clean) return { ok: false, error: "Links must start with https://, http://, mailto:, tel: or /." };
      return { ok: true, value: sameAsDefault(field, clean) ? null : clean };
    }
    case "image": {
      if (typeof raw !== "string") return { ok: false, error: "Expected an image URL." };
      const v = raw.trim();
      if (v === "") return { ok: true, value: null };
      if (v.length > 500 || !IMAGE_URL.test(v)) return { ok: false, error: "Invalid image URL." };
      return { ok: true, value: sameAsDefault(field, v) ? null : v };
    }
    case "images": {
      if (!Array.isArray(raw)) return { ok: false, error: "Expected a list of images." };
      if (raw.length > 60) return { ok: false, error: "Too many images (max 60)." };
      const list = raw.map((u) => u.trim()).filter(Boolean);
      for (const u of list) {
        if (u.length > 500 || !IMAGE_URL.test(u)) return { ok: false, error: "Invalid image URL in list." };
      }
      return { ok: true, value: sameAsDefault(field, list) ? null : list };
    }
  }
}

