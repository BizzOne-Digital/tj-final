import { z } from "zod";

const serverSchema = z.object({
  MONGODB_URI: z.string().optional(),
  MONGODB_DB_NAME: z.string().default("po_select_league"),
  AUTH_SECRET: z.string().optional(),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  CLOUDINARY_UPLOAD_PRESET: z.string().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_SECURE: z
    .string()
    .optional()
    .transform((v) => v === "true"),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().optional(),
  SMTP_FROM_NAME: z.string().optional(),
  SMTP_REPLY_TO: z.string().optional(),
  ADMIN_EMAIL: z.string().optional(),
});

const clientSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
});

export function getServerEnv() {
  return serverSchema.parse(process.env);
}

export function getClientEnv() {
  return clientSchema.parse({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  });
}

export function isDatabaseConfigured(): boolean {
  const uri = process.env.MONGODB_URI;
  return Boolean(uri && uri.length > 10);
}

export function isAuthConfigured(): boolean {
  return Boolean(process.env.AUTH_SECRET && process.env.AUTH_SECRET.length >= 16);
}

export function isCloudinaryConfigured(): boolean {
  const e = getServerEnv();
  return Boolean(
    e.CLOUDINARY_CLOUD_NAME &&
      e.CLOUDINARY_API_KEY &&
      e.CLOUDINARY_API_SECRET &&
      e.CLOUDINARY_UPLOAD_PRESET,
  );
}

export function getSmtpSetupStatus(): {
  configured: boolean;
  missing: string[];
} {
  const e = getServerEnv();
  const missing: string[] = [];

  if (!e.SMTP_HOST?.trim()) missing.push("SMTP_HOST");
  if (!e.SMTP_FROM?.trim()) missing.push("SMTP_FROM");

  const host = e.SMTP_HOST?.toLowerCase() ?? "";
  const isLocal =
    host === "localhost" || host === "127.0.0.1" || host === "mailpit";
  if (!isLocal) {
    if (!e.SMTP_USER?.trim()) missing.push("SMTP_USER");
    if (!e.SMTP_PASS?.trim()) missing.push("SMTP_PASS");
  }

  return { configured: missing.length === 0, missing };
}

export function isSmtpConfigured(): boolean {
  return getSmtpSetupStatus().configured;
}
