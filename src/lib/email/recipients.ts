type SettingsSlice = {
  league?: { notificationEmails?: string[] } | null;
  contact?: { primaryEmail?: string; programEmail?: string } | null;
} | null;

function uniqEmails(list: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of list) {
    const email = raw?.trim().toLowerCase();
    if (!email || seen.has(email)) continue;
    seen.add(email);
    out.push(raw.trim());
  }
  return out;
}

/** League staff inboxes for registration/contact alerts. */
export function getLeagueNotificationRecipients(settings: SettingsSlice): string[] {
  const fromCms = settings?.league?.notificationEmails?.filter(Boolean) ?? [];
  if (fromCms.length) return uniqEmails(fromCms);

  const admin = process.env.ADMIN_EMAIL?.trim();
  if (admin) return uniqEmails([admin]);

  return uniqEmails(
    [settings?.contact?.programEmail, settings?.contact?.primaryEmail].filter(
      Boolean,
    ) as string[],
  );
}
