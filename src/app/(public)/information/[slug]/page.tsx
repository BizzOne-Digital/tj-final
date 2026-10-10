import Link from "next/link";
import { notFound } from "next/navigation";
import { connectMongoose } from "@/lib/db/mongoose";
import { Resource } from "@/models/Resource";
import { isDatabaseConfigured } from "@/lib/env";
import type { JsonDoc } from "@/lib/services/league";
import { InnerPage } from "@/components/public/InnerPage";
import { ScheduleImageGrid } from "@/components/public/ContentImage";
import { leagueDocUrl } from "@/lib/league-docs";
import { driveAsset } from "@/lib/drive-assets";
import { LeagueDocumentEmbed } from "@/components/public/LeagueDocumentEmbed";
import fs from "fs";
import path from "path";

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
        <ScheduleImageGrid
          images={ROSTER_SCHEDULE_IMAGES}
          altPrefix="League roster schedule"
          posterLayout="page"
        />
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
  const docOnDisk =
    docUrl &&
    fs.existsSync(path.join(process.cwd(), "public", docUrl.replace(/^\//, "").replace(/\//g, path.sep)));

  let resource: JsonDoc | null = null;
  if (isDatabaseConfigured()) {
    await connectMongoose();
    const row = await Resource.findOne({ slug, publicationStatus: "published" }).lean();
    resource = row ? (row as JsonDoc) : null;
  }

  if (!resource && !docUrl) notFound();

  const title = resource?.title ? String(resource.title) : slug.replace(/-/g, " ");
  const subtitle = resource?.category ? String(resource.category) : "League document";

  return (
    <InnerPage title={title} subtitle={subtitle}>
      {resource?.description ? <p>{String(resource.description)}</p> : null}
      {resource?.externalUrl ? (
        <a
          href={String(resource.externalUrl)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-electric-blue"
        >
          Open Google Form ↗
        </a>
      ) : null}
      {docUrl && docOnDisk ? (
        <>
          <LeagueDocumentEmbed docUrl={docUrl} />
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
        </>
      ) : docUrl ? (
        <p className="text-cool-grey">Document file is being updated — check back soon or contact the league office.</p>
      ) : (resource?.document as { url?: string } | undefined)?.url ? (
        <a
          href={String((resource!.document as { url: string }).url)}
          target="_blank"
          rel="noopener noreferrer"
        >
          Download document
        </a>
      ) : !resource?.externalUrl ? (
        <p className="text-cool-grey">Document coming soon.</p>
      ) : null}
      {showRosterSchedules ? <RosterScheduleBlock /> : null}
      <p className="mt-8">
        <Link href="/information">← Back to hub</Link>
      </p>
    </InnerPage>
  );
}
