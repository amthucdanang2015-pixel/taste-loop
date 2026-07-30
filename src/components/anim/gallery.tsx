"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion, useMotionValue, animate, useTransform } from "framer-motion";
import { Center } from "./_kit";
import shippedManifest from "../../../assets/shipped-manifest.json";
import { assetUrl } from "@/config/assets";
import { X, Sparkles, RotateCw, Layers } from "lucide-react";
import { type GalleryOptions } from "./gallerySchema";

export interface ScreenshotItem {
  src: string;
  alt: string;
}

export interface AppGalleryItem {
  id: string;
  name: string;
  icon: string;
  screenshots: ScreenshotItem[];
}

/** Curated visual showcases highlighting key product features with high-resolution imagery */
const VOCABTUNES_APP: AppGalleryItem = {
  id: "6473722198",
  name: "VocabTunes",
  icon: assetUrl(shippedManifest.apps["6473722198"].icon),
  screenshots: [
    { src: "https://plus.unsplash.com/premium_photo-1784765158320-c46df91a7cb4?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "AI Neural Engine — Fluid 3D canvas" },
    { src: "https://plus.unsplash.com/premium_photo-1782387656252-a091b9a2371a?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Spatial Studio — Glassmorphism UI" },
    { src: "https://plus.unsplash.com/premium_photo-1782386847285-f646607be9c8?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Cybernetic Audio — Real-time matrix" },
    { src: "https://plus.unsplash.com/premium_photo-1785080652560-f334e6ea704c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Vector Motion — Quantum wave flow" },
    { src: "https://plus.unsplash.com/premium_photo-1785080652550-fc31c752f67d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Aurora Spectrum — Color dynamics" },
    { src: "https://plus.unsplash.com/premium_photo-1785080652560-f334e6ea704c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Expressive Design — Digital artwork" },
  ],
};

const BUZZED_APP: AppGalleryItem = {
  id: "6761237352",
  name: "Buzzed Party",
  icon: assetUrl(shippedManifest.apps["6761237352"].icon),
  screenshots: [
    { src: "https://images.unsplash.com/photo-1577774438656-768f1e5d9ed6?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Live Telemetry — Analytics dashboard" },
    { src: "https://plus.unsplash.com/premium_photo-1695802468726-eb6a92720904?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Atmosphere Studio — Dark audio console" },
    { src: "https://plus.unsplash.com/premium_photo-1667857647862-f9ac10eda5ad?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Hyperdrive Hub — Esports gaming setup" },
    { src: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=800&q=80", alt: "Vision Spatial UI — VR interface" },
    { src: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80", alt: "Chroma Builder — Modern UI engine" },
  ],
};

const NOTEFLY_APP: AppGalleryItem = {
  id: "6748024051",
  name: "NoteFly",
  icon: assetUrl(shippedManifest.apps["6748024051"].icon),
  screenshots: [
    { src: "https://images.unsplash.com/photo-1644371972225-4917efaa3958?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "React Spatial 3D — Code engine" },
    { src: "https://images.unsplash.com/photo-1752604247379-f7df3beb25b6?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Neon Nightscape — Midnight aesthetic" },
    { src: "https://images.unsplash.com/photo-1667644813320-0c6bf26a015d?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Prismatic Array — Energy spectrum" },
    { src: "https://plus.unsplash.com/premium_photo-1663036504811-01f157485b20?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Fluid Motion — Acrylic dynamics" },
    { src: "https://images.unsplash.com/photo-1642663034122-3a37f88cc8cf?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Luminous Studio — Neon lineart" },
    { src: "https://images.unsplash.com/photo-1690217504455-31a4377de8f2?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Spatial Architecture — Minimalist lighting" },
  ],
};

const KING_ENGLISH_APP: AppGalleryItem = {
  id: "6483942011",
  name: "King English Kids",
  icon: assetUrl(shippedManifest.apps["6483942011"].icon),
  screenshots: [
    { src: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80", alt: "Villa Architecture — Design system" },
    { src: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80", alt: "Global Data Mesh — Connected earth" },
    { src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80", alt: "Alpine Mirror — Mountain reflection" },
    { src: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80", alt: "Sahara Sunset — Dune horizon" },
    { src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80", alt: "Emerald Forest — Misty ridge" },
    { src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80", alt: "Studio Lighting — Portrait showcase" },
  ],
};

/** Hook to measure container dimensions for responsive scaling between Card view & Detail view */
function useContainerSize(ref: React.RefObject<HTMLDivElement | null>) {
  const [size, setSize] = useState({ width: 300, height: 260 });

  useEffect(() => {
    if (!ref.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
          setSize({
            width: entry.contentRect.width,
            height: entry.contentRect.height,
          });
        }
      }
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);

  return size;
}

/** Helper to scale fixed size components relative to container size */
function getResponsiveScale(size: { width: number; height: number }, isDetail: boolean) {
  if (!isDetail) {
    return Math.max(0.5, Math.min(1.2, size.width / 300));
  }
  const minDim = Math.min(size.width, size.height);
  return Math.max(0.8, Math.min(2.5, minDim / 450));
}

/** Helper to convert options into Framer Motion transition configurations */
function getMotionTransition(
  transitionType?: string,
  durationVal?: number,
  easingVal?: string
) {
  const duration = Math.max(0.05, durationVal ?? 0.8);
  const ease =
    easingVal === "linear"
      ? "linear"
      : easingVal === "ease-in-out"
        ? [0.42, 0, 0.58, 1]
        : easingVal === "spring"
          ? undefined
          : [0.22, 1, 0.36, 1];

  if (transitionType === "Spring" || easingVal === "spring") {
    return { type: "spring", stiffness: Math.max(80, 360 / duration), damping: 24 };
  }

  if (transitionType === "Linear Inertia" || easingVal === "linear") {
    return { duration, ease: "linear" };
  }

  return { duration, ease: ease ?? [0.22, 1, 0.36, 1] };
}

export function GalleryDemo({
  variant,
  options,
}: {
  variant: string;
  options?: GalleryOptions;
}) {
  const isOrbit = variant === "proximity-orbit" || variant === "orbit";
  const isMagnetic = variant === "magnetic" || variant === "magnetic-carousel";
  const isRing = variant === "ring" || variant === "ring-gallery";
  const isRound = variant === "round" || variant === "round-carousel";
  const isBox = variant === "box" || variant === "box-carousel";

  if (isOrbit) return <ProximityOrbitDemo app={VOCABTUNES_APP} options={options} />;
  if (isMagnetic) return <MagneticCarouselDemo app={BUZZED_APP} options={options} />;
  if (isRing) return <RingGalleryDemo app={NOTEFLY_APP} options={options} />;
  if (isRound) return <RoundCarouselDemo app={KING_ENGLISH_APP} options={options} />;
  if (isBox) return <BoxCarouselDemo app={NOTEFLY_APP} options={options} />;

  return <ProximityOrbitDemo app={VOCABTUNES_APP} options={options} />;
}

/* ─────────────────────────────────────────────────────────────────────────────
 * 1. PROXIMITY ORBIT
 * Circular 3D orbit displaying screenshots.
 * ────────────────────────────────────────────────────────────────────────────*/
function ProximityOrbitDemo({
  app,
  options,
}: {
  app: AppGalleryItem;
  options?: GalleryOptions;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const size = useContainerSize(containerRef);
  const isDetail = size.height > 380;

  const [mousePos, setMousePos] = useState({ x: -999, y: -999 });
  const [rotation, setRotation] = useState(0);
  const [activeShot, setActiveShot] = useState<ScreenshotItem | null>(null);
  const reduce = useReducedMotion();

  const shots = options?.slides && options.slides.length > 0 ? options.slides : app.screenshots;
  const totalShots = shots.length;

  const autoplay = options?.autoplay ?? true;
  const showTitle = options?.showTitle ?? true;
  const scale = getResponsiveScale(size, isDetail);
  const cardW = (options?.cardWidth ?? (isDetail ? 100 : 44)) * scale;
  const cardH = (options?.cardHeight ?? (isDetail ? 150 : 66)) * scale;
  const gapOffset = ((options?.gap ?? 16) - 16) * scale;
  const radius = Math.max(40 * scale, (isDetail ? 190 : 85) * scale + gapOffset * 3);
  const tilt = options?.tilt ?? 0;
  const sidewaysTilt = options?.sidewaysTilt ?? 0;
  const inactiveOpacity = (options?.inactiveOpacity ?? 80) / 100;
  const borderRadius = options?.borderRadius ?? 12;
  const duration = options?.duration ?? 1.0;
  const motionTrans = getMotionTransition(
    options?.transition,
    options?.duration,
    options?.easing
  );

  useEffect(() => {
    if (reduce || !autoplay) return;
    let animId: number;
    let last = performance.now();

    const loop = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setRotation((r) => (r + (dt * 16) / Math.max(0.1, duration)) % 360);
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [reduce, autoplay, duration]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left - rect.width / 2,
      y: e.clientY - rect.top - rect.height / 2,
    });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: -999, y: -999 });
  };

  return (
    <Center className="h-full w-full">
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden select-none p-2"
        style={{ perspective: "1000px" }}
      >
        {/* Orbital ring track */}
        <div
          className="pointer-events-none absolute rounded-full border border-purple-500/20 opacity-50 transition-all"
          style={{
            width: radius * 2.1,
            height: radius * 2.1,
            transform: `rotateX(${tilt}deg) rotateZ(${sidewaysTilt}deg)`,
          }}
        />

        {/* Orbiting nodes */}
        {shots.map((shot, idx) => {
          const angleDeg = rotation + idx * (360 / Math.max(1, totalShots));
          const angleRad = (angleDeg * Math.PI) / 180;
          const cardX = Math.cos(angleRad) * radius;
          const cardY = Math.sin(angleRad) * (radius * 0.48);

          const dist = Math.hypot(mousePos.x - cardX, mousePos.y - cardY);
          const isHovered = dist < (isDetail ? 160 : 90);
          const proxFactor = Math.max(0, 1 - dist / (isDetail ? 160 : 90));
          const scale = 1 + proxFactor * 0.35;
          const glowOpacity = 0.2 + proxFactor * 0.8;
          const zIndex = Math.round(cardY + 500);

          return (
            <motion.div
              key={`${shot.src}-${idx}`}
              onClick={(e) => {
                e.stopPropagation();
                setActiveShot(shot);
              }}
              transition={motionTrans}
              className="absolute cursor-pointer"
              style={{
                transform: `translate3d(${cardX}px, ${cardY}px, 0px) rotateX(${tilt}deg) rotateZ(${sidewaysTilt}deg) scale(${scale})`,
                zIndex,
                opacity: isHovered ? 1 : inactiveOpacity,
              }}
            >
              <div
                className="relative overflow-hidden border border-white/25 bg-slate-950 p-1 transition-all duration-150"
                style={{
                  borderRadius: `${borderRadius}px`,
                  boxShadow: `0 0 ${20 * scale}px rgba(168, 85, 247, ${glowOpacity})`,
                }}
              >
                <img
                  src={shot.src}
                  alt={shot.alt}
                  style={{
                    width: cardW,
                    height: cardH,
                    borderRadius: `${Math.max(2, borderRadius - 2)}px`,
                  }}
                  className="object-cover"
                />
                {showTitle && (
                  <div className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.5 font-mono text-[9px] font-bold text-white">
                    #{idx + 1}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}

        {/* Caption box for active screenshot */}
        <AnimatePresence>
          {showTitle && activeShot && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={motionTrans}
              className={`absolute ${isDetail ? "bottom-6 text-sm px-4 py-2" : "bottom-2 text-[10px] px-2.5 py-1"
                } z-40 flex items-center gap-2 rounded-full border border-purple-500/40 bg-purple-950/95 text-purple-100 backdrop-blur-xl shadow-2xl`}
            >
              <Sparkles className="h-4 w-4 text-purple-400 shrink-0" />
              <span className="max-w-[340px] truncate">{activeShot.alt}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveShot(null);
                }}
                className="ml-1 text-white/50 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Center>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * 2. MAGNETIC CAROUSEL
 * Displays screenshot bars with macOS dock magnification.
 * ────────────────────────────────────────────────────────────────────────────*/
function MagneticCarouselDemo({
  app,
  options,
}: {
  app: AppGalleryItem;
  options?: GalleryOptions;
}) {
  const [mouseX, setMouseX] = useState<number | null>(null);
  const [expandedShot, setExpandedShot] = useState<ScreenshotItem | null>(null);
  const [ambientTick, setAmbientTick] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const size = useContainerSize(containerRef);
  const isDetail = size.height > 380;
  const reduce = useReducedMotion();

  const shots = options?.slides && options.slides.length > 0 ? options.slides : app.screenshots;
  const autoplay = options?.autoplay ?? true;
  const showTitle = options?.showTitle ?? true;
  const gap = Math.max(
    15,
    Math.min(isDetail ? 65 : 45, size.width * 0.03)
  );
  const inactiveOpacity = (options?.inactiveOpacity ?? 70) / 100;
  const duration = options?.duration ?? 0.5;

  const motionTrans = getMotionTransition(
    options?.transition,
    options?.duration,
    options?.easing
  );

  const horizontalPadding = isDetail ? size.width * 0.1 : 48;
  const maxCardWidth = isDetail ? Math.max(140, size.width * 0.18) : 140;

  const cardWidth = Math.min(
    maxCardWidth,
    Math.max(
      60,
      (
        size.width -
        horizontalPadding -
        gap * (shots.length - 1)
      ) / shots.length
    )
  );

  // Ambient sine-wave wave effect when mouse is idle
  useEffect(() => {
    if (reduce || !autoplay) return;
    let animId: number;
    const loop = () => {
      setAmbientTick(Date.now() / (350 * Math.max(0.1, duration)));
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [reduce, autoplay, duration]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMouseX(e.clientX - rect.left);
  };

  const handleMouseLeave = () => setMouseX(null);

  return (
    <Center className="h-full w-full ">
      <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden p-2">
        <div className="flex h-full w-full items-center justify-center">
          <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ gap }}
            className={`
              flex
              items-center
              justify-center
              overflow-x-auto
              overflow-y-hidden
              h-full
              w-full
              scrollbar-none
              transition-all
            `}
          >
            {shots.map((shot, idx) => {
              let scale = 1;
              let translateY = 0;

              if (mouseX !== null) {
                const card =
                  containerRef.current?.children[idx] as HTMLElement;

                if (card) {
                  const center =
                    card.offsetLeft + card.offsetWidth / 2;

                  const dist = Math.abs(mouseX - center);

                  const sigma = 120;

                  const mag = Math.exp(
                    -(dist * dist) /
                    (2 * sigma * sigma)
                  );

                  scale = 1 + mag * (isDetail ? 0.35 : 0.25);
                  translateY = -mag * 24;
                }
              } else if (autoplay) {
                const wave =
                  Math.sin(ambientTick + idx * 0.7) * 0.5 + 0.5;

                scale = 1 + wave * 0.12;
                translateY = -wave * 8;
              }

              return (
                <motion.div
                  key={idx}
                  animate={{
                    scale,
                    y: translateY,
                  }}
                  transition={motionTrans}
                  className="group shrink-0 cursor-pointer"
                  style={{
                    opacity:
                      mouseX !== null
                        ? 1
                        : inactiveOpacity,
                  }}
                  onClick={() => setExpandedShot(shot)}
                >
                  <div
                    style={{
                      width: cardWidth,
                    }}
                    className="
                      aspect-[9/19]
                      shrink-0
                      overflow-hidden
                      rounded-2xl
                      border
                      border-white/20
                      bg-slate-900
                      shadow-xl
                  "
                  >
                    <img
                      src={shot.src}
                      alt={shot.alt}
                      className="
                h-full
                w-full
                object-cover
                object-center
              "
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent" />

                    {showTitle && (
                      <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] font-bold text-white">
                        #{idx + 1}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Full Modal View */}
        <AnimatePresence>
          {expandedShot && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={motionTrans}
              className="absolute inset-4 z-40 flex flex-col justify-between overflow-hidden rounded-2xl border border-white/20 bg-black/95 p-4 shadow-2xl backdrop-blur-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex items-center gap-2">
                  <img src={app.icon} alt={app.name} className="h-5 w-5 rounded-full" />
                  <span className="text-xs font-bold text-white">{app.name}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedShot(null);
                  }}
                  className="rounded-full border border-white/10 bg-white/10 p-1.5 text-white/70 hover:bg-white/20 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="my-2 flex flex-1 items-center justify-center overflow-hidden rounded-xl bg-white/5 p-2">
                <img
                  src={expandedShot.src}
                  alt={expandedShot.alt}
                  className="max-h-full rounded-lg object-contain"
                />
              </div>

              {showTitle && (
                <p className="line-clamp-2 text-center text-xs text-white/80">
                  {expandedShot.alt}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Center>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * 3. RING GALLERY
 * 3D Orbiting ring containing screenshots.
 * ────────────────────────────────────────────────────────────────────────────*/
function RingGalleryDemo({
  app,
  options,
}: {
  app: AppGalleryItem;
  options?: GalleryOptions;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const size = useContainerSize(containerRef);
  const isDetail = size.height > 380;

  const [rotY, setRotY] = useState(0);
  const isDragging = useRef(false);
  const lastX = useRef(0);
  const velX = useRef(0.4);
  const reduce = useReducedMotion();

  const shots = options?.slides && options.slides.length > 0 ? options.slides : app.screenshots;
  const totalShots = shots.length;
  const autoplay = options?.autoplay ?? true;
  const showTitle = options?.showTitle ?? true;
  const scale = getResponsiveScale(size, isDetail);
  const cardW = (options?.cardWidth ?? (isDetail ? 100 : 46)) * scale;
  const cardH = (options?.cardHeight ?? (isDetail ? 150 : 68)) * scale;
  const gap = (options?.gap ?? 14) * scale;
  const tilt = options?.tilt ?? 12;
  const sidewaysTilt = options?.sidewaysTilt ?? 0;
  const borderRadius = options?.borderRadius ?? 12;
  const inactiveOpacity = (options?.inactiveOpacity ?? 85) / 100;
  const duration = options?.duration ?? 0.8;

  useEffect(() => {
    if (reduce) return;
    let animId: number;

    const tick = () => {
      if (!isDragging.current) {
        velX.current *= 0.96;
        if (autoplay) {
          velX.current = 0.4 / Math.max(0.1, duration);
          setRotY((r) => (r + velX.current) % 360);
        } else if (Math.abs(velX.current) >= 0.05) {
          setRotY((r) => (r + velX.current) % 360);
        }
      }
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [reduce, autoplay, duration]);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    lastX.current = e.clientX;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastX.current;
    lastX.current = e.clientX;
    velX.current = dx * 0.8;
    setRotY((r) => r + dx * 0.6);
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  const ringRadius = isDetail
    ? Math.max(120 * scale, totalShots * (gap + 12 * scale))
    : Math.max(60 * scale, totalShots * (gap + 2 * scale));

  return (
    <Center className="h-full w-full">
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="relative flex h-full w-full cursor-grab flex-col items-center justify-center overflow-hidden select-none active:cursor-grabbing p-2"
      >
        {showTitle && (
          <p
            className={`absolute ${isDetail ? "bottom-4 text-xs" : "bottom-1 text-[9px]"
              } font-medium text-white/40 z-20`}
          >
            Drag to spin 3D ring · Flings with physics momentum
          </p>
        )}

        <div
          className="relative flex items-center justify-center"
          style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
        >
          <div
            className="relative transition-transform duration-75"
            style={{
              width: cardW,
              height: cardH,
              transformStyle: "preserve-3d",
              transform: `rotateY(${rotY}deg) rotateX(-${tilt}deg) rotateZ(${sidewaysTilt}deg)`,
            }}
          >
            {shots.map((shot, idx) => {
              const angle = idx * (360 / Math.max(1, totalShots));
              return (
                <div
                  key={`${shot.src}-${idx}`}
                  className="absolute inset-0 overflow-hidden border border-purple-500/40 bg-slate-950 p-1 shadow-2xl transition-opacity"
                  style={{
                    borderRadius: `${borderRadius}px`,
                    transform: `rotateY(${angle}deg) translateZ(${ringRadius}px)`,
                    opacity: inactiveOpacity,
                  }}
                >
                  <img
                    src={shot.src}
                    alt={shot.alt}
                    style={{ borderRadius: `${Math.max(2, borderRadius - 2)}px` }}
                    className="h-full w-full object-cover"
                  />
                  {showTitle && (
                    <div className="absolute bottom-1 right-1 rounded bg-black/85 px-1 py-0.5 font-mono text-[9px] font-bold text-white">
                      #{idx + 1}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Center>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * 4. ROUND CAROUSEL
 * 3D Cylindrical carousel of two-sided screenshot cards.
 * ────────────────────────────────────────────────────────────────────────────*/
function RoundCarouselDemo({
  app,
  options,
}: {
  app: AppGalleryItem;
  options?: GalleryOptions;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const size = useContainerSize(containerRef);
  const isDetail = size.height > 380;

  const [rotY, setRotY] = useState(0);
  const [flippedMap, setFlippedMap] = useState<Record<number, boolean>>({});
  const isDragging = useRef(false);
  const lastX = useRef(0);
  const velX = useRef(0.35);
  const reduce = useReducedMotion();

  const shots = options?.slides && options.slides.length > 0 ? options.slides : app.screenshots;
  const totalShots = shots.length;
  const autoplay = options?.autoplay ?? true;
  const showTitle = options?.showTitle ?? true;
  const scale = getResponsiveScale(size, isDetail);
  const cardW = (options?.cardWidth ?? (isDetail ? 110 : 50)) * scale;
  const cardH = (options?.cardHeight ?? (isDetail ? 165 : 75)) * scale;
  const gap = (options?.gap ?? 14) * scale;
  const tilt = options?.tilt ?? 8;
  const sidewaysTilt = options?.sidewaysTilt ?? 0;
  const borderRadius = options?.borderRadius ?? 12;
  const inactiveOpacity = (options?.inactiveOpacity ?? 90) / 100;
  const duration = options?.duration ?? 0.6;
  const motionTrans = getMotionTransition(
    options?.transition,
    options?.duration,
    options?.easing
  );

  useEffect(() => {
    if (reduce) return;
    let animId: number;

    const tick = () => {
      if (!isDragging.current) {
        velX.current *= 0.95;
        if (autoplay) {
          velX.current = 0.35 / Math.max(0.1, duration);
          setRotY((r) => (r + velX.current) % 360);
        } else if (Math.abs(velX.current) >= 0.05) {
          setRotY((r) => (r + velX.current) % 360);
        }
      }
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [reduce, autoplay, duration]);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    lastX.current = e.clientX;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastX.current;
    lastX.current = e.clientX;
    velX.current = dx * 0.7;
    setRotY((r) => r + dx * 0.5);
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  const toggleFlip = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setFlippedMap((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const cylinderRadius = isDetail
    ? Math.max(130 * scale, totalShots * (gap + 13 * scale))
    : Math.max(65 * scale, totalShots * (gap + 2 * scale));

  return (
    <Center className="h-full w-full">
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="relative flex h-full w-full cursor-grab flex-col items-center justify-center overflow-hidden select-none active:cursor-grabbing p-2"
      >
        {showTitle && (
          <p
            className={`absolute ${isDetail ? "bottom-4 text-xs" : "bottom-1 text-[9px]"
              } font-medium text-white/40 z-20`}
          >
            Click card to flip 3D · Drag cylinder to spin
          </p>
        )}

        <div
          className="relative flex items-center justify-center"
          style={{ perspective: "1100px", transformStyle: "preserve-3d" }}
        >
          <div
            className="relative transition-transform duration-75"
            style={{
              width: cardW,
              height: cardH,
              transformStyle: "preserve-3d",
              transform: `rotateY(${rotY}deg) rotateX(-${tilt}deg) rotateZ(${sidewaysTilt}deg)`,
            }}
          >
            {shots.map((shot, idx) => {
              const cylinderAngle = idx * (360 / Math.max(1, totalShots));
              const isFlipped = !!flippedMap[idx];
              const nextShot = shots[(idx + 1) % Math.max(1, totalShots)];

              return (
                <div
                  key={`${shot.src}-${idx}`}
                  className="absolute inset-0 cursor-pointer"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: `rotateY(${cylinderAngle}deg) translateZ(${cylinderRadius}px)`,
                    opacity: inactiveOpacity,
                  }}
                  onClick={(e) => toggleFlip(idx, e)}
                >
                  <motion.div
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={motionTrans}
                    className="relative h-full w-full border border-white/30 bg-slate-950 p-1 shadow-2xl"
                    style={{
                      transformStyle: "preserve-3d",
                      borderRadius: `${borderRadius}px`,
                    }}
                  >
                    {/* Front Side */}
                    <div
                      className="absolute inset-0 flex flex-col overflow-hidden bg-slate-950 p-1"
                      style={{
                        backfaceVisibility: "hidden",
                        borderRadius: `${borderRadius}px`,
                      }}
                    >
                      <img
                        src={shot.src}
                        alt={shot.alt}
                        style={{ borderRadius: `${Math.max(2, borderRadius - 3)}px` }}
                        className="h-full w-full object-cover"
                      />
                      {showTitle && (
                        <div className="absolute bottom-1 left-1 right-1 flex items-center justify-between rounded bg-black/80 px-1.5 py-0.5 backdrop-blur-md">
                          <span className="font-mono text-[8px] font-bold text-white">
                            #{idx + 1}
                          </span>
                          <RotateCw className="h-3 w-3 text-purple-400" />
                        </div>
                      )}
                    </div>

                    {/* Back Side */}
                    <div
                      className="absolute inset-0 flex flex-col justify-between overflow-hidden border border-purple-500/40 bg-purple-950 p-2 text-purple-100"
                      style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                        borderRadius: `${borderRadius}px`,
                      }}
                    >
                      <div className="flex items-center justify-between border-b border-purple-500/30 pb-1">
                        <span className="text-[10px] font-bold text-white">
                          #{((idx + 1) % totalShots) + 1}
                        </span>
                        <Layers className="h-3 w-3 text-purple-400" />
                      </div>

                      <img
                        src={nextShot.src}
                        alt={nextShot.alt}
                        className="h-[60%] rounded object-cover"
                      />

                      {showTitle && (
                        <p className="line-clamp-2 text-[8px] leading-tight text-purple-200/90">
                          {nextShot.alt}
                        </p>
                      )}
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Center>
  );
}



/* ─────────────────────────────────────────────────────────────────────────────
 * 5. BOX CAROUSEL
 * 3D rotating horizontal image carousel.
 * ────────────────────────────────────────────────────────────────────────────*/

function BoxCarouselFace({
  shot,
  idx,
  totalShots,
  anglePerFace,
  carouselRadius,
  inactiveOpacity,
  rotationY,
  cardW,
  cardH,
  borderRadius,
  showTitle,
  originalIndex,
}: any) {
  const angle = idx * anglePerFace;
  const opacity = useTransform(rotationY, (y: number) => {
    let currentFloatIndex = -y / anglePerFace;
    currentFloatIndex = ((currentFloatIndex % totalShots) + totalShots) % totalShots;

    let distance = Math.abs(idx - currentFloatIndex);
    if (distance > totalShots / 2) {
      distance = totalShots - distance;
    }

    return distance <= 1.5 ? inactiveOpacity : 0;
  });

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden bg-slate-950 transition-opacity"
      style={{
        transform: `rotateY(${angle}deg) translateZ(${carouselRadius}px)`,
        opacity,
        backfaceVisibility: "hidden",
      }}
    >
      <img
        src={shot.src}
        alt={shot.alt}
        style={{
          width: cardW,
          height: cardH,
          borderRadius: `${Math.max(0, borderRadius - 2)}px`,
        }}
        className="pointer-events-none object-cover"
      />
      {showTitle && (
        <div className="absolute bottom-2 right-2 rounded bg-black/85 px-2 py-1 font-mono text-[10px] font-bold text-white">
          #{originalIndex + 1}
        </div>
      )}
    </motion.div>
  );
}

function BoxCarouselDemo({ app, options }: { app: any; options?: any }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const size = useContainerSize(containerRef);
  const isDetail = size.height > 380;
  const shots = options?.slides && options.slides.length > 0 ? options.slides : app.screenshots;

  const reduce = useReducedMotion();
  const rotationY = useMotionValue(0);

  const duration = options?.duration ?? 2.5;
  const direction = options?.direction ?? "left";
  const dirFactor = direction === "left" ? -1 : 1;
  const inactiveOpacity = options?.inactiveOpacity ?? 1;

  const isAuto = options?.animationMode !== "Drag";
  const scale = getResponsiveScale(size, isDetail);
  const cardW = (options?.cardWidth ?? (isDetail ? 500 : 250)) * scale;
  const cardH = (options?.cardHeight ?? (isDetail ? 300 : 150)) * scale;
  const showTitle = options?.showTitle ?? true;
  const borderRadius = options?.borderRadius ?? 12;

  // 90-degree block rotation / flip effect
  const anglePerFace = 90;
  const carouselRadius = cardW / 2;

  // Duplicate shots so it's a multiple of 4 for a perfect cube loop
  let renderedShots = shots.map((s: any, i: number) => ({ ...s, originalIndex: i }));
  if (renderedShots.length > 0) {
    while (renderedShots.length < 4 || renderedShots.length % 4 !== 0) {
      renderedShots = [...renderedShots, ...shots.map((s: any, i: number) => ({ ...s, originalIndex: i }))];
    }
  }
  const totalRendered = renderedShots.length;

  useEffect(() => {
    if (reduce || !isAuto) return;

    let isCancelled = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    const flipDuration = Math.max(0.5, Math.min(0.8, duration));
    const holdDuration = 1500; // 1.5s pause

    const playNext = () => {
      timeoutId = setTimeout(async () => {
        if (isCancelled) return;

        const currentY = rotationY.get();
        // Snap to nearest face to avoid drift if transitioning from drag
        const snappedY = Math.round(currentY / anglePerFace) * anglePerFace;
        const targetY = snappedY + (anglePerFace * dirFactor);

        const controls = animate(rotationY, targetY, {
          duration: flipDuration,
          ease: "easeInOut",
        });

        await controls;
        if (!isCancelled) {
          playNext();
        }
      }, holdDuration);
    };

    playNext();

    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
    };
  }, [reduce, isAuto, duration, dirFactor, rotationY, anglePerFace]);

  const handleDragEnd = (e: any, { offset, velocity }: any) => {
    const swipe = Math.abs(offset.x) * velocity.x;
    const currentY = rotationY.get();

    if (swipe < -100) {
      animate(rotationY, Math.round(currentY / anglePerFace) * anglePerFace - anglePerFace, {
        type: "spring",
        stiffness: 200,
        damping: 20,
      });
    } else if (swipe > 100) {
      animate(rotationY, Math.round(currentY / anglePerFace) * anglePerFace + anglePerFace, {
        type: "spring",
        stiffness: 200,
        damping: 20,
      });
    } else {
      animate(rotationY, Math.round(currentY / anglePerFace) * anglePerFace, {
        type: "spring",
        stiffness: 200,
        damping: 20,
      });
    }
  };

  if (!shots || shots.length === 0) {
    return (
      <Center className="h-full w-full">
        <div className="flex h-full w-full items-center justify-center p-8 text-center text-sm text-purple-200/60">
          No images added. Add images from the panel to build the carousel.
        </div>
      </Center>
    );
  }

  return (
    <Center className={`h-full w-full ${isDetail ? "p-12" : ""}`}>
      <div ref={containerRef} className="flex h-full w-full items-center justify-center">
        <div
          className="relative flex items-center justify-center"
          style={{ perspective: "1500px", transformStyle: "preserve-3d" }}
        >
          <motion.div
            className="relative"
            style={{
              width: cardW,
              height: cardH,
              transformStyle: "preserve-3d",
              rotateY: rotationY,
            }}
            drag={isAuto ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            onPointerDown={(e) => {
              if (isAuto) e.preventDefault();
            }}
          >
            {renderedShots.map((shot: any, idx: number) => {
              return (
                <BoxCarouselFace
                  key={`${shot.src}-${idx}`}
                  shot={shot}
                  idx={idx}
                  totalShots={totalRendered}
                  anglePerFace={anglePerFace}
                  carouselRadius={carouselRadius}
                  inactiveOpacity={inactiveOpacity}
                  rotationY={rotationY}
                  cardW={cardW}
                  cardH={cardH}
                  borderRadius={borderRadius}
                  showTitle={showTitle}
                  originalIndex={shot.originalIndex}
                />
              );
            })}
          </motion.div>
        </div>
      </div>
    </Center>
  );
}
