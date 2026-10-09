import manifest from "./drive-assets.manifest.json";

export type DriveAssetKey = keyof typeof manifest;

export function driveAsset(key: string): string | undefined {
  const m = manifest as Record<string, string>;
  return m[key];
}

const schoolTeamKeys: Record<string, string> = {
  tyrone: "schools.tyrone.team",
  clearfield: "schools.clearfield.team",
  "bellwood-antis": "schools.bellwood-antis.team",
  "philipsburg-osceola": "schools.philipsburg-osceola.team",
  "moshannon-valley": "schools.moshannon-valley.team",
  "west-branch": "schools.west-branch.team",
};

export function schoolTeamImage(slug: string): string | undefined {
  const key = schoolTeamKeys[slug];
  return key ? driveAsset(key) : undefined;
}

const scheduleKeysBySlug: Record<string, string[]> = {
  tyrone: ["schools.tyrone.schedule"],
  clearfield: ["schools.clearfield.schedule"],
  "bellwood-antis": ["schools.bellwood-antis.schedule"],
  "philipsburg-osceola": [
    "schools.philipsburg-osceola.schedule-grades-3-4",
    "schools.philipsburg-osceola.schedule-grades-5-6",
  ],
  "moshannon-valley": [
    "schools.moshannon-valley.schedule-1",
    "schools.moshannon-valley.schedule-2",
  ],
  "west-branch": ["schools.west-branch.schedule-1", "schools.west-branch.schedule-2"],
};

export function schoolScheduleImages(slug: string): string[] {
  const keys = scheduleKeysBySlug[slug] ?? [];
  return keys.map((k) => driveAsset(k)).filter(Boolean) as string[];
}

export const MAIN_PROGRAM_PICTURE = driveAsset("main.program-picture") ?? "/league-assets/main/program-picture.png";
export const MAIN_ABOUT_PICTURE = driveAsset("about.about-feature") ?? "/league-assets/about/about-feature.png";
export const GOLDEN_TICKET_PICTURE = driveAsset("golden-ticket.picture") ?? "/league-assets/golden-ticket/picture.png";
export const NIKE_MARK = driveAsset("main.nike-from-poster") ?? "/brand/season-poster-2026-27.jpg";
