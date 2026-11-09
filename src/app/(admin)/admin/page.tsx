import { connectMongoose } from "@/lib/db/mongoose";
import { Registration } from "@/models/Registration";
import { ContactMessage } from "@/models/Sponsor";
import { Resource } from "@/models/Resource";
import { SiteContent } from "@/models/SiteContent";
import { StoredUpload } from "@/models/StoredUpload";
import { isDatabaseConfigured } from "@/lib/env";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  if (!isDatabaseConfigured()) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-4 text-red-600">MongoDB is not configured. Set MONGODB_URI in .env</p>
      </div>
    );
  }
  await connectMongoose();
  const [regCount, contactCount, missingDocs, edits, images] = await Promise.all([
    Registration.countDocuments({ status: "submitted" }),
    ContactMessage.countDocuments({ status: "new" }),
    Resource.countDocuments({ "adminFlags.needsDocument": true }),
    SiteContent.countDocuments(),
    StoredUpload.countDocuments(),
  ]);

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-slate-500">Needs attention</h2>
      <div className="mt-3 grid gap-4 sm:grid-cols-3">
        <Card title="Pending registrations" value={regCount} href="/admin/registrations" />
        <Card title="New contact messages" value={contactCount} href="/admin/contact" />
        <Card title="Documents needed" value={missingDocs} href="/admin/resources" />
      </div>

      <h2 className="mt-10 text-sm font-semibold uppercase tracking-wide text-slate-500">Update the website</h2>
      <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Tile title="Page Content" text="Edit text, links and pictures on every page." href="/admin/pages" />
        <Tile title="Schedules" text="Upload new league and school schedule posters." href="/admin/schedules" />
        <Tile title="Schools & Coaches" text="Coaches, team photos and program links." href="/admin/schools" />
        <Tile title="News" text="Post announcements with a cover image." href="/admin/news" />
        <Tile title="FAQ" text="Add or change frequently asked questions." href="/admin/faq" />
        <Tile title="League & Brand" text="Contact details, fees, logos, announcement bar." href="/admin/settings" />
      </div>

      <p className="mt-8 text-xs text-slate-500">
        {edits} customised content field{edits === 1 ? "" : "s"} · {images} uploaded image{images === 1 ? "" : "s"} stored
      </p>
    </div>
  );
}

function Card({ title, value, href }: { title: string; value: number; href: string }) {
  return (
    <Link href={href} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:border-blue-300">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </Link>
  );
}

function Tile({ title, text, href }: { title: string; text: string; href: string }) {
  return (
    <Link href={href} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-blue-300">
      <p className="font-semibold text-slate-900">{title}</p>
      <p className="mt-1 text-sm text-slate-600">{text}</p>
    </Link>
  );
}
