import { InnerPage } from "@/components/public/InnerPage";
import { CmsHtml } from "@/components/public/CmsHtml";
import { getCms } from "@/lib/cms/content";

export default async function SponsorshipPage() {
  const cms = await getCms();
  return (
    <InnerPage title={cms.text("sponsorship.title")} subtitle={cms.text("sponsorship.subtitle")}>
      <CmsHtml html={cms.html("sponsorship.html")} />
    </InnerPage>
  );
}
