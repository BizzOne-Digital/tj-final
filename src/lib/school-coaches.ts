/** Canonical coach lists for team contact sections (kept in sync with seed). */

export type CoachRef = string | { name: string; role?: string; email?: string };

export type SchoolCoachBlock = {
  divisionKey: "grades-3-4" | "grades-5-6";
  coaches: CoachRef[];
};

const DIVISION_LABELS: Record<SchoolCoachBlock["divisionKey"], string> = {
  "grades-3-4": "Grades 3-4",
  "grades-5-6": "Grades 5-6",
};

/** Schools where contact coaches are pinned in code until DB seed is refreshed. */
export const SCHOOL_COACH_BLOCKS: Partial<Record<string, SchoolCoachBlock[]>> = {
  "bellwood-antis": [
    {
      divisionKey: "grades-5-6",
      coaches: ["Aaron Gray"],
    },
    {
      divisionKey: "grades-3-4",
      coaches: [{ name: "Doug Brown", role: "3-4th Grade" }],
    },
  ],
  clearfield: [
    {
      divisionKey: "grades-5-6",
      coaches: ["Jimmy Thompson"],
    },
  ],
  "mifflin-county": [
    {
      divisionKey: "grades-3-4",
      coaches: [
        { name: "Mike Smith", role: "4th Grade" },
        { name: "Josh Yoder", role: "4th Grade Purple" },
      ],
    },
  ],
};

export function contactCoachLinesFromConfig(schoolSlug: string) {
  const blocks = SCHOOL_COACH_BLOCKS[schoolSlug];
  if (!blocks?.length) return null;

  return blocks.flatMap((block) => {
    const divisionDefault = DIVISION_LABELS[block.divisionKey];
    return block.coaches.map((c) => {
      if (typeof c === "string") {
        return { name: c, division: divisionDefault, email: "" };
      }
      return {
        name: c.name,
        division: c.role?.trim() ? c.role : divisionDefault,
        email: c.email?.trim() ?? "",
      };
    });
  });
}
