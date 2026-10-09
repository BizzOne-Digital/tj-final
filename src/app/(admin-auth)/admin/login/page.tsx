import { Suspense } from "react";
import { LoginForm } from "@/components/admin/LoginForm";

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-midnight-navy px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-deep-blue/50 p-8">
        <h1 className="font-display text-2xl font-bold uppercase text-ice-white">Admin Login</h1>
        <p className="mt-2 text-sm text-cool-grey">P-O Select League CMS</p>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
