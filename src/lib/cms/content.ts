import { cache } from "react";
import { connectMongoose } from "@/lib/db/mongoose";
import { isDatabaseConfigured } from "@/lib/env";
import { SiteContent } from "@/models/SiteContent";
import { resolveField } from "@/lib/cms/registry";
import { safeImageSrc } from "@/lib/upload-shared";
import { applyBlockOverrides, type HubBlock } from "@/lib/hub-sections";

export type Cms = {
  /** Plain text (also used for urls). Falls back to the built-in default. */
  text: (fullKey: string) => string;
  /** Sanitised HTML, falls back to the built-in default. */
  html: (fullKey: string) => string;
  /** Single image URL (legacy `/uploads/...` URLs become a placeholder). */
  image: (fullKey: string) => string;
  /** List of image URLs. */
  images: (fullKey: string) => string[];
  /** True when an admin has overridden the default. */
  isCustom: (fullKey: string) => boolean;
};

const loadOverrides = cache(async (): Promise<Map<string, unknown>> => {
  const map = new Map<string, unknown>();
  if (!isDatabaseConfigured()) return map;
  try {
    await connectMongoose();
    const docs = await SiteContent.find().select("key value").lean();
    for (const d of docs) map.set(d.key, d.value);
  } catch (e) {
    console.error("CMS load failed, using defaults", e);
  }
  return map;
});

export function createCms(overrides: Map<string, unknown>): Cms {
  const stringOverride = (key: string): string | undefined => {
    const v = overrides.get(key);
    return typeof v === "string" && v.trim() !== "" ? v : undefined;
  };

  const lookup = (key: string) => {
    const field = resolveField(key);
    if (!field && process.env.NODE_ENV !== "production") {
      console.warn(`[cms] unknown content key: ${key}`);
    }
    return field;
  };

  const text = (key: string) => {
    const field = lookup(key);
    return stringOverride(key) ?? (typeof field?.default === "string" ? field.default : "");
  };

  return {
    text,
    html: text,
    image: (key) => {
      const field = lookup(key);
      const fallback = typeof field?.default === "string" ? field.default : "";
      return stringOverride(key) ? safeImageSrc(stringOverride(key)) : fallback;
    },
    images: (key) => {
      const field = lookup(key);
      const v = overrides.get(key);
      const list = Array.isArray(v)
        ? (v as unknown[])
        : Array.isArray(field?.default)
          ? field.default
          : [];
      return list
        .filter((u): u is string => typeof u === "string" && u.trim() !== "")
        .map((u) => safeImageSrc(u));
    },
    isCustom: (key) => overrides.has(key),
  };
}

/** One DB read per request (React cache), shared by every component on the page. */
export async function getCms(): Promise<Cms> {
  return createCms(await loadOverrides());
}

/**
 * HTML field that can also be set via legacy League & Brand settings:
 * an explicit page-content edit wins, then the settings value, then the default.
 */
export function htmlWithFallback(cms: Cms, fullKey: string, legacy?: string | null): string {
  if (cms.isCustom(fullKey)) return cms.html(fullKey);
  return legacy && legacy.trim() ? legacy : cms.html(fullKey);
}

/** Apply admin-edited text to hub blocks (standings, brackets, awards...). */
export function hubBlocksFor(cms: Cms, pageSlug: string, blocks: HubBlock[]): HubBlock[] {
  return applyBlockOverrides(blocks, (id) => {
    const key = `${pageSlug}.blocks.${id}`;
    return cms.isCustom(key) ? cms.html(key) : undefined;
  });
}

/** Raw override values for the admin editor (not cached). */
export async function getRawOverrides(keys?: string[]): Promise<Record<string, unknown>> {
  const out: Record<string, unknown> = {};
  if (!isDatabaseConfigured()) return out;
  await connectMongoose();
  const docs = await SiteContent.find(keys ? { key: { $in: keys } } : {})
    .select("key value")
    .lean();
  for (const d of docs) out[d.key] = d.value;
  return out;
}
