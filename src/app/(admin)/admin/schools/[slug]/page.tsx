import Link from "next/link";
import { notFound } from "next/navigation";
import { SchoolEditor, type CoachRow } from "@/components/admin/SchoolEditor";
import { getSchoolBySlug } from "@/lib/services/league";
import { getCms } from "@/lib/cms/content";
import { contactCoachLinesFromConfig } from "@/lib/school-coaches";
import { SCHOOL_SLUGS, schoolFieldKey, resolveField } from "@/lib/cms/registry";

export const dynamic = "force-dynamic";

export default async function AdminSchoolEditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!SCHOOL_SLUGS.includes(slug)) notFound();
  const school = await getSchoolBySlug(slug);
  if (!school) notFound();

  const cms = await getCms();
  const teamKey = schoolFieldKey(slug, "team");
  const schedKey = schoolFieldKey(slug, "schedules");

  const managed = Boolean((school as { coachesManaged?: boolean }).coachesManaged);
  const stored = ((school as { coachBlocks?: CoachRow[] }).coachBlocks ?? []).map((c) => ({
    name: c.name ?? "",
    label: c.label ?? "",
    email: c.email ?? "",
  }));
  const builtIn: CoachRow[] = (contactCoachLinesFromConfig(slug) ?? []).map((c) => ({
    name: c.name,
    label: c.division,
    email: c.email,
  }));

  return (
    <div>
      <p className="text-sm">
        <Link href="/admin/schools" className="text-blue-700 hover:underline">
          ← All schools
        </Link>
      </p>
      <h1 className="mt-2 text-2xl font-bold">{String(school.name)}</h1>
      <p className="mt-1 text-sm">
        <a href={`/teams/${slug}`} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
          View live team page ↗
        </a>
      </p>
      <div className="mt-6">
        <SchoolEditor
          slug={slug}
          initial={{
            name: String(school.name),
            programLink: String((school as { programLink?: string }).programLink ?? ""),
            coaches: managed ? stored : builtIn,
            teamImage: cms.image(teamKey),
            schedules: cms.images(schedKey),
          }}
          defaults={{
            teamImage: String(resolveField(teamKey)?.default ?? ""),
            schedules: (resolveField(schedKey)?.default as string[]) ?? [],
          }}
        />
      </div>
    </div>
  );
}
