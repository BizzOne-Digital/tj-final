import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/session";
import { connectMongoose } from "@/lib/db/mongoose";
import { isDatabaseConfigured } from "@/lib/env";
import { AdminUser } from "@/models/AdminUser";
import { isSameOrigin } from "@/lib/uploads";
import { writeAudit } from "@/lib/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({
  currentPassword: z.string().min(1).max(200),
  newPassword: z.string().min(8, "New password must be at least 8 characters.").max(200),
});

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Cross-origin request blocked." }, { status: 403 });
  }
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request." },
      { status: 400 },
    );
  }
  const { currentPassword, newPassword } = parsed.data;
  if (currentPassword === newPassword) {
    return NextResponse.json({ error: "New password must be different from the current one." }, { status: 400 });
  }

  await connectMongoose();
  const user = await AdminUser.findById(auth.userId);
  if (!user || !user.active) {
    return NextResponse.json({ error: "Account not found." }, { status: 404 });
  }
  const ok = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
  }

  user.passwordHash = await bcrypt.hash(newPassword, 12);
  await user.save();

  await writeAudit({
    actorId: auth.userId,
    actorEmail: auth.email,
    action: "account.password_change",
    resource: "AdminUser",
    resourceId: auth.userId,
  }).catch(() => undefined);

  return NextResponse.json({ success: true });
}
