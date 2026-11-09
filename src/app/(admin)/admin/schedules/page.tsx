import Link from "next/link";
import { PageContentEditor, type EditorSection } from "@/components/admin/PageContentEditor";
import type { FieldValue } from "@/components/admin/fields";
import { getCmsPage } from "@/lib/cms/registry";
import { getRawOverrides, getCms } from "@/lib/cms/content";
import { isDatabaseConfigured } from "@/lib/env";
import { getSchools } from "@/lib/services/league";
import { schoolFieldKey } from "@/lib/cms/registry";

export const dynamic = "force-dynamic";

export default async function AdminSchedulesPage() {
  const page = getCmsPage("schedules")!;
  const sections: EditorSection[] = page.sections.map((s) => ({
    id: s.id,
    label: s.label,
    fields: s.fields.map((f) => ({ ...f, fullKey: `${page.slug}.${f.key}` })),
  }));
  const keys = sections.flatMap((s) => s.fields.map((f) => f.fullKey));
  const overrides = isDatabaseConfigured()
    ? ((await getRawOverrides(keys)) as Record<string, FieldValue>)
    : {};

  const schools = await getSchools();
  const cms = await getCms();

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold">Schedules</h1>
      <p className="mt-2 text-sm text-slate-600">
        Upload the new league schedule posters here. School-specific posters are edited on each school&apos;s page.
      </p>

      <div className="mt-6">
        <PageContentEditor sections={sections} overrides={overrides} viewPath="/schedules" pageSlug="schedules" />
      </div>

      <section className="mt-12 pb-24">
        <h2 className="text-lg font-semibold">School schedule posters</h2>
        <p className="mt-1 text-sm text-slate-500">Open a school to replace or reorder its posters.</p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {schools.map((s) => {
            const n = cms.images(schoolFieldKey(String(s.slug), "schedules")).length;
            return (
              <li key={String(s.slug)}>
                <Link
                  href={`/admin/schools/${s.slug}`}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 text-sm shadow-sm hover:border-blue-300"
                >
                  <span className="font-medium">{String(s.name)}</span>
                  <span className="text-slate-500">
                    {n} poster{n === 1 ? "" : "s"} · Edit →
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
