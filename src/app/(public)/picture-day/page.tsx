import { InnerPage } from "@/components/public/InnerPage";
import { CmsHtml } from "@/components/public/CmsHtml";
import { getCms } from "@/lib/cms/content";

export default async function PictureDayPage() {
  const cms = await getCms();
  return (
    <InnerPage title={cms.text("picture-day.title")} subtitle={cms.text("picture-day.subtitle")}>
      <CmsHtml html={cms.html("picture-day.html")} />
    </InnerPage>
  );
}
