import { InnerPage } from "@/components/public/InnerPage";

const GEAR_STORE_URL =
  "https://shop.game-one.com/east/e4/po-select-travel-league-gear-store";

export default function GearStorePage() {
  return (
    <InnerPage title="Gear Store" subtitle="Select team gear — Game One">
      <p className="text-cool-grey">
        <a
          href={GEAR_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-electric-blue hover:underline"
        >
          P-O Select League gear store ↗
        </a>
      </p>
      <p className="mt-4">
        <a
          href={GEAR_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-full bg-royal-blue px-5 py-2.5 text-sm font-bold text-white hover:bg-royal-blue/90"
        >
          Shop Game One store ↗
        </a>
      </p>
      <section className="mt-10">
        <h2 className="font-display text-xl uppercase text-ice-white">Select Team Gear Store (Game One)</h2>
        <p className="mt-4 text-cool-grey">
          Official Philipsburg-Osceola Select Team Basketball apparel.
        </p>
        <h3 className="mt-8 font-display text-lg uppercase text-electric-blue">Official Team Store</h3>
        <p className="mt-3 text-cool-grey">
          Shop official Mounties Youth Basketball gear through our{" "}
          <a
            href={GEAR_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-electric-blue hover:underline"
          >
            Game One team store ↗
          </a>
          . Jerseys, apparel, and accessories for players and families.
        </p>
      </section>
    </InnerPage>
  );
}
