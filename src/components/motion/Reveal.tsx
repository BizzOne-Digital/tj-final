"use client";

import { motion, useReducedMotion } from "motion/react";
import { useMotionPreferences } from "./MotionPreferences";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  from?: "up" | "down" | "left" | "right";
  delay?: number;
  as?: "div" | "section" | "article";
};

export function Reveal({
  children,
  className,
  from = "up",
  delay = 0,
  as = "div",
}: RevealProps) {
  const systemReduced = useReducedMotion();
  const { reducedMotion, intensity } = useMotionPreferences();

  const distance =
    reducedMotion || systemReduced
      ? 0
      : intensity === "high"
        ? 72
        : intensity === "medium"
          ? 48
          : 24;

  const offset = {
    up: { y: distance, x: 0 },
    down: { y: -distance, x: 0 },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
  }[from];

  const Component = motion[as];

  const visible = { opacity: 1, x: 0, y: 0 };

  return (
    <Component
      className={`min-w-0 max-w-full ${className ?? ""}`.trim()}
      initial={{ opacity: reducedMotion || systemReduced ? 1 : 0, ...offset }}
      animate={visible}
      whileInView={visible}
      viewport={{ once: true, margin: "-8%" }}
      transition={{
        type: "spring",
        stiffness: 120,
        damping: 22,
        delay: reducedMotion || systemReduced ? 0 : delay,
      }}
    >
      {children}
    </Component>
  );
}
