import { InnerPage } from "@/components/public/InnerPage";
import { getFaqs } from "@/lib/services/league";

export default async function FaqPage() {
  const faqs = await getFaqs();
  return (
    <InnerPage title="FAQ" subtitle="Frequently asked questions">
      {faqs.length === 0 ? (
        <p>Run <code>npm run seed</code> after connecting MongoDB for FAQ content.</p>
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
