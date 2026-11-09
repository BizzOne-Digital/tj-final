import Link from "next/link";
import { notFound } from "next/navigation";
import { PageContentEditor, type EditorSection } from "@/components/admin/PageContentEditor";
import { getCmsPage } from "@/lib/cms/registry";
import { getRawOverrides } from "@/lib/cms/content";
import { isDatabaseConfigured } from "@/lib/env";
import type { FieldValue } from "@/components/admin/fields";

export const dynamic = "force-dynamic";

export default async function AdminPageEditor({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getCmsPage(slug);
  if (!page) notFound();

  const sections: EditorSection[] = page.sections.map((s) => ({
    id: s.id,
    label: s.label,
    fields: s.fields.map((f) => ({ ...f, fullKey: `${page.slug}.${f.key}` })),
  }));

  const keys = sections.flatMap((s) => s.fields.map((f) => f.fullKey));
  const overrides = isDatabaseConfigured()
    ? ((await getRawOverrides(keys)) as Record<string, FieldValue>)
    : {};

  return (
    <div className="max-w-4xl">
      <p className="text-sm">
        <Link href="/admin/pages" className="text-blue-700 hover:underline">
          ← All pages
        </Link>
      </p>
      <h1 className="mt-2 text-2xl font-bold">{page.label}</h1>
      {!isDatabaseConfigured() ? (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          MongoDB is not configured, so edits cannot be saved. Set MONGODB_URI.
        </p>
      ) : null}
      <div className="mt-4">
        <PageContentEditor sections={sections} overrides={overrides} viewPath={page.path} pageSlug={page.slug} />
      </div>
    </div>
  );
}
