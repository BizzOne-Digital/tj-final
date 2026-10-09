import { InnerPage } from "@/components/public/InnerPage";
import { SchoolDirectoryCard } from "@/components/public/SchoolDirectoryCard";
import { getSchools, type JsonDoc } from "@/lib/services/league";
import { ICC_SLUGS, LHAC_SLUGS } from "@/lib/league-copy";

export default async function TeamsPage() {
  const schools = await getSchools();
  const bySlug = (slugs: readonly string[]) =>
    slugs
      .map((s) => schools.find((x) => String(x.slug) === s))
      .filter(Boolean) as JsonDoc[];

  const lhac = bySlug(LHAC_SLUGS);
  const icc = bySlug(ICC_SLUGS);

  return (
    <InnerPage title="Team Directory" subtitle="2026-27 season — LHAC & ICC programs">
      <section className="mb-14">
        <h2 className="font-display text-2xl font-bold uppercase text-ice-white">LHAC Teams</h2>
        <ul className="mt-6 grid gap-4 lg:grid-cols-2">
          {lhac.map((s) => (
            <SchoolDirectoryCard key={String(s.slug)} school={s} />
          ))}
        </ul>
      </section>
      <section>
        <h2 className="font-display text-2xl font-bold uppercase text-ice-white">ICC Teams</h2>
        <ul className="mt-6 grid gap-4 lg:grid-cols-2">
          {icc.map((s) => (
            <SchoolDirectoryCard key={String(s.slug)} school={s} />
          ))}
        </ul>
      </section>
    </InnerPage>
  );
}
