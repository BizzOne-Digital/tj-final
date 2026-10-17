import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { mediaRefSchema } from "./shared";

const sponsorTierSchema = new Schema(
  {
    stableKey: { type: String, unique: true, sparse: true },
    name: { type: String, required: true },
    amountCents: Number,
    descriptionHtml: String,
    benefitsHtml: String,
    sortOrder: { type: Number, default: 0 },
    publicationStatus: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },
  },
  { timestamps: true },
);

export type SponsorTierDoc = InferSchemaType<typeof sponsorTierSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const SponsorTier: Model<SponsorTierDoc> =
  mongoose.models.SponsorTier ??
  mongoose.model<SponsorTierDoc>("SponsorTier", sponsorTierSchema);

const sponsorSchema = new Schema(
  {
    name: { type: String, required: true },
    logo: mediaRefSchema,
    url: String,
    tierId: { type: Schema.Types.ObjectId, ref: "SponsorTier" },
    seasonSlug: String,
    sortOrder: { type: Number, default: 0 },
    publicationStatus: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },
  },
  { timestamps: true },
);

export type SponsorDoc = InferSchemaType<typeof sponsorSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Sponsor: Model<SponsorDoc> =
  mongoose.models.Sponsor ??
  mongoose.model<SponsorDoc>("Sponsor", sponsorSchema);

const sponsorInquirySchema = new Schema(
  {
    businessName: String,
    contactName: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    address: String,
    tierKey: String,
    donationAmountCents: Number,
    message: String,
    logoPending: mediaRefSchema,
    status: {
      type: String,
      enum: ["new", "reviewing", "closed"],
      default: "new",
    },
    internalNotes: String,
    notificationStatus: {
      emailAttempted: Boolean,
      emailSent: Boolean,
      lastError: String,
    },
  },
  { timestamps: true },
);

export type SponsorInquiryDoc = InferSchemaType<
  typeof sponsorInquirySchema
> & {
  _id: mongoose.Types.ObjectId;
};

export const SponsorInquiry: Model<SponsorInquiryDoc> =
  mongoose.models.SponsorInquiry ??
  mongoose.model<SponsorInquiryDoc>("SponsorInquiry", sponsorInquirySchema);

const contactMessageSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["new", "read", "archived"],
      default: "new",
    },
    notificationStatus: {
      emailAttempted: Boolean,
      emailSent: Boolean,
      lastError: String,
    },
  },
  { timestamps: true },
);

export type ContactMessageDoc = InferSchemaType<
  typeof contactMessageSchema
> & {
  _id: mongoose.Types.ObjectId;
};

export const ContactMessage: Model<ContactMessageDoc> =
  mongoose.models.ContactMessage ??
  mongoose.model<ContactMessageDoc>("ContactMessage", contactMessageSchema);
