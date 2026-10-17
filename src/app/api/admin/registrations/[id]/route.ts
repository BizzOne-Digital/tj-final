import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/session";
import { connectMongoose } from "@/lib/db/mongoose";
import { Registration } from "@/models/Registration";
import { writeAudit } from "@/lib/audit";

const patchSchema = z.object({
  status: z
    .enum(["submitted", "accepted", "waitlisted", "rejected", "cancelled"])
    .optional(),
  paymentStatus: z.enum(["unpaid", "pending", "paid", "refunded"]).optional(),
  paymentNotes: z.string().max(2000).optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin("registrations");
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }
  const { id } = await params;
  const body = await request.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  await connectMongoose();
  const doc = await Registration.findByIdAndUpdate(id, { $set: parsed.data }, { new: true });
  if (!doc) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await writeAudit({
    actorId: auth.userId,
    actorEmail: auth.email,
    action: "registration.update",
    resource: "Registration",
    resourceId: id,
    metadata: parsed.data,
  });

  return NextResponse.json(doc);
}
