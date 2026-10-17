import { formatUsdFromCents } from "@/lib/fee-calculator";
import { sendNotificationEmail } from "@/lib/email/notify";

const DIVISION_LABEL: Record<string, string> = {
  "grades-3-4": "Grades 3–4",
  "grades-5-6": "Grades 5–6",
};

export type RegistrationMailPayload = {
  schoolName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  seasonSlug: string;
  teams: { teamName: string; divisionKey: string }[];
  notes?: string;
  totalCents: number;
  registrationId: string;
};

function teamLines(teams: RegistrationMailPayload["teams"]): string {
  return teams
    .map(
      (t, i) =>
        `  ${i + 1}. ${t.teamName} (${DIVISION_LABEL[t.divisionKey] ?? t.divisionKey})`,
    )
    .join("\n");
}

function adminText(p: RegistrationMailPayload): string {
  const lines = [
    `New team registration request (${p.seasonSlug})`,
    ``,
    `School / organization: ${p.schoolName}`,
    `Contact: ${p.contactName}`,
    `Email: ${p.contactEmail}`,
    `Phone: ${p.contactPhone}`,
    ``,
    `Teams (${p.teams.length}):`,
    teamLines(p.teams),
    ``,
    `Estimated total (snapshot): ${formatUsdFromCents(p.totalCents)}`,
  ];
  if (p.notes?.trim()) {
    lines.push(``, `Notes:`, p.notes.trim());
  }
  lines.push(``, `Registration ID: ${p.registrationId}`);
  return lines.join("\n");
}

function confirmationText(p: RegistrationMailPayload): string {
  return [
    `Hi ${p.contactName},`,
    ``,
    `Thank you for submitting a team registration request for the P-O Select Elementary Basketball League (${p.seasonSlug}).`,
    ``,
    `We received your request for ${p.schoolName} with ${p.teams.length} team(s):`,
    teamLines(p.teams),
    ``,
    `Estimated total at submission: ${formatUsdFromCents(p.totalCents)}`,
    ``,
    `League staff will follow up about payment and seat confirmation. Required yearly forms must be completed before play.`,
    ``,
    `If you need to make a correction, reply to this email or contact the league office.`,
    ``,
    `— P-O Select League`,
  ].join("\n");
}

function wrapHtml(body: string): string {
  const escaped = body
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;line-height:1.5;color:#111"><pre style="white-space:pre-wrap;font-family:inherit">${escaped}</pre></body></html>`;
}

export async function sendRegistrationEmails(
  adminRecipients: string[],
  payload: RegistrationMailPayload,
): Promise<{
  admin: { sent: boolean; error?: string };
  confirmation: { sent: boolean; error?: string };
}> {
  const adminResult = adminRecipients.length
    ? await sendNotificationEmail({
        to: adminRecipients,
        subject: `[P-O Select] New team registration: ${payload.schoolName}`,
        text: adminText(payload),
        html: wrapHtml(adminText(payload)),
        replyTo: payload.contactEmail,
      })
    : { sent: false, error: "No notification recipients configured" };

  const confirmResult = await sendNotificationEmail({
    to: [payload.contactEmail],
    subject: `P-O Select League — registration received (${payload.seasonSlug})`,
    text: confirmationText(payload),
    html: wrapHtml(confirmationText(payload)),
  });

  return {
    admin: adminResult,
    confirmation: confirmResult,
  };
}
