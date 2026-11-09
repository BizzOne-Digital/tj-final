import { InnerPage } from "@/components/public/InnerPage";
import { getSiteSettings } from "@/lib/services/site-settings";
import { getCms } from "@/lib/cms/content";
import { formatUsdFromCents } from "@/lib/fee-calculator";
import Link from "next/link";

export default async function PricingPage() {
  const settings = await getSiteSettings();
  const cms = await getCms();
  const league = settings.league ?? {};
  return (
    <InnerPage title={cms.text("pricing.title")} subtitle={cms.text("pricing.subtitle")}>
      <ul>
        <li>First team: {formatUsdFromCents(league.firstTeamFeeCents ?? 20000)}</li>
        <li>Each additional team: {formatUsdFromCents(league.additionalTeamFeeCents ?? 15000)}</li>
      </ul>
      <p className="mt-6">
        <Link href="/booking" className="text-electric-blue">{cms.text("pricing.link")}</Link>
      </p>
    </InnerPage>
  );
}
