"use client";

import { motion, useReducedMotion } from "motion/react";
import { useMotionPreferences } from "./MotionPreferences";

export function AnimatedHeading({
  lines,
  className = "",
}: {
  lines: string[];
  className?: string;
}) {
  const systemReduced = useReducedMotion();
  const { reducedMotion } = useMotionPreferences();
  const skip = reducedMotion || systemReduced;

  return (
    <h1 className={`sr-only`}>{lines.join(" ")}</h1>
  );
}

export function AnimatedHeadingVisual({
  lines,
  className = "",
}: {
  lines: string[];
  className?: string;
}) {
  const systemReduced = useReducedMotion();
  const { reducedMotion } = useMotionPreferences();
  const skip = reducedMotion || systemReduced;

  const variants = [
    {
      initial: { y: skip ? 0 : -80, rotate: skip ? 0 : -2, opacity: skip ? 1 : 0 },
      animate: { y: 0, rotate: 0, opacity: 1 },
    },
    {
      initial: { x: skip ? 0 : 90, opacity: skip ? 1 : 0 },
      animate: { x: 0, opacity: 1 },
    },
    {
      initial: { clipPath: skip ? "inset(0)" : "inset(0 0 100% 0)", opacity: skip ? 1 : 0 },
      animate: { clipPath: "inset(0)", opacity: 1 },
    },
  ];

  return (
    <div className={className} aria-hidden="true">
      {lines.map((line, i) => (
        <motion.span
          key={i}
          className="block font-display text-[clamp(2.5rem,8vw,5.5rem)] font-bold uppercase leading-[0.95] tracking-tight text-ice-white drop-shadow-[0_8px_40px_rgba(21,94,239,0.45)]"
          initial={variants[i]?.initial ?? variants[0].initial}
          animate={variants[i]?.animate ?? variants[0].animate}
          transition={{
            type: "spring",
            stiffness: 110,
            damping: 18,
            delay: i * 0.12,
          }}
        >
          {line}
        </motion.span>
      ))}
    </div>
  );
}
