import Link from "next/link";
import { notFound } from "next/navigation";
import { connectMongoose } from "@/lib/db/mongoose";
import { Resource } from "@/models/Resource";
import { isDatabaseConfigured } from "@/lib/env";
import { InnerPage } from "@/components/public/InnerPage";
import { ScheduleImageGrid } from "@/components/public/ContentImage";
import { leagueDocUrl } from "@/lib/league-docs";
import { driveAsset } from "@/lib/drive-assets";

const ROSTER_SCHEDULE_IMAGES = [
  driveAsset("information.4th-grade-team-schedules"),
  driveAsset("information.6th-grade-team-schedules"),
].filter(Boolean) as string[];

function RosterScheduleBlock() {
  if (!ROSTER_SCHEDULE_IMAGES.length) return null;
  return (
    <section className="mt-8 max-w-4xl">
      <h2 className="font-display text-lg uppercase text-ice-white">League schedule reference</h2>
      <div className="mt-4">
        <ScheduleImageGrid images={ROSTER_SCHEDULE_IMAGES} altPrefix="League roster schedule" />
      </div>
    </section>
  );
}

export default async function InformationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const docUrl = leagueDocUrl(slug);
  const showRosterSchedules = slug === "2026-league-roster";

  if (!isDatabaseConfigured()) {
    return (
      <InnerPage title={slug} subtitle="Form & document">
        {docUrl && (
          <a href={docUrl} target="_blank" rel="noopener noreferrer" className="text-electric-blue">
            Download document ↗
          </a>
        )}
        <p className="mt-4">Connect MongoDB to load form links.</p>
        {showRosterSchedules ? <RosterScheduleBlock /> : null}
      </InnerPage>
    );
  }
  await connectMongoose();
  const resource = await Resource.findOne({ slug, publicationStatus: "published" }).lean();
  if (!resource) notFound();

  return (
    <InnerPage title={resource.title} subtitle={resource.category}>
      {resource.description && <p>{resource.description}</p>}
      {resource.externalUrl ? (
        <a
          href={String(resource.externalUrl)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-electric-blue"
        >
          Open Google Form ↗
        </a>
      ) : null}
      {docUrl ? (
        <p className="mt-4">
          <a
            href={docUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-full border border-electric-blue/40 px-4 py-2 text-sm font-semibold text-electric-blue hover:bg-electric-blue/10"
          >
            Download printable document ↗
          </a>
        </p>
      ) : resource.document?.url ? (
        <a href={String(resource.document.url)} target="_blank" rel="noopener noreferrer">
          Download document
        </a>
      ) : !resource.externalUrl ? (
        <p className="text-cool-grey">Document coming soon.</p>
      ) : null}
      {showRosterSchedules ? <RosterScheduleBlock /> : null}
      <p className="mt-8">
        <Link href="/information">← Back to hub</Link>
      </p>
    </InnerPage>
  );
}
