import { InnerPage } from "@/components/public/InnerPage";
import { CmsHtml } from "@/components/public/CmsHtml";
import { getCms } from "@/lib/cms/content";

export default async function JoinUsPage() {
  const cms = await getCms();
  return (
    <InnerPage title={cms.text("join-us.title")} subtitle={cms.text("join-us.subtitle")}>
      <CmsHtml html={cms.html("join-us.html")} />
    </InnerPage>
  );
}
