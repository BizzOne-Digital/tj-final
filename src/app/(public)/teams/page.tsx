import { InnerPage } from "@/components/public/InnerPage";
import { SchoolDirectoryCard } from "@/components/public/SchoolDirectoryCard";
import { getSchools, type JsonDoc } from "@/lib/services/league";
import { getCms } from "@/lib/cms/content";
import { ICC_SLUGS, LHAC_SLUGS } from "@/lib/league-copy";

export default async function TeamsPage() {
  const schools = await getSchools();
  const cms = await getCms();
  const bySlug = (slugs: readonly string[]) =>
    slugs
      .map((s) => schools.find((x) => String(x.slug) === s))
      .filter(Boolean) as JsonDoc[];

  const lhac = bySlug(LHAC_SLUGS);
  const icc = bySlug(ICC_SLUGS);

  return (
    <InnerPage title={cms.text("teams.title")} subtitle={cms.text("teams.subtitle")}>
      <section className="mb-14">
        <h2 className="font-display text-2xl font-bold uppercase text-ice-white">{cms.text("teams.lhac.heading")}</h2>
        <ul className="mt-6 grid gap-4 lg:grid-cols-2">
          {lhac.map((s) => (
            <SchoolDirectoryCard key={String(s.slug)} school={s} />
          ))}
        </ul>
      </section>
      <section>
        <h2 className="font-display text-2xl font-bold uppercase text-ice-white">{cms.text("teams.icc.heading")}</h2>
        <ul className="mt-6 grid gap-4 lg:grid-cols-2">
          {icc.map((s) => (
            <SchoolDirectoryCard key={String(s.slug)} school={s} />
          ))}
        </ul>
      </section>
    </InnerPage>
  );
}
