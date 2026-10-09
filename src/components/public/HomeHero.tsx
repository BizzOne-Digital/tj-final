"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Users, Ticket } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

const HERO_BG = "/brand/hero-arena.jpg";

export function HomeHero({
  emblemUrl,
  supporting,
  firstTeamCents,
  capacity,
}: {
  emblemUrl?: string;
  supporting?: string;
  firstTeamCents: number;
  capacity: number;
}) {
  const reduced = useReducedMotion();
  const price = Math.round(firstTeamCents / 100);

  return (
    <section className="relative min-h-[min(100vh,920px)] w-full max-w-full overflow-hidden bg-[#020a18]">
      <Image
        src={HERO_BG}
        alt=""
        fill
        priority
        className="object-cover object-[72%_center] sm:object-[65%_center]"
        sizes="100vw"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-[#020a18]/95 via-[#020a18]/75 to-[#020a18]/25"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#020a18] via-transparent to-[#020a18]/40"
        aria-hidden
      />

      <div className="relative z-10 flex min-h-[min(100vh,920px)] flex-col">
        <div className="flex flex-1 flex-col justify-center px-4 pb-28 pt-24 sm:pt-28 lg:px-10 lg:pt-32 xl:px-16">
          <div className="grid min-w-0 flex-1 items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="min-w-0 max-w-2xl">
              <motion.p
                className="text-[11px] font-semibold uppercase tracking-[0.35em] text-electric-blue/90 sm:text-xs"
                initial={{ opacity: 0, y: reduced ? 0 : -24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
              >
                Philipsburg-Osceola
              </motion.p>

              <h1 className="sr-only">
                SMALL HANDS. BIG DREAMS. TOGETHER WE RAISE.
              </h1>
              <div className="mt-3 font-display uppercase italic leading-[0.92] tracking-tight" aria-hidden>
                <motion.span
                  className="block text-[clamp(2.25rem,6.5vw,4.75rem)] font-extrabold text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
                  initial={{ opacity: 0, y: reduced ? 0 : -70, rotate: reduced ? 0 : -1 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 110, damping: 18, delay: 0.05 }}
                >
                  Small Hands.
                </motion.span>
                <motion.span
                  className="block bg-gradient-to-r from-[#5ec8ff] via-[#3d8bff] to-[#7ee0ff] bg-clip-text text-[clamp(2.5rem,7vw,5.25rem)] font-extrabold text-transparent drop-shadow-[0_0_40px_rgba(61,139,255,0.55)]"
                  initial={{ opacity: 0, x: reduced ? 0 : 80 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.15 }}
                >
                  Big Dreams.
                </motion.span>
                <motion.span
                  className="block text-[clamp(2.25rem,6.5vw,4.75rem)] font-extrabold text-white"
                  style={{
                    clipPath: reduced ? "none" : undefined,
                  }}
                  initial={{
                    opacity: 0,
                    clipPath: reduced ? "inset(0)" : "inset(0 0 100% 0)",
                  }}
                  animate={{ opacity: 1, clipPath: "inset(0)" }}
                  transition={{ duration: reduced ? 0 : 0.7, delay: 0.28, ease: "easeOut" }}
                >
                  Together We Raise.
                </motion.span>
              </div>

              <motion.p
                className="mt-6 max-w-md text-sm leading-relaxed text-white/85 sm:text-base"
                initial={{ opacity: 0, y: reduced ? 0 : 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {supporting ??
                  "Building confidence. Developing teammates. Inspiring the next generation of ball players."}
              </motion.p>

              <motion.div
                className="mt-8 flex flex-wrap gap-4"
                initial={{ opacity: 0, y: reduced ? 0 : 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.48 }}
              >
                <Link
                  href="/booking"
                  className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#2b8cff] to-[#5eb5ff] px-6 py-3 text-xs font-bold uppercase tracking-wide text-white shadow-[0_0_35px_rgba(46,140,255,0.55)] transition hover:shadow-[0_0_50px_rgba(46,140,255,0.7)] sm:text-sm"
                >
                  Register Your Team
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/teams"
                  className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/5 px-6 py-3 text-xs font-bold uppercase tracking-wide text-white backdrop-blur-sm transition hover:border-electric-blue/60 hover:bg-white/10 sm:text-sm"
                >
                  Explore the League
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            </div>

            <div className="relative hidden min-h-0 overflow-hidden sm:block sm:min-h-[200px] lg:min-h-[280px]">
              {emblemUrl && (
                <div className="pointer-events-none absolute bottom-8 right-0 w-28 opacity-0" aria-hidden>
                  <Image src={emblemUrl} alt="" width={112} height={112} />
                </div>
              )}
              <motion.div
                className="absolute right-4 top-[18%] skew-x-[-12deg] border border-electric-blue/70 bg-[#061428]/85 px-5 py-3 shadow-[0_0_30px_rgba(61,139,255,0.35)] backdrop-blur-md"
                initial={{ opacity: 0, x: reduced ? 0 : 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
              >
                <p className="skew-x-[12deg] text-center font-display text-2xl font-bold italic text-white">
                  2026-27
                </p>
                <p className="skew-x-[12deg] text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-electric-blue">
                  Winter League
                </p>
              </motion.div>
              <motion.div
                className="absolute bottom-[22%] right-8 skew-x-[-12deg] border border-gold/60 bg-gradient-to-r from-gold/90 to-[#e8c56a] px-4 py-2 shadow-lg"
                initial={{ opacity: 0, y: reduced ? 0 : 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <p className="skew-x-[12deg] text-[10px] font-bold uppercase tracking-wider text-[#1a1205]">
                  State Championship Invites
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="relative border-t border-white/10 bg-[#020a18]/75 backdrop-blur-md">
          <div className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <HeroStat icon={Users} label="Grades 3-6" />
            <HeroStat icon={Ticket} label={`$${price} Per Team`} />
            <HeroStat icon={BasketballIcon} label={`${capacity} Teams Per Division`} />
          </div>
        </div>
      </div>
    </section>
  );
}

function BasketballIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
      <path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function HeroStat({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <div className="flex items-center justify-center gap-3 px-6 py-4">
      <Icon className="h-5 w-5 text-electric-blue" />
      <span className="text-xs font-bold uppercase tracking-[0.15em] text-white/90 sm:text-sm">
        {label}
      </span>
    </div>
  );
}
