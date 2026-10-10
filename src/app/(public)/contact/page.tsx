import { InnerPage } from "@/components/public/InnerPage";

import { ContactForm } from "@/components/public/ContactForm";

import { ContactInfoPanel } from "@/components/public/ContactInfoPanel";

import { getSiteSettings } from "@/lib/services/site-settings";



export default async function ContactPage() {

  const settings = await getSiteSettings();

  const c = settings.contact;



  return (

    <InnerPage
      title="Contact"
      subtitle="Get in touch — we're here to help with any questions about our programs."
    >

      <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-12">

        <div className="min-w-0 lg:col-span-5">

          <h2 className="font-display text-lg font-bold uppercase text-ice-white">Get in touch</h2>

          <div className="mt-5">

            <ContactInfoPanel contact={c} />

          </div>

        </div>



        <div className="min-w-0 lg:col-span-7">

          <h2 className="font-display text-lg font-bold uppercase text-ice-white">Send a message</h2>

          <p className="mt-2 text-sm text-cool-grey">

            Use the form below and we will route your note to league staff. For registration, you can

            also use the{" "}

            <a href="/booking" className="text-electric-blue hover:underline">team registration</a> page.

          </p>

          <div className="mt-6">

            <ContactForm />

          </div>

        </div>

      </div>

    </InnerPage>

  );

}


