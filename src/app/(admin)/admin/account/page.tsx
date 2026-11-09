import { auth } from "@/lib/auth/auth";
import { AccountForm } from "@/components/admin/AccountForm";

export const dynamic = "force-dynamic";

export default async function AdminAccountPage() {
  const session = await auth();
  return (
    <div>
      <h1 className="text-2xl font-bold">My Account</h1>
      <p className="mt-2 text-sm text-slate-600">
        Signed in as <strong>{session?.user?.email}</strong>. Change your password regularly and never share it in chat or email.
      </p>
      <div className="mt-6">
        <AccountForm />
      </div>
    </div>
  );
}
