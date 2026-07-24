"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * The premium animation stage: a dark surface with a slowly drifting layered
 * grid, two breathing ambient glows tinted to the active category, and a soft
 * spotlight vignette. Pointer-events-none — the demo renders above it.
 */
export function Stage({ accent, children, className = "" }: { accent: string; children: React.ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <div className={`relative isolate overflow-hidden rounded-3xl border border-white/10 bg-[#08080c] ${className}`}>
      {/* drifting layered grid */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-[40%] [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:44px_44px]"
        animate={reduce ? {} : { x: [0, 22, 0], y: [0, 14, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        style={{ maskImage: "radial-gradient(ellipse 70% 70% at 50% 45%, black 30%, transparent 80%)", WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 45%, black 30%, transparent 80%)" }}
      />
      <div className="pointer-events-none absolute inset-0 [background-image:radial-gradient(circle_at_center,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:22px_22px] opacity-[0.04]" />

      {/* breathing ambient glows */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-[20%] top-[15%] h-72 w-72 rounded-full blur-[90px]"
        style={{ background: accent, opacity: 0.18 }}
        animate={reduce ? {} : { x: [0, 40, -20, 0], y: [0, -25, 20, 0], scale: [1, 1.15, 0.95, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute right-[15%] bottom-[12%] h-64 w-64 rounded-full blur-[90px]"
        style={{ background: "#22d3ee", opacity: 0.1 }}
        animate={reduce ? {} : { x: [0, -30, 15, 0], y: [0, 20, -15, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* spotlight vignette */}
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 55% at 50% 42%, transparent 35%, rgba(0,0,0,0.55) 100%)" }} />
      {/* top sheen */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      <div className="relative z-10 flex h-full w-full items-center justify-center">{children}</div>
    </div>
  );
}
