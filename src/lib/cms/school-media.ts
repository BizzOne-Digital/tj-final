import type { Cms } from "@/lib/cms/content";
import { schoolFieldKey } from "@/lib/cms/registry";

/** Team photo + schedule posters for a school (admin overrides, else built-in files). */
export function schoolMedia(cms: Cms, slug: string): { team: string | undefined; schedules: string[] } {
  const team = cms.image(schoolFieldKey(slug, "team"));
  return {
    team: team || undefined,
    schedules: cms.images(schoolFieldKey(slug, "schedules")),
  };
}
