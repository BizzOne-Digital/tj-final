export const LEAGUE_SEASONS = ["2026-27", "2027-28", "2028-29"] as const;

export const COMING_SOON = "More information coming soon.";

export type HubBlock = {
  id: string;
  title: string;
  level?: 2 | 3 | 4;
  body?: string;
  html?: string;
  children?: HubBlock[];
};

const WEEK1_6TH_DIR = "/league-assets/scores/2026-27/6th-grade-week-1";
const WEEK1_6TH_IMAGES: { file: string; alt: string }[] = [
  { file: "standings", alt: "6th Grade Week 1 standings, November 21, 2026" },
  { file: "po-6th-vs-po-5th", alt: "P-O 6th Grade 58, P-O 5th Grade 12" },
  { file: "po-5th-vs-punxsutawney", alt: "P-O 5th Grade 23, Punxsutawney 11" },
  { file: "bellwood-vs-west-branch", alt: "Bellwood 44, West Branch 19" },
  { file: "punxsutawney-vs-clearfield", alt: "Punxsutawney 35, Clearfield 20" },
  { file: "po-6th-vs-clearfield", alt: "P-O 6th Grade 72, Clearfield 11" },
  { file: "bellwood-vs-tyrone", alt: "Bellwood 47, Tyrone 43" },
  { file: "tyrone-vs-mo-valley", alt: "Tyrone 76, Mo Valley (score unconfirmed)" },
  { file: "west-branch-vs-mo-valley", alt: "West Branch 28, Mo Valley 0 (scorebook result)" },
];

/** Week 1 (Nov 21, 2026) 6th Grade results: coach's note plus standings and game recaps. */
const WEEK1_6TH_HTML = `<p><strong>P-O Select League | 6th Grade Week 1 Results</strong></p>
<p>Coaches,</p>
<p>Here is a look at the results from yesterday's 6th Grade Select League games. We enjoyed watching your teams compete and appreciate everyone who helped make opening weekend a great one.</p>
<p>Please share the game recaps with your players and families. We look forward to seeing everyone back on the court in a few weeks!</p>
<p>Thank you,<br/>Coach Anderson</p>
${WEEK1_6TH_IMAGES.map(
  (i) =>
    `<p><img src="${WEEK1_6TH_DIR}/${i.file}.png" alt="${i.alt}" loading="lazy" style="width:100%;max-width:640px;height:auto;border-radius:8px" /></p>`,
).join("\n")}`;

export function seasonStandingsBlocks(season: string): HubBlock[] {
  const blocks: HubBlock[] = [
    { id: `${season}-header`, title: `${season} Season`, level: 2 },
  ];
  for (const grade of ["4th Grade", "6th Grade"]) {
    const g = grade.toLowerCase().replace(/\s+/g, "-");
    blocks.push({
      id: `${season}-${g}-standings`,
      title: `${grade} Standings`,
      level: 3,
      body: COMING_SOON,
      children: Array.from({ length: 7 }, (_, i) => {
        const id = `${season}-${g}-week-${i + 1}`;
        const base = { id, title: `Week ${i + 1} Scores`, level: 4 as const };
        return id === "2026-27-6th-grade-week-1"
          ? { ...base, html: WEEK1_6TH_HTML }
          : { ...base, body: COMING_SOON };
      }),
    });
  }
  blocks.push(
    { id: `${season}-4th-playoff`, title: "4th Grade Playoff Bracket", level: 3, body: COMING_SOON },
    { id: `${season}-6th-playoff`, title: "6th Grade Playoff Bracket", level: 3, body: COMING_SOON },
    {
      id: `${season}-streaming`,
      title: "Streaming",
      level: 3,
      html: `<p><strong>📺 LIVE STREAMING AVAILABLE (NFHS Network)</strong></p>
<p>You can watch games online. Use our school page so you do not have to search:</p>
<p><a href="https://www.nfhsnetwork.com/schools/philipsburg-osceola-area-high-school-philipsburg-pa" target="_blank" rel="noopener noreferrer">Philipsburg-Osceola on NFHS Network ↗</a></p>`,
    },
  );
  return blocks;
}

export function allStandingsHubBlocks(): HubBlock[] {
  return LEAGUE_SEASONS.flatMap((s) => seasonStandingsBlocks(s));
}

export function awardsChampionshipBlocks(): HubBlock[] {
  const blocks: HubBlock[] = [{ id: "awards-intro", title: "Awards & Championships", level: 2 }];
  for (const season of LEAGUE_SEASONS) {
    blocks.push({
      id: `champ-${season}`,
      title: `${season} League Championships`,
      level: 3,
      children: [
        { id: `champ-${season}-4th`, title: "4th Grade League Champions", level: 4, body: COMING_SOON },
        { id: `champ-${season}-6th`, title: "6th Grade League Champions", level: 4, body: COMING_SOON },
      ],
    });
    blocks.push({
      id: `awards-${season}`,
      title: `${season} League Player Awards`,
      level: 3,
      children: [
        { id: `awards-${season}-4th`, title: "4th Grade League Player Awards", level: 4, body: COMING_SOON },
        { id: `awards-${season}-6th`, title: "6th Grade League Player Awards", level: 4, body: COMING_SOON },
      ],
    });
  }
  return blocks;
}

export function goldenTicketWinnerBlocks(): HubBlock[] {
  return LEAGUE_SEASONS.map((season) => ({
    id: `gt-${season}`,
    title: `${season} Season Golden Ticket Winners`,
    level: 3,
    children: [
      { id: `gt-${season}-4th`, title: "4th Grade Teams", level: 4, body: "Coming Soon!" },
      { id: `gt-${season}-6th`, title: "6th Grade Teams", level: 4, body: "Coming Soon!" },
    ],
  }));
}

const TEAM_4TH = [
  { slug: "philipsburg-osceola", label: "Philipsburg-Osceola" },
  { slug: "west-branch", label: "West Branch" },
  { slug: "moshannon-valley", label: "Mo Valley" },
  { slug: "mifflin-county", label: "Mifflin County" },
  { slug: "punxsutawney", label: "Punxsutawney" },
];

const TEAM_6TH = [
  { slug: "philipsburg-osceola", label: "Philipsburg-Osceola" },
  { slug: "tyrone", label: "Tyrone" },
  { slug: "bellwood-antis", label: "Bellwood" },
  { slug: "clearfield", label: "Clearfield" },
  { slug: "west-branch", label: "West Branch" },
  { slug: "moshannon-valley", label: "Mo Valley" },
  { slug: "punxsutawney", label: "Punxsutawney" },
];

export function teamDirectoryBlocks(): HubBlock[] {
  return LEAGUE_SEASONS.map((season) => ({
    id: `td-${season}`,
    title: `${season} Season`,
    level: 2,
    children: [
      {
        id: `td-${season}-meet`,
        title: "Meet the Teams",
        level: 3,
        body: "Season archives with coaches, rosters, and team photos.",
      },
      {
        id: `td-${season}-4th`,
        title: "4th Grade League Teams",
        level: 3,
        children: TEAM_4TH.map((t) => ({
          id: `td-${season}-4th-${t.slug}`,
          title: t.label,
          level: 4,
          body: COMING_SOON,
          html: `<p><a href="/teams/${t.slug}" class="text-electric-blue hover:underline">View ${t.label} team page →</a></p>`,
        })),
      },
      {
        id: `td-${season}-6th`,
        title: "6th Grade League Teams",
        level: 3,
        children: TEAM_6TH.map((t) => ({
          id: `td-${season}-6th-${t.slug}`,
          title: t.label,
          level: 4,
          body: COMING_SOON,
          html: `<p><a href="/teams/${t.slug}" class="text-electric-blue hover:underline">View ${t.label} team page →</a></p>`,
        })),
      },
    ],
  }));
}

export function allStarsBlocks(): HubBlock[] {
  return LEAGUE_SEASONS.map((season) => ({
    id: `as-${season}`,
    title: `${season} Season`,
    level: 2,
    children: ["4th Grade Team", "6th Grade Team"].map((grade) => ({
      id: `as-${season}-${grade.replace(/\s+/g, "-").toLowerCase()}`,
      title: grade,
      level: 3,
      html: `<p><strong>Team Pictures</strong><br/>Coming Soon</p><p class="mt-2"><strong>Team Videos</strong><br/>Coming Soon</p>`,
    })),
  }));
}

export function playoffBlocks(): HubBlock[] {
  return LEAGUE_SEASONS.map((season) => ({
    id: `playoff-${season}`,
    title: `${season} Season`,
    level: 2,
    children: [
      { id: `playoff-${season}-4th`, title: "4th Grade Playoff Bracket", level: 4, body: COMING_SOON },
      { id: `playoff-${season}-6th`, title: "6th Grade Playoff Bracket", level: 4, body: COMING_SOON },
    ],
  }));
}

/** Every block (at any depth) that has editable body text. */
export function flattenEditableBlocks(blocks: HubBlock[]): HubBlock[] {
  const out: HubBlock[] = [];
  const walk = (b: HubBlock) => {
    if (typeof b.body === "string" && !b.html) out.push(b);
    b.children?.forEach(walk);
  };
  blocks.forEach(walk);
  return out;
}

/** Replace default "coming soon" bodies with admin-edited HTML. */
export function applyBlockOverrides(
  blocks: HubBlock[],
  getOverride: (blockId: string) => string | undefined,
): HubBlock[] {
  const map = (b: HubBlock): HubBlock => {
    const next: HubBlock = { ...b };
    const o = typeof b.body === "string" && !b.html ? getOverride(b.id) : undefined;
    if (o) {
      next.body = undefined;
      next.html = o;
    }
    if (b.children) next.children = b.children.map(map);
    return next;
  };
  return blocks.map(map);
}
