import { PRODUCTION_SITE } from "@/lib/site-url";

/** Landscape league graphic for link previews (iMessage, social). */
export const OG_SHARE_IMAGE = "/brand/og-share.jpg";
/** Absolute URL so share apps never resolve a broken Vercel preview host. */
export const OG_SHARE_IMAGE_ABSOLUTE = `${PRODUCTION_SITE}${OG_SHARE_IMAGE}`;
export const OG_SHARE_WIDTH = 1024;
export const OG_SHARE_HEIGHT = 699;

/** Full program poster (site content, not link preview). */
export const OG_PROGRAM_POSTER = "/brand/season-poster-2026-27.jpg";
