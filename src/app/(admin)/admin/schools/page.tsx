import { connectMongoose } from "@/lib/db/mongoose";
import { SchoolProgram } from "@/models/SchoolProgram";
import { isDatabaseConfigured } from "@/lib/env";

export default async function AdminSchoolsPage() {
  if (!isDatabaseConfigured()) return <p>Database required.</p>;
  await connectMongoose();
  const schools = await SchoolProgram.find().sort({ name: 1 }).lean();
  return (
    <div>
      <h1 className="text-2xl font-bold">Schools</h1>
      <ul className="mt-6 space-y-2">
        {schools.map((s) => (
          <li key={String(s._id)} className="rounded border bg-white p-3">
            {s.name} — <code>{s.slug}</code>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-slate-500">Extended editing: program links and logos via upcoming media fields.</p>
    </div>
  );
}
