"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, Menu, X, ArrowRight } from "lucide-react";
import { LEAGUE_MENU, PRIMARY_NAV } from "@/lib/site-navigation";

export function SiteHeader({
  emblemUrl,
  overlay = false,
}: {
  emblemUrl?: string;
  shortName?: string;
  overlay?: boolean;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [leagueOpen, setLeagueOpen] = useState(false);
  const isHome = pathname === "/";

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  const leagueActive = LEAGUE_MENU.some((l) => isActive(l.href));

  return (
    <header
      className={
        overlay || isHome
          ? "absolute left-0 right-0 top-0 z-50 w-full max-w-full overflow-x-clip"
          : "sticky top-0 z-50 w-full max-w-full overflow-x-clip border-b border-electric-blue/20 bg-[#020a18]/70 backdrop-blur-xl"
      }
    >
      <div className="border-b border-white/10 bg-[#020a18]/80 px-2 py-2 text-center text-[9px] font-medium uppercase tracking-[0.12em] text-white/75 sm:text-[11px] sm:tracking-[0.28em]">
        2026-27 Season • School-Based Teams • Grades 3-6
      </div>

      <div className="bg-[#020a18]/55 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-2 px-3 py-3 sm:gap-4 sm:px-4 lg:px-8">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            {emblemUrl ? (
              <Image
                src={emblemUrl}
                alt=""
                width={32}
                height={32}
                className="h-8 w-8 max-h-8 max-w-8 shrink-0 rounded-full object-contain bg-[#061428] ring-1 ring-electric-blue/40"
                sizes="32px"
              />
            ) : (
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-royal-blue text-[10px] font-bold text-white">
                PO
              </span>
            )}
            <div className="min-w-0 leading-none">
              <span className="block truncate font-display text-sm font-extrabold uppercase italic tracking-tight text-white sm:text-xl">
                P-O Select
              </span>
              <span className="mt-0.5 hidden text-[9px] font-medium uppercase tracking-[0.22em] text-white/70 sm:block">
                Elementary Basketball League
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-5 xl:gap-6 lg:flex">
            {PRIMARY_NAV.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-sm font-medium transition ${
                  isActive(link.href) ? "text-white" : "text-white/65 hover:text-white"
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span
                    className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-electric-blue"
                    aria-hidden
                  />
                )}
              </Link>
            ))}
            <div className="relative">
              <button
                type="button"
                className={`inline-flex items-center gap-1 text-sm font-medium transition ${
                  leagueActive ? "text-white" : "text-white/65 hover:text-white"
                }`}
                onClick={() => setLeagueOpen((v) => !v)}
                aria-expanded={leagueOpen}
              >
                League menu
                <ChevronDown className={`h-4 w-4 transition ${leagueOpen ? "rotate-180" : ""}`} />
              </button>
              {leagueOpen && (
                <>
                  <button
                    type="button"
                    className="fixed inset-0 z-40 cursor-default"
                    aria-label="Close menu"
                    onClick={() => setLeagueOpen(false)}
                  />
                  <div className="absolute right-0 top-full z-50 mt-2 max-h-[min(70vh,28rem)] w-64 overflow-y-auto rounded-xl border border-electric-blue/25 bg-[#020a18] py-2 shadow-xl">
                    {LEAGUE_MENU.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block px-4 py-2.5 text-sm text-cool-grey hover:bg-white/5 hover:text-ice-white"
                        onClick={() => setLeagueOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/booking"
              className="hidden items-center gap-1.5 rounded-full bg-gradient-to-r from-[#2b8cff] to-[#5eb5ff] px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-white shadow-[0_0_28px_rgba(46,140,255,0.45)] sm:inline-flex sm:text-sm"
            >
              Register Team
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              type="button"
              className="rounded-lg p-2 text-white lg:hidden"
              onClick={() => setOpen(!open)}
              aria-label={open ? "Close menu" : "Open menu"}
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="max-h-[min(85vh,32rem)] overflow-y-auto border-t border-white/10 bg-[#020a18]/95 px-4 py-4 lg:hidden">
          <p className="px-2 text-[10px] font-semibold uppercase tracking-wider text-electric-blue">Main</p>
          <ul className="mt-1 space-y-1">
            {PRIMARY_NAV.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block rounded-lg px-2 py-2.5 text-sm text-white"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 px-2 text-[10px] font-semibold uppercase tracking-wider text-electric-blue">
            League menu
          </p>
          <ul className="mt-1 space-y-1">
            {LEAGUE_MENU.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block rounded-lg px-2 py-2.5 text-sm text-cool-grey hover:text-white"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/booking"
            className="mt-4 block rounded-full bg-royal-blue px-4 py-3 text-center text-sm font-bold text-white"
            onClick={() => setOpen(false)}
          >
            Register Team
          </Link>
        </div>
      )}
    </header>
  );
}
