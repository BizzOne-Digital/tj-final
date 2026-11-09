import { InnerPage } from "@/components/public/InnerPage";
import { CmsHtml } from "@/components/public/CmsHtml";
import { getCms } from "@/lib/cms/content";

export default async function SupportPage() {
  const cms = await getCms();
  return (
    <InnerPage title={cms.text("support.title")} subtitle={cms.text("support.subtitle")}>
      <CmsHtml html={cms.html("support.html")} />
    </InnerPage>
  );
}
