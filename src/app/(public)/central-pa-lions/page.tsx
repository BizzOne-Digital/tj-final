import Link from "next/link";
import { InnerPage } from "@/components/public/InnerPage";
import { ContentImageGrid } from "@/components/public/ContentImage";
import { CmsHtml } from "@/components/public/CmsHtml";
import { getCms } from "@/lib/cms/content";

export default async function CentralPaLionsPage() {
  const cms = await getCms();
  const photos = cms.images("central-pa-lions.photos");

  return (
    <InnerPage title={cms.text("central-pa-lions.title")} subtitle={cms.text("central-pa-lions.subtitle")}>
      <section>
        <h2 className="font-display text-xl uppercase text-ice-white">{cms.text("central-pa-lions.heading")}</h2>
        <p className="mt-4 flex flex-wrap gap-4">
          <a
            href={cms.text("central-pa-lions.site.url")}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-royal-blue px-5 py-2.5 text-sm font-bold text-white"
          >
            {cms.text("central-pa-lions.site.label")}
          </a>
          <a
            href={cms.text("central-pa-lions.store.url")}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-electric-blue/40 px-5 py-2.5 text-sm font-bold text-electric-blue"
          >
            {cms.text("central-pa-lions.store.label")}
          </a>
        </p>
      </section>

      {photos.length > 0 && (
        <div className="mt-10">
          <ContentImageGrid images={photos} altPrefix="Central PA Lions" columns={1} size="galleryPhoto" />
        </div>
      )}

      <section id="about-academy" className="mt-12 scroll-mt-28">
        <CmsHtml html={cms.html("central-pa-lions.about.html")} />
      </section>

      <section id="mission" className="mt-12 scroll-mt-28">
        <CmsHtml html={cms.html("central-pa-lions.mission.html")} />
      </section>

      <section id="payment" className="mt-12 scroll-mt-28">
        <CmsHtml html={cms.html("central-pa-lions.payment.html")} />
      </section>

      <Link href="/about" className="mt-10 inline-block text-electric-blue hover:underline">
        {cms.text("central-pa-lions.backlink")}
      </Link>
    </InnerPage>
  );
}
