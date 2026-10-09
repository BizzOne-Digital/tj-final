"use client";

import Image from "next/image";
import { useState } from "react";
import { isScheduleAssetUrl } from "@/lib/page-drive-images";

export type ContentImageSize =
  | "schedule"
  | "scheduleCard"
  | "schoolTeam"
  | "compact"
  | "sectionFill"
  | "feature"
  | "tile"
  | "default"
  | "wide";

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
  schoolTeam: {
    frame: "w-full max-w-[10rem] sm:max-w-[11rem]",
    box: "relative flex h-[10rem] w-full items-center justify-center sm:h-[11rem]",
    maxH: 168,
    maxW: 176,
    w: 220,
    h: 300,
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
};

export function sizeForAssetUrl(src: string): ContentImageSize {
  if (isScheduleAssetUrl(src)) return "schedule";
  if (src.includes("/team.") || src.includes("/schools/")) return "schoolTeam";
  if (src.includes("/about/") || src.includes("program-picture")) return "feature";
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

  return (
    <figure
      className={`league-media mx-auto ${resolved === "sectionFill" ? "min-w-0 w-full" : "shrink-0"} ${spec.frame} ${frameClassName}`.trim()}
      data-size={resolved}
    >
      <div
        className={`overflow-hidden rounded-xl border border-electric-blue/25 bg-[#020a18]/80 p-2 ${spec.box}`}
      >
        <Image
          src={src}
          alt={alt}
          width={spec.w}
          height={spec.h}
          priority={priority}
          onLoad={() => setLoaded(true)}
          className={`h-auto max-h-full w-auto max-w-full object-contain object-center transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"} ${className}`}
          style={{
            maxHeight: spec.maxH,
            maxWidth: spec.maxW,
          }}
          sizes={`(max-width: 768px) 90vw, ${spec.maxW}px`}
        />
      </div>
    </figure>
  );
}

/** Schedule posters — compact on team pages, larger grid on the schedules index. */
export function ScheduleImageGrid({
  images,
  altPrefix,
  posterLayout = "compact",
}: {
  images: string[];
  altPrefix: string;
  /** `page` = readable posters in a full-width responsive grid (schedules index). */
  posterLayout?: "compact" | "page";
}) {
  if (!images.length) return null;

  if (posterLayout === "page") {
    const colClass =
      images.length === 1
        ? "grid-cols-1 sm:max-w-sm"
        : images.length === 2
          ? "grid-cols-1 min-[420px]:grid-cols-2"
          : "grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-3";
    return (
      <div className={`grid w-full min-w-0 gap-3 sm:gap-4 ${colClass}`}>
        {images.map((src, i) => (
          <ContentImage
            key={src}
            src={src}
            alt={`${altPrefix} ${i + 1}`}
            size="scheduleCard"
            frameClassName="!mx-0 w-full max-w-none"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex max-w-full flex-wrap items-start justify-center gap-4 sm:gap-5">
      {images.map((src, i) => (
        <ContentImage
          key={src}
          src={src}
          alt={`${altPrefix} ${i + 1}`}
          size="schedule"
          frameClassName="!mx-0"
        />
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
  columns?: 2 | 3 | 4;
}) {
  if (!images.length) return null;
  const colClass =
    columns === 4
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
