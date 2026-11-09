import Link from "next/link";
import { InnerPage } from "@/components/public/InnerPage";
import { HubSections } from "@/components/public/HubSections";
import { playoffBlocks } from "@/lib/hub-sections";
import { getCms, hubBlocksFor } from "@/lib/cms/content";

export default async function PlayoffsPage() {
  const cms = await getCms();
  return (
    <InnerPage title={cms.text("playoffs.title")} subtitle={cms.text("playoffs.subtitle")}>
      <p className="mb-6 text-sm text-cool-grey">
        See also <Link href="/standings" className="text-electric-blue hover:underline">league standings</Link>.
      </p>
      <HubSections blocks={hubBlocksFor(cms, "playoffs", playoffBlocks())} />
    </InnerPage>
  );
}
