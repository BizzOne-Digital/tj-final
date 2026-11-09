import { connectMongoose } from "@/lib/db/mongoose";
import { SiteContent } from "@/models/SiteContent";
import { SiteSettings } from "@/models/SiteSettings";
import { BlogPost, StaffMember } from "@/models/Content";
import { SchoolProgram } from "@/models/SchoolProgram";
import { deleteStoredUploadByUrl, parseUploadUrl } from "@/lib/uploads";

/** True if any stored document still points at this upload URL. */
export async function isUploadReferenced(url: string): Promise<boolean> {
  await connectMongoose();
  const checks = await Promise.all([
    SiteContent.exists({ value: url }),
    BlogPost.exists({ "coverImage.url": url }),
    StaffMember.exists({ "photo.url": url }),
    SchoolProgram.exists({ $or: [{ "logo.url": url }, { "banner.url": url }] }),
    SiteSettings.exists({
      $or: [
        { "brand.emblem.url": url },
        { "brand.seasonPoster.url": url },
        { "brand.socialShareImage.url": url },
        { "brand.headerLogo.url": url },
        { "brand.footerLogo.url": url },
        { "brand.mobileLogo.url": url },
        { "brand.nikeMark.url": url },
      ],
    }),
  ]);
  return checks.some(Boolean);
}

/**
 * After a save: delete uploads that were replaced/removed, but only if nothing
 * else still references them. Never throws (cleanup must not fail a save).
 */
export async function cleanupReplacedUploads(
  before: (string | null | undefined)[],
  after: (string | null | undefined)[],
): Promise<number> {
  const keep = new Set(after.filter(Boolean) as string[]);
  let removed = 0;
  for (const url of new Set(before.filter(Boolean) as string[])) {
    if (keep.has(url) || !parseUploadUrl(url)) continue;
    try {
      if (!(await isUploadReferenced(url)) && (await deleteStoredUploadByUrl(url))) removed++;
    } catch (e) {
      console.error("upload cleanup failed", url, e);
    }
  }
  return removed;
}
