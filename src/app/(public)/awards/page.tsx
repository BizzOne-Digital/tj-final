import { InnerPage } from "@/components/public/InnerPage";
import { HubSections } from "@/components/public/HubSections";
import { awardsChampionshipBlocks } from "@/lib/hub-sections";

export default function AwardsPage() {
  return (
    <InnerPage title="Awards & Championships" subtitle="League champions and player awards">
      <HubSections blocks={awardsChampionshipBlocks()} />
    </InnerPage>
  );
}
