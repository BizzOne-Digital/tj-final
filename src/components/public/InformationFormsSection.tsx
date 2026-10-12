import Link from "next/link";
import { leagueDocUrl } from "@/lib/league-docs";
import {
  formExternalUrl,
  WEEKLY_FORM_LABELS,
  WEEKLY_FORM_SLUGS,
  YEARLY_FORM_LABELS,
  YEARLY_FORM_SLUGS,
} from "@/lib/league-forms";
import type { JsonDoc } from "@/lib/services/league";

function linkFor(slug: string, resources: JsonDoc[]) {
  const r = resources.find((x) => String(x.slug) === slug);
  const formUrl = r?.externalUrl ? String(r.externalUrl) : formExternalUrl(slug);
  const doc = leagueDocUrl(slug);
  if (formUrl) {
    return {
      href: formUrl,
      external: true,
      label: String(r?.title ?? YEARLY_FORM_LABELS[slug] ?? WEEKLY_FORM_LABELS[slug] ?? slug),
    };
  }
  if (doc) {
    return { href: doc, external: true, label: YEARLY_FORM_LABELS[slug] ?? WEEKLY_FORM_LABELS[slug] ?? slug };
  }
  return { href: `/information/${slug}`, external: false, label: YEARLY_FORM_LABELS[slug] ?? WEEKLY_FORM_LABELS[slug] ?? slug };
}

export function InformationFormsSection({ resources }: { resources: JsonDoc[] }) {
  return (
    <div className="grid gap-10 md:grid-cols-2">
      <section>
        <h2 className="font-display text-xl uppercase text-ice-white">Yearly forms</h2>
        <p className="mt-2 text-sm text-gold">Required before the first game.</p>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm">
          {YEARLY_FORM_SLUGS.map((slug) => {
            const { href, external, label } = linkFor(slug, resources);
            return (
              <li key={slug}>
                {external ? (
                  <a href={href} target="_blank" rel="noopener noreferrer" className="text-electric-blue hover:underline">
                    {label}
                  </a>
                ) : (
                  <Link href={href} className="text-electric-blue hover:underline">{label}</Link>
                )}
              </li>
            );
          })}
        </ol>
      </section>
      <section>
        <h2 className="font-display text-xl uppercase text-ice-white">Weekly forms</h2>
        <p className="mt-2 text-sm text-cool-grey">During the season — by week as coaches assign.</p>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm">
          {WEEKLY_FORM_SLUGS.map((slug) => {
            const { href, external, label } = linkFor(slug, resources);
            return (
              <li key={slug}>
                {external ? (
                  <a href={href} target="_blank" rel="noopener noreferrer" className="text-electric-blue hover:underline">
                    {label}
                  </a>
                ) : (
                  <Link href={href} className="text-electric-blue hover:underline">{label}</Link>
                )}
              </li>
            );
          })}
        </ol>
        <p className="mt-4 text-sm">
          <Link href="/information/how-can-we-be-better" className="font-semibold text-electric-blue hover:underline">
            ‼️ How Can We Be Better? — form &amp; document →
          </Link>
        </p>
      </section>
    </div>
  );
}
