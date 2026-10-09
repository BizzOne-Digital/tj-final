"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/teams", label: "Teams" },
  { href: "/schedules", label: "Schedules" },
  { href: "/information", label: "Information" },
  { href: "/contact", label: "Contact" },
];

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
  const isHome = pathname === "/";

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

          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-sm font-medium transition ${
                    active ? "text-white" : "text-white/65 hover:text-white"
                  }`}
                >
                  {link.label}
                  {active && (
                    <span
                      className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-electric-blue shadow-[0_0_12px_rgba(61,139,255,0.8)]"
                      aria-hidden
                    />
                  )}
                </Link>
              );
            })}
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
        <div className="border-t border-white/10 bg-[#020a18]/95 px-4 py-4 lg:hidden">
          <ul className="space-y-1">
            {navLinks.map((link) => (
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
            <li>
              <Link
                href="/booking"
                className="mt-2 block rounded-full bg-royal-blue px-4 py-3 text-center text-sm font-bold text-white"
                onClick={() => setOpen(false)}
              >
                Register Team
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
