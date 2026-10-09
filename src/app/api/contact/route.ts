import { NextResponse } from "next/server";
import { contactSchema } from "@/validators/registration";
import { checkRateLimit } from "@/lib/rate-limit";
import { connectMongoose } from "@/lib/db/mongoose";
import { ContactMessage } from "@/models/Sponsor";
import { SiteSettings } from "@/models/SiteSettings";
import { isDatabaseConfigured } from "@/lib/env";
import { getLeagueNotificationRecipients } from "@/lib/email/recipients";
import { sendNotificationEmail } from "@/lib/email/notify";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "anonymous";
  const rate = await checkRateLimit(`contact:${ip}`, 8, 60 * 60 * 1000);
  if (!rate.allowed) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  const body = await request.json();
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "Submissions are unavailable until the database is configured." },
      { status: 503 },
    );
  }

  await connectMongoose();
  const message = await ContactMessage.create({
    ...parsed.data,
    notificationStatus: {},
  });

  const settings = await SiteSettings.findOne({ key: "main" }).lean();
  const recipients = getLeagueNotificationRecipients(settings);

  let emailSent = false;
  let lastError: string | undefined;
  if (recipients.length) {
    const result = await sendNotificationEmail({
      to: recipients,
      subject: `[P-O Select] Contact: ${parsed.data.subject}`,
      text: `From: ${parsed.data.name} <${parsed.data.email}>\n\n${parsed.data.message}`,
      replyTo: parsed.data.email,
    });
    emailSent = result.sent;
    lastError = result.error;
  }

  message.notificationStatus = {
    emailAttempted: recipients.length > 0,
    emailSent,
    lastError,
  };
  await message.save();

  return NextResponse.json({
    ok: true,
    id: message._id.toString(),
    emailSent: emailSent || undefined,
    emailConfigured: recipients.length > 0 && emailSent,
  });
}
