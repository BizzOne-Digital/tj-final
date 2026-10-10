import Link from "next/link";
import { ContentImage, ScheduleImageGrid } from "@/components/public/ContentImage";
import {
  PLAYER_OF_GAME_PROCESS_HTML,
  TESTIMONIALS_BLURB,
} from "@/lib/league-copy";
import { TeamFormLinks } from "@/components/public/TeamFormLinks";
import { schoolScheduleImages, schoolTeamImage } from "@/lib/drive-assets";
import type { JsonDoc } from "@/lib/services/league";

const WEEKLY_PLACEHOLDERS = [
  "Week #1",
  "Week #2",
  "Week #3",
  "Week #4",
  "Week #5",
  "Week #6",
  "Week #7",
];

export function SchoolTeamSections({
  school,
  seasonSlug,
  schoolTeams,
  resources,
}: {
  school: JsonDoc;
  seasonSlug: string;
  schoolTeams: JsonDoc[];
  resources: JsonDoc[];
}) {
  const slug = String(school.slug);
  const teamImg = schoolTeamImage(slug);
  const schedules = schoolScheduleImages(slug);

  const coachLines = schoolTeams.flatMap((t) => {
    const coaches = (t.coaches as { name?: string; role?: string }[] | undefined) ?? [];
    const div = String((t.divisionId as { displayName?: string })?.displayName ?? "");
    return coaches.map((c) => ({
      name: c.name ?? "Coach",
      division: c.role?.trim() ? c.role : div,
    }));
  });

  const uniqueCoaches = [...new Map(coachLines.map((c) => [c.name, c])).values()];

  return (
    <div className="not-prose space-y-12">
      {teamImg && (
        <section className="max-w-md">
          <h2 className="font-display text-xl uppercase text-ice-white">Team</h2>
          <div className="mt-4">
            <ContentImage
              src={teamImg}
              alt={`${school.name} team photo`}
              size="schoolTeam"
              frameClassName="!mx-0 sm:mx-auto"
            />
          </div>
        </section>
      )}

      <section>
        <h2 className="font-display text-xl uppercase text-ice-white">Contact</h2>
        {uniqueCoaches.length === 0 ? (
          <p className="mt-2 text-cool-grey">Coach information coming soon.</p>
        ) : (
          <ul className="mt-3 space-y-2 text-cool-grey">
            {uniqueCoaches.map((c) => (
              <li key={c.name}>
                <span className="font-semibold text-ice-white">Coach:</span> {c.name}
                {c.division ? <span className="text-sm"> ({c.division})</span> : null}
              </li>
            ))}
          </ul>
        )}
        {school.programLink ? (
          <p className="mt-4">
            <a
              href={String(school.programLink)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-electric-blue hover:underline"
            >
              Program page ↗
            </a>
          </p>
        ) : null}
      </section>

      <TeamFormLinks resources={resources} />

      <section>
        <h2 className="font-display text-xl uppercase text-ice-white">Weekly forms by week</h2>
        <p className="mt-2 text-sm text-cool-grey">
          Use the weekly forms above when your coach opens them for each league day.
        </p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {WEEKLY_PLACEHOLDERS.map((w) => (
            <li
              key={w}
              className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-cool-grey"
            >
              <span className="font-semibold text-ice-white">{w}</span>
              <span className="mt-1 block text-xs">Links posted when the week is active.</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-display text-xl uppercase text-ice-white">Player of the Game</h2>
        <div
          className="prose prose-invert mt-4 max-w-none text-sm text-cool-grey"
          dangerouslySetInnerHTML={{ __html: PLAYER_OF_GAME_PROCESS_HTML }}
        />
      </section>

      <section>
        <div
          className="prose prose-invert max-w-none text-sm"
          dangerouslySetInnerHTML={{ __html: TESTIMONIALS_BLURB }}
        />
        <Link href="/testimonials" className="mt-2 inline-block text-electric-blue hover:underline">
          Testimonials →
        </Link>
      </section>

      <section>
        <h2 className="font-display text-xl uppercase text-ice-white">Schedule — {seasonSlug} season</h2>
        {schedules.length > 0 ? (
          <div className="mt-4 max-w-4xl">
            <ScheduleImageGrid images={schedules} altPrefix={`${school.name} schedule`} />
          </div>
        ) : (
          <p className="mt-2 text-cool-grey">Schedule images coming soon.</p>
        )}
        <Link href="/schedules" className="mt-4 inline-block text-sm text-electric-blue hover:underline">
          League schedules &amp; standings →
        </Link>
      </section>
    </div>
  );
}
