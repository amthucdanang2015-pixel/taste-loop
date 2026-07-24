"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Type,
  Palette,
  Sparkles,
  ChevronDown,
  RotateCcw,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";

export interface TextOptions {
  text: string;
  fontSize: number;
  color: string;
  fontWeight: string;
  fontFamily: string;
  letterSpacing: number;
  lineHeight: number;
  textAlign: "left" | "center" | "right";
}

export const DEFAULT_TEXT_OPTIONS: TextOptions = {
  text: "",
  fontSize: 32,
  color: "#ffffff",
  fontWeight: "700",
  fontFamily: "var(--font-sans), system-ui, sans-serif",
  letterSpacing: 0,
  lineHeight: 1.2,
  textAlign: "center",
};

export const FONT_FAMILIES = [
  { label: "Default Sans", value: "var(--font-sans), system-ui, sans-serif" },
  { label: "Monospace / Code", value: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" },
  { label: "Serif / Editorial", value: "Georgia, Cambria, 'Times New Roman', Times, serif" },
  { label: "Display / Heavy", value: "Impact, 'Arial Black', sans-serif" },
  { label: "Modern Geist", value: "'Geist', 'Inter', system-ui, sans-serif" },
  { label: "Playful Rounded", value: "'Outfit', system-ui, sans-serif" },
];

export const FONT_WEIGHTS = [
  { label: "300 — Light", value: "300" },
  { label: "400 — Regular", value: "400" },
  { label: "500 — Medium", value: "500" },
  { label: "600 — SemiBold", value: "600" },
  { label: "700 — Bold", value: "700" },
  { label: "800 — ExtraBold", value: "800" },
  { label: "900 — Black", value: "900" },
];

export const COLOR_SWATCHES = [
  { label: "White", value: "#ffffff" },
  { label: "Neon Purple", value: "#a78bfa" },
  { label: "Electric Cyan", value: "#22d3ee" },
  { label: "Hot Pink", value: "#ec4899" },
  { label: "Emerald", value: "#34d399" },
  { label: "Amber Gold", value: "#fbbf24" },
  { label: "Coral Red", value: "#f87171" },
  { label: "Muted Gray", value: "#9ca3af" },
];

interface AccordionSectionProps {
  id: string;
  title: string;
  icon: React.ElementType;
  isOpen: boolean;
  onToggle: () => void;
  badge?: string;
  children: React.ReactNode;
}

function AccordionSection({
  title,
  icon: Icon,
  isOpen,
  onToggle,
  badge,
  children,
}: AccordionSectionProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden transition-colors">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between p-4 text-left font-medium text-white transition hover:bg-white/[0.03]"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70">
            <Icon className="h-3.5 w-3.5" />
          </div>
          <span className="text-sm font-semibold tracking-wide">{title}</span>
          {badge && (
            <span className="rounded-full border border-[#7c5cff]/30 bg-[#7c5cff]/10 px-2 py-0.5 text-[10px] font-mono text-[#a78bfa]">
              {badge}
            </span>
          )}
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-white/40"
        >
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

interface TextOptionsPanelProps {
  options: TextOptions;
  onChange: (updated: TextOptions) => void;
  onReset: () => void;
  defaultText: string;
  promptContent?: React.ReactNode;
}

export function TextOptionsPanel({
  options,
  onChange,
  onReset,
  defaultText,
  promptContent,
}: TextOptionsPanelProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    typography: true,
    colors: true,
    prompt: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const update = <K extends keyof TextOptions>(key: K, value: TextOptions[K]) => {
    onChange({ ...options, [key]: value });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* ── Section 1: Typography ────────────────────────────────────────────── */}
      <AccordionSection
        id="typography"
        title="Typography"
        icon={Type}
        isOpen={openSections.typography}
        onToggle={() => toggleSection("typography")}
        badge="Text"
      >
        <div className="flex flex-col gap-4">
          {/* Header Action */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-widest text-white/40">
              Text & Font Properties
            </span>
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1 text-[11px] text-white/40 transition hover:text-white/80"
            >
              <RotateCcw className="h-3 w-3" /> Reset
            </button>
          </div>

          {/* Text Content */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-white/70">Text Content</label>
            <textarea
              rows={2}
              value={options.text}
              placeholder={defaultText}
              onChange={(e) => update("text", e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs font-mono text-white placeholder-white/30 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
            />
          </div>

          {/* Font Family */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-white/70">Font Family</label>
            <select
              value={options.fontFamily}
              onChange={(e) => update("fontFamily", e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
            >
              {FONT_FAMILIES.map((f) => (
                <option key={f.label} value={f.value} className="bg-[#12111c] text-white">
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          {/* Font Size & Font Weight Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-white/70">Font Size</label>
                <span className="font-mono text-[11px] text-white/50">{options.fontSize}px</span>
              </div>
              <input
                type="range"
                min={14}
                max={72}
                value={options.fontSize}
                onChange={(e) => update("fontSize", Number(e.target.value))}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-white/10 accent-[#7c5cff]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-white/70">Weight</label>
              <select
                value={options.fontWeight}
                onChange={(e) => update("fontWeight", e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-2 py-1.5 text-xs text-white focus:border-[#7c5cff] focus:outline-none"
              >
                {FONT_WEIGHTS.map((w) => (
                  <option key={w.value} value={w.value} className="bg-[#12111c] text-white">
                    {w.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Letter Spacing & Line Height */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-white/70">Letter Spacing</label>
                <span className="font-mono text-[11px] text-white/50">{options.letterSpacing}px</span>
              </div>
              <input
                type="range"
                min={-2}
                max={12}
                value={options.letterSpacing}
                onChange={(e) => update("letterSpacing", Number(e.target.value))}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-white/10 accent-[#7c5cff]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-white/70">Line Height</label>
                <span className="font-mono text-[11px] text-white/50">{options.lineHeight}</span>
              </div>
              <input
                type="range"
                min={0.8}
                max={2.2}
                step={0.1}
                value={options.lineHeight}
                onChange={(e) => update("lineHeight", Number(e.target.value))}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-white/10 accent-[#7c5cff]"
              />
            </div>
          </div>

          {/* Alignment */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-white/70">Text Alignment</label>
            <div className="flex items-center rounded-xl border border-white/10 bg-black/40 p-1">
              {(["left", "center", "right"] as const).map((align) => {
                const IconComponent =
                  align === "left" ? AlignLeft : align === "center" ? AlignCenter : AlignRight;
                const active = options.textAlign === align;
                return (
                  <button
                    key={align}
                    type="button"
                    onClick={() => update("textAlign", align)}
                    className={`flex flex-1 items-center justify-center rounded-lg py-1.5 transition ${
                      active
                        ? "bg-[#7c5cff]/20 text-[#a78bfa] ring-1 ring-inset ring-[#7c5cff]/40"
                        : "text-white/40 hover:text-white/70"
                    }`}
                  >
                    <IconComponent className="h-3.5 w-3.5" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </AccordionSection>

      {/* ── Section 2: Colors ────────────────────────────────────────────────── */}
      <AccordionSection
        id="colors"
        title="Color & Style"
        icon={Palette}
        isOpen={openSections.colors}
        onToggle={() => toggleSection("colors")}
      >
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-white/70">Text Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={options.color}
                onChange={(e) => update("color", e.target.value)}
                className="h-6 w-6 cursor-pointer appearance-none rounded-full border border-white/20 bg-transparent"
              />
              <span className="font-mono text-xs text-white/60 uppercase">{options.color}</span>
            </div>
          </div>

          {/* Swatches */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {COLOR_SWATCHES.map((swatch) => {
              const selected = options.color.toLowerCase() === swatch.value.toLowerCase();
              return (
                <button
                  key={swatch.value}
                  type="button"
                  title={swatch.label}
                  onClick={() => update("color", swatch.value)}
                  className={`h-6 w-6 rounded-full border border-white/20 transition ${
                    selected ? "ring-2 ring-[#7c5cff] ring-offset-2 ring-offset-[#0d0c14]" : "hover:scale-110"
                  }`}
                  style={{ backgroundColor: swatch.value }}
                />
              );
            })}
          </div>
        </div>
      </AccordionSection>

      {/* ── Section 3: AI Prompt & Meta (Accordion) ─────────────────────────── */}
      {promptContent && (
        <AccordionSection
          id="prompt"
          title="AI Prompt & Metadata"
          icon={Sparkles}
          isOpen={openSections.prompt}
          onToggle={() => toggleSection("prompt")}
        >
          {promptContent}
        </AccordionSection>
      )}
    </div>
  );
}
