import { connectMongoose } from "@/lib/db/mongoose";
import { Registration } from "@/models/Registration";
import { ContactMessage } from "@/models/Sponsor";
import { Resource } from "@/models/Resource";
import { isDatabaseConfigured } from "@/lib/env";
import Link from "next/link";

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
  const [regCount, contactCount, missingDocs] = await Promise.all([
    Registration.countDocuments({ status: "submitted" }),
    ContactMessage.countDocuments({ status: "new" }),
    Resource.countDocuments({ "adminFlags.needsDocument": true }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Card title="Pending registrations" value={regCount} href="/admin/registrations" />
        <Card title="New contact messages" value={contactCount} href="/admin/contact" />
        <Card title="Documents needed" value={missingDocs} href="/admin/resources" />
      </div>
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
