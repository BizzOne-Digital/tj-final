import { InnerPage } from "@/components/public/InnerPage";
import { RegistrationForm } from "@/components/public/RegistrationForm";
import { getSiteSettings } from "@/lib/services/site-settings";

export default async function BookingPage() {
  const settings = await getSiteSettings();
  const league = settings.league ?? {};

  return (
    <InnerPage
      title="Team Registration"
      subtitle="Submit a school/team registration request for the active season."
    >
      <RegistrationForm
        seasonSlug={league.activeSeasonSlug ?? "2026-27"}
        firstTeamCents={league.firstTeamFeeCents ?? 20000}
        additionalTeamCents={league.additionalTeamFeeCents ?? 15000}
        registrationOpen={league.registrationOpen ?? true}
      />
    </InnerPage>
  );
}
