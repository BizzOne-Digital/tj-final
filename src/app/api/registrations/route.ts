import { NextResponse } from "next/server";
import { registrationSchema } from "@/validators/registration";
import { checkRateLimit } from "@/lib/rate-limit";
import { connectMongoose } from "@/lib/db/mongoose";
import { Registration } from "@/models/Registration";
import { Season, Division } from "@/models/Season";
import { SiteSettings } from "@/models/SiteSettings";
import {
  getSmtpSetupStatus,
  isDatabaseConfigured,
  isSmtpConfigured,
} from "@/lib/env";
import { calculateRegistrationTotalCents } from "@/lib/fee-calculator";
import { getLeagueNotificationRecipients } from "@/lib/email/recipients";
import { sendRegistrationEmails } from "@/lib/email/registration-mails";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "anonymous";
  const rate = await checkRateLimit(`registration:${ip}`, 5, 60 * 60 * 1000);
  if (!rate.allowed) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  const body = await request.json();
  const parsed = registrationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "Registration is unavailable until the database is configured." },
      { status: 503 },
    );
  }

  await connectMongoose();
  const season = await Season.findOne({ slug: parsed.data.seasonSlug });
  if (!season) {
    return NextResponse.json({ error: "Invalid season." }, { status: 400 });
  }

  const settings = await SiteSettings.findOne({ key: "main" });
  const firstCents = settings?.league?.firstTeamFeeCents ?? 20000;
  const addCents = settings?.league?.additionalTeamFeeCents ?? 15000;
  const totalCents = calculateRegistrationTotalCents(
    parsed.data.teams.length,
    firstCents,
    addCents,
  );

  const teamDocs = [];
  for (const t of parsed.data.teams) {
    const division = await Division.findOne({
      seasonId: season._id,
      key: t.divisionKey,
    });
    if (!division) {
      return NextResponse.json(
        { error: `Invalid division: ${t.divisionKey}` },
        { status: 400 },
      );
    }
    teamDocs.push({
      teamName: t.teamName,
      divisionKey: t.divisionKey,
      divisionId: division._id,
      status: "submitted",
    });
  }

  const registration = await Registration.create({
    schoolName: parsed.data.schoolName,
    contactName: parsed.data.contactName,
    contactEmail: parsed.data.contactEmail,
    contactPhone: parsed.data.contactPhone,
    seasonId: season._id,
    seasonSlug: parsed.data.seasonSlug,
    teams: teamDocs,
    notes: parsed.data.notes,
    eligibilityAcknowledged: true,
    formsAcknowledged: true,
    priceSnapshot: {
      firstTeamCents: firstCents,
      additionalTeamCents: addCents,
      totalCents,
      teamCount: parsed.data.teams.length,
    },
    notificationStatus: {},
  });

  const recipients = getLeagueNotificationRecipients(settings);
  const smtpReady = isSmtpConfigured();
  const mailPayload = {
    schoolName: parsed.data.schoolName,
    contactName: parsed.data.contactName,
    contactEmail: parsed.data.contactEmail,
    contactPhone: parsed.data.contactPhone,
    seasonSlug: parsed.data.seasonSlug,
    teams: parsed.data.teams,
    notes: parsed.data.notes,
    totalCents,
    registrationId: registration._id.toString(),
  };

  let adminSent = false;
  let confirmationSent = false;
  const errors: string[] = [];

  if (smtpReady) {
    const mail = await sendRegistrationEmails(recipients, mailPayload);
    adminSent = mail.admin.sent;
    confirmationSent = mail.confirmation.sent;
    if (mail.admin.error) errors.push(`Admin: ${mail.admin.error}`);
    if (mail.confirmation.error) errors.push(`Confirmation: ${mail.confirmation.error}`);
  } else {
    const { missing } = getSmtpSetupStatus();
    errors.push(`SMTP not configured (${missing.join(", ")})`);
  }

  registration.notificationStatus = {
    emailAttempted: smtpReady,
    emailSent: adminSent,
    confirmationSent,
    lastError: errors.length ? errors.join("; ") : undefined,
  };
  await registration.save();

  const baseMessage =
    "Your registration request was submitted. Payment and seat confirmation are handled separately by league staff.";
  const message = confirmationSent
    ? `${baseMessage} A confirmation email was sent to ${parsed.data.contactEmail}.`
    : smtpReady
      ? baseMessage
      : `${baseMessage} (Email notifications are not configured on the server yet — the league still received your request in the admin panel.)`;

  return NextResponse.json({
    ok: true,
    id: registration._id.toString(),
    totalCents,
    message,
    smtpConfigured: smtpReady,
    adminNotified: adminSent || undefined,
    confirmationEmailSent: confirmationSent || undefined,
  });
}
