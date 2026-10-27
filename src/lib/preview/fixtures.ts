/** Read-only preview data when MongoDB is not configured (development only). */

export const PREVIEW_MODE = process.env.NODE_ENV === "development";

export function previewSiteSettings() {
  return {
    key: "main",
    siteTitle: "P-O Select League",
    shortName: "P-O Select League",
    fullLeagueName:
      "PHILIPSBURG-OSCEOLA SELECT ELEMENTARY BASKETBALL LEAGUE",
    colors: {
      midnightNavy: "#07132D",
      deepBlue: "#0B2457",
      royalBlue: "#155EEF",
      electricBlue: "#3D8BFF",
      iceWhite: "#F6F9FF",
      coolGrey: "#A9B4C8",
      nearBlack: "#080C14",
      gold: "#D9AD48",
    },
    brand: {
      seasonPoster: {
        url: "/brand/season-poster-2026-27.jpg",
        alt: "2026-27 P-O Select Elementary Winter Basketball League season poster",
      },
      emblem: {
        url: "/brand/season-poster-2026-27.jpg",
        alt: "P-O Select League emblem",
        objectFit: "cover",
        focalX: 0.5,
        focalY: 0.35,
      },
    },
    contact: {
      primaryName: "TJ Anderson",
      primaryEmail: "tjandersty@gmail.com",
      primaryPhone: "814-500-8613",
      programEmail: "Poselectbasketballleague@gmail.com",
      mailingAddress: "7410 Sportsman Rd, Alexandria, PA 16611",
      gameVenueName: "Philipsburg-Osceola Middle School",
      gameVenueAddress: "200 Short Street, Philipsburg, PA 16866",
      facebookPageName: "PO Mounties Select League",
      facebookUrl: "",
    },
    headlines: {
      main: "SMALL HANDS. BIG DREAMS. TOGETHER WE RAISE.",
      quote:
        "Every hustle play, every teammate encouraged, every lesson learned—this is how the SELECT LEAGUE tradition grows.",
      supporting:
        "Building confidence. Developing teammates. Inspiring the next generation of Ball players.",
      secondary: "ONE TEAM. ONE GOAL. ONE PURPOSE.",
      hashtags:
        "#POSelect #MountiePride #SmallHandsBigDreams #FutureMounties #POLeagueTradition #TogetherWeRise #YouthBasketball",
    },
    announcement: {
      text: "2026-27 Winter Season — Preview mode (database not connected)",
      visible: true,
    },
    league: {
      activeSeasonSlug: "2026-27",
      registrationOpen: true,
      teamsPerDivisionCapacity: 8,
      firstTeamFeeCents: 20000,
      additionalTeamFeeCents: 15000,
      nfhsStreamUrl:
        "https://www.nfhsnetwork.com/schools/philipsburg-osceola-area-high-school-philipsburg-pa",
    },
    _preview: true,
  };
}

export const previewSchools = [
  {
    slug: "philipsburg-osceola",
    name: "Philipsburg-Osceola",
    programLink: "https://www.mountieyouthbasketball.com",
  },
  {
    slug: "tyrone",
    name: "Tyrone",
    programLink:
      "https://www.facebook.com/share/g/1C4iRTkz7P/?mibextid=wwXIfr",
  },
  {
    slug: "clearfield",
    name: "Clearfield",
    programLink:
      "https://www.facebook.com/share/19Q6PDtnjG/?mibextid=wwXIfr",
  },
  {
    slug: "bellwood-antis",
    name: "Bellwood-Antis",
    tabAlias: "Bellwood",
    programLink:
      "https://www.facebook.com/share/1DtJd6bvFj/?mibextid=wwXIfr",
  },
  {
    slug: "moshannon-valley",
    name: "Moshannon Valley",
    tabAlias: "Mo Valley",
    programLink:
      "https://www.facebook.com/share/1GA2PDFQuD/?mibextid=wwXIfr",
  },
  {
    slug: "west-branch",
    name: "West Branch",
    programLink:
      "https://www.facebook.com/share/1FeQhhARFU/?mibextid=wwXIfr",
  },
  {
    slug: "mifflin-county",
    name: "Mifflin County",
    tabAlias: "Mifflin County",
    programLink: "https://www.facebook.com/share/19nEiubQzM/?mibextid=wwXIfr",
  },
  {
    slug: "punxsutawney",
    name: "Punxsutawney",
    programLink:
      "https://www.facebook.com/share/1KE1JKvqqz/?mibextid=wwXIfr",
  },
];
