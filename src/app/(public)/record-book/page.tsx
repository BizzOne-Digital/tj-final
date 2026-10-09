import { InnerPage } from "@/components/public/InnerPage";

export default function RecordBookPage() {
  return (
    <InnerPage title="Record Book" subtitle="Team, individual, and coaching records">
      {["2026-27", "2027-28", "2028-29", "2029-30"].map((s) => (
        <p key={s} className="mt-2">{s} — more information coming soon.</p>
      ))}
    </InnerPage>
  );
}
