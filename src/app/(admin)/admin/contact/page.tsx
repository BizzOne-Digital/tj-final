import { connectMongoose } from "@/lib/db/mongoose";
import { ContactMessage } from "@/models/Sponsor";
import { isDatabaseConfigured } from "@/lib/env";

export default async function AdminContactPage() {
  if (!isDatabaseConfigured()) return <p>Database required.</p>;
  await connectMongoose();
  const messages = await ContactMessage.find().sort({ createdAt: -1 }).limit(50).lean();
  return (
    <div>
      <h1 className="text-2xl font-bold">Contact Inbox</h1>
      <ul className="mt-6 space-y-3">
        {messages.map((m) => (
          <li key={String(m._id)} className="rounded border bg-white p-4 text-sm">
            <p className="font-semibold">{m.subject}</p>
            <p>{m.name} — {m.email}</p>
            <p className="mt-2 text-slate-600">{m.message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
