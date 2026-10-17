import { getSiteSettings } from "@/lib/services/site-settings";
import { SiteHeader } from "@/components/public/SiteHeader";
import { SiteFooter } from "@/components/public/SiteFooter";
import { MotionPreferencesProvider, ReduceMotionToggle } from "@/components/motion/MotionPreferences";
import { SiteBackdrop } from "@/components/public/SiteBackdrop";
export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  const colors = settings.colors ?? {};
  if (colors.midnightNavy) {
    // CSS variables could be overridden per CMS in future
  }

  return (
    <MotionPreferencesProvider intensity={settings.motionIntensity ?? "high"}>
      <div className="site-gradient-shell relative flex min-h-screen w-full max-w-full flex-col overflow-x-clip">
      <SiteBackdrop />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded bg-royal-blue px-3 py-2 text-white"
      >
        Skip to content
      </a>
      <div className="relative z-50">
        <SiteHeader emblemUrl={settings.brand?.emblem?.url} />
      </div>
      <main id="main" className="relative z-10 w-full min-w-0 flex-1 overflow-x-clip pb-4 max-sm:pb-20">
        {children}
      </main>
      <div className="fixed bottom-4 right-4 z-40">
        <ReduceMotionToggle />
      </div>
      <div className="relative z-10">
        <SiteFooter
          contact={settings.contact}
          hashtags={settings.headlines?.hashtags}
          tagline={settings.headlines?.secondary}
          emblemUrl={settings.brand?.emblem?.url}
        />
      </div>
      </div>
    </MotionPreferencesProvider>
  );
}
