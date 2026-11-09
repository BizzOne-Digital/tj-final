import { InnerPage } from "@/components/public/InnerPage";
import { ContactForm } from "@/components/public/ContactForm";
import { ContactInfoPanel } from "@/components/public/ContactInfoPanel";
import { CmsHtml } from "@/components/public/CmsHtml";
import { getSiteSettings } from "@/lib/services/site-settings";
import { getCms } from "@/lib/cms/content";

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const cms = await getCms();
  const c = settings.contact;

  return (
    <InnerPage title={cms.text("contact.title")} subtitle={cms.text("contact.subtitle")}>
      <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="min-w-0 lg:col-span-5">
          <h2 className="font-display text-lg font-bold uppercase text-ice-white">{cms.text("contact.left.heading")}</h2>
          <div className="mt-5">
            <ContactInfoPanel contact={c} intro={cms.text("contact.left.intro")} />
          </div>
        </div>

        <div className="min-w-0 lg:col-span-7">
          <h2 className="font-display text-lg font-bold uppercase text-ice-white">{cms.text("contact.right.heading")}</h2>
          <CmsHtml as="div" html={cms.html("contact.right.html")} className="mt-2 text-sm" />
          <div className="mt-6">
            <ContactForm />
          </div>
        </div>
      </div>
    </InnerPage>
  );
}
