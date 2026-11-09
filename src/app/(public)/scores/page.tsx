import { InnerPage } from "@/components/public/InnerPage";
import { HubSections } from "@/components/public/HubSections";
import { CmsHtml } from "@/components/public/CmsHtml";
import { allStandingsHubBlocks } from "@/lib/hub-sections";
import { getCms, hubBlocksFor } from "@/lib/cms/content";

export default async function ScoresPage() {
  const cms = await getCms();
  return (
    <InnerPage title={cms.text("scores.title")} subtitle={cms.text("scores.subtitle")}>
      <CmsHtml html={cms.html("scores.intro")} className="mb-6 text-sm" />
      {/* Weekly scores are edited under Standings & Scores in the admin portal. */}
      <HubSections blocks={hubBlocksFor(cms, "standings", allStandingsHubBlocks())} />
    </InnerPage>
  );
}
