import { InnerPage } from "@/components/public/InnerPage";
import { ContentImage } from "@/components/public/ContentImage";
import { CmsHtml } from "@/components/public/CmsHtml";
import { getCms } from "@/lib/cms/content";

export default async function GalleryPage() {
  const cms = await getCms();
  const photos = cms.images("gallery.photos");
  return (
    <InnerPage title={cms.text("gallery.title")} subtitle={cms.text("gallery.subtitle")}>
      <CmsHtml html={cms.html("gallery.html")} />
      {photos.length > 0 ? (
        <ul className="mt-8 grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((src, i) => (
            <li key={`${i}-${src}`} className="min-w-0">
              <ContentImage
                src={src}
                alt={`Season photo ${i + 1}`}
                size="tile"
                frameClassName="!mx-0 w-full max-w-none"
              />
            </li>
          ))}
        </ul>
      ) : null}
    </InnerPage>
  );
}
