import Link from "next/link";
import { InnerPage } from "@/components/public/InnerPage";
import { ScheduleImageGrid } from "@/components/public/ContentImage";
import { getPublishedResources, type JsonDoc } from "@/lib/services/league";
import { PLAYER_OF_GAME_PROCESS_HTML, TESTIMONIALS_BLURB } from "@/lib/league-copy";
import { getCms } from "@/lib/cms/content";
import { InformationFormsSection } from "@/components/public/InformationFormsSection";
import { LeagueDocLinks } from "@/components/public/LeagueDocLinks";
import { ProseBlock } from "@/components/public/ProseBlock";

export default async function InformationPage() {
  const resources = await getPublishedResources();
  const cms = await getCms();
  const leagueScheduleImages = [cms.image("schedules.poster34"), cms.image("schedules.poster56")].filter(Boolean);
  const grouped = resources.reduce((acc: Record<string, JsonDoc[]>, r) => {
    const cat = String(r.category ?? "forms");
    acc[cat] = acc[cat] ?? [];
    acc[cat].push(r);
    return acc;
  }, {} as Record<string, JsonDoc[]>);

  return (
    <InnerPage title={cms.text("information.title")} subtitle={cms.text("information.subtitle")}>
      <section className="mb-12">
        <h2 className="font-display text-xl uppercase text-ice-white">{cms.text("information.basic.heading")}</h2>
        <p className="mt-2 text-cool-grey">
          {cms.text("information.basic.intro")}
        </p>
        {leagueScheduleImages.length > 0 ? (
          <div className="mt-6 min-w-0">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-electric-blue/80">
              {cms.text("information.schedule.label")}
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

