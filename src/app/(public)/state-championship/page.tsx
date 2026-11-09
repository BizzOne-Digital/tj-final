import Link from "next/link";
import { InnerPage } from "@/components/public/InnerPage";
import { ContentImage } from "@/components/public/ContentImage";
import { HubSections } from "@/components/public/HubSections";
import { goldenTicketWinnerBlocks } from "@/lib/hub-sections";
import { getCms, hubBlocksFor } from "@/lib/cms/content";

export default async function StateChampionshipPage() {
  const cms = await getCms();
  return (
    <InnerPage title={cms.text("state-championship.title")} subtitle={cms.text("state-championship.subtitle")}>
      <div className="grid min-w-0 gap-10 lg:grid-cols-2 lg:items-start">
        <div className="flex min-w-0 flex-col justify-center">
          <p className="text-cool-grey">{cms.text("state-championship.text")}</p>
          <Link href="/information" className="mt-6 inline-block text-electric-blue hover:underline">
            {cms.text("state-championship.link")}
          </Link>
        </div>
        <ContentImage
          src={cms.image("state-championship.image")}
          alt="Golden Ticket — P-O Select League state qualifier"
          size="feature"
          frameClassName="!mx-0 w-full max-w-none lg:ml-auto lg:max-w-md"
        />
      </div>
      <div className="mt-14">
        <h2 className="font-display text-2xl font-bold uppercase text-gold">
          {cms.text("state-championship.winners.heading")}
        </h2>
        <HubSections blocks={hubBlocksFor(cms, "state-championship", goldenTicketWinnerBlocks())} />
      </div>
    </InnerPage>
  );
}
