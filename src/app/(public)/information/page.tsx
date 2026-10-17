import Link from "next/link";
import { InnerPage } from "@/components/public/InnerPage";
import { ScheduleImageGrid } from "@/components/public/ContentImage";
import { getPublishedResources, type JsonDoc } from "@/lib/services/league";
import { PLAYER_OF_GAME_PROCESS_HTML, TESTIMONIALS_BLURB } from "@/lib/league-copy";
import { driveAsset } from "@/lib/drive-assets";
import { InformationFormsSection } from "@/components/public/InformationFormsSection";
import { LeagueDocLinks } from "@/components/public/LeagueDocLinks";
import { ProseBlock } from "@/components/public/ProseBlock";

const leagueScheduleImages = [
  driveAsset("information.4th-grade-team-schedules"),
  driveAsset("information.6th-grade-team-schedules"),
].filter(Boolean) as string[];

export default async function InformationPage() {
  const resources = await getPublishedResources();
  const grouped = resources.reduce((acc: Record<string, JsonDoc[]>, r) => {
    const cat = String(r.category ?? "forms");
    acc[cat] = acc[cat] ?? [];
    acc[cat].push(r);
    return acc;
  }, {} as Record<string, JsonDoc[]>);

  return (
    <InnerPage title="Information Hub" subtitle="Forms, documents, and league resources">
      <section className="mb-12">
        <h2 className="font-display text-xl uppercase text-ice-white">Basic information</h2>
        <p className="mt-2 text-cool-grey">
          Yearly forms must be completed before the first game. Use the links below or your school team page.
        </p>
        {leagueScheduleImages.length > 0 ? (
          <div className="mt-6 min-w-0">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-electric-blue/80">
              League schedule reference
            </p>
            <ScheduleImageGrid
              images={leagueScheduleImages}
              altPrefix="League schedule"
              posterLayout="page"
            />
          </div>
        ) : null}
      </section>

      <section className="mb-12">
        <InformationFormsSection resources={resources} />
      </section>

      <section className="mb-12">
        <ProseBlock html={PLAYER_OF_GAME_PROCESS_HTML} className="max-w-none" />
      </section>

      <section className="mb-12">
        <ProseBlock html={TESTIMONIALS_BLURB} className="max-w-none" />
      </section>

      <LeagueDocLinks />

      {Object.entries(grouped).map(([cat, items]) => (
        <div key={cat} className="mb-10">
          <h2 className="font-display text-xl uppercase text-ice-white">{cat}</h2>
          <ul className="mt-4 space-y-2">
            {items.map((r) => (
              <li key={String(r.slug)}>
                {r.externalUrl ? (
                  <a
                    href={String(r.externalUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-electric-blue"
                  >
                    {String(r.title)}
                  </a>
                ) : (
                  <Link href={`/information/${r.slug}`} className="text-electric-blue">
                    {String(r.title)}
                  </Link>
                )}
                {r.description ? (
                  <p className="text-sm text-cool-grey">{String(r.description)}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </InnerPage>
  );
}

