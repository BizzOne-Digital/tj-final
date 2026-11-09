import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/session";
import { connectMongoose } from "@/lib/db/mongoose";
import { isDatabaseConfigured } from "@/lib/env";
import { LEAGUE_NEWS_ARTICLES } from "@/lib/news-articles";
import { getCollection, docToForm, formToDoc, slugify } from "@/lib/admin/collections";
import { isSameOrigin } from "@/lib/uploads";
import { writeAudit } from "@/lib/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ collection: string }> };

async function uniqueSlug(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  model: any,
  base: string,
): Promise<string> {
  let slug = base;
  let n = 2;
  while (await model.exists({ slug })) {
    slug = `${base}-${n++}`;
  }
  return slug;
}

export async function GET(_req: Request, ctx: Ctx) {
  const { collection } = await ctx.params;
  const config = getCollection(collection);
  if (!config) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const auth = await requireAdmin(config.module);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });
  if (!isDatabaseConfigured()) return NextResponse.json({ error: "Database is not configured." }, { status: 503 });

  await connectMongoose();
  const docs = await config.model.find().sort(config.sort).lean();
  return NextResponse.json({
    items: docs.map((d: Record<string, unknown>) => docToForm(config, d)),
  });
}

export async function POST(request: Request, ctx: Ctx) {
  const { collection } = await ctx.params;
  const config = getCollection(collection);
  if (!config) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const auth = await requireAdmin(config.module);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Cross-origin request blocked." }, { status: 403 });
  if (!isDatabaseConfigured()) return NextResponse.json({ error: "Database is not configured." }, { status: 503 });

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  await connectMongoose();

  // One-click import of the built-in news articles so they can be edited.
  if (config.key === "news" && body.action === "import-defaults") {
    let imported = 0;
    for (const a of LEAGUE_NEWS_ARTICLES) {
      if (await config.model.exists({ slug: a.slug })) continue;
      await config.model.create({
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt,
        contentHtml: a.contentHtml,
        authorName: a.authorName,
        categories: a.categories,
        featured: Boolean(a.featured),
        publishedAt: new Date(a.publishedAt),
        publicationStatus: "published",
      });
      imported++;
    }
    revalidatePath("/", "layout");
    return NextResponse.json({ success: true, imported });
  }

  const converted = formToDoc(config, (body.record ?? body) as Record<string, unknown>);
  if (!converted.ok) return NextResponse.json({ error: converted.error }, { status: 400 });

  const doc: Record<string, unknown> = { ...converted.set };
  if (config.slugFrom) {
    doc.slug = await uniqueSlug(config.model, slugify(String(doc[config.slugFrom] ?? "")));
  }
  if (config.key === "news" && !doc.publishedAt) doc.publishedAt = new Date();

  const created = await config.model.create(doc);

  await writeAudit({
    actorId: auth.userId,
    actorEmail: auth.email,
    action: `${config.key}.create`,
    resource: config.key,
    resourceId: String(created._id),
  }).catch(() => undefined);

  revalidatePath("/", "layout");
  return NextResponse.json({ success: true, id: String(created._id) });
}
