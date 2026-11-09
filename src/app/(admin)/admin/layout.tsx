import Link from "next/link";
import { auth, signOut } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { ToastProvider } from "@/components/admin/Toast";

export const dynamic = "force-dynamic";

const groups: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Website",
    links: [
      { href: "/admin", label: "Dashboard" },
      { href: "/admin/pages", label: "Page Content" },
      { href: "/admin/schedules", label: "Schedules" },
      { href: "/admin/schools", label: "Schools & Coaches" },
      { href: "/admin/news", label: "News" },
      { href: "/admin/faq", label: "FAQ" },
      { href: "/admin/leadership", label: "Leadership" },
    ],
  },
  {
    title: "League",
    links: [
      { href: "/admin/settings", label: "League & Brand" },
      { href: "/admin/resources", label: "Forms & Documents" },
      { href: "/admin/registrations", label: "Registrations" },
      { href: "/admin/contact", label: "Contact Inbox" },
      { href: "/admin/sponsors", label: "Sponsors" },
    ],
  },
  { title: "Account", links: [{ href: "/admin/account", label: "My Account" }] },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  return (
    <ToastProvider>
      <div className="flex min-h-screen w-full max-w-full flex-col overflow-x-hidden bg-slate-100 text-slate-900 md:flex-row">
        <aside className="w-full shrink-0 border-b border-slate-200 bg-white p-4 md:fixed md:inset-y-0 md:left-0 md:w-64 md:overflow-y-auto md:border-b-0 md:border-r">
          <p className="font-bold text-slate-800">P-O Select Admin</p>
          <p className="break-all text-xs text-slate-500">{session.user.email} ({session.user.role})</p>
          <nav className="mt-4 md:mt-6">
            {groups.map((g) => (
              <div key={g.title} className="mb-3">
                <p className="px-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">{g.title}</p>
                <div className="mt-1 flex gap-1 overflow-x-auto pb-1 md:block md:space-y-1 md:overflow-visible md:pb-0">
                  {g.links.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="block shrink-0 rounded-lg px-3 py-2 text-sm whitespace-nowrap hover:bg-slate-100 md:whitespace-normal"
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg px-3 py-2 text-sm text-blue-700 hover:bg-slate-100"
            >
              View website ↗
            </a>
          </nav>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/admin/login" });
            }}
            className="mt-6"
          >
            <button type="submit" className="px-3 text-sm text-red-600">Sign out</button>
          </form>
        </aside>
        <main className="min-w-0 flex-1 p-4 sm:p-6 md:ml-64 md:p-8">{children}</main>
      </div>
    </ToastProvider>
  );
}
