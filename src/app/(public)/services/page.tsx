import { InnerPage } from "@/components/public/InnerPage";
import { CmsHtml } from "@/components/public/CmsHtml";
import { getCms } from "@/lib/cms/content";

export default async function ServicesPage() {
  const cms = await getCms();
  return (
    <InnerPage title={cms.text("services.title")} subtitle={cms.text("services.subtitle")}>
      <CmsHtml html={cms.html("services.html")} />
    </InnerPage>
  );
}
