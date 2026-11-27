export type GameLink = {
  week: string;
  title: string;
  url: string;
  date?: string;
};

const PO_VS_PO: GameLink = {
  week: "Week #1",
  title: "PO 6th vs PO 5th (Game 8 AM)",
  url: "https://youtu.be/2I8nO9iYC6c",
};
const CLEARFIELD_VS_PUNXY: GameLink = {
  week: "Week #1",
  title: "Clearfield 6th vs Punxsutawney (Game 9 AM)",
  url: "https://youtu.be/DRsWtNoR4Ak",
};
const WEST_BRANCH_VS_BELLWOOD: GameLink = {
  week: "Week #1",
  title: "West Branch 6th vs Bellwood 6th Grade Blue (Coach Aaron Gray)",
  url: "https://youtu.be/5kaCyQsWKyA",
};
const TYRONE_VS_BELLWOOD: GameLink = {
  week: "Week #1",
  title: "Tyrone vs Bellwood 6th Grade Blue (Coach Aaron Gray)",
  url: "https://youtu.be/QI7SRfSjqsQ",
  date: "11-21-26",
};
const TYRONE_VS_MO_VALLEY: GameLink = {
  week: "Week #1",
  title: "Tyrone vs Mo Valley",
  url: "https://youtu.be/G5anpIl_oTc",
  date: "11-21-26",
};
const WEST_BRANCH_VS_MO_VALLEY: GameLink = {
  week: "Week #1",
  title: "West Branch vs Mo Valley",
  url: "https://youtu.be/sR-XYlT-Ig0",
  date: "11-21-26",
};

/** Game replay links shown on each school's team page, keyed by school slug. */
export const GAME_LINKS_BY_SCHOOL: Record<string, GameLink[]> = {
  "philipsburg-osceola": [PO_VS_PO],
  clearfield: [CLEARFIELD_VS_PUNXY],
  punxsutawney: [CLEARFIELD_VS_PUNXY],
  "west-branch": [WEST_BRANCH_VS_BELLWOOD, WEST_BRANCH_VS_MO_VALLEY],
  "bellwood-antis": [WEST_BRANCH_VS_BELLWOOD, TYRONE_VS_BELLWOOD],
  tyrone: [TYRONE_VS_BELLWOOD, TYRONE_VS_MO_VALLEY],
  "moshannon-valley": [TYRONE_VS_MO_VALLEY, WEST_BRANCH_VS_MO_VALLEY],
};

export function gameLinksForSchool(slug: string, week: string): GameLink[] {
  return (GAME_LINKS_BY_SCHOOL[slug] ?? []).filter((g) => g.week === week);
}
