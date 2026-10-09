import mongoose from "mongoose";
import { connectMongoose } from "@/lib/db/mongoose";
import { Registration } from "@/models/Registration";
import { SiteSettings } from "@/models/SiteSettings";

export async function countAcceptedTeamsInDivision(
  seasonId: string,
  divisionId: string,
): Promise<number> {
  await connectMongoose();
  const regs = await Registration.find({
    seasonId,
    status: { $in: ["accepted", "submitted"] },
  });

  let count = 0;
  for (const reg of regs) {
    if (reg.status !== "accepted") continue;
    for (const team of reg.teams) {
      if (
        team.status === "accepted" &&
        team.divisionId?.toString() === divisionId
      ) {
        count += 1;
      }
    }
  }
  return count;
}

export async function acceptRegistrationTeams(
  registrationId: string,
  teamEntryIds: string[],
): Promise<{ ok: boolean; error?: string }> {
  await connectMongoose();
  const session = await mongoose.startSession();

  try {
    let result: { ok: boolean; error?: string } = { ok: true };
    await session.withTransaction(async () => {
      const settings = await SiteSettings.findOne({ key: "main" }).session(
        session,
      );
      const capacity = settings?.league?.teamsPerDivisionCapacity ?? 8;

      const reg = await Registration.findById(registrationId).session(session);
      if (!reg) {
        result = { ok: false, error: "Registration not found" };
        return;
      }

      for (const entryId of teamEntryIds) {
        const entry = reg.teams.id(entryId);
        if (!entry || !entry.divisionId) continue;

        const divisionId = entry.divisionId.toString();
        const accepted = await Registration.aggregate([
          { $match: { seasonId: reg.seasonId, status: "accepted" } },
          { $unwind: "$teams" },
          {
            $match: {
              "teams.status": "accepted",
              "teams.divisionId": entry.divisionId,
            },
          },
          { $count: "total" },
        ]).session(session);

        const current = accepted[0]?.total ?? 0;
        if (current >= capacity) {
          result = {
            ok: false,
            error: `Division capacity (${capacity}) reached.`,
          };
          throw new Error(result.error);
        }

        entry.status = "accepted";
      }

      const allAccepted = reg.teams.every((t) => t.status === "accepted");
      const anyAccepted = reg.teams.some((t) => t.status === "accepted");
      if (allAccepted) reg.status = "accepted";
      else if (anyAccepted) reg.status = "accepted";

      await reg.save({ session });
    });
    return result;
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Transaction failed",
    };
  } finally {
    session.endSession();
  }
}
