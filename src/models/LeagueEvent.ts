import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const leagueEventSchema = new Schema(
  {
    seasonId: { type: Schema.Types.ObjectId, ref: "Season", required: true },
    divisionId: { type: Schema.Types.ObjectId, ref: "Division" },
    stableKey: { type: String, unique: true, sparse: true },
    title: { type: String, required: true },
    eventType: {
      type: String,
      enum: ["league-day", "all-star", "picture-day", "other"],
      default: "league-day",
    },
    startsAt: { type: Date, required: true },
    endsAt: Date,
    venueName: String,
    venueAddress: String,
    notes: String,
    publicationStatus: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },
  },
  { timestamps: true },
);

export type LeagueEventDoc = InferSchemaType<typeof leagueEventSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const LeagueEvent: Model<LeagueEventDoc> =
  mongoose.models.LeagueEvent ??
  mongoose.model<LeagueEventDoc>("LeagueEvent", leagueEventSchema);

const gameSchema = new Schema(
  {
    seasonId: { type: Schema.Types.ObjectId, ref: "Season", required: true },
    divisionId: { type: Schema.Types.ObjectId, ref: "Division", required: true },
    weekLabel: String,
    weekSort: Number,
    homeTeamId: { type: Schema.Types.ObjectId, ref: "SeasonTeam" },
    awayTeamId: { type: Schema.Types.ObjectId, ref: "SeasonTeam" },
    startsAt: Date,
    venueName: String,
    venueAddress: String,
    gameType: {
      type: String,
      enum: [
        "regular",
        "playoff",
        "all-star",
        "exhibition",
        "championship",
      ],
      default: "regular",
    },
    status: {
      type: String,
      enum: ["scheduled", "live", "postponed", "cancelled", "final"],
      default: "scheduled",
    },
    publicationStatus: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    homeScore: Number,
    awayScore: Number,
    streamUrl: String,
    notes: String,
    includeInStandings: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export type GameDoc = InferSchemaType<typeof gameSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Game: Model<GameDoc> =
  mongoose.models.Game ?? mongoose.model<GameDoc>("Game", gameSchema);
