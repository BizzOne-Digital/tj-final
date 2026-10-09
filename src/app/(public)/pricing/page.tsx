import { InnerPage } from "@/components/public/InnerPage";
import { getSiteSettings } from "@/lib/services/site-settings";
import { formatUsdFromCents } from "@/lib/fee-calculator";
import Link from "next/link";

export default async function PricingPage() {
  const settings = await getSiteSettings();
  const league = settings.league ?? {};
  return (
    <InnerPage title="Registration Pricing" subtitle="Per school / organization per season">
      <ul>
        <li>First team: {formatUsdFromCents(league.firstTeamFeeCents ?? 20000)}</li>
        <li>Each additional team: {formatUsdFromCents(league.additionalTeamFeeCents ?? 15000)}</li>
      </ul>
      <p className="mt-6">
        <Link href="/booking" className="text-electric-blue">Submit a registration request →</Link>
      </p>
    </InnerPage>
  );
}
