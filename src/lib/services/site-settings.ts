import { connectMongoose } from "@/lib/db/mongoose";
import { SiteSettings } from "@/models/SiteSettings";
import { isDatabaseConfigured } from "@/lib/env";
import { previewSiteSettings } from "@/lib/preview/fixtures";

export async function getSiteSettings() {
  if (!isDatabaseConfigured()) {
    return previewSiteSettings();
  }
  await connectMongoose();
  const doc = await SiteSettings.findOne({ key: "main" }).lean();
  if (!doc) return previewSiteSettings();
  return JSON.parse(JSON.stringify(doc));
}
