import Image from "next/image";
import { leagueImageAt } from "@/lib/page-drive-images";

export function SectionPhotoBand({
  imageIndex,
  src,
  tall = false,
}: {
  imageIndex: number;
  src?: string;
  tall?: boolean;
}) {
  const imageSrc = src ?? leagueImageAt(imageIndex);
  const boxH = tall ? "h-28 md:h-32" : "h-20 md:h-24";
  return (
    <div
      className={`relative mx-auto flex max-h-36 w-full max-w-3xl items-center justify-center overflow-hidden border-y border-electric-blue/20 bg-[#020a18]/90 ${boxH}`}
      aria-hidden
    >
      <Image
        src={imageSrc}
        alt=""
        width={640}
        height={360}
        className="max-h-full w-auto max-w-[min(100%,520px)] object-contain object-center px-3 py-1"
        sizes="520px"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#020a18]/80 via-transparent to-[#020a18]/80" />
      <div className="pointer-events-none absolute inset-0 bg-electric-blue/5" />
    </div>
  );
}
