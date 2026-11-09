import Link from "next/link";

export default function AdminSponsorsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Sponsors</h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-600">
        The Team Sponsor page text and pricing are edited under{" "}
        <Link className="text-blue-700 hover:underline" href="/admin/pages/sponsorship">Page Content → Team Sponsor page</Link>.
      </p>
    </div>
  );
}
