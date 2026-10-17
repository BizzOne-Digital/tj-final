import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { mediaRefSchema } from "./shared";

const pageSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    heroTitle: String,
    heroSubtitle: String,
    bodyHtml: { type: String, default: "" },
    sections: { type: Schema.Types.Mixed, default: [] },
    seo: {
      title: String,
      description: String,
      ogImage: mediaRefSchema,
    },
    publicationStatus: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },
  },
  { timestamps: true },
);

export type PageDoc = InferSchemaType<typeof pageSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Page: Model<PageDoc> =
  mongoose.models.Page ?? mongoose.model<PageDoc>("Page", pageSchema);

const blogPostSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: String,
    contentHtml: { type: String, default: "" },
    coverImage: mediaRefSchema,
    categories: [String],
    authorName: String,
    featured: { type: Boolean, default: false },
    publishedAt: Date,
    publicationStatus: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    seo: { title: String, description: String },
  },
  { timestamps: true },
);

export type BlogPostDoc = InferSchemaType<typeof blogPostSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const BlogPost: Model<BlogPostDoc> =
  mongoose.models.BlogPost ??
  mongoose.model<BlogPostDoc>("BlogPost", blogPostSchema);

const faqSchema = new Schema(
  {
    question: { type: String, required: true },
    answerHtml: { type: String, required: true },
    category: { type: String, default: "General" },
    sortOrder: { type: Number, default: 0 },
    publicationStatus: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },
  },
  { timestamps: true },
);

export type FAQDoc = InferSchemaType<typeof faqSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const FAQ: Model<FAQDoc> =
  mongoose.models.FAQ ?? mongoose.model<FAQDoc>("FAQ", faqSchema);

const testimonialSchema = new Schema(
  {
    displayName: String,
    role: String,
    quote: String,
    rating: Number,
    featuredOrder: Number,
    isDesignPlaceholder: { type: Boolean, default: false },
    publicationStatus: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
  },
  { timestamps: true },
);

export type TestimonialDoc = InferSchemaType<typeof testimonialSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Testimonial: Model<TestimonialDoc> =
  mongoose.models.Testimonial ??
  mongoose.model<TestimonialDoc>("Testimonial", testimonialSchema);

const staffMemberSchema = new Schema(
  {
    name: { type: String, required: true },
    roles: [String],
    bioHtml: String,
    photo: mediaRefSchema,
    email: String,
    phone: String,
    sortOrder: { type: Number, default: 0 },
    publicationStatus: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },
    stableKey: { type: String, unique: true, sparse: true },
  },
  { timestamps: true },
);

export type StaffMemberDoc = InferSchemaType<typeof staffMemberSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const StaffMember: Model<StaffMemberDoc> =
  mongoose.models.StaffMember ??
  mongoose.model<StaffMemberDoc>("StaffMember", staffMemberSchema);
