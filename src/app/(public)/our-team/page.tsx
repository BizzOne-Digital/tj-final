import { InnerPage } from "@/components/public/InnerPage";
import { getStaff } from "@/lib/services/league";

export default async function OurTeamPage() {
  const staff = await getStaff();
  return (
    <InnerPage title="League Leadership" subtitle="Commissioners and board">
      <ul className="not-prose grid gap-6 sm:grid-cols-2">
        {staff.length === 0 ? (
          <li className="text-cool-grey">Seed the database to load leadership records.</li>
        ) : (
          staff.map((p) => (
            <li key={String(p._id)} className="rounded-xl border border-white/10 p-6">
              <p className="font-display text-xl font-bold uppercase">{String(p.name)}</p>
              <p className="text-sm text-electric-blue">{(p.roles as string[] | undefined)?.join(" · ")}</p>
            </li>
          ))
        )}
      </ul>
    </InnerPage>
  );
}
