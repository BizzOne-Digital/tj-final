"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { DECOR_IMAGES, decorIndexForPath } from "@/lib/decor-images";

export function SiteBackdrop() {
  const pathname = usePathname();
  const primary = useMemo(() => decorIndexForPath(pathname), [pathname]);
  const secondary = (primary + 7) % DECOR_IMAGES.length;
  const isHome = pathname === "/";

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <Image
        key={DECOR_IMAGES[primary]}
        src={DECOR_IMAGES[primary]}
        alt=""
        fill
        className="object-cover object-center"
        sizes="100vw"
        quality={85}
        priority={isHome}
      />
      <Image
        src={DECOR_IMAGES[secondary]}
        alt=""
        fill
        className="object-cover object-[80%_20%] opacity-[0.22] mix-blend-screen"
        sizes="100vw"
        quality={70}
      />
      <div
        className={`absolute inset-0 ${
          isHome
            ? "bg-gradient-to-b from-[#020a18]/75 via-[#0b2457]/80 to-[#020a18]/92"
            : "bg-gradient-to-br from-[#020a18]/85 via-[#0b2457]/78 to-[#020a18]/90"
        }`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-electric-blue/15 via-transparent to-royal-blue/10" />
    </div>
  );
}
