import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/services/league";
import { InnerPage } from "@/components/public/InnerPage";
import { ContentImage } from "@/components/public/ContentImage";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();
  const coverUrl = (post as { coverImage?: { url?: string } }).coverImage?.url;
  return (
    <InnerPage title={String(post.title)} subtitle={post.excerpt ? String(post.excerpt) : undefined}>
      {coverUrl ? (
        <div className="mb-8 max-w-2xl">
          <ContentImage
            src={coverUrl}
            alt={String(post.title)}
            size="wide"
            frameClassName="!mx-0 w-full max-w-none"
          />
        </div>
      ) : null}
      <div
        className="prose prose-invert max-w-none text-cool-grey prose-headings:font-display prose-headings:uppercase prose-headings:text-ice-white prose-a:text-electric-blue"
        dangerouslySetInnerHTML={{ __html: String(post.contentHtml ?? "") }}
      />
      <Link href="/blogs" className="mt-8 inline-block text-electric-blue hover:underline">
        ← All news
      </Link>
    </InnerPage>
  );
}
