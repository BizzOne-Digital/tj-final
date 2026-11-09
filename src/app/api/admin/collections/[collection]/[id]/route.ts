import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import { requireAdmin } from "@/lib/auth/session";
import { connectMongoose } from "@/lib/db/mongoose";
import { isDatabaseConfigured } from "@/lib/env";
import { getCollection, formToDoc, imageUrlsOf } from "@/lib/admin/collections";
import { cleanupReplacedUploads } from "@/lib/upload-cleanup";
import { isSameOrigin } from "@/lib/uploads";
import { writeAudit } from "@/lib/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ collection: string; id: string }> };

async function guard(request: Request, ctx: Ctx) {
  const { collection, id } = await ctx.params;
  const config = getCollection(collection);
  if (!config) return { error: NextResponse.json({ error: "Not found" }, { status: 404 }) };
  const auth = await requireAdmin(config.module);
  if (!auth.ok) return { error: NextResponse.json({ error: auth.message }, { status: auth.status }) };
  if (!isSameOrigin(request)) {
    return { error: NextResponse.json({ error: "Cross-origin request blocked." }, { status: 403 }) };
  }
  if (!isDatabaseConfigured()) {
    return { error: NextResponse.json({ error: "Database is not configured." }, { status: 503 }) };
  }
  if (!mongoose.isValidObjectId(id)) {
    return { error: NextResponse.json({ error: "Invalid id." }, { status: 400 }) };
  }
  return { config, auth, id };
}

export async function PATCH(request: Request, ctx: Ctx) {
  const g = await guard(request, ctx);
  if ("error" in g) return g.error;
  const { config, auth, id } = g;

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const converted = formToDoc(config, (body.record ?? body) as Record<string, unknown>);
  if (!converted.ok) return NextResponse.json({ error: converted.error }, { status: 400 });

  await connectMongoose();
  const before = await config.model.findById(id).lean();
  if (!before) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const update: Record<string, unknown> = { $set: converted.set };
  if (converted.unset.length > 0) {
    update.$unset = Object.fromEntries(converted.unset.map((k) => [k, 1]));
  }
  const after = await config.model.findByIdAndUpdate(id, update, { new: true }).lean();

  await cleanupReplacedUploads(imageUrlsOf(config, before), imageUrlsOf(config, after));

  await writeAudit({
    actorId: auth.userId,
    actorEmail: auth.email,
    action: `${config.key}.update`,
    resource: config.key,
    resourceId: id,
  }).catch(() => undefined);

  revalidatePath("/", "layout");
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request, ctx: Ctx) {
  const g = await guard(request, ctx);
  if ("error" in g) return g.error;
  const { config, auth, id } = g;

  await connectMongoose();
  const before = await config.model.findById(id).lean();
  if (!before) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await config.model.deleteOne({ _id: id });
  await cleanupReplacedUploads(imageUrlsOf(config, before), []);

  await writeAudit({
    actorId: auth.userId,
    actorEmail: auth.email,
    action: `${config.key}.delete`,
    resource: config.key,
    resourceId: id,
  }).catch(() => undefined);

  revalidatePath("/", "layout");
  return NextResponse.json({ success: true });
}
