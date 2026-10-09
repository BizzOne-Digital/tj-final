import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { mediaRefSchema } from "./shared";

const siteSettingsSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: "main" },
    siteTitle: { type: String, default: "P-O Select League" },
    shortName: { type: String, default: "P-O Select League" },
    fullLeagueName: {
      type: String,
      default: "PHILIPSBURG-OSCEOLA SELECT ELEMENTARY BASKETBALL LEAGUE",
    },
    colors: {
      midnightNavy: { type: String, default: "#07132D" },
      deepBlue: { type: String, default: "#0B2457" },
      royalBlue: { type: String, default: "#155EEF" },
      electricBlue: { type: String, default: "#3D8BFF" },
      iceWhite: { type: String, default: "#F6F9FF" },
      coolGrey: { type: String, default: "#A9B4C8" },
      nearBlack: { type: String, default: "#080C14" },
      gold: { type: String, default: "#D9AD48" },
    },
    brand: {
      headerLogo: mediaRefSchema,
      footerLogo: mediaRefSchema,
      mobileLogo: mediaRefSchema,
      favicon: mediaRefSchema,
      emblem: mediaRefSchema,
      seasonPoster: mediaRefSchema,
      socialShareImage: mediaRefSchema,
      nikeMark: mediaRefSchema,
      showNikeMark: { type: Boolean, default: true },
    },
    contact: {
      primaryName: { type: String, default: "TJ Anderson" },
      primaryEmail: { type: String, default: "tjandersty@gmail.com" },
      primaryPhone: { type: String, default: "814-500-8613" },
      programEmail: {
        type: String,
        default: "Poselectbasketballleague@gmail.com",
      },
      legacyEmail: {
        type: String,
        default: "mountiesyouthbasketball@gmail.com",
      },
      mailingAddress: {
        type: String,
        default: "7410 Sportsman Rd, Alexandria, PA 16611",
      },
      gameVenueName: {
        type: String,
        default: "Philipsburg-Osceola Middle School",
      },
      gameVenueAddress: {
        type: String,
        default: "200 Short Street, Philipsburg, PA 16866",
      },
      facebookPageName: {
        type: String,
        default: "PO Mounties Select League",
      },
      facebookUrl: { type: String, default: "" },
    },
    headlines: {
      main: {
        type: String,
        default: "SMALL HANDS. BIG DREAMS. TOGETHER WE RAISE.",
      },
      quote: {
        type: String,
        default:
          "Every hustle play, every teammate encouraged, every lesson learned—this is how the SELECT LEAGUE tradition grows.",
      },
      supporting: {
        type: String,
        default:
          "Building confidence. Developing teammates. Inspiring the next generation of Ball players.",
      },
      secondary: { type: String, default: "ONE TEAM. ONE GOAL. ONE PURPOSE." },
      hashtags: {
        type: String,
        default:
          "#POSelect #MountiePride #SmallHandsBigDreams #FutureMounties #POLeagueTradition #TogetherWeRise #YouthBasketball",
      },
    },
    announcement: {
      text: {
        type: String,
        default: "2026-27 Winter Season — Team registration open",
      },
      visible: { type: Boolean, default: true },
    },
    motionIntensity: {
      type: String,
      enum: ["high", "medium", "low"],
      default: "high",
    },
    league: {
      activeSeasonSlug: { type: String, default: "2026-27" },
      registrationOpen: { type: Boolean, default: true },
      teamsPerDivisionCapacity: { type: Number, default: 8 },
      timezone: { type: String, default: "America/New_York" },
      firstTeamFeeCents: { type: Number, default: 20000 },
      additionalTeamFeeCents: { type: Number, default: 15000 },
      eligibilityHtml: { type: String, default: "" },
      mountiesPhilosophyHtml: { type: String, default: "" },
      aboutHtml: { type: String, default: "" },
      nfhsStreamUrl: {
        type: String,
        default:
          "https://www.nfhsnetwork.com/schools/philipsburg-osceola-area-high-school-philipsburg-pa",
      },
      gearStoreUrl: { type: String, default: "" },
      gearStoreDescription: { type: String, default: "" },
      leaguePaymentInstructions: { type: String, default: "" },
      notificationEmails: { type: [String], default: [] },
      standingsIncludedGameTypes: { type: [String], default: [] },
    },
    navigation: {
      items: [
        {
          label: String,
          href: String,
          children: [{ label: String, href: String }],
        },
      ],
    },
    footer: {
      copy: { type: String, default: "" },
      extraLinks: [{ label: String, href: String }],
    },
    seo: {
      defaultTitle: { type: String, default: "P-O Select Elementary Basketball League" },
      defaultDescription: { type: String, default: "" },
      canonicalDomain: { type: String, default: "" },
    },
    sourceNotes: {
      sponsorDeadlineReview: {
        type: String,
        default: "PDF lists September 29, 2027 deadline — needs owner review.",
      },
      taxIdPrivate: {
        type: String,
        default: "P-O LLB Federal Tax ID 90-1673993 — verify before publishing.",
      },
      stateChampionshipDraft: { type: String, default: "" },
    },
  },
  { timestamps: true },
);

export type SiteSettingsDoc = InferSchemaType<typeof siteSettingsSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const SiteSettings: Model<SiteSettingsDoc> =
  mongoose.models.SiteSettings ??
  mongoose.model<SiteSettingsDoc>("SiteSettings", siteSettingsSchema);
