import { InnerPage } from "@/components/public/InnerPage";
import { CmsHtml } from "@/components/public/CmsHtml";
import { getCms } from "@/lib/cms/content";

export default async function TestimonialsPage() {
  const cms = await getCms();
  return (
    <InnerPage title={cms.text("testimonials.title")} subtitle={cms.text("testimonials.subtitle")}>
      <CmsHtml html={cms.html("testimonials.html")} />
    </InnerPage>
  );
}
