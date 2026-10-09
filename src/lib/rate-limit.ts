import { connectMongoose } from "@/lib/db/mongoose";
import { RateLimit } from "@/models/System";
import { isDatabaseConfigured } from "@/lib/env";

export async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): Promise<{ allowed: boolean; remaining: number }> {
  if (!isDatabaseConfigured()) {
    return { allowed: true, remaining: limit };
  }

  await connectMongoose();
  const now = new Date();
  const resetAt = new Date(now.getTime() + windowMs);

  const doc = await RateLimit.findOne({ key });
  if (!doc || doc.resetAt < now) {
    await RateLimit.findOneAndUpdate(
      { key },
      { key, count: 1, resetAt },
      { upsert: true },
    );
    return { allowed: true, remaining: limit - 1 };
  }

  if (doc.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  doc.count += 1;
  await doc.save();
  return { allowed: true, remaining: limit - doc.count };
}
