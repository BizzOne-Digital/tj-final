import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/session";
import { getSmtpSetupStatus, isSmtpConfigured } from "@/lib/env";
import { sendNotificationEmail } from "@/lib/email/notify";
import { verifySmtpConnection } from "@/lib/email/transporter";

const bodySchema = z.object({
  to: z.string().email().optional(),
});

export async function GET() {
  const auth = await requireAdmin("brand");
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  const status = getSmtpSetupStatus();
  if (!status.configured) {
    return NextResponse.json({
      configured: false,
      missing: status.missing,
      verified: false,
    });
  }

  const verified = await verifySmtpConnection();
  return NextResponse.json({
    configured: true,
    missing: [],
    verified: verified.ok,
    verifyError: verified.ok ? undefined : verified.error,
  });
}

export async function POST(request: Request) {
  const auth = await requireAdmin("brand");
  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  if (!isSmtpConfigured()) {
    const status = getSmtpSetupStatus();
    return NextResponse.json(
      { error: "SMTP not configured", missing: status.missing },
      { status: 503 },
    );
  }

  const body = await request.json().catch(() => ({}));
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const to = parsed.data.to ?? auth.email;
  if (!to) {
    return NextResponse.json({ error: "No recipient email" }, { status: 400 });
  }

  const verify = await verifySmtpConnection();
  if (!verify.ok) {
    return NextResponse.json({ error: verify.error }, { status: 502 });
  }

  const result = await sendNotificationEmail({
    to: [to],
    subject: "[P-O Select] SMTP test",
    text: "This is a test message from the P-O Select League site. Registration notifications use the same SMTP settings.",
  });

  if (!result.sent) {
    return NextResponse.json({ error: result.error ?? "Send failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true, sentTo: to });
}
