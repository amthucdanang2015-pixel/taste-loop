"use client";

import { motion, AnimatePresence, useReducedMotion, useReplay, Center, COLORS, EASE_OUT } from "./_kit";
import { ModalScene, CommandScene, NotifRow, MediaScene, BadgeScene, ToastScene, PricingScene, PricingFeature } from "./scenes";
import { Sparkles, Layers, RotateCw, Square } from "lucide-react";
import { useEffect, useState } from "react";

const tile = "flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7c5cff] to-[#22d3ee] shadow-xl";

/* ===== Entrances & Exits — on real product surfaces ===== */
export function EntranceDemo({ variant }: { variant: string }) {
  const k = useReplay(2600);
  const reduce = useReducedMotion();
  if (reduce) return <Center><ModalScene /></Center>;

  if (variant === "enterexit") return <EnterExit />;
  if (variant === "slide") {
    return (
      <Center>
        <motion.div key={k} initial={{ x: 90, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5, ease: EASE_OUT }}>
          <NotifRow />
        </motion.div>
      </Center>
    );
  }
  if (variant === "scale") {
    return (
      <Center>
        <motion.div key={k} initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4, ease: EASE_OUT }} style={{ transformOrigin: "top center" }}>
          <CommandScene active={1} />
        </motion.div>
      </Center>
    );
  }
  if (variant === "pop") {
    return (
      <Center>
        <motion.div key={k} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 480, damping: 13 }}>
          <BadgeScene />
        </motion.div>
      </Center>
    );
  }
  if (variant === "reveal") {
    return (
      <Center>
        <motion.div key={k} initial={{ clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0 0 0% 0)" }} transition={{ duration: 0.7, ease: EASE_OUT }}>
          <MediaScene />
        </motion.div>
      </Center>
    );
  }
  // fade → modal
  return (
    <Center>
      <motion.div key={k} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: EASE_OUT }}>
        <ModalScene />
      </motion.div>
    </Center>
  );
}
function EnterExit() {
  const [on, setOn] = useState(true);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setOn((v) => !v), 1700);
    return () => clearInterval(id);
  }, [reduce]);
  return (
    <Center>
      <div className="flex h-[120px] items-center">
        <AnimatePresence mode="wait">
          {on && (
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: EASE_OUT } }}
              exit={{ opacity: 0, y: -16, scale: 0.96, transition: { duration: 0.25 } }}
            >
              <ToastScene />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Center>
  );
}

/* ===== Sequencing & Timing ===== */
export function TimingDemo({ variant }: { variant: string }) {
  const k = useReplay(2800);

  if (variant === "stagger") {
    const feats = ["Unlimited projects", "Agent skill packs", "Premium components", "Priority support"];
    return (
      <Center>
        <PricingScene>
          <motion.div key={k} initial="h" animate="s" variants={{ s: { transition: { staggerChildren: 0.09 } } }} className="space-y-2">
            {feats.map((f) => (
              <motion.div key={f} variants={{ h: { opacity: 0, x: -14 }, s: { opacity: 1, x: 0 } }} transition={{ duration: 0.4, ease: EASE_OUT }}>
                <PricingFeature label={f} />
              </motion.div>
            ))}
          </motion.div>
        </PricingScene>
      </Center>
    );
  }
  if (variant === "orchestrate") {
    return (
      <Center>
        <motion.div key={k} initial="h" animate="s" variants={{ s: { transition: { staggerChildren: 0.16, delayChildren: 0.1 } } }} className="flex w-[300px] flex-col items-center gap-3 text-center">
          {[
            <h3 key="h" className="text-xl font-bold text-white">Ship something real.</h3>,
            <p key="p" className="text-[13px] text-white/55">Turn your prototype into a product users trust.</p>,
            <div key="c" className="flex gap-2"><span className="rounded-lg bg-white px-4 py-2 text-[12.5px] font-semibold text-ink">Get started</span><span className="rounded-lg border border-white/15 px-4 py-2 text-[12.5px] text-white/70">Docs</span></div>,
          ].map((el, i) => (
            <motion.div key={i} variants={{ h: { opacity: 0, y: 18 }, s: { opacity: 1, y: 0 } }} transition={{ duration: 0.5, ease: EASE_OUT }}>{el}</motion.div>
          ))}
        </motion.div>
      </Center>
    );
  }
  if (variant === "delay") {
    return (
      <Center>
        <div key={k} className="flex gap-3">
          {[0, 0.15, 0.3].map((d, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: d, ease: EASE_OUT }} className={tile} style={{ background: `linear-gradient(135deg, ${COLORS[i]}, ${COLORS[i + 1]})` }}>
              <span className="text-xs font-semibold text-white">{d * 1000}ms</span>
            </motion.div>
          ))}
        </div>
      </Center>
    );
  }
  if (variant === "duration") {
    return (
      <Center>
        <div key={k} className="flex flex-col gap-3.5">
          {[0.15, 0.3, 0.6].map((dur, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="w-12 text-right text-xs tabular-nums text-white/40">{dur}s</span>
              <div className="relative h-8 w-56 rounded-full bg-white/5">
                <motion.div initial={{ x: 2 }} animate={{ x: 218 }} transition={{ duration: dur, ease: EASE_OUT }} className="absolute top-1 h-6 w-6 rounded-lg shadow-lg" style={{ background: COLORS[i] }} />
              </div>
            </div>
          ))}
        </div>
      </Center>
    );
  }
  if (variant === "fill") {
    return <Center><div key={k} className="w-[260px]"><div className="mb-2 flex justify-between text-[11px] text-white/40"><span>Uploading…</span><span>100%</span></div><div className="h-2.5 w-full overflow-hidden rounded-full bg-white/8"><motion.div initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 1.1, ease: EASE_OUT }} className="h-full rounded-full bg-gradient-to-r from-[#7c5cff] to-[#22d3ee]" /></div></div></Center>;
  }
  if (variant === "stepped") return <Stepped k={k} />;
  if (variant === "keyframes") {
    return <Center><motion.div animate={{ y: [0, -44, 0], rotate: [0, 8, -8, 0] }} transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }} className={tile}><Layers className="h-7 w-7 text-white" /></motion.div></Center>;
  }
  // interpolation
  return <Center><div key={k} className="relative h-8 w-64 rounded-full bg-white/5"><motion.div initial={{ x: 2 }} animate={{ x: 232 }} transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }} className="absolute top-1 h-6 w-6 rounded-lg bg-[#22d3ee] shadow-lg" /></div></Center>;
}
function Stepped({ k }: { k: number }) {
  const [n, setN] = useState(5);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) return;
    setN(5);
    const id = setInterval(() => setN((v) => (v <= 0 ? 5 : v - 1)), 600);
    return () => clearInterval(id);
  }, [k, reduce]);
  return <Center><div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-[#ec4899] to-[#f59e0b] shadow-xl"><span className="text-5xl font-bold tabular-nums text-white">{n}</span></div></Center>;
}

/* ===== Movement & Transforms ===== */
export function TransformDemo({ variant }: { variant: string }) {
  if (variant === "tilt3d" || variant === "perspective" || variant === "originaware") return <Tilt variant={variant} />;
  const loops: Record<string, Record<string, number[] | number>> = {
    translate: { x: [-70, 70, -70], y: [-22, 22, -22] },
    scale: { scale: [1, 1.28, 1] },
    rotate: { rotate: 360 },
    skew: { skewX: [0, 16, 0, -16, 0], x: [-44, 44, -44] },
    origin: { scale: [1, 1.4, 1] },
  };
  const Icon = variant === "rotate" ? RotateCw : variant === "scale" ? Square : Layers;
  const transition = variant === "rotate" ? { duration: 3, repeat: Infinity, ease: "linear" } : { duration: 2.4, repeat: Infinity, ease: "easeInOut" };
  return (
    <Center>
      <motion.div animate={loops[variant] ?? loops.translate} transition={transition as object} style={{ transformOrigin: variant === "origin" ? "top left" : "center" }} className={tile}>
        <Icon className="h-7 w-7 text-white" />
      </motion.div>
    </Center>
  );
}
function Tilt({ variant }: { variant: string }) {
  const [t, setT] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce || variant === "originaware") return;
    let raf = 0; let v = 0;
    const tick = () => { v += 0.02; setT(v); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce, variant]);
  if (variant === "originaware") return <OriginAware />;
  const rx = Math.sin(t) * 12;
  const ry = Math.cos(t * 0.8) * 16;
  const persp = variant === "perspective" ? 380 : 1000;
  return (
    <Center>
      <div style={{ perspective: persp }}>
        <motion.div style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}><MediaScene /></motion.div>
      </div>
    </Center>
  );
}
function OriginAware() {
  const [on, setOn] = useState(false);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setOn((v) => !v), 1700);
    return () => clearInterval(id);
  }, [reduce]);
  return (
    <Center>
      <div className="relative">
        <div className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-[13px] font-semibold text-ink shadow-lg">New <Sparkles className="h-3.5 w-3.5 text-accent" /></div>
        <AnimatePresence>
          {on && (
            <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} transition={{ type: "spring", stiffness: 300, damping: 22 }} style={{ transformOrigin: "top left" }}
              className="absolute left-0 top-full mt-2 w-48 rounded-xl border border-white/12 bg-[#14141a] p-2.5 text-[12px] text-white/60 shadow-2xl">
              <div className="rounded-lg px-2 py-1.5 hover:bg-white/5">New project</div>
              <div className="rounded-lg px-2 py-1.5 hover:bg-white/5">Import</div>
              <div className="rounded-lg px-2 py-1.5 hover:bg-white/5">Templates</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Center>
  );
}
