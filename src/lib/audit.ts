import { connectMongoose } from "@/lib/db/mongoose";
import { AuditLog } from "@/models/System";

export async function writeAudit(entry: {
  actorId?: string;
  actorEmail?: string;
  action: string;
  resource?: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
}) {
  await connectMongoose();
  await AuditLog.create(entry);
}
