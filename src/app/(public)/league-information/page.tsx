import { InnerPage } from "@/components/public/InnerPage";
import { ContentImage } from "@/components/public/ContentImage";
import { getSiteSettings } from "@/lib/services/site-settings";
import { getCms, htmlWithFallback } from "@/lib/cms/content";

export default async function LeagueInformationPage() {
  const settings = await getSiteSettings();
  const cms = await getCms();
  return (
    <InnerPage title={cms.text("league-information.title")} subtitle={cms.text("league-information.subtitle")}>
      <div className="grid min-w-0 gap-10 lg:grid-cols-2 lg:items-start">
        <div
          className="prose prose-invert max-w-none min-w-0"
          dangerouslySetInnerHTML={{ __html: cms.html("league-information.html") }}
        />
        <ContentImage
          src={cms.image("league-information.image")}
          alt="Golden Ticket graphic"
          size="feature"
          frameClassName="!mx-0 w-full max-w-none lg:ml-auto lg:max-w-md"
        />
      </div>
      <h2 className="mt-10 font-display text-xl uppercase">{cms.text("league-information.eligibility.heading")}</h2>
      <div
        className="mt-4"
        dangerouslySetInnerHTML={{
          __html: htmlWithFallback(cms, "league-information.eligibility.html", settings.league?.eligibilityHtml),
        }}
      />
      <h2 className="mt-8 font-display text-xl uppercase">{cms.text("league-information.venue.heading")}</h2>
      <p>
        {settings.contact?.gameVenueName}
        <br />
        {settings.contact?.gameVenueAddress}
      </p>
    </InnerPage>
  );
}
