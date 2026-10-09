import Link from "next/link";
import { ContentImage, ScheduleImageGrid } from "@/components/public/ContentImage";
import {
  PLAYER_OF_GAME_PROCESS_HTML,
  TESTIMONIALS_BLURB,
} from "@/lib/league-copy";
import { schoolScheduleImages, schoolTeamImage } from "@/lib/drive-assets";
import type { JsonDoc } from "@/lib/services/league";

const WEEKLY_PLACEHOLDERS = ["Week #1", "Week #2", "Week #3", "Week #4", "Week #5"];

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
    const coaches = (t.coaches as { name?: string }[] | undefined) ?? [];
    const div = String((t.divisionId as { displayName?: string })?.displayName ?? "");
    return coaches.map((c) => ({
      name: c.name ?? "Coach",
      division: div,
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

      <section>
        <h2 className="font-display text-xl uppercase text-ice-white">Yearly forms</h2>
        <p className="mt-2 text-sm text-gold">These forms must be filled out before the first game.</p>
        <ul className="mt-4 space-y-2">
          {resources.map((r) => (
            <li key={String(r.slug)}>
              {r.externalUrl ? (
                <a
                  href={String(r.externalUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-electric-blue hover:underline"
                >
                  {String(r.title)}
                </a>
              ) : (
                <Link href={`/information/${r.slug}`} className="text-electric-blue hover:underline">
                  {String(r.title)}
                </Link>
              )}
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
        <h3 className="mt-8 font-display text-lg uppercase text-electric-blue">Weekly game links</h3>
        <ul className="mt-3 space-y-1 text-cool-grey">
          {WEEKLY_PLACEHOLDERS.map((w) => (
            <li key={w}>{w} — link coming soon</li>
          ))}
        </ul>
        <Link href="/schedules" className="mt-4 inline-block text-sm text-electric-blue hover:underline">
          League schedules &amp; standings →
        </Link>
      </section>
    </div>
  );
}
