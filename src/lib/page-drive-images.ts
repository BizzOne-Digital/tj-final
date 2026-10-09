import manifest from "./drive-assets.manifest.json";
import {
  schoolScheduleImages,
  schoolTeamImage,
  MAIN_ABOUT_PICTURE,
  MAIN_PROGRAM_PICTURE,
  GOLDEN_TICKET_PICTURE,
  driveAsset,
} from "./drive-assets";

const m = manifest as Record<string, string>;

export const ALL_LEAGUE_IMAGE_URLS: string[] = Object.values(m);

/** Wide hero/banner art only — no tall school schedule or team posters */
export const LEAGUE_BAND_IMAGES: string[] = ALL_LEAGUE_IMAGE_URLS.filter(
  (url) =>
    !url.includes("/schedule") &&
    !url.includes("/schools/") &&
    !url.includes("team-schedules"),
);

export const ALL_SCHOOL_TEAM_IMAGES: string[] = [
  "schools.tyrone.team",
  "schools.clearfield.team",
  "schools.bellwood-antis.team",
  "schools.philipsburg-osceola.team",
  "schools.moshannon-valley.team",
  "schools.west-branch.team",
]
  .map((k) => m[k])
  .filter(Boolean);

export const ALL_SCHOOL_SCHEDULE_IMAGES: string[] = Object.keys(m)
  .filter((k) => k.includes("schedule"))
  .map((k) => m[k]);

export const LEAGUE_SCHEDULE_SHEETS: string[] = [
  m["information.4th-grade-team-schedules"],
  m["information.6th-grade-team-schedules"],
].filter(Boolean) as string[];

export const CENTRAL_PA_LIONS_IMAGES: string[] = [
  m["central-pa-lions.1"],
  m["central-pa-lions.2"],
  m["central-pa-lions.3"],
].filter(Boolean) as string[];

export const MAIN_HEADING_GALLERY =
  m["main.heading-gallery"] ?? "/league-assets/main/heading-gallery.jpg";

function uniq(urls: (string | undefined)[]): string[] {
  return [...new Set(urls.filter(Boolean) as string[])];
}

/** Primary drive images shown on each public route (per client spec folders). */
export function getPageGallery(pathname: string): string[] {
  const path = pathname.split("?")[0] || "/";

  if (path === "/") return [];

  const teamMatch = /^\/teams\/([^/]+)$/.exec(path);
  if (teamMatch) {
    const slug = teamMatch[1];
    return uniq([schoolTeamImage(slug), ...schoolScheduleImages(slug)]);
  }

  const seasonTeamMatch = /^\/seasons\/[^/]+\/teams\/([^/]+)$/.exec(path);
  if (seasonTeamMatch) {
    const teamSlug = seasonTeamMatch[1];
    const schoolPrefix = teamSlug.replace(/-grades-\d-\d$/, "");
    return uniq([schoolTeamImage(schoolPrefix), ...schoolScheduleImages(schoolPrefix)]);
  }

  switch (path) {
    case "/about":
      return uniq([MAIN_ABOUT_PICTURE, MAIN_PROGRAM_PICTURE, MAIN_HEADING_GALLERY]);
    case "/league-information":
    case "/pricing":
    case "/booking":
      return uniq([MAIN_PROGRAM_PICTURE, GOLDEN_TICKET_PICTURE, ...LEAGUE_SCHEDULE_SHEETS]);
    case "/teams":
      return uniq([...ALL_SCHOOL_TEAM_IMAGES, MAIN_PROGRAM_PICTURE]);
    case "/schedules":
    case "/standings":
    case "/scores":
    case "/playoffs":
      return uniq([...LEAGUE_SCHEDULE_SHEETS, ...ALL_SCHOOL_SCHEDULE_IMAGES]);
    case "/state-championship":
    case "/awards":
      return uniq([GOLDEN_TICKET_PICTURE, MAIN_PROGRAM_PICTURE, ...ALL_SCHOOL_TEAM_IMAGES.slice(0, 3)]);
    case "/central-pa-lions":
      return uniq([...CENTRAL_PA_LIONS_IMAGES, MAIN_PROGRAM_PICTURE]);
    case "/gallery":
    case "/through-the-years":
      return uniq([
        MAIN_HEADING_GALLERY,
        ...ALL_SCHOOL_TEAM_IMAGES,
        ...ALL_SCHOOL_SCHEDULE_IMAGES,
        MAIN_ABOUT_PICTURE,
      ]);
    case "/all-stars":
      return uniq([...ALL_SCHOOL_TEAM_IMAGES, GOLDEN_TICKET_PICTURE]);
    case "/information":
      return uniq([...LEAGUE_SCHEDULE_SHEETS]);
    case "/streaming":
      return uniq([MAIN_PROGRAM_PICTURE, driveAsset("main.nike-from-poster"), ...LEAGUE_SCHEDULE_SHEETS]);
    case "/contact":
      return [];
    case "/our-team":
    case "/join-us":
    case "/support":
    case "/sponsorship":
    case "/gear-store":
    case "/services":
      return uniq([MAIN_ABOUT_PICTURE, MAIN_PROGRAM_PICTURE, MAIN_HEADING_GALLERY]);
    case "/testimonials":
    case "/blogs":
      return uniq([MAIN_ABOUT_PICTURE, ...ALL_SCHOOL_TEAM_IMAGES.slice(0, 4)]);
    case "/picture-day":
      return uniq([MAIN_HEADING_GALLERY, ...ALL_SCHOOL_TEAM_IMAGES]);
    case "/record-book":
    case "/faq":
      return uniq([...ALL_SCHOOL_TEAM_IMAGES, ...LEAGUE_SCHEDULE_SHEETS]);
    default:
      if (path.startsWith("/information/")) {
        return uniq([...LEAGUE_SCHEDULE_SHEETS]);
      }
      if (path.startsWith("/seasons/")) {
        return uniq([...ALL_SCHOOL_TEAM_IMAGES, ...LEAGUE_SCHEDULE_SHEETS]);
      }
      return uniq([
        ALL_LEAGUE_IMAGE_URLS[
          path.length % Math.max(ALL_LEAGUE_IMAGE_URLS.length, 1)
        ],
        MAIN_PROGRAM_PICTURE,
      ]);
  }
}

export function leagueImageAt(index: number): string {
  const list = LEAGUE_BAND_IMAGES.length ? LEAGUE_BAND_IMAGES : [MAIN_PROGRAM_PICTURE];
  return list[((index % list.length) + list.length) % list.length];
}

export function isSchoolTeamAssetUrl(url: string): boolean {
  return /\/team\.(png|jpe?g|webp|gif)$/i.test(url);
}

export function isScheduleAssetUrl(url: string): boolean {
  if (isSchoolTeamAssetUrl(url)) return false;
  return url.includes("/schedule") || url.includes("team-schedules");
}
