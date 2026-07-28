"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Zap, ChevronDown, RotateCcw, Layout } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MotionOptions {
  speed: number;
  scale: number;
  borderRadius: number;
  padding: number;
  glowIntensity: number;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  autoplay: boolean;
  intensity: number;
}

export const DEFAULT_MOTION_OPTIONS: Record<string, MotionOptions> = {
  default: {
    speed: 1,
    scale: 1,
    borderRadius: 16,
    padding: 16,
    glowIntensity: 15,
    primaryColor: "#22d3ee",
    accentColor: "#7c5cff",
    backgroundColor: "#0d0c14",
    autoplay: true,
    intensity: 5,
  },
  image: {
    speed: 1.2,
    scale: 1.08,
    borderRadius: 16,
    padding: 12,
    glowIntensity: 20,
    primaryColor: "#22d3ee",
    accentColor: "#a855f7",
    backgroundColor: "#0d0c14",
    autoplay: true,
    intensity: 6,
  },
  cursor: {
    speed: 1,
    scale: 1,
    borderRadius: 9999,
    padding: 16,
    glowIntensity: 25,
    primaryColor: "#22d3ee",
    accentColor: "#7c5cff",
    backgroundColor: "#07060a",
    autoplay: true,
    intensity: 7,
  },
  elements: {
    speed: 1,
    scale: 1.1,
    borderRadius: 16,
    padding: 16,
    glowIntensity: 12,
    primaryColor: "#7c5cff",
    accentColor: "#ec4899",
    backgroundColor: "#0d0c14",
    autoplay: true,
    intensity: 5,
  },
  background: {
    speed: 0.8,
    scale: 1,
    borderRadius: 16,
    padding: 20,
    glowIntensity: 30,
    primaryColor: "#7c5cff",
    accentColor: "#22d3ee",
    backgroundColor: "#07060a",
    autoplay: true,
    intensity: 8,
  },
};

// ─── AccordionSection ─────────────────────────────────────────────────────────

interface AccordionSectionProps {
  id: string;
  title: string;
  icon: React.ElementType;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function AccordionSection({ title, icon: Icon, isOpen, onToggle, children }: AccordionSectionProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition-colors">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between p-4 text-left font-medium text-white transition hover:bg-white/[0.03]"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70">
            <Icon className="h-3.5 w-3.5" />
          </div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-white/80">{title}</span>
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }} className="text-white/40">
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-white/5 px-4 pb-5 pt-4"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Slider Row ───────────────────────────────────────────────────────────────

function SliderRow({
  label,
  value,
  min,
  max,
  step = 0.1,
  onChange,
  format = (v: number) => String(v),
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="text-white/60">{label}</span>
        <span className="font-medium text-white/90">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-white/10 accent-[#7c5cff] focus:outline-none"
      />
    </div>
  );
}

// ─── Color Picker Row ─────────────────────────────────────────────────────────

function ColorRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-mono text-xs text-white/60">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-6 w-6 cursor-pointer appearance-none border-0 bg-transparent p-0"
        />
        <span className="font-mono text-[11px] uppercase text-white/40">{value}</span>
      </div>
    </div>
  );
}

// ─── Main Panel ───────────────────────────────────────────────────────────────

export function MotionOptionsPanel({
  category,
  options,
  onChange,
  onReset,
}: {
  category: string;
  variant: string;
  options: MotionOptions;
  onChange: (opts: MotionOptions) => void;
  onReset: () => void;
}) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    timing: true,
    style: true,
    colors: true,
  });

  const toggle = (sec: string) => setOpenSections((p) => ({ ...p, [sec]: !p[sec] }));

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-white/80">
            {category} Parameters
          </h3>
          <p className="font-mono text-[10px] text-white/40">Tweak real-time props & auto-active motion</p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 font-mono text-[10px] text-white/50 transition hover:bg-white/10 hover:text-white"
        >
          <RotateCcw className="h-3 w-3" /> Reset
        </button>
      </div>

      {/* Accordion 1: Motion & Timing */}
      <AccordionSection
        id="timing"
        title="Motion & Timing"
        icon={Zap}
        isOpen={!!openSections.timing}
        onToggle={() => toggle("timing")}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-white/60">Auto-Active Loop</span>
            <button
              type="button"
              onClick={() => onChange({ ...options, autoplay: !options.autoplay })}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                options.autoplay ? "bg-[#7c5cff]" : "bg-white/10"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  options.autoplay ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <SliderRow
            label="Animation Speed"
            value={options.speed}
            min={0.2}
            max={3}
            step={0.1}
            onChange={(speed) => onChange({ ...options, speed })}
            format={(v) => `${v.toFixed(1)}x`}
          />

          <SliderRow
            label="Effect Intensity"
            value={options.intensity}
            min={1}
            max={10}
            step={0.5}
            onChange={(intensity) => onChange({ ...options, intensity })}
          />
        </div>
      </AccordionSection>

      {/* Accordion 2: Layout & Geometry */}
      <AccordionSection
        id="style"
        title="Layout & Geometry"
        icon={Layout}
        isOpen={!!openSections.style}
        onToggle={() => toggle("style")}
      >
        <div className="space-y-4">
          <SliderRow
            label="Scale Factor"
            value={options.scale}
            min={0.8}
            max={1.5}
            step={0.05}
            onChange={(scale) => onChange({ ...options, scale })}
            format={(v) => `${v.toFixed(2)}x`}
          />

          <SliderRow
            label="Border Radius"
            value={options.borderRadius}
            min={0}
            max={32}
            step={2}
            onChange={(borderRadius) => onChange({ ...options, borderRadius })}
            format={(v) => `${v}px`}
          />

          <SliderRow
            label="Glow Intensity"
            value={options.glowIntensity}
            min={0}
            max={50}
            step={2}
            onChange={(glowIntensity) => onChange({ ...options, glowIntensity })}
            format={(v) => `${v}px`}
          />
        </div>
      </AccordionSection>

      {/* Accordion 3: Colors & Styling */}
      <AccordionSection
        id="colors"
        title="Colors & Aesthetics"
        icon={Palette}
        isOpen={!!openSections.colors}
        onToggle={() => toggle("colors")}
      >
        <div className="space-y-4">
          <ColorRow
            label="Primary Color"
            value={options.primaryColor}
            onChange={(primaryColor) => onChange({ ...options, primaryColor })}
          />
          <ColorRow
            label="Accent / Glow Color"
            value={options.accentColor}
            onChange={(accentColor) => onChange({ ...options, accentColor })}
          />
          <ColorRow
            label="Background Base"
            value={options.backgroundColor}
            onChange={(backgroundColor) => onChange({ ...options, backgroundColor })}
          />
        </div>
      </AccordionSection>
    </div>
  );
}
