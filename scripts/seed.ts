import "dotenv/config";
import mongoose from "mongoose";
import { connectMongoose } from "../src/lib/db/mongoose";
import { SiteSettings } from "../src/models/SiteSettings";
import { Season, Division } from "../src/models/Season";
import { SchoolProgram, SeasonTeam } from "../src/models/SchoolProgram";
import { LeagueEvent } from "../src/models/LeagueEvent";
import { Resource } from "../src/models/Resource";
import { FAQ, StaffMember, Page, BlogPost } from "../src/models/Content";
import { LEAGUE_NEWS_ARTICLES } from "../src/lib/news-articles";
import { SponsorTier } from "../src/models/Sponsor";
import { CentralPaLions } from "../src/models/System";

const ABOUT_HTML = `<p>The P-O Select Elementary Basketball League provides young athletes from Philipsburg-Osceola and surrounding communities with opportunities to learn, compete, and grow through basketball.</p>
<p>Our mission is to build a strong foundation in basketball fundamentals, physical fitness, and mental preparation while helping players develop the confidence, discipline, and teamwork needed to succeed at the junior high and high school levels and beyond.</p>
<p>Through positive coaching, supervision, and leadership by example, we teach sportsmanship, fair play, respect, and responsibility. We value effort, improvement, and character alongside competition, recognizing that success extends far beyond wins and losses.</p>
<p>Education remains a priority. Our program encourages student-athletes to take pride in their classroom performance and understand that academic responsibility goes hand in hand with athletic participation.</p>
<p>Together with our coaches, families, and participating school communities, we are building better players, stronger teammates, and future leaders.</p>
<p><strong>ONE TEAM. ONE GOAL. ONE PURPOSE.</strong></p>`;

const MOUNTIES_PHILOSOPHY = `<p><strong>Attitude &amp; Effort</strong> — classroom responsibility, hard work, encouraging teammates, having fun, and supporting one another.</p>`;

const ELIGIBILITY = `<p>School-based teams only (no AAU travel teams). Incoming grades 3–6. Boys league; coed and girls teams welcome. Each team plays two games per league day. Season runs November through February, generally every other weekend. Eight teams per division. Champion and runner-up in both divisions earn State Championship invites to State College, PA.</p>`;

const RESOURCES = [
  {
    stableKey: "player-waiver",
    title: "Player Waiver",
    slug: "player-waiver",
    externalUrl: "https://forms.gle/M1BWtZKdfmUXZD7L8",
  },
  {
    stableKey: "player-code-of-conduct",
    title: "Player's Code of Conduct",
    slug: "players-code-of-conduct",
    externalUrl: "https://forms.gle/hJcATXJQ19rGXdaf6",
  },
  {
    stableKey: "parent-code-of-conduct",
    title: "Parent/Guardian Code of Conduct",
    slug: "parent-guardian-code-of-conduct",
    externalUrl: "https://forms.gle/RDDBYNJdFud1BGZr7",
  },
  {
    stableKey: "league-roster-2026",
    title: "2026 League Roster",
    slug: "2026-league-roster",
    externalUrl: "https://forms.gle/pkCJd3T7DWAayL5s7",
  },
  {
    stableKey: "photo-release",
    title: "Public Relations Internet and Photo Release",
    slug: "photo-release",
    externalUrl: "https://forms.gle/gMqPbEUDQCboHHqaA",
  },
  {
    stableKey: "injury-report",
    title: "Injury Report",
    slug: "injury-report",
    externalUrl: "https://forms.gle/kukWycq3AerWwPoPA",
  },
  {
    stableKey: "all-star-selection",
    title: "All-Star Selection",
    slug: "all-star-selection",
    externalUrl: "https://forms.gle/BUsQbrQYF3ze5FTc9",
  },
  {
    stableKey: "player-of-game-voting",
    title: "Player of the Game Weekly Voting",
    slug: "player-of-the-game-voting",
    externalUrl: "https://forms.gle/1UzbvqyshDGJh2RF6",
  },
  {
    stableKey: "play-of-game-voting",
    title: "Play of the Game Voting",
    slug: "play-of-the-game-voting",
    externalUrl: "https://forms.gle/1UzbvqyshDGJh2RF6",
    adminFlags: {
      duplicateUrlNote: "Same URL as Player of the Game — review in admin.",
    },
  },
  {
    stableKey: "contacts-next-season",
    title: "Contacts for Next Season",
    slug: "contacts-for-next-season",
    externalUrl: "https://forms.gle/P3yD2o8ZYKBGKpwQ9",
  },
  {
    stableKey: "family-story",
    title: "Share Your Family Story / Testimonial",
    slug: "share-family-story",
    externalUrl: "https://forms.gle/NNGAzzoQvKdcYfMj7",
  },
  {
    stableKey: "officials-feedback",
    title: "Game Officials Feedback",
    slug: "game-officials-feedback",
    externalUrl: "https://forms.gle/MnkwjVy5rp8dRJVA7",
  },
  {
    stableKey: "how-can-we-be-better",
    title: "How Can We Be Better?",
    slug: "how-can-we-be-better",
    externalUrl: "https://forms.gle/ssNTUSPzgph9yiaq7",
  },
  {
    stableKey: "formal-complaint",
    title: "Formal Complaint Process",
    slug: "formal-complaint-process",
    externalUrl: "https://forms.gle/Sv8GtH6NWCHBF2427",
  },
  {
    stableKey: "by-laws",
    title: "By-Laws",
    slug: "by-laws",
    category: "documents",
    adminFlags: { needsDocument: true },
  },
  {
    stableKey: "zero-tolerance-photo",
    title: "Zero Tolerance Photography & Recording Policy",
    slug: "zero-tolerance-photography",
    category: "documents",
    adminFlags: { needsDocument: true },
  },
];

const SCHOOLS = [
  {
    stableKey: "philipsburg-osceola",
    slug: "philipsburg-osceola",
    name: "Philipsburg-Osceola",
    programLink: "https://www.mountieyouthbasketball.com",
    coaches: [
      { divisionKey: "grades-5-6", coaches: ["TJ Anderson"] },
      { divisionKey: "grades-3-4", coaches: ["Shane Kelly"] },
    ],
  },
  {
    stableKey: "tyrone",
    slug: "tyrone",
    name: "Tyrone",
    programLink:
      "https://www.facebook.com/share/g/1C4iRTkz7P/?mibextid=wwXIfr",
    coaches: [{ divisionKey: "grades-5-6", coaches: ["Rachel"] }],
  },
  {
    stableKey: "clearfield",
    slug: "clearfield",
    name: "Clearfield",
    programLink:
      "https://www.facebook.com/share/19Q6PDtnjG/?mibextid=wwXIfr",
    coaches: [{ divisionKey: "grades-5-6", coaches: ["Nate Glunt"] }],
  },
  {
    stableKey: "bellwood-antis",
    slug: "bellwood-antis",
    name: "Bellwood-Antis",
    tabAlias: "Bellwood",
    programLink:
      "https://www.facebook.com/share/1DtJd6bvFj/?mibextid=wwXIfr",
    coaches: [{ divisionKey: "grades-5-6", coaches: ["Kyley Longo"] }],
  },
  {
    stableKey: "moshannon-valley",
    slug: "moshannon-valley",
    name: "Moshannon Valley",
    tabAlias: "Mo Valley",
    programLink:
      "https://www.facebook.com/share/1GA2PDFQuD/?mibextid=wwXIfr",
    coaches: [
      { divisionKey: "grades-5-6", coaches: ["Kelly Masten"] },
      { divisionKey: "grades-3-4", coaches: ["Kelly Masten"] },
    ],
  },
  {
    stableKey: "west-branch",
    slug: "west-branch",
    name: "West Branch",
    programLink:
      "https://www.facebook.com/share/1FeQhhARFU/?mibextid=wwXIfr",
    coaches: [
      {
        divisionKey: "grades-5-6",
        coaches: ["Alicia Lutz", "Ashley Nines"],
      },
      {
        divisionKey: "grades-3-4",
        coaches: ["Alicia Lutz", "Ashley Nines"],
      },
    ],
  },
];

function etDate(isoDate: string, hour: number, minute = 0) {
  const d = new Date(`${isoDate}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00-05:00`);
  return d;
}

async function main() {
  const conn = await connectMongoose();
  if (!conn) {
    console.error("MONGODB_URI is required for seeding.");
    process.exit(1);
  }

  await SiteSettings.findOneAndUpdate(
    { key: "main" },
    {
      $setOnInsert: {
        key: "main",
        brand: {
          seasonPoster: {
            url: "/brand/season-poster-2026-27.jpg",
            alt: "2026-27 season poster",
          },
          emblem: {
            url: "/brand/season-poster-2026-27.jpg",
            alt: "P-O Select emblem",
            focalX: 0.5,
            focalY: 0.35,
          },
        },
        league: {
          eligibilityHtml: ELIGIBILITY,
          mountiesPhilosophyHtml: MOUNTIES_PHILOSOPHY,
          aboutHtml: ABOUT_HTML,
        },
      },
    },
    { upsert: true },
  );

  const seasons = [
    { slug: "2026-27", label: "2026-27", status: "current", sortOrder: 1 },
    { slug: "2027-28", label: "2027-28", status: "future", sortOrder: 2 },
    { slug: "2028-29", label: "2028-29", status: "future", sortOrder: 3 },
    { slug: "2029-30", label: "2029-30", status: "future", sortOrder: 4 },
  ];

  for (const s of seasons) {
    await Season.findOneAndUpdate({ slug: s.slug }, { $setOnInsert: s }, { upsert: true });
  }

  const season = await Season.findOne({ slug: "2026-27" });
  if (!season) throw new Error("Season missing");

  const divisions = [
    {
      key: "grades-5-6",
      displayName: "Grades 5-6",
      archiveLabel: "6th Grade",
      championshipDate: etDate("2027-01-30", 9),
      leagueDayStartTime: "9:00 AM",
      leagueDayWeekday: "Saturday",
    },
    {
      key: "grades-3-4",
      displayName: "Grades 3-4",
      archiveLabel: "4th Grade",
      championshipDate: etDate("2027-01-31", 12),
      leagueDayStartTime: "12:00 PM",
      leagueDayWeekday: "Sunday",
    },
  ];

  const divisionIds: Record<string, mongoose.Types.ObjectId> = {};
  for (const d of divisions) {
    const doc = await Division.findOneAndUpdate(
      { seasonId: season._id, key: d.key },
      { $setOnInsert: { ...d, seasonId: season._id } },
      { upsert: true, new: true },
    );
    divisionIds[d.key] = doc!._id;
  }

  const leagueDays56 = [
    "2026-11-21",
    "2026-12-05",
    "2026-12-19",
    "2027-01-02",
    "2027-01-16",
    "2027-01-30",
  ];
  const leagueDays34 = [
    "2026-11-22",
    "2026-12-06",
    "2026-12-20",
    "2027-01-03",
    "2027-01-17",
    "2027-01-31",
  ];

  for (const date of leagueDays56) {
    const key = `2026-27-56-${date}`;
    await LeagueEvent.findOneAndUpdate(
      { stableKey: key },
      {
        $setOnInsert: {
          stableKey: key,
          seasonId: season._id,
          divisionId: divisionIds["grades-5-6"],
          title: `Grades 5-6 League Day`,
          eventType: "league-day",
          startsAt: etDate(date, 9),
          venueName: "Philipsburg-Osceola Middle School",
          venueAddress: "200 Short Street, Philipsburg, PA 16866",
        },
      },
      { upsert: true },
    );
  }

  for (const date of leagueDays34) {
    const key = `2026-27-34-${date}`;
    await LeagueEvent.findOneAndUpdate(
      { stableKey: key },
      {
        $setOnInsert: {
          stableKey: key,
          seasonId: season._id,
          divisionId: divisionIds["grades-3-4"],
          title: `Grades 3-4 League Day`,
          eventType: "league-day",
          startsAt: etDate(date, 12),
          venueName: "Philipsburg-Osceola Middle School",
          venueAddress: "200 Short Street, Philipsburg, PA 16866",
        },
      },
      { upsert: true },
    );
  }

  await LeagueEvent.findOneAndUpdate(
    { stableKey: "2026-27-all-star" },
    {
      $setOnInsert: {
        stableKey: "2026-27-all-star",
        seasonId: season._id,
        title: "All-Star Day",
        eventType: "all-star",
        startsAt: etDate("2027-02-06", 9),
        notes: "Grades 3-4: 9:00 AM. Grades 5-6: 10:00 AM.",
        venueName: "Philipsburg-Osceola Middle School",
        venueAddress: "200 Short Street, Philipsburg, PA 16866",
      },
    },
    { upsert: true },
  );

  for (const r of RESOURCES) {
    await Resource.findOneAndUpdate(
      { stableKey: r.stableKey },
      { $setOnInsert: { ...r, category: r.category ?? "forms" } },
      { upsert: true },
    );
  }

  const schoolIds: Record<string, mongoose.Types.ObjectId> = {};
  for (const s of SCHOOLS) {
    const school = await SchoolProgram.findOneAndUpdate(
      { stableKey: s.stableKey },
      {
        $setOnInsert: {
          stableKey: s.stableKey,
          slug: s.slug,
          name: s.name,
          tabAlias: s.tabAlias,
          programLink: s.programLink,
        },
      },
      { upsert: true, new: true },
    );
    schoolIds[s.slug] = school!._id;

    for (const block of s.coaches) {
      const divId = divisionIds[block.divisionKey];
      const teamSlug = `${s.slug}-${block.divisionKey}`;
      await SeasonTeam.findOneAndUpdate(
        { seasonId: season._id, teamSlug },
        {
          $setOnInsert: {
            seasonId: season._id,
            schoolId: school!._id,
            divisionId: divId,
            teamSlug,
            teamName: s.name,
            coaches: block.coaches.map((name) => ({ name })),
            registrationStatus: "placeholder",
            publicationStatus: "published",
          },
        },
        { upsert: true },
      );
    }
  }

  const staff = [
    {
      stableKey: "tj-anderson",
      name: "TJ Anderson",
      roles: ["League Commissioner", "Program Director"],
    },
    {
      stableKey: "shane-kelly",
      name: "Shane Kelly",
      roles: ["Vice League Commissioner"],
    },
    {
      stableKey: "damian-richards",
      name: "Damian Richards",
      roles: ["Vice League Commissioner"],
    },
    {
      stableKey: "amanda-kelly",
      name: "Amanda Kelly",
      roles: ["Vice League Commissioner", "League Board President"],
    },
    {
      stableKey: "liz-barnett",
      name: "Liz Barnett",
      roles: ["League Treasurer"],
    },
  ];
  for (const person of staff) {
    await StaffMember.findOneAndUpdate(
      { stableKey: person.stableKey },
      { $setOnInsert: person },
      { upsert: true },
    );
  }

  const faqs = [
    {
      question: "Who can register?",
      answerHtml: ELIGIBILITY,
      category: "Registration",
    },
    {
      question: "What does registration cost?",
      answerHtml:
        "<p>First team: $200. Each additional team: $150. Payment instructions are provided after your request is reviewed.</p>",
      category: "Registration",
    },
    {
      question: "Where are games played?",
      answerHtml:
        "<p>Philipsburg-Osceola Middle School, 200 Short Street, Philipsburg, PA 16866.</p>",
      category: "Venue",
    },
  ];
  for (const [i, faq] of faqs.entries()) {
    await FAQ.findOneAndUpdate(
      { question: faq.question },
      { $setOnInsert: { ...faq, sortOrder: i } },
      { upsert: true },
    );
  }

  for (const post of LEAGUE_NEWS_ARTICLES) {
    await BlogPost.findOneAndUpdate(
      { slug: post.slug },
      {
        $set: {
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          contentHtml: post.contentHtml,
          authorName: post.authorName,
          categories: post.categories,
          featured: post.featured ?? false,
          publishedAt: new Date(post.publishedAt),
          publicationStatus: "published",
        },
      },
      { upsert: true },
    );
  }

  await BlogPost.updateOne(
    { slug: "latest-updates" },
    { $set: { publicationStatus: "draft", title: "Latest Updates (archived)" } },
  );

  const tiers = [
    {
      stableKey: "team-sponsor",
      name: "Team Sponsor",
      amountCents: 50000,
      descriptionHtml:
        "<p>Company name/logo on team uniform, recognition during varsity basketball games, and appreciation plaque with team photo.</p>",
    },
    {
      stableKey: "uniform-logo",
      name: "Elementary Uniform Logo Display",
      amountCents: 15000,
      descriptionHtml: "<p>Logo display on uniforms of grades 3-6 teams.</p>",
    },
    {
      stableKey: "donation-25",
      name: "Sponsor Donation — $25",
      amountCents: 2500,
    },
    {
      stableKey: "donation-50",
      name: "Sponsor Donation — $50",
      amountCents: 5000,
    },
    {
      stableKey: "donation-100",
      name: "Sponsor Donation — $100",
      amountCents: 10000,
    },
  ];
  for (const [i, tier] of tiers.entries()) {
    await SponsorTier.findOneAndUpdate(
      { stableKey: tier.stableKey },
      { $setOnInsert: { ...tier, sortOrder: i } },
      { upsert: true },
    );
  }

  await CentralPaLions.findOneAndUpdate(
    { key: "main" },
    {
      $setOnInsert: {
        key: "main",
        tryoutsHtml: `<p><strong>Fall:</strong> Saturday, October 17, 2026.<br/><strong>Spring:</strong> Sunday, February 14, 2027.<br/>Subject to change — check the program website/Facebook.</p>`,
      },
    },
    { upsert: true },
  );

  const pages = [
    { slug: "privacy", title: "Privacy Policy", bodyHtml: "<p>Draft for owner review.</p>", publicationStatus: "draft" },
    { slug: "accessibility", title: "Accessibility", bodyHtml: "<p>Draft for owner review.</p>", publicationStatus: "draft" },
    { slug: "join-us", title: "Join Us", bodyHtml: "<p><strong>JOIN THE MOUNTIE FAMILY</strong></p><p>ONE TEAM. ONE GOAL. ONE PURPOSE.</p>" },
    { slug: "picture-day", title: "Picture Day", bodyHtml: "<p>Pictures are at the start of the season, before the first game. Arrive 30 minutes early. Manning Photography handles league pictures. <a href=\"https://manningphoto.net\" target=\"_blank\" rel=\"noopener noreferrer\">manningphoto.net</a></p>" },
  ];
  for (const p of pages) {
    await Page.findOneAndUpdate({ slug: p.slug }, { $setOnInsert: p }, { upsert: true });
  }

  console.log("Seed completed (idempotent).");
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
