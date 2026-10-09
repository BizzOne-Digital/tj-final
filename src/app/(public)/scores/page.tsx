import { InnerPage } from "@/components/public/InnerPage";

const WEEKS = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7"];

export default function ScoresPage() {
  return (
    <InnerPage title="Scores" subtitle="Weekly results — 2026-27 season">
      <h2>4th grade</h2>
      <ul>
        {WEEKS.map((w) => (
          <li key={`4-${w}`}>{w} scores — more information coming soon.</li>
        ))}
      </ul>
      <h2 className="mt-10">6th grade</h2>
      <ul>
        {WEEKS.map((w) => (
          <li key={`6-${w}`}>{w} scores — more information coming soon.</li>
        ))}
      </ul>
    </InnerPage>
  );
}
