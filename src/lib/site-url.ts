export const PRODUCTION_SITE = "https://www.poselectleague.com";

/** Canonical site origin for metadata and absolute asset URLs. */
export function getSiteUrl(): string {
  if (process.env.NODE_ENV === "development") {
    const local = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
    if (local?.startsWith("http://") || local?.startsWith("https://")) return local;
    if (local) return `http://${local}`;
    return "http://localhost:3000";
  }

  const site = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (site?.startsWith("http://") || site?.startsWith("https://")) return site;
  if (site) return `https://${site}`;

  // Live site + link previews always use the public domain (not VERCEL_URL / APP_URL).
  return PRODUCTION_SITE;
}
