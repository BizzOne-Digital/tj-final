import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import { getServerEnv } from "@/lib/env";

let cached: Transporter | null = null;

export function getMailFromAddress(): string {
  const env = getServerEnv();
  const from = env.SMTP_FROM?.trim() ?? "";
  const name = env.SMTP_FROM_NAME?.trim();
  if (name && from && !from.includes("<")) {
    return `"${name.replace(/"/g, "")}" <${from}>`;
  }
  return from;
}

export function getDefaultReplyTo(): string | undefined {
  const env = getServerEnv();
  const reply = env.SMTP_REPLY_TO?.trim();
  if (reply) return reply;
  return env.SMTP_USER?.trim() || undefined;
}

export function createMailTransporter(): Transporter {
  const env = getServerEnv();
  const port = env.SMTP_PORT ?? 587;
  const secure = env.SMTP_SECURE ?? port === 465;

  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port,
    secure,
    requireTLS: !secure && port === 587,
    auth: env.SMTP_USER
      ? { user: env.SMTP_USER, pass: env.SMTP_PASS ?? "" }
      : undefined,
  });
}

export function getMailTransporter(): Transporter {
  if (!cached) {
    cached = createMailTransporter();
  }
  return cached;
}

export async function verifySmtpConnection(): Promise<
  { ok: true } | { ok: false; error: string }
> {
  try {
    await getMailTransporter().verify();
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "SMTP verify failed",
    };
  }
}
