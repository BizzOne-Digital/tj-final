"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";

export function MagneticButton({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
}) {
  const reduced = useReducedMotion();
  const base =
    variant === "primary"
      ? "gradient-cta text-white"
      : "border border-electric-blue/35 bg-gradient-to-r from-white/10 to-electric-blue/5 text-ice-white backdrop-blur";

  return (
    <motion.div
      whileHover={reduced ? {} : { scale: 1.03 }}
      whileTap={reduced ? {} : { scale: 0.98 }}
      className="group relative inline-flex"
    >
      <Link
        href={href}
        className={`relative inline-flex items-center gap-2 overflow-hidden rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-wide ${base}`}
      >
        <span
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full"
          aria-hidden
        />
        {children}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </motion.div>
  );
}
