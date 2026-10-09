import Link from "next/link";
import { InnerPage } from "@/components/public/InnerPage";

export default function JoinUsPage() {
  return (
    <InnerPage title="Join Us" subtitle="JOIN THE MOUNTIE FAMILY">
      <p><strong>ONE TEAM. ONE GOAL. ONE PURPOSE.</strong></p>
      <p className="mt-4">
        Choose a program below to learn more and register when registration is open.
      </p>
      <ul className="mt-6 space-y-2">
        <li><Link href="/booking">Get started / registration</Link></li>
        <li><Link href="/teams">Team directory</Link></li>
        <li><Link href="/contact">Contact us</Link></li>
      </ul>
    </InnerPage>
  );
}
