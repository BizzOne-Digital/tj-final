import { ContentImage } from "@/components/public/ContentImage";
import { Reveal } from "@/components/motion/Reveal";
import {
  HOME_HASHTAGS,
  HOME_LEAGUE_SUBTITLE,
  HOME_LEAGUE_TITLE,
  HOME_QUOTE,
  HOME_SUPPORTING,
  HOME_TAGLINE,
} from "@/lib/league-copy";
import { MAIN_PROGRAM_PICTURE } from "@/lib/drive-assets";

export function HomeProgramBlock() {
  return (
    <section className="gradient-section border-y border-electric-blue/20 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <Reveal>
          <p className="text-center text-[10px] font-semibold uppercase tracking-[0.25em] text-electric-blue/90 md:text-left">
            Official league program
          </p>
        </Reveal>

        <div className="mt-10 flex min-w-0 flex-col gap-10 lg:gap-12">
          <Reveal from="right" className="flex min-w-0 flex-col justify-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-electric-blue">
              Philipsburg-Osceola
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold uppercase leading-tight text-ice-white md:text-3xl">
              {HOME_LEAGUE_TITLE}
            </h2>
            <p className="mt-2 text-sm font-medium uppercase tracking-wide text-cool-grey md:text-base">
              {HOME_LEAGUE_SUBTITLE}
            </p>
            <p className="mt-4 font-display text-lg font-bold uppercase italic text-gold md:text-xl">
              {HOME_TAGLINE}
            </p>
            <blockquote className="mt-6 border-l-2 border-electric-blue/60 pl-4 text-sm italic text-cool-grey md:text-base">
              {HOME_QUOTE}
            </blockquote>
            <p className="mt-4 text-sm leading-relaxed text-cool-grey md:text-base">{HOME_SUPPORTING}</p>
            <p className="mt-6 text-xs leading-relaxed text-electric-blue/90 md:text-sm">{HOME_HASHTAGS}</p>
          </Reveal>
          <Reveal from="left" delay={0.08} className="w-full min-w-0">
            <ContentImage
              src={MAIN_PROGRAM_PICTURE}
              alt="P-O Select Elementary Winter Basketball League — When LHAC meets ICC"
              priority
              size="programPoster"
              frameClassName="!mx-0 mx-auto w-full max-w-none md:max-w-lg lg:max-w-xl xl:max-w-2xl"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
