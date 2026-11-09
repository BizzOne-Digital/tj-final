import { InnerPage } from "@/components/public/InnerPage";
import { CmsHtml } from "@/components/public/CmsHtml";
import { getSiteSettings } from "@/lib/services/site-settings";
import { getCms } from "@/lib/cms/content";

export default async function StreamingPage() {
  const settings = await getSiteSettings();
  const cms = await getCms();
  const url =
    settings.league?.nfhsStreamUrl ??
    "https://www.nfhsnetwork.com/schools/philipsburg-osceola-area-high-school-philipsburg-pa";
  return (
    <InnerPage title={cms.text("streaming.title")} subtitle={cms.text("streaming.subtitle")}>
      <CmsHtml html={cms.html("streaming.html")} />
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-block rounded-full bg-royal-blue px-6 py-3 font-semibold text-white"
      >
        {cms.text("streaming.button")}
      </a>
    </InnerPage>
  );
}
