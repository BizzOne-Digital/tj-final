/** CMS / HTML copy — keep separate from media so images are not affected by typography. */
export function ProseBlock({
  html,
  className = "",
}: {
  html: string;
  className?: string;
}) {
  if (!html?.trim()) return null;
  return (
    <div
      className={`prose-block prose prose-invert min-w-0 max-w-3xl break-words prose-p:text-cool-grey prose-headings:font-display prose-headings:uppercase prose-a:text-electric-blue ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
