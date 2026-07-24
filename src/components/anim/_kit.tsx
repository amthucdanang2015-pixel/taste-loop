"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
export { motion, AnimatePresence, useReducedMotion } from "framer-motion";

export const COLORS = ["#7c5cff", "#22d3ee", "#ec4899", "#f59e0b", "#10b981", "#6366f1"];

/** Re-fires a key on an interval so one-shot demos keep replaying (great for recording). */
export function useReplay(ms = 2800): number {
  const [n, setN] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setN((v) => v + 1), ms);
    return () => clearInterval(id);
  }, [ms, reduce]);
  return n;
}

/** A cohesive demo chip used across families. */
export function Chip({
  className = "",
  style,
  children,
  i = 0,
}: {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  i?: number;
}) {
  return (
    <div
      className={`flex items-center justify-center rounded-2xl text-sm font-semibold text-white shadow-lg ${className}`}
      style={{ background: `linear-gradient(135deg, ${COLORS[i % COLORS.length]}, ${COLORS[(i + 1) % COLORS.length]})`, ...style }}
    >
      {children}
    </div>
  );
}

/** Centers a demo in the stage. */
export function Center({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`flex h-full w-full items-center justify-center ${className}`}>{children}</div>;
}

export const SPRING = { type: "spring" as const, stiffness: 300, damping: 22 };
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
