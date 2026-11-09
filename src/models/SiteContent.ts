import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

/**
 * One document per editable field. `key` is `<page>.<field>` (see lib/cms/registry.ts).
 * A missing document means "use the built-in default".
 */
const siteContentSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    kind: {
      type: String,
      enum: ["text", "textarea", "html", "url", "image", "images"],
      required: true,
    },
    value: { type: Schema.Types.Mixed, default: "" },
    updatedBy: String,
  },
  { timestamps: true, minimize: false },
);

export type SiteContentDoc = InferSchemaType<typeof siteContentSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const SiteContent: Model<SiteContentDoc> =
  mongoose.models.SiteContent ??
  mongoose.model<SiteContentDoc>("SiteContent", siteContentSchema);
