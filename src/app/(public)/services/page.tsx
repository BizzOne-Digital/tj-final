import Link from "next/link";
import { InnerPage } from "@/components/public/InnerPage";

export default function ServicesPage() {
  return (
    <InnerPage title="League Programs" subtitle="Development for young athletes">
      <p>P-O Select Elementary League for school-based teams (grades 3–6).</p>
      <p className="mt-4">
        <Link href="/central-pa-lions">Central PA Lions AAU / travel program →</Link>
      </p>
    </InnerPage>
  );
}
