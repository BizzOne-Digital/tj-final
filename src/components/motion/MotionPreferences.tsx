"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type MotionPrefs = {
  reducedMotion: boolean;
  userReduced: boolean;
  setUserReduced: (v: boolean) => void;
  intensity: "high" | "medium" | "low";
};

const MotionContext = createContext<MotionPrefs | null>(null);

export function MotionPreferencesProvider({
  intensity = "high",
  children,
}: {
  intensity?: "high" | "medium" | "low";
  children: React.ReactNode;
}) {
  const [systemReduced, setSystemReduced] = useState(false);
  const [userReduced, setUserReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setSystemReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const reducedMotion = systemReduced || userReduced;

  const value = useMemo(
    () => ({
      reducedMotion,
      userReduced,
      setUserReduced,
      intensity: reducedMotion ? "low" : intensity,
    }),
    [reducedMotion, userReduced, intensity],
  );

  return (
    <MotionContext.Provider value={value}>{children}</MotionContext.Provider>
  );
}

export function useMotionPreferences() {
  const ctx = useContext(MotionContext);
  if (!ctx) {
    return {
      reducedMotion: false,
      userReduced: false,
      setUserReduced: () => {},
      intensity: "high" as const,
    };
  }
  return ctx;
}

export function ReduceMotionToggle() {
  const { userReduced, setUserReduced, reducedMotion } = useMotionPreferences();
  return (
    <button
      type="button"
      onClick={() => setUserReduced(!userReduced)}
      className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs text-ice-white/90 backdrop-blur hover:bg-white/10"
      aria-pressed={reducedMotion}
    >
      {userReduced ? "Motion: Reduced" : "Reduce motion"}
    </button>
  );
}
