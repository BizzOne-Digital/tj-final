/** Default league news (seed + public fallback when no published posts in DB). */
export type LeagueNewsArticle = {
  slug: string;
  title: string;
  excerpt: string;
  contentHtml: string;
  authorName: string;
  categories: string[];
  featured?: boolean;
  publishedAt: string;
};

export const LEAGUE_NEWS_ARTICLES: LeagueNewsArticle[] = [
  {
    slug: "registration-open-2026-27",
    title: "Registration Open for the 2026-27 Winter League",
    excerpt:
      "School-based teams in grades 3–6 can secure a spot in the P-O Select Elementary Winter League. The first eight teams registered in each division are accepted.",
    authorName: "P-O Select League",
    categories: ["Registration"],
    featured: true,
    publishedAt: "2026-10-01T10:00:00-04:00",
    contentHtml: `<p>The <strong>1st Annual P-O Elementary Boys Basketball Booster Club</strong> is accepting registrations for the <strong>2026-27 Select Elementary Winter League</strong>.</p>
<p><strong>Who can play?</strong> School-based teams only (no AAU travel teams). Incoming <strong>3rd–6th graders</strong>. This is a boys league, but <strong>coed and girls teams are welcome</strong>.</p>
<p><strong>Fees:</strong> $200 for the first team; $150 for each additional team from the same school. Payment instructions are provided after your request is reviewed.</p>
<p>We will take the <strong>first eight teams</strong> to complete registration in each division. Submit your team through the <a href="/booking">registration page</a> or contact the league if you have questions.</p>`,
  },
  {
    slug: "2026-27-league-calendar",
    title: "2026-27 League Calendar & Game Days",
    excerpt:
      "Grades 5–6 play Saturday mornings; grades 3–4 play Sunday afternoons at Philipsburg-Osceola Middle School. Championship weekends are January 30–31.",
    authorName: "P-O Select League",
    categories: ["Schedules"],
    publishedAt: "2026-10-03T09:00:00-04:00",
    contentHtml: `<p>All league days are held at <strong>Philipsburg-Osceola Middle School</strong>, 200 Short Street, Philipsburg, PA 16866. Each team plays <strong>two games per league day</strong>. The season runs November through February on alternating weekends.</p>
<h3>Grades 5–6 (Saturdays — 9:00 AM start)</h3>
<p>Nov. 21 · Dec. 5 · Dec. 19 · Jan. 2 · Jan. 16 · <strong>Jan. 30 (Championship)</strong></p>
<h3>Grades 3–4 (Sundays — 12:00 PM start)</h3>
<p>Nov. 22 · Dec. 6 · Dec. 20 · Jan. 3 · Jan. 17 · <strong>Jan. 31 (Championship)</strong></p>
<p>View school-specific posters on the <a href="/schedules">schedules page</a> and full league details on <a href="/league-information">league information</a>.</p>`,
  },
  {
    slug: "all-star-day-february-6",
    title: "All-Star Day Set for February 6",
    excerpt:
      "All-Star Day caps the winter season with showcase games for both divisions at Philipsburg-Osceola Middle School.",
    authorName: "P-O Select League",
    categories: ["Events"],
    publishedAt: "2026-10-05T11:00:00-04:00",
    contentHtml: `<p><strong>All-Star Day — February 6, 2027</strong></p>
<ul>
<li><strong>Grades 3–4:</strong> 9:00 AM</li>
<li><strong>Grades 5–6:</strong> 10:00 AM</li>
</ul>
<p>Location: Philipsburg-Osceola Middle School. Families should arrive early for player check-in and warm-ups. More details will be shared with coaches as the season progresses.</p>`,
  },
  {
    slug: "golden-ticket-state-championship",
    title: "Golden Ticket: State Championship Invites",
    excerpt:
      "Division champions and runners-up earn invitations to the Pennsylvania Middle School Basketball Championship in State College.",
    authorName: "P-O Select League",
    categories: ["Championship"],
    publishedAt: "2026-10-07T08:30:00-04:00",
    contentHtml: `<p>The P-O Select League is an <strong>official state qualifier league</strong> for the Pennsylvania Middle School Basketball Championship.</p>
<p>The <strong>champion and runner-up</strong> in both the grades 3–4 and grades 5–6 divisions receive <strong>Golden Ticket</strong> invitations to compete in <strong>State College, PA</strong>.</p>
<p>Read more about eligibility, travel, and what families can expect on the <a href="/state-championship">Golden Ticket page</a>.</p>`,
  },
  {
    slug: "yearly-forms-before-first-game",
    title: "Yearly Forms Must Be Completed Before the First Game",
    excerpt:
      "Player waivers, codes of conduct, roster, photo release, and injury reporting forms are required for every athlete.",
    authorName: "P-O Select League",
    categories: ["Forms"],
    publishedAt: "2026-10-09T07:00:00-04:00",
    contentHtml: `<p>Coaches and families: please complete all <strong>yearly league forms</strong> before your team&apos;s first game. This includes player waivers, player and parent/guardian codes of conduct, league roster, photo release, and injury reporting.</p>
<p>All forms and Google Form links are listed on the <a href="/information">Information</a> page. If you need help locating a form, contact your school coach or use the <a href="/contact">contact page</a>.</p>`,
  },
  {
    slug: "live-streaming-league-days",
    title: "Live Streaming on League Days",
    excerpt:
      "Games will be streamed so families and fans can follow the action when they cannot attend in person.",
    authorName: "P-O Select League",
    categories: ["League"],
    publishedAt: "2026-10-09T12:00:00-04:00",
    contentHtml: `<p><strong>Live streaming is available</strong> for P-O Select League days. Stream links will be posted before each league date — check back on game weekends and watch for updates from your school&apos;s program page.</p>
<p>For venue directions and league-day start times, see <a href="/league-information">league information</a> or the <a href="/schedules">schedule</a>.</p>`,
  },
];

export function leagueNewsAsJsonDocs(): Record<string, unknown>[] {
  return LEAGUE_NEWS_ARTICLES.map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    contentHtml: post.contentHtml,
    authorName: post.authorName,
    categories: post.categories,
    featured: post.featured ?? false,
    publishedAt: post.publishedAt,
    publicationStatus: "published",
  }));
}
