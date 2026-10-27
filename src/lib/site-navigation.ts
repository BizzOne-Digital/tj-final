export type NavItem = { href: string; label: string };

export const PRIMARY_NAV: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/teams", label: "Teams" },
  { href: "/schedules", label: "Schedules" },
  { href: "/contact", label: "Contact" },
];

export const LEAGUE_MENU: NavItem[] = [
  { href: "/information", label: "Information Hub" },
  { href: "/information/how-can-we-be-better", label: "How Can We Be Better?" },
  { href: "/team-directory", label: "Team Directory" },
  { href: "/standings", label: "League Standings" },
  { href: "/scores", label: "Scores" },
  { href: "/playoffs", label: "Playoffs" },
  { href: "/streaming", label: "Streaming" },
  { href: "/awards", label: "Awards & Championships" },
  { href: "/all-stars", label: "League All Stars & Games" },
  { href: "/state-championship", label: "Golden Ticket" },
  { href: "/central-pa-lions", label: "Central PA Lions (AAU)" },
  { href: "/gear-store", label: "Gear Store" },
  { href: "/sponsorship", label: "Team Sponsor" },
  { href: "/picture-day", label: "Picture Day" },
];
