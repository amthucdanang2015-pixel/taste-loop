"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, LayoutGroup, useReducedMotion } from "framer-motion";
import { copyText } from "@/lib/copyText";
import { Check, Copy, Sparkles, Wrench, ArrowLeft, RotateCw, Monitor } from "lucide-react";
import {
  TEXT_EFFECT_TEMPLATES,
  TextEffectRenderer,
  type TextEffectTemplate,
} from "./anim/TextEffects";
import { ANIM_ITEMS, ANIM_CATEGORIES, USE_BY_CAT, type AnimItem } from "@/data/animations";
import { AnimDemo } from "@/components/anim";
import { Stage } from "@/components/anim/Stage";

// ─── Animation type config ────────────────────────────────────────────────────

type AnimationType = { id: string; label: string; badge?: string };

const ANIMATION_TYPES: AnimationType[] = [
  { id: "gallery", label: "Gallery Animations" },
  { id: "text-effect", label: "Text Effect" },
  { id: "entrances", label: "Entrances & Exits" },
  { id: "sequencing", label: "Sequencing & Timing" },
  { id: "transforms", label: "Movement & Transforms" },
  { id: "transitions", label: "Transitions Between States" },
  { id: "scroll", label: "Scroll" },
  { id: "feedback", label: "Feedback & Interaction" },
  { id: "easing", label: "Easing" },
  { id: "spring", label: "Spring Animations" },
  { id: "looping", label: "Looping & Ambient" },
  { id: "polish", label: "Polish & Effects" },
  { id: "performance", label: "Performance" },
  { id: "principles", label: "Principles to Know" },
];

// ─── Entrances color ──────────────────────────────────────────────────────────

const ENTRANCE_COLOR = "#7c5cff";

// ─── Spring preset ────────────────────────────────────────────────────────────

const SPRING = { type: "spring" as const, stiffness: 220, damping: 30, mass: 1.2 };
const EASE = { ease: [0.22, 1, 0.36, 1] as const, duration: 0.58 };

// ─── Ripple hook ──────────────────────────────────────────────────────────────

type Ripple = { id: number; x: number; y: number; size: number };

function useRipple() {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const counter = useRef(0);

  const trigger = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const size = Math.max(rect.width, rect.height) * 2;
    const id = ++counter.current;
    setRipples((p) => [...p, { id, x, y, size }]);
    setTimeout(() => setRipples((p) => p.filter((r) => r.id !== id)), 700);
  }, []);

  return { ripples, trigger };
}

// ─── Main component ───────────────────────────────────────────────────────────

export function AnimationStudio() {
  const [q] = useState("");
  const [activeType, setActiveType] = useState<string>("gallery");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const filteredTextEffects = useMemo(() => {
    const n = q.trim().toLowerCase();
    if (!n) return TEXT_EFFECT_TEMPLATES;
    return TEXT_EFFECT_TEMPLATES.filter((a) =>
      `${a.name} ${a.category} ${a.animationTextType} ${a.description}`
        .toLowerCase()
        .includes(n),
    );
  }, [q]);

  const isTextEffect = activeType === "text-effect";

  const selectedTemplate =
    selectedId && isTextEffect
      ? (TEXT_EFFECT_TEMPLATES.find((t) => t.id === selectedId) ?? null)
      : null;

  const selectedAnimItem =
    selectedId && !isTextEffect
      ? (ANIM_ITEMS.find((item) => item.slug === selectedId) ?? null)
      : null;

  // Escape to close
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSelectedId(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const config = isTextEffect
    ? {
      items: filteredTextEffects,
      Card: TextEffectCard as any,
      Detail: ExpandedDetail as any,
      selected: selectedTemplate,
      key: "id",
      getProps: (x: TextEffectTemplate) => ({ template: x }),
    }
    : {
      items: ANIM_ITEMS.filter((a) => a.category === activeType),
      Card: EntranceCard as any,
      Detail: EntranceExpandedDetail as any,
      selected: selectedAnimItem,
      key: "slug",
      getProps: (x: AnimItem) => ({ item: x }),
    };

  return (
    <div className="flex min-h-screen bg-[#0d0c14] text-white lg:grid lg:grid-cols-[260px_1fr]">
      {/* ── Left Rail ──────────────────────────────────────────────────────── */}
      <aside className="scroll-slim shrink-0 border-b border-line lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:border-b-0 lg:border-r">
        <div className="px-4 pb-6 pt-20 lg:pt-24">
          <p className="px-2 text-[10px] font-bold uppercase tracking-widest text-white/30">
            Animation Type
          </p>
          <nav className="mt-3 flex flex-col gap-0.5">
            {ANIMATION_TYPES.map((t) => {
              const on = activeType === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    if (!t.badge) {
                      setActiveType(t.id);
                      setSelectedId(null);
                    }
                  }}
                  disabled={!!t.badge}
                  className={`group relative flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition ${on
                    ? "bg-white/[0.07] font-medium text-white"
                    : t.badge
                      ? "cursor-not-allowed text-white/30"
                      : "text-white/55 hover:bg-white/[0.04] hover:text-white/85"
                    }`}
                >
                  {on && (
                    <span className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10" />
                  )}
                  <span className="relative">{t.label}</span>
                  {t.badge && (
                    <span className="relative rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-white/25">
                      {t.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div
        className={`relative min-w-0 ${selectedId ? "lg:h-screen lg:overflow-hidden" : ""}`}
      >
        {config && config.items.length > 0 ? (
          <LayoutGroup>
            <div className="p-16">
              <div className="grid grid-cols-1 border-b border-t border-l border-white/10 sm:grid-cols-2 lg:grid-cols-3">
                {config.items.map((item, idx) => {
                  const key = (item as any)[config.key] as string;

                  return (
                    <config.Card
                      key={key}
                      index={idx + 1}
                      {...(config.getProps as (x: any) => any)(item)}
                      isSelected={selectedId === key}
                      hasSelection={selectedId !== null}
                      onSelect={() => setSelectedId(key)}
                    />
                  );
                })}
              </div>
            </div>

            <AnimatePresence>
              {config.selected && (
                <config.Detail
                  {...(config.getProps as (x: any) => any)(config.selected)}
                  onClose={() => setSelectedId(null)}
                />
              )}
            </AnimatePresence>
          </LayoutGroup>
        ) : (
          <ComingSoonCard
            label={
              ANIMATION_TYPES.find((t) => t.id === activeType)?.label ??
              activeType
            }
          />
        )}
      </div>
    </div>
  );
}

const ENTRANCE_SCENE: Record<string, string> = {
  "fade-in": "an upgrade modal",
  "slide-in": "a notification panel",
  "scale-in": "a ⌘K command menu",
  "pop-in": "an achievement badge",
  reveal: "a media card",
  "enter-exit": "a toast",
};

function fullEntrancePrompt(item: AnimItem): string {
  return [
    item.prompt,
    "",
    `Craft note: ${item.tip}`,
    `Performance: animate transform & opacity only, target 60fps, never animate layout properties (width/height/top/left).`,
    `Reduced motion: respect prefers-reduced-motion — replace the motion with a calm crossfade or a static end state.`,
  ].join("\n");
}

function EntranceCard({
  index,
  item,
  isSelected,
  hasSelection,
  onSelect,
}: {
  index: number;
  item: AnimItem;
  isSelected: boolean;
  hasSelection: boolean;
  onSelect: () => void;
}) {
  const displayIndex = String(index).padStart(2, "0");
  const { ripples, trigger } = useRipple();
  const reduce = useReducedMotion();

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    trigger(e);
    onSelect();
  }

  return (
    <motion.div
      layoutId={`card-${item.slug}`}
      onClick={handleClick}
      animate={
        hasSelection && !isSelected
          ? { opacity: 0, scale: 0.96, filter: "blur(2px)" }
          : { opacity: 1, scale: 1, filter: "blur(0px)" }
      }
      transition={reduce ? { duration: 0 } : EASE}
      className="group relative flex aspect-[4/3] cursor-pointer flex-col justify-between overflow-hidden border-b border-r border-white/10 bg-[#0d0c14] p-6"
      style={{ willChange: "transform, opacity" }}
    >
      <div className="absolute inset-0 bg-[#12111c] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

      {ripples.map((r) => (
        <span
          key={r.id}
          className="pointer-events-none absolute animate-ripple rounded-full bg-white/10"
          style={{
            left: r.x - r.size / 2,
            top: r.y - r.size / 2,
            width: r.size,
            height: r.size,
          }}
        />
      ))}

      <motion.div layoutId={`card-bar-${item.slug}`} className="relative flex items-center justify-between">
        <span className="font-mono text-xs font-semibold text-white/40 group-hover:text-white/60">
          {displayIndex}
        </span>
        <div className="flex items-center gap-2 opacity-0 transition duration-200 group-hover:opacity-100">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#7c5cff]/40 bg-[#7c5cff]/10 px-3 py-1 text-[11px] font-mono font-bold tracking-wider text-[#a78bfa]">
            <Sparkles className="h-3 w-3" />
            PROMPT
          </span>
        </div>
      </motion.div>

      <motion.div layoutId={`card-stage-${item.slug}`} className="relative flex flex-1 w-full items-center justify-center overflow-hidden py-2">
        <div className="h-full w-full flex items-center justify-center">
          <AnimDemo demo={item.demo} variant={item.variant} />
        </div>
      </motion.div>

      <motion.div layoutId={`card-label-${item.slug}`} className="relative text-center">
        <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-white/35 group-hover:text-white/60">
          {item.name}
        </span>
      </motion.div>
    </motion.div>
  );
}

function EntranceExpandedDetail({
  item,
  onClose,
}: {
  item: AnimItem;
  onClose: () => void;
}) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "success" | "error">("idle");
  const [replayKey, setReplayKey] = useState(0);
  const reduce = useReducedMotion();
  const text = fullEntrancePrompt(item);
  const chips = item.use ?? USE_BY_CAT[item.category] ?? [];

  useEffect(() => {
    setCopyStatus("idle");
    setReplayKey((k) => k + 1);
  }, [item]);

  useEffect(() => {
    if (reduce || item.category === "looping" || item.category === "gallery") return;
    const id = setInterval(() => setReplayKey((k) => k + 1), 4000);
    return () => clearInterval(id);
  }, [reduce, item.category]);

  async function copy() {
    setCopyStatus((await copyText(text)) ? "success" : "error");
    setTimeout(() => setCopyStatus("idle"), 2200);
  }

  return (
    <motion.div
      layoutId={`card-${item.slug}`}
      className="absolute inset-0 z-20 flex flex-col overflow-hidden bg-[#0d0c14]"
      transition={reduce ? { duration: 0 } : SPRING}
      style={{ borderRadius: 0 }}
    >
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ delay: 0.18, duration: 0.22 }}
        className="flex items-center justify-between border-b border-white/8 px-6 py-4"
      >
        <button
          onClick={onClose}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <button
          onClick={copy}
          className="inline-flex items-center gap-2 rounded-full border border-[#7c5cff]/30 bg-[#7c5cff]/10 px-4 py-2 text-sm font-medium text-[#a78bfa] transition hover:bg-[#7c5cff]/20"
        >
          {copyStatus === "success" ? (
            <Check className="h-4 w-4 text-emerald-400" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          {copyStatus === "success" ? "Copied!" : "Copy Prompt"}
        </button>
      </motion.div>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <motion.div
          layoutId={`card-stage-${item.slug}`}
          className="relative flex flex-1 items-center justify-center overflow-hidden border-b border-white/8 lg:border-b-0 lg:border-r"
          transition={reduce ? { duration: 0 } : SPRING}
        >
          <Stage accent={ENTRANCE_COLOR} className="h-full w-full rounded-none border-none">
            <AnimatePresence mode="wait" initial={!reduce}>
              <motion.div
                key={`${item.slug}-${replayKey}`}
                initial={reduce ? false : { opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.99 }}
                transition={reduce ? { duration: 0 } : { duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="flex h-full w-full items-center justify-center"
              >
                <AnimDemo demo={item.demo} variant={item.variant} />
              </motion.div>
            </AnimatePresence>
          </Stage>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.25 }}
            onClick={() => setReplayKey((k) => k + 1)}
            className="absolute bottom-4 right-5 z-20 flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-white/40 transition hover:bg-white/10 hover:text-white/70"
          >
            <RotateCw className="h-3 w-3" /> replay
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 24 }}
          transition={{ delay: 0.15, ...EASE }}
          className="flex w-full flex-col gap-5 overflow-y-auto p-8 lg:w-[420px] lg:shrink-0"
        >
          <motion.div layoutId={`card-label-${item.slug}`} transition={reduce ? { duration: 0 } : SPRING}>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#a78bfa]">
              {ANIM_CATEGORIES.find((c) => c.slug === "entrances")?.name}
            </span>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-white">
              {item.name}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/50">
              {item.def}
            </p>
          </motion.div>

          <div className="flex flex-wrap items-center gap-2">
            {ENTRANCE_SCENE[item.slug] && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-white/45">
                <Monitor className="h-3 w-3" /> Demoed on {ENTRANCE_SCENE[item.slug]}
              </span>
            )}
            {chips.map((c) => (
              <span key={c} className="rounded-full bg-white/[0.05] px-2.5 py-1 text-[11px] text-white/60">
                {c}
              </span>
            ))}
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <p className="text-[11px] font-bold uppercase tracking-widest text-white/40">Craft note</p>
            <p className="mt-2 text-sm leading-relaxed text-white/70">{item.tip}</p>
          </div>

          <div className="h-px bg-white/8" />

          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-white/30">
              AI Prompt
            </p>
            <pre className="overflow-y-auto whitespace-pre-wrap rounded-2xl border border-white/8 bg-black/40 p-5 font-mono text-[12px] leading-relaxed text-white/65">
              {text}
            </pre>
          </div>

          <p className="text-[11px] text-white/25">
            Paste into v0 / Cursor / Claude
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Grid card ────────────────────────────────────────────────────────────────

function TextEffectCard({
  index,
  template,
  isSelected,
  hasSelection,
  onSelect,
}: {
  index: number;
  template: TextEffectTemplate;
  isSelected: boolean;
  hasSelection: boolean;
  onSelect: () => void;
}) {
  const displayIndex = String(index).padStart(2, "0");
  const { ripples, trigger } = useRipple();
  const reduce = useReducedMotion();

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    trigger(e);
    onSelect();
  }

  return (
    <motion.div
      layoutId={`card-${template.id}`}
      onClick={handleClick}
      // Siblings fade + scale down while a card is selected
      animate={
        hasSelection && !isSelected
          ? { opacity: 0, scale: 0.96, filter: "blur(2px)" }
          : { opacity: 1, scale: 1, filter: "blur(0px)" }
      }
      transition={reduce ? { duration: 0 } : EASE}
      className="group relative flex aspect-[4/3] cursor-pointer flex-col justify-between overflow-hidden border-b border-r border-white/10 bg-[#0d0c14] p-6"
      style={{ willChange: "transform, opacity" }}
    >
      {/* hover bg — separate so layout doesn't interfere */}
      <div className="absolute inset-0 bg-[#12111c] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

      {/* Ripples */}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="pointer-events-none absolute animate-ripple rounded-full bg-white/10"
          style={{
            left: r.x - r.size / 2,
            top: r.y - r.size / 2,
            width: r.size,
            height: r.size,
          }}
        />
      ))}

      {/* Top bar */}
      <motion.div layoutId={`card-bar-${template.id}`} className="relative flex items-center justify-between">
        <span className="font-mono text-xs font-semibold text-white/40 group-hover:text-white/60">
          {displayIndex}
        </span>
        <div className="flex items-center gap-2 opacity-0 transition duration-200 group-hover:opacity-100">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-pink-500/40 bg-pink-500/10 px-3 py-1 text-[11px] font-mono font-bold tracking-wider text-pink-400">
            <Sparkles className="h-3 w-3" />
            PROMPT
          </span>
        </div>
      </motion.div>

      {/* Center stage */}
      <motion.div layoutId={`card-stage-${template.id}`} className="relative flex flex-1 items-center justify-center py-4">
        <TextEffectRenderer template={template} text="" replayKey={0} />
      </motion.div>

      {/* Bottom label */}
      <motion.div layoutId={`card-label-${template.id}`} className="relative text-center">
        <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-white/35 group-hover:text-white/60">
          {template.animationTextType}
        </span>
      </motion.div>
    </motion.div>
  );
}

// ─── Expanded detail (shared element target) ──────────────────────────────────

function ExpandedDetail({
  template,
  onClose,
}: {
  template: TextEffectTemplate;
  onClose: () => void;
}) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "success" | "error">("idle");
  const [replayKey, setReplayKey] = useState(0);
  const reduce = useReducedMotion();
  const text = `${template.prompt}\n\nType: ${template.animationTextType}\nCategory: ${template.category}`;

  useEffect(() => {
    setCopyStatus("idle");
    setReplayKey((k) => k + 1);
  }, [template]);

  useEffect(() => {
    const id = setInterval(() => setReplayKey((k) => k + 1), 3500);
    return () => clearInterval(id);
  }, []);

  async function copy() {
    setCopyStatus((await copyText(text)) ? "success" : "error");
    setTimeout(() => setCopyStatus("idle"), 2200);
  }

  return (
    // The card's layoutId — Framer Motion FLIP-animates from the card's
    // bounding box to this absolute inset-0 position
    <motion.div
      layoutId={`card-${template.id}`}
      className="absolute inset-0 z-20 flex flex-col overflow-hidden bg-[#0d0c14]"
      transition={reduce ? { duration: 0 } : SPRING}
      style={{ borderRadius: 0 }}
    >
      {/* ── Back button ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ delay: 0.18, duration: 0.22 }}
        className="flex items-center justify-between border-b border-white/8 px-6 py-4"
      >
        <button
          onClick={onClose}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <button
          onClick={copy}
          className="inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-4 py-2 text-sm font-medium text-pink-400 transition hover:bg-pink-500/20"
        >
          {copyStatus === "success" ? (
            <Check className="h-4 w-4 text-emerald-400" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          {copyStatus === "success" ? "Copied!" : "Copy Prompt"}
        </button>
      </motion.div>

      {/* ── Split layout ── */}
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* Left — live stage (shares layoutId with card center) */}
        <motion.div
          layoutId={`card-stage-${template.id}`}
          className="relative flex flex-1 items-center justify-center overflow-hidden border-b border-white/8 lg:border-b-0 lg:border-r"
          transition={reduce ? { duration: 0 } : SPRING}
        >
          {/* grid backdrop */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          <div className="relative scale-150">
            <TextEffectRenderer template={template} text="" replayKey={replayKey} />
          </div>
          {/* replay */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.25 }}
            onClick={() => setReplayKey((k) => k + 1)}
            className="absolute bottom-4 right-5 flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-white/40 transition hover:bg-white/10 hover:text-white/70"
          >
            ↺ replay
          </motion.button>
        </motion.div>

        {/* Right — meta + prompt */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 24 }}
          transition={{ delay: 0.15, ...EASE }}
          className="flex w-full flex-col gap-5 overflow-y-auto p-8 lg:w-[420px] lg:shrink-0"
        >
          {/* Label carries the same layoutId so it morphs in place */}
          <motion.div layoutId={`card-label-${template.id}`} transition={reduce ? { duration: 0 } : SPRING}>
            <span className="font-mono text-[10px] uppercase tracking-widest text-pink-400/80">
              {template.animationTextType}
            </span>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-white">
              {template.name}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/50">
              {template.description}
            </p>
          </motion.div>

          <div className="h-px bg-white/8" />

          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-white/30">
              AI Prompt
            </p>
            <pre className="overflow-y-auto whitespace-pre-wrap rounded-2xl border border-white/8 bg-black/40 p-5 font-mono text-[12px] leading-relaxed text-white/65">
              {text}
            </pre>
          </div>

          <p className="text-[11px] text-white/25">
            Paste into v0 / Cursor / Claude
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Coming-soon card ─────────────────────────────────────────────────────────

function ComingSoonCard({ label }: { label: string }) {
  return (
    <div className="flex min-h-[420px] items-center justify-center px-6 py-20">
      <div className="flex max-w-sm flex-col items-center gap-5 rounded-2xl border border-white/8 bg-white/[0.025] px-10 py-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
          <Wrench className="h-5 w-5 text-white/40" />
        </div>
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-pink-500/70">
            {label}
          </p>
          <p className="mt-2 text-base font-medium text-white/70">
            This feature is currently under development.
          </p>
          <p className="mt-1 text-sm text-white/30">Please check back later!</p>
        </div>
      </div>
    </div>
  );
}
