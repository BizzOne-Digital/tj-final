import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { getLeagueNotificationRecipients } from "@/lib/email/recipients";

describe("getLeagueNotificationRecipients", () => {
  const prev = process.env.ADMIN_EMAIL;

  afterEach(() => {
    process.env.ADMIN_EMAIL = prev;
  });

  it("prefers CMS notification emails", () => {
    process.env.ADMIN_EMAIL = "env@example.com";
    const list = getLeagueNotificationRecipients({
      league: { notificationEmails: ["league@example.com"] },
      contact: { primaryEmail: "primary@example.com" },
    });
    expect(list).toEqual(["league@example.com"]);
  });

  it("falls back to ADMIN_EMAIL", () => {
    process.env.ADMIN_EMAIL = "admin@example.com";
    const list = getLeagueNotificationRecipients({
      league: { notificationEmails: [] },
      contact: { primaryEmail: "primary@example.com" },
    });
    expect(list).toEqual(["admin@example.com"]);
  });

  beforeEach(() => {
    delete process.env.ADMIN_EMAIL;
  });

  it("falls back to contact emails", () => {
    const list = getLeagueNotificationRecipients({
      league: {},
      contact: {
        programEmail: "program@example.com",
        primaryEmail: "primary@example.com",
      },
    });
    expect(list).toEqual(["program@example.com", "primary@example.com"]);
  });
});
