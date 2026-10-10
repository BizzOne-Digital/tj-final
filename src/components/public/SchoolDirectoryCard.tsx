import Link from "next/link";
import { ContentImage } from "@/components/public/ContentImage";
import { schoolTeamImage } from "@/lib/drive-assets";
import type { JsonDoc } from "@/lib/services/league";

export function SchoolDirectoryCard({
  school,
  layout = "list",
}: {
  school: JsonDoc;
  /** `grid` — image on top (home / compact cards). `list` — side-by-side on sm+. */
  layout?: "list" | "grid";
}) {
  const slug = String(school.slug);
  const img = schoolTeamImage(slug);
  const stacked = layout === "grid";

  return (
    <li className="gradient-card gradient-card-hover min-w-0 overflow-hidden rounded-xl">
      <Link
        href={`/teams/${slug}`}
        className={`flex min-w-0 ${stacked ? "flex-col" : "min-h-[8.5rem] flex-col sm:flex-row sm:items-stretch"}`}
      >
        {img ? (
          <div
            className={`flex w-full shrink-0 items-stretch justify-center border-white/10 bg-[#020a18]/80 p-1 ${
              stacked
                ? "border-b"
                : "border-b p-1.5 sm:w-[14rem] sm:border-b-0 sm:border-r sm:p-2 md:w-[16rem]"
            }`}
          >
            <ContentImage
              src={img}
              alt={`${school.name} team`}
              size="schoolTeamDirectory"
              frameClassName="!mx-0 h-full w-full max-w-none"
            />
          </div>
        ) : null}
        <div className={`flex flex-1 flex-col justify-center ${stacked ? "p-4 sm:p-5" : "p-5 sm:p-6"}`}>
          <span className="font-display text-xl font-bold uppercase text-electric-blue transition-colors hover:text-ice-white">
            {String(school.name)}
          </span>
          {school.programLink ? (
            <span className="mt-2 text-sm text-cool-grey">Program link on team page ↗</span>
          ) : (
            <span className="mt-2 text-sm text-cool-grey">View team page →</span>
          )}
        </div>
      </Link>
    </li>
  );
}
