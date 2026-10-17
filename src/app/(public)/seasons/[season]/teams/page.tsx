import Link from "next/link";
import { InnerPage } from "@/components/public/InnerPage";
import { getSeasonTeams } from "@/lib/services/league";

export default async function SeasonTeamsPage({
  params,
}: {
  params: Promise<{ season: string }>;
}) {
  const { season } = await params;
  const teams = await getSeasonTeams(season);
  return (
    <InnerPage title={`${season} Teams`} subtitle="Season directory">
      <ul className="space-y-2">
        {teams.map((t) => (
          <li key={String(t.teamSlug)}>
            <Link href={`/seasons/${season}/teams/${t.teamSlug}`}>{String(t.teamName)}</Link>
          </li>
        ))}
      </ul>
      {teams.length === 0 && <p className="text-cool-grey">Coming soon for this season.</p>}
    </InnerPage>
  );
}
