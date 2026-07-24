"use client";

import { motion, AnimatePresence, useReducedMotion, useReplay, Center, COLORS, EASE_OUT } from "./_kit";
import { ChatScene, MetricScene, KanbanScene, NotifRow, ToastScene, MediaScene, CtaButton, Avatar, card } from "./scenes";
import { useEffect, useState } from "react";

const tile = "flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br shadow-xl";

/* ===== Looping & Ambient ===== */
export function LoopDemo({ variant }: { variant: string }) {
  if (variant === "marquee") {
    const items = ["Vercel", "Linear", "Stripe", "Notion", "Figma", "Raycast"];
    return (
      <Center>
        <div className="w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 9, repeat: Infinity, ease: "linear" }} className="flex w-max gap-3">
            {[...items, ...items].map((w, i) => <span key={i} className={`whitespace-nowrap px-5 py-2.5 text-sm font-semibold text-white/70 ${card}`}>{w}</span>)}
          </motion.div>
        </div>
      </Center>
    );
  }
  if (variant === "orbit") {
    return (
      <Center>
        <div className="relative h-44 w-44">
          <div className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7c5cff] to-[#22d3ee] text-white shadow-xl">AI</div>
          {[0, 1, 2].map((i) => (
            <motion.div key={i} className="absolute inset-0" animate={{ rotate: 360 }} transition={{ duration: 3.5 + i, repeat: Infinity, ease: "linear" }}>
              <div className="absolute left-1/2 top-0 h-5 w-5 -translate-x-1/2 rounded-full shadow-lg" style={{ background: COLORS[i] }} />
            </motion.div>
          ))}
        </div>
      </Center>
    );
  }
  if (variant === "float") return <Center><motion.div animate={{ y: [-12, 12, -12] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}><MediaScene /></motion.div></Center>;
  if (variant === "pulse" || variant === "idle") {
    return (
      <Center>
        <div className={`flex w-[250px] items-center gap-3 p-3.5 ${card}`}>
          <span className="relative flex h-3 w-3">
            <motion.span animate={{ scale: [1, 2.2, 1], opacity: [0.6, 0, 0.6] }} transition={{ duration: 1.8, repeat: Infinity }} className="absolute inline-flex h-full w-full rounded-full bg-emerald-400" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-400" />
          </span>
          <div><p className="text-[13px] font-semibold text-white">{variant === "idle" ? "Listening…" : "Live · 2,481 online"}</p><p className="text-[11px] text-white/40">{variant === "idle" ? "waiting for input" : "real-time"}</p></div>
        </div>
      </Center>
    );
  }
  // loop / alternate
  return (
    <Center>
      <motion.div animate={{ rotate: variant === "alternate" ? [0, 90, 0] : 360 }} transition={{ duration: 2, repeat: Infinity, ease: variant === "alternate" ? "easeInOut" : "linear", repeatType: variant === "alternate" ? "reverse" : "loop" }} className={`${tile} from-[#7c5cff] to-[#ec4899]`}>
        <span className="text-xs font-bold text-white">{variant === "alternate" ? "yoyo" : "loop"}</span>
      </motion.div>
    </Center>
  );
}

/* ===== Polish & Effects ===== */
export function PolishDemo({ variant }: { variant: string }) {
  const k = useReplay(2900);
  if (variant === "typewriter") return <Typewriter />;
  if (variant === "ticker" || variant === "tabular") return <Ticker tabular={variant === "tabular"} />;
  if (variant === "textmorph") return <TextMorph />;
  if (variant === "line") return <LineDraw k={k} />;
  if (variant === "shimmer") return <Shimmer />;
  if (variant === "beforeafter") return <BeforeAfter />;
  if (variant === "blur") return <Center><motion.div key={k} initial={{ filter: "blur(14px)", opacity: 0, scale: 1.05 }} animate={{ filter: "blur(0px)", opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: EASE_OUT }}><MediaScene /></motion.div></Center>;
  if (variant === "mask") return <Center><div key={k} className="relative overflow-hidden"><motion.div initial={{ x: "-110%" }} animate={{ x: "110%" }} transition={{ duration: 1.6, repeat: Infinity }} className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/40 to-transparent" /><span className="bg-gradient-to-r from-[#7c5cff] to-[#22d3ee] bg-clip-text text-5xl font-bold tracking-tight text-transparent">Ship real.</span></div></Center>;
  return <Center><motion.div key={k} initial={{ clipPath: "inset(45% round 18px)" }} animate={{ clipPath: "inset(0% round 18px)" }} transition={{ duration: 0.8, ease: EASE_OUT }}><MediaScene /></motion.div></Center>;
}
function Typewriter() {
  const phrases = ["Here's how I'd rebuild your onboarding…", "Your activation drops at step 2.", "Want me to draft the fix?"];
  const [txt, setTxt] = useState(""); const [pi, setPi] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) { setTxt(phrases[0]); return; }
    let ci = 0; const q = phrases[pi];
    let pause: ReturnType<typeof setTimeout> | undefined;
    const id = setInterval(() => { if (ci <= q.length) { setTxt(q.slice(0, ci)); ci++; } else { clearInterval(id); pause = setTimeout(() => setPi((p) => (p + 1) % phrases.length), 1100); } }, 45);
    return () => { clearInterval(id); if (pause) clearTimeout(pause); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pi, reduce]);
  return <Center><ChatScene text={<span>{txt}<span className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse bg-accent2 align-middle" /></span>} /></Center>;
}
function Ticker({ tabular }: { tabular: boolean }) {
  const [n, setN] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) { setN(84210); return; }
    setN(0); let v = 0;
    const id = setInterval(() => { v += Math.floor(Math.random() * 1100); if (v > 84210) v = 84210; setN(v); if (v >= 84210) clearInterval(id); }, 55);
    return () => clearInterval(id);
  }, [reduce]);
  return <Center><MetricScene value={<span className={tabular ? "tabular-nums" : ""}>{n.toLocaleString()}</span>} label={tabular ? "Revenue (tabular)" : "Active users"} /></Center>;
}
function TextMorph() {
  const vals = ["$12,840", "$38,470", "$92,100", "$55,380"];
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setI((v) => (v + 1) % vals.length), 1500);
    return () => clearInterval(id);
  }, [reduce, vals.length]);
  return (
    <Center>
      <MetricScene label="Monthly revenue" delta="+8.1%" value={
        <span className="flex">
          {vals[i].split("").map((ch, idx) => (
            <span key={idx} className="relative inline-block h-8 overflow-hidden text-center" style={{ width: ch === "," || ch === "$" ? "0.5em" : "0.62em" }}>
              <AnimatePresence mode="popLayout">
                <motion.span key={ch + idx} initial={{ y: "110%" }} animate={{ y: 0 }} exit={{ y: "-110%" }} transition={{ duration: 0.3 }} className="absolute inset-0">{ch}</motion.span>
              </AnimatePresence>
            </span>
          ))}
        </span>
      } />
    </Center>
  );
}
function LineDraw({ k }: { k: number }) {
  return (
    <Center>
      <div className={`flex h-32 w-32 items-center justify-center ${card}`}>
        <svg key={k} viewBox="0 0 100 100" className="h-20 w-20">
          <motion.circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="6" opacity="0.3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, ease: EASE_OUT }} />
          <motion.path d="M30 52 L45 68 L72 32" fill="none" stroke="#10b981" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.3 }} />
        </svg>
      </div>
    </Center>
  );
}
function Shimmer() {
  return (
    <Center>
      <div className={`w-[280px] space-y-3 p-4 ${card}`}>
        {[0, 1, 2].map((row) => (
          <div key={row} className="flex items-center gap-3">
            <Skel className="h-9 w-9 rounded-full" />
            <div className="flex-1 space-y-1.5"><Skel className="h-2.5 w-1/2 rounded" /><Skel className="h-2.5 w-3/4 rounded" /></div>
          </div>
        ))}
      </div>
    </Center>
  );
}
function Skel({ className }: { className: string }) {
  return <div className={`relative overflow-hidden bg-white/[0.06] ${className}`}><motion.div animate={{ x: ["-100%", "220%"] }} transition={{ duration: 1.3, repeat: Infinity, ease: "linear" }} className="absolute inset-0 bg-gradient-to-r from-transparent via-white/12 to-transparent" /></div>;
}
function BeforeAfter() {
  const [p, setP] = useState(50);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) return;
    let raf = 0; let t = 0;
    const tick = () => { t += 0.018; setP(50 + Math.sin(t) * 36); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce]);
  return (
    <Center>
      <div className="relative h-32 w-52 overflow-hidden rounded-2xl border border-white/10">
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-1 bg-[#1a1a1f] p-2 opacity-50">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="rounded bg-white/15" />)}</div>
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - p}% 0 0)`, background: "linear-gradient(135deg,#7c5cff,#22d3ee)" }}><div className="grid h-full grid-cols-3 grid-rows-2 gap-1 p-2">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="rounded bg-white/30" />)}</div></div>
        <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_12px_white]" style={{ left: `${p}%` }}><div className="absolute top-1/2 left-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-black/40 backdrop-blur" /></div>
        <span className="absolute left-2 top-2 text-[9px] font-bold text-white/70">BEFORE</span><span className="absolute right-2 top-2 text-[9px] font-bold text-white">AFTER</span>
      </div>
    </Center>
  );
}

/* ===== Feedback & Interaction — on real controls (auto-demo loops) ===== */
export function InteractionDemo({ variant }: { variant: string }) {
  const [t, setT] = useState(false);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setT((v) => !v), 1400);
    return () => clearInterval(id);
  }, [reduce]);

  if (variant === "ripple") return <Ripple />;
  if (variant === "hold") return <HoldConfirm />;
  if (variant === "shake") return <Center><motion.div animate={t ? { x: [0, -9, 9, -7, 7, 0] } : {}} transition={{ duration: 0.4 }} className={`w-[260px] p-4 ${card}`}><p className="text-[11px] text-white/50">Password</p><div className="mt-1.5 rounded-lg border-2 border-rose-400/60 bg-rose-400/5 px-3 py-2 text-[13px] text-white/80">••••••••</div><p className="mt-1.5 text-[11px] text-rose-300">Incorrect password</p></motion.div></Center>;
  if (variant === "swipe") return <Center><motion.div animate={{ x: t ? 300 : 0, opacity: t ? 0 : 1 }} transition={{ duration: 0.5, ease: EASE_OUT }}><ToastScene title="Swipe to dismiss" desc="Drag me away to clear." /></motion.div></Center>;
  if (variant === "reorder") return <ReorderDemo t={t} />;
  if (variant === "drag" || variant === "rubber") return (
    <Center className="flex-col gap-3">
      <motion.div drag dragConstraints={{ left: -90, right: 90, top: -50, bottom: 50 }} dragElastic={variant === "rubber" ? 0.65 : 0.18} dragMomentum={variant === "drag"} whileDrag={{ scale: 1.05, cursor: "grabbing" }} className="cursor-grab"><KanbanScene /></motion.div>
      <span className="text-xs text-white/35">{variant === "rubber" ? "drag past the edge — it resists & snaps back" : "drag the card — it carries momentum"}</span>
    </Center>
  );
  if (variant === "press") return <Center><motion.div animate={{ scale: t ? 0.95 : 1 }} transition={{ type: "spring", stiffness: 500, damping: 17 }}><CtaButton /></motion.div></Center>;
  // hover → product card lifts
  return <Center><motion.div animate={{ y: t ? -10 : 0, scale: t ? 1.03 : 1, boxShadow: t ? "0 28px 50px -12px rgba(124,92,255,0.55)" : "0 10px 20px -12px rgba(0,0,0,0.5)" }} transition={{ duration: 0.25, ease: EASE_OUT }}><MediaScene /></motion.div></Center>;
}
function Ripple() {
  const [ripples, setRipples] = useState<number[]>([]);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setRipples((r) => [...r.slice(-3), Date.now()]), 1300);
    return () => clearInterval(id);
  }, [reduce]);
  return (
    <Center>
      <div className="relative flex h-12 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-[#7c5cff] to-[#6d4dff] px-8 text-sm font-semibold text-white shadow-lg">
        Add to cart
        {ripples.map((r) => <motion.span key={r} initial={{ scale: 0, opacity: 0.5 }} animate={{ scale: 8, opacity: 0 }} transition={{ duration: 0.9, ease: "easeOut" }} className="absolute h-10 w-10 rounded-full bg-white" />)}
      </div>
    </Center>
  );
}
function HoldConfirm() {
  const [p, setP] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) return;
    let raf = 0; let v = 0; let dir = 1;
    const tick = () => { v += dir * 0.011; if (v >= 1) { dir = -1; v = 1; } if (v <= 0) { dir = 1; v = 0; } setP(v); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce]);
  return (
    <Center className="flex-col gap-2">
      <div className="relative inline-flex items-center gap-2 overflow-hidden rounded-xl border border-rose-400/40 px-6 py-3 text-[13px] font-semibold text-rose-200">
        <div className="absolute inset-0 origin-left bg-rose-500/20" style={{ transform: `scaleX(${p})` }} />
        <span className="relative">Hold to delete</span>
      </div>
      <span className="text-xs text-white/35">hold the button to confirm</span>
    </Center>
  );
}
function ReorderDemo({ t }: { t: boolean }) {
  const order = t ? [0, 1, 2] : [2, 0, 1];
  const tags = [["Design", "#7c5cff"], ["Bug", "#ec4899"], ["Ship", "#10b981"]] as const;
  return (
    <Center>
      <div className="flex w-[230px] flex-col gap-2">
        {order.map((id, idx) => (
          <motion.div key={id} layout transition={{ type: "spring", stiffness: 380, damping: 28 }} style={{ order: idx }} className={`flex items-center gap-2.5 p-3 ${card}`}>
            <span className="h-6 w-1 rounded-full" style={{ background: tags[id][1] }} />
            <span className="flex-1 text-[13px] text-white/80">Task {id + 1}</span>
            <Avatar i={id} />
          </motion.div>
        ))}
      </div>
    </Center>
  );
}

/* ===== Performance ===== */
export function PerfDemo({ variant }: { variant: string }) {
  const good = variant === "thrash" ? "transform: translate" : "transform + opacity";
  const bad = variant === "thrash" ? "width / left" : variant === "compositing" ? "layout + paint" : "main-thread blocked";
  return (
    <Center>
      <div className="flex flex-col gap-5">
        <Track label={good} sub="60fps · GPU" good />
        <Track label={bad} sub="janky · dropped frames" good={false} />
      </div>
    </Center>
  );
}
function Track({ label, sub, good }: { label: string; sub: string; good: boolean }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-[11px]"><span className="font-mono text-white/60">{label}</span><span className={good ? "text-emerald-300/80" : "text-rose-300/80"}>{sub}</span></div>
      <div className="relative h-9 w-64 rounded-xl bg-white/5">
        <motion.div animate={{ x: [2, 222, 2] }} transition={{ duration: 2.4, repeat: Infinity, ease: good ? "easeInOut" : (p: number) => Math.floor(p * 9) / 9 }} className="absolute top-1 h-7 w-7 rounded-lg shadow-lg" style={{ background: good ? "#10b981" : "#f43f5e" }} />
      </div>
    </div>
  );
}

/* ===== Principles ===== */
export function PrincipleDemo({ variant }: { variant: string }) {
  const [t, setT] = useState(false);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setT((v) => !v), 1500);
    return () => clearInterval(id);
  }, [reduce]);

  if (variant === "squash") return <Center><motion.div animate={{ y: t ? 64 : -64, scaleY: t ? [1, 1.25, 0.75, 1] : 1, scaleX: t ? [1, 0.8, 1.25, 1] : 1 }} transition={{ duration: 0.6 }}><div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#f59e0b] to-[#ec4899] shadow-xl" /></motion.div></Center>;
  if (variant === "anticipation") return <Center><motion.div animate={{ x: t ? [0, -34, 170] : 0 }} transition={{ duration: 0.7, times: [0, 0.3, 1] }} className={`${tile} from-[#7c5cff] to-[#22d3ee]`} /></Center>;
  if (variant === "followthrough") return (
    <Center className="gap-2">
      <motion.div animate={{ x: t ? 110 : 0 }} transition={{ type: "spring", stiffness: 380, damping: 26 }} className={`${tile} from-[#7c5cff] to-[#22d3ee]`} />
      <motion.div animate={{ x: t ? 110 : 0 }} transition={{ type: "spring", stiffness: 180, damping: 16 }} className="h-4 w-4 rounded-full bg-white/40" />
    </Center>
  );
  if (variant === "spatial") return (
    <Center>
      <div className="relative">
        <div className="rounded-xl bg-white px-4 py-2.5 text-[13px] font-semibold text-ink shadow-lg">Filters</div>
        <AnimatePresence>{t && <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }} style={{ transformOrigin: "top left" }} className={`absolute left-0 top-full mt-2 w-40 p-2.5 text-[12px] text-white/60 ${card}`}>opens from & closes to its trigger</motion.div>}</AnimatePresence>
      </div>
    </Center>
  );
  if (variant === "perceived") return (
    <Center className="gap-6">
      <div className="flex flex-col items-center gap-1.5"><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="h-9 w-9 rounded-full border-2 border-white/15 border-t-white/70" /><span className="text-[10px] text-white/35">spinner · feels slow</span></div>
      <div className="flex flex-col items-center gap-1.5"><motion.div animate={{ scale: t ? 1 : 0.85, opacity: t ? 1 : 0.5 }} className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/25 text-emerald-300">✓</motion.div><span className="text-[10px] text-white/35">optimistic · feels fast</span></div>
    </Center>
  );
  if (variant === "reduced") return <Center><motion.div animate={{ opacity: t ? 1 : 0.45 }} transition={{ duration: 0.5 }}><NotifRow text="respects reduced-motion" /></motion.div></Center>;
  if (variant === "frequency") return (
    <Center className="gap-6">
      <div className="flex flex-col items-center gap-2"><motion.div animate={{ rotate: t ? 360 : 0, scale: t ? [1, 1.3, 1] : 1 }} transition={{ duration: 0.8 }} className={`${tile} from-[#7c5cff] to-[#ec4899]`} /><span className="text-[10px] text-white/35">rare · delightful</span></div>
      <div className="flex flex-col items-center gap-2"><motion.div animate={{ scale: t ? 0.95 : 1 }} transition={{ duration: 0.15 }} className={`${tile} from-[#10b981] to-[#22d3ee]`} /><span className="text-[10px] text-white/35">frequent · subtle</span></div>
    </Center>
  );
  // purposeful / hardware
  return <Center><motion.div animate={{ y: t ? -10 : 0, boxShadow: t ? "0 24px 44px -12px rgba(124,92,255,0.5)" : "0 0 0 rgba(0,0,0,0)" }} transition={{ duration: 0.25 }}><KanbanScene tag={variant === "hardware" ? "GPU" : "Purposeful"} /></motion.div></Center>;
}
