import { CollectionManager } from "@/components/admin/CollectionManager";
import { COLLECTIONS } from "@/lib/admin/collections";

export const dynamic = "force-dynamic";

export default function AdminLeadershipPage() {
  const c = COLLECTIONS.leadership;
  return (
    <div>
      <h1 className="text-2xl font-bold">League Leadership</h1>
      <p className="mt-2 text-sm text-slate-600">Commissioners and board members shown on the League Leadership page.</p>
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
