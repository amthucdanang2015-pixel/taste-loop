"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Center } from "./_kit";
import { Sparkles, MousePointer, Search, Layers, Move, RefreshCw, Zap } from "lucide-react";

const IMAGES = {
  mountain: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
  portrait: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
  desert: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80",
  fire: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
  sunset: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
};

// ─── Image Demos ───────────────────────────────────────────────────────────────

export function ImageDemo({ variant }: { variant: string }) {
  if (variant === "pixelated" || variant === "pixel-dissolve") return <PixelatedImage />;
  if (variant === "liquid" || variant === "distortion") return <LiquidDistortionImage />;
  if (variant === "reveal" || variant === "mask") return <PixelatedMaskReveal />;
  if (variant === "lens" || variant === "spotlight") return <ImageLensSpotlight />;
  if (variant === "glitch") return <GlitchImage />;
  if (variant === "tilt3d") return <TiltImageCard />;
  if (variant === "beforeafter") return <BeforeAfterImageSlider />;
  return <ZoomImageCard />;
}

/** Pixelated Grid Dissolve — reveals sharp photo on hover (Screenshot #3 & #4 style) */
function PixelatedImage() {
  const [hovered, setHovered] = useState(false);
  const [pos, setPos] = useState({ x: 0.5, y: 0.5 });
  const ref = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setPos({
      x: (e.clientX - r.left) / r.width,
      y: (e.clientY - r.top) / r.height,
    });
  }

  return (
    <Center>
      <div
        ref={ref}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseMove={handleMouseMove}
        className="group relative h-48 w-72 cursor-pointer overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
      >
        {/* Base High-Res Image */}
        <img
          src={IMAGES.mountain}
          alt="Mountain landscape"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Pixel Grid Overlay */}
        <motion.div
          animate={{ opacity: hovered ? 0 : 0.85 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 bg-[#0d0c14]"
          style={{
            backgroundImage: `radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)`,
            backgroundSize: "8px 8px",
          }}
        />

        {/* Dynamic Dissolve Spotlight Circle */}
        {hovered && (
          <div
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/40 bg-cyan-500/10 blur-sm transition-transform duration-75"
            style={{
              left: `${pos.x * 100}%`,
              top: `${pos.y * 100}%`,
              width: "120px",
              height: "120px",
              boxShadow: "0 0 40px rgba(34, 211, 238, 0.3)",
            }}
          />
        )}

        <div className="absolute bottom-3 left-3 rounded-lg bg-black/60 px-2.5 py-1 backdrop-blur-md">
          <span className="font-mono text-[10px] font-semibold text-cyan-300">
            {hovered ? "SHARP FOCUS" : "HOVER TO DISSOLVE"}
          </span>
        </div>
      </div>
    </Center>
  );
}

/** Liquid Distortion Image — fluid warp wave effect (Screenshot #2 & #5 style) */
function LiquidDistortionImage() {
  const [hovered, setHovered] = useState(false);

  return (
    <Center>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative h-48 w-72 cursor-pointer overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
      >
        <motion.div
          animate={
            hovered
              ? { scale: [1, 1.06, 1.02], rotate: [0, 1.5, -1, 0], filter: ["contrast(1)", "contrast(1.2) hue-rotate(15deg)", "contrast(1)"] }
              : { scale: 1, rotate: 0, filter: "contrast(1)" }
          }
          transition={{ duration: 1.2, repeat: hovered ? Infinity : 0, ease: "easeInOut" }}
          className="h-full w-full"
        >
          <img src={IMAGES.portrait} alt="Portrait" className="h-full w-full object-cover" />
        </motion.div>

        {/* Liquid Warp Wave Mask */}
        <motion.div
          animate={{
            clipPath: hovered
              ? ["inset(0 0 0 0 round 0px)", "inset(10% 5% 10% 5% round 30px)", "inset(0 0 0 0 round 0px)"]
              : "inset(0 0 0 0 round 0px)",
          }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 mix-blend-color-dodge opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />

        <div className="absolute top-3 left-3 rounded-lg bg-black/60 px-2.5 py-1 backdrop-blur-md">
          <span className="font-mono text-[10px] font-semibold text-purple-300">LIQUID DISTORTION</span>
        </div>
      </div>
    </Center>
  );
}

/** Pixelated Mask Reveal — pixel blocks wipe reveal (Screenshot #4 style) */
function PixelatedMaskReveal() {
  const [wiped, setWiped] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setWiped((v) => !v), 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <Center>
      <div className="relative h-48 w-72 overflow-hidden rounded-2xl border border-white/10 bg-[#0d0c14] shadow-2xl">
        {/* Background Image */}
        <img src={IMAGES.mountain} alt="Mountain" className="h-full w-full object-cover" />

        {/* Pixel Wipe Overlay Mask */}
        <motion.div
          animate={{ x: wiped ? "100%" : "0%" }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 bg-white"
          style={{
            backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
            backgroundSize: "6px 6px",
          }}
        />

        {/* Pixelated Edge Details */}
        <motion.div
          animate={{ x: wiped ? "100%" : "0%" }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-y-0 w-8 bg-cyan-400/40 blur-xs"
          style={{ left: wiped ? "calc(100% - 32px)" : "0px" }}
        />

        <div className="absolute bottom-3 left-3 rounded-lg bg-black/70 px-2.5 py-1 backdrop-blur-md">
          <span className="font-mono text-[10px] font-semibold text-emerald-300">PIXELATED MASK WIPING</span>
        </div>
      </div>
    </Center>
  );
}

/** Image Lens Spotlight (Screenshot #1 & #6 style) */
function ImageLensSpotlight() {
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setPos({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    });
  }

  return (
    <Center>
      <div
        ref={ref}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseMove={handleMouseMove}
        className="group relative h-48 w-72 cursor-crosshair overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
      >
        <img src={IMAGES.sunset} alt="Sunset Tree" className="h-full w-full object-cover brightness-75" />

        {/* Magnifier Lens Circle */}
        <div
          className="pointer-events-none absolute h-28 w-28 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-2 border-amber-400/80 shadow-2xl transition-opacity duration-200"
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            opacity: hovered ? 1 : 0,
            boxShadow: "0 0 25px rgba(251, 191, 36, 0.5)",
          }}
        >
          <img
            src={IMAGES.sunset}
            alt="Magnified"
            className="absolute max-w-none object-cover brightness-125"
            style={{
              width: "288px",
              height: "192px",
              left: `calc(-${pos.x}% * 2.88 + 56px)`,
              top: `calc(-${pos.y}% * 1.92 + 56px)`,
            }}
          />
        </div>

        <div className="absolute top-3 left-3 rounded-lg bg-black/60 px-2.5 py-1 backdrop-blur-md">
          <span className="font-mono text-[10px] font-semibold text-amber-300">HEAT LENS MAGNIFIER</span>
        </div>
      </div>
    </Center>
  );
}

/** Glitch Image Shear */
function GlitchImage() {
  const [glitching, setGlitching] = useState(false);

  return (
    <Center>
      <div
        onMouseEnter={() => setGlitching(true)}
        onMouseLeave={() => setGlitching(false)}
        className="group relative h-48 w-72 cursor-pointer overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
      >
        <img src={IMAGES.portrait} alt="Portrait" className="h-full w-full object-cover" />

        {glitching && (
          <>
            <motion.div
              animate={{ x: [-4, 4, -2, 0] }}
              transition={{ duration: 0.15, repeat: Infinity }}
              className="absolute inset-0 opacity-80 mix-blend-screen"
              style={{ clipPath: "inset(20% 0 45% 0)" }}
            >
              <img src={IMAGES.portrait} alt="Glitch 1" className="h-full w-full object-cover filter sepia-100 hue-rotate-180" />
            </motion.div>
            <motion.div
              animate={{ x: [4, -4, 2, 0] }}
              transition={{ duration: 0.2, repeat: Infinity }}
              className="absolute inset-0 opacity-80 mix-blend-screen"
              style={{ clipPath: "inset(55% 0 10% 0)" }}
            >
              <img src={IMAGES.portrait} alt="Glitch 2" className="h-full w-full object-cover filter invert-100" />
            </motion.div>
          </>
        )}

        <div className="absolute bottom-3 left-3 rounded-lg bg-black/70 px-2.5 py-1 backdrop-blur-md">
          <span className="font-mono text-[10px] font-semibold text-rose-400">CYBERPUNK GLITCH</span>
        </div>
      </div>
    </Center>
  );
}

/** 3D Tilt Image Card */
function TiltImageCard() {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) / (r.width / 2);
    const y = (e.clientY - r.top - r.height / 2) / (r.height / 2);
    setRotate({ x: -y * 12, y: x * 12 });
  }

  function handleMouseLeave() {
    setRotate({ x: 0, y: 0 });
  }

  return (
    <Center>
      <div className="perspective-1000">
        <motion.div
          ref={ref}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          animate={{ rotateX: rotate.x, rotateY: rotate.y }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative h-48 w-72 cursor-pointer overflow-hidden rounded-2xl border border-white/20 shadow-2xl"
          style={{ transformStyle: "preserve-3d" }}
        >
          <img src={IMAGES.fire} alt="Fire Abstract" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-60" />
          <div className="absolute bottom-3 left-3 rounded-lg bg-black/60 px-2.5 py-1 backdrop-blur-md">
            <span className="font-mono text-[10px] font-semibold text-amber-400">3D PERSPECTIVE TILT</span>
          </div>
        </motion.div>
      </div>
    </Center>
  );
}

/** Zoom Image Card */
function ZoomImageCard() {
  return (
    <Center>
      <div className="group relative h-48 w-72 cursor-pointer overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
        <img
          src={IMAGES.desert}
          alt="Desert"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute bottom-3 left-3 rounded-lg bg-black/60 px-2.5 py-1 backdrop-blur-md">
          <span className="font-mono text-[10px] font-semibold text-white/80">PARALLAX HOVER ZOOM</span>
        </div>
      </div>
    </Center>
  );
}

/** Before / After Split Image Slider */
function BeforeAfterImageSlider() {
  const [sliderPos, setSliderPos] = useState(50);
  const isDragging = useRef(false);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!isDragging.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - r.left, r.width));
    setSliderPos((x / r.width) * 100);
  }

  return (
    <Center>
      <div
        onMouseDown={() => (isDragging.current = true)}
        onMouseUp={() => (isDragging.current = false)}
        onMouseLeave={() => (isDragging.current = false)}
        onMouseMove={handleMove}
        className="relative h-48 w-72 cursor-ew-resize select-none overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
      >
        <img src={IMAGES.mountain} alt="After" className="absolute inset-0 h-full w-full object-cover" />
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPos}%` }}
        >
          <img src={IMAGES.sunset} alt="Before" className="h-full w-72 object-cover max-w-none" />
        </div>
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30 bg-black/80 p-1.5 backdrop-blur-md">
            <Move className="h-3 w-3 text-white" />
          </div>
        </div>
      </div>
    </Center>
  );
}

// ─── Cursor Demos ──────────────────────────────────────────────────────────────

export function CursorDemo({ variant }: { variant: string }) {
  if (variant === "kineticgrid" || variant === "kinetic") return <KineticGridCursor />;
  if (variant === "fluidtrail" || variant === "fluid") return <FluidTrailCursor />;
  if (variant === "axiscursor" || variant === "axis") return <AxisCursor />;
  if (variant === "usercursor" || variant === "user") return <UserCursorPills />;
  if (variant === "clickeffects" || variant === "click") return <ClickEffectsBurst />;
  if (variant === "magnetic") return <MagneticCursorButton />;
  return <SpotlightTrackCursor />;
}

/** Kinetic Grid Cursor (Screenshot #1 & Originkit style) */
function KineticGridCursor() {
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const containerRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!containerRef.current) return;
    const r = containerRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - r.left, y: e.clientY - r.top });
  }

  const rows = 6;
  const cols = 9;

  return (
    <Center>
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setMousePos({ x: -100, y: -100 })}
        className="relative flex h-52 w-80 cursor-none items-center justify-center rounded-2xl border border-white/10 bg-[#07060a] p-4 shadow-2xl"
      >
        <div className="grid grid-cols-9 gap-3.5">
          {Array.from({ length: rows * cols }).map((_, i) => {
            const row = Math.floor(i / cols);
            const col = i % cols;
            const dotX = col * 30 + 15;
            const dotY = row * 30 + 15;

            const dist = Math.hypot(mousePos.x - dotX, mousePos.y - dotY);
            const maxDist = 90;
            const scale = dist < maxDist ? 1 + (1 - dist / maxDist) * 1.6 : 1;
            const opacity = dist < maxDist ? 1 : 0.35;
            const color = dist < maxDist ? "#22d3ee" : "#7c5cff";

            return (
              <motion.div
                key={i}
                animate={{ scale, opacity }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: color }}
              />
            );
          })}
        </div>

        {/* Floating Custom Cursor Marker */}
        <div
          className="pointer-events-none absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400 bg-cyan-400/20 shadow-[0_0_15px_#22d3ee]"
          style={{ left: mousePos.x, top: mousePos.y }}
        />
      </div>
    </Center>
  );
}

/** Fluid Trail Cursor */
function FluidTrailCursor() {
  const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const counter = useRef(0);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!containerRef.current) return;
    const r = containerRef.current.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const id = ++counter.current;
    setTrail((prev) => [...prev.slice(-12), { x, y, id }]);
  }

  return (
    <Center>
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="relative h-52 w-80 cursor-none overflow-hidden rounded-2xl border border-white/10 bg-[#0d0c14] shadow-2xl"
      >
        <div className="absolute inset-0 flex items-center justify-center font-mono text-xs text-white/30">
          MOVE CURSOR TO DRAW TRAIL
        </div>
        {trail.map((t, idx) => {
          const ratio = (idx + 1) / trail.length;
          return (
            <motion.div
              key={t.id}
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: 0.2, opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                left: t.x,
                top: t.y,
                width: `${ratio * 32}px`,
                height: `${ratio * 32}px`,
                background: `linear-gradient(135deg, #a855f7, #22d3ee)`,
                boxShadow: `0 0 12px #22d3ee`,
              }}
            />
          );
        })}
      </div>
    </Center>
  );
}

/** Axis Crosshair Cursor */
function AxisCursor() {
  const [pos, setPos] = useState({ x: 140, y: 90 });
  const ref = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
  }

  return (
    <Center>
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        className="relative h-52 w-80 cursor-none overflow-hidden rounded-2xl border border-white/15 bg-[#0a0a0f] shadow-2xl"
      >
        {/* Horizontal Axis Line */}
        <div
          className="pointer-events-none absolute inset-x-0 h-px bg-cyan-400/40"
          style={{ top: pos.y }}
        />
        {/* Vertical Axis Line */}
        <div
          className="pointer-events-none absolute inset-y-0 w-px bg-cyan-400/40"
          style={{ left: pos.x }}
        />

        {/* Center Target Box */}
        <div
          className="pointer-events-none absolute h-6 w-6 -translate-x-1/2 -translate-y-1/2 border border-cyan-400 bg-cyan-400/10"
          style={{ left: pos.x, top: pos.y }}
        />

        <div className="absolute bottom-3 left-3 rounded bg-black/80 px-2 py-1 font-mono text-[10px] text-cyan-300">
          X: {Math.round(pos.x)}px | Y: {Math.round(pos.y)}px
        </div>
      </div>
    </Center>
  );
}

/** Multi-User Pointer Pills */
function UserCursorPills() {
  const users = [
    { name: "Nam (Lead)", color: "#7c5cff", x: 60, y: 50 },
    { name: "Designer", color: "#ec4899", x: 180, y: 110 },
    { name: "Alex", color: "#10b981", x: 230, y: 40 },
  ];

  return (
    <Center>
      <div className="relative h-52 w-80 overflow-hidden rounded-2xl border border-white/10 bg-[#0d0c14] shadow-2xl">
        {users.map((u, i) => (
          <motion.div
            key={u.name}
            animate={{
              x: [u.x, u.x + (i % 2 === 0 ? 25 : -25), u.x],
              y: [u.y, u.y + (i % 2 === 0 ? -20 : 20), u.y],
            }}
            transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut" }}
            className="absolute flex items-center gap-1.5"
          >
            <MousePointer className="h-4 w-4" style={{ color: u.color }} />
            <span
              className="rounded-full px-2 py-0.5 font-mono text-[10px] font-bold text-white shadow-md"
              style={{ backgroundColor: u.color }}
            >
              {u.name}
            </span>
          </motion.div>
        ))}
      </div>
    </Center>
  );
}

/** Click Burst Effects */
function ClickEffectsBurst() {
  const [bursts, setBursts] = useState<{ id: number; x: number; y: number }[]>([]);
  const counter = useRef(0);

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    const id = ++counter.current;
    setBursts((p) => [...p, { id, x: e.clientX - r.left, y: e.clientY - r.top }]);
  }

  return (
    <Center>
      <div
        onClick={handleClick}
        className="relative flex h-52 w-80 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#0d0c14] shadow-2xl"
      >
        <span className="font-mono text-xs text-white/40">CLICK ANYWHERE FOR BURST</span>

        {bursts.map((b) => (
          <motion.div
            key={b.id}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2.5, opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-cyan-400 bg-cyan-400/20"
            style={{ left: b.x, top: b.y, width: "40px", height: "40px" }}
          />
        ))}
      </div>
    </Center>
  );
}

/** Magnetic Button Cursor */
function MagneticCursorButton() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.4;
    const y = (e.clientY - r.top - r.height / 2) * 0.4;
    setPos({ x, y });
  }

  function handleMouseLeave() {
    setPos({ x: 0, y: 0 });
  }

  return (
    <Center>
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="flex h-52 w-80 items-center justify-center rounded-2xl border border-white/10 bg-[#0d0c14] shadow-2xl"
      >
        <motion.button
          animate={{ x: pos.x, y: pos.y }}
          transition={{ type: "spring", stiffness: 350, damping: 18 }}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#7c5cff] to-[#22d3ee] px-6 py-3 font-mono text-xs font-bold text-white shadow-lg"
        >
          <Sparkles className="h-4 w-4" /> MAGNETIC CTA
        </motion.button>
      </div>
    </Center>
  );
}

/** Spotlight Track Cursor */
function SpotlightTrackCursor() {
  const [pos, setPos] = useState({ x: 140, y: 90 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
  }

  return (
    <Center>
      <div
        onMouseMove={handleMouseMove}
        className="relative h-52 w-80 cursor-none overflow-hidden rounded-2xl border border-white/10 bg-[#07060a] shadow-2xl"
      >
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px)`,
            backgroundSize: "16px 16px",
          }}
        />
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full blur-md"
          style={{
            left: pos.x,
            top: pos.y,
            width: "160px",
            height: "160px",
            background: "radial-gradient(circle, rgba(34,211,238,0.4) 0%, rgba(124,92,255,0.15) 50%, transparent 80%)",
          }}
        />
        <div className="absolute bottom-3 left-3 font-mono text-[10px] text-white/40">
          SPOTLIGHT RADIUS
        </div>
      </div>
    </Center>
  );
}

// ─── Elements Demos ────────────────────────────────────────────────────────────

export function ElementsDemo({ variant }: { variant: string }) {
  if (variant === "dock") return <FloatingDockElement />;
  if (variant === "blackhole") return <BlackHoleGravityElement />;
  if (variant === "juice") return <JuiceButtonElement />;
  if (variant === "accordion") return <AccordionElement />;
  return <BadgeElement />;
}

function FloatingDockElement() {
  const icons = [Sparkles, Search, Layers, Move, RefreshCw, Zap];
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <Center>
      <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/5 p-3 backdrop-blur-xl shadow-2xl">
        {icons.map((Icon, idx) => {
          const isHovered = hovered === idx;
          const isNeighbor = hovered !== null && Math.abs(hovered - idx) === 1;
          const scale = isHovered ? 1.35 : isNeighbor ? 1.15 : 1;

          return (
            <motion.button
              key={idx}
              onMouseEnter={() => setHovered(idx)}
              onMouseLeave={() => setHovered(null)}
              animate={{ scale, y: isHovered ? -6 : 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#7c5cff] to-[#22d3ee] text-white shadow-md"
            >
              <Icon className="h-5 w-5" />
            </motion.button>
          );
        })}
      </div>
    </Center>
  );
}

function BlackHoleGravityElement() {
  return (
    <Center>
      <div className="relative flex h-52 w-80 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#050508] shadow-2xl">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          className="h-24 w-24 rounded-full border-2 border-dashed border-purple-500/50 p-2"
        >
          <div className="h-full w-full rounded-full bg-gradient-to-br from-purple-900 to-black shadow-[0_0_30px_#a855f7]" />
        </motion.div>
        <span className="absolute font-mono text-[10px] font-bold tracking-widest text-purple-300">GRAVITY CORE</span>
      </div>
    </Center>
  );
}

function JuiceButtonElement() {
  const [tapped, setTapped] = useState(false);

  return (
    <Center>
      <motion.button
        onClick={() => setTapped((v) => !v)}
        whileTap={{ scale: 0.85, rotate: -4 }}
        animate={{ scale: tapped ? [1, 1.15, 1] : 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 12 }}
        className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-500 px-6 py-3 font-mono text-xs font-bold text-black shadow-xl"
      >
        <Zap className="h-4 w-4 fill-current" /> JUICE ELASTIC BOUNCE
      </motion.button>
    </Center>
  );
}

function AccordionElement() {
  const [open, setOpen] = useState(true);

  return (
    <Center>
      <div className="w-72 overflow-hidden rounded-xl border border-white/10 bg-white/5 p-3">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between font-mono text-xs font-bold text-white"
        >
          <span>ACCORDION COMPONENT</span>
          <span>{open ? "−" : "+"}</span>
        </button>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-2 font-mono text-[11px] text-white/60"
            >
              Smooth spring height expansion with clean auto layout bounds.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Center>
  );
}

function BadgeElement() {
  return (
    <Center>
      <motion.div
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-4 py-1.5 font-mono text-xs font-bold text-emerald-400 shadow-lg"
      >
        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
        SPRING STATUS BADGE
      </motion.div>
    </Center>
  );
}

// ─── Background Demos ──────────────────────────────────────────────────────────

export function BackgroundDemo({ variant }: { variant: string }) {
  if (variant === "pixelcard") return <PixelCardBackground />;
  if (variant === "chromatic") return <ChromaticWaveBackground />;
  return <AuroraMeshBackground />;
}

function PixelCardBackground() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <Center>
      <div className="relative grid h-52 w-80 grid-cols-8 grid-rows-5 gap-1 overflow-hidden rounded-2xl border border-white/10 bg-[#07060a] p-2 shadow-2xl">
        {Array.from({ length: 40 }).map((_, i) => (
          <motion.div
            key={i}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
            animate={{
              backgroundColor: hoveredIdx === i ? "#22d3ee" : "rgba(255,255,255,0.04)",
              scale: hoveredIdx === i ? 1.1 : 1,
            }}
            transition={{ duration: 0.15 }}
            className="rounded-md"
          />
        ))}
      </div>
    </Center>
  );
}

function ChromaticWaveBackground() {
  return (
    <Center>
      <div className="relative h-52 w-80 overflow-hidden rounded-2xl border border-white/10 bg-[#05050a] shadow-2xl">
        <motion.div
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 opacity-60"
          style={{
            background: "linear-gradient(120deg, #7c5cff, #22d3ee, #ec4899, #7c5cff)",
            backgroundSize: "300% 300%",
            filter: "blur(30px)",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center font-mono text-xs font-bold text-white">
          CHROMATIC SHADER
        </div>
      </div>
    </Center>
  );
}

function AuroraMeshBackground() {
  return (
    <Center>
      <div className="relative h-52 w-80 overflow-hidden rounded-2xl border border-white/10 bg-[#0d0c14] shadow-2xl">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-purple-600/40 blur-2xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-cyan-500/40 blur-2xl"
        />
        <div className="absolute inset-0 flex items-center justify-center font-mono text-xs font-bold text-white">
          AURORA MESH PULSE
        </div>
      </div>
    </Center>
  );
}

// ─── Animations Demos ─────────────────────────────────────────────────────────

export function AnimationsDemo({ variant }: { variant: string }) {
  if (variant === "glitterwrap" || variant === "glitter") return <GlitterWrapDemo />;
  return <GlitterWrapDemo />;
}

function GlitterWrapDemo() {
  return (
    <Center>
      <div className="relative flex h-48 w-72 items-center justify-center overflow-hidden rounded-2xl border border-purple-500/30 bg-[#0c0b14] p-6 shadow-2xl">
        {/* Animated Glitter Sparkle Orbit */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[-50%] origin-center opacity-80"
          style={{
            background: "conic-gradient(from 0deg, transparent 0 300deg, #a855f7 330deg, #22d3ee 360deg)",
            filter: "blur(10px)",
          }}
        />
        <div className="absolute inset-0.5 flex flex-col items-center justify-center rounded-[14px] bg-[#0d0c14] p-4 text-center">
          <Sparkles className="mb-2 h-6 w-6 text-purple-400 animate-pulse" />
          <span className="font-mono text-xs font-bold text-white">GLITTER WRAP</span>
          <span className="mt-1 font-mono text-[10px] text-white/40">Sparkle border trail animation</span>
        </div>
      </div>
    </Center>
  );
}
