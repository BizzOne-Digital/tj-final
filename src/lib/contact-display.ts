/** Hide CMS placeholders like "(URL pending)" on the public site. */
export function isPlaceholderText(value?: string | null): boolean {
  if (!value?.trim()) return true;
  const n = value.trim().toLowerCase();
  return (
    n.includes("url pending") ||
    n === "pending" ||
    n === "tbd" ||
    n === "n/a" ||
    n === "na"
  );
}

export function shouldShowFacebook(contact: {
  facebookUrl?: string;
  facebookPageName?: string;
}): boolean {
  if (contact.facebookUrl?.trim()) return true;
  return !isPlaceholderText(contact.facebookPageName);
}

export function facebookDisplayName(facebookPageName?: string): string {
  if (isPlaceholderText(facebookPageName)) return "Facebook";
  return facebookPageName!.trim();
}
