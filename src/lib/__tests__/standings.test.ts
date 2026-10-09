import { describe, expect, it } from "vitest";
import { computeStandings } from "@/lib/standings";

describe("computeStandings", () => {
  it("calculates wins from final regular games", () => {
    const teams = [
      { id: "a", name: "A", schoolSlug: "a" },
      { id: "b", name: "B", schoolSlug: "b" },
    ];
    const rows = computeStandings(teams, [
      {
        homeTeamId: "a",
        awayTeamId: "b",
        homeScore: 30,
        awayScore: 24,
        gameType: "regular",
        status: "final",
        includeInStandings: true,
      },
    ]);
    expect(rows.find((r) => r.teamId === "a")?.w).toBe(1);
    expect(rows.find((r) => r.teamId === "b")?.l).toBe(1);
  });

  it("excludes playoff games", () => {
    const teams = [
      { id: "a", name: "A", schoolSlug: "a" },
      { id: "b", name: "B", schoolSlug: "b" },
    ];
    const rows = computeStandings(teams, [
      {
        homeTeamId: "a",
        awayTeamId: "b",
        homeScore: 30,
        awayScore: 24,
        gameType: "playoff",
        status: "final",
        includeInStandings: true,
      },
    ]);
    expect(rows.every((r) => r.gp === 0)).toBe(true);
  });
});
