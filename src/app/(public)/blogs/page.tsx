import Link from "next/link";
import { InnerPage } from "@/components/public/InnerPage";
import { getPublishedPosts } from "@/lib/services/league";
import { getCms } from "@/lib/cms/content";
import { ContentImage } from "@/components/public/ContentImage";

function formatNewsDate(value: unknown): string {
  if (!value) return "";
  const d = new Date(String(value));
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "America/New_York",
  });
}

export default async function BlogsPage() {
  const posts = await getPublishedPosts();
  const cms = await getCms();

  return (
    <InnerPage title={cms.text("blogs.title")} subtitle={cms.text("blogs.subtitle")}>
      {posts.length === 0 ? (
        <p className="text-cool-grey">
          New announcements will be posted here as the season approaches. Check{" "}
          <Link href="/league-information" className="text-electric-blue hover:underline">
            league information
          </Link>{" "}
          for registration and calendar details.
        </p>
      ) : (
        <ul className="grid min-w-0 gap-5 sm:grid-cols-2">
          {posts.map((p) => (
            <li key={String(p.slug)}>
              <article className="gradient-card gradient-card-hover flex h-full flex-col rounded-2xl border border-white/10 p-6">
                {(p.coverImage as { url?: string } | undefined)?.url ? (
                  <div className="mb-4">
                    <ContentImage
                      src={String((p.coverImage as { url?: string }).url)}
                      alt={String(p.title)}
                      size="tile"
                      frameClassName="!mx-0 w-full max-w-none"
                    />
                  </div>
                ) : null}
                <time className="text-xs font-semibold uppercase tracking-wider text-electric-blue">
                  {formatNewsDate(p.publishedAt)}
                </time>
                <h2 className="mt-3 font-display text-lg font-bold uppercase leading-snug text-ice-white">
                  <Link href={`/blogs/${p.slug}`} className="hover:text-electric-blue">
                    {String(p.title)}
                  </Link>
                </h2>
                {p.excerpt ? (
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-cool-grey">{String(p.excerpt)}</p>
                ) : null}
                <Link
                  href={`/blogs/${p.slug}`}
                  className="mt-5 text-sm font-semibold text-electric-blue hover:underline"
                >
                  Read article →
                </Link>
              </article>
            </li>
          ))}
        </ul>
      )}
    </InnerPage>
  );
}
