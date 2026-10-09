import Link from "next/link";
import { ContentImage } from "@/components/public/ContentImage";
import { schoolTeamImage } from "@/lib/drive-assets";
import type { JsonDoc } from "@/lib/services/league";

export function SchoolDirectoryCard({ school }: { school: JsonDoc }) {
  const slug = String(school.slug);
  const img = schoolTeamImage(slug);

  return (
    <li className="gradient-card gradient-card-hover min-w-0 overflow-hidden rounded-xl">
      <Link
        href={`/teams/${slug}`}
        className="flex min-h-[8.5rem] min-w-0 flex-col sm:flex-row sm:items-stretch"
      >
        {img ? (
          <div className="flex shrink-0 items-center justify-center border-b border-white/10 bg-[#020a18]/80 px-4 py-3 sm:w-[11.5rem] sm:border-b-0 sm:border-r sm:py-4">
            <ContentImage
              src={img}
              alt={`${school.name} team`}
              size="schoolTeam"
              frameClassName="!mx-0 w-full"
            />
          </div>
        ) : null}
        <div className="flex flex-1 flex-col justify-center p-5 sm:p-6">
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
