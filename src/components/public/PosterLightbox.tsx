"use client";

import Image from "next/image";
import { useState } from "react";
import { Expand } from "lucide-react";

/** Season poster file is 1024×552 (landscape). */
const LANDSCAPE_POSTER_ASPECT = "1024 / 552";

export function PosterLightbox({
  src,
  alt,
  previewMaxHeight = 220,
  layout = "stacked",
}: {
  src: string;
  alt: string;
  previewMaxHeight?: number;
  /** `landscape` — full-width beside prose (no empty stretch below poster). */
  layout?: "stacked" | "landscape";
}) {
  const [open, setOpen] = useState(false);
  const isLandscape = layout === "landscape";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          isLandscape
            ? "group relative block w-full overflow-hidden rounded-xl ring-2 ring-electric-blue/30"
            : "group relative mx-auto block w-full max-w-sm overflow-hidden rounded-xl ring-2 ring-electric-blue/30"
        }
      >
        <div
          className={
            isLandscape
              ? "relative w-full bg-[#020a18]/60 p-2 sm:p-3"
              : "relative bg-[#020a18]/60 p-2"
          }
          style={
            isLandscape
              ? { aspectRatio: LANDSCAPE_POSTER_ASPECT }
              : { height: previewMaxHeight, maxHeight: previewMaxHeight }
          }
        >
          <Image
            src={src}
            alt={alt}
            fill
            className="object-contain object-center p-1 transition duration-500 group-hover:scale-[1.02] sm:p-2"
            sizes={isLandscape ? "(max-width: 1024px) 45vw, 520px" : "(max-width: 768px) 80vw, 320px"}
          />
        </div>
        <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] text-white">
          <Expand className="h-3 w-3" /> Full view
        </span>
      </button>
      {open && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Season poster"
        >
          <button
            type="button"
            className="absolute right-4 top-4 rounded-full bg-white/10 px-4 py-2 text-sm text-white"
            onClick={() => setOpen(false)}
          >
            Close
          </button>
          <Image
            src={src}
            alt={alt}
            width={1200}
            height={650}
            className="max-h-[85vh] w-auto max-w-[min(92vw,960px)] object-contain"
          />
        </div>
      )}
    </>
  );
}
