/**
 * Pure (browser-safe) upload helpers. No database imports here, so client
 * components can use `safeImageSrc` without pulling MongoDB into the bundle.
 */

export const UPLOAD_FOLDERS = ["products", "gallery", "pages", "misc"] as const;
export type UploadFolder = (typeof UPLOAD_FOLDERS)[number];

export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;
export type AllowedMime = (typeof ALLOWED_MIME_TYPES)[number];

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

export const UPLOAD_URL_PREFIX = "/api/uploads/";
export const PLACEHOLDER_IMAGE = "/brand/placeholder.svg";

const EXT_BY_MIME: Record<AllowedMime, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export function isUploadFolder(value: unknown): value is UploadFolder {
  return typeof value === "string" && (UPLOAD_FOLDERS as readonly string[]).includes(value);
}

export function isAllowedMime(value: unknown): value is AllowedMime {
  return typeof value === "string" && (ALLOWED_MIME_TYPES as readonly string[]).includes(value);
}

export function extensionForMime(mime: AllowedMime): string {
  return EXT_BY_MIME[mime];
}

/** Detect the real image type from magic bytes (never trust the client-declared type). */
export function sniffImageMime(buf: Uint8Array): AllowedMime | null {
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    buf.length >= 8 &&
    buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47 &&
    buf[4] === 0x0d && buf[5] === 0x0a && buf[6] === 0x1a && buf[7] === 0x0a
  ) {
    return "image/png";
  }
  if (
    buf.length >= 6 &&
    buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x38 &&
    (buf[4] === 0x37 || buf[4] === 0x39) && buf[5] === 0x61
  ) {
    return "image/gif";
  }
  if (
    buf.length >= 12 &&
    buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 &&
    buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50
  ) {
    return "image/webp";
  }
  return null;
}

/** `${Date.now()}-${randomHex}.${ext}` */
export function generateFilename(ext: string, now = Date.now()): string {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${now}-${hex}.${ext}`;
}

/** Reject path tricks. Filenames we generate are always `digits-hex.ext`. */
export function isSafeFilename(filename: string): boolean {
  return /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/.test(filename) && !filename.includes("..");
}

export function parseUploadUrl(
  url: unknown,
): { folder: UploadFolder; filename: string } | null {
  if (typeof url !== "string" || !url.startsWith(UPLOAD_URL_PREFIX)) return null;
  const rest = url.slice(UPLOAD_URL_PREFIX.length).split("?")[0];
  const parts = rest.split("/");
  if (parts.length !== 2) return null;
  const [folder, filename] = parts;
  if (!isUploadFolder(folder) || !isSafeFilename(filename)) return null;
  return { folder, filename };
}

export function buildUploadUrl(folder: UploadFolder, filename: string): string {
  return `${UPLOAD_URL_PREFIX}${folder}/${filename}`;
}

/** Legacy disk-based uploads (`/uploads/...`) no longer exist on serverless hosts. */
export function isLegacyUploadUrl(url: unknown): boolean {
  return typeof url === "string" && /^\/uploads\//.test(url);
}

/** Use for any image URL that may come from the CMS. */
export function safeImageSrc(url: string | null | undefined): string {
  if (!url) return PLACEHOLDER_IMAGE;
  if (isLegacyUploadUrl(url)) return PLACEHOLDER_IMAGE;
  return url;
}

/** Basic CSRF defence for cookie-authenticated mutating routes. */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true; // non-browser / same-origin requests may omit it
  try {
    const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
