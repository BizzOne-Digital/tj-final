import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { mediaRefSchema } from "./shared";

const resourceSchema = new Schema(
  {
    stableKey: { type: String, unique: true, sparse: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, default: "forms" },
    description: String,
    externalUrl: String,
    document: mediaRefSchema,
    sortOrder: { type: Number, default: 0 },
    seasonSlugs: [String],
    requiredBeforeFirstGame: { type: Boolean, default: false },
    publicationStatus: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },
    adminFlags: {
      duplicateUrlNote: String,
      needsDocument: Boolean,
    },
  },
  { timestamps: true },
);

export type ResourceDoc = InferSchemaType<typeof resourceSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Resource: Model<ResourceDoc> =
  mongoose.models.Resource ??
  mongoose.model<ResourceDoc>("Resource", resourceSchema);
