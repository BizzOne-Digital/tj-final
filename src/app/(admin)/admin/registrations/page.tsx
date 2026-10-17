import { RegistrationsTable } from "@/components/admin/RegistrationsTable";

export default function AdminRegistrationsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Registrations</h1>
      <p className="text-sm text-slate-600">Review team requests and payment status.</p>
      <RegistrationsTable />
    </div>
  );
}
