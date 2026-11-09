import { InnerPage } from "@/components/public/InnerPage";
import { CmsHtml } from "@/components/public/CmsHtml";
import { getCms } from "@/lib/cms/content";

export default async function AccessibilityPage() {
  const cms = await getCms();
  return (
    <InnerPage title={cms.text("accessibility.title")} subtitle={cms.text("accessibility.subtitle") || undefined}>
      <CmsHtml html={cms.html("accessibility.html")} />
    </InnerPage>
  );
}
