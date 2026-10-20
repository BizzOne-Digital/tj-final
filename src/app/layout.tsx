import type { Metadata } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import { OG_SHARE_HEIGHT, OG_SHARE_IMAGE, OG_SHARE_WIDTH } from "@/lib/brand-assets";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const siteDescription =
  "Philipsburg-Osceola Select Elementary Basketball League — school-based winter basketball for grades 3-6.";

const display = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "P-O Select Elementary Basketball League",
    template: "%s | P-O Select League",
  },
  description: siteDescription,
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "P-O Select League",
    title: "P-O Select Elementary Basketball League",
    description: siteDescription,
    images: [
      {
        url: OG_SHARE_IMAGE,
        width: OG_SHARE_WIDTH,
        height: OG_SHARE_HEIGHT,
        alt: "P-O Select Elementary Winter Basketball League",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "P-O Select Elementary Basketball League",
    description: siteDescription,
    images: [OG_SHARE_IMAGE],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} h-full overflow-x-clip`}>
      <body className="min-h-full overflow-x-clip font-sans antialiased">{children}</body>
    </html>
  );
}
