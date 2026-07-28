"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Zap, ChevronDown, RotateCcw, Layout, Sparkles } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ButtonOptions {
  labelText: string;
  primaryColor: string;
  textColor: string;
  glowColor: string;
  borderRadius: number;
  paddingX: number;
  paddingY: number;
  fontSize: number;
  animationSpeed: number;
  glowIntensity: number;
  glowEnabled: boolean;
  hoverScale: number;
  tapScale: number;
}

export const DEFAULT_BUTTON_OPTIONS: ButtonOptions = {
  labelText: "Click Me",
  primaryColor: "#7c5cff",
  textColor: "#ffffff",
  glowColor: "#7c5cff",
  borderRadius: 12,
  paddingX: 24,
  paddingY: 12,
  fontSize: 14,
  animationSpeed: 1,
  glowIntensity: 10,
  glowEnabled: true,
  hoverScale: 1.05,
  tapScale: 0.95,
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

// ─── Slider Row ───────────────────────────────────────────────────────────────

function SliderRow({
  label,
  value,
  min,
  max,
  step = 1,
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
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-white/70">{label}</label>
        <span className="font-mono text-[11px] text-white/50">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-white/10 accent-[#7c5cff]"
      />
    </div>
  );
}

// ─── Color Row ────────────────────────────────────────────────────────────────

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
      <label className="text-xs font-medium text-white/70">{label}</label>
      <div className="flex items-center gap-2.5">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-6 w-6 cursor-pointer appearance-none rounded border border-white/20 bg-transparent"
        />
        <span className="font-mono text-xs text-white/60 uppercase">{value}</span>
      </div>
    </div>
  );
}

// ─── Toggle Row ───────────────────────────────────────────────────────────────

function ToggleRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <label className="text-xs font-medium text-white/70">{label}</label>
      <div className="flex overflow-hidden rounded-xl border border-white/10 bg-black/40">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`px-5 py-1.5 text-xs font-mono transition ${
            value ? "bg-white/15 text-white" : "text-white/40 hover:text-white/70"
          }`}
        >
          Yes
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`px-5 py-1.5 text-xs font-mono transition ${
            !value ? "bg-white/15 text-white" : "text-white/40 hover:text-white/70"
          }`}
        >
          No
        </button>
      </div>
    </div>
  );
}

// ─── Text Row ─────────────────────────────────────────────────────────────────

function TextRow({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-white/70">{label}</label>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs font-mono text-white placeholder-white/30 focus:border-[#7c5cff] focus:outline-none focus:ring-1 focus:ring-[#7c5cff]"
      />
    </div>
  );
}

// ─── ButtonOptionsPanel ───────────────────────────────────────────────────────

interface ButtonOptionsPanelProps {
  options: ButtonOptions;
  onChange: (updated: ButtonOptions) => void;
  onReset: () => void;
  promptContent?: React.ReactNode;
}

export function ButtonOptionsPanel({ options, onChange, onReset, promptContent }: ButtonOptionsPanelProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    colors: true,
    animation: true,
    layout: true,
    random: true,
    prompt: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const update = <K extends keyof ButtonOptions>(key: K, value: ButtonOptions[K]) => {
    onChange({ ...options, [key]: value });
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-1">
        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-white/40">
          Controls
        </span>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1 text-[11px] text-white/40 transition hover:text-white/80"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>
      </div>

      {/* Colors */}
      <AccordionSection
        id="colors"
        title="Colors"
        icon={Palette}
        isOpen={openSections.colors}
        onToggle={() => toggleSection("colors")}
      >
        <div className="flex flex-col gap-4">
          <ColorRow label="Primary Color" value={options.primaryColor} onChange={(v) => update("primaryColor", v)} />
          <ColorRow label="Text Color" value={options.textColor} onChange={(v) => update("textColor", v)} />
          <ColorRow label="Glow Color" value={options.glowColor} onChange={(v) => update("glowColor", v)} />
        </div>
      </AccordionSection>

      {/* Animation */}
      <AccordionSection
        id="animation"
        title="Animation"
        icon={Zap}
        isOpen={openSections.animation}
        onToggle={() => toggleSection("animation")}
      >
        <div className="flex flex-col gap-4">
          <SliderRow
            label="Speed"
            value={options.animationSpeed}
            min={0.2}
            max={5}
            step={0.1}
            onChange={(v) => update("animationSpeed", v)}
            format={(v) => v.toFixed(1)}
          />
          <SliderRow
            label="Hover Scale"
            value={options.hoverScale}
            min={1}
            max={1.3}
            step={0.01}
            onChange={(v) => update("hoverScale", v)}
            format={(v) => v.toFixed(2)}
          />
          <SliderRow
            label="Tap Scale"
            value={options.tapScale}
            min={0.7}
            max={1}
            step={0.01}
            onChange={(v) => update("tapScale", v)}
            format={(v) => v.toFixed(2)}
          />
        </div>
      </AccordionSection>

      {/* Layout */}
      <AccordionSection
        id="layout"
        title="Layout"
        icon={Layout}
        isOpen={openSections.layout}
        onToggle={() => toggleSection("layout")}
      >
        <div className="flex flex-col gap-4">
          <TextRow
            label="Label Text"
            value={options.labelText}
            placeholder="Click Me"
            onChange={(v) => update("labelText", v)}
          />
          <SliderRow
            label="Border Radius"
            value={options.borderRadius}
            min={0}
            max={48}
            step={1}
            onChange={(v) => update("borderRadius", v)}
            format={(v) => `${v}px`}
          />
          <div className="grid grid-cols-2 gap-3">
            <SliderRow
              label="Padding X"
              value={options.paddingX}
              min={8}
              max={64}
              step={2}
              onChange={(v) => update("paddingX", v)}
              format={(v) => `${v}px`}
            />
            <SliderRow
              label="Padding Y"
              value={options.paddingY}
              min={4}
              max={32}
              step={1}
              onChange={(v) => update("paddingY", v)}
              format={(v) => `${v}px`}
            />
          </div>
          <SliderRow
            label="Font Size"
            value={options.fontSize}
            min={10}
            max={28}
            step={1}
            onChange={(v) => update("fontSize", v)}
            format={(v) => `${v}px`}
          />
          <SliderRow
            label="Glow Intensity"
            value={options.glowIntensity}
            min={0}
            max={40}
            step={1}
            onChange={(v) => update("glowIntensity", v)}
            format={(v) => String(v)}
          />
        </div>
      </AccordionSection>

      {/* Random */}
      <AccordionSection
        id="random"
        title="Random"
        icon={Sparkles}
        isOpen={openSections.random}
        onToggle={() => toggleSection("random")}
      >
        <div className="flex flex-col gap-3">
          <ToggleRow
            label="Glow"
            value={options.glowEnabled}
            onChange={(v) => update("glowEnabled", v)}
          />
        </div>
      </AccordionSection>

      {/* AI Prompt */}
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
