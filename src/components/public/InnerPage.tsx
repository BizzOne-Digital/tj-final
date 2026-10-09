"use client";

import { Reveal } from "@/components/motion/Reveal";
import { PageDriveGallery } from "@/components/public/PageDriveGallery";

export function InnerPage({
  title,
  subtitle,
  children,
  galleryImages,
  showGallery,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  galleryImages?: string[];
  showGallery?: boolean;
}) {
  const galleryOn = showGallery === true;
  return (
    <div className="relative min-h-[40vh] w-full min-w-0 overflow-x-clip border-b border-white/10">
      <div className="gradient-hero grain relative overflow-hidden border-b border-electric-blue/15">
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-electric-blue/20 via-[#020a18]/60 to-royal-blue/10"
          aria-hidden
        />
        <div className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:py-16 lg:px-6">
          <Reveal from="left">
            <h1 className="break-words font-display text-3xl font-extrabold uppercase italic tracking-tight sm:text-4xl md:text-5xl">
              <span className="gradient-text-silver">{title}</span>
            </h1>
          </Reveal>
          {subtitle && (
            <Reveal from="right" delay={0.1}>
              <p className="mt-4 max-w-2xl text-base text-cool-grey sm:text-lg">{subtitle}</p>
            </Reveal>
          )}
        </div>
      </div>
      <div className="relative mx-auto w-full max-w-7xl px-4 pb-8 pt-8 sm:pt-10 lg:px-6">
        <Reveal from="up" delay={0.15}>
          <div className="rounded-2xl border border-electric-blue/15 bg-[#020a18]/55 p-4 backdrop-blur-md sm:p-6 md:p-10">
            {galleryOn && (
              <PageDriveGallery title={title} extraImages={galleryImages} className="mb-10" />
            )}
            <div className="not-prose min-w-0 space-y-10 break-words text-cool-grey [&_a]:text-electric-blue [&_a]:hover:underline [&_h2]:font-display [&_h2]:text-lg [&_h2]:uppercase [&_h2]:text-ice-white sm:[&_h2]:text-xl [&_li]:text-cool-grey [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5">
              {children}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
