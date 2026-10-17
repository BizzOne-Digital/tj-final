"use client";

import { useEffect, useState } from "react";

type Status = {
  configured: boolean;
  missing: string[];
  verified?: boolean;
  verifyError?: string;
};

export function EmailSmtpPanel({
  notificationEmails,
  onNotificationEmailsChange,
}: {
  notificationEmails: string;
  onNotificationEmailsChange: (value: string) => void;
}) {
  const [status, setStatus] = useState<Status | null>(null);
  const [testing, setTesting] = useState(false);
  const [testMessage, setTestMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/email/test")
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => setStatus({ configured: false, missing: ["unknown"] }));
  }, []);

  async function sendTest() {
    setTesting(true);
    setTestMessage("");
    const res = await fetch("/api/admin/email/test", { method: "POST" });
    const data = await res.json();
    setTesting(false);
    if (res.ok) {
      setTestMessage(`Test email sent to ${data.sentTo}.`);
    } else {
      setTestMessage(data.error ?? "Test failed.");
    }
  }

  return (
    <div className="mt-10 max-w-2xl rounded-xl border border-slate-200 bg-slate-50 p-6">
      <h2 className="text-lg font-semibold text-slate-900">Email (SMTP)</h2>
      <p className="mt-1 text-sm text-slate-600">
        Registration and contact forms send mail using{" "}
        <code className="text-xs">SMTP_*</code> variables in your server{" "}
        <code className="text-xs">.env</code> file. Restart{" "}
        <code className="text-xs">npm run dev</code> after changing them.
      </p>

      {status && (
        <ul className="mt-4 space-y-1 text-sm">
          <li>
            SMTP env:{" "}
            <span className={status.configured ? "text-green-700" : "text-amber-700"}>
              {status.configured ? "Configured" : `Missing: ${status.missing.join(", ")}`}
            </span>
          </li>
          {status.configured && (
            <li>
              Server connection:{" "}
              <span className={status.verified ? "text-green-700" : "text-red-700"}>
                {status.verified ? "OK" : status.verifyError ?? "Failed"}
              </span>
            </li>
          )}
        </ul>
      )}

      <label className="mt-4 block text-sm">
        Registration notification inboxes (comma-separated)
        <input
          className="mt-1 w-full rounded border px-3 py-2"
          placeholder="league@example.com, admin@example.com"
          value={notificationEmails}
          onChange={(e) => onNotificationEmailsChange(e.target.value)}
        />
        <span className="mt-1 block text-xs text-slate-500">
          If empty, uses <code>ADMIN_EMAIL</code> from .env, then program / primary contact emails.
        </span>
      </label>

      <button
        type="button"
        disabled={testing || !status?.configured}
        onClick={sendTest}
        className="mt-4 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium disabled:opacity-50"
      >
        {testing ? "Sending…" : "Send test email to my admin account"}
      </button>
      {testMessage && <p className="mt-2 text-sm text-slate-700">{testMessage}</p>}
    </div>
  );
}
