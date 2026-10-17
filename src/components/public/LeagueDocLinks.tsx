import Link from "next/link";
import { leagueDocUrl, allLeagueDocSlugs } from "@/lib/league-docs";

/** Download links for Drive-sourced printable forms */
export function LeagueDocLinks() {
  const slugs = allLeagueDocSlugs();
  if (!slugs.length) return null;
  return (
    <section className="mt-10">
      <h2 className="font-display text-lg uppercase text-ice-white">Printable documents (from league folder)</h2>
      <ul className="mt-4 space-y-2 text-sm">
        {slugs.map((slug) => {
          const url = leagueDocUrl(slug);
          if (!url) return null;
          return (
            <li key={slug}>
              <a href={url} target="_blank" rel="noopener noreferrer" className="text-electric-blue hover:underline">
                {slug.replace(/-/g, " ")} ↗
              </a>
              {" · "}
              <Link href={`/information/${slug}`} className="text-cool-grey hover:text-white">
                Form page
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
