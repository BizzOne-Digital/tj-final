import { InnerPage } from "@/components/public/InnerPage";

export default function SupportPage() {
  return (
    <InnerPage title="Support Our Program" subtitle="Equipment, facilities, scholarships, and community events">
      <p>
        Your support helps fund equipment, facilities, scholarships, and community events. Contact TJ Anderson:
        <a href="mailto:tjandersty@gmail.com" className="text-electric-blue"> tjandersty@gmail.com</a> · 814-500-8613
      </p>
      <p className="mt-6">
        <a href="/sponsorship">Become a sponsor →</a>
      </p>
    </InnerPage>
  );
}
