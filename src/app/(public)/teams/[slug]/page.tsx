import { notFound } from "next/navigation";
import { InnerPage } from "@/components/public/InnerPage";
import { SchoolTeamSections } from "@/components/public/SchoolTeamSections";
import { getSchoolBySlug, getPublishedResources, getSeasonTeams } from "@/lib/services/league";
import { getSiteSettings } from "@/lib/services/site-settings";

export default async function TeamSchoolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const school = await getSchoolBySlug(slug);
  if (!school) notFound();

  const settings = await getSiteSettings();
  const seasonSlug = settings.league?.activeSeasonSlug ?? "2026-27";
  const teams = await getSeasonTeams(seasonSlug);
  const schoolTeams = teams.filter((t) => {
    const sid = t.schoolId as { slug?: string; _id?: string } | string | undefined;
    if (sid && typeof sid === "object") return sid.slug === slug;
    return false;
  });
  const resources = await getPublishedResources();

  return (
    <InnerPage title={String(school.name)} subtitle="Team profile, forms & schedules">
      <SchoolTeamSections
        school={school}
        seasonSlug={seasonSlug}
        schoolTeams={schoolTeams}
        resources={resources}
      />
    </InnerPage>
  );
}
