import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

/**
 * Binary image storage in MongoDB so uploads survive redeploys on read-only
 * serverless hosts (Vercel). Only the public URL is stored on content documents.
 */
const storedUploadSchema = new Schema(
  {
    folder: { type: String, required: true },
    filename: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    data: { type: Buffer, required: true },
  },
  { timestamps: true },
);

storedUploadSchema.index({ folder: 1, filename: 1 }, { unique: true });

export type StoredUploadDoc = InferSchemaType<typeof storedUploadSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const StoredUpload: Model<StoredUploadDoc> =
  mongoose.models.StoredUpload ??
  mongoose.model<StoredUploadDoc>("StoredUpload", storedUploadSchema);
