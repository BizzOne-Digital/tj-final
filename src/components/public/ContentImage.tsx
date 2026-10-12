"use client";

import Image from "next/image";
import { useState } from "react";
import { Expand } from "lucide-react";
import { isScheduleAssetUrl } from "@/lib/page-drive-images";

export type ContentImageSize =
  | "schedule"
  | "scheduleCard"
  | "schedulePoster"
  | "galleryPhoto"
  | "schoolTeam"
  | "schoolTeamDirectory"
  | "compact"
  | "sectionFill"
  | "feature"
  | "tile"
  | "default"
  | "wide"
  | "programPoster"
  | "landscapePoster"
  | "divisionBanner"
  | "certBadge";

type SizeSpec = {
  frame: string;
  box: string;
  maxH: number;
  maxW: number;
  w: number;
  h: number;
};

const SPECS: Record<ContentImageSize, SizeSpec> = {
  schedule: {
    frame: "mx-auto w-[7.25rem] shrink-0 sm:w-[7.5rem]",
    box: "relative flex h-[7.25rem] w-[7.25rem] items-center justify-center sm:h-[7.5rem] sm:w-[7.5rem]",
    maxH: 108,
    maxW: 112,
    w: 120,
    h: 200,
  },
  scheduleCard: {
    frame: "w-full min-w-0",
    box: "relative flex h-[14.5rem] w-full items-center justify-center sm:h-[16.5rem] md:h-[18rem]",
    maxH: 288,
    maxW: 320,
    w: 480,
    h: 720,
  },
  schedulePoster: {
    frame: "w-full min-w-0 max-w-none",
    box: "relative w-full",
    maxH: 2400,
    maxW: 1200,
    w: 1024,
    h: 1536,
  },
  galleryPhoto: {
    frame: "w-full min-w-0 max-w-none",
    box: "relative w-full",
    maxH: 1400,
    maxW: 1290,
    w: 1290,
    h: 1040,
  },
  schoolTeam: {
    frame: "w-full max-w-[10rem] sm:max-w-[11rem]",
    box: "relative flex h-[10rem] w-full items-center justify-center sm:h-[11rem]",
    maxH: 168,
    maxW: 176,
    w: 220,
    h: 300,
  },
  schoolTeamDirectory: {
    frame: "w-full min-w-0 max-w-none",
    box: "relative flex h-52 w-full items-center justify-center p-0 sm:h-56 sm:max-w-none md:h-60",
    maxH: 360,
    maxW: 960,
    w: 960,
    h: 540,
  },
  compact: {
    frame: "w-full max-w-[11rem] sm:max-w-[12.5rem]",
    box: "relative flex h-[8.5rem] w-full items-center justify-center sm:h-[9.5rem]",
    maxH: 152,
    maxW: 200,
    w: 280,
    h: 200,
  },
  sectionFill: {
    frame: "mx-auto w-full max-w-md",
    box: "relative flex h-56 w-full items-center justify-center p-3 sm:h-64 md:h-72",
    maxH: 288,
    maxW: 448,
    w: 360,
    h: 520,
  },
  feature: {
    frame: "w-full max-w-md",
    box: "relative flex h-[13rem] w-full items-center justify-center sm:h-[14.5rem]",
    maxH: 232,
    maxW: 448,
    w: 448,
    h: 320,
  },
  tile: {
    frame: "w-full",
    box: "relative flex h-[12rem] w-full items-center justify-center sm:h-[13rem]",
    maxH: 188,
    maxW: 280,
    w: 400,
    h: 300,
  },
  default: {
    frame: "w-full max-w-lg",
    box: "relative flex h-[11rem] w-full items-center justify-center sm:h-[12rem]",
    maxH: 192,
    maxW: 384,
    w: 384,
    h: 288,
  },
  wide: {
    frame: "w-full max-w-2xl",
    box: "relative flex h-44 w-full items-center justify-center sm:h-52 md:h-56",
    maxH: 224,
    maxW: 672,
    w: 672,
    h: 360,
  },
  programPoster: {
    frame: "w-full min-w-0 max-w-none",
    box: "relative flex w-full aspect-[2/3] items-center justify-center p-0",
    maxH: 1200,
    maxW: 960,
    w: 1080,
    h: 1620,
  },
  certBadge: {
    frame: "w-full min-w-0 max-w-none",
    box: "relative flex w-full aspect-square items-center justify-center p-0 sm:aspect-[4/3]",
    maxH: 720,
    maxW: 960,
    w: 800,
    h: 800,
  },
  landscapePoster: {
    frame: "w-full min-w-0 max-w-none",
    box: "relative flex w-full aspect-[5/3] items-center justify-center p-0.5 sm:aspect-[16/9]",
    maxH: 480,
    maxW: 900,
    w: 1500,
    h: 900,
  },
  divisionBanner: {
    frame: "w-full h-full min-w-0 max-w-none",
    box: "relative flex h-full w-full min-h-[9rem] items-center justify-center p-0 sm:min-h-[10rem]",
    maxH: 280,
    maxW: 520,
    w: 1200,
    h: 720,
  },
};

export function sizeForAssetUrl(src: string): ContentImageSize {
  if (isScheduleAssetUrl(src)) return "schedule";
  if (src.includes("/team.") || src.includes("/schools/")) return "schoolTeam";
  if (src.includes("program-picture")) return "programPoster";
  if (src.includes("/about/") || src.includes("about-feature")) return "landscapePoster";
  if (src.includes("/central-pa-lions/")) return "galleryPhoto";
  return "compact";
}

function resolveImageSize(size: ContentImageSize | undefined, src: string): ContentImageSize {
  if (size && SPECS[size]) return size;
  const inferred = sizeForAssetUrl(src);
  if (SPECS[inferred]) return inferred;
  return "compact";
}

export function ContentImage({
  src,
  alt,
  priority = false,
  className = "",
  frameClassName = "",
  size,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  frameClassName?: string;
  size?: ContentImageSize;
}) {
  const [loaded, setLoaded] = useState(false);
  const resolved = resolveImageSize(size, src);
  const spec = SPECS[resolved];
  const isDirectoryTeam = resolved === "schoolTeamDirectory";
  const isProgramPoster = resolved === "programPoster";
  const isLandscapePoster = resolved === "landscapePoster";
  const isDivisionBanner = resolved === "divisionBanner";
  const isCertBadge = resolved === "certBadge";
  const isNaturalFullWidth = resolved === "schedulePoster" || resolved === "galleryPhoto";
  const fillFrame =
    isDirectoryTeam ||
    isProgramPoster ||
    isLandscapePoster ||
    isDivisionBanner ||
    isCertBadge ||
    isNaturalFullWidth;
  const innerShell = fillFrame
    ? isNaturalFullWidth || isLandscapePoster
      ? "overflow-visible rounded-xl bg-transparent p-0"
      : "overflow-hidden rounded-xl bg-[#020a18]/40 p-0 sm:p-1"
    : "overflow-hidden rounded-xl border border-electric-blue/25 bg-[#020a18]/80 p-2";

  return (
    <figure
      className={`league-media mx-auto ${resolved === "sectionFill" || fillFrame ? "min-w-0 w-full" : "shrink-0"} ${spec.frame} ${frameClassName}`.trim()}
      data-size={resolved}
    >
      <div className={`${innerShell} ${spec.box}`}>
        <Image
          src={src}
          alt={alt}
          width={spec.w}
          height={spec.h}
          priority={priority}
          onLoad={() => setLoaded(true)}
          className={`object-contain object-center transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"} ${
            isNaturalFullWidth
              ? "h-auto w-full max-w-full"
              : fillFrame
                ? "h-full w-full max-h-full max-w-full"
                : "h-auto max-h-full w-auto max-w-full"
          } ${className}`}
          style={
            isNaturalFullWidth
              ? { width: "100%", height: "auto", maxHeight: "none", maxWidth: "100%" }
              : fillFrame
                ? { maxHeight: spec.maxH, maxWidth: "100%" }
                : { maxHeight: spec.maxH, maxWidth: spec.maxW }
          }
          sizes={
            isNaturalFullWidth
              ? "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 640px"
              : `(max-width: 768px) 90vw, ${spec.maxW}px`
          }
        />
      </div>
    </figure>
  );
}

function SchedulePosterLightbox({ src, alt }: { src: string; alt: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative block w-full min-w-0 text-left"
      >
        <ContentImage src={src} alt={alt} size="schedulePoster" frameClassName="!mx-0 w-full max-w-none" />
        <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-medium text-white opacity-90 sm:text-xs">
          <Expand className="h-3 w-3" aria-hidden />
          Tap to enlarge
        </span>
      </button>
      {open ? (
        <div
          className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-black/92 p-3 pt-14 sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={alt}
        >
          <button
            type="button"
            className="fixed right-3 top-3 z-[81] rounded-full bg-white/15 px-4 py-2 text-sm text-white hover:bg-white/25 sm:right-4 sm:top-4"
            onClick={() => setOpen(false)}
          >
            Close
          </button>
          <Image
            src={src}
            alt={alt}
            width={1200}
            height={1800}
            className="h-auto w-full max-w-4xl object-contain"
            sizes="100vw"
          />
        </div>
      ) : null}
    </>
  );
}

/** Schedule posters — full-width, readable, with tap-to-enlarge. */
export function ScheduleImageGrid({
  images,
  altPrefix,
  posterLayout: _posterLayout = "page",
}: {
  images: string[];
  altPrefix: string;
  /** @deprecated Ignored — all schedules render full-width. */
  posterLayout?: "compact" | "page";
}) {
  if (!images.length) return null;

  const colClass =
    images.length === 1
      ? "grid-cols-1"
      : images.length === 2
        ? "grid-cols-1 sm:grid-cols-2"
        : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3";

  return (
    <div className={`grid w-full min-w-0 gap-4 sm:gap-5 ${colClass}`}>
      {images.map((src, i) => (
        <SchedulePosterLightbox key={src} src={src} alt={`${altPrefix} ${i + 1}`} />
      ))}
    </div>
  );
}

export function ContentImageGrid({
  images,
  altPrefix,
  size,
  columns = 3,
}: {
  images: string[];
  altPrefix: string;
  size?: ContentImageSize;
  columns?: 1 | 2 | 3 | 4;
}) {
  if (!images.length) return null;
  const colClass =
    columns === 1
      ? ""
      : columns === 4
        ? "sm:grid-cols-2 lg:grid-cols-4"
        : columns === 2
          ? "sm:grid-cols-2"
          : "sm:grid-cols-3";
  return (
    <div className={`grid grid-cols-1 items-stretch gap-4 ${colClass}`}>
      {images.map((src, i) => (
        <ContentImage
          key={src}
          src={src}
          alt={`${altPrefix} ${i + 1}`}
          size={resolveImageSize(size, src)}
        />
      ))}
    </div>
  );
}
