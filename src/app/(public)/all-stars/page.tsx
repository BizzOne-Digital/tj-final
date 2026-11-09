import { InnerPage } from "@/components/public/InnerPage";
import { HubSections } from "@/components/public/HubSections";
import { allStarsBlocks } from "@/lib/hub-sections";
import { getCms, hubBlocksFor } from "@/lib/cms/content";

export default async function AllStarsPage() {
  const cms = await getCms();
  return (
    <InnerPage title={cms.text("all-stars.title")} subtitle={cms.text("all-stars.subtitle")}>
      <HubSections blocks={hubBlocksFor(cms, "all-stars", allStarsBlocks())} />
    </InnerPage>
  );
}
