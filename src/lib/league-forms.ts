/** Form slugs shown on each school team page (matches seed / Drive). */

export const YEARLY_FORM_SLUGS = [
  "player-waiver",
  "players-code-of-conduct",
  "parent-guardian-code-of-conduct",
  "2026-league-roster",
  "zero-tolerance-photography",
  "photo-release",
  "po-select-league-report-cards",
] as const;

export const WEEKLY_FORM_SLUGS = [
  "injury-report",
  "all-star-selection",
  "player-of-the-game-voting",
  "contacts-for-next-season",
  "game-officials-feedback",
  "how-can-we-be-better",
] as const;

/** Canonical Google Form URLs (used when DB resource has no externalUrl yet). */
export const FORM_EXTERNAL_URLS: Partial<Record<string, string>> = {
  "player-waiver": "https://forms.gle/M1BWtZKdfmUXZD7L8",
  "players-code-of-conduct": "https://forms.gle/hJcATXJQ19rGXdaf6",
  "parent-guardian-code-of-conduct": "https://forms.gle/RDDBYNJdFud1BGZr7",
  "2026-league-roster": "https://forms.gle/pkCJd3T7DWAayL5s7",
  "zero-tolerance-photography": "https://forms.gle/ZKoCR77TABB2zqys8",
  "photo-release": "https://forms.gle/gMqPbEUDQCboHHqaA",
  "po-select-league-report-cards": "https://forms.gle/8yEEVYi3GzGUNK4u6",
  "injury-report": "https://forms.gle/kukWycq3AerWwPoPA",
  "all-star-selection": "https://forms.gle/BUsQbrQYF3ze5FTc9",
  "player-of-the-game-voting": "https://forms.gle/1UzbvqyshDGJh2RF6",
  "play-of-the-game-voting": "https://forms.gle/1UzbvqyshDGJh2RF6",
  "contacts-for-next-season": "https://forms.gle/P3yD2o8ZYKBGKpwQ9",
  "share-family-story": "https://forms.gle/NNGAzzoQvKdcYfMj7",
  "game-officials-feedback": "https://forms.gle/MnkwjVy5rp8dRJVA7",
  "how-can-we-be-better": "https://forms.gle/ssNTUSPzgph9yiaq7",
};

/** Optional `title` on external form links (browser tooltip). */
export const FORM_LINK_TITLES: Partial<Record<string, string>> = {
  "po-select-league-report-cards": "P-O Select League Report Cards (Google Form Link)",
};

export function formExternalUrl(slug: string): string | undefined {
  return FORM_EXTERNAL_URLS[slug];
}

export const YEARLY_FORM_LABELS: Record<string, string> = {
  "player-waiver": "Player Waiver",
  "players-code-of-conduct": "Player's Code of Conduct Form",
  "parent-guardian-code-of-conduct": "Parent/Guardian Code of Conduct",
  "2026-league-roster": "2026 League Roster",
  "zero-tolerance-photography": "Zero Tolerance Photography & Recording Policy",
  "photo-release": "Public Relations Internet and Photo Release Form",
  "po-select-league-report-cards": "P-O Select League Report Cards",
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
