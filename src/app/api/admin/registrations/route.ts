import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { connectMongoose } from "@/lib/db/mongoose";
import { Registration } from "@/models/Registration";

export async function GET() {
  const auth = await requireAdmin("registrations");
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }
  await connectMongoose();
  const items = await Registration.find().sort({ createdAt: -1 }).limit(100).lean();
  return NextResponse.json(items);
}
