import type { Model } from "mongoose";
import { BlogPost, FAQ, StaffMember } from "@/models/Content";
import type { AdminModule } from "@/types/roles";
import { sanitizeRichHtml } from "@/lib/cms/sanitize";

export type CollFieldKind =
  | "text"
  | "textarea"
  | "html"
  | "image"
  | "number"
  | "checkbox"
  | "select"
  | "date"
  | "tags"
  | "email";

export type CollField = {
  name: string;
  label: string;
  kind: CollFieldKind;
  required?: boolean;
  options?: string[];
  help?: string;
};

export type CollectionConfig = {
  key: string;
  label: string;
  singular: string;
  module: AdminModule;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  model: Model<any>;
  fields: CollField[];
  titleField: string;
  subtitleField?: string;
  sort: Record<string, 1 | -1>;
  /** Auto-generate a unique slug from this field on create. */
  slugFrom?: string;
  publicPath?: string;
};

const STATUS = ["published", "draft"];

export const COLLECTIONS: Record<string, CollectionConfig> = {
  news: {
    key: "news",
    label: "News & Announcements",
    singular: "article",
    module: "news",
    model: BlogPost,
    titleField: "title",
    subtitleField: "publishedAt",
    sort: { publishedAt: -1, createdAt: -1 },
    slugFrom: "title",
    publicPath: "/blogs",
    fields: [
      { name: "title", label: "Title", kind: "text", required: true },
      { name: "excerpt", label: "Short summary", kind: "textarea", help: "Shown on the News list and the home page." },
      { name: "contentHtml", label: "Article", kind: "html", required: true },
      { name: "coverImage", label: "Cover image", kind: "image" },
      { name: "categories", label: "Categories (comma separated)", kind: "tags" },
      { name: "authorName", label: "Author", kind: "text" },
      { name: "publishedAt", label: "Publish date", kind: "date" },
      { name: "featured", label: "Featured", kind: "checkbox" },
      { name: "publicationStatus", label: "Status", kind: "select", options: STATUS },
    ],
  },
  faq: {
    key: "faq",
    label: "FAQ",
    singular: "question",
    module: "faq-testimonials",
    model: FAQ,
    titleField: "question",
    subtitleField: "category",
    sort: { sortOrder: 1, createdAt: 1 },
    publicPath: "/faq",
    fields: [
      { name: "question", label: "Question", kind: "text", required: true },
      { name: "answerHtml", label: "Answer", kind: "html", required: true },
      { name: "category", label: "Category", kind: "text" },
      { name: "sortOrder", label: "Order (lower shows first)", kind: "number" },
      { name: "publicationStatus", label: "Status", kind: "select", options: STATUS },
    ],
  },
  leadership: {
    key: "leadership",
    label: "League Leadership",
    singular: "person",
    module: "leadership",
    model: StaffMember,
    titleField: "name",
    subtitleField: "roles",
    sort: { sortOrder: 1, createdAt: 1 },
    publicPath: "/our-team",
    fields: [
      { name: "name", label: "Name", kind: "text", required: true },
      { name: "roles", label: "Roles (comma separated)", kind: "tags" },
      { name: "bioHtml", label: "Bio", kind: "html" },
      { name: "photo", label: "Photo", kind: "image" },
      { name: "email", label: "Email", kind: "email" },
      { name: "phone", label: "Phone", kind: "text" },
      { name: "sortOrder", label: "Order (lower shows first)", kind: "number" },
      { name: "publicationStatus", label: "Status", kind: "select", options: STATUS },
    ],
  },
};

export function getCollection(key: string): CollectionConfig | undefined {
  return Object.prototype.hasOwnProperty.call(COLLECTIONS, key) ? COLLECTIONS[key] : undefined;
}

/* ---------- conversion between form record and Mongo document ---------- */

export type FormRecord = Record<string, unknown>;

const IMAGE_URL = /^(\/[^/\\].*|https:\/\/.+)$/;

export type ConvertResult =
  | { ok: true; set: Record<string, unknown>; unset: string[] }
  | { ok: false; error: string };

export function formToDoc(config: CollectionConfig, form: FormRecord): ConvertResult {
  const set: Record<string, unknown> = {};
  const unset: string[] = [];
  const title = String(form[config.titleField] ?? "").trim();

  for (const f of config.fields) {
    const raw = form[f.name];
    const str = typeof raw === "string" ? raw.trim() : raw == null ? "" : String(raw).trim();

    if (f.required && str === "") return { ok: false, error: `${f.label} is required.` };

    switch (f.kind) {
      case "text":
      case "email":
        if (str.length > 300) return { ok: false, error: `${f.label} is too long.` };
        if (f.kind === "email" && str && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str)) {
          return { ok: false, error: `${f.label} is not a valid email address.` };
        }
        set[f.name] = str;
        break;
      case "textarea":
        if (str.length > 5000) return { ok: false, error: `${f.label} is too long.` };
        set[f.name] = str;
        break;
      case "html":
        if (str.length > 200_000) return { ok: false, error: `${f.label} is too long.` };
        set[f.name] = sanitizeRichHtml(str);
        break;
      case "image":
        if (str === "") unset.push(f.name);
        else if (str.length > 500 || !IMAGE_URL.test(str)) return { ok: false, error: `${f.label}: invalid image URL.` };
        else set[f.name] = { url: str, alt: title };
        break;
      case "number": {
        if (str === "") {
          set[f.name] = 0;
          break;
        }
        const n = Number(str);
        if (!Number.isFinite(n)) return { ok: false, error: `${f.label} must be a number.` };
        set[f.name] = n;
        break;
      }
      case "checkbox":
        set[f.name] = raw === true || raw === "true";
        break;
      case "select":
        if (!f.options?.includes(str)) return { ok: false, error: `${f.label}: choose a valid option.` };
        set[f.name] = str;
        break;
      case "date": {
        if (str === "") {
          unset.push(f.name);
          break;
        }
        const d = new Date(str.length === 10 ? `${str}T12:00:00-05:00` : str);
        if (Number.isNaN(d.getTime())) return { ok: false, error: `${f.label} is not a valid date.` };
        set[f.name] = d;
        break;
      }
      case "tags": {
        const list = [
          ...new Set(
            (Array.isArray(raw) ? raw.map(String) : str.split(","))
              .map((t) => t.trim())
              .filter(Boolean),
          ),
        ].slice(0, 20);
        set[f.name] = list;
        break;
      }
    }
  }
  return { ok: true, set, unset };
}

export function docToForm(config: CollectionConfig, doc: Record<string, unknown>): FormRecord {
  const out: FormRecord = { _id: String(doc._id) };
  for (const f of config.fields) {
    const v = doc[f.name];
    switch (f.kind) {
      case "image":
        out[f.name] = (v as { url?: string } | undefined)?.url ?? "";
        break;
      case "tags":
        out[f.name] = Array.isArray(v) ? v.join(", ") : "";
        break;
      case "date":
        out[f.name] = v ? new Date(v as string).toISOString().slice(0, 10) : "";
        break;
      case "checkbox":
        out[f.name] = Boolean(v);
        break;
      case "number":
        out[f.name] = typeof v === "number" ? v : 0;
        break;
      default:
        out[f.name] = v == null ? "" : String(v);
    }
  }
  return out;
}

export function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "item"
  );
}

export function imageUrlsOf(config: CollectionConfig, doc: Record<string, unknown> | null): string[] {
  if (!doc) return [];
  return config.fields
    .filter((f) => f.kind === "image")
    .map((f) => (doc[f.name] as { url?: string } | undefined)?.url)
    .filter((u): u is string => Boolean(u));
}
