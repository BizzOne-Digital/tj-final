import { SiteSettingsEditor } from "@/components/admin/SiteSettingsEditor";

export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">League & Brand Settings</h1>
      <p className="mt-2 text-sm text-slate-600">
        Updates headline, announcement, registration, and about copy on the public site.
      </p>
      <div className="mt-8">
        <SiteSettingsEditor />
      </div>
    </div>
  );
}
