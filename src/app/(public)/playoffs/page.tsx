import Link from "next/link";
import { InnerPage } from "@/components/public/InnerPage";
import { HubSections } from "@/components/public/HubSections";
import type { HubBlock } from "@/lib/hub-sections";
import { LEAGUE_SEASONS, COMING_SOON } from "@/lib/hub-sections";

export default function PlayoffsPage() {
  const blocks: HubBlock[] = LEAGUE_SEASONS.map((season) => ({
    id: `playoff-${season}`,
    title: `${season} Season`,
    level: 2,
    children: [
      { id: `playoff-${season}-4th`, title: "4th Grade Playoff Bracket", level: 4, body: COMING_SOON },
      { id: `playoff-${season}-6th`, title: "6th Grade Playoff Bracket", level: 4, body: COMING_SOON },
    ],
  }));
  return (
    <InnerPage title="Playoffs" subtitle="Championship brackets">
      <p className="mb-6 text-sm text-cool-grey">
        See also <Link href="/standings" className="text-electric-blue hover:underline">league standings</Link>.
      </p>
      <HubSections blocks={blocks} />
    </InnerPage>
  );
}
