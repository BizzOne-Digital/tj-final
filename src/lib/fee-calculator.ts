/** Registration pricing in cents */
export function calculateRegistrationTotalCents(
  teamCount: number,
  firstTeamCents: number,
  additionalTeamCents: number,
): number {
  if (teamCount <= 0) return 0;
  if (teamCount === 1) return firstTeamCents;
  return firstTeamCents + (teamCount - 1) * additionalTeamCents;
}

export function formatUsdFromCents(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}
