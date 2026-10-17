"use client";

import { ContentImageGrid, ScheduleImageGrid } from "@/components/public/ContentImage";
import { isScheduleAssetUrl } from "@/lib/page-drive-images";
import { getPageGallery } from "@/lib/page-drive-images";
import { usePathname } from "next/navigation";

export function PageDriveGallery({
  title,
  extraImages,
  className = "mb-8",
}: {
  title: string;
  extraImages?: string[];
  className?: string;
}) {
  const pathname = usePathname();
  const images = [...(extraImages ?? []), ...getPageGallery(pathname)];
  const uniq = [...new Set(images.filter(Boolean))];
  if (!uniq.length) return null;
  const allSchedules = uniq.every((src) => isScheduleAssetUrl(src));
  return (
    <div className={className}>
      <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-electric-blue/80">
        League photos
      </p>
      {allSchedules ? (
        <ScheduleImageGrid images={uniq} altPrefix={title} />
      ) : (
        <ContentImageGrid images={uniq} altPrefix={title} />
      )}
    </div>
  );
}
