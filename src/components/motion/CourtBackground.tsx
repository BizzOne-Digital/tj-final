"use client";

import { motion, useReducedMotion } from "motion/react";

export function CourtBackground() {
  const reduced = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <svg
        className="absolute -left-1/4 top-1/3 h-[140%] w-[150%] opacity-[0.12]"
        viewBox="0 0 800 600"
        fill="none"
      >
        <motion.path
          d="M80 520 H720 M400 80 V520 M120 200 Q400 320 680 200"
          stroke="currentColor"
          strokeWidth="2"
          className="text-electric-blue"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: reduced ? 0 : 2.2,
            ease: "easeInOut",
          }}
        />
      </svg>
      {!reduced && (
        <motion.div
          className="absolute -right-20 top-10 h-64 w-64 rounded-full bg-electric-blue/20 blur-3xl"
          animate={{ x: [0, 30, 0], opacity: [0.3, 0.55, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </div>
  );
}
