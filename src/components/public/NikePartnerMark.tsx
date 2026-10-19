import Image from "next/image";
import { NIKE_MARK } from "@/lib/drive-assets";

/** Nike branding appears on the official program graphic from the drive folder. */
export function NikePartnerMark({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-md bg-white/95 shadow-md ${className}`}
      title="Nike"
      aria-label="Nike"
    >
      <div className="relative h-10 w-[88px] sm:h-11 sm:w-[96px]">
        <Image
          src={NIKE_MARK}
          alt="Nike — P-O Select League partner"
          fill
          className="object-cover object-[6%_18%] scale-[2.8]"
          sizes="96px"
        />
      </div>
    </div>
  );
}
