import Image from "next/image";
import { ALL_LEAGUE_IMAGE_URLS, leagueImageAt } from "@/lib/page-drive-images";

/** Thin scrolling strip of official league drive photography */
export function PhotoMosaicRail({ startIndex = 0 }: { startIndex?: number }) {
  const len = ALL_LEAGUE_IMAGE_URLS.length || 1;
  const slice = Array.from({ length: 8 }, (_, i) => leagueImageAt(startIndex + i));
  return (
    <div className="overflow-hidden border-y border-white/10 py-2" aria-hidden>
      <div className="flex gap-2 px-2">
        {slice.map((src, i) => (
          <div
            key={`${src}-${i}`}
            className="relative flex h-16 w-28 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#020a18] md:h-20 md:w-36"
          >
            <Image
              src={src}
              alt=""
              width={280}
              height={160}
              className="max-h-full max-w-full object-contain"
              sizes="144px"
            />
            <div className="pointer-events-none absolute inset-0 bg-royal-blue/15" />
          </div>
        ))}
      </div>
    </div>
  );
}
