import Link from "next/link";
import {
  FORM_LINK_TITLES,
  formExternalUrl,
  WEEKLY_FORM_LABELS,
  WEEKLY_FORM_SLUGS,
  YEARLY_FORM_LABELS,
  YEARLY_FORM_SLUGS,
} from "@/lib/league-forms";
import type { JsonDoc } from "@/lib/services/league";

function FormList({
  slugs,
  labels,
  resources,
}: {
  slugs: readonly string[];
  labels: Record<string, string>;
  resources: JsonDoc[];
}) {
  const bySlug = new Map(resources.map((r) => [String(r.slug), r]));
  return (
    <ul className="mt-4 space-y-2">
      {slugs.map((slug, i) => {
        const r = bySlug.get(slug);
        const title = labels[slug] ?? (r ? String(r.title) : slug);
        const href = r?.externalUrl ? String(r.externalUrl) : formExternalUrl(slug);
        return (
          <li key={slug} className="flex gap-2 text-sm">
            <span className="text-cool-grey">{i + 1}.</span>
            {href ? (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                title={FORM_LINK_TITLES[slug]}
                className="text-electric-blue hover:underline"
              >
                {title}
              </a>
            ) : (
              <Link href={`/information/${slug}`} className="text-electric-blue hover:underline">
                {title}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function TeamFormLinks({ resources }: { resources: JsonDoc[] }) {
  return (
    <>
      <section>
        <h2 className="font-display text-xl uppercase text-ice-white">Yearly forms</h2>
        <p className="mt-2 text-sm text-gold">These forms must be filled out before the first game.</p>
        <FormList slugs={YEARLY_FORM_SLUGS} labels={YEARLY_FORM_LABELS} resources={resources} />
      </section>
      <section>
        <h2 className="font-display text-xl uppercase text-ice-white">Weekly forms</h2>
        <p className="mt-2 text-sm text-cool-grey">Submit during the season as noted by your coach.</p>
        <FormList slugs={WEEKLY_FORM_SLUGS} labels={WEEKLY_FORM_LABELS} resources={resources} />
      </section>
    </>
  );
}
