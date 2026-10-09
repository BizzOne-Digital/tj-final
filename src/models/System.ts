import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const auditLogSchema = new Schema(
  {
    actorId: { type: Schema.Types.ObjectId, ref: "AdminUser" },
    actorEmail: String,
    action: { type: String, required: true },
    resource: String,
    resourceId: String,
    metadata: Schema.Types.Mixed,
  },
  { timestamps: true },
);

export type AuditLogDoc = InferSchemaType<typeof auditLogSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const AuditLog: Model<AuditLogDoc> =
  mongoose.models.AuditLog ??
  mongoose.model<AuditLogDoc>("AuditLog", auditLogSchema);

const rateLimitSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    count: { type: Number, default: 0 },
    resetAt: { type: Date, required: true },
  },
  { timestamps: true },
);

export type RateLimitDoc = InferSchemaType<typeof rateLimitSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const RateLimit: Model<RateLimitDoc> =
  mongoose.models.RateLimit ??
  mongoose.model<RateLimitDoc>("RateLimit", rateLimitSchema);

const centralPaLionsSchema = new Schema(
  {
    key: { type: String, unique: true, default: "main" },
    bodyHtml: { type: String, default: "" },
    websiteUrl: { type: String, default: "https://www.tjcentralpalions.com" },
    storeUrl: {
      type: String,
      default: "https://centralpalions.square.site/",
    },
    tryoutsHtml: { type: String, default: "" },
  },
  { timestamps: true },
);

export type CentralPaLionsDoc = InferSchemaType<
  typeof centralPaLionsSchema
> & {
  _id: mongoose.Types.ObjectId;
};

export const CentralPaLions: Model<CentralPaLionsDoc> =
  mongoose.models.CentralPaLions ??
  mongoose.model<CentralPaLionsDoc>("CentralPaLions", centralPaLionsSchema);
