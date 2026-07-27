"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence, LayoutGroup, useReducedMotion } from "framer-motion";
import { copyText } from "@/lib/copyText";
import { Check, Copy, Sparkles, Wrench, ArrowLeft, RotateCw, Monitor, Search, ArrowRight, X, Code2, Plug, Info } from "lucide-react";
import {
  TEXT_EFFECT_TEMPLATES,
  TextEffectRenderer,
  type TextEffectTemplate,
} from "./anim/TextEffects";
import {
  TextOptionsPanel,
  DEFAULT_TEXT_OPTIONS,
  type TextOptions,
} from "./anim/TextOptionsPanel";
import { GalleryOptionsPanel } from "./anim/GalleryOptionsPanel";
import {
  DEFAULT_GALLERY_OPTIONS,
  BASE_DEFAULT_GALLERY_OPTIONS,
  type GalleryOptions,
} from "./anim/gallerySchema";
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
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [modalSearchQuery, setModalSearchQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const typeParam = searchParams.get("type");
  const itemParam = searchParams.get("item");

  const [mobileView, setMobileView] = useState<"categories" | "items">(() =>
    itemParam || typeParam ? "items" : "categories"
  );

  useEffect(() => {
    if (itemParam || typeParam) {
      setMobileView("items");
    }
  }, [itemParam, typeParam]);

  const selectedId = useMemo(() => {
    if (!itemParam) return null;
    const isText = TEXT_EFFECT_TEMPLATES.some((t) => t.id === itemParam);
    if (isText) return itemParam;
    const isAnim = ANIM_ITEMS.some((a) => a.slug === itemParam);
    if (isAnim) return itemParam;
    return null;
  }, [itemParam]);

  const activeType = useMemo(() => {
    if (typeParam && ANIMATION_TYPES.some((t) => t.id === typeParam && !t.badge)) {
      return typeParam;
    }
    if (selectedId) {
      const textItem = TEXT_EFFECT_TEMPLATES.find((t) => t.id === selectedId);
      if (textItem) return "text-effect";
      const animItem = ANIM_ITEMS.find((a) => a.slug === selectedId);
      if (animItem) return animItem.category;
    }
    return "gallery";
  }, [typeParam, selectedId]);

  const createQueryString = useCallback(
    (type?: string | null, item?: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (type && type !== "gallery") {
        params.set("type", type);
      } else {
        params.delete("type");
      }
      if (item) {
        params.set("item", item);
      } else {
        params.delete("item");
      }
      const queryString = params.toString();
      return queryString ? `${pathname}?${queryString}` : pathname;
    },
    [searchParams, pathname]
  );

  const handleSelectCategory = useCallback(
    (typeId: string) => {
      const nextUrl = createQueryString(typeId, null);
      router.push(nextUrl, { scroll: false });
      setMobileView("items");
    },
    [createQueryString, router]
  );

  const handleSelectItem = useCallback(
    (itemKey: string) => {
      const nextUrl = createQueryString(activeType, itemKey);
      router.push(nextUrl, { scroll: false });
    },
    [createQueryString, activeType, router]
  );

  const handleCloseDetail = useCallback(() => {
    const nextUrl = createQueryString(activeType, null);
    router.push(nextUrl, { scroll: false });
  }, [createQueryString, activeType, router]);

  const allSearchableItems = useMemo(() => {
    const anims = ANIM_ITEMS.map((item) => {
      const catObj = ANIMATION_TYPES.find((t) => t.id === item.category);
      return {
        id: item.slug,
        name: item.name,
        category: item.category,
        categoryName: catObj?.label ?? item.category,
        def: item.def,
      };
    });

    const texts = TEXT_EFFECT_TEMPLATES.map((tmpl) => ({
      id: tmpl.id,
      name: tmpl.name,
      category: "text-effect",
      categoryName: "Text Effect",
      def: tmpl.description,
    }));

    return [...anims, ...texts];
  }, []);

  const filteredSearchResults = useMemo(() => {
    const query = modalSearchQuery.trim().toLowerCase();
    if (!query) return allSearchableItems;
    return allSearchableItems.filter((item) =>
      `${item.name} ${item.categoryName} ${item.def}`.toLowerCase().includes(query)
    );
  }, [allSearchableItems, modalSearchQuery]);

  const handleSelectSearchResult = useCallback(
    (itemKey: string, categoryId: string) => {
      const nextUrl = createQueryString(categoryId, itemKey);
      router.push(nextUrl, { scroll: false });
      setSearchModalOpen(false);
      setModalSearchQuery("");
      setMobileView("items");
    },
    [createQueryString, router]
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
        setModalSearchQuery("");
        setHighlightedIndex(0);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (searchModalOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [searchModalOpen]);

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
      if (e.key === "Escape" && selectedId) {
        handleCloseDetail();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId, handleCloseDetail]);

  const scrollPosRef = useRef<number>(0);
  const prevSelectedIdRef = useRef<string | null>(selectedId);
  const prevActiveTypeRef = useRef<string>(activeType);

  useEffect(() => {
    if (prevActiveTypeRef.current !== activeType) {
      prevActiveTypeRef.current = activeType;
      scrollPosRef.current = 0;
      window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }

    if (prevSelectedIdRef.current === null && selectedId !== null) {
      scrollPosRef.current = window.scrollY;
      document.body.style.overflow = "hidden";
    } else if (prevSelectedIdRef.current !== null && selectedId === null) {
      document.body.style.overflow = "";
      window.scrollTo({ top: scrollPosRef.current, behavior: "instant" });
    } else if (selectedId !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    prevSelectedIdRef.current = selectedId;
  }, [selectedId, activeType]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
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
    : activeType === "gallery"
      ? {
        items: ANIM_ITEMS.filter((a) => a.category === activeType),
        Card: EntranceCard as any,
        Detail: GalleryExpandedDetail as any,
        selected: selectedAnimItem,
        key: "slug",
        getProps: (x: AnimItem) => ({ item: x }),
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
    <div className="block min-h-screen bg-[#0d0c14] text-white lg:grid lg:grid-cols-[280px_1fr]">
      {/* ── Left Rail ──────────────────────────────────────────────────────── */}
      <aside className={`scroll-slim w-full border-b border-line lg:w-auto lg:shrink-0 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:border-b-0 lg:border-r ${mobileView === "items" ? "hidden lg:block" : "block"
        }`}>
        <div className="px-4 pb-6 pt-20 lg:pt-24">
          {/* Search Trigger Input Box */}
          <div className="mb-4">
            <button
              type="button"
              onClick={() => {
                setSearchModalOpen(true);
                setModalSearchQuery("");
                setHighlightedIndex(0);
              }}
              className="group flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-left transition hover:border-white/20 hover:bg-white/[0.07]"
            >
              <div className="flex items-center gap-2 text-xs text-white/50 group-hover:text-white/70">
                <Search className="h-3.5 w-3.5 shrink-0" />
                <span className="font-mono">Search Components...</span>
              </div>
              <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-white/40">
                ⌘ + K
              </kbd>
            </button>
          </div>

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
                      handleSelectCategory(t.id);
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
      <div className={`relative min-w-0 w-full flex-1 ${mobileView === "categories" ? "hidden lg:block" : "block"
        }`}>
        {/* Mobile Header Bar */}
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 pt-20 lg:hidden">
          <button
            onClick={() => setMobileView("categories")}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-white/70 hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Categories
          </button>
          <span className="font-mono text-xs font-semibold text-white/50">
            {ANIMATION_TYPES.find((t) => t.id === activeType)?.label ?? activeType}
          </span>
        </div>

        {config && config.items.length > 0 ? (
          <LayoutGroup>
            <div className="p-4 sm:p-8 lg:p-16">
              <div className="grid grid-cols-1 border-b border-t border-l border-white/10 lg:grid-cols-3">
                {config.items.map((item, idx) => {
                  const key = (item as any)[config.key] as string;

                  return (
                    <config.Card
                      key={key}
                      index={idx + 1}
                      {...(config.getProps as (x: any) => any)(item)}
                      isSelected={selectedId === key}
                      hasSelection={selectedId !== null}
                      onSelect={() => handleSelectItem(key)}
                    />
                  );
                })}
              </div>
            </div>

            <AnimatePresence>
              {config.selected && (
                <config.Detail
                  {...(config.getProps as (x: any) => any)(config.selected)}
                  onClose={handleCloseDetail}
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

      {/* ── Search Modal Palette ────────────────────────────────────────────── */}
      <AnimatePresence>
        {searchModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setSearchModalOpen(false)}
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/75 p-4 pt-20 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="flex w-full max-w-lg flex-col overflow-hidden rounded-xl border border-white/15 bg-[#12111c] shadow-2xl"
            >
              {/* Top Search Input Header */}
              <div className="flex items-center border-b border-white/10 px-4 py-3">
                <Search className="mr-3 h-4 w-4 shrink-0 text-white/40" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search Components..."
                  value={modalSearchQuery}
                  onChange={(e) => {
                    setModalSearchQuery(e.target.value);
                    setHighlightedIndex(0);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setHighlightedIndex((prev) => (prev + 1) % Math.max(1, filteredSearchResults.length));
                    } else if (e.key === "ArrowUp") {
                      e.preventDefault();
                      setHighlightedIndex((prev) => (prev - 1 + filteredSearchResults.length) % Math.max(1, filteredSearchResults.length));
                    } else if (e.key === "Enter" && filteredSearchResults[highlightedIndex]) {
                      e.preventDefault();
                      const item = filteredSearchResults[highlightedIndex];
                      handleSelectSearchResult(item.id, item.category);
                    } else if (e.key === "Escape") {
                      e.preventDefault();
                      setSearchModalOpen(false);
                    }
                  }}
                  className="w-full bg-transparent font-mono text-sm text-white placeholder-white/40 focus:outline-none"
                />
                {modalSearchQuery && (
                  <button
                    onClick={() => setModalSearchQuery("")}
                    className="mr-2 text-white/40 hover:text-white"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
                <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-white/30">
                  ESC
                </kbd>
              </div>

              {/* Body List */}
              <div className="scroll-slim flex max-h-80 flex-col overflow-y-auto p-2">
                <div className="px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-white/30">
                  Libraries
                </div>
                {filteredSearchResults.length > 0 ? (
                  filteredSearchResults.map((item, idx) => {
                    const isHighlighted = idx === highlightedIndex;
                    return (
                      <button
                        key={`${item.category}-${item.id}`}
                        onClick={() => handleSelectSearchResult(item.id, item.category)}
                        onMouseEnter={() => setHighlightedIndex(idx)}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition ${isHighlighted
                          ? "bg-white/10 text-white"
                          : "text-white/70 hover:bg-white/5 hover:text-white"
                          }`}
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <ArrowRight className="h-3.5 w-3.5 shrink-0 text-white/40" />
                          <span className="truncate font-mono text-xs font-medium">
                            {item.name}
                          </span>
                        </div>
                        <span className="shrink-0 rounded bg-white/5 px-2 py-0.5 font-mono text-[10px] text-white/40">
                          {item.categoryName}
                        </span>
                      </button>
                    );
                  })
                ) : (
                  <div className="px-4 py-8 text-center font-mono text-xs text-white/30">
                    No matching animation components found
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Copy Modal ──────────────────────────────────────────────────────────────

type CopyOption = "code" | "framer" | "mcp";

const COPY_OPTIONS: { id: CopyOption; label: string; icon: React.ReactNode; description: string }[] = [
  {
    id: "code",
    label: "Copy Code",
    icon: <Code2 className="h-5 w-5" />,
    description: "Copy the complete component code, ready to customize.",
  },
  {
    id: "framer",
    label: "Copy in Framer",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M4 0h16v8h-8zm0 8h8l8 8H4zm0 8h8v8z" />
      </svg>
    ),
    description: "Copy the component, paste it into Framer, and start building immediately.",
  },
  {
    id: "mcp",
    label: "Copy with MCP",
    icon: <Plug className="h-5 w-5" />,
    description:
      "Connect with Claude, Cursor, Codex, and other AI coding tools, import components straight into your IDE, no manual setup needed.",
  },
];

function getFullTextEffectCode(
  type: string,
  effectName: string,
  textVal: string,
  template: TextEffectTemplate
): string {
  const safeText = JSON.stringify(textVal);
  const needsHooks = type === "scramble";
  const needsMotion = type !== "scramble";
  const reactImport = needsHooks
    ? `import { useEffect, useState } from "react";`
    : `import React from "react";`;
  const motionImport = needsMotion ? `import { motion } from "framer-motion";` : "";

  let body = "";

  switch (type) {
    case "typewriter":
      body = `
export function ${effectName}Effect({ text = ${safeText} }: { text?: string }) {
  return (
    <div className="flex items-center font-mono text-2xl font-bold tracking-tight text-white sm:text-3xl">
      <motion.span
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: Math.max(1.2, text.length * 0.06), ease: "linear" }}
        className="inline-block overflow-hidden whitespace-nowrap"
      >
        {text}
      </motion.span>
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="ml-1 inline-block h-7 w-2.5 bg-[#22d3ee]"
      />
    </div>
  );
}`;
      break;

    case "stagger-up":
      body = `
export function ${effectName}Effect({ text = ${safeText} }: { text?: string }) {
  const words = text.split(" ");
  return (
    <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-2xl font-bold text-white sm:text-3xl">
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden py-1">
          <motion.span
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: i * 0.08, type: "spring", stiffness: 300, damping: 24 }}
            className="inline-block"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </div>
  );
}`;
      break;

    case "fade-words":
      body = `
export function ${effectName}Effect({ text = ${safeText} }: { text?: string }) {
  const words = text.split(" ");
  return (
    <div className="flex flex-wrap justify-center gap-x-2.5 gap-y-1 text-2xl font-medium text-white/90 sm:text-3xl">
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, filter: "blur(6px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
          className="inline-block"
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}`;
      break;

    case "character-pop":
      body = `
export function ${effectName}Effect({ text = ${safeText} }: { text?: string }) {
  const chars = text.split("");
  return (
    <div className="flex flex-wrap justify-center text-2xl font-extrabold tracking-wider text-white sm:text-3xl">
      {chars.map((ch, i) => (
        <motion.span
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: i * 0.03, type: "spring", stiffness: 450, damping: 14 }}
          className="inline-block"
        >
          {ch === " " ? "\\u00A0" : ch}
        </motion.span>
      ))}
    </div>
  );
}`;
      break;

    case "gradient-wave":
      body = `
export function ${effectName}Effect({ text = ${safeText} }: { text?: string }) {
  return (
    <div className="text-center text-2xl font-extrabold sm:text-4xl">
      <motion.span
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        style={{
          background: "linear-gradient(90deg, #a855f7, #22d3ee, #ec4899, #a855f7)",
          backgroundSize: "300% 100%",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
        className="inline-block"
      >
        {text}
      </motion.span>
    </div>
  );
}`;
      break;

    case "glitch":
      body = `
export function ${effectName}Effect({ text = ${safeText} }: { text?: string }) {
  return (
    <div className="relative text-2xl font-black tracking-widest text-white sm:text-3xl">
      <motion.span
        animate={{ x: [-2, 2, -1, 0] }}
        transition={{ duration: 0.25, repeat: Infinity, repeatDelay: 1.2 }}
        className="relative z-10 block"
      >
        {text}
      </motion.span>
      <span className="absolute inset-0 text-cyan-400 opacity-75" style={{ clipPath: "inset(0 0 55% 0)" }} aria-hidden>
        {text}
      </span>
      <span className="absolute inset-0 text-rose-500 opacity-75" style={{ clipPath: "inset(45% 0 0 0)" }} aria-hidden>
        {text}
      </span>
    </div>
  );
}`;
      break;

    case "scramble":
      body = `
export function ${effectName}Effect({ text = ${safeText} }: { text?: string }) {
  const [display, setDisplay] = useState(text);
  const glyphs = "ABCDEFGIJKLMNOPQRSTUVXYZ0123456789#$@!%&";

  useEffect(() => {
    let frame = 0;
    const maxFrames = 25;
    const interval = setInterval(() => {
      frame++;
      if (frame >= maxFrames) {
        setDisplay(text);
        clearInterval(interval);
      } else {
        setDisplay(
          text.split("").map((ch) => (ch === " " ? " " : glyphs[Math.floor(Math.random() * glyphs.length)])).join("")
        );
      }
    }, 40);
    return () => clearInterval(interval);
  }, [text]);

  return <div className="font-mono text-2xl font-bold tracking-widest text-emerald-400 sm:text-3xl">{display}</div>;
}`;
      break;

    case "3d-flip":
      body = `
export function ${effectName}Effect({ text = ${safeText} }: { text?: string }) {
  const chars = text.split("");
  return (
    <div className="flex flex-wrap justify-center text-2xl font-bold tracking-tight text-white sm:text-3xl" style={{ perspective: "500px" }}>
      {chars.map((ch, i) => (
        <motion.span
          key={i}
          initial={{ rotateX: 90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block origin-bottom"
        >
          {ch === " " ? "\\u00A0" : ch}
        </motion.span>
      ))}
    </div>
  );
}`;
      break;

    case "neon-glow":
      body = `
export function ${effectName}Effect({ text = ${safeText} }: { text?: string }) {
  return (
    <motion.div
      animate={{
        textShadow: [
          "0 0 4px #fff, 0 0 11px #22d3ee, 0 0 24px #22d3ee, 0 0 48px #22d3ee",
          "none",
          "0 0 4px #fff, 0 0 11px #22d3ee, 0 0 24px #22d3ee, 0 0 48px #22d3ee",
        ],
        opacity: [1, 0.35, 1],
      }}
      transition={{ duration: 3.2, repeat: Infinity, times: [0, 0.5, 1] }}
      className="text-center text-2xl font-black tracking-widest text-cyan-300 sm:text-3xl"
    >
      {text}
    </motion.div>
  );
}`;
      break;

    case "blur-reveal":
      body = `
export function ${effectName}Effect({ text = ${safeText} }: { text?: string }) {
  return (
    <motion.div
      initial={{ filter: "blur(14px)", opacity: 0, scale: 0.95 }}
      animate={{ filter: "blur(0px)", opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="text-center text-2xl font-bold tracking-tight text-white sm:text-3xl"
    >
      {text}
    </motion.div>
  );
}`;
      break;

    case "wave":
      body = `
export function ${effectName}Effect({ text = ${safeText} }: { text?: string }) {
  const chars = text.split("");
  return (
    <div className="flex justify-center text-2xl font-bold tracking-widest text-[#22d3ee] sm:text-3xl">
      {chars.map((ch, i) => (
        <motion.span
          key={i}
          animate={{ y: [7, -7, 7] }}
          transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut", delay: i * -0.14 }}
          className="inline-block"
        >
          {ch === " " ? "\\u00A0" : ch}
        </motion.span>
      ))}
    </div>
  );
}`;
      break;

    case "liquid-fill":
      body = `
export function ${effectName}Effect({ text = ${safeText} }: { text?: string }) {
  return (
    <div className="text-2xl font-black tracking-widest sm:text-4xl">
      <motion.span
        animate={{ backgroundPosition: ["0% -110%", "0% 10%", "0% -110%"] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background: "linear-gradient(0deg, #22d3ee 0 46%, rgba(34,211,238,0.5) 48%, transparent 52% 100%)",
          backgroundSize: "100% 220%",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          WebkitTextStroke: "1px rgba(34,211,238,0.6)",
        }}
        className="inline-block"
      >
        {text}
      </motion.span>
    </div>
  );
}`;
      break;

    case "chrome-shine":
      body = `
export function ${effectName}Effect({ text = ${safeText} }: { text?: string }) {
  return (
    <div className="text-2xl font-black tracking-widest sm:text-3xl">
      <motion.span
        animate={{ backgroundPosition: ["130% 0", "-130% 0"] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background: "linear-gradient(105deg, rgba(255,255,255,0.3) 0 38%, #fff 47%, #fff 50%, rgba(255,255,255,0.3) 53% 100%)",
          backgroundSize: "260% 100%",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          color: "transparent",
        }}
        className="inline-block"
      >
        {text}
      </motion.span>
    </div>
  );
}`;
      break;

    case "focus-blur":
      body = `
export function ${effectName}Effect({ text = ${safeText} }: { text?: string }) {
  const chars = text.split("");
  return (
    <div className="flex justify-center text-2xl font-bold tracking-widest text-white sm:text-3xl">
      {chars.map((ch, i) => (
        <motion.span
          key={i}
          animate={{ filter: ["blur(0px)", "blur(7px)", "blur(0px)"], opacity: [1, 0.35, 1] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.18 }}
          className="inline-block"
        >
          {ch === " " ? "\\u00A0" : ch}
        </motion.span>
      ))}
    </div>
  );
}`;
      break;

    case "echo":
      body = `
export function ${effectName}Effect({ text = ${safeText} }: { text?: string }) {
  return (
    <div className="relative flex items-center justify-center text-2xl font-black tracking-widest text-white sm:text-3xl">
      <span className="relative z-10">{text}</span>
      {[0, 1].map((layer) => (
        <motion.span
          key={layer}
          aria-hidden
          animate={{ scale: [1, 1.9], opacity: [0.7, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: layer * 1 }}
          style={{ color: layer === 0 ? "#7c5cff" : "#22d3ee" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {text}
        </motion.span>
      ))}
    </div>
  );
}`;
      break;

    case "spectrum":
      body = `
export function ${effectName}Effect({ text = ${safeText} }: { text?: string }) {
  const chars = text.split("");
  return (
    <div className="flex justify-center text-2xl font-bold tracking-widest sm:text-3xl">
      {chars.map((ch, i) => (
        <motion.span
          key={i}
          animate={{ filter: [\`hue-rotate(\${i * 42}deg)\`, \`hue-rotate(\${i * 42 + 360}deg)\`] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
          style={{ color: "#ff2d78" }}
          className="inline-block"
        >
          {ch === " " ? "\\u00A0" : ch}
        </motion.span>
      ))}
    </div>
  );
}`;
      break;

    case "jitter":
      body = `
export function ${effectName}Effect({ text = ${safeText} }: { text?: string }) {
  return (
    <motion.div
      animate={{
        skewX: [0, -14, 10, 0, 0, 0, 8, -6, 0],
        x: [0, -4, 3, 0, 0, 0, 2, 0, 0],
        opacity: [1, 1, 1, 1, 1, 1, 0.75, 1, 1],
      }}
      transition={{ duration: 1.9, repeat: Infinity, ease: "linear" }}
      className="text-2xl font-black tracking-widest text-white sm:text-3xl"
    >
      {text}
    </motion.div>
  );
}`;
      break;

    case "anaglyph":
      body = `
export function ${effectName}Effect({ text = ${safeText} }: { text?: string }) {
  return (
    <motion.div
      animate={{
        textShadow: [
          "0 0 0 #ff3355, 0 0 0 #33ddff",
          "-6px 0 1px #ff3355, 6px 0 1px #33ddff",
          "0 0 0 #ff3355, 0 0 0 #33ddff",
        ],
      }}
      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      className="text-2xl font-black tracking-widest text-white sm:text-3xl"
    >
      {text}
    </motion.div>
  );
}`;
      break;

    case "flap":
      body = `
export function ${effectName}Effect({ text = ${safeText} }: { text?: string }) {
  const chars = text.split("");
  return (
    <div className="flex items-center justify-center gap-1 font-mono text-2xl font-bold text-white sm:text-3xl" style={{ perspective: "400px" }}>
      {chars.map((ch, i) => (
        <motion.span
          key={i}
          animate={{ rotateX: [0, -88, 0, -25, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: i * 0.12 }}
          style={{
            display: "grid",
            placeItems: "center",
            width: "1.4em",
            height: "1.8em",
            background: "linear-gradient(rgba(255,255,255,0.12) 0 49%, rgba(255,255,255,0.06) 51% 100%)",
            borderRadius: "4px",
            transformOrigin: "center",
          }}
        >
          {ch === " " ? "\\u00A0" : ch}
        </motion.span>
      ))}
    </div>
  );
}`;
      break;

    case "elastic":
      body = `
export function ${effectName}Effect({ text = ${safeText} }: { text?: string }) {
  return (
    <motion.div
      animate={{
        scaleX: [1, 1.28, 0.78, 1.12, 0.96, 1.02, 1],
        scaleY: [1, 0.72, 1.24, 0.9, 1.05, 0.98, 1],
      }}
      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      className="text-2xl font-black tracking-widest text-[#22d3ee] sm:text-3xl"
    >
      {text}
    </motion.div>
  );
}`;
      break;

    case "spotlight":
      body = `
export function ${effectName}Effect({ text = ${safeText} }: { text?: string }) {
  return (
    <div className="text-2xl font-black tracking-widest sm:text-3xl">
      <motion.span
        animate={{ backgroundPosition: ["100% 0", "0% 0"] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }}
        style={{
          background: "radial-gradient(3.5ch 100% at 50% 50%, #fff 20%, rgba(255,255,255,0.12) 75%)",
          backgroundSize: "300% 100%",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
        className="inline-block"
      >
        {text}
      </motion.span>
    </div>
  );
}`;
      break;

    case "ember":
      body = `
export function ${effectName}Effect({ text = ${safeText} }: { text?: string }) {
  return (
    <motion.div
      animate={{
        textShadow: [
          "0 -2px 6px #ffab40, 0 -6px 14px #ff6d00, 0 -12px 28px #dd2c00, 0 -20px 44px rgba(213,0,0,0.55)",
          "0 -3px 8px #ffc46b, 0 -9px 20px #ff8f1f, 0 -18px 38px #ff3d00, 0 -30px 60px rgba(213,0,0,0.8)",
          "0 -2px 6px #ffab40, 0 -6px 14px #ff6d00, 0 -12px 28px #dd2c00, 0 -20px 44px rgba(213,0,0,0.55)",
        ],
      }}
      transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
      className="text-2xl font-black tracking-widest sm:text-3xl"
      style={{ color: "#ffd9a0" }}
    >
      {text}
    </motion.div>
  );
}`;
      break;

    case "melt":
      body = `
export function ${effectName}Effect({ text = ${safeText} }: { text?: string }) {
  const chars = text.split("");
  return (
    <div className="flex justify-center text-2xl font-black tracking-widest text-[#ec4899] sm:text-3xl">
      {chars.map((ch, i) => (
        <motion.span
          key={i}
          animate={{
            scaleY: [1, 1.55, 1],
            scaleX: [1, 0.92, 1],
            y: [0, 7, 0],
            filter: ["blur(0px)", "blur(1.5px)", "blur(0px)"],
          }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeIn", delay: i * 0.22 }}
          className="inline-block origin-top"
        >
          {ch === " " ? "\\u00A0" : ch}
        </motion.span>
      ))}
    </div>
  );
}`;
      break;

    case "heartbeat":
      body = `
export function ${effectName}Effect({ text = ${safeText} }: { text?: string }) {
  return (
    <motion.div
      animate={{
        scale: [1, 1.14, 1, 1.18, 1],
        textShadow: [
          "0 0 0 transparent",
          "0 0 18px rgba(236,72,153,0.65)",
          "0 0 0 transparent",
          "0 0 26px rgba(236,72,153,0.8)",
          "0 0 0 transparent",
        ],
      }}
      transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", times: [0, 0.14, 0.28, 0.42, 0.7] }}
      className="text-2xl font-black tracking-widest text-[#ec4899] sm:text-3xl"
    >
      {text}
    </motion.div>
  );
}`;
      break;

    case "marker":
      body = `
export function ${effectName}Effect({ text = ${safeText} }: { text?: string }) {
  return (
    <div className="relative text-2xl font-bold tracking-wider text-white sm:text-3xl">
      <motion.span
        animate={{ backgroundSize: ["0% 46%", "100% 46%", "0% 46%"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background: "linear-gradient(100deg, rgba(124,92,255,0.85), rgba(124,92,255,0.6))",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "0 62%",
          paddingBottom: "2px",
        }}
        className="inline"
      >
        {text}
      </motion.span>
    </div>
  );
}`;
      break;

    case "hologram":
      body = `
export function ${effectName}Effect({ text = ${safeText} }: { text?: string }) {
  return (
    <div className="relative text-2xl font-black tracking-widest sm:text-3xl" style={{ isolation: "isolate" }}>
      <motion.span
        animate={{ y: [2, -4, 2], skewX: [0, -3, 0], filter: ["brightness(1)", "brightness(1.35)", "brightness(1)"] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
        style={{ color: "rgba(34,211,238,0.72)", textShadow: "0 0 6px rgba(34,211,238,0.6), 0 0 22px rgba(34,211,238,0.45)" }}
        className="relative z-10 block"
      >
        {text}
      </motion.span>
      <span
        aria-hidden
        className="absolute inset-0 text-[#7c5cff] opacity-50"
        style={{ clipPath: "inset(0 0 52% 0)" }}
      >
        {text}
      </span>
    </div>
  );
}`;
      break;

    case "kinetic":
      body = `
export function ${effectName}Effect({ text = ${safeText} }: { text?: string }) {
  const chars = text.split("");
  return (
    <div className="flex justify-center text-2xl font-bold tracking-wide sm:text-3xl">
      {chars.map((ch, i) => (
        <motion.span
          key={i}
          animate={{ y: [0, -18, 14, 0], rotate: [0, -9, 7, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: [0.2, 0.8, 0.2, 1], delay: i * 0.08 }}
          style={{ color: i % 3 === 0 ? "#ec4899" : i % 3 === 1 ? "#22d3ee" : "#fff" }}
          className="inline-block"
        >
          {ch === " " ? "\\u00A0" : ch}
        </motion.span>
      ))}
    </div>
  );
}`;
      break;

    case "blackout":
      body = `
export function ${effectName}Effect({ text = ${safeText} }: { text?: string }) {
  return (
    <div className="relative text-2xl font-black tracking-widest text-white sm:text-3xl" style={{ padding: "0.28em 0.12em" }}>
      <span>{text}</span>
      <motion.div
        animate={{ scaleX: [0, 0, 1, 1, 0.38, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear", times: [0, 0.19, 0.2, 0.58, 0.64, 1] }}
        className="absolute left-0 right-0 top-0 h-[44%] origin-left bg-white"
        style={{ boxShadow: "0 0 0 1px rgba(124,92,255,0.45)" }}
      />
      <motion.div
        animate={{ scaleX: [0, 0, 1, 1, 0.38, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear", times: [0, 0.19, 0.2, 0.58, 0.64, 1], delay: 0.28 }}
        className="absolute bottom-0 left-0 right-0 h-[44%] origin-right bg-white"
        style={{ boxShadow: "0 0 0 1px rgba(124,92,255,0.45)" }}
      />
    </div>
  );
}`;
      break;

    case "magnetic":
      body = `
export function ${effectName}Effect({ text = ${safeText} }: { text?: string }) {
  const chars = text.split("");
  return (
    <div className="flex justify-center text-2xl font-bold tracking-widest sm:text-3xl">
      {chars.map((ch, i) => (
        <motion.span
          key={i}
          animate={{
            x: [0, (3 - i) * 2, (i - 3) * 3, 0],
            scale: [1, 1.12, 0.96, 1],
          }}
          transition={{ duration: 2.7, repeat: Infinity, ease: "easeInOut", delay: i * 0.07 }}
          style={{ color: i % 2 === 0 ? "#22d3ee" : "#fff" }}
          className="inline-block"
        >
          {ch === " " ? "\\u00A0" : ch}
        </motion.span>
      ))}
    </div>
  );
}`;
      break;

    case "pendulum":
      body = `
export function ${effectName}Effect({ text = ${safeText} }: { text?: string }) {
  const chars = text.split("");
  return (
    <div className="flex justify-center text-2xl font-bold tracking-widest sm:text-3xl" style={{ perspective: "400px" }}>
      {chars.map((ch, i) => (
        <motion.span
          key={i}
          animate={{ rotate: [10, -10, 10] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: i * -0.12 }}
          style={{ color: i % 2 === 0 ? "#22d3ee" : "#fff", transformOrigin: "50% -80%", display: "inline-block" }}
        >
          {ch === " " ? "\\u00A0" : ch}
        </motion.span>
      ))}
    </div>
  );
}`;
      break;

    case "smoke":
      body = `
export function ${effectName}Effect({ text = ${safeText} }: { text?: string }) {
  const chars = text.split("");
  return (
    <div className="flex justify-center text-2xl font-bold tracking-widest text-white sm:text-3xl">
      {chars.map((ch, i) => (
        <motion.span
          key={i}
          animate={{
            y: [0, 0, -22, 10, 0],
            rotate: [0, 0, 14, 0, 0],
            scale: [1, 1, 1.45, 0.8, 1],
            opacity: [1, 1, 0, 0, 1],
            filter: ["blur(0px)", "blur(0px)", "blur(7px)", "blur(4px)", "blur(0px)"],
          }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.16 }}
          style={{ color: i % 2 === 0 ? "#7c5cff" : "#22d3ee", display: "inline-block" }}
        >
          {ch === " " ? "\\u00A0" : ch}
        </motion.span>
      ))}
    </div>
  );
}`;
      break;

    case "scanner":
      body = `
export function ${effectName}Effect({ text = ${safeText} }: { text?: string }) {
  return (
    <div className="relative overflow-hidden text-2xl font-black tracking-widest sm:text-3xl">
      <motion.span
        animate={{ backgroundPosition: ["100% 0", "0% 0"] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }}
        style={{
          background: "linear-gradient(90deg, rgba(255,255,255,0.18) 0 40%, #fff 50%, rgba(255,255,255,0.18) 60% 100%)",
          backgroundSize: "300% 100%",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
        className="inline-block"
      >
        {text}
      </motion.span>
      <motion.div
        animate={{ left: ["0%", "100%"] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }}
        className="pointer-events-none absolute bottom-[-6px] top-[-6px] w-[3px] bg-[#22d3ee]"
        style={{ boxShadow: "0 0 14px #22d3ee", transform: "translateX(-100%)" }}
      />
    </div>
  );
}`;
      break;

    default:
      body = `
export function ${effectName}Effect({ text = ${safeText} }: { text?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center text-2xl font-bold tracking-tight text-white sm:text-3xl"
    >
      {text}
    </motion.div>
  );
}`;
      break;
  }

  return `// ${template.name} — TasteLoop Animation Vocabulary
"use client";

${reactImport}
${motionImport}
${body}

export default ${effectName}Effect;
`;
}

function generateComponentCode(
  type: "text-effect" | "gallery" | "entrance",
  data: {
    template?: TextEffectTemplate;
    item?: AnimItem;
    textOptions?: TextOptions;
    galleryOptions?: GalleryOptions;
    promptText: string;
  }
): string {
  if (type === "text-effect" && data.template) {
    const t = data.template;
    const textVal = data.textOptions?.text || t.defaultText;
    const effectName = t.name.replace(/[^a-zA-Z0-9]/g, "");

    return getFullTextEffectCode(t.animationTextType, effectName, textVal, t);
  }

  if (type === "gallery" && data.item) {
    const item = data.item;
    const compName = item.name.replace(/[^a-zA-Z0-9]/g, "");

    return `// ${item.name} — TasteLoop Gallery Component
// Pattern: ${item.name}

"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface GallerySlide {
  src: string;
  alt: string;
}

export function ${compName}Gallery({
  slides = [
    { src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80", alt: "Slide 1" },
    { src: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=600&q=80", alt: "Slide 2" },
    { src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80", alt: "Slide 3" },
  ],
  cardWidth = ${data.galleryOptions?.cardWidth ?? 100},
  cardHeight = ${data.galleryOptions?.cardHeight ?? 150},
  gap = ${data.galleryOptions?.gap ?? 16},
  borderRadius = ${data.galleryOptions?.borderRadius ?? 12},
}: {
  slides?: GallerySlide[];
  cardWidth?: number;
  cardHeight?: number;
  gap?: number;
  borderRadius?: number;
}) {
  return (
    <div className="relative flex items-center justify-center min-h-[400px] w-full bg-[#0d0c14] overflow-hidden p-8 rounded-2xl border border-white/10">
      <div className="flex gap-4 overflow-x-auto p-4">
        {slides.map((slide, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05 }}
            style={{ width: cardWidth, height: cardHeight, borderRadius }}
            className="shrink-0 overflow-hidden border border-white/10 shadow-2xl bg-white/5"
          >
            <img src={slide.src} alt={slide.alt} className="w-full h-full object-cover" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default ${compName}Gallery;
`;
  }

  if (data.item) {
    const item = data.item;
    const compName = item.name.replace(/[^a-zA-Z0-9]/g, "");

    return `// ${item.name} — TasteLoop Motion Component
// Category: ${item.category}

"use client";

import React from "react";
import { motion } from "framer-motion";

export function ${compName}Animation({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 text-white"
    >
      {children || <div className="p-4 text-center font-mono text-sm">${item.name} Motion Demo</div>}
    </motion.div>
  );
}

export default ${compName}Animation;
`;
  }

  return `// Component Source Code\n// ${data.promptText}`;
}

function buildCopyText(option: CopyOption, promptText: string, codeText?: string): string {
  switch (option) {
    case "code":
      return codeText || promptText;
    case "framer":
      return `// Framer component prompt\n// Paste this prompt into Framer's AI code editor\n\n${promptText}`;
    case "mcp":
    default:
      return `// MCP Tool Instruction\n// Paste the prompt into your agent.\n\n${promptText}`;
  }
}

function CopyModal({
  open,
  onClose,
  promptText,
  codeText,
}: {
  open: boolean;
  onClose: () => void;
  promptText: string;
  codeText?: string;
}) {
  const [selected, setSelected] = useState<CopyOption>("mcp");
  const [copyStatus, setCopyStatus] = useState<"idle" | "success">("idle");

  useEffect(() => {
    if (!open) {
      setCopyStatus("idle");
      setSelected("mcp");
    }
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  async function handleCopy() {
    const text = buildCopyText(selected, promptText, codeText);
    const ok = await copyText(text);
    if (ok) {
      setCopyStatus("success");
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="flex w-full max-w-md flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#12111c] shadow-2xl"
          >
            {copyStatus === "success" ? (
              /* Success View matching screenshot */
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border-2 border-emerald-400 bg-emerald-500/10 text-emerald-400">
                  <Check className="h-7 w-7 stroke-[2.5]" />
                </div>
                <h2 className="font-mono text-xl font-bold tracking-tight text-white mb-2">
                  {selected === "code" ? "Code copied" : "Prompt copied"}
                </h2>
                <p className="mb-8 font-mono text-sm leading-relaxed text-white/50 max-w-xs">
                  {selected === "code"
                    ? "The component code is on your clipboard. Paste it into your project and customize it."
                    : "The prompt instructions are on your clipboard. Paste it into your agent."}
                </p>
                <button
                  onClick={onClose}
                  className="w-full rounded-xl bg-white py-3.5 font-mono text-sm font-semibold text-[#0d0c14] transition hover:bg-white/90"
                >
                  Got it
                </button>
              </div>
            ) : (
              /* Selection View */
              <>
                <div className="flex items-start justify-between p-6 pb-4">
                  <div>
                    <h2 className="font-mono text-xl font-bold tracking-tight text-white">Get this component</h2>
                    <p className="mt-1 text-sm leading-relaxed text-white/50">
                      Choose your preferred workflow to instantly use this component in your project.
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="ml-4 shrink-0 rounded-lg p-1.5 text-white/40 transition hover:bg-white/8 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex flex-col gap-2 px-6">
                  {COPY_OPTIONS.map((opt) => {
                    const on = selected === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setSelected(opt.id)}
                        className={`group flex w-full items-center gap-4 rounded-xl border p-4 text-left transition ${
                          on
                            ? "border-white/25 bg-white/[0.06]"
                            : "border-white/8 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]"
                        }`}
                      >
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                            on ? "bg-white/15 text-white" : "bg-white/8 text-white/50"
                          }`}
                        >
                          {opt.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-mono text-sm font-semibold ${on ? "text-white" : "text-white/70"}`}>
                            {opt.label}
                            {opt.id === "mcp" && (
                              <Info className="ml-1.5 inline h-3.5 w-3.5 text-white/30" />
                            )}
                          </p>
                          <p className="mt-0.5 text-xs leading-snug text-white/40">{opt.description}</p>
                        </div>
                        <div
                          className={`h-5 w-5 shrink-0 rounded-full border-2 transition ${
                            on ? "border-white bg-white" : "border-white/30 bg-transparent"
                          }`}
                        >
                          {on && (
                            <div className="h-full w-full rounded-full scale-[0.45] bg-[#141320]" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <AnimatePresence>
                  {selected === "mcp" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.15 }}
                      className="overflow-hidden px-6 pt-3"
                    >
                      <div className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/[0.025] px-4 py-2.5 text-xs text-white/50">
                        <Info className="h-3.5 w-3.5 shrink-0 text-white/40" />
                        <span>
                          Paste the prompt into your agent.{" "}
                          <span className="underline underline-offset-2 cursor-pointer hover:text-white/70 transition">Installation docs</span>
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="p-6 pt-4">
                  <button
                    onClick={handleCopy}
                    className="flex w-full items-center justify-center rounded-xl bg-white py-3.5 font-mono text-sm font-semibold text-[#0d0c14] transition hover:bg-white/90"
                  >
                    Click to copy
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Entrance scene labels ─────────────────────────────────────────────────────

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

      <div className="relative flex items-center justify-between">
        <span className="font-mono text-xs font-semibold text-white/40 group-hover:text-white/60">
          {displayIndex}
        </span>
        <div className="flex items-center gap-2 opacity-0 transition duration-200 group-hover:opacity-100">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#7c5cff]/40 bg-[#7c5cff]/10 px-3 py-1 text-[11px] font-mono font-bold tracking-wider text-[#a78bfa]">
            <Sparkles className="h-3 w-3" />
            PROMPT
          </span>
        </div>
      </div>

      <div className="relative flex flex-1 w-full items-center justify-center overflow-hidden py-2">
        <div className="h-full w-full flex items-center justify-center">
          <AnimDemo demo={item.demo} variant={item.variant} />
        </div>
      </div>

      <div className="relative text-center">
        <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-white/35 group-hover:text-white/60">
          {item.name}
        </span>
      </div>
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
  const [copyModalOpen, setCopyModalOpen] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const reduce = useReducedMotion();
  const text = fullEntrancePrompt(item);
  const chips = item.use ?? USE_BY_CAT[item.category] ?? [];

  useEffect(() => {
    setReplayKey((k) => k + 1);
  }, [item]);

  useEffect(() => {
    if (reduce || item.category === "looping" || item.category === "gallery") return;
    const id = setInterval(() => setReplayKey((k) => k + 1), 4000);
    return () => clearInterval(id);
  }, [reduce, item.category]);

  const codeText = useMemo(() => {
    return generateComponentCode("entrance", { item, promptText: text });
  }, [item, text]);

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
      transition={reduce ? { duration: 0 } : { duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-40 flex flex-col overflow-hidden bg-[#0d0c14] lg:left-[280px]"
    >
      <CopyModal open={copyModalOpen} onClose={() => setCopyModalOpen(false)} promptText={text} codeText={codeText} />
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ delay: 0.05, duration: 0.18 }}
        className="flex items-center justify-between border-b border-white/8 px-4 sm:px-6 py-3 pt-20 lg:pt-4"
      >
        <button
          onClick={onClose}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <button
          onClick={() => setCopyModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-full border border-[#7c5cff]/30 bg-[#7c5cff]/10 px-4 py-2 text-sm font-medium text-[#a78bfa] transition hover:bg-[#7c5cff]/20"
        >
          <Copy className="h-4 w-4" />
          Copy
        </button>
      </motion.div>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">
        <div className="relative flex min-h-[340px] shrink-0 items-center justify-center border-b border-white/8 sm:min-h-[420px] lg:min-h-0 lg:flex-1 lg:border-b-0 lg:border-r">
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
            transition={{ delay: 0.15 }}
            onClick={() => setReplayKey((k) => k + 1)}
            className="absolute bottom-4 right-5 z-20 flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-white/40 transition hover:bg-white/10 hover:text-white/70"
          >
            <RotateCw className="h-3 w-3" /> replay
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 16 }}
          transition={{ delay: 0.08, ease: [0.22, 1, 0.36, 1], duration: 0.22 }}
          className="flex w-full flex-col gap-5 overflow-y-auto p-8 lg:w-[420px] lg:shrink-0"
        >
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#a78bfa]">
              {ANIM_CATEGORIES.find((c) => c.slug === "entrances")?.name}
            </span>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-white">
              {item.name}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/50">
              {item.def}
            </p>
          </div>

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

function GalleryExpandedDetail({
  item,
  onClose,
}: {
  item: AnimItem;
  onClose: () => void;
}) {
  const [copyModalOpen, setCopyModalOpen] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const defaultOpts =
    DEFAULT_GALLERY_OPTIONS[item.variant] ??
    DEFAULT_GALLERY_OPTIONS["proximity-orbit"] ??
    BASE_DEFAULT_GALLERY_OPTIONS;
  const [galleryOptions, setGalleryOptions] = useState<GalleryOptions>(defaultOpts);

  const reduce = useReducedMotion();

  useEffect(() => {
    setReplayKey((k) => k + 1);
    setGalleryOptions(
      DEFAULT_GALLERY_OPTIONS[item.variant] ??
      DEFAULT_GALLERY_OPTIONS["proximity-orbit"] ??
      BASE_DEFAULT_GALLERY_OPTIONS
    );
  }, [item]);

  const handleReset = () => {
    setGalleryOptions(
      DEFAULT_GALLERY_OPTIONS[item.variant] ??
      DEFAULT_GALLERY_OPTIONS["proximity-orbit"] ??
      BASE_DEFAULT_GALLERY_OPTIONS
    );
  };

  const promptText = useMemo(() => {
    const customDetails: string[] = [];
    if (galleryOptions.cardWidth !== defaultOpts.cardWidth) {
      customDetails.push(`Card Width: ${galleryOptions.cardWidth}px`);
    }
    if (galleryOptions.cardHeight !== defaultOpts.cardHeight) {
      customDetails.push(`Card Height: ${galleryOptions.cardHeight}px`);
    }
    if (galleryOptions.borderRadius !== defaultOpts.borderRadius) {
      customDetails.push(`Border Radius: ${galleryOptions.borderRadius}px`);
    }
    if (galleryOptions.gap !== defaultOpts.gap) {
      customDetails.push(`Gap: ${galleryOptions.gap}px`);
    }
    if (galleryOptions.tilt !== defaultOpts.tilt) {
      customDetails.push(`Tilt: ${galleryOptions.tilt}°`);
    }
    if (galleryOptions.sidewaysTilt !== defaultOpts.sidewaysTilt) {
      customDetails.push(`Sideways Tilt: ${galleryOptions.sidewaysTilt}°`);
    }
    if (galleryOptions.inactiveOpacity !== defaultOpts.inactiveOpacity) {
      customDetails.push(`Inactive Opacity: ${galleryOptions.inactiveOpacity}%`);
    }
    if (galleryOptions.autoplay !== defaultOpts.autoplay) {
      customDetails.push(`Autoplay: ${galleryOptions.autoplay ? "On" : "Off"}`);
    }
    if (galleryOptions.showTitle !== defaultOpts.showTitle) {
      customDetails.push(`Show Title: ${galleryOptions.showTitle ? "On" : "Off"}`);
    }
    if (galleryOptions.transition !== defaultOpts.transition) {
      customDetails.push(`Transition: ${galleryOptions.transition}`);
    }

    const customSuffix =
      customDetails.length > 0
        ? `\n\nCustom Styling:\n- ${customDetails.join("\n- ")}`
        : "";
    return `${item.prompt}${customSuffix}\n\nPattern: ${item.name}\nCategory: Gallery Animations`;
  }, [item, galleryOptions, defaultOpts]);

  const codeText = useMemo(() => {
    return generateComponentCode("gallery", { item, galleryOptions, promptText });
  }, [item, galleryOptions, promptText]);

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
      transition={
        reduce ? { duration: 0 } : { duration: 0.22, ease: [0.22, 1, 0.36, 1] }
      }
      className="fixed inset-0 z-40 flex flex-col overflow-hidden bg-[#0d0c14] lg:left-[280px]"
    >
      <CopyModal open={copyModalOpen} onClose={() => setCopyModalOpen(false)} promptText={promptText} codeText={codeText} />
      {/* Top Bar */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ delay: 0.05, duration: 0.18 }}
        className="flex items-center justify-between border-b border-white/8 px-4 sm:px-6 py-3 pt-20 lg:pt-4"
      >
        <button
          onClick={onClose}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <button
          onClick={() => setCopyModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-full border border-[#7c5cff]/30 bg-[#7c5cff]/10 px-4 py-2 text-sm font-medium text-[#a78bfa] transition hover:bg-[#7c5cff]/20"
        >
          <Copy className="h-4 w-4" />
          Copy
        </button>
      </motion.div>

      {/* Split Layout */}
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">
        {/* Left — Live Stage */}
        <div className="relative flex min-h-[340px] shrink-0 items-center justify-center border-b border-white/8 sm:min-h-[420px] lg:min-h-0 lg:flex-1 lg:border-b-0 lg:border-r">
          <Stage accent={ENTRANCE_COLOR} className="h-full w-full rounded-none border-none">
            <AnimatePresence mode="wait" initial={!reduce}>
              <motion.div
                key={`${item.slug}-${replayKey}`}
                initial={reduce ? false : { opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.99 }}
                transition={
                  reduce ? { duration: 0 } : { duration: 0.28, ease: [0.22, 1, 0.36, 1] }
                }
                className="flex h-full w-full items-center justify-center"
              >
                <AnimDemo demo={item.demo} variant={item.variant} options={galleryOptions} />
              </motion.div>
            </AnimatePresence>
          </Stage>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.15 }}
            onClick={() => setReplayKey((k) => k + 1)}
            className="absolute bottom-4 right-5 z-20 flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-white/40 transition hover:bg-white/10 hover:text-white/70"
          >
            <RotateCw className="h-3 w-3" /> replay
          </motion.button>
        </div>

        {/* Right — Schema-driven Gallery Options Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 16 }}
          transition={{ delay: 0.08, ease: [0.22, 1, 0.36, 1], duration: 0.22 }}
          className="flex w-full flex-col overflow-y-auto p-6 lg:w-[420px] lg:shrink-0"
        >
          <GalleryOptionsPanel
            variant={item.variant}
            options={galleryOptions}
            onChange={setGalleryOptions}
            onReset={handleReset}
            promptContent={
              <div className="flex flex-col gap-4">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#a78bfa]">
                    {item.name}
                  </span>
                  <h2 className="mt-1 text-xl font-bold tracking-tight text-white">
                    {item.name}
                  </h2>
                  <p className="mt-2 text-xs leading-relaxed text-white/50">
                    {item.def}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                    Craft note
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-white/70">{item.tip}</p>
                </div>
                <div className="h-px bg-white/8" />
                <div>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-white/30">
                    AI Prompt
                  </p>
                  <pre className="overflow-y-auto whitespace-pre-wrap rounded-xl border border-white/8 bg-black/40 p-4 font-mono text-[11px] leading-relaxed text-white/65">
                    {promptText}
                  </pre>
                </div>
              </div>
            }
          />
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
      <div className="relative flex items-center justify-between">
        <span className="font-mono text-xs font-semibold text-white/40 group-hover:text-white/60">
          {displayIndex}
        </span>
        <div className="flex items-center gap-2 opacity-0 transition duration-200 group-hover:opacity-100">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-pink-500/40 bg-pink-500/10 px-3 py-1 text-[11px] font-mono font-bold tracking-wider text-pink-400">
            <Sparkles className="h-3 w-3" />
            PROMPT
          </span>
        </div>
      </div>

      {/* Center stage */}
      <div className="relative flex flex-1 items-center justify-center py-4">
        <TextEffectRenderer template={template} text="" replayKey={0} />
      </div>

      {/* Bottom label */}
      <div className="relative text-center">
        <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-white/35 group-hover:text-white/60">
          {template.animationTextType}
        </span>
      </div>
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
  const [copyModalOpen, setCopyModalOpen] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const [textOptions, setTextOptions] = useState<TextOptions>({
    ...DEFAULT_TEXT_OPTIONS,
    text: template.defaultText,
  });
  const reduce = useReducedMotion();

  const promptText = useMemo(() => {
    const customDetails: string[] = [];
    if (textOptions.text && textOptions.text !== template.defaultText) {
      customDetails.push(`Text: "${textOptions.text}"`);
    }
    if (textOptions.fontSize !== DEFAULT_TEXT_OPTIONS.fontSize) {
      customDetails.push(`Font Size: ${textOptions.fontSize}px`);
    }
    if (textOptions.color !== DEFAULT_TEXT_OPTIONS.color) {
      customDetails.push(`Color: ${textOptions.color}`);
    }
    if (textOptions.fontWeight !== DEFAULT_TEXT_OPTIONS.fontWeight) {
      customDetails.push(`Font Weight: ${textOptions.fontWeight}`);
    }
    if (textOptions.letterSpacing !== DEFAULT_TEXT_OPTIONS.letterSpacing) {
      customDetails.push(`Letter Spacing: ${textOptions.letterSpacing}px`);
    }
    if (textOptions.lineHeight !== DEFAULT_TEXT_OPTIONS.lineHeight) {
      customDetails.push(`Line Height: ${textOptions.lineHeight}`);
    }
    if (textOptions.textAlign !== DEFAULT_TEXT_OPTIONS.textAlign) {
      customDetails.push(`Text Alignment: ${textOptions.textAlign}`);
    }

    const customSuffix = customDetails.length > 0 ? `\n\nCustom Styling:\n- ${customDetails.join("\n- ")}` : "";
    return `${template.prompt}${customSuffix}\n\nType: ${template.animationTextType}\nCategory: ${template.category}`;
  }, [template, textOptions]);

  useEffect(() => {
    setReplayKey((k) => k + 1);
    setTextOptions({
      ...DEFAULT_TEXT_OPTIONS,
      text: template.defaultText,
    });
  }, [template]);

  useEffect(() => {
    const id = setInterval(() => setReplayKey((k) => k + 1), 3500);
    return () => clearInterval(id);
  }, []);

  const handleReset = () => {
    setTextOptions({
      ...DEFAULT_TEXT_OPTIONS,
      text: template.defaultText,
    });
  };

  const codeText = useMemo(() => {
    return generateComponentCode("text-effect", { template, textOptions, promptText });
  }, [template, textOptions, promptText]);

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
      transition={reduce ? { duration: 0 } : { duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-40 flex flex-col overflow-hidden bg-[#0d0c14] lg:left-[280px]"
    >
      <CopyModal open={copyModalOpen} onClose={() => setCopyModalOpen(false)} promptText={promptText} codeText={codeText} />
      {/* ── Back button ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ delay: 0.05, duration: 0.18 }}
        className="flex items-center justify-between border-b border-white/8 px-4 sm:px-6 py-3 pt-20 lg:pt-4"
      >
        <button
          onClick={onClose}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <button
          onClick={() => setCopyModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-4 py-2 text-sm font-medium text-pink-400 transition hover:bg-pink-500/20"
        >
          <Copy className="h-4 w-4" />
          Copy
        </button>
      </motion.div>

      {/* ── Split layout ── */}
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">
        {/* Left — live stage */}
        <div className="relative flex min-h-[340px] shrink-0 items-center justify-center border-b border-white/8 sm:min-h-[420px] lg:min-h-0 lg:flex-1 lg:border-b-0 lg:border-r">
          {/* grid backdrop */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          <div className="relative w-full max-w-xl px-8 flex items-center justify-center">
            <TextEffectRenderer
              template={template}
              text={textOptions.text}
              replayKey={replayKey}
              options={textOptions}
            />
          </div>
          {/* replay */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.15 }}
            onClick={() => setReplayKey((k) => k + 1)}
            className="absolute bottom-4 right-5 flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-white/40 transition hover:bg-white/10 hover:text-white/70"
          >
            ↺ replay
          </motion.button>
        </div>

        {/* Right — Extensible text properties & prompt sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 16 }}
          transition={{ delay: 0.08, ease: [0.22, 1, 0.36, 1], duration: 0.22 }}
          className="flex w-full flex-col overflow-y-auto p-6 lg:w-[420px] lg:shrink-0"
        >
          <TextOptionsPanel
            options={textOptions}
            onChange={setTextOptions}
            onReset={handleReset}
            defaultText={template.defaultText}
            promptContent={
              <div className="flex flex-col gap-4">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-pink-400/80">
                    {template.animationTextType}
                  </span>
                  <h2 className="mt-1 text-xl font-bold tracking-tight text-white">
                    {template.name}
                  </h2>
                  <p className="mt-2 text-xs leading-relaxed text-white/50">
                    {template.description}
                  </p>
                </div>
                <div className="h-px bg-white/8" />
                <div>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-white/30">
                    AI Prompt
                  </p>
                  <pre className="overflow-y-auto whitespace-pre-wrap rounded-xl border border-white/8 bg-black/40 p-4 font-mono text-[11px] leading-relaxed text-white/65">
                    {promptText}
                  </pre>
                </div>
              </div>
            }
          />
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
