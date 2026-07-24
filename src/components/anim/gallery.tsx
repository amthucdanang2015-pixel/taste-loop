"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Center } from "./_kit";
import shippedManifest from "../../../assets/shipped-manifest.json";
import { assetUrl } from "@/config/assets";
import { X, Sparkles, RotateCw, Layers } from "lucide-react";

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

/** 1 Dedicated App per Gallery Type derived from web/assets/shipped-manifest.json */
const VOCABTUNES_APP: AppGalleryItem = {
  id: "6473722198",
  name: "VocabTunes",
  icon: assetUrl(shippedManifest.apps["6473722198"].icon),
  screenshots: shippedManifest.apps["6473722198"].screenshots.map((s) => ({
    src: assetUrl(s.path),
    alt: s.alt,
  })),
};

const BUZZED_APP: AppGalleryItem = {
  id: "6757947194",
  name: "Buzzed Party",
  icon: assetUrl(shippedManifest.apps["6757947194"].icon),
  screenshots: shippedManifest.apps["6757947194"].screenshots.map((s) => ({
    src: assetUrl(s.path),
    alt: s.alt,
  })),
};

const NOTEFLY_APP: AppGalleryItem = {
  id: "6748024051",
  name: "NoteFly",
  icon: assetUrl(shippedManifest.apps["6748024051"].icon),
  screenshots: [
    ...shippedManifest.apps["6748024051"].screenshots,
    ...shippedManifest.apps["6748883355"].screenshots,
  ].map((s) => ({
    src: assetUrl(s.path),
    alt: s.alt,
  })),
};

const KING_ENGLISH_APP: AppGalleryItem = {
  id: "6483942011",
  name: "King English Kids",
  icon: assetUrl(shippedManifest.apps["6483942011"].icon),
  screenshots: [
    ...shippedManifest.apps["6483942011"].screenshots,
    ...shippedManifest.apps["6761237352"].screenshots,
  ].map((s) => ({
    src: assetUrl(s.path),
    alt: s.alt,
  })),
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

export function GalleryDemo({ variant }: { variant: string }) {
  const isOrbit = variant === "proximity-orbit" || variant === "orbit";
  const isMagnetic = variant === "magnetic" || variant === "magnetic-carousel";
  const isRing = variant === "ring" || variant === "ring-gallery";
  const isRound = variant === "round" || variant === "round-carousel";

  if (isOrbit) return <ProximityOrbitDemo app={VOCABTUNES_APP} />;
  if (isMagnetic) return <MagneticCarouselDemo app={BUZZED_APP} />;
  if (isRing) return <RingGalleryDemo app={NOTEFLY_APP} />;
  if (isRound) return <RoundCarouselDemo app={KING_ENGLISH_APP} />;

  return <ProximityOrbitDemo app={VOCABTUNES_APP} />;
}

/** Clean Header Badge displaying the App Name & Icon for the current demo */
function AppBadge({ app, isDetail }: { app: AppGalleryItem; isDetail: boolean }) {
  return (
    <div
      className={`absolute ${isDetail ? "top-4" : "top-2"
        } z-20 flex items-center gap-1.5 rounded-full border border-white/15 bg-black/75 px-3 py-1 backdrop-blur-md shadow-xl select-none`}
    >
      <img src={app.icon} alt={app.name} className={`${isDetail ? "h-4 w-4" : "h-3.5 w-3.5"} rounded-full`} />
      <span className={`${isDetail ? "text-xs" : "text-[10px]"} font-semibold text-white`}>{app.name}</span>
      <span className="rounded-full bg-purple-500/30 px-1.5 py-0.2 text-[8px] font-bold text-purple-200">
        {app.screenshots.length} Screens
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * 1. PROXIMITY ORBIT (Dedicated App: VocabTunes - 7 Screenshots)
 * Circular 3D orbit displaying ALL 7 screenshots of VocabTunes.
 * Dynamically scales up in Detail View (height > 380px) to fill stage.
 * ────────────────────────────────────────────────────────────────────────────*/
function ProximityOrbitDemo({ app }: { app: AppGalleryItem }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const size = useContainerSize(containerRef);
  const isDetail = size.height > 380;

  const [mousePos, setMousePos] = useState({ x: -999, y: -999 });
  const [rotation, setRotation] = useState(0);
  const [activeShot, setActiveShot] = useState<ScreenshotItem | null>(null);
  const reduce = useReducedMotion();

  const shots = app.screenshots;
  const totalShots = shots.length;

  useEffect(() => {
    if (reduce) return;
    let animId: number;
    let last = performance.now();

    const loop = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setRotation((r) => (r + dt * 16) % 360);
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [reduce]);

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

  const radius = isDetail ? 190 : 85;
  const cardW = isDetail ? 100 : 44;
  const cardH = isDetail ? 150 : 66;

  return (
    <Center className="h-full w-full">
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden select-none p-2"
      >
        <AppBadge app={app} isDetail={isDetail} />

        {/* Orbital ring track */}
        <div
          className="pointer-events-none absolute rounded-full border border-purple-500/20 opacity-50"
          style={{ width: radius * 2.1, height: radius * 2.1 }}
        />

        {/* Center hub with app icon */}
        <div
          className={`absolute flex flex-col items-center justify-center gap-1 rounded-full border border-purple-500/40 bg-purple-950/60 ${isDetail ? "p-4 shadow-[0_0_40px_rgba(168,85,247,0.5)]" : "p-2 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
            } backdrop-blur-md z-10`}
        >
          <img src={app.icon} alt={app.name} className={`${isDetail ? "h-10 w-10" : "h-5 w-5"} rounded-full`} />
          <span className={`${isDetail ? "text-xs font-bold" : "text-[8px] font-bold"} text-purple-200`}>
            {totalShots} Imgs
          </span>
        </div>

        {/* Orbiting nodes for ALL screenshots in VocabTunes */}
        {shots.map((shot, idx) => {
          const angleDeg = rotation + idx * (360 / totalShots);
          const angleRad = (angleDeg * Math.PI) / 180;
          const cardX = Math.cos(angleRad) * radius;
          const cardY = Math.sin(angleRad) * (radius * 0.48);

          const dist = Math.hypot(mousePos.x - cardX, mousePos.y - cardY);
          const proxFactor = Math.max(0, 1 - dist / (isDetail ? 160 : 90));
          const scale = 1 + proxFactor * 0.35;
          const glowOpacity = 0.2 + proxFactor * 0.8;
          const zIndex = Math.round(cardY + 500);

          return (
            <motion.div
              key={`${app.id}-${idx}`}
              onClick={(e) => {
                e.stopPropagation();
                setActiveShot(shot);
              }}
              className="absolute cursor-pointer"
              style={{
                transform: `translate3d(${cardX}px, ${cardY}px, 0px) scale(${scale})`,
                zIndex,
              }}
            >
              <div
                className="relative overflow-hidden rounded-xl border border-white/25 bg-slate-950 p-1 transition-all duration-150"
                style={{
                  boxShadow: `0 0 ${20 * scale}px rgba(168, 85, 247, ${glowOpacity})`,
                }}
              >
                <img
                  src={shot.src}
                  alt={shot.alt}
                  style={{ width: cardW, height: cardH }}
                  className="rounded-lg object-cover"
                />
                <div className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.5 font-mono text-[9px] font-bold text-white">
                  #{idx + 1}
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Caption box for active screenshot */}
        <AnimatePresence>
          {activeShot && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
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
 * 2. MAGNETIC CAROUSEL (Dedicated App: Buzzed Party - 8 Screenshots)
 * Displays ALL 8 screenshot bars of Buzzed Party Game (macOS dock magnification).
 * Continuous ambient sine-wave animation when idle.
 * ────────────────────────────────────────────────────────────────────────────*/
function MagneticCarouselDemo({ app }: { app: AppGalleryItem }) {
  const [mouseX, setMouseX] = useState<number | null>(null);
  const [expandedShot, setExpandedShot] = useState<ScreenshotItem | null>(null);
  const [ambientTick, setAmbientTick] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const size = useContainerSize(containerRef);
  const isDetail = size.height > 380;
  const reduce = useReducedMotion();

  const shots = app.screenshots;

  // Continuous ambient sine-wave animation when mouse is idle
  useEffect(() => {
    if (reduce) return;
    let animId: number;
    const loop = () => {
      setAmbientTick(Date.now() / 350);
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [reduce]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMouseX(e.clientX - rect.left);
  };

  const handleMouseLeave = () => setMouseX(null);

  const cardW = isDetail ? 80 : 36;
  const cardH = isDetail ? 180 : 88;
  const gap = isDetail ? 10 : 4;

  return (
    <Center className="h-full w-full">
      <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden p-2">
        <AppBadge app={app} isDetail={isDetail} />

        {/* Dock track with all screenshots */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={`${isDetail ? "mt-12 p-4 border-white/20 bg-white/[0.04]" : "mt-4 p-2 border-white/10 bg-white/[0.03]"
            } flex max-w-full items-end justify-center gap-1.5 overflow-x-auto rounded-2xl border backdrop-blur-xl scrollbar-none shadow-2xl`}
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
            } else {
              // Ambient sine-wave wave effect when mouse is not hovering
              const wave = Math.sin(ambientTick + idx * 0.7) * 0.5 + 0.5;
              scale = 1 + wave * 0.15;
              translateY = -wave * (isDetail ? 12 : 6);
            }

            return (
              <motion.div
                key={`${app.id}-${idx}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedShot(shot);
                }}
                animate={{ scale, y: translateY }}
                transition={{ type: "spring", stiffness: 360, damping: 26 }}
                className="group relative cursor-pointer shrink-0"
              >
                <div
                  style={{ width: cardW, height: cardH }}
                  className="relative overflow-hidden rounded-xl border border-white/25 bg-slate-950 shadow-xl transition duration-200 group-hover:border-purple-400"
                >
                  <img src={shot.src} alt={shot.alt} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70" />
                  <div className="absolute bottom-1.5 left-0 right-0 text-center font-mono text-[9px] font-bold text-white">
                    #{idx + 1}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Full Modal View for clicked screenshot */}
        <AnimatePresence>
          {expandedShot && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
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

              <p className="line-clamp-2 text-center text-xs text-white/80">
                {expandedShot.alt}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Center>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * 3. RING GALLERY (Dedicated App: NoteFly - 5 Screenshots)
 * 3D Orbiting ring containing ALL 5 screenshots of NoteFly.
 * Continuous spin & drag momentum.
 * ────────────────────────────────────────────────────────────────────────────*/
function RingGalleryDemo({ app }: { app: AppGalleryItem }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const size = useContainerSize(containerRef);
  const isDetail = size.height > 380;

  const [rotY, setRotY] = useState(0);
  const isDragging = useRef(false);
  const lastX = useRef(0);
  const velX = useRef(0.4);
  const reduce = useReducedMotion();

  const shots = app.screenshots;
  const totalShots = shots.length;

  useEffect(() => {
    if (reduce) return;
    let animId: number;

    const tick = () => {
      if (!isDragging.current) {
        velX.current *= 0.96;
        if (Math.abs(velX.current) < 0.3) {
          velX.current = 0.3;
        }
        setRotY((r) => (r + velX.current) % 360);
      }
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [reduce]);

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

  const cardW = isDetail ? 100 : 46;
  const cardH = isDetail ? 150 : 68;
  const ringRadius = isDetail ? Math.max(180, totalShots * 26) : Math.max(90, totalShots * 14);

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
        <AppBadge app={app} isDetail={isDetail} />

        <p className={`absolute ${isDetail ? "bottom-4 text-xs" : "bottom-1 text-[9px]"} font-medium text-white/40 z-20`}>
          Drag to spin 3D ring · Flings with physics momentum
        </p>

        {/* 3D Stage with tilt angle so cards never flatten into lines */}
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
              transform: `rotateY(${rotY}deg) rotateX(-12deg)`,
            }}
          >
            {shots.map((shot, idx) => {
              const angle = idx * (360 / totalShots);
              return (
                <div
                  key={`${app.id}-${idx}`}
                  className="absolute inset-0 overflow-hidden rounded-xl border border-purple-500/40 bg-slate-950 p-1 shadow-2xl"
                  style={{
                    transform: `rotateY(${angle}deg) translateZ(${ringRadius}px)`,
                  }}
                >
                  <img
                    src={shot.src}
                    alt={shot.alt}
                    className="h-full w-full rounded-lg object-cover"
                  />
                  <div className="absolute bottom-1 right-1 rounded bg-black/85 px-1 py-0.5 font-mono text-[9px] font-bold text-white">
                    #{idx + 1}
                  </div>
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
 * 4. ROUND CAROUSEL (Dedicated App: King English Kids - 3 Screenshots)
 * 3D Cylindrical carousel of two-sided screenshot cards.
 * Auto-spins, draggable with momentum, click card to flip 180° in 3D.
 * ────────────────────────────────────────────────────────────────────────────*/
function RoundCarouselDemo({ app }: { app: AppGalleryItem }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const size = useContainerSize(containerRef);
  const isDetail = size.height > 380;

  const [rotY, setRotY] = useState(0);
  const [flippedMap, setFlippedMap] = useState<Record<number, boolean>>({});
  const isDragging = useRef(false);
  const lastX = useRef(0);
  const velX = useRef(0.35);
  const reduce = useReducedMotion();

  const shots = app.screenshots;
  const totalShots = shots.length;

  useEffect(() => {
    if (reduce) return;
    let animId: number;

    const tick = () => {
      if (!isDragging.current) {
        velX.current *= 0.95;
        if (Math.abs(velX.current) < 0.25) velX.current = 0.25;
        setRotY((r) => (r + velX.current) % 360);
      }
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [reduce]);

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

  const cardW = isDetail ? 110 : 50;
  const cardH = isDetail ? 165 : 75;
  const cylinderRadius = isDetail ? Math.max(190, totalShots * 27) : Math.max(95, totalShots * 14);

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
        <AppBadge app={app} isDetail={isDetail} />

        <p className={`absolute ${isDetail ? "bottom-4 text-xs" : "bottom-1 text-[9px]"} font-medium text-white/40 z-20`}>
          Click card to flip 3D · Drag cylinder to spin
        </p>

        {/* 3D Cylindrical Container with perspective */}
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
              transform: `rotateY(${rotY}deg) rotateX(-8deg)`,
            }}
          >
            {shots.map((shot, idx) => {
              const cylinderAngle = idx * (360 / totalShots);
              const isFlipped = !!flippedMap[idx];
              const nextShot = shots[(idx + 1) % totalShots];

              return (
                <div
                  key={`${app.id}-${idx}`}
                  className="absolute inset-0 cursor-pointer"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: `rotateY(${cylinderAngle}deg) translateZ(${cylinderRadius}px)`,
                  }}
                  onClick={(e) => toggleFlip(idx, e)}
                >
                  <motion.div
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="relative h-full w-full rounded-xl border border-white/30 bg-slate-950 p-1 shadow-2xl"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {/* Front Side */}
                    <div
                      className="absolute inset-0 flex flex-col overflow-hidden rounded-lg bg-slate-950 p-1"
                      style={{ backfaceVisibility: "hidden" }}
                    >
                      <img
                        src={shot.src}
                        alt={shot.alt}
                        className="h-full w-full rounded-md object-cover"
                      />
                      <div className="absolute bottom-1 left-1 right-1 flex items-center justify-between rounded bg-black/80 px-1.5 py-0.5 backdrop-blur-md">
                        <span className="font-mono text-[8px] font-bold text-white">
                          #{idx + 1}
                        </span>
                        <RotateCw className="h-3 w-3 text-purple-400" />
                      </div>
                    </div>

                    {/* Back Side */}
                    <div
                      className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-lg border border-purple-500/40 bg-purple-950 p-2 text-purple-100"
                      style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
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

                      <p className="line-clamp-2 text-[8px] leading-tight text-purple-200/90">
                        {nextShot.alt}
                      </p>
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
