/** Form slugs shown on each school team page (matches seed / Drive). */

export const YEARLY_FORM_SLUGS = [
  "player-waiver",
  "players-code-of-conduct",
  "parent-guardian-code-of-conduct",
  "2026-league-roster",
  "zero-tolerance-photography",
  "photo-release",
] as const;

export const WEEKLY_FORM_SLUGS = [
  "injury-report",
  "all-star-selection",
  "player-of-the-game-voting",
  "contacts-for-next-season",
  "game-officials-feedback",
  "how-can-we-be-better",
] as const;

export const YEARLY_FORM_LABELS: Record<string, string> = {
  "player-waiver": "Player Waiver",
  "players-code-of-conduct": "Player's Code of Conduct Form",
  "parent-guardian-code-of-conduct": "Parent/Guardian Code of Conduct",
  "2026-league-roster": "2026 League Roster",
  "zero-tolerance-photography": "Zero Tolerance Photography & Recording Policy",
  "photo-release": "Public Relations Internet and Photo Release Form",
};

export const WEEKLY_FORM_LABELS: Record<string, string> = {
  "injury-report": "Injury Report Form",
  "all-star-selection": "All-Star Selection Form",
  "player-of-the-game-voting": "Player of the Game Weekly Voting Form",
  "contacts-for-next-season": "Contacts for Next Season Form",
  "game-officials-feedback": "Game Officials Feedback Form",
  "how-can-we-be-better": "How Can We Be Better?",
};

export function isYearlyFormSlug(slug: string): boolean {
  return (YEARLY_FORM_SLUGS as readonly string[]).includes(slug);
}

export function isWeeklyFormSlug(slug: string): boolean {
  return (WEEKLY_FORM_SLUGS as readonly string[]).includes(slug);
}
