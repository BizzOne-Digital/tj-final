import Link from "next/link";
import { getSiteSettings } from "@/lib/services/site-settings";
import {
  getSchools,
  getNextLeagueEvent,
  getDivisionsForSeason,
  getPublishedResources,
  getPublishedGames,
  getPublishedPosts,
  type JsonDoc,
} from "@/lib/services/league";
import { HomeHero } from "@/components/public/HomeHero";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { Reveal } from "@/components/motion/Reveal";
import { PosterLightbox } from "@/components/public/PosterLightbox";
import { formatUsdFromCents } from "@/lib/fee-calculator";
import { Trophy, Calendar } from "lucide-react";
import { SchoolDirectoryCard } from "@/components/public/SchoolDirectoryCard";
import { HomeProgramBlock } from "@/components/public/HomeProgramBlock";
import { ContentImage } from "@/components/public/ContentImage";
import {
  LEAGUE_INFORMATION_HTML,
  HOME_HASHTAGS,
} from "@/lib/league-copy";
import {
  MAIN_ABOUT_PICTURE,
  MAIN_PROGRAM_PICTURE,
  GOLDEN_TICKET_PICTURE,
  DIVISION_POSTER_GRADES_34,
  DIVISION_POSTER_GRADES_56,
  divisionPosterImage,
} from "@/lib/drive-assets";

export default async function HomePage() {
  const settings = await getSiteSettings();
  const schools = await getSchools();
  const nextEvent = await getNextLeagueEvent();
  const divisions = await getDivisionsForSeason(
    settings.league?.activeSeasonSlug ?? "2026-27",
  );
  const resources = await getPublishedResources();
  const games = await getPublishedGames({
    seasonSlug: settings.league?.activeSeasonSlug,
  });
  const posts = await getPublishedPosts();

  const posterUrl =
    settings.brand?.seasonPoster?.url ?? "/brand/season-poster-2026-27.jpg";
  const leagueInfoPoster = MAIN_PROGRAM_PICTURE;
  return (
    <div className="w-full min-w-0 overflow-x-clip">
      <HomeHero
        emblemUrl={settings.brand?.emblem?.url ?? posterUrl}
        supporting={settings.headlines?.supporting}
        firstTeamCents={settings.league?.firstTeamFeeCents ?? 20000}
        capacity={settings.league?.teamsPerDivisionCapacity ?? 8}
      />

      <HomeProgramBlock />

      {nextEvent && (
        <section className="gradient-section border-y border-electric-blue/20">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 md:flex-row md:items-center md:justify-between lg:px-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-electric-blue" />
              <div>
                <p className="text-xs uppercase tracking-wider text-electric-blue">
                  Next league day
                </p>
                <p className="font-display text-xl font-semibold text-ice-white">
                  {nextEvent.title}
                </p>
                <p className="text-sm text-cool-grey">
                  {new Date(nextEvent.startsAt).toLocaleString("en-US", {
                    timeZone: "America/New_York",
                    dateStyle: "full",
                    timeStyle: "short",
                  })}{" "}
                  ET
                </p>
              </div>
            </div>
            <Link
              href="/schedules"
              className="text-sm font-semibold text-electric-blue hover:underline"
            >
              Full schedule →
            </Link>
          </div>
        </section>
      )}

      <section className="gradient-marquee w-full max-w-full overflow-x-clip border-y border-electric-blue/15 py-3">
        <div className="animate-marquee max-w-none whitespace-nowrap text-xs font-semibold uppercase tracking-[0.12em] text-ice-white/70 sm:text-sm sm:tracking-[0.2em]">
          {settings.headlines?.secondary} • {settings.headlines?.hashtags} •{" "}
          {settings.headlines?.secondary}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:py-20 lg:px-6">
        <div className="grid min-w-0 gap-10 lg:grid-cols-2 lg:items-start">
          <Reveal from="left" className="flex min-h-0 min-w-0 flex-col">
            <h2 className="font-display text-3xl font-bold uppercase italic">
              <span className="gradient-text-cyan">About Us</span>
            </h2>
            <div
              className="mt-4 space-y-4 text-cool-grey"
              dangerouslySetInnerHTML={{
                __html: settings.league?.aboutHtml ?? "",
              }}
            />
            <Link href="/about" className="mt-6 inline-block text-electric-blue">
              Read more →
            </Link>
          </Reveal>
          <Reveal from="right" className="min-w-0 w-full">
            <ContentImage
              src={MAIN_ABOUT_PICTURE}
              alt="P-O Select League — 2026-27 season state championship invite poster"
              size="landscapePoster"
              frameClassName="!mx-0 mx-auto w-full max-w-[17rem] sm:max-w-xs md:max-w-sm lg:max-w-md"
            />
          </Reveal>
        </div>
      </section>

      <section className="gradient-section-alt py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <Reveal>
            <h2 className="font-display text-3xl font-bold uppercase italic">
              <span className="gradient-text-cyan">League Information</span>
            </h2>
          </Reveal>
          <div className="mt-8 grid min-w-0 gap-10 lg:grid-cols-2 lg:items-start">
            <div
              className="prose prose-invert max-w-none min-w-0 text-cool-grey"
              dangerouslySetInnerHTML={{
                __html: LEAGUE_INFORMATION_HTML,
              }}
            />
            <Reveal from="right" className="min-w-0 lg:sticky lg:top-24">
              <div className="poster-preview w-full">
                <PosterLightbox
                  src={leagueInfoPoster}
                  alt="The Select Team League — When LHAC meets ICC, 2026-27 season program poster"
                  layout="landscape"
                />
              </div>
            </Reveal>
          </div>
          <Link href="/league-information" className="mt-8 inline-block text-electric-blue">
            Full league information →
          </Link>
        </div>
      </section>

      <section className="gradient-section-alt py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <Reveal>
            <h2 className="font-display text-3xl font-bold uppercase italic">
              <span className="gradient-text-cyan">Divisions</span>
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {divisions.length > 0
              ? divisions.map((d: JsonDoc, i: number) => (
                  <Reveal key={String(d._id)} from={i % 2 === 0 ? "left" : "right"} delay={i * 0.08}>
                    <DivisionCard
                      title={String(d.displayName)}
                      meta={`${String(d.leagueDayWeekday)}s · ${String(d.leagueDayStartTime)} ET`}
                      capacity={settings.league?.teamsPerDivisionCapacity}
                      posterSrc={divisionPosterImage(d)}
                      posterAlt={`${String(d.displayName)} division poster`}
                    />
                  </Reveal>
                ))
              : (
                <>
                  <DivisionCard
                    title="Grades 5-6"
                    meta="Saturdays · 8:00 AM ET"
                    capacity={settings.league?.teamsPerDivisionCapacity}
                    posterSrc={DIVISION_POSTER_GRADES_56}
                    posterAlt="2026-27 P-O Select 5/6th grade league poster"
                  />
                  <DivisionCard
                    title="Grades 3-4"
                    meta="Sundays · 9:00 AM ET"
                    capacity={settings.league?.teamsPerDivisionCapacity}
                    posterSrc={DIVISION_POSTER_GRADES_34}
                    posterAlt="2026-27 P-O Select 3/4th grade league poster"
                  />
                </>
              )}
          </div>
        </div>
      </section>

      <section className="gradient-section mx-auto max-w-7xl rounded-none px-4 py-20 lg:px-6">
        <Reveal>
          <h2 className="font-display text-3xl font-bold uppercase italic">
              <span className="gradient-text-cyan">Team Directory</span>
            </h2>
            <p className="mt-3 text-sm text-cool-grey">
              LHAC &amp; ICC programs — tap a school for coaches, forms, and schedules.
            </p>
        </Reveal>
        <ul className="mt-10 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {schools.map((s: JsonDoc, i: number) => (
            <Reveal key={String(s.slug)} delay={i * 0.06} className="min-w-0">
              <SchoolDirectoryCard school={s} layout="grid" />
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="gradient-section-alt border-y border-electric-blue/15 py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <h2 className="font-display text-2xl font-bold uppercase">Schedules & Results</h2>
          {games.length === 0 ? (
            <p className="mt-4 text-cool-grey">
              Game fixtures and scores will appear here once published. League days are on the{" "}
              <Link href="/schedules" className="text-electric-blue">schedule</Link>.
            </p>
          ) : (
            <p className="mt-4 text-cool-grey">{games.length} published games.</p>
          )}
        </div>
      </section>

      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-gold/15 via-electric-blue/10 to-gold/15" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020a18]/50 to-[#020a18]" aria-hidden />
        <div className="relative mx-auto max-w-5xl px-4 lg:px-6">
          <Reveal>
            <div className="grid min-w-0 gap-10 lg:grid-cols-2 lg:items-start">
              <div className="flex min-w-0 flex-col justify-center text-center lg:text-left">
                <Trophy className="mx-auto h-12 w-12 text-gold lg:mx-0" />
                <h2 className="mt-4 font-display text-3xl font-bold uppercase text-gold">
                  Golden Ticket — State Championship Invite
                </h2>
                <p className="mt-4 text-cool-grey">
                  Champion & runner-up in both divisions earn invites to State College, PA.
                </p>
                <Link
                  href="/state-championship"
                  className="mt-8 inline-block rounded-full border border-gold/40 px-6 py-2 text-sm font-semibold text-gold hover:bg-gold/10 lg:self-start"
                >
                  Golden Ticket details
                </Link>
              </div>
              <div className="min-w-0 w-full lg:ml-auto lg:max-w-xl">
                <ContentImage
                  src={GOLDEN_TICKET_PICTURE}
                  alt="Golden Ticket — state championship invite league"
                  size="wide"
                  frameClassName="!mx-0 w-full max-w-none"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold uppercase">News</h2>
            <p className="mt-2 text-sm uppercase tracking-wider text-electric-blue">Latest updates</p>
          </div>
          {posts.length > 0 ? (
            <Link href="/blogs" className="text-sm font-semibold text-electric-blue hover:underline">
              All news →
            </Link>
          ) : null}
        </div>
        {posts.length > 0 ? (
          <ul className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {posts.slice(0, 3).map((p) => (
              <li key={String(p.slug)}>
                <Link
                  href={`/blogs/${p.slug}`}
                  className="gradient-card gradient-card-hover block h-full rounded-xl border border-white/10 p-5"
                >
                  <h3 className="font-display text-sm font-bold uppercase leading-snug text-ice-white sm:text-base">
                    {String(p.title)}
                  </h3>
                  {p.excerpt ? (
                    <p className="mt-2 line-clamp-3 text-sm text-cool-grey">{String(p.excerpt)}</p>
                  ) : null}
                  <span className="mt-4 inline-block text-xs font-semibold text-electric-blue">Read more →</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-6 text-cool-grey">
            Announcements appear here once published. See{" "}
            <Link href="/league-information" className="text-electric-blue hover:underline">
              league information
            </Link>{" "}
            for the current season.
          </p>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
        <h2 className="font-display text-2xl font-bold uppercase">Registration</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="gradient-card rounded-2xl p-8">
            <p className="text-4xl font-bold text-ice-white">
              {formatUsdFromCents(settings.league?.firstTeamFeeCents ?? 20000)}
            </p>
            <p className="text-cool-grey">First team</p>
          </div>
          <div className="gradient-card gradient-card-hover rounded-2xl p-8">
            <p className="text-4xl font-bold text-ice-white">
              {formatUsdFromCents(settings.league?.additionalTeamFeeCents ?? 15000)}
            </p>
            <p className="text-cool-grey">Each additional team</p>
          </div>
        </div>
        <MagneticButton href="/booking">Start registration</MagneticButton>
      </section>

      <section className="gradient-section py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <h2 className="font-display text-2xl font-bold uppercase">Required Forms</h2>
          <ul className="mt-6 grid gap-3 md:grid-cols-2">
            {resources.slice(0, 6).map((r: JsonDoc) => (
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
                  <Link href={`/information/${r.slug}`} className="text-electric-blue">
                    {String(r.title)}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="gradient-hero grain relative overflow-hidden py-20 text-center">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-electric-blue/25 via-transparent to-royal-blue/20" aria-hidden />
        <h2 className="relative font-display text-4xl font-bold uppercase italic">
          <span className="gradient-text-cyan">Join the Mountie Family</span>
        </h2>
        <p className="relative mt-3 text-cool-grey">{settings.headlines?.secondary ?? HOME_HASHTAGS}</p>
        <div className="relative mt-8 flex justify-center gap-4">
          <MagneticButton href="/join-us">Join Us</MagneticButton>
          <MagneticButton href="/support" variant="ghost">Support</MagneticButton>
        </div>
      </section>
    </div>
  );
}

function DivisionCard({
  title,
  meta,
  capacity,
  posterSrc,
  posterAlt,
}: {
  title: string;
  meta: string;
  capacity?: number;
  posterSrc?: string;
  posterAlt?: string;
}) {
  return (
    <div className="gradient-card gradient-card-hover flex min-w-0 flex-col overflow-hidden rounded-2xl backdrop-blur sm:flex-row sm:items-stretch">
      <div className="flex min-w-0 flex-1 flex-col justify-center p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase text-electric-blue">{meta}</p>
        <h3 className="mt-2 font-display text-2xl font-bold uppercase">{title}</h3>
        <p className="mt-3 text-sm text-cool-grey">Up to {capacity ?? 8} teams per division.</p>
      </div>
      {posterSrc ? (
        <div className="flex min-h-[11rem] w-full shrink-0 items-center justify-center border-t border-white/10 bg-[#020a18]/50 p-2 sm:min-h-0 sm:w-[42%] sm:max-w-[15rem] sm:border-l sm:border-t-0 md:max-w-[17rem] lg:max-w-xs">
          <ContentImage
            src={posterSrc}
            alt={posterAlt ?? `${title} division poster`}
            size="divisionBanner"
            frameClassName="!mx-0 h-full w-full max-w-none"
          />
        </div>
      ) : null}
    </div>
  );
}
