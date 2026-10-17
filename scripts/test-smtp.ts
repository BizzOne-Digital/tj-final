import "dotenv/config";
import { getSmtpSetupStatus } from "../src/lib/env";
import { verifySmtpConnection } from "../src/lib/email/transporter";
import { sendNotificationEmail } from "../src/lib/email/notify";

async function main() {
  const status = getSmtpSetupStatus();
  if (!status.configured) {
    console.error("SMTP not configured. Missing:", status.missing.join(", "));
    process.exit(1);
  }

  const verify = await verifySmtpConnection();
  if (!verify.ok) {
    console.error("SMTP verify failed:", verify.error);
    process.exit(1);
  }
  console.log("SMTP connection: OK");

  const to = process.env.ADMIN_EMAIL?.trim() || process.env.SMTP_USER?.trim();
  if (!to) {
    console.error("Set ADMIN_EMAIL or SMTP_USER for test recipient.");
    process.exit(1);
  }

  const result = await sendNotificationEmail({
    to: [to],
    subject: "[P-O Select] SMTP test — contact & registration",
    text:
      "This is a test from the P-O Select League site.\n\n" +
      "Contact form and team registration notifications use these SMTP settings.",
  });

  if (!result.sent) {
    console.error("Send failed:", result.error);
    process.exit(1);
  }

  console.log(`Test email sent to ${to}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
