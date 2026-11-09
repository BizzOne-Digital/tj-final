import { InnerPage } from "@/components/public/InnerPage";
import { HubSections } from "@/components/public/HubSections";
import { allStandingsHubBlocks } from "@/lib/hub-sections";
import { getCms, hubBlocksFor } from "@/lib/cms/content";

export default async function StandingsPage() {
  const cms = await getCms();
  return (
    <InnerPage title={cms.text("standings.title")} subtitle={cms.text("standings.subtitle")}>
      <HubSections blocks={hubBlocksFor(cms, "standings", allStandingsHubBlocks())} />
    </InnerPage>
  );
}
