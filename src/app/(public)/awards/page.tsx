import { InnerPage } from "@/components/public/InnerPage";
import { HubSections } from "@/components/public/HubSections";
import { awardsChampionshipBlocks } from "@/lib/hub-sections";
import { getCms, hubBlocksFor } from "@/lib/cms/content";

export default async function AwardsPage() {
  const cms = await getCms();
  return (
    <InnerPage title={cms.text("awards.title")} subtitle={cms.text("awards.subtitle")}>
      <HubSections blocks={hubBlocksFor(cms, "awards", awardsChampionshipBlocks())} />
    </InnerPage>
  );
}
