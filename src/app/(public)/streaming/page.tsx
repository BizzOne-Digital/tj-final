import { InnerPage } from "@/components/public/InnerPage";
import { getSiteSettings } from "@/lib/services/site-settings";
import { NFHS_STREAMING_HTML } from "@/lib/league-copy";

export default async function StreamingPage() {
  const settings = await getSiteSettings();
  const url =
    settings.league?.nfhsStreamUrl ??
    "https://www.nfhsnetwork.com/schools/philipsburg-osceola-area-high-school-philipsburg-pa";
  return (
    <InnerPage title="Streaming" subtitle="NFHS Network">
      <div dangerouslySetInnerHTML={{ __html: NFHS_STREAMING_HTML }} />
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-block rounded-full bg-royal-blue px-6 py-3 font-semibold text-white"
      >
        Watch on NFHS Network ↗
      </a>
    </InnerPage>
  );
}
