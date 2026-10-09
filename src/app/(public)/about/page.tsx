import { InnerPage } from "@/components/public/InnerPage";
import { AboutPageContent } from "@/components/public/AboutPageContent";
import { getSiteSettings } from "@/lib/services/site-settings";

const MOUNTIES_ABOUT_COPY = `
<p>Mounties Youth Basketball is here to put in the hard work, on and off the court and in the classroom; learn; work on our game; encourage our teammates; and to have fun! We live by our motto of <strong>Attitude &amp; Effort</strong>.</p>
<p>At the end of the day, we're <strong>FAMILY</strong> as we believe in supporting one another wholeheartedly. We're excited to have you and explore all that we have to offer for youth basketball in Central PA.</p>
<p>Our league is an <strong>official state qualifier league</strong> for the Pennsylvania Middle School Basketball Championship. We are looking for teams to join our P-O Select League.</p>
<p>Questions? Email <a href="mailto:mountiesyouthbasketball@gmail.com">mountiesyouthbasketball@gmail.com</a></p>
`;

export default async function AboutPage() {
  const settings = await getSiteSettings();
  const aboutHtml = settings.league?.aboutHtml?.trim() ? settings.league.aboutHtml : MOUNTIES_ABOUT_COPY;
  const philosophyHtml = settings.league?.mountiesPhilosophyHtml?.trim() ?? "";

  return (
    <InnerPage title="About Us" subtitle={settings.headlines?.secondary ?? "ONE TEAM. ONE GOAL. ONE PURPOSE."}>
      <AboutPageContent aboutHtml={aboutHtml} philosophyHtml={philosophyHtml} />
    </InnerPage>
  );
}
