export type AdminRole = "owner" | "editor";

export const OWNER_MODULES = [
  "dashboard",
  "brand",
  "header-footer",
  "pages",
  "home-hero",
  "league-settings",
  "seasons",
  "schools",
  "events-games",
  "standings-playoffs",
  "awards",
  "gallery",
  "resources",
  "news",
  "faq-testimonials",
  "leadership",
  "registrations",
  "sponsors",
  "related-program",
  "contact",
  "archives",
  "seo-access",
  "audit",
] as const;

export type AdminModule = (typeof OWNER_MODULES)[number];

const EDITOR_DENIED: AdminModule[] = [
  "seo-access",
  "audit",
  "registrations",
  "contact",
];

export function canAccessModule(role: AdminRole, module: AdminModule): boolean {
  if (role === "owner") return true;
  return !EDITOR_DENIED.includes(module);
}
