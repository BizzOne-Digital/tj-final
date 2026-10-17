import { describe, expect, it } from "vitest";
import { calculateRegistrationTotalCents } from "@/lib/fee-calculator";

describe("calculateRegistrationTotalCents", () => {
  it("charges 20000 for one team", () => {
    expect(calculateRegistrationTotalCents(1, 20000, 15000)).toBe(20000);
  });
  it("charges 35000 for two teams", () => {
    expect(calculateRegistrationTotalCents(2, 20000, 15000)).toBe(35000);
  });
  it("charges 50000 for three teams", () => {
    expect(calculateRegistrationTotalCents(3, 20000, 15000)).toBe(50000);
  });
});
