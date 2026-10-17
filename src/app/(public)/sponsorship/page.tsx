import { InnerPage } from "@/components/public/InnerPage";

export default function SponsorshipPage() {
  return (
    <InnerPage title="Team Sponsor" subtitle="P-O Select League — 2026-27 season">
      <section>
        <h2 className="font-display text-xl uppercase text-gold">Team Sponsor — $500.00</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-cool-grey">
          <li>Company name and logo on team uniform</li>
          <li>Recognition during varsity basketball games</li>
          <li>Plaque of appreciation with team photo</li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl uppercase text-ice-white">Uniform Logo Display — Elementary Level — $150.00</h2>
        <p className="mt-4 text-cool-grey">Your logo will be placed on the uniforms of 3rd–6th grade teams.</p>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl uppercase text-ice-white">Sponsor Donations</h2>
        <p className="mt-4 text-cool-grey">
          Choose one. This fee helps the program with equipment, referees, league fees, and more.
        </p>
        <p className="mt-4 font-display text-2xl font-bold text-electric-blue">$25 · $50 · $100</p>
      </section>

      <section className="mt-10 rounded-xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="font-display text-lg uppercase text-ice-white">Sponsorship Form</h2>
        <p className="mt-4 text-sm text-cool-grey">
          Complete the following information and mail your form with payment to:
          <br />
          <strong className="text-ice-white">Philipsburg-Osceola Mounties Youth Basketball</strong>
          <br />
          7410 Sportsman Rd, Alexandria, PA 16611
        </p>
        <p className="mt-4 text-sm text-cool-grey">
          Business · Contact · Phone · Email · Address · Total sponsorship fee / donation
        </p>
        <p className="mt-4 text-sm text-cool-grey">
          For warmup uniform display sponsorships: email your company logo and colors (JPEG) to{" "}
          <a href="mailto:tjandersty@gmail.com" className="text-electric-blue">tjandersty@gmail.com</a>.
          Sponsor information and fee/donation due no later than September 29, 2027 for uniform production time.
        </p>
        <p className="mt-4 text-xs text-cool-grey">P-O LLB Federal Tax ID: 90-1673993</p>
        <p className="mt-6 text-sm">
          Questions: Coach TJ Anderson —{" "}
          <a href="tel:+18145008613" className="text-electric-blue">814-500-8613</a> ·{" "}
          <a href="mailto:tjandersty@gmail.com" className="text-electric-blue">tjandersty@gmail.com</a>
        </p>
      </section>
    </InnerPage>
  );
}
