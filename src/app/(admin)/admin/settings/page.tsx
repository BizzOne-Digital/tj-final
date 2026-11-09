import { SiteSettingsEditor } from "@/components/admin/SiteSettingsEditor";

export const dynamic = "force-dynamic";

export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">League &amp; Brand Settings</h1>
      <p className="mt-2 text-sm text-slate-600">
        Contact details, fees, logos, headlines and the announcement bar. Changes appear on the public site as soon as you save.
      </p>
      <div className="mt-8">
        <SiteSettingsEditor />
      </div>
    </div>
  );
}
