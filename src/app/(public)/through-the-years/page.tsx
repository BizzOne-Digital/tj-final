import Link from "next/link";
import { InnerPage } from "@/components/public/InnerPage";
import { getCms } from "@/lib/cms/content";

const SEASONS = ["2026-27", "2027-28", "2028-29", "2029-30"];

export default async function ThroughTheYearsPage() {
  const cms = await getCms();
  return (
    <InnerPage title={cms.text("through-the-years.title")} subtitle={cms.text("through-the-years.subtitle")}>
      <p>{cms.text("through-the-years.intro")}</p>
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
