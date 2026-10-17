import Link from "next/link";
import { InnerPage } from "@/components/public/InnerPage";

const SEASONS = ["2026-27", "2027-28", "2028-29", "2029-30"];

export default function ThroughTheYearsPage() {
  return (
    <InnerPage title="Through the Years" subtitle="Select League teams and players from the past">
      <p>Please take a look at Select League teams and players from past seasons.</p>
      <ul className="mt-6 space-y-2">
        {SEASONS.map((s) => (
          <li key={s}>
            <Link href={`/seasons/${s}/teams`}>{s} season</Link> — more information coming soon.
          </li>
        ))}
      </ul>
    </InnerPage>
  );
}
