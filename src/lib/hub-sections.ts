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
      children: Array.from({ length: 7 }, (_, i) => ({
        id: `${season}-${g}-week-${i + 1}`,
        title: `Week ${i + 1} Scores`,
        level: 4,
        body: COMING_SOON,
      })),
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
