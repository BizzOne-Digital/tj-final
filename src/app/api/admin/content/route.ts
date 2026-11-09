import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/session";
import { connectMongoose } from "@/lib/db/mongoose";
import { isDatabaseConfigured } from "@/lib/env";
import { SiteContent } from "@/models/SiteContent";
import { resolveField, type CmsField } from "@/lib/cms/registry";
import { normaliseValue } from "@/lib/cms/normalise";
import { cleanupReplacedUploads } from "@/lib/upload-cleanup";
import { isSameOrigin } from "@/lib/uploads";
import { writeAudit } from "@/lib/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({
  values: z.record(z.string().min(1).max(200), z.union([z.string(), z.array(z.string()), z.null()])),
});

function urlsIn(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === "string");
  return [];
}

export async function PUT(request: Request) {
  const auth = await requireAdmin("pages");
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Cross-origin request blocked." }, { status: 403 });
  }
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const entries = Object.entries(parsed.data.values);
  if (entries.length > 400) {
    return NextResponse.json({ error: "Too many fields in one save." }, { status: 400 });
  }

  const ops: { key: string; field: CmsField; value: string | string[] | null }[] = [];
  const errors: Record<string, string> = {};
  for (const [key, raw] of entries) {
    const field = resolveField(key);
    if (!field) {
      errors[key] = "Unknown field.";
      continue;
    }
    if (key.startsWith("school.")) {
      const schoolAuth = await requireAdmin("schools");
      if (!schoolAuth.ok) {
        errors[key] = "Forbidden.";
        continue;
      }
    }
    const res = normaliseValue(field, raw);
    if (!res.ok) errors[key] = res.error;
    else ops.push({ key, field, value: res.value });
  }
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: "Some fields are invalid.", fields: errors }, { status: 400 });
  }

  await connectMongoose();
  const existing = await SiteContent.find({ key: { $in: ops.map((o) => o.key) } })
    .select("key value")
    .lean();
  const before = new Map(existing.map((d) => [d.key, d.value]));

  const removedUrls: string[] = [];
  const keptUrls: string[] = [];
  for (const op of ops) {
    if (op.value === null) {
      await SiteContent.deleteOne({ key: op.key });
    } else {
      await SiteContent.updateOne(
        { key: op.key },
        { $set: { kind: op.field.kind, value: op.value, updatedBy: auth.email } },
        { upsert: true },
      );
    }
    if (op.field.kind === "image" || op.field.kind === "images") {
      removedUrls.push(...urlsIn(before.get(op.key)));
      keptUrls.push(...urlsIn(op.value));
    }
  }

  const cleaned = await cleanupReplacedUploads(removedUrls, keptUrls);

  await writeAudit({
    actorId: auth.userId,
    actorEmail: auth.email,
    action: "content.update",
    resource: "SiteContent",
    metadata: { keys: ops.map((o) => o.key), imagesCleaned: cleaned },
  }).catch(() => undefined);

  revalidatePath("/", "layout");

  return NextResponse.json({ success: true, saved: ops.length });
}
