import { CollectionManager } from "@/components/admin/CollectionManager";
import { COLLECTIONS } from "@/lib/admin/collections";

export const dynamic = "force-dynamic";

export default function AdminFaqPage() {
  const c = COLLECTIONS.faq;
  return (
    <div>
      <h1 className="text-2xl font-bold">FAQ</h1>
      <p className="mt-2 text-sm text-slate-600">Add, edit, reorder and hide frequently asked questions.</p>
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
            canImportDefaults: false,
          }}
        />
      </div>
    </div>
  );
}
