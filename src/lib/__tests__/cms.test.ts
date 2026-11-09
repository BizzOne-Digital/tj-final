import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import {
  CMS_PAGES,
  SCHOOL_SLUGS,
  allStaticKeys,
  resolveField,
  schoolFieldKey,
} from "@/lib/cms/registry";
import { createCms } from "@/lib/cms/content";
import { normaliseValue } from "@/lib/cms/normalise";
import { sanitizeRichHtml, sanitizeUrl } from "@/lib/cms/sanitize";
import { COLLECTIONS, formToDoc, getCollection, slugify } from "@/lib/admin/collections";
import { allStandingsHubBlocks, applyBlockOverrides } from "@/lib/hub-sections";

describe("registry integrity", () => {
  it("has unique page slugs and unique full keys", () => {
    const slugs = CMS_PAGES.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    let count = 0;
    const seen = new Set<string>();
    for (const p of CMS_PAGES) {
      for (const s of p.sections) {
        for (const f of s.fields) {
          const key = `${p.slug}.${f.key}`;
          expect(seen.has(key), `duplicate key ${key}`).toBe(false);
          seen.add(key);
          count++;
        }
      }
    }
    expect(count).toBeGreaterThan(250);
    expect(allStaticKeys().length).toBe(count);
  });

  it("defaults match their field kind", () => {
    for (const p of CMS_PAGES) {
      for (const s of p.sections) {
        for (const f of s.fields) {
          if (f.kind === "images") expect(Array.isArray(f.default), `${p.slug}.${f.key}`).toBe(true);
          else expect(typeof f.default, `${p.slug}.${f.key}`).toBe("string");
          expect(f.label.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it("keeps stored html defaults safe (survive sanitising unchanged in meaning)", () => {
    for (const p of CMS_PAGES) {
      for (const s of p.sections) {
        for (const f of s.fields) {
          if (f.kind === "html" && typeof f.default === "string") {
            expect(f.default).not.toMatch(/<script/i);
          }
        }
      }
    }
  });

  it("resolves per-school media keys only for known schools", () => {
    expect(SCHOOL_SLUGS).toContain("clearfield");
    expect(resolveField(schoolFieldKey("clearfield", "schedules"))?.kind).toBe("images");
    expect(resolveField(schoolFieldKey("clearfield", "team"))?.kind).toBe("image");
    expect(resolveField("school.not-a-school.team")).toBeUndefined();
    expect(resolveField("school.clearfield.other")).toBeUndefined();
    expect(resolveField("nope.key")).toBeUndefined();
    expect(resolveField("home.hero.line1")?.default).toBe("Small Hands.");
  });

  it("clearfield built-in schedules include the new 3/4 poster first", () => {
    const f = resolveField(schoolFieldKey("clearfield", "schedules"));
    expect((f?.default as string[])[0]).toContain("schedule-grades-3-4");
  });

  it("league posters default to the new v2 images", () => {
    expect(resolveField("schedules.poster34")?.default).toContain("4th-grade-team-schedules-v2");
    expect(resolveField("schedules.poster56")?.default).toContain("6th-grade-team-schedules-v2");
  });
});

/** Every literal key used in the source must exist in the registry. */
describe("code uses only registered keys", () => {
  const root = path.join(process.cwd(), "src");
  const files: string[] = [];
  (function walk(dir: string) {
    for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, name.name);
      if (name.isDirectory()) walk(p);
      else if (/\.(tsx?|ts)$/.test(name.name) && !p.includes("__tests__")) files.push(p);
    }
  })(root);

  it("finds registered keys for every cms.text/html/image/images call", () => {
    const re = /cms\.(?:text|html|image|images|isCustom)\(\s*"([^"]+)"/g;
    const used = new Set<string>();
    for (const f of files) {
      const src = fs.readFileSync(f, "utf8");
      for (const m of src.matchAll(re)) used.add(m[1]);
      for (const m of src.matchAll(/htmlWithFallback\(\s*cms\s*,\s*"([^"]+)"/g)) used.add(m[1]);
    }
    expect(used.size).toBeGreaterThan(80);
    const missing = [...used].filter((k) => !resolveField(k));
    expect(missing).toEqual([]);
  });

  it("covers templated pillar keys", () => {
    for (const n of [1, 2, 3]) {
      expect(resolveField(`about.pillar${n}.title`)).toBeDefined();
      expect(resolveField(`about.pillar${n}.text`)).toBeDefined();
    }
  });
});

describe("cms accessor", () => {
  it("returns defaults when nothing is overridden", () => {
    const cms = createCms(new Map());
    expect(cms.text("home.hero.line1")).toBe("Small Hands.");
    expect(cms.isCustom("home.hero.line1")).toBe(false);
    expect(cms.images("gallery.photos")).toEqual([]);
  });

  it("uses overrides and ignores blank ones", () => {
    const cms = createCms(
      new Map<string, unknown>([
        ["home.hero.line1", "Hello."],
        ["home.hero.line2", "   "],
        ["gallery.photos", ["/api/uploads/gallery/1-ab.png", "/uploads/legacy.png"]],
        ["schedules.poster34", "/api/uploads/pages/1-ab.png"],
      ]),
    );
    expect(cms.text("home.hero.line1")).toBe("Hello.");
    expect(cms.text("home.hero.line2")).toBe("Big Dreams.");
    expect(cms.images("gallery.photos")).toEqual(["/api/uploads/gallery/1-ab.png", "/brand/placeholder.svg"]);
    expect(cms.image("schedules.poster34")).toBe("/api/uploads/pages/1-ab.png");
  });

  it("an explicit empty list overrides a non-empty default (hide all posters)", () => {
    const key = schoolFieldKey("clearfield", "schedules");
    const cms = createCms(new Map<string, unknown>([[key, []]]));
    expect(cms.images(key)).toEqual([]);
  });

  it("legacy /uploads/ image override becomes the placeholder", () => {
    const cms = createCms(new Map<string, unknown>([["about.image", "/uploads/old.png"]]));
    expect(cms.image("about.image")).toBe("/brand/placeholder.svg");
  });
});

describe("save validation (normaliseValue)", () => {
  const f = (key: string) => resolveField(key)!;

  it("strips scripts, event handlers and javascript: links from html", () => {
    const res = normaliseValue(
      f("join-us.html"),
      `<p onclick="x()">Hi</p><script>alert(1)</script><a href="javascript:alert(1)">bad</a><a href="https://ok.example" target="_blank">ok</a><img src=x onerror=alert(1)>`,
    );
    expect(res.ok).toBe(true);
    const html = (res as { value: string }).value;
    expect(html).not.toMatch(/script|onclick|onerror|javascript:/i);
    expect(html).toContain('href="https://ok.example"');
    expect(html).toContain('rel="noopener noreferrer"');
  });

  it("treats a value equal to the default (or blank) as 'no override'", () => {
    expect(normaliseValue(f("home.hero.line1"), "Small Hands.")).toEqual({ ok: true, value: null });
    expect(normaliseValue(f("home.hero.line1"), "   ")).toEqual({ ok: true, value: null });
    expect(normaliseValue(f("home.hero.line1"), "New")).toEqual({ ok: true, value: "New" });
  });

  it("validates urls", () => {
    expect(normaliseValue(f("gear-store.url"), "javascript:alert(1)").ok).toBe(false);
    expect(normaliseValue(f("gear-store.url"), "https://shop.example/x")).toEqual({
      ok: true,
      value: "https://shop.example/x",
    });
    expect(sanitizeUrl("//evil.example")).toBe("");
    expect(sanitizeUrl("/relative")).toBe("/relative");
    expect(sanitizeUrl("mailto:a@b.co")).toBe("mailto:a@b.co");
  });

  it("validates image urls", () => {
    expect(normaliseValue(f("about.image"), "/api/uploads/pages/1-ab.png")).toEqual({
      ok: true,
      value: "/api/uploads/pages/1-ab.png",
    });
    expect(normaliseValue(f("about.image"), "javascript:alert(1)").ok).toBe(false);
    expect(normaliseValue(f("about.image"), "http://insecure.example/x.png").ok).toBe(false);
    expect(normaliseValue(f("about.image"), "//evil.example/x.png").ok).toBe(false);
    expect(normaliseValue(f("gallery.photos"), ["/api/uploads/gallery/1-ab.png"]).ok).toBe(true);
    expect(normaliseValue(f("gallery.photos"), ["data:image/png;base64,AAAA"]).ok).toBe(false);
    expect(normaliseValue(f("gallery.photos"), "not-an-array").ok).toBe(false);
  });

  it("enforces length limits", () => {
    expect(normaliseValue(f("home.hero.line1"), "x".repeat(501)).ok).toBe(false);
    expect(normaliseValue(f("join-us.html"), "x".repeat(100_001)).ok).toBe(false);
  });

  it("sanitiser keeps site styling classes", () => {
    expect(sanitizeRichHtml('<p class="mt-4 text-cool-grey">x</p>')).toContain('class="mt-4 text-cool-grey"');
  });
});

describe("hub block overrides", () => {
  it("replaces coming-soon text with edited html only where overridden", () => {
    const blocks = allStandingsHubBlocks();
    const out = applyBlockOverrides(blocks, (id) => (id === "2026-27-4th-grade-week-1" ? "<p>W 40-20</p>" : undefined));
    const find = (bs: typeof blocks, id: string): (typeof blocks)[number] | undefined => {
      for (const b of bs) {
        if (b.id === id) return b;
        const c = b.children && find(b.children, id);
        if (c) return c;
      }
    };
    expect(find(out, "2026-27-4th-grade-week-1")?.html).toBe("<p>W 40-20</p>");
    expect(find(out, "2026-27-4th-grade-week-1")?.body).toBeUndefined();
    expect(find(out, "2026-27-4th-grade-week-2")?.body).toBe("More information coming soon.");
  });

  it("every editable hub block is registered", () => {
    expect(resolveField("standings.blocks.2026-27-4th-grade-week-1")).toBeDefined();
    expect(resolveField("playoffs.blocks.playoff-2026-27-4th")).toBeDefined();
    expect(resolveField("awards.blocks.champ-2026-27-4th")).toBeDefined();
  });
});

describe("admin collections", () => {
  it("only exposes whitelisted collections", () => {
    expect(getCollection("news")).toBeDefined();
    expect(getCollection("faq")).toBeDefined();
    expect(getCollection("leadership")).toBeDefined();
    expect(getCollection("adminusers")).toBeUndefined();
    expect(getCollection("__proto__")).toBeUndefined();
    expect(getCollection("constructor")).toBeUndefined();
  });

  it("converts and sanitises a news article form", () => {
    const res = formToDoc(COLLECTIONS.news, {
      title: "  Big News ",
      excerpt: "Short",
      contentHtml: "<p>Hi</p><script>x()</script>",
      coverImage: "/api/uploads/gallery/1-ab.png",
      categories: "A, B, a, ,B",
      authorName: "Me",
      publishedAt: "2026-11-20",
      featured: true,
      publicationStatus: "published",
    });
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    expect(res.set.title).toBe("Big News");
    expect(String(res.set.contentHtml)).not.toMatch(/script/i);
    expect(res.set.categories).toEqual(["A", "B", "a"]);
    expect(res.set.coverImage).toEqual({ url: "/api/uploads/gallery/1-ab.png", alt: "Big News" });
    expect(res.set.publishedAt).toBeInstanceOf(Date);
  });

  it("requires required fields and valid select/image values", () => {
    const base = { title: "T", contentHtml: "<p>x</p>", publicationStatus: "published" };
    expect(formToDoc(COLLECTIONS.news, { ...base, title: " " }).ok).toBe(false);
    expect(formToDoc(COLLECTIONS.news, { ...base, publicationStatus: "hacked" }).ok).toBe(false);
    expect(formToDoc(COLLECTIONS.news, { ...base, coverImage: "javascript:alert(1)" }).ok).toBe(false);
    expect(formToDoc(COLLECTIONS.leadership, { name: "A", email: "nope", publicationStatus: "published" }).ok).toBe(false);
  });

  it("slugifies titles safely", () => {
    expect(slugify("Registration Open: 2026-27!")).toBe("registration-open-2026-27");
    expect(slugify("   ")).toBe("item");
    expect(slugify("../../etc/passwd")).toBe("etc-passwd");
  });
});
