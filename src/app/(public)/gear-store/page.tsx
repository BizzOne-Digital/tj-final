import { InnerPage } from "@/components/public/InnerPage";
import { CmsHtml } from "@/components/public/CmsHtml";
import { getSiteSettings } from "@/lib/services/site-settings";
import { getCms } from "@/lib/cms/content";

export default async function GearStorePage() {
  const cms = await getCms();
  const settings = await getSiteSettings();
  // Page Content wins; otherwise a link saved in League & Brand; otherwise the built-in store.
  const url = cms.isCustom("gear-store.url")
    ? cms.text("gear-store.url")
    : settings.league?.gearStoreUrl?.trim() || cms.text("gear-store.url");

  return (
    <InnerPage title={cms.text("gear-store.title")} subtitle={cms.text("gear-store.subtitle")}>
      <p className="text-cool-grey">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-electric-blue hover:underline"
        >
          {cms.text("gear-store.link.text")}
        </a>
      </p>
      <p className="mt-4">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-full bg-royal-blue px-5 py-2.5 text-sm font-bold text-white hover:bg-royal-blue/90"
        >
          {cms.text("gear-store.button")}
        </a>
      </p>
      <CmsHtml html={cms.html("gear-store.html")} className="mt-10" />
    </InnerPage>
  );
}
