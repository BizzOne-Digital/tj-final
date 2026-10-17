import { InnerPage } from "@/components/public/InnerPage";
import { HubSections } from "@/components/public/HubSections";
import { allStarsBlocks } from "@/lib/hub-sections";

export default function AllStarsPage() {
  return (
    <InnerPage title="League All Stars & Games" subtitle="All-Star teams by season">
      <HubSections blocks={allStarsBlocks()} />
    </InnerPage>
  );
}
