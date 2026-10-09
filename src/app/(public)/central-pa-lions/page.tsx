import Link from "next/link";
import { InnerPage } from "@/components/public/InnerPage";
import { ContentImageGrid } from "@/components/public/ContentImage";
import { driveAsset } from "@/lib/drive-assets";

const LION_IMAGES = [
  driveAsset("central-pa-lions.1"),
  driveAsset("central-pa-lions.2"),
  driveAsset("central-pa-lions.3"),
].filter(Boolean) as string[];

export default function CentralPaLionsPage() {
  return (
    <InnerPage title="AAU Travel — Central PA Lions" subtitle="Separate academy program (not elementary league eligible)">
      <p>
        <a
          href="https://www.tjcentralpalions.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-electric-blue hover:underline"
        >
          Visit Central PA Lions ↗
        </a>
        {" · "}
        <a
          href="https://centralpalions.square.site"
          target="_blank"
          rel="noopener noreferrer"
          className="text-electric-blue hover:underline"
        >
          Payment / Store ↗
        </a>
      </p>
      {LION_IMAGES.length > 0 && (
        <div className="mt-8">
          <ContentImageGrid images={LION_IMAGES} altPrefix="Central PA Lions" />
        </div>
      )}
      <h2 className="mt-10 font-display text-xl uppercase">About the Academy</h2>
      <p className="mt-4 text-cool-grey">
        TJ Anderson&apos;s Central PA Lions Academy is a youth basketball program for student-athletes
        grades K-12 — camps, clinics, AAU travel teams, and development programs. Serving athletes since
        2011.
      </p>
      <Link href="/about" className="mt-6 inline-block text-electric-blue hover:underline">
        P-O Select League (elementary) →
      </Link>
    </InnerPage>
  );
}
