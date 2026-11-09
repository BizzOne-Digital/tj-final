import Link from "next/link";
import { getSiteSettings } from "@/lib/services/site-settings";
import { getCms, htmlWithFallback } from "@/lib/cms/content";
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
import { HOME_HASHTAGS } from "@/lib/league-copy";

export default async function HomePage() {
  const settings = await getSiteSettings();
  const cms = await getCms();
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
  const leagueInfoPoster = cms.image("home.info.poster");
  const poster34 = cms.image("home.divisions.poster34");
  const poster56 = cms.image("home.divisions.poster56");
  const posterForDivision = (d: JsonDoc) => {
    const blob = `${d.displayName ?? ""} ${d.key ?? ""} ${d.slug ?? ""}`.toLowerCase();
    if (blob.includes("5-6") || blob.includes("5/6")) return poster56;
    if (blob.includes("3-4") || blob.includes("3/4")) return poster34;
    return undefined;
  };
  return (
    <div className="w-full min-w-0 overflow-x-clip">
      <HomeHero
        text={{
          eyebrow: cms.text("home.hero.eyebrow"),
          line1: cms.text("home.hero.line1"),
          line2: cms.text("home.hero.line2"),
          line3: cms.text("home.hero.line3"),
          cta1: cms.text("home.hero.cta1"),
          cta2: cms.text("home.hero.cta2"),
          badgeYear: cms.text("home.hero.badgeYear"),
          badgeLabel: cms.text("home.hero.badgeLabel"),
          badgeGold: cms.text("home.hero.badgeGold"),
          stat1: cms.text("home.hero.stat1"),
          bg: cms.image("home.hero.bg"),
        }}
        emblemUrl={settings.brand?.emblem?.url ?? posterUrl}
        supporting={settings.headlines?.supporting}
        firstTeamCents={settings.league?.firstTeamFeeCents ?? 20000}
        capacity={settings.league?.teamsPerDivisionCapacity ?? 8}
      />

      <HomeProgramBlock
        text={{
          kicker: cms.text("home.program.kicker"),
          eyebrow: cms.text("home.program.eyebrow"),
          title: cms.text("home.program.title"),
          subtitle: cms.text("home.program.subtitle"),
          tagline: cms.text("home.program.tagline"),
          quote: cms.text("home.program.quote"),
          supporting: cms.text("home.program.supporting"),
          hashtags: cms.text("home.program.hashtags"),
          image: cms.image("home.program.image"),
        }}
      />

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
              <span className="gradient-text-cyan">{cms.text("home.about.heading")}</span>
            </h2>
            <div
              className="mt-4 space-y-4 text-cool-grey"
              dangerouslySetInnerHTML={{
                __html: htmlWithFallback(cms, "home.about.html", settings.league?.aboutHtml),
              }}
            />
            <Link href="/about" className="mt-6 inline-block text-electric-blue">
              {cms.text("home.about.link")}
            </Link>
          </Reveal>
          <Reveal from="right" className="min-w-0 w-full">
            <ContentImage
              src={cms.image("home.about.image")}
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
              <span className="gradient-text-cyan">{cms.text("home.info.heading")}</span>
            </h2>
          </Reveal>
          <div className="mt-8 grid min-w-0 gap-10 lg:grid-cols-2 lg:items-start">
            <div
              className="prose prose-invert max-w-none min-w-0 text-cool-grey"
              dangerouslySetInnerHTML={{
                __html: cms.html("home.info.html"),
              }}
            />
            <Reveal from="right" className="min-w-0 lg:sticky lg:top-24">
              <div className="poster-preview w-full">
                <PosterLightbox
                  src={leagueInfoPoster}
                  alt="The Select Team League — When LHAC meets ICC, 2026-27 season program poster"
                  layout="portrait"
                />
              </div>
            </Reveal>
          </div>
          <Link href="/league-information" className="mt-8 inline-block text-electric-blue">
            {cms.text("home.info.link")}
          </Link>
        </div>
      </section>

      <section className="gradient-section-alt py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <Reveal>
            <h2 className="font-display text-3xl font-bold uppercase italic">
              <span className="gradient-text-cyan">{cms.text("home.divisions.heading")}</span>
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
                      posterSrc={posterForDivision(d)}
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
                    posterSrc={poster56}
                    posterAlt="2026-27 P-O Select 5/6th grade league poster"
                  />
                  <DivisionCard
                    title="Grades 3-4"
                    meta="Sundays · 9:00 AM ET"
                    capacity={settings.league?.teamsPerDivisionCapacity}
                    posterSrc={poster34}
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
              <span className="gradient-text-cyan">{cms.text("home.directory.heading")}</span>
            </h2>
            <p className="mt-3 text-sm text-cool-grey">
              {cms.text("home.directory.intro")}
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
          <h2 className="font-display text-2xl font-bold uppercase">{cms.text("home.results.heading")}</h2>
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
                  {cms.text("home.golden.heading")}
                </h2>
                <p className="mt-4 text-cool-grey">
                  {cms.text("home.golden.text")}
                </p>
                <Link
                  href="/state-championship"
                  className="mt-8 inline-block rounded-full border border-gold/40 px-6 py-2 text-sm font-semibold text-gold hover:bg-gold/10 lg:self-start"
                >
                  {cms.text("home.golden.button")}
                </Link>
              </div>
              <div className="min-w-0 w-full lg:ml-auto lg:max-w-xl">
                <ContentImage
                  src={cms.image("home.golden.image")}
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
            <h2 className="font-display text-2xl font-bold uppercase">{cms.text("home.news.heading")}</h2>
            <p className="mt-2 text-sm uppercase tracking-wider text-electric-blue">{cms.text("home.news.kicker")}</p>
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
        <h2 className="font-display text-2xl font-bold uppercase">{cms.text("home.registration.heading")}</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="gradient-card rounded-2xl p-8">
            <p className="text-4xl font-bold text-ice-white">
              {formatUsdFromCents(settings.league?.firstTeamFeeCents ?? 20000)}
            </p>
            <p className="text-cool-grey">{cms.text("home.registration.firstLabel")}</p>
          </div>
          <div className="gradient-card gradient-card-hover rounded-2xl p-8">
            <p className="text-4xl font-bold text-ice-white">
              {formatUsdFromCents(settings.league?.additionalTeamFeeCents ?? 15000)}
            </p>
            <p className="text-cool-grey">{cms.text("home.registration.addLabel")}</p>
          </div>
        </div>
        <MagneticButton href="/booking">{cms.text("home.registration.button")}</MagneticButton>
      </section>

      <section className="gradient-section py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <h2 className="font-display text-2xl font-bold uppercase">{cms.text("home.forms.heading")}</h2>
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
          <span className="gradient-text-cyan">{cms.text("home.cta.heading")}</span>
        </h2>
        <p className="relative mt-3 text-cool-grey">{settings.headlines?.secondary ?? HOME_HASHTAGS}</p>
        <div className="relative mt-8 flex justify-center gap-4">
          <MagneticButton href="/join-us">{cms.text("home.cta.join")}</MagneticButton>
          <MagneticButton href="/support" variant="ghost">{cms.text("home.cta.support")}</MagneticButton>
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
