import { InnerPage } from "@/components/public/InnerPage";
import { ContentImage } from "@/components/public/ContentImage";
import { getSiteSettings } from "@/lib/services/site-settings";
import { LEAGUE_INFORMATION_HTML } from "@/lib/league-copy";
import { GOLDEN_TICKET_PICTURE } from "@/lib/drive-assets";

export default async function LeagueInformationPage() {
  const settings = await getSiteSettings();
  return (
    <InnerPage title="League Information" subtitle="Registration, divisions, and season structure">
      <div className="grid min-w-0 gap-10 lg:grid-cols-2 lg:items-start">
        <div
          className="prose prose-invert max-w-none min-w-0"
          dangerouslySetInnerHTML={{ __html: LEAGUE_INFORMATION_HTML }}
        />
        <ContentImage
          src={GOLDEN_TICKET_PICTURE}
          alt="Golden Ticket graphic"
          size="feature"
          frameClassName="!mx-0 w-full max-w-none lg:ml-auto lg:max-w-md"
        />
      </div>
      <h2 className="mt-10 font-display text-xl uppercase">Eligibility</h2>
      <div className="mt-4" dangerouslySetInnerHTML={{ __html: settings.league?.eligibilityHtml ?? "" }} />
      <h2 className="mt-8 font-display text-xl uppercase">Venue</h2>
      <p>
        {settings.contact?.gameVenueName}
        <br />
        {settings.contact?.gameVenueAddress}
      </p>
    </InnerPage>
  );
}
