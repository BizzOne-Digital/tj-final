import { InnerPage } from "@/components/public/InnerPage";
import { HubSections } from "@/components/public/HubSections";
import { teamDirectoryBlocks } from "@/lib/hub-sections";

export default function TeamDirectoryPage() {
  return (
    <InnerPage title="Team Directory" subtitle="Meet the teams by season and division">
      <HubSections blocks={teamDirectoryBlocks()} />
    </InnerPage>
  );
}
