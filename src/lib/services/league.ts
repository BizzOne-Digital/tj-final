import { connectMongoose } from "@/lib/db/mongoose";
import { isDatabaseConfigured } from "@/lib/env";
import { Season, Division } from "@/models/Season";
import { SchoolProgram, SeasonTeam } from "@/models/SchoolProgram";
import { LeagueEvent } from "@/models/LeagueEvent";
import { Resource } from "@/models/Resource";
import { Game } from "@/models/LeagueEvent";
import { FAQ, StaffMember, BlogPost, Page } from "@/models/Content";
import { Sponsor, SponsorTier } from "@/models/Sponsor";
import { previewSchools } from "@/lib/preview/fixtures";
import { LEAGUE_NEWS_ARTICLES, leagueNewsAsJsonDocs } from "@/lib/news-articles";

export type JsonDoc = Record<string, unknown>;

function serialize<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc));
}

export async function getActiveSeason() {
  if (!isDatabaseConfigured()) return { slug: "2026-27", label: "2026-27" };
  await connectMongoose();
  const settings = await import("@/models/SiteSettings").then((m) =>
    m.SiteSettings.findOne({ key: "main" }).lean(),
  );
  const slug = settings?.league?.activeSeasonSlug ?? "2026-27";
  const season = await Season.findOne({ slug }).lean();
  return season ? serialize(season) : { slug, label: slug };
}

export async function getSchools(): Promise<JsonDoc[]> {
  if (!isDatabaseConfigured()) return previewSchools as JsonDoc[];
  await connectMongoose();
  const schools = (await SchoolProgram.find().sort({ sortOrder: 1, name: 1 }).lean()) as JsonDoc[];
  const slugs = new Set(schools.map((s) => String(s.slug)));
  for (const p of previewSchools) {
    if (!slugs.has(p.slug)) schools.push(p as JsonDoc);
  }
  schools.sort((a, b) => String(a.name).localeCompare(String(b.name)));
  return serialize(schools) as JsonDoc[];
}

export async function getSchoolBySlug(slug: string) {
  if (!isDatabaseConfigured()) {
    return previewSchools.find((s) => s.slug === slug) ?? null;
  }
  await connectMongoose();
  const school = await SchoolProgram.findOne({ slug }).lean();
  return school ? serialize(school) : null;
}

export async function getDivisionsForSeason(seasonSlug: string): Promise<JsonDoc[]> {
  if (!isDatabaseConfigured()) return [];
  await connectMongoose();
  const season = await Season.findOne({ slug: seasonSlug }).lean();
  if (!season) return [];
  const divisions = await Division.find({ seasonId: season._id }).lean();
  return serialize(divisions) as JsonDoc[];
}

export async function getSeasonTeams(seasonSlug: string): Promise<JsonDoc[]> {
  if (!isDatabaseConfigured()) return [];
  await connectMongoose();
  const season = await Season.findOne({ slug: seasonSlug }).lean();
  if (!season) return [];
  const teams = await SeasonTeam.find({
    seasonId: season._id,
    publicationStatus: "published",
  })
    .populate("schoolId divisionId")
    .lean();
  return serialize(teams) as JsonDoc[];
}

export async function getNextLeagueEvent() {
  if (!isDatabaseConfigured()) return null;
  await connectMongoose();
  const now = new Date();
  const event = await LeagueEvent.findOne({
    publicationStatus: "published",
    startsAt: { $gte: now },
  })
    .sort({ startsAt: 1 })
    .populate("divisionId seasonId")
    .lean();
  return event ? serialize(event) : null;
}

export async function getPublishedResources(): Promise<JsonDoc[]> {
  if (!isDatabaseConfigured()) return [];
  await connectMongoose();
  const items = await Resource.find({ publicationStatus: "published" })
    .sort({ sortOrder: 1, title: 1 })
    .lean();
  return serialize(items) as JsonDoc[];
}

export async function getPublishedGames(filters: {
  seasonSlug?: string;
  divisionKey?: string;
}) {
  if (!isDatabaseConfigured()) return [];
  await connectMongoose();
  const query: Record<string, unknown> = { publicationStatus: "published" };
  if (filters.seasonSlug) {
    const season = await Season.findOne({ slug: filters.seasonSlug }).lean();
    if (season) query.seasonId = season._id;
  }
  if (filters.divisionKey && filters.seasonSlug) {
    const season = await Season.findOne({ slug: filters.seasonSlug }).lean();
    if (season) {
      const div = await Division.findOne({
        seasonId: season._id,
        key: filters.divisionKey,
      }).lean();
      if (div) query.divisionId = div._id;
    }
  }
  const games = await Game.find(query).sort({ startsAt: 1 }).lean();
  return serialize(games);
}

export async function getFaqs(): Promise<JsonDoc[]> {
  if (!isDatabaseConfigured()) return [];
  await connectMongoose();
  return serialize(
    await FAQ.find({ publicationStatus: "published" }).sort({ sortOrder: 1 }).lean(),
  ) as JsonDoc[];
}

export async function getStaff(): Promise<JsonDoc[]> {
  if (!isDatabaseConfigured()) return [];
  await connectMongoose();
  return serialize(
    await StaffMember.find({ publicationStatus: "published" })
      .sort({ sortOrder: 1 })
      .lean(),
  ) as JsonDoc[];
}

export async function getPublishedPosts(): Promise<JsonDoc[]> {
  if (!isDatabaseConfigured()) {
    return leagueNewsAsJsonDocs() as JsonDoc[];
  }
  await connectMongoose();
  const fromDb = await BlogPost.find({ publicationStatus: "published" })
    .sort({ publishedAt: -1 })
    .lean();
  if (fromDb.length > 0) {
    return serialize(fromDb) as JsonDoc[];
  }
  return leagueNewsAsJsonDocs() as JsonDoc[];
}

export async function getPostBySlug(slug: string) {
  const fallback = LEAGUE_NEWS_ARTICLES.find((p) => p.slug === slug);
  if (!isDatabaseConfigured()) {
    return fallback ? serialize(fallback) : null;
  }
  await connectMongoose();
  const post = await BlogPost.findOne({
    slug,
    publicationStatus: "published",
  }).lean();
  if (post) return serialize(post);
  return fallback ? serialize(fallback) : null;
}

export async function getPageBySlug(slug: string) {
  if (!isDatabaseConfigured()) return null;
  await connectMongoose();
  const page = await Page.findOne({
    slug,
    publicationStatus: "published",
  }).lean();
  return page ? serialize(page) : null;
}

export async function getSponsorTiers() {
  if (!isDatabaseConfigured()) return [];
  await connectMongoose();
  return serialize(
    await SponsorTier.find({ publicationStatus: "published" })
      .sort({ sortOrder: 1 })
      .lean(),
  );
}

export async function getPublishedSponsors() {
  if (!isDatabaseConfigured()) return [];
  await connectMongoose();
  return serialize(
    await Sponsor.find({ publicationStatus: "published" })
      .sort({ sortOrder: 1 })
      .lean(),
  );
}
