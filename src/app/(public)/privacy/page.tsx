import { InnerPage } from "@/components/public/InnerPage";
import { CmsHtml } from "@/components/public/CmsHtml";
import { getCms } from "@/lib/cms/content";

export default async function PrivacyPage() {
  const cms = await getCms();
  return (
    <InnerPage title={cms.text("privacy.title")} subtitle={cms.text("privacy.subtitle") || undefined}>
      <CmsHtml html={cms.html("privacy.html")} />
    </InnerPage>
  );
}
