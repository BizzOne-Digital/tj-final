import sanitizeHtml from "sanitize-html";

/**
 * Admin-authored rich text is sanitised before it is stored, so a compromised
 * or low-trust editor account cannot inject scripts into the public site.
 */
const ALLOWED_TAGS = [
  "p", "br", "strong", "b", "em", "i", "u", "s", "a", "ul", "ol", "li", "h2", "h3", "h4",
  "blockquote", "hr", "span", "div", "section", "small", "sup", "sub", "code", "pre",
  "table", "thead", "tbody", "tr", "th", "td", "img",
];

export function sanitizeRichHtml(input: string): string {
  return sanitizeHtml(input, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {
      a: ["href", "target", "rel", "class", "title"],
      img: ["src", "alt", "width", "height", "class"],
      "*": ["class", "id"],
      td: ["colspan", "rowspan", "class"],
      th: ["colspan", "rowspan", "class"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: { img: ["http", "https"] },
    allowProtocolRelative: false,
    transformTags: {
      a: (tagName, attribs) => {
        const next = { ...attribs };
        if (next.target === "_blank") next.rel = "noopener noreferrer";
        return { tagName, attribs: next };
      },
    },
  });
}

/** Strip every tag (for plain text fields). */
export function sanitizePlainText(input: string): string {
  return sanitizeHtml(input, { allowedTags: [], allowedAttributes: {} })
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"');
}

/** Only allow http(s), mailto, tel and site-relative links. */
export function sanitizeUrl(input: string): string {
  const v = input.trim();
  if (!v) return "";
  if (/^(https?:\/\/|mailto:|tel:|\/(?!\/))/i.test(v)) return v;
  return "";
}
