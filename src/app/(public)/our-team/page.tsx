import { InnerPage } from "@/components/public/InnerPage";
import { ContentImage } from "@/components/public/ContentImage";
import { CmsHtml } from "@/components/public/CmsHtml";
import { getStaff } from "@/lib/services/league";
import { getCms } from "@/lib/cms/content";

export default async function OurTeamPage() {
  const staff = await getStaff();
  const cms = await getCms();
  return (
    <InnerPage title={cms.text("our-team.title")} subtitle={cms.text("our-team.subtitle")}>
      <ul className="not-prose grid gap-6 sm:grid-cols-2">
        {staff.length === 0 ? (
          <li className="text-cool-grey">Leadership profiles will be posted here soon.</li>
        ) : (
          staff.map((p) => {
            const photo = (p.photo as { url?: string } | undefined)?.url;
            const email = p.email ? String(p.email) : "";
            const phone = p.phone ? String(p.phone) : "";
            return (
              <li key={String(p._id)} className="rounded-xl border border-white/10 p-6">
                {photo ? (
                  <div className="mb-4">
                    <ContentImage
                      src={photo}
                      alt={String(p.name)}
                      size="schoolTeam"
                      frameClassName="!mx-0"
                    />
                  </div>
                ) : null}
                <p className="font-display text-xl font-bold uppercase">{String(p.name)}</p>
                <p className="text-sm text-electric-blue">{(p.roles as string[] | undefined)?.join(" · ")}</p>
                {p.bioHtml ? <CmsHtml html={String(p.bioHtml)} className="mt-3 text-sm" /> : null}
                {email || phone ? (
                  <p className="mt-3 text-sm text-cool-grey">
                    {email ? (
                      <a href={`mailto:${email}`} className="text-electric-blue hover:underline">
                        {email}
                      </a>
                    ) : null}
                    {email && phone ? " · " : null}
                    {phone}
                  </p>
                ) : null}
              </li>
            );
          })
        )}
      </ul>
    </InnerPage>
  );
}
