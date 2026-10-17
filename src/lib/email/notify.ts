import { isSmtpConfigured } from "@/lib/env";
import {
  getDefaultReplyTo,
  getMailFromAddress,
  getMailTransporter,
} from "@/lib/email/transporter";

export async function sendNotificationEmail(options: {
  to: string[];
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}): Promise<{ sent: boolean; error?: string }> {
  if (!isSmtpConfigured()) {
    return { sent: false, error: "SMTP not configured" };
  }

  const to = options.to.map((e) => e.trim()).filter(Boolean);
  if (!to.length) {
    return { sent: false, error: "No recipients" };
  }

  try {
    const transporter = getMailTransporter();
    await transporter.sendMail({
      from: getMailFromAddress(),
      to: to.join(", "),
      replyTo: options.replyTo?.trim() || getDefaultReplyTo(),
      subject: options.subject,
      text: options.text,
      html: options.html ?? options.text.replace(/\n/g, "<br>\n"),
    });
    return { sent: true };
  } catch (e) {
    return {
      sent: false,
      error: e instanceof Error ? e.message : "Email failed",
    };
  }
}
