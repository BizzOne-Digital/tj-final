import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { mediaRefSchema } from "./shared";

const schoolProgramSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    tabAlias: String,
    programLink: String,
    overviewHtml: { type: String, default: "" },
    logo: mediaRefSchema,
    banner: mediaRefSchema,
    primaryColor: String,
    sortOrder: { type: Number, default: 0 },
    stableKey: { type: String, unique: true, sparse: true },
  },
  { timestamps: true },
);

export type SchoolProgramDoc = InferSchemaType<typeof schoolProgramSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const SchoolProgram: Model<SchoolProgramDoc> =
  mongoose.models.SchoolProgram ??
  mongoose.model<SchoolProgramDoc>("SchoolProgram", schoolProgramSchema);

const seasonTeamSchema = new Schema(
  {
    seasonId: {
      type: Schema.Types.ObjectId,
      ref: "Season",
      required: true,
      index: true,
    },
    schoolId: {
      type: Schema.Types.ObjectId,
      ref: "SchoolProgram",
      required: true,
      index: true,
    },
    divisionId: {
      type: Schema.Types.ObjectId,
      ref: "Division",
      required: true,
      index: true,
    },
    teamSlug: { type: String, required: true },
    teamName: { type: String, required: true },
    coaches: [{ name: String, role: String, email: String }],
    overviewHtml: String,
    photos: [mediaRefSchema],
    publicationStatus: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "published",
    },
    registrationStatus: {
      type: String,
      enum: ["placeholder", "accepted", "waitlisted"],
      default: "placeholder",
    },
    weeklyLinks: [{ weekLabel: String, url: String, notes: String }],
  },
  { timestamps: true },
);

seasonTeamSchema.index(
  { seasonId: 1, teamSlug: 1 },
  { unique: true },
);

export type SeasonTeamDoc = InferSchemaType<typeof seasonTeamSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const SeasonTeam: Model<SeasonTeamDoc> =
  mongoose.models.SeasonTeam ??
  mongoose.model<SeasonTeamDoc>("SeasonTeam", seasonTeamSchema);
