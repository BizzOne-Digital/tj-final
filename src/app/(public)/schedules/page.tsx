import Link from "next/link";
import { InnerPage } from "@/components/public/InnerPage";
import { ScheduleImageGrid } from "@/components/public/ContentImage";
import { getSchools } from "@/lib/services/league";
import { getCms } from "@/lib/cms/content";
import { schoolMedia } from "@/lib/cms/school-media";

export default async function SchedulesPage() {
  const cms = await getCms();
  const schools = await getSchools();

  const leagueSchedules = [
    { src: cms.image("schedules.poster34"), label: cms.text("schedules.poster34.label") },
    { src: cms.image("schedules.poster56"), label: cms.text("schedules.poster56.label") },
  ].filter((p) => p.src);

  const schoolsWithSchedules = schools
    .map((s) => ({
      school: s,
      images: schoolMedia(cms, String(s.slug)).schedules,
    }))
    .filter((row) => row.images.length > 0);

  return (
    <InnerPage title={cms.text("schedules.title")} subtitle={cms.text("schedules.subtitle")}>
      <div className="space-y-14">
        <section>
          <h2 className="font-display text-xl uppercase text-ice-white sm:text-2xl">
            {cms.text("schedules.league.heading")}
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-cool-grey sm:text-base">{cms.text("schedules.league.intro")}</p>
          {leagueSchedules.length > 0 ? (
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              {leagueSchedules.map(({ src, label }) => (
                <div
                  key={src}
                  className="gradient-card min-w-0 rounded-2xl border border-electric-blue/15 p-4 sm:p-5"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-electric-blue sm:text-xs">
                    {label}
                  </p>
                  <div className="mt-4">
                    <ScheduleImageGrid images={[src]} altPrefix="League schedule" posterLayout="page" />
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </section>

        <section>
          <h2 className="font-display text-xl uppercase text-ice-white sm:text-2xl">
            {cms.text("schedules.schools.heading")}
          </h2>
          <p className="mt-2 text-sm text-cool-grey">{cms.text("schedules.schools.intro")}</p>
          <ul className="mt-8 grid min-w-0 gap-6 sm:grid-cols-2 xl:grid-cols-2">
            {schoolsWithSchedules.map(({ school, images }) => (
              <li
                key={String(school.slug)}
                className="gradient-card gradient-card-hover flex min-w-0 flex-col rounded-2xl border border-white/10 p-4 sm:p-5"
              >
                <Link
                  href={`/teams/${school.slug}`}
                  className="font-display text-base font-bold uppercase text-electric-blue hover:text-ice-white sm:text-lg"
                >
                  {String(school.name)}
                </Link>
                <div className="mt-4 min-w-0 flex-1">
                  <ScheduleImageGrid
                    images={images}
                    altPrefix={`${school.name} schedule`}
                    posterLayout="page"
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-8">
          <Link href="/standings" className="text-sm font-semibold text-electric-blue hover:underline">
            Standings &amp; scores →
          </Link>
          <Link href="/teams" className="text-sm font-semibold text-cool-grey hover:text-electric-blue">
            Team directory →
          </Link>
        </div>
      </div>
    </InnerPage>
  );
}
