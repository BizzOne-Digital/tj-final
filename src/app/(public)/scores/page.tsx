import Link from "next/link";
import { InnerPage } from "@/components/public/InnerPage";
import { HubSections } from "@/components/public/HubSections";
import { allStandingsHubBlocks } from "@/lib/hub-sections";

export default function ScoresPage() {
  return (
    <InnerPage title="Scores" subtitle="Weekly scores by grade and season">
      <p className="mb-6 text-sm text-cool-grey">
        Week-by-week scores are listed under each season on the{" "}
        <Link href="/standings" className="text-electric-blue hover:underline">standings page</Link>
        . Jump to a week below:
      </p>
      <HubSections blocks={allStandingsHubBlocks()} />
    </InnerPage>
  );
}
