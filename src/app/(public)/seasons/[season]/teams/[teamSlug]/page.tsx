import Link from "next/link";
import { notFound } from "next/navigation";
import { connectMongoose } from "@/lib/db/mongoose";
import { SeasonTeam } from "@/models/SchoolProgram";
import { Season } from "@/models/Season";
import { isDatabaseConfigured } from "@/lib/env";
import { InnerPage } from "@/components/public/InnerPage";
import { ContentImage, ScheduleImageGrid } from "@/components/public/ContentImage";
import { schoolScheduleImages, schoolTeamImage } from "@/lib/drive-assets";

function schoolSlugFromTeamSlug(teamSlug: string): string {
  const m = /^(.+)-grades-\d-\d$/.exec(teamSlug);
  return m ? m[1] : teamSlug;
}

export default async function SeasonTeamDetailPage({
  params,
}: {
  params: Promise<{ season: string; teamSlug: string }>;
}) {
  const { season, teamSlug } = await params;
  if (!isDatabaseConfigured()) notFound();
  await connectMongoose();
  const seasonDoc = await Season.findOne({ slug: season }).lean();
  if (!seasonDoc) notFound();
  const team = await SeasonTeam.findOne({
    seasonId: seasonDoc._id,
    teamSlug,
    publicationStatus: "published",
  })
    .populate("schoolId divisionId")
    .lean();
  if (!team) notFound();

  const schoolSlug = schoolSlugFromTeamSlug(teamSlug);
  const teamImg = schoolTeamImage(schoolSlug);
  const schedules = schoolScheduleImages(schoolSlug);

  return (
    <InnerPage title={team.teamName} subtitle={season}>
      {teamImg && (
        <div className="max-w-md">
          <ContentImage src={teamImg} alt={`${team.teamName} team photo`} size="schoolTeam" />
        </div>
      )}
      {team.coaches?.length ? (
        <p className="mt-6">Coaches: {team.coaches.map((c) => c.name).join(", ")}</p>
      ) : null}
      {schedules.length > 0 && (
        <div className="mt-10">
          <h2 className="font-display text-lg uppercase">Schedule images</h2>
          <ScheduleImageGrid images={schedules} altPrefix={`${team.teamName} schedule`} />
        </div>
      )}
      <p className="mt-6 text-cool-grey">Weekly game links — coming soon.</p>
      <Link href={`/teams/${schoolSlug}`} className="mt-6 inline-block text-electric-blue">
        Full school team page →
      </Link>
      <Link href={`/seasons/${season}/teams`} className="mt-4 block">← Teams</Link>
    </InnerPage>
  );
}
