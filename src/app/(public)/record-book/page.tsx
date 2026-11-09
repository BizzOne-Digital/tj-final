import { InnerPage } from "@/components/public/InnerPage";
import { CmsHtml } from "@/components/public/CmsHtml";
import { getCms } from "@/lib/cms/content";

export default async function RecordBookPage() {
  const cms = await getCms();
  return (
    <InnerPage title={cms.text("record-book.title")} subtitle={cms.text("record-book.subtitle")}>
      <CmsHtml html={cms.html("record-book.html")} />
    </InnerPage>
  );
}
