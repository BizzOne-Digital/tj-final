const PRODUCTION_SITE = "https://www.poselectleague.com";

/** Canonical site origin for metadata and absolute asset URLs. */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXT_PUBLIC_APP_URL;
  if (explicit) {
    const raw = explicit.replace(/\/$/, "");
    if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
    return `https://${raw}`;
  }
  // Share previews must use the public domain — not VERCEL_URL (breaks iMessage / social crawlers).
  if (process.env.VERCEL_ENV === "production") return PRODUCTION_SITE;
  const vercel = process.env.VERCEL_URL?.replace(/\/$/, "");
  if (vercel) return `https://${vercel}`;
  return PRODUCTION_SITE;
}
