import { InnerPage } from "@/components/public/InnerPage";
import { RegistrationForm } from "@/components/public/RegistrationForm";
import { getSiteSettings } from "@/lib/services/site-settings";
import { getCms } from "@/lib/cms/content";

export default async function BookingPage() {
  const settings = await getSiteSettings();
  const cms = await getCms();
  const league = settings.league ?? {};

  return (
    <InnerPage title={cms.text("booking.title")} subtitle={cms.text("booking.subtitle")}>
      <RegistrationForm
        seasonSlug={league.activeSeasonSlug ?? "2026-27"}
        firstTeamCents={league.firstTeamFeeCents ?? 20000}
        additionalTeamCents={league.additionalTeamFeeCents ?? 15000}
        registrationOpen={league.registrationOpen ?? true}
      />
    </InnerPage>
  );
}
