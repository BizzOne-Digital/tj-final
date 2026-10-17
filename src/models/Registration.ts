import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const registrationTeamEntrySchema = new Schema(
  {
    teamName: { type: String, required: true },
    divisionKey: { type: String, required: true },
    divisionId: { type: Schema.Types.ObjectId, ref: "Division" },
    status: {
      type: String,
      enum: ["submitted", "accepted", "waitlisted", "rejected", "cancelled"],
      default: "submitted",
    },
  },
  { _id: true },
);

const registrationSchema = new Schema(
  {
    schoolName: { type: String, required: true },
    contactName: { type: String, required: true },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String, required: true },
    seasonId: { type: Schema.Types.ObjectId, ref: "Season", required: true },
    seasonSlug: { type: String, required: true },
    teams: [registrationTeamEntrySchema],
    notes: String,
    eligibilityAcknowledged: { type: Boolean, required: true },
    formsAcknowledged: { type: Boolean, required: true },
    status: {
      type: String,
      enum: ["submitted", "accepted", "waitlisted", "rejected", "cancelled"],
      default: "submitted",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "pending", "paid", "refunded"],
      default: "unpaid",
    },
    paymentNotes: String,
    priceSnapshot: {
      firstTeamCents: Number,
      additionalTeamCents: Number,
      totalCents: Number,
      teamCount: Number,
    },
    notificationStatus: {
      emailAttempted: Boolean,
      emailSent: Boolean,
      confirmationSent: Boolean,
      lastError: String,
    },
  },
  { timestamps: true },
);

export type RegistrationDoc = InferSchemaType<typeof registrationSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Registration: Model<RegistrationDoc> =
  mongoose.models.Registration ??
  mongoose.model<RegistrationDoc>("Registration", registrationSchema);
