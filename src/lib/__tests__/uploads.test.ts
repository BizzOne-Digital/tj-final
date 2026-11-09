import { describe, expect, it } from "vitest";
import {
  PLACEHOLDER_IMAGE,
  buildUploadUrl,
  extensionForMime,
  generateFilename,
  isAllowedMime,
  isLegacyUploadUrl,
  isSafeFilename,
  isUploadFolder,
  parseUploadUrl,
  safeImageSrc,
  sniffImageMime,
} from "@/lib/upload-shared";

const PNG = Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0]);
const JPG = Uint8Array.from([0xff, 0xd8, 0xff, 0xe0, 0, 0]);
const GIF = Uint8Array.from([0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0]);
const WEBP = Uint8Array.from([0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50]);
const SVG = new TextEncoder().encode("<svg xmlns='http://www.w3.org/2000/svg'><script>alert(1)</script></svg>");
const HTML = new TextEncoder().encode("<html><script>alert(1)</script></html>");

describe("upload validation", () => {
  it("accepts only the four whitelisted folders", () => {
    for (const f of ["products", "gallery", "pages", "misc"]) expect(isUploadFolder(f)).toBe(true);
    for (const f of ["", "../etc", "uploads", "Pages", "pages/", undefined, null, 5]) {
      expect(isUploadFolder(f)).toBe(false);
    }
  });

  it("accepts only jpeg/png/webp/gif mime types (no svg)", () => {
    for (const m of ["image/jpeg", "image/png", "image/webp", "image/gif"]) expect(isAllowedMime(m)).toBe(true);
    for (const m of ["image/svg+xml", "text/html", "application/pdf", "", undefined]) {
      expect(isAllowedMime(m)).toBe(false);
    }
  });

  it("detects the real file type from magic bytes", () => {
    expect(sniffImageMime(PNG)).toBe("image/png");
    expect(sniffImageMime(JPG)).toBe("image/jpeg");
    expect(sniffImageMime(GIF)).toBe("image/gif");
    expect(sniffImageMime(WEBP)).toBe("image/webp");
  });

  it("rejects SVG, HTML and empty content even if the client claims an image type", () => {
    expect(sniffImageMime(SVG)).toBeNull();
    expect(sniffImageMime(HTML)).toBeNull();
    expect(sniffImageMime(new Uint8Array())).toBeNull();
  });

  it("maps mime types to extensions", () => {
    expect(extensionForMime("image/jpeg")).toBe("jpg");
    expect(extensionForMime("image/png")).toBe("png");
    expect(extensionForMime("image/webp")).toBe("webp");
    expect(extensionForMime("image/gif")).toBe("gif");
  });
});

describe("filenames and urls", () => {
  it("generates `${Date.now()}-${hex}.${ext}` and is unique", () => {
    const a = generateFilename("png", 1700000000000);
    expect(a).toMatch(/^1700000000000-[0-9a-f]{16}\.png$/);
    expect(generateFilename("png", 1700000000000)).not.toBe(a);
  });

  it("rejects path traversal and separators in filenames", () => {
    expect(isSafeFilename("1700000000000-abcdef0123456789.png")).toBe(true);
    for (const bad of ["..", "../x.png", "a/b.png", "a\\b.png", ".hidden", "a..b.png", "", "x".repeat(200)]) {
      expect(isSafeFilename(bad)).toBe(false);
    }
  });

  it("round-trips upload urls and rejects anything else", () => {
    const url = buildUploadUrl("pages", "1-ab.png");
    expect(url).toBe("/api/uploads/pages/1-ab.png");
    expect(parseUploadUrl(url)).toEqual({ folder: "pages", filename: "1-ab.png" });
    expect(parseUploadUrl("/api/uploads/pages/../secret")).toBeNull();
    expect(parseUploadUrl("/api/uploads/nope/1-ab.png")).toBeNull();
    expect(parseUploadUrl("/api/uploads/pages/a/b.png")).toBeNull();
    expect(parseUploadUrl("https://evil.example/api/uploads/pages/1-ab.png")).toBeNull();
    expect(parseUploadUrl("/league-assets/schools/x.png")).toBeNull();
    expect(parseUploadUrl(undefined)).toBeNull();
  });

  it("falls back to a placeholder for legacy /uploads/ urls and empty values", () => {
    expect(isLegacyUploadUrl("/uploads/old.png")).toBe(true);
    expect(isLegacyUploadUrl("/api/uploads/pages/1-ab.png")).toBe(false);
    expect(safeImageSrc("/uploads/old.png")).toBe(PLACEHOLDER_IMAGE);
    expect(safeImageSrc("")).toBe(PLACEHOLDER_IMAGE);
    expect(safeImageSrc(undefined)).toBe(PLACEHOLDER_IMAGE);
    expect(safeImageSrc("/api/uploads/pages/1-ab.png")).toBe("/api/uploads/pages/1-ab.png");
    expect(safeImageSrc("/league-assets/x.png")).toBe("/league-assets/x.png");
  });
});
