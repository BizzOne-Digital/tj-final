import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/session";
import { connectMongoose } from "@/lib/db/mongoose";
import { Resource } from "@/models/Resource";
import { revalidatePath } from "next/cache";

const patchSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  externalUrl: z.string().url().optional().or(z.literal("")),
  description: z.string().optional(),
  sortOrder: z.number().optional(),
  publicationStatus: z.enum(["draft", "published"]).optional(),
});

export async function GET() {
  const auth = await requireAdmin("resources");
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }
  await connectMongoose();
  const items = await Resource.find().sort({ sortOrder: 1 }).lean();
  return NextResponse.json(items);
}

export async function PATCH(request: Request) {
  const auth = await requireAdmin("resources");
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }
  const parsed = patchSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { id, ...update } = parsed.data;
  await connectMongoose();
  const doc = await Resource.findByIdAndUpdate(id, { $set: update }, { new: true });
  revalidatePath("/information");
  return NextResponse.json(doc);
}
