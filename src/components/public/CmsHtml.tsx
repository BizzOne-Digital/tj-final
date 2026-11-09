/** Renders admin-edited (sanitised) HTML with the site's text styles. */
export function CmsHtml({
  html,
  className = "",
  as: Tag = "div",
}: {
  html: string;
  className?: string;
  as?: "div" | "span";
}) {
  if (!html?.trim()) return null;
  return (
    <Tag
      className={`cms-html min-w-0 break-words text-cool-grey [&_a]:text-electric-blue [&_a:hover]:underline [&_h3]:font-display [&_h3]:uppercase [&_h3]:text-ice-white [&_li]:text-cool-grey [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5 ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
