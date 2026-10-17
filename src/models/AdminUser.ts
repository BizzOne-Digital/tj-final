import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import type { AdminRole } from "@/types/roles";

const adminUserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ["owner", "editor"], default: "owner" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export type AdminUserDoc = InferSchemaType<typeof adminUserSchema> & {
  _id: mongoose.Types.ObjectId;
  role: AdminRole;
};

export const AdminUser: Model<AdminUserDoc> =
  mongoose.models.AdminUser ??
  mongoose.model<AdminUserDoc>("AdminUser", adminUserSchema);
