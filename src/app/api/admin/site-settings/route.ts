import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/session";
import { connectMongoose } from "@/lib/db/mongoose";
import { isDatabaseConfigured } from "@/lib/env";
import { SiteSettings } from "@/models/SiteSettings";
import { writeAudit } from "@/lib/audit";
import { revalidatePath } from "next/cache";
import { sanitizeRichHtml, sanitizeUrl } from "@/lib/cms/sanitize";
import { cleanupReplacedUploads } from "@/lib/upload-cleanup";
import { isSameOrigin } from "@/lib/uploads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const optionalEmail = z.union([z.string().trim().email().max(200), z.literal("")]);
const optionalUrl = z.union([z.string().trim().url().max(1000), z.literal("")]);
const imageUrl = z.union([
  z.string().trim().max(500).regex(/^(\/[^/\\].*|https:\/\/.+)$/, "Invalid image URL"),
  z.literal(""),
]);

const patchSchema = z.object({
  announcement: z
    .object({
      text: z.string().max(500).optional(),
      visible: z.boolean().optional(),
    })
    .optional(),
  headlines: z
    .object({
      main: z.string().max(300).optional(),
      quote: z.string().max(1000).optional(),
      supporting: z.string().max(1000).optional(),
      secondary: z.string().max(300).optional(),
      hashtags: z.string().max(1000).optional(),
    })
    .optional(),
  league: z
    .object({
      registrationOpen: z.boolean().optional(),
      firstTeamFeeCents: z.number().int().positive().max(10_000_000).optional(),
      additionalTeamFeeCents: z.number().int().positive().max(10_000_000).optional(),
      teamsPerDivisionCapacity: z.number().int().min(1).max(32).optional(),
      aboutHtml: z.string().max(100_000).optional(),
      eligibilityHtml: z.string().max(100_000).optional(),
      mountiesPhilosophyHtml: z.string().max(100_000).optional(),
      nfhsStreamUrl: optionalUrl.optional(),
      gearStoreUrl: z.string().max(1000).optional(),
      activeSeasonSlug: z.string().trim().min(1).max(40).optional(),
      notificationEmails: z.array(z.string().email()).max(20).optional(),
    })
    .optional(),
  contact: z
    .object({
      primaryName: z.string().trim().max(200).optional(),
      primaryEmail: optionalEmail.optional(),
      primaryPhone: z.string().trim().max(60).optional(),
      programEmail: optionalEmail.optional(),
      mailingAddress: z.string().trim().max(300).optional(),
      gameVenueName: z.string().trim().max(200).optional(),
      gameVenueAddress: z.string().trim().max(300).optional(),
      facebookPageName: z.string().trim().max(200).optional(),
      facebookUrl: z.string().trim().max(1000).optional(),
    })
    .optional(),
  brand: z
    .object({
      emblem: imageUrl.optional(),
      seasonPoster: imageUrl.optional(),
    })
    .optional(),
  motionIntensity: z.enum(["high", "medium", "low"]).optional(),
});

const BRAND_FIELDS = ["emblem", "seasonPoster"] as const;

async function ensureDoc() {
  return SiteSettings.findOneAndUpdate(
    { key: "main" },
    { $setOnInsert: { key: "main" } },
    { upsert: true, new: true },
  ).lean();
}

export async function GET() {
  const auth = await requireAdmin("brand");
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
  }
  await connectMongoose();
  const doc = await ensureDoc();
  return NextResponse.json(doc);
}

export async function PATCH(request: Request) {
  const auth = await requireAdmin("brand");
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Cross-origin request blocked." }, { status: 403 });
  }
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
  }
  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    const where = first?.path.join(".") ?? "form";
    return NextResponse.json(
      { error: `Invalid value for ${where}. ${first?.message ?? ""}`.trim() },
      { status: 400 },
    );
  }

  const data = parsed.data;
  if (data.league?.aboutHtml !== undefined) data.league.aboutHtml = sanitizeRichHtml(data.league.aboutHtml);
  if (data.league?.eligibilityHtml !== undefined) {
    data.league.eligibilityHtml = sanitizeRichHtml(data.league.eligibilityHtml);
  }
  if (data.league?.mountiesPhilosophyHtml !== undefined) {
    data.league.mountiesPhilosophyHtml = sanitizeRichHtml(data.league.mountiesPhilosophyHtml);
  }
  if (data.league?.gearStoreUrl) {
    const clean = sanitizeUrl(data.league.gearStoreUrl);
    if (!clean) {
      return NextResponse.json({ error: "Gear store link must start with https://." }, { status: 400 });
    }
    data.league.gearStoreUrl = clean;
  }
  if (data.contact?.facebookUrl) {
    const clean = sanitizeUrl(data.contact.facebookUrl);
    if (!clean) {
      return NextResponse.json({ error: "Facebook link must start with https://." }, { status: 400 });
    }
    data.contact.facebookUrl = clean;
  }

  await connectMongoose();
  const before = (await ensureDoc()) as unknown as { brand?: Record<string, { url?: string } | undefined> };

  const $set: Record<string, unknown> = {};
  const $unset: Record<string, 1> = {};
  for (const [key, value] of Object.entries(data)) {
    if (key === "brand") continue;
    if (value && typeof value === "object") {
      for (const [sub, subVal] of Object.entries(value)) {
        if (subVal !== undefined) $set[`${key}.${sub}`] = subVal;
      }
    } else if (value !== undefined) {
      $set[key] = value;
    }
  }
  const beforeUrls: string[] = [];
  const afterUrls: string[] = [];
  for (const f of BRAND_FIELDS) {
    const v = data.brand?.[f];
    if (v === undefined) continue;
    beforeUrls.push(before.brand?.[f]?.url ?? "");
    if (v === "") $unset[`brand.${f}`] = 1;
    else {
      $set[`brand.${f}`] = { url: v, alt: f === "emblem" ? "P-O Select League emblem" : "Season poster" };
      afterUrls.push(v);
    }
  }

  const update: Record<string, unknown> = {};
  if (Object.keys($set).length) update.$set = $set;
  if (Object.keys($unset).length) update.$unset = $unset;
  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Nothing to save." }, { status: 400 });
  }

  const doc = await SiteSettings.findOneAndUpdate({ key: "main" }, update, {
    new: true,
    upsert: true,
  }).lean();

  await cleanupReplacedUploads(beforeUrls, afterUrls);

  await writeAudit({
    actorId: auth.userId,
    actorEmail: auth.email,
    action: "site_settings.update",
    resource: "SiteSettings",
    metadata: { fields: Object.keys(data) },
  }).catch(() => undefined);

  revalidatePath("/", "layout");

  return NextResponse.json(doc);
}
