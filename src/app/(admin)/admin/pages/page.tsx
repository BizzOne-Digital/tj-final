import Link from "next/link";
import { CMS_PAGES } from "@/lib/cms/registry";
import { getRawOverrides } from "@/lib/cms/content";
import { isDatabaseConfigured } from "@/lib/env";

export const dynamic = "force-dynamic";

const GROUPS = ["Main pages", "Programs & info", "League hubs", "Site-wide"] as const;

export default async function AdminPagesIndex() {
  const overrides = isDatabaseConfigured() ? await getRawOverrides() : {};
  const customisedCount = (slug: string) =>
    Object.keys(overrides).filter((k) => k.startsWith(`${slug}.`)).length;

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold">Page Content</h1>
      <p className="mt-2 text-sm text-slate-600">
        Pick a page to edit its headings, text, links and pictures. Changes go live as soon as you save.
        Anything you do not change keeps its original text.
      </p>
      {!isDatabaseConfigured() ? (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          MongoDB is not configured, so edits cannot be saved. Set MONGODB_URI.
        </p>
      ) : null}

      {GROUPS.map((group) => {
        const pages = CMS_PAGES.filter((p) => p.group === group);
        return (
          <section key={group} className="mt-8">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{group}</h2>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {pages.map((p) => {
                const n = customisedCount(p.slug);
                return (
                  <li key={p.slug}>
                    <Link
                      href={`/admin/pages/${p.slug}`}
                      className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-blue-300"
                    >
                      <p className="font-medium text-slate-900">{p.label}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {p.path ? p.path : "All pages"} ·{" "}
                        {n > 0 ? `${n} customised` : "default content"}
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}

      <section className="mt-10 rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
        <p className="font-medium text-slate-800">Looking for something else?</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>
            Schedule posters: <Link className="text-blue-700 hover:underline" href="/admin/schedules">Schedules</Link>
          </li>
          <li>
            Coaches, team photos and school links:{" "}
            <Link className="text-blue-700 hover:underline" href="/admin/schools">Schools &amp; Coaches</Link>
          </li>
          <li>
            Phone, email, address, fees and logos:{" "}
            <Link className="text-blue-700 hover:underline" href="/admin/settings">League &amp; Brand</Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
