import { InnerPage } from "@/components/public/InnerPage";
import { getFaqs } from "@/lib/services/league";
import { getCms } from "@/lib/cms/content";

export default async function FaqPage() {
  const faqs = await getFaqs();
  const cms = await getCms();
  return (
    <InnerPage title={cms.text("faq-page.title")} subtitle={cms.text("faq-page.subtitle")}>
      {faqs.length === 0 ? (
        <p>Questions and answers will be posted here soon.</p>
      ) : (
        <div className="space-y-4">
          {faqs.map((f) => (
            <details key={String(f._id)} className="rounded-xl border border-white/10 p-4">
              <summary className="cursor-pointer font-semibold text-ice-white">{String(f.question)}</summary>
              <div className="mt-3 text-cool-grey" dangerouslySetInnerHTML={{ __html: String(f.answerHtml) }} />
            </details>
          ))}
        </div>
      )}
    </InnerPage>
  );
}
