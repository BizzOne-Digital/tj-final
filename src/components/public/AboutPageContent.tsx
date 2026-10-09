"use client";

import Link from "next/link";
import { Award, ArrowRight, Camera, HeartHandshake, Sparkles, Users } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { ContentImage } from "@/components/public/ContentImage";
import { ProseBlock } from "@/components/public/ProseBlock";
import {
  MAIN_ABOUT_PICTURE,
  MAIN_PROGRAM_PICTURE,
} from "@/lib/drive-assets";
import { MAIN_HEADING_GALLERY } from "@/lib/page-drive-images";

const PILLARS = [
  {
    title: "Attitude",
    description: "Show up ready to learn — on the court and in the classroom.",
    icon: Sparkles,
  },
  {
    title: "Effort",
    description: "Hustle plays, reps, and respect for coaches and teammates.",
    icon: HeartHandshake,
  },
  {
    title: "Family",
    description: "We support one another — that's the Mountie way.",
    icon: Users,
  },
] as const;

export function AboutPageContent({
  aboutHtml,
  philosophyHtml,
}: {
  aboutHtml: string;
  philosophyHtml: string;
}) {
  return (
    <div className="space-y-14 sm:space-y-16 md:space-y-20">
      <section className="grid min-w-0 gap-8 lg:grid-cols-12 lg:items-center lg:gap-10">
        <Reveal from="left" className="min-w-0 lg:col-span-5">
          <div className="gradient-card overflow-hidden rounded-2xl p-2 ring-1 ring-electric-blue/25">
            <ContentImage
              src={MAIN_ABOUT_PICTURE}
              alt="P-O Select League — about us"
              size="feature"
              priority
              frameClassName="!mx-0 w-full max-w-none"
            />
          </div>
        </Reveal>
        <Reveal from="right" delay={0.08} className="min-w-0 lg:col-span-7">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-electric-blue sm:text-xs">
            Mounties Youth Basketball
          </p>
          <h2 className="mt-3 font-display text-2xl font-bold uppercase italic leading-tight sm:text-3xl md:text-4xl">
            <span className="gradient-text-cyan">Attitude &amp; Effort</span>
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-cool-grey sm:text-base">
            Hard work on and off the court. Encouraging teammates. Having fun while we grow the game in Central
            PA — and building a path to the state championship stage.
          </p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-3">
            <li className="rounded-xl border border-electric-blue/20 bg-electric-blue/5 px-4 py-3 text-center">
              <Award className="mx-auto h-5 w-5 text-gold" aria-hidden />
              <p className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-ice-white sm:text-xs">
                State qualifier
              </p>
            </li>
            <li className="rounded-xl border border-electric-blue/20 bg-electric-blue/5 px-4 py-3 text-center">
              <Users className="mx-auto h-5 w-5 text-electric-blue" aria-hidden />
              <p className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-ice-white sm:text-xs">
                School teams
              </p>
            </li>
            <li className="rounded-xl border border-gold/30 bg-gold/5 px-4 py-3 text-center">
              <HeartHandshake className="mx-auto h-5 w-5 text-gold" aria-hidden />
              <p className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-ice-white sm:text-xs">
                Mountie family
              </p>
            </li>
          </ul>
        </Reveal>
      </section>

      <Reveal>
        <div className="gradient-card relative overflow-hidden rounded-2xl border border-electric-blue/20 p-6 sm:p-8 md:p-10">
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-electric-blue/10 blur-3xl"
            aria-hidden
          />
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-electric-blue">Our story</p>
          <ProseBlock html={aboutHtml} className="mt-5 max-w-none sm:[&_p]:text-lg" />
        </div>
      </Reveal>

      <section>
        <Reveal>
          <h2 className="font-display text-2xl font-bold uppercase sm:text-3xl">
            <span className="gradient-text-cyan">Mounties philosophy</span>
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-cool-grey">
            What we expect from every player, coach, and family in the league.
          </p>
        </Reveal>
        {philosophyHtml ? (
          <Reveal delay={0.06}>
            <div className="mt-8 gradient-card rounded-2xl border border-white/10 p-6 sm:p-8">
              <ProseBlock html={philosophyHtml} className="max-w-none" />
            </div>
          </Reveal>
        ) : (
          <ul className="mt-8 grid gap-4 sm:grid-cols-3">
            {PILLARS.map(({ title, description, icon: Icon }, i) => (
              <Reveal key={title} delay={i * 0.06}>
                <li className="gradient-card gradient-card-hover h-full rounded-2xl p-6">
                  <span className="inline-flex rounded-lg bg-electric-blue/15 p-2.5 text-electric-blue">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-bold uppercase text-ice-white">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-cool-grey">{description}</p>
                </li>
              </Reveal>
            ))}
          </ul>
        )}
      </section>

      <section>
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-electric-blue">On the court</p>
              <h2 className="mt-1 font-display text-xl font-bold uppercase text-ice-white sm:text-2xl">
                League moments
              </h2>
            </div>
            <Camera className="h-7 w-7 shrink-0 text-electric-blue/35" aria-hidden />
          </div>
        </Reveal>
        <div className="mt-6 grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
          <Reveal className="min-w-0 sm:col-span-2 lg:col-span-3">
            <ContentImage
              src={MAIN_ABOUT_PICTURE}
              alt="P-O Select League feature"
              size="wide"
              frameClassName="!mx-0 w-full max-w-none"
            />
          </Reveal>
          <div className="flex min-w-0 flex-col gap-3 sm:col-span-2 lg:col-span-2 lg:gap-4">
            <Reveal delay={0.05}>
              <ContentImage
                src={MAIN_PROGRAM_PICTURE}
                alt="League program graphic"
                size="compact"
                frameClassName="!mx-0 w-full max-w-none"
              />
            </Reveal>
            <Reveal delay={0.1}>
              <ContentImage
                src={MAIN_HEADING_GALLERY}
                alt="League action photo"
                size="compact"
                frameClassName="!mx-0 w-full max-w-none"
              />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="grid min-w-0 gap-4 sm:grid-cols-2">
        <Reveal>
          <Link
            href="/through-the-years"
            className="group gradient-card gradient-card-hover flex h-full flex-col rounded-2xl border border-gold/25 bg-gradient-to-br from-gold/10 to-transparent p-6 sm:p-8"
          >
            <p className="font-display text-lg font-bold uppercase text-gold sm:text-xl">Through the years</p>
            <p className="mt-2 flex-1 text-sm text-cool-grey">
              Season archives with teams and players from past years.
            </p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-electric-blue group-hover:gap-3 transition-all">
              View seasons <ArrowRight className="h-4 w-4" aria-hidden />
            </span>
          </Link>
        </Reveal>
        <Reveal delay={0.06}>
          <div className="flex h-full flex-col gap-4">
            <Link
              href="/teams"
              className="group gradient-card gradient-card-hover flex flex-1 flex-col rounded-2xl p-6 sm:p-7"
            >
              <p className="font-display text-base font-bold uppercase text-ice-white sm:text-lg">Team directory</p>
              <p className="mt-2 text-sm text-cool-grey">LHAC &amp; ICC programs, coaches, and schedules.</p>
              <span className="mt-4 text-sm font-semibold text-electric-blue group-hover:underline">
                Browse teams →
              </span>
            </Link>
            <Link
              href="/contact"
              className="group gradient-card gradient-card-hover flex flex-1 flex-col rounded-2xl border border-electric-blue/20 p-6 sm:p-7"
            >
              <p className="font-display text-base font-bold uppercase text-ice-white sm:text-lg">Questions?</p>
              <p className="mt-2 text-sm text-cool-grey">Reach league staff — we&apos;re happy to help.</p>
              <span className="mt-4 text-sm font-semibold text-electric-blue group-hover:underline">
                Contact us →
              </span>
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
