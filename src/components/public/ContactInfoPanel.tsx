import { Mail, MapPin, Phone } from "lucide-react";
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

export type ContactSettings = {
  primaryName: string;
  primaryEmail: string;
  primaryPhone: string;
  programEmail: string;
  mailingAddress: string;
  gameVenueName?: string;
  gameVenueAddress: string;
  facebookPageName: string;
  facebookUrl?: string;
};

export function ContactInfoPanel({ contact }: { contact: ContactSettings }) {
  const phoneDigits = contact.primaryPhone.replace(/\D/g, "");

  return (
    <div className="space-y-4">
      <p className="text-sm leading-relaxed text-cool-grey">
        Reach league leadership for registration, schedules, volunteering, or general questions. We
        typically respond within a few business days.
      </p>

      <div className="rounded-2xl border border-electric-blue/20 bg-gradient-to-br from-electric-blue/10 to-transparent p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-electric-blue">League contact</p>
        <p className="mt-2 font-display text-lg font-bold text-ice-white">{contact.primaryName}</p>
        <ul className="mt-4 space-y-3 text-sm">
          <li>
            <a
              href={`mailto:${contact.primaryEmail}`}
              className="flex gap-3 text-ice-white transition hover:text-electric-blue"
            >
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-electric-blue" aria-hidden />
              <span>
                {contact.primaryEmail}
                <span className="block text-xs text-cool-grey">Primary email</span>
              </span>
            </a>
          </li>
          <li>
            <a
              href={`tel:+${phoneDigits}`}
              className="flex gap-3 text-ice-white transition hover:text-electric-blue"
            >
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-electric-blue" aria-hidden />
              <span>{contact.primaryPhone}</span>
            </a>
          </li>
        </ul>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-cool-grey">Program office</p>
        <a
          href={`mailto:${contact.programEmail}`}
          className="mt-3 flex gap-3 text-sm text-ice-white transition hover:text-electric-blue"
        >
          <Mail className="mt-0.5 h-4 w-4 shrink-0 text-electric-blue/90" aria-hidden />
          {contact.programEmail}
        </a>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-cool-grey">Locations</p>
        <ul className="mt-3 space-y-4 text-sm text-cool-grey">
          <li className="flex gap-3">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-electric-blue/90" aria-hidden />
            <span>
              {contact.gameVenueName ? (
                <span className="block font-medium text-ice-white">{contact.gameVenueName}</span>
              ) : null}
              {contact.gameVenueAddress}
              <span className="mt-1 block text-xs">Game venue</span>
            </span>
          </li>
          <li className="flex gap-3">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-electric-blue/90" aria-hidden />
            <span>
              {contact.mailingAddress}
              <span className="mt-1 block text-xs">Mailing address</span>
            </span>
          </li>
        </ul>
      </div>

      {shouldShowFacebook(contact) ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-cool-grey">Social</p>
          {contact.facebookUrl ? (
            <a
              href={contact.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 rounded-full border border-electric-blue/30 bg-electric-blue/10 px-4 py-2 text-sm font-medium text-ice-white transition hover:border-electric-blue hover:bg-electric-blue/20"
            >
              <FacebookIcon className="h-4 w-4" />
              {facebookDisplayName(contact.facebookPageName)}
            </a>
          ) : (
            <p className="mt-3 flex items-center gap-2 text-sm text-cool-grey">
              <FacebookIcon className="h-4 w-4 opacity-60" />
              {facebookDisplayName(contact.facebookPageName)}
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}
