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
      <section>
        <h2 className="font-display text-xl uppercase text-ice-white">AAU Travel Team Program</h2>
        <p className="mt-4 flex flex-wrap gap-4">
          <a
            href="https://www.tjcentralpalions.com"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-royal-blue px-5 py-2.5 text-sm font-bold text-white"
          >
            Visit Central PA Lions ↗
          </a>
          <a
            href="https://centralpalions.square.site"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-electric-blue/40 px-5 py-2.5 text-sm font-bold text-electric-blue"
          >
            Payment / Store ↗
          </a>
        </p>
      </section>

      {LION_IMAGES.length > 0 && (
        <div className="mt-10">
          <ContentImageGrid images={LION_IMAGES} altPrefix="Central PA Lions" columns={3} />
        </div>
      )}

      <section id="about-academy" className="mt-12 scroll-mt-28">
        <h2 className="font-display text-xl uppercase text-ice-white">About the Academy</h2>
        <p className="mt-4 text-cool-grey leading-relaxed">
          TJ Anderson&apos;s Central PA Lions Academy is a youth basketball program designed for student-athletes in
          grades K-12 to develop skills on and off of the court, and to take their game to the next level. The
          academy offers various opportunities for development through camps, shooting clinics, AAU and Travel teams,
          and programs designed specifically for student-athletes in grades K-2nd and 3rd-6th.
        </p>
        <p className="mt-4 text-cool-grey leading-relaxed">
          The academy has served student-athletes since 2011 when the program first began as the Huntingdon Cats Youth
          Basketball. In 2014 the academy was renamed the JV Stingers Basketball Academy Program, and finally in
          2020, the academy reorganized and became TJ Anderson&apos;s Central PA Lions Academy.
        </p>
        <p className="mt-4 text-cool-grey leading-relaxed">
          Rich in coaching experiences, knowledge of the game, and community involvement, the academy is a premier
          program designed to improve the student-athletes&apos; experience and skill set.
        </p>
      </section>

      <section id="mission" className="mt-12 scroll-mt-28">
        <h2 className="font-display text-xl uppercase text-ice-white">Mission, Vision &amp; Team Culture</h2>
        <p className="mt-4 text-cool-grey">
          For the season, we will put a team of confident and mentally tough student-athletes on the floor of every
          game, that finishes the season with a .500 winning pct. or higher, that defeats opponents through superior
          skill and teamwork in execution of our offense and defense.
        </p>
        <h3 className="mt-8 font-display text-lg uppercase text-electric-blue">AAU Travel Team Program</h3>
        <p className="mt-3 text-cool-grey">
          The Central PA Lions organization is a travel basketball program coached by USAB Gold Certified Coaching
          Staff. The travel teams within this program participate in high level tournaments and college showcases
          within Pennsylvania and surrounding states. Student-athletes and families should expect to practice
          bi-weekly, have weekend workouts (optional), and participate in 5-7 high level tournaments.
        </p>
        <h3 className="mt-8 font-display text-lg uppercase text-electric-blue">Tryouts</h3>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-cool-grey">
          <li>
            <strong>Fall — Saturday, October 17, 2026</strong>
            <ul className="mt-1 list-disc pl-5">
              <li>8:00 AM – 9:00 AM, Grades 3-6 (Boys)</li>
              <li>9:00 AM – 10:30 AM, Grades 7-12 (Boys)</li>
              <li>11:00 AM – 12:00 PM, Grades 7-12 (Girls)</li>
              <li>12:00 PM – 1:00 PM, Grades 3-6 (Girls)</li>
            </ul>
          </li>
          <li>
            <strong>Spring — Sunday, February 14, 2027</strong>
            <ul className="mt-1 list-disc pl-5">
              <li>8:00 AM – 9:00 AM, Grades 3-6 (Boys)</li>
              <li>9:00 AM – 10:30 AM, Grades 7-12 (Boys)</li>
              <li>11:00 AM – 12:00 PM, Grades 7-12 (Girls)</li>
              <li>12:00 PM – 1:00 PM, Grades 3-6 (Girls)</li>
            </ul>
          </li>
        </ul>
        <p className="mt-4 text-sm text-cool-grey">
          Philipsburg-Osceola Middle School, 200 Short Street, Philipsburg, PA 16866. Location, dates, and times are
          subject to change. Check the website and Facebook for updates.
        </p>
      </section>

      <section id="payment" className="mt-12 scroll-mt-28">
        <h2 className="font-display text-xl uppercase text-ice-white">Payment</h2>
        <p className="mt-4 text-cool-grey">
          Make check or money order payable to: <strong>Central PA Lions Basketball</strong> or submit payment at{" "}
          <a
            href="https://centralpalions.square.site"
            target="_blank"
            rel="noopener noreferrer"
            className="text-electric-blue hover:underline"
          >
            centralpalions.square.site ↗
          </a>
        </p>
      </section>

      <Link href="/about" className="mt-10 inline-block text-electric-blue hover:underline">
        P-O Select League (elementary) →
      </Link>
    </InnerPage>
  );
}
