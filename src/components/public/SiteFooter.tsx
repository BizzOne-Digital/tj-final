import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone, ArrowRight } from "lucide-react";
import {
  facebookDisplayName,
  shouldShowFacebook,
} from "@/lib/contact-display";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path
        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
      />
    </svg>
  );
}

const quickLinks = [
  { href: "/about", label: "About" },
  { href: "/teams", label: "Teams" },
  { href: "/schedules", label: "Schedules" },
  { href: "/information", label: "Information" },
  { href: "/booking", label: "Register" },
  { href: "/contact", label: "Contact" },
];

const legalLinks = [
  { href: "/join-us", label: "Join Us" },
  { href: "/sponsorship", label: "Sponsorship" },
  { href: "/privacy", label: "Privacy" },
  { href: "/accessibility", label: "Accessibility" },
];

function hashtagTags(raw?: string): string[] {
  if (!raw) return [];
  return raw.split(/\s+/).filter((t) => t.startsWith("#"));
}

export function SiteFooter({
  contact,
  hashtags,
  tagline,
  emblemUrl,
}: {
  contact: {
    primaryEmail: string;
    primaryPhone: string;
    mailingAddress: string;
    gameVenueAddress: string;
    gameVenueName?: string;
    facebookPageName: string;
    facebookUrl?: string;
    programEmail: string;
    primaryName?: string;
  };
  hashtags?: string;
  tagline?: string;
  emblemUrl?: string;
}) {
  const tags = hashtagTags(hashtags);
  const year = new Date().getFullYear();

  return (
    <footer className="relative w-full max-w-full overflow-x-clip border-t border-electric-blue/25 bg-[#020a18]">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-electric-blue/10 via-transparent to-royal-blue/5"
        aria-hidden
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-12 lg:px-8 lg:py-16">
        <div className="flex min-w-0 flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 max-w-md">
            <div className="flex items-center gap-3">
              {emblemUrl ? (
                <Image
                  src={emblemUrl}
                  alt=""
                  width={48}
                  height={48}
                  className="h-11 w-11 rounded-full object-contain bg-[#061428] ring-1 ring-electric-blue/40"
                />
              ) : null}
              <div>
                <p className="font-display text-xl font-extrabold uppercase italic tracking-tight text-white lg:text-2xl">
                  P-O Select League
                </p>
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/55">
                  Elementary Basketball
                </p>
              </div>
            </div>
            {tagline ? (
              <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-gold">{tagline}</p>
            ) : null}
            <p className="mt-3 text-sm leading-relaxed text-cool-grey">
              School-based teams · Grades 3–6 · Central Pennsylvania
            </p>
            {tags.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-medium text-electric-blue/90"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/booking"
                className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#2b8cff] to-[#5eb5ff] px-4 py-2 text-xs font-bold uppercase tracking-wide text-white shadow-[0_0_20px_rgba(46,140,255,0.35)] transition hover:brightness-110"
              >
                Register
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/25 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white/90 transition hover:border-electric-blue/50 hover:text-white"
              >
                Get in touch
              </Link>
            </div>
          </div>

          <div className="grid min-w-0 gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-electric-blue">Quick links</h2>
              <ul className="mt-4 space-y-2.5">
                {quickLinks.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-white/75 transition hover:text-electric-blue"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-electric-blue">Contact</h2>
              <ul className="mt-4 space-y-4 text-sm text-white/80">
                {contact.primaryName ? (
                  <li className="font-medium text-white">{contact.primaryName}</li>
                ) : null}
                <li>
                  <a
                    href={`mailto:${contact.primaryEmail}`}
                    className="group flex gap-2 transition hover:text-electric-blue"
                  >
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-electric-blue/80" />
                    <span>
                      {contact.primaryEmail}
                      <span className="block text-xs text-cool-grey">Primary</span>
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${contact.programEmail}`}
                    className="group flex gap-2 transition hover:text-electric-blue"
                  >
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-electric-blue/80" />
                    <span>
                      {contact.programEmail}
                      <span className="block text-xs text-cool-grey">Program office</span>
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href={`tel:${contact.primaryPhone.replace(/\D/g, "")}`}
                    className="flex gap-2 transition hover:text-electric-blue"
                  >
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-electric-blue/80" />
                    {contact.primaryPhone}
                  </a>
                </li>
              </ul>
            </div>

            <div className="sm:col-span-2 lg:col-span-1">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-electric-blue">Venue & mail</h2>
              <ul className="mt-4 space-y-4 text-sm text-white/80">
                <li className="flex gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-electric-blue/80" />
                  <span>
                    {contact.gameVenueName ? (
                      <span className="block font-medium text-white">{contact.gameVenueName}</span>
                    ) : null}
                    {contact.gameVenueAddress}
                    <span className="block text-xs text-cool-grey">Game venue</span>
                  </span>
                </li>
                <li className="flex gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-electric-blue/80" />
                  <span>
                    {contact.mailingAddress}
                    <span className="block text-xs text-cool-grey">Mailing address</span>
                  </span>
                </li>
                {shouldShowFacebook(contact) ? (
                  <li>
                    {contact.facebookUrl ? (
                      <a
                        href={contact.facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm transition hover:border-electric-blue/40 hover:text-electric-blue"
                      >
                        <FacebookIcon className="h-4 w-4" />
                        {facebookDisplayName(contact.facebookPageName)}
                      </a>
                    ) : (
                      <span className="flex items-center gap-2 text-cool-grey">
                        <FacebookIcon className="h-4 w-4 opacity-50" />
                        {facebookDisplayName(contact.facebookPageName)}
                      </span>
                    )}
                  </li>
                ) : null}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10 bg-[#01060f]/80">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 text-sm text-white/60 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>© {year} Philipsburg-Osceola Select Elementary Basketball League</p>
          <nav className="flex flex-wrap gap-x-5 gap-y-2">
            {legalLinks.map((l) => (
              <Link key={l.href} href={l.href} className="transition hover:text-white">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
