import { connectMongoose } from "@/lib/db/mongoose";
import { StoredUpload } from "@/models/StoredUpload";
import { parseUploadUrl } from "@/lib/upload-shared";

export * from "@/lib/upload-shared";

/**
 * Delete helper: if `url` is one of our stored uploads, remove the Mongo document.
 * Safe to call with any string (external / static URLs are ignored).
 */
export async function deleteStoredUploadByUrl(url: unknown): Promise<boolean> {
  const parsed = parseUploadUrl(url);
  if (!parsed) return false;
  await connectMongoose();
  const res = await StoredUpload.deleteOne(parsed);
  return res.deletedCount > 0;
}

/** Delete uploads that were in `before` but are no longer in `after`. */
export async function deleteReplacedUploads(
  before: (string | null | undefined)[],
  after: (string | null | undefined)[],
): Promise<number> {
  const keep = new Set(after.filter(Boolean) as string[]);
  let removed = 0;
  for (const url of before) {
    if (url && !keep.has(url) && (await deleteStoredUploadByUrl(url))) removed++;
  }
  return removed;
}
