/**
 * Registry of every editable block of site content.
 *
 * - Public pages read values through `getCms()` (lib/cms/content.ts); when no
 *   override is stored the `default` here is used, so the site looks identical
 *   until an admin changes something.
 * - The admin "Page Content" editor is generated from this registry.
 *
 * Full storage key = `<page.slug>.<field.key>`.
 */
import {
  LEAGUE_INFORMATION_HTML,
  NFHS_STREAMING_HTML,
  TESTIMONIALS_BLURB,
  HOME_HASHTAGS,
  HOME_LEAGUE_SUBTITLE,
  HOME_LEAGUE_TITLE,
  HOME_QUOTE,
  HOME_SUPPORTING,
  HOME_TAGLINE,
} from "@/lib/league-copy";
import {
  allStandingsHubBlocks,
  allStarsBlocks,
  awardsChampionshipBlocks,
  flattenEditableBlocks,
  goldenTicketWinnerBlocks,
  playoffBlocks,
  teamDirectoryBlocks,
  type HubBlock,
} from "@/lib/hub-sections";
import { previewSchools } from "@/lib/preview/fixtures";
import {
  DIVISION_POSTER_GRADES_34,
  DIVISION_POSTER_GRADES_56,
  GOLDEN_TICKET_PICTURE,
  MAIN_ABOUT_PICTURE,
  MAIN_PROGRAM_PICTURE,
  driveAsset,
  schoolScheduleImages,
  schoolTeamImage,
} from "@/lib/drive-assets";

export type FieldKind = "text" | "textarea" | "html" | "url" | "image" | "images";

export type CmsField = {
  key: string;
  label: string;
  kind: FieldKind;
  default: string | string[];
  help?: string;
};

export type CmsSection = { id: string; label: string; fields: CmsField[] };

export type CmsPage = {
  slug: string;
  label: string;
  /** Public URL, used for the "view page" link and cache revalidation. */
  path?: string;
  group: "Main pages" | "League hubs" | "Programs & info" | "Site-wide";
  sections: CmsSection[];
};

const GEAR_STORE_URL = "https://shop.game-one.com/east/e4/po-select-travel-league-gear-store";

const ABOUT_HOME_HTML = `<p>The Philipsburg-Osceola Select Elementary Basketball League provides young athletes from Philipsburg-Osceola and surrounding communities with opportunities to learn, compete, and grow through basketball.</p>
<p>Our mission is to build a strong foundation in basketball fundamentals, physical fitness, and mental preparation while helping players develop the confidence, discipline, and teamwork needed to succeed at the junior high and high school levels and beyond.</p>
<p><strong>ONE TEAM. ONE GOAL. ONE PURPOSE.</strong></p>`;

const MOUNTIES_ABOUT_COPY = `<p>Mounties Youth Basketball is here to put in the hard work, on and off the court and in the classroom; learn; work on our game; encourage our teammates; and to have fun! We live by our motto of <strong>Attitude &amp; Effort</strong>.</p>
<p>At the end of the day, we're <strong>FAMILY</strong> as we believe in supporting one another wholeheartedly. We're excited to have you and explore all that we have to offer for youth basketball in Central PA.</p>
<p>Our league is an <strong>official state qualifier league</strong> for the Pennsylvania Middle School Basketball Championship. We are looking for teams to join our P-O Select League.</p>
<p>Questions? Email <a href="mailto:mountiesyouthbasketball@gmail.com">mountiesyouthbasketball@gmail.com</a></p>`;

const ELIGIBILITY_HTML = `<p>School-based teams only (no AAU travel teams). Incoming grades 3–6. Boys league; coed and girls teams welcome. Each team plays two games per league day. Season runs November through February, generally every other weekend. Eight teams per division. Champion and runner-up in both divisions earn State Championship invites to State College, PA.</p>`;

const SPONSORSHIP_HTML = `<section>
<h2 class="font-display text-xl uppercase text-gold">Team Sponsor — $500.00</h2>
<ul class="mt-4 list-disc space-y-2 pl-5 text-cool-grey">
<li>Company name and logo on team uniform</li>
<li>Recognition during varsity basketball games</li>
<li>Plaque of appreciation with team photo</li>
</ul>
</section>
<section class="mt-10">
<h2 class="font-display text-xl uppercase text-ice-white">Uniform Logo Display — Elementary Level — $150.00</h2>
<p class="mt-4 text-cool-grey">Your logo will be placed on the uniforms of 3rd–6th grade teams.</p>
</section>
<section class="mt-10">
<h2 class="font-display text-xl uppercase text-ice-white">Sponsor Donations</h2>
<p class="mt-4 text-cool-grey">Choose one. This fee helps the program with equipment, referees, league fees, and more.</p>
<p class="mt-4 font-display text-2xl font-bold text-electric-blue">$25 · $50 · $100</p>
</section>
<section class="mt-10 rounded-xl border border-white/10 bg-white/[0.03] p-6">
<h2 class="font-display text-lg uppercase text-ice-white">Sponsorship Form</h2>
<p class="mt-4 text-sm text-cool-grey">Complete the following information and mail your form with payment to:<br /><strong class="text-ice-white">Philipsburg-Osceola Mounties Youth Basketball</strong><br />7410 Sportsman Rd, Alexandria, PA 16611</p>
<p class="mt-4 text-sm text-cool-grey">Business · Contact · Phone · Email · Address · Total sponsorship fee / donation</p>
<p class="mt-4 text-sm text-cool-grey">For warmup uniform display sponsorships: email your company logo and colors (JPEG) to <a href="mailto:tjandersty@gmail.com" class="text-electric-blue">tjandersty@gmail.com</a>. Sponsor information and fee/donation due no later than September 29, 2027 for uniform production time.</p>
<p class="mt-4 text-xs text-cool-grey">P-O LLB Federal Tax ID: 90-1673993</p>
<p class="mt-6 text-sm">Questions: Coach TJ Anderson — <a href="tel:+18145008613" class="text-electric-blue">814-500-8613</a> · <a href="mailto:tjandersty@gmail.com" class="text-electric-blue">tjandersty@gmail.com</a></p>
</section>`;

const GEAR_HTML = `<h2 class="font-display text-xl uppercase text-ice-white">Select Team Gear Store (Game One)</h2>
<p class="mt-4 text-cool-grey">Official Philipsburg-Osceola Select Team Basketball apparel.</p>
<h3 class="mt-8 font-display text-lg uppercase text-electric-blue">Official Team Store</h3>
<p class="mt-3 text-cool-grey">Shop official Mounties Youth Basketball gear through our <a href="${GEAR_STORE_URL}" target="_blank" rel="noopener noreferrer" class="font-semibold text-electric-blue hover:underline">Game One team store ↗</a>. Jerseys, apparel, and accessories for players and families.</p>`;

const LIONS_ABOUT_HTML = `<h2 class="font-display text-xl uppercase text-ice-white">About the Academy</h2>
<p class="mt-4 text-cool-grey leading-relaxed">TJ Anderson's Central PA Lions Academy is a youth basketball program designed for student-athletes in grades K-12 to develop skills on and off of the court, and to take their game to the next level. The academy offers various opportunities for development through camps, shooting clinics, AAU and Travel teams, and programs designed specifically for student-athletes in grades K-2nd and 3rd-6th.</p>
<p class="mt-4 text-cool-grey leading-relaxed">The academy has served student-athletes since 2011 when the program first began as the Huntingdon Cats Youth Basketball. In 2014 the academy was renamed the JV Stingers Basketball Academy Program, and finally in 2020, the academy reorganized and became TJ Anderson's Central PA Lions Academy.</p>
<p class="mt-4 text-cool-grey leading-relaxed">Rich in coaching experiences, knowledge of the game, and community involvement, the academy is a premier program designed to improve the student-athletes' experience and skill set.</p>`;

const LIONS_MISSION_HTML = `<h2 class="font-display text-xl uppercase text-ice-white">Mission, Vision &amp; Team Culture</h2>
<p class="mt-4 text-cool-grey">For the season, we will put a team of confident and mentally tough student-athletes on the floor of every game, that finishes the season with a .500 winning pct. or higher, that defeats opponents through superior skill and teamwork in execution of our offense and defense.</p>
<h3 class="mt-8 font-display text-lg uppercase text-electric-blue">AAU Travel Team Program</h3>
<p class="mt-3 text-cool-grey">The Central PA Lions organization is a travel basketball program coached by USAB Gold Certified Coaching Staff. The travel teams within this program participate in high level tournaments and college showcases within Pennsylvania and surrounding states. Student-athletes and families should expect to practice bi-weekly, have weekend workouts (optional), and participate in 5-7 high level tournaments.</p>
<h3 class="mt-8 font-display text-lg uppercase text-electric-blue">Tryouts</h3>
<ul class="mt-3 list-disc space-y-2 pl-5 text-cool-grey">
<li><strong>Fall — Saturday, October 17, 2026</strong>
<ul class="mt-1 list-disc pl-5"><li>8:00 AM – 9:00 AM, Grades 3-6 (Boys)</li><li>9:00 AM – 10:30 AM, Grades 7-12 (Boys)</li><li>11:00 AM – 12:00 PM, Grades 7-12 (Girls)</li><li>12:00 PM – 1:00 PM, Grades 3-6 (Girls)</li></ul></li>
<li><strong>Spring — Sunday, February 14, 2027</strong>
<ul class="mt-1 list-disc pl-5"><li>8:00 AM – 9:00 AM, Grades 3-6 (Boys)</li><li>9:00 AM – 10:30 AM, Grades 7-12 (Boys)</li><li>11:00 AM – 12:00 PM, Grades 7-12 (Girls)</li><li>12:00 PM – 1:00 PM, Grades 3-6 (Girls)</li></ul></li>
</ul>
<p class="mt-4 text-sm text-cool-grey">Philipsburg-Osceola Middle School, 200 Short Street, Philipsburg, PA 16866. Location, dates, and times are subject to change. Check the website and Facebook for updates.</p>`;

const LIONS_PAYMENT_HTML = `<h2 class="font-display text-xl uppercase text-ice-white">Payment</h2>
<p class="mt-4 text-cool-grey">Make check or money order payable to: <strong>Central PA Lions Basketball</strong> or submit payment at <a href="https://centralpalions.square.site" target="_blank" rel="noopener noreferrer" class="text-electric-blue hover:underline">centralpalions.square.site ↗</a></p>`;

const LEGAL_DRAFT_HTML = `<p>Content is managed in the admin portal. Replace this text with the final copy.</p>`;

function titleSub(titleDefault: string, subDefault: string, sub = true): CmsField[] {
  const fields: CmsField[] = [
    { key: "title", label: "Page title", kind: "text", default: titleDefault },
  ];
  if (sub) fields.push({ key: "subtitle", label: "Page subtitle", kind: "text", default: subDefault });
  return fields;
}

function headerSection(titleDefault: string, subDefault: string): CmsSection {
  return { id: "header", label: "Page header", fields: titleSub(titleDefault, subDefault) };
}

function blockSections(blocks: HubBlock[], label: string): CmsSection {
  return {
    id: "blocks",
    label,
    fields: flattenEditableBlocks(blocks).map((b) => ({
      key: `blocks.${b.id}`,
      label: b.title,
      kind: "html" as const,
      default: b.body ?? "",
      help: `Shown under "${b.title}". Leave unchanged to keep the default text.`,
    })),
  };
}

const homeImagesDefault = (k: string) => driveAsset(k) ?? "";

export const CMS_PAGES: CmsPage[] = [
  {
    slug: "home",
    label: "Home page",
    path: "/",
    group: "Main pages",
    sections: [
      {
        id: "hero",
        label: "Hero (top banner)",
        fields: [
          { key: "hero.eyebrow", label: "Small heading above headline", kind: "text", default: "Philipsburg-Osceola" },
          { key: "hero.line1", label: "Headline line 1", kind: "text", default: "Small Hands." },
          { key: "hero.line2", label: "Headline line 2 (blue)", kind: "text", default: "Big Dreams." },
          { key: "hero.line3", label: "Headline line 3", kind: "text", default: "Together We Raise." },
          { key: "hero.cta1", label: "Primary button text", kind: "text", default: "Register Your Team" },
          { key: "hero.cta2", label: "Secondary button text", kind: "text", default: "Explore the League" },
          { key: "hero.badgeYear", label: "Season badge", kind: "text", default: "2026-27" },
          { key: "hero.badgeLabel", label: "Season badge label", kind: "text", default: "Winter League" },
          { key: "hero.badgeGold", label: "Gold badge text", kind: "text", default: "State Championship Invites" },
          { key: "hero.stat1", label: "Stat bar — first item", kind: "text", default: "Grades 3-6" },
          { key: "hero.bg", label: "Background photo", kind: "image", default: "/brand/hero-arena.jpg" },
        ],
      },
      {
        id: "program",
        label: "Official league program block",
        fields: [
          { key: "program.kicker", label: "Small label", kind: "text", default: "Official league program" },
          { key: "program.eyebrow", label: "Eyebrow", kind: "text", default: "Philipsburg-Osceola" },
          { key: "program.title", label: "Title", kind: "text", default: HOME_LEAGUE_TITLE },
          { key: "program.subtitle", label: "Subtitle", kind: "text", default: HOME_LEAGUE_SUBTITLE },
          { key: "program.tagline", label: "Gold tagline", kind: "text", default: HOME_TAGLINE },
          { key: "program.quote", label: "Quote", kind: "textarea", default: HOME_QUOTE },
          { key: "program.supporting", label: "Supporting text", kind: "textarea", default: HOME_SUPPORTING },
          { key: "program.hashtags", label: "Hashtags", kind: "text", default: HOME_HASHTAGS },
          { key: "program.image", label: "Program poster", kind: "image", default: MAIN_PROGRAM_PICTURE },
        ],
      },
      {
        id: "about",
        label: "About Us block",
        fields: [
          { key: "about.heading", label: "Heading", kind: "text", default: "About Us" },
          {
            key: "about.html",
            label: "About text",
            kind: "html",
            default: ABOUT_HOME_HTML,
            help: "If left unchanged, the text from League & Brand settings (if any) is used.",
          },
          { key: "about.link", label: "Link text", kind: "text", default: "Read more →" },
          { key: "about.image", label: "Poster image", kind: "image", default: MAIN_ABOUT_PICTURE },
        ],
      },
      {
        id: "info",
        label: "League information block",
        fields: [
          { key: "info.heading", label: "Heading", kind: "text", default: "League Information" },
          { key: "info.html", label: "Details", kind: "html", default: LEAGUE_INFORMATION_HTML },
          { key: "info.poster", label: "Program poster", kind: "image", default: MAIN_PROGRAM_PICTURE },
          { key: "info.link", label: "Link text", kind: "text", default: "Full league information →" },
        ],
      },
      {
        id: "divisions",
        label: "Divisions",
        fields: [
          { key: "divisions.heading", label: "Heading", kind: "text", default: "Divisions" },
          { key: "divisions.poster34", label: "Grades 3-4 poster", kind: "image", default: DIVISION_POSTER_GRADES_34 },
          { key: "divisions.poster56", label: "Grades 5-6 poster", kind: "image", default: DIVISION_POSTER_GRADES_56 },
        ],
      },
      {
        id: "directory",
        label: "Team directory & schedules strip",
        fields: [
          { key: "directory.heading", label: "Team directory heading", kind: "text", default: "Team Directory" },
          { key: "directory.intro", label: "Team directory intro", kind: "text", default: "LHAC & ICC programs — tap a school for coaches, forms, and schedules." },
          { key: "results.heading", label: "Schedules & results heading", kind: "text", default: "Schedules & Results" },
        ],
      },
      {
        id: "golden",
        label: "Golden Ticket block",
        fields: [
          { key: "golden.heading", label: "Heading", kind: "text", default: "Golden Ticket — State Championship Invite" },
          { key: "golden.text", label: "Text", kind: "textarea", default: "Champion & runner-up in both divisions earn invites to State College, PA." },
          { key: "golden.button", label: "Button text", kind: "text", default: "Golden Ticket details" },
          { key: "golden.image", label: "Image", kind: "image", default: GOLDEN_TICKET_PICTURE },
        ],
      },
      {
        id: "lower",
        label: "News, registration, forms & closing banner",
        fields: [
          { key: "news.heading", label: "News heading", kind: "text", default: "News" },
          { key: "news.kicker", label: "News small label", kind: "text", default: "Latest updates" },
          { key: "registration.heading", label: "Registration heading", kind: "text", default: "Registration" },
          { key: "registration.firstLabel", label: "First-team price label", kind: "text", default: "First team" },
          { key: "registration.addLabel", label: "Additional-team price label", kind: "text", default: "Each additional team" },
          { key: "registration.button", label: "Registration button text", kind: "text", default: "Start registration" },
          { key: "forms.heading", label: "Required forms heading", kind: "text", default: "Required Forms" },
          { key: "cta.heading", label: "Closing banner heading", kind: "text", default: "Join the Mountie Family" },
          { key: "cta.join", label: "Closing banner button 1", kind: "text", default: "Join Us" },
          { key: "cta.support", label: "Closing banner button 2", kind: "text", default: "Support" },
        ],
      },
    ],
  },
  {
    slug: "about",
    label: "About page",
    path: "/about",
    group: "Main pages",
    sections: [
      {
        id: "header",
        label: "Page header",
        fields: [
          { key: "title", label: "Page title", kind: "text", default: "About Us" },
          { key: "subtitle", label: "Page subtitle", kind: "text", default: "", help: "Leave blank to use the tagline from League & Brand." },
        ],
      },
      {
        id: "intro",
        label: "Intro",
        fields: [
          { key: "image", label: "Top poster", kind: "image", default: MAIN_ABOUT_PICTURE },
          { key: "kicker", label: "Small label", kind: "text", default: "Mounties Youth Basketball" },
          { key: "heading", label: "Heading", kind: "text", default: "Attitude & Effort" },
          { key: "intro", label: "Intro paragraph", kind: "textarea", default: "Hard work on and off the court. Encouraging teammates. Having fun while we grow the game in Central PA — and building a path to the state championship stage." },
          { key: "badge1", label: "Badge 1", kind: "text", default: "State qualifier" },
          { key: "badge2", label: "Badge 2", kind: "text", default: "School teams" },
          { key: "badge3", label: "Badge 3", kind: "text", default: "Mountie family" },
        ],
      },
      {
        id: "story",
        label: "Our story & philosophy",
        fields: [
          { key: "story.label", label: "Story label", kind: "text", default: "Our story" },
          {
            key: "story.html",
            label: "Our story text",
            kind: "html",
            default: MOUNTIES_ABOUT_COPY,
            help: "If left unchanged, the About text from League & Brand settings (if any) is used.",
          },
          { key: "philosophy.heading", label: "Philosophy heading", kind: "text", default: "Mounties philosophy" },
          { key: "philosophy.intro", label: "Philosophy intro", kind: "text", default: "What we expect from every player, coach, and family in the league." },
          { key: "philosophy.html", label: "Philosophy text (optional)", kind: "html", default: "", help: "When filled in, replaces the three pillar cards below." },
          { key: "pillar1.title", label: "Pillar 1 title", kind: "text", default: "Attitude" },
          { key: "pillar1.text", label: "Pillar 1 text", kind: "text", default: "Show up ready to learn — on the court and in the classroom." },
          { key: "pillar2.title", label: "Pillar 2 title", kind: "text", default: "Effort" },
          { key: "pillar2.text", label: "Pillar 2 text", kind: "text", default: "Hustle plays, reps, and respect for coaches and teammates." },
          { key: "pillar3.title", label: "Pillar 3 title", kind: "text", default: "Family" },
          { key: "pillar3.text", label: "Pillar 3 text", kind: "text", default: "We support one another — that's the Mountie way." },
        ],
      },
      {
        id: "moments",
        label: "League moments (photos)",
        fields: [
          { key: "moments.label", label: "Small label", kind: "text", default: "On the court" },
          { key: "moments.heading", label: "Heading", kind: "text", default: "League moments" },
          { key: "moments.image1", label: "Large photo", kind: "image", default: MAIN_ABOUT_PICTURE },
          { key: "moments.image2", label: "Photo 2", kind: "image", default: MAIN_PROGRAM_PICTURE },
          { key: "moments.image3", label: "Photo 3", kind: "image", default: homeImagesDefault("main.heading-gallery") },
        ],
      },
    ],
  },
  {
    slug: "league-information",
    label: "League Information page",
    path: "/league-information",
    group: "Main pages",
    sections: [
      headerSection("League Information", "Registration, divisions, and season structure"),
      {
        id: "body",
        label: "Content",
        fields: [
          { key: "html", label: "League details", kind: "html", default: LEAGUE_INFORMATION_HTML },
          { key: "image", label: "Side image", kind: "image", default: GOLDEN_TICKET_PICTURE },
          { key: "eligibility.heading", label: "Eligibility heading", kind: "text", default: "Eligibility" },
          { key: "eligibility.html", label: "Eligibility text", kind: "html", default: ELIGIBILITY_HTML, help: "If left unchanged, the Eligibility text from League & Brand settings (if any) is used." },
          { key: "venue.heading", label: "Venue heading", kind: "text", default: "Venue" },
        ],
      },
    ],
  },
  {
    slug: "contact",
    label: "Contact page",
    path: "/contact",
    group: "Main pages",
    sections: [
      headerSection("Contact", "Get in touch — we're here to help with any questions about our programs."),
      {
        id: "body",
        label: "Content",
        fields: [
          { key: "left.heading", label: "Left heading", kind: "text", default: "Get in touch" },
          { key: "left.intro", label: "Left intro paragraph", kind: "textarea", default: "Reach league leadership for registration, schedules, volunteering, or general questions. We typically respond within a few business days." },
          { key: "right.heading", label: "Right heading", kind: "text", default: "Send a message" },
          { key: "right.html", label: "Form intro", kind: "html", default: `Use the form below and we will route your note to league staff. For registration, you can also use the <a href="/booking" class="text-electric-blue hover:underline">team registration</a> page.` },
        ],
      },
    ],
  },
  {
    slug: "schedules",
    label: "Schedules page (league posters)",
    path: "/schedules",
    group: "Main pages",
    sections: [
      headerSection("Schedules", "2026-27 season — league & school schedules"),
      {
        id: "league",
        label: "League schedule posters",
        fields: [
          { key: "league.heading", label: "Section heading", kind: "text", default: "League schedules" },
          { key: "league.intro", label: "Section intro", kind: "textarea", default: "3/4 and 5/6 grade game schedules (all schools). Open a school below for coaches and program links." },
          { key: "poster34", label: "3/4 grade schedule poster", kind: "image", default: homeImagesDefault("information.4th-grade-team-schedules"), help: "Shown on the Schedules page and the Information Hub." },
          { key: "poster34.label", label: "3/4 poster label", kind: "text", default: "3/4 grade teams" },
          { key: "poster56", label: "5/6 grade schedule poster", kind: "image", default: homeImagesDefault("information.6th-grade-team-schedules"), help: "Shown on the Schedules page and the Information Hub." },
          { key: "poster56.label", label: "5/6 poster label", kind: "text", default: "5/6 grade teams" },
        ],
      },
      {
        id: "schools",
        label: "By-school section",
        fields: [
          { key: "schools.heading", label: "Section heading", kind: "text", default: "By school" },
          { key: "schools.intro", label: "Section intro", kind: "text", default: "Tap a school name for the full team page — forms, coaches, and more." },
        ],
      },
    ],
  },
  {
    slug: "information",
    label: "Information Hub page",
    path: "/information",
    group: "Main pages",
    sections: [
      headerSection("Information Hub", "Forms, documents, and league resources"),
      {
        id: "body",
        label: "Content",
        fields: [
          { key: "basic.heading", label: "Basic information heading", kind: "text", default: "Basic information" },
          { key: "basic.intro", label: "Basic information text", kind: "textarea", default: "Yearly forms must be completed before the first game. Use the links below or your school team page." },
          { key: "schedule.label", label: "Schedule reference label", kind: "text", default: "League schedule reference" },
        ],
      },
    ],
  },
  {
    slug: "booking",
    label: "Team Registration page",
    path: "/booking",
    group: "Main pages",
    sections: [headerSection("Team Registration", "Submit a school/team registration request for the active season.")],
  },
  {
    slug: "pricing",
    label: "Registration Pricing page",
    path: "/pricing",
    group: "Main pages",
    sections: [
      headerSection("Registration Pricing", "Per school / organization per season"),
      {
        id: "body",
        label: "Content",
        fields: [{ key: "link", label: "Link text", kind: "text", default: "Submit a registration request →" }],
      },
    ],
  },
  {
    slug: "join-us",
    label: "Join Us page",
    path: "/join-us",
    group: "Programs & info",
    sections: [
      headerSection("Join Us", "JOIN THE MOUNTIE FAMILY"),
      {
        id: "body",
        label: "Content",
        fields: [
          {
            key: "html",
            label: "Page text",
            kind: "html",
            default: `<p><strong>ONE TEAM. ONE GOAL. ONE PURPOSE.</strong></p>
<p class="mt-4">Choose a program below to learn more and register when registration is open.</p>
<ul class="mt-6 space-y-2"><li><a href="/booking">Get started / registration</a></li><li><a href="/teams">Team directory</a></li><li><a href="/contact">Contact us</a></li></ul>`,
          },
        ],
      },
    ],
  },
  {
    slug: "support",
    label: "Support Our Program page",
    path: "/support",
    group: "Programs & info",
    sections: [
      headerSection("Support Our Program", "Equipment, facilities, scholarships, and community events"),
      {
        id: "body",
        label: "Content",
        fields: [
          {
            key: "html",
            label: "Page text",
            kind: "html",
            default: `<p>Your support helps fund equipment, facilities, scholarships, and community events. Contact TJ Anderson: <a href="mailto:tjandersty@gmail.com" class="text-electric-blue">tjandersty@gmail.com</a> · 814-500-8613</p>
<p class="mt-6"><a href="/sponsorship">Become a sponsor →</a></p>`,
          },
        ],
      },
    ],
  },
  {
    slug: "sponsorship",
    label: "Team Sponsor page",
    path: "/sponsorship",
    group: "Programs & info",
    sections: [
      headerSection("Team Sponsor", "P-O Select League — 2026-27 season"),
      { id: "body", label: "Content", fields: [{ key: "html", label: "Sponsorship details", kind: "html", default: SPONSORSHIP_HTML }] },
    ],
  },
  {
    slug: "gear-store",
    label: "Gear Store page",
    path: "/gear-store",
    group: "Programs & info",
    sections: [
      headerSection("Gear Store", "Select team gear — Game One"),
      {
        id: "body",
        label: "Content",
        fields: [
          { key: "url", label: "Store link", kind: "url", default: GEAR_STORE_URL },
          { key: "link.text", label: "Text link label", kind: "text", default: "P-O Select League gear store ↗" },
          { key: "button", label: "Button label", kind: "text", default: "Shop Game One store ↗" },
          { key: "html", label: "Details", kind: "html", default: GEAR_HTML },
        ],
      },
    ],
  },
  {
    slug: "picture-day",
    label: "Picture Day page",
    path: "/picture-day",
    group: "Programs & info",
    sections: [
      headerSection("Picture Day", "Before your first game"),
      {
        id: "body",
        label: "Content",
        fields: [
          {
            key: "html",
            label: "Page text",
            kind: "html",
            default: `<p>Picture day is at the start of the season. Please arrive 30 minutes early before your first game. Manning Photography — <a href="https://manningphoto.net" target="_blank" rel="noopener noreferrer">manningphoto.net</a></p>`,
          },
        ],
      },
    ],
  },
  {
    slug: "central-pa-lions",
    label: "Central PA Lions (AAU) page",
    path: "/central-pa-lions",
    group: "Programs & info",
    sections: [
      headerSection("AAU Travel — Central PA Lions", "Separate academy program (not elementary league eligible)"),
      {
        id: "buttons",
        label: "Top section",
        fields: [
          { key: "heading", label: "Heading", kind: "text", default: "AAU Travel Team Program" },
          { key: "site.url", label: "Website link", kind: "url", default: "https://www.tjcentralpalions.com" },
          { key: "site.label", label: "Website button text", kind: "text", default: "Visit Central PA Lions ↗" },
          { key: "store.url", label: "Store link", kind: "url", default: "https://centralpalions.square.site" },
          { key: "store.label", label: "Store button text", kind: "text", default: "Payment / Store ↗" },
          { key: "photos", label: "Photos", kind: "images", default: [driveAsset("central-pa-lions.1"), driveAsset("central-pa-lions.2"), driveAsset("central-pa-lions.3")].filter(Boolean) as string[] },
        ],
      },
      {
        id: "text",
        label: "Text sections",
        fields: [
          { key: "about.html", label: "About the Academy", kind: "html", default: LIONS_ABOUT_HTML },
          { key: "mission.html", label: "Mission, vision & tryouts", kind: "html", default: LIONS_MISSION_HTML },
          { key: "payment.html", label: "Payment", kind: "html", default: LIONS_PAYMENT_HTML },
          { key: "backlink", label: "Bottom link text", kind: "text", default: "P-O Select League (elementary) →" },
        ],
      },
    ],
  },
  {
    slug: "streaming",
    label: "Streaming page",
    path: "/streaming",
    group: "Programs & info",
    sections: [
      headerSection("Streaming", "NFHS Network"),
      {
        id: "body",
        label: "Content",
        fields: [
          { key: "html", label: "Text", kind: "html", default: NFHS_STREAMING_HTML },
          { key: "button", label: "Button text", kind: "text", default: "Watch on NFHS Network ↗", help: "The link itself is set in League & Brand → NFHS stream URL." },
        ],
      },
    ],
  },
  {
    slug: "testimonials",
    label: "Testimonials page",
    path: "/testimonials",
    group: "Programs & info",
    sections: [
      headerSection("Select Families Speak", "Stories from our Select League family"),
      { id: "body", label: "Content", fields: [{ key: "html", label: "Text", kind: "html", default: TESTIMONIALS_BLURB }] },
    ],
  },
  {
    slug: "services",
    label: "League Programs page",
    path: "/services",
    group: "Programs & info",
    sections: [
      headerSection("League Programs", "Development for young athletes"),
      {
        id: "body",
        label: "Content",
        fields: [
          {
            key: "html",
            label: "Page text",
            kind: "html",
            default: `<p>P-O Select Elementary League for school-based teams (grades 3–6).</p>
<p class="mt-4"><a href="/central-pa-lions">Central PA Lions AAU / travel program →</a></p>`,
          },
        ],
      },
    ],
  },
  {
    slug: "gallery",
    label: "Gallery page",
    path: "/gallery",
    group: "Programs & info",
    sections: [
      headerSection("Gallery", "2026-27 season pictures"),
      {
        id: "body",
        label: "Content",
        fields: [
          { key: "html", label: "Intro text", kind: "html", default: "<p>2026-27 season pictures coming soon.</p>" },
          { key: "photos", label: "Gallery photos", kind: "images", default: [], help: "Upload season photos. They appear in a grid on the Gallery page." },
        ],
      },
    ],
  },
  {
    slug: "record-book",
    label: "Record Book page",
    path: "/record-book",
    group: "Programs & info",
    sections: [
      headerSection("Record Book", "Team, individual, and coaching records"),
      {
        id: "body",
        label: "Content",
        fields: [
          {
            key: "html",
            label: "Records",
            kind: "html",
            default: ["2026-27", "2027-28", "2028-29", "2029-30"]
              .map((s) => `<p class="mt-2">${s} — more information coming soon.</p>`)
              .join("\n"),
          },
        ],
      },
    ],
  },
  {
    slug: "through-the-years",
    label: "Through the Years page",
    path: "/through-the-years",
    group: "Programs & info",
    sections: [
      headerSection("Through the Years", "Select League teams and players from the past"),
      {
        id: "body",
        label: "Content",
        fields: [{ key: "intro", label: "Intro text", kind: "text", default: "Please take a look at Select League teams and players from past seasons." }],
      },
    ],
  },
  {
    slug: "state-championship",
    label: "Golden Ticket page",
    path: "/state-championship",
    group: "League hubs",
    sections: [
      headerSection("Golden Ticket", "State Championship invite league"),
      {
        id: "body",
        label: "Content",
        fields: [
          { key: "text", label: "Intro text", kind: "textarea", default: "Champion and runner-up in both the 3/4 and 5/6 divisions earn invites to the Pennsylvania Middle School Basketball Championship in State College, PA." },
          { key: "link", label: "Link text", kind: "text", default: "Forms & important documents →" },
          { key: "image", label: "Golden Ticket image", kind: "image", default: GOLDEN_TICKET_PICTURE },
          { key: "winners.heading", label: "Winners heading", kind: "text", default: "Golden Ticket winners" },
        ],
      },
      blockSections(goldenTicketWinnerBlocks(), "Golden Ticket winners by season"),
    ],
  },
  {
    slug: "standings",
    label: "Standings & Scores (results by season)",
    path: "/standings",
    group: "League hubs",
    sections: [
      headerSection("League Standings", "2026-27 through 2028-29 seasons"),
      blockSections(allStandingsHubBlocks(), "Standings, weekly scores & brackets — type results here (shown on both Standings and Scores pages)"),
    ],
  },
  {
    slug: "scores",
    label: "Scores page header",
    path: "/scores",
    group: "League hubs",
    sections: [
      headerSection("Scores", "Weekly scores by grade and season"),
      {
        id: "body",
        label: "Intro",
        fields: [{ key: "intro", label: "Intro text", kind: "html", default: `Week-by-week scores are listed under each season on the <a href="/standings" class="text-electric-blue hover:underline">standings page</a>. Jump to a week below:`, help: "Weekly scores themselves are edited under Standings & Scores." }],
      },
    ],
  },
  {
    slug: "playoffs",
    label: "Playoffs page",
    path: "/playoffs",
    group: "League hubs",
    sections: [headerSection("Playoffs", "Championship brackets"), blockSections(playoffBlocks(), "Playoff brackets by season")],
  },
  {
    slug: "awards",
    label: "Awards & Championships page",
    path: "/awards",
    group: "League hubs",
    sections: [headerSection("Awards & Championships", "League champions and player awards"), blockSections(awardsChampionshipBlocks(), "Champions & awards by season")],
  },
  {
    slug: "all-stars",
    label: "All Stars page",
    path: "/all-stars",
    group: "League hubs",
    sections: [headerSection("League All Stars & Games", "All-Star teams by season"), blockSections(allStarsBlocks(), "All-Star notes by season")],
  },
  {
    slug: "team-directory",
    label: "Team Directory (season archive) page",
    path: "/team-directory",
    group: "League hubs",
    sections: [headerSection("Team Directory", "Meet the teams by season and division"), blockSections(teamDirectoryBlocks(), "Notes by season & team")],
  },
  {
    slug: "teams",
    label: "Teams page (LHAC / ICC)",
    path: "/teams",
    group: "League hubs",
    sections: [
      headerSection("Team Directory", "2026-27 season — LHAC & ICC programs"),
      {
        id: "body",
        label: "Content",
        fields: [
          { key: "lhac.heading", label: "LHAC heading", kind: "text", default: "LHAC Teams" },
          { key: "icc.heading", label: "ICC heading", kind: "text", default: "ICC Teams" },
        ],
      },
    ],
  },
  {
    slug: "faq-page",
    label: "FAQ page header",
    path: "/faq",
    group: "League hubs",
    sections: [headerSection("FAQ", "Frequently asked questions")],
  },
  {
    slug: "our-team",
    label: "League Leadership page header",
    path: "/our-team",
    group: "League hubs",
    sections: [headerSection("League Leadership", "Commissioners and board")],
  },
  {
    slug: "blogs",
    label: "News page header",
    path: "/blogs",
    group: "League hubs",
    sections: [headerSection("News", "Latest updates from the P-O Select League")],
  },
  {
    slug: "privacy",
    label: "Privacy Policy page",
    path: "/privacy",
    group: "Programs & info",
    sections: [
      headerSection("Privacy Policy", ""),
      { id: "body", label: "Content", fields: [{ key: "html", label: "Policy text", kind: "html", default: LEGAL_DRAFT_HTML }] },
    ],
  },
  {
    slug: "accessibility",
    label: "Accessibility page",
    path: "/accessibility",
    group: "Programs & info",
    sections: [
      headerSection("Accessibility", ""),
      { id: "body", label: "Content", fields: [{ key: "html", label: "Statement", kind: "html", default: LEGAL_DRAFT_HTML }] },
    ],
  },
  {
    slug: "global",
    label: "Header & footer (every page)",
    group: "Site-wide",
    sections: [
      {
        id: "header",
        label: "Header",
        fields: [
          { key: "header.topbar", label: "Top strip text", kind: "text", default: "2026-27 Season • School-Based Teams • Grades 3-6" },
          { key: "header.registerLabel", label: "Register button text", kind: "text", default: "Register Team" },
        ],
      },
      {
        id: "footer",
        label: "Footer",
        fields: [
          { key: "footer.name", label: "Name", kind: "text", default: "P-O Select League" },
          { key: "footer.sub", label: "Sub-title", kind: "text", default: "Elementary Basketball" },
          { key: "footer.blurb", label: "Description", kind: "text", default: "School-based teams · Grades 3–6 · Central Pennsylvania" },
          { key: "footer.copyright", label: "Copyright name", kind: "text", default: "Philipsburg-Osceola Select Elementary Basketball League" },
        ],
      },
    ],
  },
];

/* ---------- lookups ---------- */

const STATIC_INDEX = new Map<string, CmsField>();
for (const page of CMS_PAGES) {
  for (const section of page.sections) {
    for (const f of section.fields) {
      STATIC_INDEX.set(`${page.slug}.${f.key}`, f);
    }
  }
}

export function getCmsPage(slug: string): CmsPage | undefined {
  return CMS_PAGES.find((p) => p.slug === slug);
}

/** Slugs of every school (used for per-school photo / schedule fields). */
export const SCHOOL_SLUGS: string[] = previewSchools.map((s) => s.slug);

const SCHOOL_KEY = /^school\.([a-z0-9-]{1,60})\.(team|schedules)$/;

export function schoolFieldKey(slug: string, field: "team" | "schedules") {
  return `school.${slug}.${field}`;
}

/** Resolve a storage key to its field definition (static registry or per-school media). */
export function resolveField(fullKey: string): CmsField | undefined {
  const fixed = STATIC_INDEX.get(fullKey);
  if (fixed) return fixed;
  const m = SCHOOL_KEY.exec(fullKey);
  if (m && SCHOOL_SLUGS.includes(m[1])) {
    const [, slug, field] = m;
    return field === "team"
      ? { key: fullKey, label: "Team photo", kind: "image", default: schoolTeamImage(slug) ?? "" }
      : { key: fullKey, label: "Schedule posters", kind: "images", default: schoolScheduleImages(slug) };
  }
  return undefined;
}

export function allStaticKeys(): string[] {
  return [...STATIC_INDEX.keys()];
}
