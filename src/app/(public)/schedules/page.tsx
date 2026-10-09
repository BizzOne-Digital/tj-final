import Link from "next/link";
import { InnerPage } from "@/components/public/InnerPage";
import { ScheduleImageGrid } from "@/components/public/ContentImage";
import { driveAsset, schoolScheduleImages } from "@/lib/drive-assets";
import { getSchools } from "@/lib/services/league";

const league4 = driveAsset("information.4th-grade-team-schedules");
const league6 = driveAsset("information.6th-grade-team-schedules");
const leagueScheduleImages = [league4, league6].filter(Boolean) as string[];

const LEAGUE_SCHEDULE_LABELS = ["4th grade teams", "6th grade teams"] as const;

export default async function SchedulesPage() {
  const schools = await getSchools();
  const schoolsWithSchedules = schools
    .map((s) => ({
      school: s,
      images: schoolScheduleImages(String(s.slug)),
    }))
    .filter((row) => row.images.length > 0);

  return (
    <InnerPage title="Schedules" subtitle="2026-27 season — league & school schedules">
      <div className="space-y-14">
        <section>
          <h2 className="font-display text-xl uppercase text-ice-white sm:text-2xl">League schedules</h2>
          <p className="mt-2 max-w-3xl text-sm text-cool-grey sm:text-base">
            4th and 6th grade team schedules (all schools). Open a school below for coaches and program
            links.
          </p>
          {leagueScheduleImages.length > 0 ? (
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {leagueScheduleImages.map((src, i) => (
                <div
                  key={src}
                  className="gradient-card min-w-0 rounded-2xl border border-electric-blue/15 p-4 sm:p-5"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-electric-blue sm:text-xs">
                    {LEAGUE_SCHEDULE_LABELS[i] ?? "League schedule"}
                  </p>
                  <div className="mt-4">
                    <ScheduleImageGrid
                      images={[src]}
                      altPrefix="League schedule"
                      posterLayout="page"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </section>

        <section>
          <h2 className="font-display text-xl uppercase text-ice-white sm:text-2xl">By school</h2>
          <p className="mt-2 text-sm text-cool-grey">
            Tap a school name for the full team page — forms, coaches, and more.
          </p>
          <ul className="mt-8 grid min-w-0 gap-5 sm:grid-cols-2 xl:grid-cols-3">
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
