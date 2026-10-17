import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const seasonSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    label: { type: String, required: true },
    status: {
      type: String,
      enum: ["current", "future", "archive"],
      default: "future",
    },
    startYear: Number,
    endYear: Number,
    registrationOpen: Boolean,
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export type SeasonDoc = InferSchemaType<typeof seasonSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Season: Model<SeasonDoc> =
  mongoose.models.Season ?? mongoose.model<SeasonDoc>("Season", seasonSchema);

const divisionSchema = new Schema(
  {
    seasonId: {
      type: Schema.Types.ObjectId,
      ref: "Season",
      required: true,
      index: true,
    },
    key: { type: String, required: true },
    displayName: { type: String, required: true },
    archiveLabel: { type: String, required: true },
    championshipDate: Date,
    leagueDayStartTime: String,
    leagueDayWeekday: String,
  },
  { timestamps: true },
);

divisionSchema.index({ seasonId: 1, key: 1 }, { unique: true });

export type DivisionDoc = InferSchemaType<typeof divisionSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Division: Model<DivisionDoc> =
  mongoose.models.Division ??
  mongoose.model<DivisionDoc>("Division", divisionSchema);
