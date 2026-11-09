import { CollectionManager } from "@/components/admin/CollectionManager";
import { COLLECTIONS } from "@/lib/admin/collections";

export const dynamic = "force-dynamic";

export default function AdminNewsPage() {
  const c = COLLECTIONS.news;
  return (
    <div>
      <h1 className="text-2xl font-bold">News & Announcements</h1>
      <p className="mt-2 text-sm text-slate-600">Post announcements with a cover image. Published articles appear on the News page and the home page.</p>
      <div className="mt-6">
        <CollectionManager
          collection={{
            key: c.key,
            label: c.label,
            singular: c.singular,
            fields: c.fields,
            titleField: c.titleField,
            subtitleField: c.subtitleField,
            publicPath: c.publicPath,
            canImportDefaults: true,
          }}
        />
      </div>
    </div>
  );
}
