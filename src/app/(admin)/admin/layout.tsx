import Link from "next/link";
import { auth, signOut } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/settings", label: "League & Brand" },
  { href: "/admin/resources", label: "Forms & Documents" },
  { href: "/admin/schools", label: "Schools" },
  { href: "/admin/registrations", label: "Registrations" },
  { href: "/admin/contact", label: "Contact Inbox" },
  { href: "/admin/news", label: "News" },
  { href: "/admin/faq", label: "FAQ" },
  { href: "/admin/sponsors", label: "Sponsors" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  return (
    <div className="flex min-h-screen w-full max-w-full flex-col overflow-x-hidden bg-slate-100 text-slate-900 md:flex-row">
      <aside className="w-full shrink-0 border-b border-slate-200 bg-white p-4 md:w-64 md:border-b-0 md:border-r">
        <p className="font-bold text-slate-800">P-O Select Admin</p>
        <p className="break-all text-xs text-slate-500">{session.user.email} ({session.user.role})</p>
        <nav className="mt-4 flex gap-1 overflow-x-auto pb-1 md:mt-6 md:block md:space-y-1 md:overflow-visible md:pb-0">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block shrink-0 rounded-lg px-3 py-2 text-sm whitespace-nowrap hover:bg-slate-100 md:whitespace-normal"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/admin/login" });
          }}
          className="mt-8"
        >
          <button type="submit" className="text-sm text-red-600">Sign out</button>
        </form>
      </aside>
      <main className="min-w-0 flex-1 p-4 sm:p-6 md:p-8">{children}</main>
    </div>
  );
}
