"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers,
  Layout,
  Sparkles,
  ChevronDown,
  RotateCcw,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Info,
  AlertCircle,
} from "lucide-react";
import {
  type GalleryOptions,
  type ScreenshotItem,
  GALLERY_SCHEMA_CONTROLS,
} from "./gallerySchema";

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

interface GalleryOptionsPanelProps {
  variant: string;
  options: GalleryOptions;
  onChange: (updated: GalleryOptions) => void;
  onReset: () => void;
  defaultSlides?: ScreenshotItem[];
  promptContent?: React.ReactNode;
}

export function GalleryOptionsPanel({
  variant,
  options,
  onChange,
  onReset,
  defaultSlides = [],
  promptContent,
}: GalleryOptionsPanelProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    gallery: true,
    layout: true,
    animation: true,
    prompt: false,
  });

  const [slidesManagerOpen, setSlidesManagerOpen] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [newAlt, setNewAlt] = useState("");
  const [selectedSlideIndex, setSelectedSlideIndex] = useState<number | null>(null);

  const activeSlides = options.slides.length > 0 ? options.slides : defaultSlides;

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const update = <K extends keyof GalleryOptions>(key: K, value: GalleryOptions[K]) => {
    onChange({ ...options, [key]: value });
  };

  const isControlSupported = (supportedVariants?: string[]) => {
    if (!supportedVariants || supportedVariants.length === 0) return true;
    return supportedVariants.some(
      (v) => v === variant || variant.includes(v) || v.includes(variant)
    );
  };

  const handleAddSlide = () => {
    if (!newUrl.trim()) return;
    const item: ScreenshotItem = {
      src: newUrl.trim(),
      alt: newAlt.trim() || `Image #${activeSlides.length + 1}`,
    };
    const nextSlides = [...activeSlides, item];
    update("slides", nextSlides);
    setNewUrl("");
    setNewAlt("");
  };

  const handleDeleteSlide = (index: number) => {
    const nextSlides = activeSlides.filter((_, i) => i !== index);
    update("slides", nextSlides);
    if (selectedSlideIndex === index) {
      setSelectedSlideIndex(null);
    } else if (selectedSlideIndex !== null && selectedSlideIndex > index) {
      setSelectedSlideIndex(selectedSlideIndex - 1);
    }
  };

  const handleMoveSlide = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= activeSlides.length) return;
    const nextSlides = [...activeSlides];
    const temp = nextSlides[index];
    nextSlides[index] = nextSlides[targetIndex];
    nextSlides[targetIndex] = temp;
    update("slides", nextSlides);
    if (selectedSlideIndex === index) setSelectedSlideIndex(targetIndex);
    else if (selectedSlideIndex === targetIndex) setSelectedSlideIndex(index);
  };

  const handleAddPreset = (src: string, alt: string) => {
    const nextSlides = [...activeSlides, { src, alt }];
    update("slides", nextSlides);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* ── Section 1: Gallery ──────────────────────────────────────────────── */}
      <AccordionSection
        id="gallery"
        title="Gallery"
        icon={Layers}
        isOpen={openSections.gallery}
        onToggle={() => toggleSection("gallery")}
        badge={`${activeSlides.length} Items`}
      >
        <div className="flex flex-col gap-4">
          {/* Header Action */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-widest text-white/40">
              Gallery Settings
            </span>
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1 text-[11px] text-white/40 transition hover:text-white/80"
            >
              <RotateCcw className="h-3 w-3" /> Reset
            </button>
          </div>

          {/* Slides item count & manager trigger */}
          <div className="group relative flex flex-col gap-1.5 rounded-xl p-1 transition hover:bg-white/[0.02]">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-white/70">Slides</label>
              <button
                type="button"
                onClick={() => setSlidesManagerOpen((prev) => !prev)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 font-mono text-xs text-white/80 transition hover:border-[#7c5cff] hover:text-white"
              >
                <span className="text-[#a78bfa]">{`{ }`}</span>
                <span>{activeSlides.length} Items</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform ${
                    slidesManagerOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 text-[10px] text-[#a78bfa] font-mono">
              <Info className="h-3 w-3" />
              <span>Applied to: Gallery image list & slide order</span>
            </div>

            {/* Slides Manager Drawer */}
            <AnimatePresence>
              {slidesManagerOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-2 flex flex-col gap-3 rounded-xl border border-white/10 bg-black/50 p-3"
                >
                  <p className="text-[11px] font-bold uppercase tracking-widest text-white/40">
                    Manage Slides
                  </p>

                  <div className="scroll-slim flex max-h-48 flex-col gap-1.5 overflow-y-auto pr-1">
                    {activeSlides.map((slide, idx) => {
                      const isSelected = selectedSlideIndex === idx;
                      return (
                        <div
                          key={`${slide.src}-${idx}`}
                          onClick={() => setSelectedSlideIndex(idx)}
                          className={`flex cursor-pointer items-center justify-between rounded-lg border px-2.5 py-1.5 transition ${
                            isSelected
                              ? "border-[#7c5cff]/60 bg-[#7c5cff]/10"
                              : "border-white/5 bg-white/[0.02] hover:bg-white/[0.05]"
                          }`}
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <img
                              src={slide.src}
                              alt={slide.alt}
                              className="h-7 w-7 rounded border border-white/10 object-cover"
                            />
                            <span className="truncate text-xs font-mono text-white/80">
                              #{idx + 1} {slide.alt || "Image"}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMoveSlide(idx, "up");
                              }}
                              className="rounded p-1 text-white/40 hover:bg-white/10 hover:text-white disabled:opacity-20"
                            >
                              <ArrowUp className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === activeSlides.length - 1}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMoveSlide(idx, "down");
                              }}
                              className="rounded p-1 text-white/40 hover:bg-white/10 hover:text-white disabled:opacity-20"
                            >
                              <ArrowDown className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteSlide(idx);
                              }}
                              className="rounded p-1 text-red-400/60 hover:bg-red-500/20 hover:text-red-300"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-1 flex flex-col gap-2 border-t border-white/10 pt-2">
                    <span className="text-[10px] font-semibold text-white/50">Add Image URL</span>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://..."
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                        className="flex-1 rounded-lg border border-white/10 bg-black/40 px-2.5 py-1.5 text-xs text-white placeholder-white/30 focus:border-[#7c5cff] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddSlide}
                        className="inline-flex items-center gap-1 rounded-lg border border-[#7c5cff]/40 bg-[#7c5cff]/20 px-3 py-1.5 text-xs font-medium text-[#a78bfa] transition hover:bg-[#7c5cff]/30"
                      >
                        <Plus className="h-3.5 w-3.5" /> Add
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Title / Alt caption"
                      value={newAlt}
                      onChange={(e) => setNewAlt(e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-black/40 px-2.5 py-1.5 text-xs text-white placeholder-white/30 focus:border-[#7c5cff] focus:outline-none"
                    />

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="self-center text-[10px] text-white/30">Presets:</span>
                      <button
                        type="button"
                        onClick={() =>
                          handleAddPreset(
                            "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80",
                            "Abstract Aurora"
                          )
                        }
                        className="rounded border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-white/60 hover:bg-white/10"
                      >
                        + Aurora
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleAddPreset(
                            "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400&q=80",
                            "Vibrant Art"
                          )
                        }
                        className="rounded border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-white/60 hover:bg-white/10"
                      >
                        + Art
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Autoplay Segmented Toggle */}
          <div className="group relative flex flex-col gap-1.5 rounded-xl p-1 transition hover:bg-white/[0.02]">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-white/70">Autoplay</label>
              <div className="flex items-center rounded-xl border border-white/10 bg-black/40 p-1">
                {[
                  { label: "Yes", value: true },
                  { label: "No", value: false },
                ].map((item) => {
                  const active = options.autoplay === item.value;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => update("autoplay", item.value)}
                      className={`px-3 py-1 text-xs font-medium rounded-lg transition ${
                        active
                          ? "bg-[#7c5cff]/20 text-[#a78bfa] ring-1 ring-inset ring-[#7c5cff]/40"
                          : "text-white/40 hover:text-white/70"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 text-[10px] text-[#a78bfa] font-mono">
              <Info className="h-3 w-3" />
              <span>Applied to: Continuous background motion loop</span>
            </div>
          </div>

          {/* Show Title Segmented Toggle */}
          <div className="group relative flex flex-col gap-1.5 rounded-xl p-1 transition hover:bg-white/[0.02]">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-white/70">Show Title</label>
              <div className="flex items-center rounded-xl border border-white/10 bg-black/40 p-1">
                {[
                  { label: "Yes", value: true },
                  { label: "No", value: false },
                ].map((item) => {
                  const active = options.showTitle === item.value;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => update("showTitle", item.value)}
                      className={`px-3 py-1 text-xs font-medium rounded-lg transition ${
                        active
                          ? "bg-[#7c5cff]/20 text-[#a78bfa] ring-1 ring-inset ring-[#7c5cff]/40"
                          : "text-white/40 hover:text-white/70"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 text-[10px] text-[#a78bfa] font-mono">
              <Info className="h-3 w-3" />
              <span>Applied to: Card caption & index overlay badges</span>
            </div>
          </div>
        </div>
      </AccordionSection>

      {/* ── Section 2: Layout ───────────────────────────────────────────────── */}
      <AccordionSection
        id="layout"
        title="Layout"
        icon={Layout}
        isOpen={openSections.layout}
        onToggle={() => toggleSection("layout")}
      >
        <div className="flex flex-col gap-3">
          {GALLERY_SCHEMA_CONTROLS.filter(
            (c) => c.group === "layout" && isControlSupported(c.supportedVariants)
          ).map((ctrl) => {
            const val = Number(options[ctrl.key] ?? 0);
            const disabledInfo = ctrl.getDisabledInfo?.(options, variant);
            const isDisabled = !!disabledInfo?.disabled;

            return (
              <div
                key={ctrl.key}
                className={`group relative flex flex-col gap-1.5 rounded-xl p-1.5 transition hover:bg-white/[0.02] ${
                  isDisabled ? "opacity-45" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-white/70">{ctrl.label}</label>
                  <span className="font-mono text-[11px] text-white/50">{val}</span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    disabled={isDisabled}
                    min={ctrl.min ?? 0}
                    max={ctrl.max ?? 100}
                    step={ctrl.step ?? 1}
                    value={val}
                    onChange={(e) => update(ctrl.key, Number(e.target.value))}
                    className="h-1.5 flex-1 cursor-pointer appearance-none rounded-lg bg-white/10 accent-[#7c5cff] disabled:cursor-not-allowed"
                  />
                  <input
                    type="number"
                    disabled={isDisabled}
                    min={ctrl.min ?? 0}
                    max={ctrl.max ?? 100}
                    step={ctrl.step ?? 1}
                    value={val}
                    onChange={(e) => update(ctrl.key, Number(e.target.value))}
                    className="w-14 rounded-xl border border-white/10 bg-black/40 px-2 py-1 text-center font-mono text-xs text-white focus:border-[#7c5cff] focus:outline-none disabled:cursor-not-allowed"
                  />
                </div>

                {/* Active target visibility on hover */}
                {!isDisabled && ctrl.appliedTo && (
                  <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 text-[10px] text-[#a78bfa] font-mono">
                    <Info className="h-3 w-3" />
                    <span>{ctrl.appliedTo}</span>
                  </div>
                )}

                {/* Disabled reason tooltip banner */}
                {isDisabled && disabledInfo?.reason && (
                  <div className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 p-2 text-[10px] font-mono text-amber-300">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{disabledInfo.reason}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </AccordionSection>

      {/* ── Section 3: Animation ────────────────────────────────────────────── */}
      <AccordionSection
        id="animation"
        title="Animation"
        icon={Sparkles}
        isOpen={openSections.animation}
        onToggle={() => toggleSection("animation")}
      >
        <div className="flex flex-col gap-3">
          {GALLERY_SCHEMA_CONTROLS.filter(
            (c) => c.group === "animation" && isControlSupported(c.supportedVariants)
          ).map((ctrl) => {
            const disabledInfo = ctrl.getDisabledInfo?.(options, variant);
            const isDisabled = !!disabledInfo?.disabled;

            if (ctrl.type === "select") {
              return (
                <div
                  key={ctrl.key}
                  className={`group relative flex flex-col gap-1.5 rounded-xl p-1.5 transition hover:bg-white/[0.02] ${
                    isDisabled ? "opacity-45" : ""
                  }`}
                >
                  <label className="text-xs font-medium text-white/70">{ctrl.label}</label>
                  <select
                    disabled={isDisabled}
                    value={String(options[ctrl.key])}
                    onChange={(e) => update(ctrl.key, e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white focus:border-[#7c5cff] focus:outline-none disabled:cursor-not-allowed"
                  >
                    {ctrl.options?.map((opt) => (
                      <option key={opt.value} value={opt.value} className="bg-[#12111c] text-white">
                        {opt.label}
                      </option>
                    ))}
                  </select>

                  {/* Active target visibility on hover */}
                  {!isDisabled && ctrl.appliedTo && (
                    <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 text-[10px] text-[#a78bfa] font-mono">
                      <Info className="h-3 w-3" />
                      <span>{ctrl.appliedTo}</span>
                    </div>
                  )}

                  {/* Disabled reason tooltip banner */}
                  {isDisabled && disabledInfo?.reason && (
                    <div className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 p-2 text-[10px] font-mono text-amber-300">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      <span>{disabledInfo.reason}</span>
                    </div>
                  )}
                </div>
              );
            }

            if (ctrl.type === "slider") {
              const val = Number(options[ctrl.key] ?? 0);
              return (
                <div
                  key={ctrl.key}
                  className={`group relative flex flex-col gap-1.5 rounded-xl p-1.5 transition hover:bg-white/[0.02] ${
                    isDisabled ? "opacity-45" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-white/70">{ctrl.label}</label>
                    <span className="font-mono text-[11px] text-white/50">{val}s</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      disabled={isDisabled}
                      min={ctrl.min ?? 0.1}
                      max={ctrl.max ?? 5}
                      step={ctrl.step ?? 0.1}
                      value={val}
                      onChange={(e) => update(ctrl.key, Number(e.target.value))}
                      className="h-1.5 flex-1 cursor-pointer appearance-none rounded-lg bg-white/10 accent-[#7c5cff] disabled:cursor-not-allowed"
                    />
                    <input
                      type="number"
                      disabled={isDisabled}
                      min={ctrl.min ?? 0.1}
                      max={ctrl.max ?? 5}
                      step={ctrl.step ?? 0.1}
                      value={val}
                      onChange={(e) => update(ctrl.key, Number(e.target.value))}
                      className="w-14 rounded-xl border border-white/10 bg-black/40 px-2 py-1 text-center font-mono text-xs text-white focus:border-[#7c5cff] focus:outline-none disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Active target visibility on hover */}
                  {!isDisabled && ctrl.appliedTo && (
                    <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 text-[10px] text-[#a78bfa] font-mono">
                      <Info className="h-3 w-3" />
                      <span>{ctrl.appliedTo}</span>
                    </div>
                  )}

                  {/* Disabled reason tooltip banner */}
                  {isDisabled && disabledInfo?.reason && (
                    <div className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 p-2 text-[10px] font-mono text-amber-300">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      <span>{disabledInfo.reason}</span>
                    </div>
                  )}
                </div>
              );
            }

            return null;
          })}
        </div>
      </AccordionSection>

      {/* ── Section 4: AI Prompt & Metadata ─────────────────────────────────── */}
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

      {/* ── Footer: Reset All Settings ──────────────────────────────────────── */}
      <button
        type="button"
        onClick={onReset}
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] py-3 text-xs font-semibold text-white/70 transition hover:bg-white/[0.08] hover:text-white active:scale-[0.99]"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Reset All Settings
      </button>
    </div>
  );
}
