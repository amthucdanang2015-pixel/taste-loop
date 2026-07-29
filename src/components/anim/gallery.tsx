"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
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
    { src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80", alt: "AI Neural Engine — Fluid 3D canvas" },
    { src: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80", alt: "Spatial Studio — Glassmorphism UI" },
    { src: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80", alt: "Cybernetic Audio — Real-time matrix" },
    { src: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80", alt: "Vector Motion — Quantum wave flow" },
    { src: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&w=800&q=80", alt: "Aurora Spectrum — Color dynamics" },
    { src: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80", alt: "Expressive Design — Digital artwork" },
  ],
};

const BUZZED_APP: AppGalleryItem = {
  id: "6761237352",
  name: "Buzzed Party",
  icon: assetUrl(shippedManifest.apps["6761237352"].icon),
  screenshots: [
    { src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80", alt: "Live Telemetry — Analytics dashboard" },
    { src: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80", alt: "Atmosphere Studio — Dark audio console" },
    { src: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80", alt: "Hyperdrive Hub — Esports gaming setup" },
    { src: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=800&q=80", alt: "Vision Spatial UI — VR interface" },
    { src: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80", alt: "Chroma Builder — Modern UI engine" },
    { src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80", alt: "Command Desk — Real-time market UI" },
  ],
};

const NOTEFLY_APP: AppGalleryItem = {
  id: "6748024051",
  name: "NoteFly",
  icon: assetUrl(shippedManifest.apps["6748024051"].icon),
  screenshots: [
    { src: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80", alt: "React Spatial 3D — Code engine" },
    { src: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=80", alt: "Neon Nightscape — Midnight aesthetic" },
    { src: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80", alt: "Prismatic Array — Energy spectrum" },
    { src: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80", alt: "Fluid Motion — Acrylic dynamics" },
    { src: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80", alt: "Luminous Studio — Neon lineart" },
    { src: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80", alt: "Spatial Architecture — Minimalist lighting" },
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

  if (isOrbit) return <ProximityOrbitDemo app={VOCABTUNES_APP} options={options} />;
  if (isMagnetic) return <MagneticCarouselDemo app={BUZZED_APP} options={options} />;
  if (isRing) return <RingGalleryDemo app={NOTEFLY_APP} options={options} />;
  if (isRound) return <RoundCarouselDemo app={KING_ENGLISH_APP} options={options} />;

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
  const cardW = options?.cardWidth ?? (isDetail ? 100 : 44);
  const cardH = options?.cardHeight ?? (isDetail ? 150 : 66);
  const gapOffset = (options?.gap ?? 16) - 16;
  const radius = Math.max(40, (isDetail ? 190 : 85) + gapOffset * 3);
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
  const cardW = options?.cardWidth ?? (isDetail ? 80 : 36);
  const cardH = options?.cardHeight ?? (isDetail ? 180 : 88);
  const gap = options?.gap ?? (isDetail ? 10 : 4);
  const borderRadius = options?.borderRadius ?? 12;
  const inactiveOpacity = (options?.inactiveOpacity ?? 70) / 100;
  const duration = options?.duration ?? 0.5;
  const motionTrans = getMotionTransition(
    options?.transition,
    options?.duration,
    options?.easing
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
    <Center className="h-full w-full">
      <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden p-2">
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ gap: `${gap}px` }}
          className={`${isDetail
            ? "mt-12 p-4 border-white/20 bg-white/[0.04]"
            : "mt-4 p-2 border-white/10 bg-white/[0.03]"
            } flex max-w-full items-end justify-center overflow-x-auto rounded-2xl border backdrop-blur-xl scrollbar-none shadow-2xl transition-all`}
        >
          {shots.map((shot, idx) => {
            let scale = 1;
            let translateY = 0;

            if (mouseX !== null && containerRef.current) {
              const cardCenterX = 16 + idx * (cardW + gap) + cardW / 2;
              const dist = Math.abs(mouseX - cardCenterX);
              const sigma = isDetail ? 90 : 45;
              const mag = Math.exp(-Math.pow(dist, 2) / (2 * Math.pow(sigma, 2)));
              scale = 1 + mag * (isDetail ? 0.45 : 0.38);
              translateY = -mag * (isDetail ? 28 : 14);
            } else if (autoplay) {
              const wave = Math.sin(ambientTick + idx * 0.7) * 0.5 + 0.5;
              scale = 1 + wave * 0.15;
              translateY = -wave * (isDetail ? 12 : 6);
            }

            return (
              <motion.div
                key={`${shot.src}-${idx}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedShot(shot);
                }}
                animate={{ scale, y: translateY }}
                transition={motionTrans}
                className="group relative cursor-pointer shrink-0"
                style={{ opacity: mouseX !== null ? 1 : inactiveOpacity }}
              >
                <div
                  style={{
                    width: cardW,
                    height: cardH,
                    borderRadius: `${borderRadius}px`,
                  }}
                  className="relative overflow-hidden border border-white/25 bg-slate-950 shadow-xl transition duration-200 group-hover:border-purple-400"
                >
                  <img src={shot.src} alt={shot.alt} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70" />
                  {showTitle && (
                    <div className="absolute bottom-1.5 left-0 right-0 text-center font-mono text-[9px] font-bold text-white">
                      #{idx + 1}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
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
  const cardW = options?.cardWidth ?? (isDetail ? 100 : 46);
  const cardH = options?.cardHeight ?? (isDetail ? 150 : 68);
  const gap = options?.gap ?? 14;
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
    ? Math.max(120, totalShots * (gap + 12))
    : Math.max(60, totalShots * (gap + 2));

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
  const cardW = options?.cardWidth ?? (isDetail ? 110 : 50);
  const cardH = options?.cardHeight ?? (isDetail ? 165 : 75);
  const gap = options?.gap ?? 14;
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
    ? Math.max(130, totalShots * (gap + 13))
    : Math.max(65, totalShots * (gap + 2));

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
