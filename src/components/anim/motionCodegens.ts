// motionCodegens.ts — Faithful code generators for motion demo variants.
// Each generator emits a self-contained React component that matches the preview exactly.

import type { MotionOptions } from "./MotionOptionsPanel";

type CodeGen = (opts: MotionOptions) => string;

// ─────────────────────────────────────────────────────────────────────────────
// ELEMENTS
// ─────────────────────────────────────────────────────────────────────────────

const elementsDock: CodeGen = (opts) => {
  const speed = opts.speed ?? 1;
  const primary = opts.primaryColor ?? "#7c5cff";
  const accent = opts.accentColor ?? "#22d3ee";

  return `// macOS Floating Action Dock — TasteLoop Motion Component
// Category: elements
// Dependencies: framer-motion, lucide-react

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Layers, Move, RefreshCw, Zap } from "lucide-react";

const ICONS = [Search, Layers, Move, RefreshCw, Zap];
const PRIMARY = "${primary}";
const ACCENT = "${accent}";
const SPEED = ${speed};

export function FloatingDock() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [autoIdx, setAutoIdx] = useState<number | null>(null);

  useEffect(() => {
    if (hovered !== null) return;
    let i = 0;
    const id = setInterval(() => {
      setAutoIdx(i % ICONS.length);
      i++;
    }, 600 / SPEED);
    return () => clearInterval(id);
  }, [hovered]);

  const activeIdx = hovered ?? autoIdx;

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/5 p-3 backdrop-blur-xl shadow-2xl">
      {ICONS.map((Icon, idx) => {
        const isActive = activeIdx === idx;
        const isNeighbor = activeIdx !== null && Math.abs(activeIdx - idx) === 1;
        const scale = isActive ? 1.35 : isNeighbor ? 1.15 : 1;

        return (
          <motion.button
            key={idx}
            onMouseEnter={() => setHovered(idx)}
            onMouseLeave={() => setHovered(null)}
            animate={{ scale, y: isActive ? -6 : 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-md"
            style={{ backgroundImage: \`linear-gradient(135deg, \${PRIMARY}, \${ACCENT})\` }}
          >
            <Icon className="h-5 w-5" />
          </motion.button>
        );
      })}
    </div>
  );
}

export default FloatingDock;
`;
};

const elementsBlackhole: CodeGen = (opts) => {
  const speed = opts.speed ?? 1;
  const primary = opts.primaryColor ?? "#a855f7";

  return `// Black Hole Gravity — TasteLoop Motion Component
// Category: elements
// Dependencies: framer-motion

"use client";

import { motion } from "framer-motion";

const PRIMARY = "${primary}";
const SPEED = ${speed};

export function BlackHoleGravity() {
  return (
    <div className="relative flex h-52 w-80 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#050508] shadow-2xl">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 6 / SPEED, repeat: Infinity, ease: "linear" }}
        className="h-24 w-24 rounded-full border-2 border-dashed p-2"
        style={{ borderColor: \`\${PRIMARY}80\` }}
      >
        <div
          className="h-full w-full rounded-full"
          style={{
            backgroundImage: \`radial-gradient(circle at 30% 30%, \${PRIMARY}60, #050508)\`,
            boxShadow: \`0 0 30px \${PRIMARY}\`,
          }}
        />
      </motion.div>
    </div>
  );
}

export default BlackHoleGravity;
`;
};

const elementsJuice: CodeGen = (opts) => {
  const primary = opts.primaryColor ?? "#7c5cff";
  const accent = opts.accentColor ?? "#22d3ee";

  return `// Juice Elastic Bounce Button — TasteLoop Motion Component
// Category: elements
// Dependencies: framer-motion, lucide-react

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";

const PRIMARY = "${primary}";
const ACCENT = "${accent}";

export function JuiceButton() {
  const [phase, setPhase] = useState<"idle" | "bounce">("idle");

  return (
    <motion.button
      onClick={() => { setPhase("bounce"); setTimeout(() => setPhase("idle"), 600); }}
      whileTap={{ scale: 0.85, rotate: -4 }}
      animate={phase === "bounce" ? { scale: [1, 1.18, 0.95, 1.05, 1] } : { scale: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 12 }}
      className="flex items-center gap-2 rounded-2xl px-6 py-3 font-mono text-xs font-bold text-black shadow-xl"
      style={{ backgroundImage: \`linear-gradient(to right, \${PRIMARY}, \${ACCENT})\` }}
    >
      <Zap className="h-4 w-4 fill-current" /> JUICE ELASTIC BOUNCE
    </motion.button>
  );
}

export default JuiceButton;
`;
};

const elementsAccordion: CodeGen = (opts) => {
  const speed = opts.speed ?? 1;
  const primary = opts.primaryColor ?? "#7c5cff";

  return `// Accordion Expand — TasteLoop Motion Component
// Category: elements
// Dependencies: framer-motion

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PRIMARY = "${primary}";
const SPEED = ${speed};

const ITEMS = [
  { title: "What is TasteLoop?", body: "A founder-led product partner combining AI speed with human judgment." },
  { title: "How does First Loop work?", body: "Turn one important decision into a working direction in 3 days." },
  { title: "What is Product Loop?", body: "One important product outcome per month, shipped iteratively." },
];

export function AccordionExpand() {
  const [open, setOpen] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setOpen((o) => (o + 1) % ITEMS.length), 1800 / SPEED);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="w-72 overflow-hidden rounded-xl border border-white/10 bg-white/5 p-3">
      {ITEMS.map((item, i) => (
        <div key={i} className="mb-1.5 overflow-hidden rounded-lg border border-white/8 bg-white/5">
          <button
            onClick={() => setOpen(i)}
            className="flex w-full items-center justify-between px-3 py-2 text-left"
          >
            <span className="font-mono text-[11px] font-semibold text-white/90">{item.title}</span>
            <motion.span
              animate={{ rotate: open === i ? 45 : 0 }}
              transition={{ duration: 0.2 }}
              className="font-mono text-sm"
              style={{ color: PRIMARY }}
            >
              +
            </motion.span>
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 / SPEED, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="px-3 pb-2 font-mono text-[10px] text-white/50">{item.body}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

export default AccordionExpand;
`;
};

const elementsBadge: CodeGen = (opts) => {
  const speed = opts.speed ?? 1;
  const primary = opts.primaryColor ?? "#10b981";

  return `// Spring Status Badge — TasteLoop Motion Component
// Category: elements
// Dependencies: framer-motion

"use client";

import { motion } from "framer-motion";

const PRIMARY = "${primary}";
const SPEED = ${speed};

export function SpringStatusBadge() {
  return (
    <motion.div
      animate={{ scale: [1, 1.08, 1] }}
      transition={{ duration: 2 / SPEED, repeat: Infinity, ease: "easeInOut" }}
      className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 font-mono text-xs font-bold shadow-lg"
      style={{
        borderColor: \`\${PRIMARY}66\`,
        backgroundColor: \`\${PRIMARY}1a\`,
        color: PRIMARY,
      }}
    >
      <span className="h-2 w-2 rounded-full animate-ping" style={{ backgroundColor: PRIMARY }} />
      SPRING STATUS BADGE
    </motion.div>
  );
}

export default SpringStatusBadge;
`;
};

// ─────────────────────────────────────────────────────────────────────────────
// CURSOR
// ─────────────────────────────────────────────────────────────────────────────

const cursorKinetic: CodeGen = (opts) => {
  const speed = opts.speed ?? 1;
  const primary = opts.primaryColor ?? "#22d3ee";
  const accent = opts.accentColor ?? "#7c5cff";

  return `// Kinetic Grid Cursor — TasteLoop Motion Component
// Category: cursor
// Move your mouse over the grid to see the dots react.
// Dependencies: framer-motion

"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

const PRIMARY = "${primary}";
const ACCENT = "${accent}";
const SPEED = ${speed};
const ROWS = 6;
const COLS = 9;

export function KineticGridCursor() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [autoAngle, setAutoAngle] = useState(0);

  useEffect(() => {
    if (mousePos) return;
    const id = setInterval(() => setAutoAngle((a) => a + 2 * SPEED), 30);
    return () => clearInterval(id);
  }, [mousePos]);

  const autoX = 140 + 80 * Math.cos((autoAngle * Math.PI) / 180);
  const autoY = 110 + 60 * Math.sin((autoAngle * Math.PI) / 180);
  const cursorX = mousePos?.x ?? autoX;
  const cursorY = mousePos?.y ?? autoY;

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!containerRef.current) return;
    const r = containerRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - r.left, y: e.clientY - r.top });
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMousePos(null)}
      className="relative flex h-52 w-80 cursor-none items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#07060a] p-4 shadow-2xl"
    >
      <div className="grid grid-cols-9 gap-3.5">
        {Array.from({ length: ROWS * COLS }).map((_, i) => {
          const row = Math.floor(i / COLS);
          const col = i % COLS;
          const dotX = col * 30 + 15;
          const dotY = row * 30 + 15;
          const dist = Math.hypot(cursorX - dotX, cursorY - dotY);
          const maxDist = 90;
          const scale = dist < maxDist ? 1 + (1 - dist / maxDist) * 1.6 : 1;
          const opacity = dist < maxDist ? 1 : 0.35;
          const color = dist < maxDist ? PRIMARY : ACCENT;

          return (
            <motion.div
              key={i}
              animate={{ scale, opacity }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: color }}
            />
          );
        })}
      </div>
      <div
        className="pointer-events-none absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border"
        style={{
          left: cursorX,
          top: cursorY,
          borderColor: PRIMARY,
          backgroundColor: \`\${PRIMARY}33\`,
          boxShadow: \`0 0 15px \${PRIMARY}\`,
        }}
      />
    </div>
  );
}

export default KineticGridCursor;
`;
};

const cursorFluidTrail: CodeGen = (opts) => {
  const speed = opts.speed ?? 1;
  const primary = opts.primaryColor ?? "#a855f7";
  const accent = opts.accentColor ?? "#22d3ee";

  return `// Fluid Trail Cursor — TasteLoop Motion Component
// Category: cursor
// Move your mouse over the card to emit a fluid particle trail.
// Dependencies: framer-motion

"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PRIMARY = "${primary}";
const ACCENT = "${accent}";
const SPEED = ${speed};

export function FluidTrailCursor() {
  const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const counter = useRef(0);
  const autoAngle = useRef(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const id = setInterval(() => {
      autoAngle.current += 2.5 * SPEED;
      const cx = 160, cy = 104;
      const x = cx + 90 * Math.cos((autoAngle.current * Math.PI) / 180);
      const y = cy + 60 * Math.sin((autoAngle.current * Math.PI) / 180);
      const trailId = ++counter.current;
      setTrail((prev) => [...prev.slice(-12), { x, y, id: trailId }]);
    }, 40);
    return () => clearInterval(id);
  }, [isHovered]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!containerRef.current) return;
    const r = containerRef.current.getBoundingClientRect();
    setTrail((prev) => [...prev.slice(-12), { x: e.clientX - r.left, y: e.clientY - r.top, id: ++counter.current }]);
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setTrail([]); }}
      className="relative h-52 w-80 cursor-none overflow-hidden rounded-2xl border border-white/10 bg-[#0d0c14] shadow-2xl"
    >
      <AnimatePresence>
        {trail.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0.8, scale: 1 }}
            animate={{ opacity: 0, scale: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 / SPEED }}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
            style={{
              left: p.x, top: p.y,
              width: \`\${12 + i * 1.5}px\`,
              height: \`\${12 + i * 1.5}px\`,
              backgroundImage: \`radial-gradient(circle, \${PRIMARY}, \${ACCENT})\`,
              filter: "blur(3px)",
            }}
          />
        ))}
      </AnimatePresence>
      <div className="absolute bottom-3 left-3 font-mono text-[10px] text-white/40">FLUID TRAIL</div>
    </div>
  );
}

export default FluidTrailCursor;
`;
};

const cursorAxis: CodeGen = (opts) => {
  const speed = opts.speed ?? 1;
  const primary = opts.primaryColor ?? "#7c5cff";
  const accent = opts.accentColor ?? "#22d3ee";

  return `// Axis Cursor Lines — TasteLoop Motion Component
// Category: cursor

"use client";

import { useRef, useState, useEffect } from "react";

const PRIMARY = "${primary}";
const ACCENT = "${accent}";
const SPEED = ${speed};

export function AxisCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 160, y: 104 });
  const autoAngle = useRef(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (hovered) return;
    const id = setInterval(() => {
      autoAngle.current += 1.5 * SPEED;
      setPos({
        x: 160 + 80 * Math.cos((autoAngle.current * Math.PI) / 180),
        y: 104 + 55 * Math.sin((autoAngle.current * Math.PI) / 180),
      });
    }, 30);
    return () => clearInterval(id);
  }, [hovered]);

  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        if (!ref.current) return;
        const r = ref.current.getBoundingClientRect();
        setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative h-52 w-80 cursor-none overflow-hidden rounded-2xl border border-white/15 bg-[#0a0a0f] shadow-2xl"
    >
      <div className="pointer-events-none absolute left-0 right-0 h-px" style={{ top: pos.y, backgroundImage: \`linear-gradient(to right, transparent, \${PRIMARY}80, \${PRIMARY}, \${PRIMARY}80, transparent)\` }} />
      <div className="pointer-events-none absolute top-0 bottom-0 w-px" style={{ left: pos.x, backgroundImage: \`linear-gradient(to bottom, transparent, \${ACCENT}80, \${ACCENT}, \${ACCENT}80, transparent)\` }} />
      <div className="pointer-events-none absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ left: pos.x, top: pos.y, backgroundColor: PRIMARY, boxShadow: \`0 0 12px \${PRIMARY}\` }} />
      <div className="absolute bottom-3 left-3 font-mono text-[10px] text-white/40">AXIS CURSOR</div>
    </div>
  );
}

export default AxisCursor;
`;
};

const cursorClickEffects: CodeGen = (opts) => {
  const speed = opts.speed ?? 1;
  const primary = opts.primaryColor ?? "#f59e0b";
  const accent = opts.accentColor ?? "#ec4899";

  return `// Click Effects Burst — TasteLoop Motion Component
// Category: cursor
// Click anywhere on the card to trigger burst particles.
// Dependencies: framer-motion

"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PRIMARY = "${primary}";
const ACCENT = "${accent}";
const SPEED = ${speed};

export function ClickEffectsBurst() {
  const counter = useRef(0);
  const [bursts, setBursts] = useState<{ id: number; x: number; y: number }[]>([]);

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    const id = ++counter.current;
    setBursts((p) => [...p, { id, x: e.clientX - r.left, y: e.clientY - r.top }]);
    setTimeout(() => setBursts((p) => p.filter((b) => b.id !== id)), 700);
  }

  return (
    <div
      onClick={handleClick}
      className="relative flex h-52 w-80 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#0d0c14] shadow-2xl select-none"
    >
      <AnimatePresence>
        {bursts.map((b) => (
          <div key={b.id} className="pointer-events-none absolute" style={{ left: b.x, top: b.y }}>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{ x: Math.cos((i * 45 * Math.PI) / 180) * 40, y: Math.sin((i * 45 * Math.PI) / 180) * 40, opacity: 0, scale: 0 }}
                transition={{ duration: 0.5 / SPEED, ease: "easeOut" }}
                className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{ backgroundColor: i % 2 === 0 ? PRIMARY : ACCENT }}
              />
            ))}
          </div>
        ))}
      </AnimatePresence>
      <span className="font-mono text-xs text-white/40 select-none">CLICK ANYWHERE</span>
    </div>
  );
}

export default ClickEffectsBurst;
`;
};

const cursorMagnetic: CodeGen = (opts) => {
  const speed = opts.speed ?? 1;
  const primary = opts.primaryColor ?? "#7c5cff";
  const accent = opts.accentColor ?? "#22d3ee";

  return `// Magnetic Cursor Button — TasteLoop Motion Component
// Category: cursor
// Hover the button to see the magnetic pull effect.
// Dependencies: framer-motion

"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

const PRIMARY = "${primary}";
const ACCENT = "${accent}";
const SPEED = ${speed};

export function MagneticCursorButton() {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const autoAngle = useRef(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (hovered) return;
    const id = setInterval(() => {
      autoAngle.current += 1.2 * SPEED;
      setPos({ x: Math.sin((autoAngle.current * Math.PI) / 180) * 8, y: Math.cos((autoAngle.current * Math.PI) / 180) * 5 });
    }, 30);
    return () => clearInterval(id);
  }, [hovered]);

  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        if (!ref.current) return;
        const r = ref.current.getBoundingClientRect();
        setPos({ x: ((e.clientX - r.left) - r.width / 2) * 0.4, y: ((e.clientY - r.top) - r.height / 2) * 0.4 });
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPos({ x: 0, y: 0 }); }}
      className="flex h-52 w-80 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#0d0c14] shadow-2xl"
    >
      <motion.button
        animate={{ x: pos.x, y: pos.y }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="rounded-2xl px-8 py-4 font-mono text-sm font-bold text-white shadow-2xl"
        style={{ backgroundImage: \`linear-gradient(135deg, \${PRIMARY}, \${ACCENT})\`, boxShadow: \`0 0 30px \${PRIMARY}40\` }}
      >
        MAGNETIC PULL
      </motion.button>
    </div>
  );
}

export default MagneticCursorButton;
`;
};

const cursorSpotlight: CodeGen = (opts) => {
  const primary = opts.primaryColor ?? "#fbbf24";
  const accent = opts.accentColor ?? "#7c5cff";
  const glowIntensity = opts.glowIntensity ?? 20;
  const borderRadius = opts.borderRadius ?? 16;
  const speed = opts.speed ?? 1;

  return `// Spotlight Track Cursor — TasteLoop Motion Component
// Category: cursor

"use client";

import { useRef, useState, useEffect } from "react";

const PRIMARY = "${primary}";
const ACCENT = "${accent}";
const GLOW = ${glowIntensity};
const SPEED = ${speed};

export function SpotlightTrackCursor() {
  const [pos, setPos] = useState({ x: 160, y: 104 });
  const [hovered, setHovered] = useState(false);
  const autoAngle = useRef(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hovered) return;
    const id = setInterval(() => {
      autoAngle.current += 1.5 * SPEED;
      setPos({ x: 160 + 80 * Math.cos((autoAngle.current * Math.PI) / 180), y: 104 + 50 * Math.sin((autoAngle.current * Math.PI) / 180) });
    }, 30);
    return () => clearInterval(id);
  }, [hovered]);

  return (
    <div
      ref={ref}
      onMouseMove={(e) => { if (!ref.current) return; const r = ref.current.getBoundingClientRect(); setPos({ x: e.clientX - r.left, y: e.clientY - r.top }); }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative h-52 w-80 cursor-none overflow-hidden border border-white/10 bg-[#07060a] shadow-2xl"
      style={{ borderRadius: ${borderRadius} }}
    >
      <div
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full blur-md"
        style={{ left: pos.x, top: pos.y, width: \`\${GLOW * 6}px\`, height: \`\${GLOW * 6}px\`, backgroundImage: \`radial-gradient(circle, \${PRIMARY}66 0%, \${ACCENT}26 50%, transparent 80%)\` }}
      />
      <div className="absolute bottom-3 left-3 font-mono text-[10px] text-white/40">SPOTLIGHT</div>
    </div>
  );
}

export default SpotlightTrackCursor;
`;
};

// ─────────────────────────────────────────────────────────────────────────────
// BACKGROUND
// ─────────────────────────────────────────────────────────────────────────────

const backgroundPixelCard: CodeGen = (opts) => {
  const speed = opts.speed ?? 1;
  const primary = opts.primaryColor ?? "#22d3ee";

  return `// Pixel Card Background — TasteLoop Motion Component
// Category: background
// Dependencies: framer-motion

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const PRIMARY = "${primary}";
const SPEED = ${speed};

export function PixelCardBackground() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [autoIdx, setAutoIdx] = useState<number | null>(null);

  useEffect(() => {
    if (hoveredIdx !== null) return;
    let i = 0;
    const id = setInterval(() => { setAutoIdx(i % 40); i++; }, 120 / SPEED);
    return () => clearInterval(id);
  }, [hoveredIdx]);

  const activeIdx = hoveredIdx ?? autoIdx;

  return (
    <div className="relative grid h-52 w-80 grid-cols-8 grid-rows-5 gap-1 overflow-hidden rounded-2xl border border-white/10 bg-[#07060a] p-2 shadow-2xl">
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.div
          key={i}
          onMouseEnter={() => setHoveredIdx(i)}
          onMouseLeave={() => setHoveredIdx(null)}
          animate={{ backgroundColor: activeIdx === i ? PRIMARY : "rgba(255,255,255,0.04)", scale: activeIdx === i ? 1.1 : 1 }}
          transition={{ duration: 0.15 }}
          className="rounded-md"
        />
      ))}
    </div>
  );
}

export default PixelCardBackground;
`;
};

const backgroundChromatic: CodeGen = (opts) => {
  const speed = opts.speed ?? 1;
  const primary = opts.primaryColor ?? "#7c5cff";
  const accent = opts.accentColor ?? "#22d3ee";

  return `// Chromatic Wave Background — TasteLoop Motion Component
// Category: background
// Dependencies: framer-motion

"use client";

import { motion } from "framer-motion";

const PRIMARY = "${primary}";
const ACCENT = "${accent}";
const SPEED = ${speed};

export function ChromaticWaveBackground() {
  return (
    <div className="relative h-52 w-80 overflow-hidden rounded-2xl border border-white/10 bg-[#05050a] shadow-2xl">
      <motion.div
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 6 / SPEED, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage: \`linear-gradient(120deg, \${PRIMARY}, \${ACCENT}, #ec4899, \${PRIMARY})\`,
          backgroundSize: "300% 300%",
          filter: "blur(30px)",
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center font-mono text-xs font-bold text-white">
        CHROMATIC SHADER
      </div>
    </div>
  );
}

export default ChromaticWaveBackground;
`;
};

const backgroundAurora: CodeGen = (opts) => {
  const speed = opts.speed ?? 1;
  const primary = opts.primaryColor ?? "#7c5cff";
  const accent = opts.accentColor ?? "#22d3ee";

  return `// Aurora Mesh Background — TasteLoop Motion Component
// Category: background
// Dependencies: framer-motion

"use client";

import { motion } from "framer-motion";

const PRIMARY = "${primary}";
const ACCENT = "${accent}";
const SPEED = ${speed};

export function AuroraMeshBackground() {
  return (
    <div className="relative h-52 w-80 overflow-hidden rounded-2xl border border-white/10 bg-[#0d0c14] shadow-2xl">
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 4 / SPEED, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-10 -left-10 h-40 w-40 rounded-full blur-2xl"
        style={{ backgroundColor: \`\${PRIMARY}66\` }}
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 5 / SPEED, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full blur-2xl"
        style={{ backgroundColor: \`\${ACCENT}66\` }}
      />
      <div className="absolute inset-0 flex items-center justify-center font-mono text-xs font-bold text-white">
        AURORA MESH PULSE
      </div>
    </div>
  );
}

export default AuroraMeshBackground;
`;
};

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATIONS
// ─────────────────────────────────────────────────────────────────────────────

const animationsGlitter: CodeGen = (opts) => {
  const speed = opts.speed ?? 1;
  const primary = opts.primaryColor ?? "#a855f7";
  const accent = opts.accentColor ?? "#22d3ee";

  return `// Glitter Wrap — TasteLoop Motion Component
// Category: animations
// Dependencies: framer-motion, lucide-react

"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const PRIMARY = "${primary}";
const ACCENT = "${accent}";
const SPEED = ${speed};

export function GlitterWrap() {
  return (
    <div className="relative flex h-48 w-72 items-center justify-center overflow-hidden rounded-2xl border border-purple-500/30 bg-[#0c0b14] p-6 shadow-2xl">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 4 / SPEED, repeat: Infinity, ease: "linear" }}
        className="absolute inset-[-50%] origin-center opacity-80"
        style={{
          backgroundImage: \`conic-gradient(from 0deg, transparent 0 300deg, \${PRIMARY} 330deg, \${ACCENT} 360deg)\`,
          filter: "blur(10px)",
        }}
      />
      <div className="absolute inset-0.5 flex flex-col items-center justify-center rounded-[14px] bg-[#0d0c14] p-4 text-center">
        <Sparkles className="mb-2 h-6 w-6 animate-pulse" style={{ color: PRIMARY }} />
        <span className="font-mono text-xs font-bold text-white">GLITTER WRAP</span>
        <span className="mt-1 font-mono text-[10px] text-white/40">Sparkle border trail animation</span>
      </div>
    </div>
  );
}

export default GlitterWrap;
`;
};

// ─────────────────────────────────────────────────────────────────────────────
// IMAGE
// ─────────────────────────────────────────────────────────────────────────────

const imagePixelDissolve: CodeGen = (opts) => {
  const speed = opts.speed ?? 1;
  const borderRadius = opts.borderRadius ?? 16;
  const primary = opts.primaryColor ?? "#22d3ee";

  return `// Pixel Grid Dissolve — TasteLoop Motion Component
// Category: image
// Dependencies: framer-motion

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const IMAGE_URL = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80";
const PRIMARY = "${primary}";
const SPEED = ${speed};
const BORDER_RADIUS = ${borderRadius};
const GRID_COLS = 10;
const GRID_ROWS = 7;
const TOTAL = GRID_COLS * GRID_ROWS;

export function PixelGridDissolve() {
  const [isRevealed, setIsRevealed] = useState(false);
  const [revealedCells, setRevealedCells] = useState<number[]>([]);

  useEffect(() => {
    const id = setInterval(() => {
      setIsRevealed((v) => {
        const next = !v;
        if (next) {
          const order = Array.from({ length: TOTAL }, (_, i) => i).sort(() => Math.random() - 0.5);
          order.forEach((cell, i) => {
            setTimeout(() => setRevealedCells((p) => [...p, cell]), i * (30 / SPEED));
          });
          setTimeout(() => setRevealedCells([]), (TOTAL * 30) / SPEED + 800 / SPEED);
        } else {
          setRevealedCells([]);
        }
        return next;
      });
    }, 3000 / SPEED);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative h-48 w-72 overflow-hidden shadow-2xl border border-white/10" style={{ borderRadius: BORDER_RADIUS }}>
      <img src={IMAGE_URL} alt="Mountain" className="h-full w-full object-cover" />
      <motion.div
        animate={{ opacity: isRevealed ? 0 : 0.85 }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0 bg-[#0d0c14]"
        style={{ backgroundImage: \`radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)\`, backgroundSize: "8px 8px" }}
      />
    </div>
  );
}

export default PixelGridDissolve;
`;
};

// ─────────────────────────────────────────────────────────────────────────────
// LOOKUP TABLE
// ─────────────────────────────────────────────────────────────────────────────

export const MOTION_CODEGENS: Record<string, Record<string, CodeGen>> = {
  elements: {
    dock: elementsDock,
    blackhole: elementsBlackhole,
    juice: elementsJuice,
    accordion: elementsAccordion,
    badge: elementsBadge,
    "": elementsBadge,
  },
  cursor: {
    kineticgrid: cursorKinetic,
    kinetic: cursorKinetic,
    fluidtrail: cursorFluidTrail,
    fluid: cursorFluidTrail,
    axiscursor: cursorAxis,
    axis: cursorAxis,
    clickeffects: cursorClickEffects,
    click: cursorClickEffects,
    magnetic: cursorMagnetic,
    usercursor: cursorSpotlight,
    user: cursorSpotlight,
    spotlight: cursorSpotlight,
    "": cursorSpotlight,
  },
  background: {
    pixelcard: backgroundPixelCard,
    chromatic: backgroundChromatic,
    aurora: backgroundAurora,
    "": backgroundAurora,
  },
  animations: {
    glitterwrap: animationsGlitter,
    glitter: animationsGlitter,
    "": animationsGlitter,
  },
  image: {
    pixelated: imagePixelDissolve,
    "pixel-dissolve": imagePixelDissolve,
    "": imagePixelDissolve,
  },
};

export function getMotionCode(
  category: string,
  variant: string,
  opts: MotionOptions
): string | null {
  const categoryGens = MOTION_CODEGENS[category];
  if (!categoryGens) return null;
  const gen = categoryGens[variant] ?? categoryGens[""];
  if (!gen) return null;
  return gen(opts);
}
