"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { BorderOptions } from "./BorderOptionsPanel";
import type { ButtonOptions } from "./ButtonOptionsPanel";
import { DEFAULT_BORDER_OPTIONS } from "./BorderOptionsPanel";
import { DEFAULT_BUTTON_OPTIONS } from "./ButtonOptionsPanel";

// ─── helpers ──────────────────────────────────────────────────────────────────

function hexToRgb(hex: string): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `${r},${g},${b}`;
}

// ─── Border Animations ────────────────────────────────────────────────────────

function BorderBeamDemo({ o }: { o: BorderOptions }) {
  const dur = 4 / Math.max(0.1, o.speed);
  const glowStyle = o.glow
    ? { filter: `drop-shadow(0 0 ${o.glowIntensity}px ${o.glowColor})` }
    : {};
  return (
    <div
      className="relative flex h-32 w-48 items-center justify-center overflow-hidden"
      style={{
        borderRadius: o.radius,
        background: o.backgroundColor,
        border: `${o.lineThickness}px solid ${o.lineColor}20`,
      }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: dur, repeat: Infinity, ease: "linear" }}
        className="absolute inset-[-100%] origin-center opacity-70"
        style={{
          background: `conic-gradient(from 0deg, transparent 0 300deg, ${o.lineColor} 330deg, ${o.glowColor} 360deg)`,
          ...glowStyle,
        }}
      />
      <div
        className="absolute flex items-center justify-center"
        style={{
          inset: o.lineThickness,
          borderRadius: Math.max(0, o.radius - o.lineThickness),
          background: o.backgroundColor,
        }}
      >
        <span className="font-mono text-xs" style={{ color: o.lineColor }}>
          Glowing Beam
        </span>
      </div>
    </div>
  );
}

function BorderPulseDemo({ o }: { o: BorderOptions }) {
  const rgb = hexToRgb(o.glowColor);
  const glow = o.glow ? o.glowIntensity : 2;
  const dur = 2 / Math.max(0.1, o.speed);
  return (
    <motion.div
      animate={{
        boxShadow: [
          `0 0 0 ${o.lineThickness}px rgba(${rgb},0.2), 0 0 ${glow}px rgba(${rgb},0.1)`,
          `0 0 0 ${o.lineThickness}px rgba(${rgb},0.8), 0 0 ${glow * 2.4}px rgba(${rgb},0.4)`,
          `0 0 0 ${o.lineThickness}px rgba(${rgb},0.2), 0 0 ${glow}px rgba(${rgb},0.1)`,
        ],
      }}
      transition={{ duration: dur, repeat: Infinity, ease: "easeInOut" }}
      className="flex h-32 w-48 items-center justify-center"
      style={{
        borderRadius: o.radius,
        background: o.backgroundColor,
        border: `${o.lineThickness}px solid ${o.lineColor}66`,
      }}
    >
      <span className="font-mono text-xs" style={{ color: o.lineColor }}>
        Pulse Aura
      </span>
    </motion.div>
  );
}

function BorderDashDemo({ o }: { o: BorderOptions }) {
  const dur = 1.5 / Math.max(0.1, o.speed);
  const dashLen = 8 + o.chaos * 0.5;
  const gapLen = Math.max(2, 6 - o.chaos * 0.3);
  return (
    <div
      className="relative flex h-32 w-48 items-center justify-center p-1"
      style={{ borderRadius: o.radius, background: o.backgroundColor }}
    >
      <svg className="absolute inset-0 h-full w-full overflow-visible" style={{ borderRadius: o.radius }}>
        <motion.rect
          x={o.lineThickness / 2}
          y={o.lineThickness / 2}
          width={`calc(100% - ${o.lineThickness}px)`}
          height={`calc(100% - ${o.lineThickness}px)`}
          rx={o.radius}
          fill="none"
          stroke={o.lineColor}
          strokeWidth={o.lineThickness}
          strokeDasharray={`${dashLen} ${gapLen}`}
          animate={{ strokeDashoffset: [0, -(dashLen + gapLen)] }}
          transition={{ duration: dur, repeat: Infinity, ease: "linear" }}
          style={o.glow ? { filter: `drop-shadow(0 0 ${o.glowIntensity}px ${o.glowColor})` } : {}}
        />
      </svg>
      <span className="font-mono text-xs" style={{ color: o.lineColor }}>
        Marching Dash
      </span>
    </div>
  );
}

function BorderCornerDemo({ o }: { o: BorderOptions }) {
  const [hovered, setHovered] = useState(false);
  const glowStyle = o.glow ? { filter: `drop-shadow(0 0 ${o.glowIntensity}px ${o.glowColor})` } : {};
  const cornerBorder = `${o.lineThickness}px solid ${o.lineColor}`;
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex h-32 w-48 cursor-pointer items-center justify-center p-4"
      style={{
        borderRadius: o.radius,
        background: o.backgroundColor,
        border: `1px solid ${o.lineColor}18`,
      }}
    >
      <motion.span
        animate={hovered ? { x: -2, y: -2, opacity: 1 } : { x: 4, y: 4, opacity: 0.4 }}
        transition={{ duration: 0.2 / Math.max(0.1, o.speed) }}
        className="absolute top-2 left-2 h-3 w-3"
        style={{ borderTop: cornerBorder, borderLeft: cornerBorder, ...glowStyle }}
      />
      <motion.span
        animate={hovered ? { x: 2, y: -2, opacity: 1 } : { x: -4, y: 4, opacity: 0.4 }}
        transition={{ duration: 0.2 / Math.max(0.1, o.speed) }}
        className="absolute top-2 right-2 h-3 w-3"
        style={{ borderTop: cornerBorder, borderRight: cornerBorder, ...glowStyle }}
      />
      <motion.span
        animate={hovered ? { x: -2, y: 2, opacity: 1 } : { x: 4, y: -4, opacity: 0.4 }}
        transition={{ duration: 0.2 / Math.max(0.1, o.speed) }}
        className="absolute bottom-2 left-2 h-3 w-3"
        style={{ borderBottom: cornerBorder, borderLeft: cornerBorder, ...glowStyle }}
      />
      <motion.span
        animate={hovered ? { x: 2, y: 2, opacity: 1 } : { x: -4, y: -4, opacity: 0.4 }}
        transition={{ duration: 0.2 / Math.max(0.1, o.speed) }}
        className="absolute bottom-2 right-2 h-3 w-3"
        style={{ borderBottom: cornerBorder, borderRight: cornerBorder, ...glowStyle }}
      />
      <span className="font-mono text-xs text-white/70">Corner Lock</span>
    </div>
  );
}

function BorderShimmerDemo({ o }: { o: BorderOptions }) {
  const dur = 2.5 / Math.max(0.1, o.speed);
  return (
    <div
      className="relative flex h-32 w-48 items-center justify-center overflow-hidden"
      style={{
        borderRadius: o.radius,
        background: o.backgroundColor,
        border: `${o.lineThickness}px solid ${o.lineColor}26`,
      }}
    >
      <motion.div
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: dur, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.5 }}
        className="absolute inset-y-0 w-1/2 skew-x-12"
        style={{
          background: `linear-gradient(90deg, transparent, ${o.lineColor}33, transparent)`,
          filter: o.glow ? `blur(2px) drop-shadow(0 0 ${o.glowIntensity}px ${o.glowColor})` : undefined,
        }}
      />
      <span className="font-mono text-xs" style={{ color: o.lineColor }}>
        Shimmer Sweep
      </span>
    </div>
  );
}

export function BorderDemo({ variant, options }: { variant: string; options?: Partial<BorderOptions> }) {
  const o: BorderOptions = { ...DEFAULT_BORDER_OPTIONS, ...options };
  switch (variant) {
    case "glow":    return <BorderBeamDemo o={o} />;
    case "pulse":   return <BorderPulseDemo o={o} />;
    case "dash":    return <BorderDashDemo o={o} />;
    case "corner":  return <BorderCornerDemo o={o} />;
    case "shimmer":
    default:        return <BorderShimmerDemo o={o} />;
  }
}

// ─── Button Animations ────────────────────────────────────────────────────────

function ButtonMagneticDemo({ o }: { o: ButtonOptions }) {
  const glowStyle = o.glowEnabled
    ? { boxShadow: `0 0 ${o.glowIntensity}px ${o.glowColor}66` }
    : {};
  return (
    <motion.button
      whileHover={{ scale: o.hoverScale }}
      whileTap={{ scale: o.tapScale }}
      className="relative font-mono font-bold shadow-lg transition"
      style={{
        borderRadius: o.borderRadius,
        paddingLeft: o.paddingX,
        paddingRight: o.paddingX,
        paddingTop: o.paddingY,
        paddingBottom: o.paddingY,
        fontSize: o.fontSize,
        background: `${o.primaryColor}26`,
        border: `1px solid ${o.primaryColor}66`,
        color: o.textColor,
        ...glowStyle,
      }}
    >
      <span>{o.labelText}</span>
    </motion.button>
  );
}

function ButtonShimmerDemo({ o }: { o: ButtonOptions }) {
  const dur = 2.2 / Math.max(0.1, o.animationSpeed);
  const glowStyle = o.glowEnabled
    ? { boxShadow: `0 0 ${o.glowIntensity}px ${o.glowColor}66` }
    : {};
  return (
    <motion.button
      whileHover={{ scale: o.hoverScale }}
      whileTap={{ scale: o.tapScale }}
      className="relative overflow-hidden font-mono font-bold"
      style={{
        borderRadius: o.borderRadius,
        paddingLeft: o.paddingX,
        paddingRight: o.paddingX,
        paddingTop: o.paddingY,
        paddingBottom: o.paddingY,
        fontSize: o.fontSize,
        background: o.primaryColor,
        color: o.textColor,
        border: "1px solid rgba(255,255,255,0.2)",
        ...glowStyle,
      }}
    >
      <motion.div
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: dur, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-y-0 w-1/2 skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent"
      />
      <span className="relative z-10">{o.labelText}</span>
    </motion.button>
  );
}

function ButtonPulseDemo({ o }: { o: ButtonOptions }) {
  const rgb = hexToRgb(o.glowColor);
  const dur = 2 / Math.max(0.1, o.animationSpeed);
  const glowPx = o.glowEnabled ? o.glowIntensity : 0;
  return (
    <motion.button
      animate={{
        scale: [1, o.hoverScale, 1],
        boxShadow: [
          `0 0 0 0 rgba(${rgb},0.4)`,
          `0 0 0 ${glowPx}px rgba(${rgb},0)`,
          `0 0 0 0 rgba(${rgb},0.4)`,
        ],
      }}
      transition={{ duration: dur, repeat: Infinity, ease: "easeInOut" }}
      className="font-mono font-bold"
      style={{
        borderRadius: o.borderRadius,
        paddingLeft: o.paddingX,
        paddingRight: o.paddingX,
        paddingTop: o.paddingY,
        paddingBottom: o.paddingY,
        fontSize: o.fontSize,
        background: `${o.primaryColor}33`,
        border: `1px solid ${o.primaryColor}66`,
        color: o.textColor,
      }}
    >
      {o.labelText}
    </motion.button>
  );
}

function ButtonFillDemo({ o }: { o: ButtonOptions }) {
  const [hovered, setHovered] = useState(false);
  const glowStyle = o.glowEnabled
    ? { boxShadow: `0 0 ${o.glowIntensity}px ${o.glowColor}44` }
    : {};
  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative overflow-hidden font-mono font-bold transition"
      style={{
        borderRadius: o.borderRadius,
        paddingLeft: o.paddingX,
        paddingRight: o.paddingX,
        paddingTop: o.paddingY,
        paddingBottom: o.paddingY,
        fontSize: o.fontSize,
        background: `${o.primaryColor}1a`,
        border: `1px solid ${o.primaryColor}66`,
        color: hovered ? "#000" : o.textColor,
        ...glowStyle,
      }}
    >
      <motion.div
        animate={hovered ? { y: 0 } : { y: "100%" }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="absolute inset-0"
        style={{ background: o.primaryColor }}
      />
      <span className="relative z-10 transition">{o.labelText}</span>
    </button>
  );
}

function ButtonParticleDemo({ o }: { o: ButtonOptions }) {
  const [active, setActive] = useState(false);

  function handleClick() {
    setActive(true);
    setTimeout(() => setActive(false), 600);
  }

  const glowStyle = o.glowEnabled
    ? { boxShadow: `0 0 ${o.glowIntensity}px ${o.glowColor}55` }
    : {};

  return (
    <div className="relative">
      {active && (
        <>
          {[0, 60, 120, 180, 240, 300].map((deg, i) => (
            <motion.span
              key={i}
              initial={{ scale: 0, opacity: 1, x: 0, y: 0 }}
              animate={{
                scale: [1, 0],
                opacity: [1, 0],
                x: Math.cos((deg * Math.PI) / 180) * 28,
                y: Math.sin((deg * Math.PI) / 180) * 28,
              }}
              transition={{ duration: 0.5 / Math.max(0.1, o.animationSpeed), ease: "easeOut" }}
              className="absolute top-1/2 left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ background: o.glowColor }}
            />
          ))}
        </>
      )}
      <motion.button
        onClick={handleClick}
        whileTap={{ scale: o.tapScale }}
        whileHover={{ scale: o.hoverScale }}
        className="font-mono font-bold"
        style={{
          borderRadius: o.borderRadius,
          paddingLeft: o.paddingX,
          paddingRight: o.paddingX,
          paddingTop: o.paddingY,
          paddingBottom: o.paddingY,
          fontSize: o.fontSize,
          background: `${o.primaryColor}33`,
          border: `1px solid ${o.primaryColor}66`,
          color: o.textColor,
          ...glowStyle,
        }}
      >
        {o.labelText}
      </motion.button>
    </div>
  );
}

export function ButtonDemo({ variant, options }: { variant: string; options?: Partial<ButtonOptions> }) {
  const o: ButtonOptions = { ...DEFAULT_BUTTON_OPTIONS, ...options };
  switch (variant) {
    case "magnetic": return <ButtonMagneticDemo o={o} />;
    case "shimmer":  return <ButtonShimmerDemo o={o} />;
    case "pulse":    return <ButtonPulseDemo o={o} />;
    case "fill":     return <ButtonFillDemo o={o} />;
    case "particle":
    default:         return <ButtonParticleDemo o={o} />;
  }
}
