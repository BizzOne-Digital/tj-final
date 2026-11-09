import { InnerPage } from "@/components/public/InnerPage";
import { AboutPageContent } from "@/components/public/AboutPageContent";
import { getSiteSettings } from "@/lib/services/site-settings";
import { getCms, htmlWithFallback } from "@/lib/cms/content";

export default async function AboutPage() {
  const settings = await getSiteSettings();
  const cms = await getCms();
  const aboutHtml = htmlWithFallback(cms, "about.story.html", settings.league?.aboutHtml);
  const philosophyHtml = htmlWithFallback(
    cms,
    "about.philosophy.html",
    settings.league?.mountiesPhilosophyHtml,
  ).trim();

  return (
    <InnerPage
      title={cms.text("about.title")}
      subtitle={cms.text("about.subtitle") || settings.headlines?.secondary || "ONE TEAM. ONE GOAL. ONE PURPOSE."}
    >
      <AboutPageContent
        aboutHtml={aboutHtml}
        philosophyHtml={philosophyHtml}
        content={{
          image: cms.image("about.image"),
          kicker: cms.text("about.kicker"),
          heading: cms.text("about.heading"),
          intro: cms.text("about.intro"),
          badges: [cms.text("about.badge1"), cms.text("about.badge2"), cms.text("about.badge3")],
          storyLabel: cms.text("about.story.label"),
          philosophyHeading: cms.text("about.philosophy.heading"),
          philosophyIntro: cms.text("about.philosophy.intro"),
          pillars: [1, 2, 3].map((n) => ({
            title: cms.text(`about.pillar${n}.title`),
            description: cms.text(`about.pillar${n}.text`),
          })),
          momentsLabel: cms.text("about.moments.label"),
          momentsHeading: cms.text("about.moments.heading"),
          momentsImages: [
            cms.image("about.moments.image1"),
            cms.image("about.moments.image2"),
            cms.image("about.moments.image3"),
          ],
        }}
      />
    </InnerPage>
  );
}
