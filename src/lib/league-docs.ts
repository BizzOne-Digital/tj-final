import docs from "./league-docs.manifest.json";

const map = docs as Record<string, string>;

export function leagueDocUrl(resourceSlug: string): string | undefined {
  return map[resourceSlug];
}

export function allLeagueDocSlugs(): string[] {
  return Object.keys(map);
}
