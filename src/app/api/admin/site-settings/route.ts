import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/session";
import { connectMongoose } from "@/lib/db/mongoose";
import { SiteSettings } from "@/models/SiteSettings";
import { writeAudit } from "@/lib/audit";
import { revalidatePath } from "next/cache";

const patchSchema = z.object({
  announcement: z
    .object({
      text: z.string().max(500).optional(),
      visible: z.boolean().optional(),
    })
    .optional(),
  headlines: z
    .object({
      main: z.string().optional(),
      quote: z.string().optional(),
      supporting: z.string().optional(),
      secondary: z.string().optional(),
      hashtags: z.string().optional(),
    })
    .optional(),
  league: z
    .object({
      registrationOpen: z.boolean().optional(),
      firstTeamFeeCents: z.number().int().positive().optional(),
      additionalTeamFeeCents: z.number().int().positive().optional(),
      teamsPerDivisionCapacity: z.number().int().min(1).max(32).optional(),
      aboutHtml: z.string().optional(),
      eligibilityHtml: z.string().optional(),
      mountiesPhilosophyHtml: z.string().optional(),
      nfhsStreamUrl: z.string().url().optional(),
      gearStoreUrl: z.string().optional(),
      activeSeasonSlug: z.string().optional(),
      notificationEmails: z.array(z.string().email()).optional(),
    })
    .optional(),
  contact: z
    .object({
      facebookUrl: z.string().optional(),
      primaryEmail: z.string().email().optional(),
      programEmail: z.string().email().optional(),
    })
    .optional(),
  motionIntensity: z.enum(["high", "medium", "low"]).optional(),
});

export async function GET() {
  const auth = await requireAdmin("brand");
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }
  await connectMongoose();
  const doc = await SiteSettings.findOne({ key: "main" }).lean();
  return NextResponse.json(doc);
}

export async function PATCH(request: Request) {
  const auth = await requireAdmin("brand");
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }
  const body = await request.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  await connectMongoose();
  const update: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(parsed.data)) {
    if (value && typeof value === "object") {
      for (const [sub, subVal] of Object.entries(value)) {
        update[`${key}.${sub}`] = subVal;
      }
    } else {
      update[key] = value;
    }
  }

  const doc = await SiteSettings.findOneAndUpdate(
    { key: "main" },
    { $set: update },
    { new: true },
  );

  await writeAudit({
    actorId: auth.userId,
    actorEmail: auth.email,
    action: "site_settings.update",
    resource: "SiteSettings",
    metadata: { fields: Object.keys(parsed.data) },
  });

  revalidatePath("/", "layout");

  return NextResponse.json(doc);
}
