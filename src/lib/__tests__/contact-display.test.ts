import { describe, expect, it } from "vitest";
import { isPlaceholderText, shouldShowFacebook } from "@/lib/contact-display";

describe("contact-display", () => {
  it("treats URL pending as placeholder", () => {
    expect(isPlaceholderText("(URL pending)")).toBe(true);
    expect(shouldShowFacebook({ facebookPageName: "(URL pending)" })).toBe(false);
  });

  it("shows facebook when URL is set", () => {
    expect(
      shouldShowFacebook({
        facebookPageName: "(URL pending)",
        facebookUrl: "https://facebook.com/example",
      }),
    ).toBe(true);
  });

  it("shows facebook when page name is real", () => {
    expect(
      shouldShowFacebook({ facebookPageName: "PO Mounties Select League" }),
    ).toBe(true);
  });
});
