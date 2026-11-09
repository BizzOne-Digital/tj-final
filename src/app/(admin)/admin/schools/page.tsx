import Link from "next/link";
import { getSchools } from "@/lib/services/league";

export const dynamic = "force-dynamic";

export default async function AdminSchoolsPage() {
  const schools = await getSchools();
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold">Schools &amp; Coaches</h1>
      <p className="mt-2 text-sm text-slate-600">
        Update each school&apos;s coaches, program link, team photo and schedule posters.
      </p>
      <ul className="mt-6 space-y-2">
        {schools.map((s) => (
          <li key={String(s.slug)}>
            <Link
              href={`/admin/schools/${s.slug}`}
              className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:border-blue-300"
            >
              <span className="font-medium">{String(s.name)}</span>
              <span className="text-sm text-blue-700">Edit →</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
