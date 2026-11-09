import { InnerPage } from "@/components/public/InnerPage";
import { HubSections } from "@/components/public/HubSections";
import { teamDirectoryBlocks } from "@/lib/hub-sections";
import { getCms, hubBlocksFor } from "@/lib/cms/content";

export default async function TeamDirectoryPage() {
  const cms = await getCms();
  return (
    <InnerPage title={cms.text("team-directory.title")} subtitle={cms.text("team-directory.subtitle")}>
      <HubSections blocks={hubBlocksFor(cms, "team-directory", teamDirectoryBlocks())} />
    </InnerPage>
  );
}
