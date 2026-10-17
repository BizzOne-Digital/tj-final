export interface StandingRow {
  teamId: string;
  teamName: string;
  schoolSlug: string;
  gp: number;
  w: number;
  l: number;
  pf: number;
  pa: number;
  pct: number;
  rank: number;
  tied?: boolean;
}

export interface GameResultInput {
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number;
  awayScore: number;
  gameType: string;
  status: string;
  includeInStandings: boolean;
}

const DEFAULT_EXCLUDED_TYPES = new Set([
  "playoff",
  "all-star",
  "exhibition",
  "championship",
]);

export function shouldIncludeInStandings(
  game: GameResultInput,
  extraIncludedTypes?: string[],
): boolean {
  if (game.status !== "final") return false;
  if (!game.includeInStandings) return false;
  if (extraIncludedTypes?.includes(game.gameType)) return true;
  return !DEFAULT_EXCLUDED_TYPES.has(game.gameType);
}

export function computeStandings(
  teams: { id: string; name: string; schoolSlug: string }[],
  games: GameResultInput[],
  extraIncludedTypes?: string[],
): StandingRow[] {
  const stats = new Map<
    string,
    { w: number; l: number; pf: number; pa: number; gp: number }
  >();

  for (const t of teams) {
    stats.set(t.id, { w: 0, l: 0, pf: 0, pa: 0, gp: 0 });
  }

  for (const g of games) {
    if (!shouldIncludeInStandings(g, extraIncludedTypes)) continue;
    if (g.homeScore === g.awayScore) continue;

    const home = stats.get(g.homeTeamId);
    const away = stats.get(g.awayTeamId);
    if (!home || !away) continue;

    home.gp += 1;
    away.gp += 1;
    home.pf += g.homeScore;
    home.pa += g.awayScore;
    away.pf += g.awayScore;
    away.pa += g.homeScore;

    if (g.homeScore > g.awayScore) {
      home.w += 1;
      away.l += 1;
    } else {
      away.w += 1;
      home.l += 1;
    }
  }

  const rows: StandingRow[] = teams.map((t) => {
    const s = stats.get(t.id)!;
    const pct = s.gp > 0 ? s.w / s.gp : 0;
    return {
      teamId: t.id,
      teamName: t.name,
      schoolSlug: t.schoolSlug,
      gp: s.gp,
      w: s.w,
      l: s.l,
      pf: s.pf,
      pa: s.pa,
      pct,
      rank: 0,
    };
  });

  rows.sort((a, b) => {
    if (b.pct !== a.pct) return b.pct - a.pct;
    if (b.w !== a.w) return b.w - a.w;
    return b.pf - a.pf;
  });

  let rank = 1;
  for (let i = 0; i < rows.length; i++) {
    if (i > 0) {
      const prev = rows[i - 1];
      const cur = rows[i];
      const tied =
        prev.pct === cur.pct && prev.w === cur.w && prev.pf === cur.pf;
      if (!tied) rank = i + 1;
      else cur.tied = true;
      if (tied) prev.tied = true;
    }
    rows[i].rank = rank;
  }

  return rows;
}
