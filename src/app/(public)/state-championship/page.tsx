import Link from "next/link";
import { InnerPage } from "@/components/public/InnerPage";
import { ContentImage } from "@/components/public/ContentImage";
import { HubSections } from "@/components/public/HubSections";
import { GOLDEN_TICKET_PICTURE } from "@/lib/drive-assets";
import { goldenTicketWinnerBlocks } from "@/lib/hub-sections";

export default function StateChampionshipPage() {
  return (
    <InnerPage title="Golden Ticket" subtitle="State Championship invite league">
      <div className="grid min-w-0 gap-10 lg:grid-cols-2 lg:items-start">
        <div className="flex min-w-0 flex-col justify-center">
          <p className="text-cool-grey">
            Champion and runner-up in both the 3/4 and 5/6 divisions earn invites to the Pennsylvania
            Middle School Basketball Championship in State College, PA.
          </p>
          <Link href="/information" className="mt-6 inline-block text-electric-blue hover:underline">
            Forms &amp; important documents →
          </Link>
        </div>
        <ContentImage
          src={GOLDEN_TICKET_PICTURE}
          alt="Golden Ticket — P-O Select League state qualifier"
          size="feature"
          frameClassName="!mx-0 w-full max-w-none lg:ml-auto lg:max-w-md"
        />
      </div>
      <div className="mt-14">
        <h2 className="font-display text-2xl font-bold uppercase text-gold">Golden Ticket winners</h2>
        <HubSections blocks={goldenTicketWinnerBlocks()} />
      </div>
    </InnerPage>
  );
}
