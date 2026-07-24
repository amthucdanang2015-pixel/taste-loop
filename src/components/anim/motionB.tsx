"use client";

import { motion, AnimatePresence, useReducedMotion, Center, COLORS, EASE_OUT, SPRING } from "./_kit";
import { MetricScene, card } from "./scenes";
import { useEffect, useState } from "react";

const tile = "rounded-2xl bg-gradient-to-br shadow-xl";

/* ===== Transitions Between States ===== */
export function TransitionDemo({ variant }: { variant: string }) {
  const [step, setStep] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setStep((s) => s + 1), 1800);
    return () => clearInterval(id);
  }, [reduce]);

  if (variant === "crossfade") {
    const covers = [["#a855f7", "#22d3ee"], ["#ec4899", "#f59e0b"], ["#10b981", "#6366f1"]];
    const i = step % 3;
    return (
      <Center>
        <div className="relative h-28 w-28">
          <AnimatePresence>
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }} className="absolute inset-0 rounded-2xl shadow-xl" style={{ background: `linear-gradient(135deg, ${covers[i][0]}, ${covers[i][1]})` }} />
          </AnimatePresence>
          <span className="absolute -bottom-7 left-0 right-0 text-center text-[12px] text-white/50">now playing</span>
        </div>
      </Center>
    );
  }
  if (variant === "continuity") {
    const big = step % 2 === 0;
    return <Center><motion.div animate={{ width: big ? 220 : 120, height: big ? 130 : 84 }} transition={SPRING} className={`${tile} from-[#7c5cff] to-[#22d3ee]`} /></Center>;
  }
  if (variant === "morph") {
    const open = step % 2 === 0;
    return (
      <Center>
        <motion.div animate={{ width: open ? 250 : 130, height: open ? 84 : 38, borderRadius: open ? 22 : 999 }} transition={SPRING} className="flex items-center gap-2.5 overflow-hidden bg-black px-3 text-white ring-1 ring-white/15">
          <span className="h-6 w-6 shrink-0 rounded-md bg-gradient-to-br from-[#a855f7] to-[#22d3ee]" />
          <AnimatePresence mode="wait">
            {open ? (
              <motion.div key="o" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-w-0 flex-1">
                <p className="truncate text-[12px] font-semibold">Midnight City</p><p className="truncate text-[10px] text-white/50">M83</p>
              </motion.div>
            ) : <motion.span key="c" className="h-1.5 w-1.5 rounded-full bg-emerald-400" />}
          </AnimatePresence>
        </motion.div>
      </Center>
    );
  }
  if (variant === "shared" || variant === "layout") {
    const expanded = step % 2 === 1;
    return (
      <Center>
        <motion.div layout transition={SPRING} className={`overflow-hidden ${card}`} style={{ width: expanded ? 240 : 110, height: expanded ? 180 : 110 }}>
          <motion.div layout className="aspect-square w-full bg-gradient-to-br from-[#7c5cff] to-[#ec4899]" />
          <AnimatePresence>{expanded && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3"><p className="text-[12px] font-semibold text-white">Project Atlas</p><p className="text-[10px] text-white/45">Opened from the card</p></motion.div>}</AnimatePresence>
        </motion.div>
      </Center>
    );
  }
  if (variant === "accordion") {
    const open = step % 2 === 0;
    return (
      <Center>
        <div className={`w-[280px] overflow-hidden ${card}`}>
          <div className="flex items-center justify-between px-4 py-3 text-[13px] font-medium text-white">Is there a free plan?<span className="text-white/40">{open ? "−" : "+"}</span></div>
          <motion.div initial={false} animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }} transition={{ duration: 0.4, ease: EASE_OUT }} className="overflow-hidden">
            <p className="px-4 pb-3.5 text-[12px] leading-relaxed text-white/55">Yes — the full pattern library and tools are free forever. Pro adds premium prompts and skill packs.</p>
          </motion.div>
        </div>
      </Center>
    );
  }
  // direction-aware (onboarding steps)
  const i = step % 3;
  const titles = ["Connect your repo", "Pick a template", "Ship to prod"];
  return (
    <Center>
      <div className="relative h-28 w-64 overflow-hidden rounded-2xl">
        <AnimatePresence mode="popLayout">
          <motion.div key={i} initial={{ x: 130, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -130, opacity: 0 }} transition={{ duration: 0.45, ease: EASE_OUT }} className={`absolute inset-0 flex flex-col items-center justify-center gap-1.5 ${card}`}>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#7c5cff] to-[#22d3ee] text-[13px] font-bold text-white">{i + 1}</span>
            <span className="text-[13px] font-semibold text-white">{titles[i]}</span>
          </motion.div>
        </AnimatePresence>
      </div>
    </Center>
  );
}

/* ===== Scroll ===== */
export function ScrollDemo({ variant }: { variant: string }) {
  const [p, setP] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) { setP(1); return; }
    let raf = 0; let v = 0;
    const tick = () => { v = (v + 0.006) % 1.35; setP(Math.min(1, v)); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce]);

  if (variant === "parallax") {
    return (
      <Center>
        <div className="relative h-44 w-60 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#1a1633] to-[#0a0a0f]">
          <div className="absolute inset-x-0 rounded-full bg-[#7c5cff]/40 blur-2xl" style={{ height: 80, bottom: `${6 + p * 6}%` }} />
          <div className="absolute inset-x-8 rounded-full bg-[#22d3ee]/40 blur-lg" style={{ height: 56, bottom: `${12 + p * 20}%` }} />
          <div className="absolute left-1/2 -translate-x-1/2 text-lg font-bold text-white" style={{ bottom: `${18 + p * 42}%` }}>Ship real.</div>
        </div>
      </Center>
    );
  }
  if (variant === "driven") {
    return (
      <Center className="flex-col gap-5">
        <div className="h-1.5 w-60 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-[#7c5cff] to-[#22d3ee]" style={{ width: `${p * 100}%` }} /></div>
        <motion.div style={{ rotate: p * 360 }} className={`${tile} h-20 w-20 from-[#7c5cff] to-[#22d3ee]`} />
        <span className="text-xs tabular-nums text-white/40">scroll progress · {Math.round(p * 100)}%</span>
      </Center>
    );
  }
  if (variant === "page" || variant === "view") return <PageWipe label={variant === "view" ? "View transition" : "Page transition"} />;
  // scroll reveal — landing section
  return (
    <Center>
      <div className="relative h-48 w-64 overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c12] p-4">
        {[
          <div key="0" className="h-5 w-2/3 rounded bg-white/25" />,
          <div key="1" className="h-2.5 w-full rounded bg-white/10" />,
          <div key="2" className="h-2.5 w-4/5 rounded bg-white/10" />,
          <div key="3" className="grid grid-cols-2 gap-2 pt-1">{[0, 1].map((j) => <div key={j} className={`h-12 ${card}`} />)}</div>,
        ].map((el, i) => {
          const shown = p > 0.15 + i * 0.17;
          return <div key={i} className="mb-2.5 transition-all duration-500" style={{ opacity: shown ? 1 : 0, transform: shown ? "translateY(0)" : "translateY(18px)" }}>{el}</div>;
        })}
        <span className="absolute right-2 top-2 text-[10px] text-white/25">scroll ↓</span>
      </div>
    </Center>
  );
}
function PageWipe({ label }: { label: string }) {
  const [on, setOn] = useState(false);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setOn((v) => !v), 1700);
    return () => clearInterval(id);
  }, [reduce]);
  return (
    <Center>
      <div className="relative h-44 w-64 overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c12]">
        <AnimatePresence mode="wait">
          <motion.div key={String(on)} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.4 }} className="flex h-full flex-col items-center justify-center gap-2">
            <div className={`h-12 w-12 ${tile} ${on ? "from-[#ec4899] to-[#f59e0b]" : "from-[#7c5cff] to-[#22d3ee]"}`} />
            <span className="text-[13px] font-semibold text-white/80">{on ? "Dashboard" : "Home"}</span>
          </motion.div>
        </AnimatePresence>
        <motion.div key={`w-${on}`} initial={{ x: "-100%" }} animate={{ x: "120%" }} transition={{ duration: 0.6, ease: EASE_OUT }} className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-[#7c5cff]/50 to-transparent" />
        <span className="absolute bottom-2 left-2 text-[10px] text-white/30">{label}</span>
      </div>
    </Center>
  );
}

/* ===== Easing ===== */
const EASINGS: Record<string, { ease: number[] | string; label: string }> = {
  out: { ease: [0.22, 1, 0.36, 1], label: "ease-out" },
  in: { ease: [0.5, 0, 0.75, 0], label: "ease-in" },
  inout: { ease: [0.65, 0, 0.35, 1], label: "ease-in-out" },
  linear: { ease: "linear", label: "linear" },
  bezier: { ease: [0.34, 1.56, 0.64, 1], label: "cubic-bezier" },
  asym: { ease: [0.2, 0.9, 0.1, 1], label: "asymmetric" },
};
export function EasingDemo({ variant }: { variant: string }) {
  const rows = variant === "overview" ? ["linear", "in", "out", "inout"] : [variant];
  return (
    <Center>
      <div className="flex flex-col gap-3.5">
        {rows.map((r, i) => {
          const cfg = EASINGS[r] ?? EASINGS.out;
          return (
            <div key={r} className="flex items-center gap-3">
              <span className="w-32 text-right text-[12px] text-white/45">{cfg.label}</span>
              <div className="relative h-8 w-56 rounded-full bg-white/5">
                <motion.div animate={{ x: [2, 216] }} transition={{ duration: 1.5, ease: cfg.ease as never, repeat: Infinity, repeatType: "reverse" }} className="absolute top-1 h-6 w-6 rounded-lg shadow-lg" style={{ background: COLORS[i % COLORS.length] }} />
              </div>
            </div>
          );
        })}
      </div>
    </Center>
  );
}

/* ===== Spring ===== */
export function SpringDemo({ variant }: { variant: string }) {
  const [on, setOn] = useState(false);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setOn((v) => !v), 1500);
    return () => clearInterval(id);
  }, [reduce]);

  if (variant === "bounce") return <Center><motion.div animate={{ y: on ? 64 : -64 }} transition={{ type: "spring", stiffness: 400, damping: 10 }} className={`${tile} h-16 w-16 from-[#f59e0b] to-[#ec4899]`} /></Center>;
  if (variant === "momentum" || variant === "velocity" || variant === "interruptible") {
    return (
      <Center className="flex-col gap-3">
        <motion.div drag dragConstraints={{ left: -90, right: 90, top: -50, bottom: 50 }} dragElastic={0.4} dragMomentum={variant !== "interruptible"} whileDrag={{ scale: 1.1 }} className={`${tile} h-20 w-20 cursor-grab from-[#7c5cff] to-[#22d3ee] active:cursor-grabbing`} />
        <span className="text-xs text-white/35">{variant === "interruptible" ? "click a new target mid-flight — it redirects" : "flick it — momentum carries through"}</span>
      </Center>
    );
  }
  const pairs: Record<string, [object, object, string, string]> = {
    stiffness: [{ stiffness: 120, damping: 20 }, { stiffness: 500, damping: 20 }, "low · 120", "high · 500"],
    damping: [{ stiffness: 300, damping: 8 }, { stiffness: 300, damping: 30 }, "low · 8", "high · 30"],
    mass: [{ stiffness: 300, damping: 20, mass: 0.5 }, { stiffness: 300, damping: 20, mass: 3 }, "light · 0.5", "heavy · 3"],
  };
  if (pairs[variant]) {
    const [a, b, la, lb] = pairs[variant];
    return (
      <Center>
        <div className="flex flex-col gap-5">
          {[[a, la, 0], [b, lb, 4]].map(([cfg, label, ci], i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="w-20 text-right text-[12px] text-white/45">{label as string}</span>
              <div className="relative h-9 w-56"><motion.div animate={{ x: on ? 200 : 0 }} transition={{ type: "spring", ...(cfg as object) }} className="absolute top-1 h-7 w-7 rounded-lg shadow-lg" style={{ background: COLORS[ci as number] }} /></div>
            </div>
          ))}
        </div>
      </Center>
    );
  }
  // generic spring / perceptual — toggle on a real card
  return <Center><motion.div animate={{ x: on ? 70 : -70 }} transition={{ type: "spring", stiffness: 300, damping: 22 }}><MetricScene value="2,481" label="Live now" delta="+5.2%" /></motion.div></Center>;
}
