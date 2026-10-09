import { auth } from "@/lib/auth/auth";
import { canAccessModule, type AdminModule, type AdminRole } from "@/types/roles";

export async function requireAdmin(module?: AdminModule) {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false as const, status: 401, message: "Unauthorized" };
  }
  const role = session.user.role;
  if (module && !canAccessModule(role, module)) {
    return { ok: false as const, status: 403, message: "Forbidden" };
  }
  return {
    ok: true as const,
    session,
    role: role as AdminRole,
    userId: session.user.id,
    email: session.user.email ?? "",
  };
}
