"use client";

import { useEffect, useState, useRef } from "react";
export { motion, AnimatePresence } from "framer-motion";

export const COLORS = ["#7c5cff", "#22d3ee", "#ec4899", "#f59e0b", "#10b981", "#6366f1"];

/** Safe SSR hook for reduced motion */
export function useReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mediaQuery.matches);
    const handler = () => setReduce(mediaQuery.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);
  return reduce;
}

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

/** 
 * Dynamically scales fixed-size components to fit the available space while preserving aspect ratio. 
 * Allows legacy pixel-perfect math (like tracking cursors) to behave as if they are fully responsive!
 */
export function ScaledCenter({
  children,
  baseWidth = 320,
  baseHeight = 208,
  className = "",
}: {
  children: React.ReactNode;
  baseWidth?: number;
  baseHeight?: number;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        // 95% of available space to leave a tiny bit of breathing room if needed, or 100% to match Gallery.
        // We'll use 100% to perfectly match the flex container's bounds.
        const scaleX = width / baseWidth;
        const scaleY = height / baseHeight;
        setScale(Math.min(scaleX, scaleY));
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [baseWidth, baseHeight]);

  return (
    <div ref={containerRef} className={`flex h-full w-full items-center justify-center overflow-hidden ${className}`}>
      <div
        style={{
          width: baseWidth,
          height: baseHeight,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
        className="flex shrink-0 items-center justify-center relative"
      >
        {children}
      </div>
    </div>
  );
}
