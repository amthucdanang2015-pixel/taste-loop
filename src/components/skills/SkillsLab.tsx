"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Copy, ShieldCheck, Search, X, AlertTriangle, FlaskConical, ClipboardCheck, Star, Layers } from "lucide-react";
import { PHASES, METHODOLOGIES, STACKS, QUALITY_SKILLS, type PhaseId, type Stack, type QualitySkill } from "@/data/qualitySkills";
import { copyText } from "@/lib/copyText";

/* ============================================================================
 * Skills Lab (D-027) — Pinterest masonry, done right.
 * A single measured masonry: the opened skill becomes a WIDE, tall detail tile
 * at top-left; every other skill packs around AND below it (grid-auto-flow
 * dense + per-item row spans). No modal, no wasted space under the detail, no
 * layoutId morph (that left some details blank). The detail simply fades in.
 * ==========================================================================*/

// useLayoutEffect on the client, useEffect on the server (no SSR warning)
const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function SkillsLab() {
  const [methodId, setMethodId] = useState("waterfall"); // default = the full lifecycle (all phases visible); the chips narrow it
  const [phase, setPhase] = useState<PhaseId | "all">("all");
  const [stack, setStack] = useState<Stack>("Any stack");
  const [essOnly, setEssOnly] = useState(false);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const reduce = useReducedMotion();

  const method = METHODOLOGIES.find((m) => m.id === methodId)!;
  const lanePhases = PHASES.filter((p) => method.loop.includes(p.id));

  const skills = useMemo(() => {
    const n = q.trim().toLowerCase();
    return QUALITY_SKILLS.filter(
      (s) =>
        method.loop.includes(s.phase) &&
        (phase === "all" || s.phase === phase) &&
        (stack === "Any stack" || s.stacks.includes("Any stack") || s.stacks.includes(stack)) &&
        (!essOnly || s.essential) &&
        (!n || `${s.title} ${s.oneLiner} ${s.phase} ${s.gate.join(" ")} ${(s.smells ?? []).join(" ")}`.toLowerCase().includes(n)),
    );
  }, [method, phase, stack, essOnly, q]);

  // the featured always resolves from the FULL set, so a deep-link or a click
  // never shows an empty tile just because a filter would hide that skill (D-027)
  const openSkill = open ? QUALITY_SKILLS.find((s) => s.slug === open) : undefined;
  // featured first (top-left); the rest keep their order and pack around it
  const ordered = openSkill ? [openSkill, ...skills.filter((s) => s.slug !== openSkill.slug)] : skills;

  // deep link in (#slug) — on load AND on hash-only navigation
  useEffect(() => {
    const applyHash = () => {
      const slug = window.location.hash.slice(1);
      if (slug && QUALITY_SKILLS.some((s) => s.slug === slug)) setOpen(slug);
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);
  useEffect(() => {
    history.replaceState(null, "", open ? `#${open}` : window.location.pathname + window.location.search);
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  // only clear if the slug isn't a real skill at all (a filter hiding it is fine — it stays featured)
  useEffect(() => { if (open && !QUALITY_SKILLS.some((s) => s.slug === open)) setOpen(null); }, [open]);

  const packText = skills.map((s) => `## ${s.title}\n${s.prompt}`).join("\n\n");

  return (
    <div>
      {/* the anatomy — how to use this in ten seconds */}
      <div className="grid gap-3 rounded-2xl border border-line bg-white/[0.02] p-4 sm:grid-cols-3">
        {[
          ["1 · Find your skill", "Pick the phase you're in (or search). ★ marks the Essential 10 — adopt those first."],
          ["2 · Read the anatomy", "Smells spot the problem · the gate blocks it · “prove it” is the test that it's really fixed."],
          ["3 · Automate it", "Copy the prompt into your agent as a standing instruction — or copy the whole pack at once."],
        ].map(([h, b]) => (
          <div key={h}>
            <p className="text-[12.5px] font-semibold text-white/85">{h}</p>
            <p className="mt-0.5 text-[12px] leading-relaxed text-white/45">{b}</p>
          </div>
        ))}
      </div>

      {/* how you build */}
      <div className="mt-7 flex flex-wrap gap-2">
        {METHODOLOGIES.map((m) => (
          <button key={m.id} onClick={() => { setMethodId(m.id); setPhase("all"); }}
            className={`rounded-full border px-4 py-2 text-sm transition ${m.id === methodId ? "border-accent/60 bg-accent/10 text-white" : "border-line text-white/60 hover:border-white/25 hover:text-white"}`}>
            {m.name}
          </button>
        ))}
      </div>
      <p className="mt-3 max-w-2xl text-[13.5px] leading-relaxed text-white/50">{method.how}</p>

      {/* the phase lane */}
      <div className="scroll-slim mt-7 flex gap-1.5 overflow-x-auto pb-2">
        <PhaseChip active={phase === "all"} onClick={() => setPhase("all")} name="All phases" q={`${skills.length} skills in this loop`} />
        {lanePhases.map((p, i) => (
          <PhaseChip key={p.id} active={phase === p.id} onClick={() => setPhase(p.id)} name={`${i + 1} · ${p.name}`} q={p.question} />
        ))}
      </div>

      {/* stack · essentials · search */}
      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        <button onClick={() => setEssOnly((v) => !v)}
          className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[12px] transition ${essOnly ? "border-amber-300/50 bg-amber-400/10 text-amber-200" : "border-line text-white/55 hover:text-white"}`}>
          <Star className={`h-3 w-3 ${essOnly ? "fill-amber-300 text-amber-300" : ""}`} /> Essential 10
        </button>
        <span className="mx-1 h-5 w-px bg-line" />
        {STACKS.map((s) => (
          <button key={s} onClick={() => setStack(s)}
            className={`rounded-lg border px-2.5 py-1 text-[12px] transition ${s === stack ? "border-accent2/60 bg-accent2/10 text-accent2" : "border-line text-white/55 hover:text-white"}`}>
            {s}
          </button>
        ))}
        <div className="ml-auto flex min-w-[200px] items-center gap-2 rounded-lg border border-line bg-black/30 px-3 py-1.5">
          <Search className="h-3.5 w-3.5 shrink-0 text-white/40" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${QUALITY_SKILLS.length} skills…`} className="w-full bg-transparent text-[12.5px] outline-none placeholder:text-white/30" />
          {q && <button onClick={() => setQ("")} aria-label="Clear search" className="text-white/30 hover:text-white"><X className="h-3.5 w-3.5" /></button>}
        </div>
      </div>

      {/* results + the pack */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[12px] text-white/40">{skills.length} skills{openSkill ? " · click the big one again to close" : " — click any card to open it"}</p>
        {skills.length > 0 && <CopyBtn label={`Copy all ${skills.length} as one agent pack`} copied="Pack copied" text={packText} icon={<Layers className="h-3.5 w-3.5" />} />}
      </div>

      {/* THE MASONRY — featured tile top-left; feed packs around & below it (no modal) */}
      <div className="mt-4 grid grid-cols-1 gap-x-4 [grid-auto-flow:row_dense] [grid-auto-rows:1px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {ordered.map((s) => {
          const isOpen = openSkill?.slug === s.slug;
          return (
            <MasonryCell key={s.slug} id={s.slug} wide={isOpen} estimate={isOpen ? 460 : 168}>
              {isOpen ? (
                <FeaturedDetail s={s} onClose={() => setOpen(null)} reduce={!!reduce} />
              ) : (
                <button onClick={() => setOpen(s.slug)} className="w-full rounded-2xl border border-line bg-surface p-5 text-left transition-colors hover:border-white/20">
                  <CardHead s={s} />
                  <p className="mt-3 text-[11px] text-white/35">{s.gate.length}-point gate · {s.smells?.length ?? 0} smells · prove-it test</p>
                </button>
              )}
            </MasonryCell>
          );
        })}
      </div>
      {skills.length === 0 && <p className="mt-10 text-center text-sm text-white/40">No skills match — widen the phase, stack, or search.</p>}
    </div>
  );
}

/** One masonry cell: measures its content and claims exactly that many 1px rows
 *  (+16 for the gap), so items of any height pack tightly. `wide` spans 2 cols. */
function MasonryCell({ id, wide, estimate, children }: { id: string; wide?: boolean; estimate: number; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [rows, setRows] = useState(estimate + 16);
  useIso(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setRows(Math.ceil(el.getBoundingClientRect().height) + 16);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [wide]);
  return (
    <div id={id} className={`scroll-mt-28 ${wide ? "col-span-full sm:col-span-2" : ""}`} style={{ gridRowEnd: `span ${rows}` }}>
      <div ref={ref}>{children}</div>
    </div>
  );
}

/** The full detail, laid out for the featured (top-left) tile. */
function FeaturedDetail({ s, onClose, reduce }: { s: QualitySkill; onClose: () => void; reduce: boolean }) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-accent/40 bg-surface p-5 shadow-[0_0_60px_-28px_rgba(124,92,255,0.55)] sm:p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <CardHead s={s} />
        <button onClick={onClose} aria-label="Close" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-white/60 transition hover:border-white/30 hover:text-white">
          <X className="h-4 w-4" />
        </button>
      </div>

      {s.smells && s.smells.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {s.smells.map((sm) => (
            <span key={sm} className="inline-flex items-center gap-1.5 rounded-full border border-rose-400/20 bg-rose-400/[0.06] px-2.5 py-1 text-[11px] text-rose-200/75">
              <AlertTriangle className="h-3 w-3 shrink-0 text-rose-400/70" /> {sm}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 grid items-start gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-white/5 bg-black/25 p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-widest text-white/40"><ShieldCheck className="h-3.5 w-3.5 text-emerald-400/80" /> The gate — no exit until</p>
            <CopyBtn small label="Copy gate" copied="Copied" icon={<ClipboardCheck className="h-3 w-3" />}
              text={`## ${s.title} — gate\n${s.gate.map((g) => `- [ ] ${g}`).join("\n")}${s.verify ? `\n\nVerify: ${s.verify}` : ""}`} />
          </div>
          <ul className="mt-2.5 space-y-1.5">
            {s.gate.map((g) => (
              <li key={g} className="flex items-start gap-2 text-[12.5px] leading-relaxed text-white/70">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400/70" /> {g}
              </li>
            ))}
          </ul>
          {s.verify && (
            <p className="mt-3 flex items-start gap-2 border-t border-white/5 pt-3 text-[12px] leading-relaxed text-white/60">
              <FlaskConical className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent2/80" />
              <span><span className="font-semibold text-white/75">Prove it:</span> {s.verify}</span>
            </p>
          )}
        </div>

        <div className="rounded-xl border border-white/5 bg-black/25 p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[10.5px] font-bold uppercase tracking-widest text-white/40">The skill — paste into your agent</p>
            <CopyBtn small label="Copy skill" copied="Copied" text={s.prompt} />
          </div>
          <pre className="scroll-slim mt-2.5 max-h-72 overflow-y-auto whitespace-pre-wrap font-mono text-[11.5px] leading-relaxed text-white/65">{s.prompt}</pre>
        </div>
      </div>
    </motion.div>
  );
}

/** Shared card header — used in both the feed card and the featured tile. */
function CardHead({ s }: { s: QualitySkill }) {
  return (
    <div className="min-w-0">
      <p className="flex flex-wrap items-center gap-2 text-[10.5px] font-semibold uppercase tracking-widest text-accent2">
        {PHASES.find((p) => p.id === s.phase)?.name}
        {s.essential && (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/10 px-2 py-0.5 text-[9.5px] font-bold tracking-wide text-amber-300/90">
            <Star className="h-2.5 w-2.5 fill-amber-300 text-amber-300" /> Essential
          </span>
        )}
      </p>
      <h3 className="mt-1.5 text-[17px] font-semibold leading-snug tracking-tight">{s.title}</h3>
      <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-white/55">{s.oneLiner}</p>
    </div>
  );
}

function PhaseChip({ active, onClick, name, q }: { active: boolean; onClick: () => void; name: string; q: string }) {
  return (
    <button onClick={onClick} className={`min-w-[150px] shrink-0 rounded-xl border p-3 text-left transition ${active ? "border-accent/60 bg-accent/10" : "border-line hover:border-white/20"}`}>
      <span className={`block text-[12.5px] font-semibold ${active ? "text-white" : "text-white/75"}`}>{name}</span>
      <span className="mt-0.5 block text-[10.5px] leading-snug text-white/40">{q}</span>
    </button>
  );
}

function CopyBtn({ text, label, copied, small, icon }: { text: string; label: string; copied: string; small?: boolean; icon?: React.ReactNode }) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "success" | "error">("idle");
  useEffect(() => { setCopyStatus("idle"); }, [text]);

  async function copy() {
    setCopyStatus((await copyText(text)) ? "success" : "error");
  }

  return (
    <>
      <button
        type="button"
        onClick={copy}
        className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-line bg-white/[0.04] font-medium text-white/75 transition hover:border-white/30 hover:text-white ${small ? "px-2 py-1 text-[10.5px]" : "px-3 py-1.5 text-[11.5px]"}`}
        aria-label={copyStatus === "success" ? `${copied}. Copy again` : copyStatus === "error" ? "Copy failed. Try again" : label}
      >
        {copyStatus === "success" ? <Check className={small ? "h-3 w-3 text-emerald-400" : "h-3.5 w-3.5 text-emerald-400"} /> : copyStatus === "error" ? <AlertTriangle className={small ? "h-3 w-3 text-rose-400" : "h-3.5 w-3.5 text-rose-400"} /> : icon ?? <Copy className={small ? "h-3 w-3" : "h-3.5 w-3.5"} />}
        {copyStatus === "success" ? copied : copyStatus === "error" ? "Copy failed" : label}
      </button>
      <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {copyStatus === "success" ? `${copied}.` : copyStatus === "error" ? "Could not copy to the clipboard. Try again." : ""}
      </span>
    </>
  );
}
