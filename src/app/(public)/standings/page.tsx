import { InnerPage } from "@/components/public/InnerPage";
import { HubSections } from "@/components/public/HubSections";
import { allStandingsHubBlocks } from "@/lib/hub-sections";

export default function StandingsPage() {
  return (
    <InnerPage title="League Standings" subtitle="2026-27 through 2028-29 seasons">
      <HubSections blocks={allStandingsHubBlocks()} />
    </InnerPage>
  );
}
