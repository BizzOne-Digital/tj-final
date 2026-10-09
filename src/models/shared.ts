import { Schema } from "mongoose";

export const mediaRefSchema = new Schema(
  {
    url: { type: String, required: true },
    alt: String,
    publicId: String,
    focalX: { type: Number, default: 0.5 },
    focalY: { type: Number, default: 0.5 },
    objectFit: { type: String, enum: ["cover", "contain"], default: "cover" },
  },
  { _id: false },
);

export type PublicationStatus = "draft" | "published" | "archived";
