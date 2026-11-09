import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/session";
import { connectMongoose } from "@/lib/db/mongoose";
import { isDatabaseConfigured } from "@/lib/env";
import { SchoolProgram } from "@/models/SchoolProgram";
import { SCHOOL_SLUGS } from "@/lib/cms/registry";
import { previewSchools } from "@/lib/preview/fixtures";
import { sanitizeUrl } from "@/lib/cms/sanitize";
import { isSameOrigin } from "@/lib/uploads";
import { writeAudit } from "@/lib/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({
  name: z.string().trim().min(1).max(120),
  programLink: z.string().trim().max(1000).optional().default(""),
  coaches: z
    .array(
      z.object({
        name: z.string().trim().min(1).max(120),
        label: z.string().trim().max(120).optional().default(""),
        email: z.union([z.string().trim().email().max(200), z.literal("")]).optional().default(""),
      }),
    )
    .max(20),
});

export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const auth = await requireAdmin("schools");
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Cross-origin request blocked." }, { status: 403 });
  }
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
  }

  const { slug } = await params;
  if (!SCHOOL_SLUGS.includes(slug)) {
    return NextResponse.json({ error: "Unknown school." }, { status: 404 });
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the school details and coach emails." }, { status: 400 });
  }
  const { name, programLink, coaches } = parsed.data;

  let link = "";
  if (programLink) {
    link = sanitizeUrl(programLink);
    if (!link) {
      return NextResponse.json(
        { error: "Program link must start with https:// or http://." },
        { status: 400 },
      );
    }
  }

  await connectMongoose();
  const fixture = previewSchools.find((s) => s.slug === slug);
  await SchoolProgram.updateOne(
    { slug },
    {
      $set: {
        name,
        programLink: link,
        coachesManaged: true,
        coachBlocks: coaches,
      },
      $setOnInsert: { slug, ...(fixture?.tabAlias ? { tabAlias: fixture.tabAlias } : {}) },
    },
    { upsert: true },
  );

  await writeAudit({
    actorId: auth.userId,
    actorEmail: auth.email,
    action: "school.update",
    resource: "SchoolProgram",
    resourceId: slug,
    metadata: { coaches: coaches.length },
  }).catch(() => undefined);

  revalidatePath("/", "layout");
  return NextResponse.json({ success: true });
}
