"use client";

import { Check, Search, Bell, Sparkles, TrendingUp, X, Star, Play } from "lucide-react";

/* ---------- primitives ---------- */
export function Avatar({ i = 0, label }: { i?: number; label?: string }) {
  const c = ["#7c5cff", "#22d3ee", "#ec4899", "#f59e0b", "#10b981", "#6366f1"][i % 6];
  return <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: c }}>{label ?? "•"}</span>;
}
export function Bar({ w = 100, h = 8, dim = false }: { w?: number; h?: number; dim?: boolean }) {
  return <span className="block rounded-full" style={{ width: `${w}%`, height: h, background: dim ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.28)" }} />;
}
export const card = "rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-md shadow-xl";

/* ---------- scenes ---------- */
export function ToastScene({ title = "Changes saved", desc = "Your project is up to date." }: { title?: string; desc?: string }) {
  return (
    <div className={`flex w-[270px] items-start gap-3 p-3.5 ${card}`}>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400"><Check className="h-4 w-4" /></span>
      <div className="flex-1">
        <p className="text-[13px] font-semibold text-white">{title}</p>
        <p className="mt-0.5 text-[12px] text-white/50">{desc}</p>
      </div>
      <X className="h-3.5 w-3.5 text-white/30" />
    </div>
  );
}

export function ModalScene() {
  return (
    <div className={`w-[300px] overflow-hidden p-5 ${card}`}>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#7c5cff] to-[#22d3ee]"><Sparkles className="h-4 w-4 text-white" /></span>
      <h4 className="mt-3 text-[15px] font-semibold text-white">Upgrade to Pro</h4>
      <p className="mt-1 text-[12.5px] leading-relaxed text-white/55">Unlock the full library, agent skills, and premium components.</p>
      <div className="mt-4 flex gap-2">
        <div className="flex-1 rounded-lg bg-white py-2 text-center text-[12.5px] font-semibold text-ink">Upgrade</div>
        <div className="rounded-lg border border-white/15 px-3 py-2 text-center text-[12.5px] text-white/60">Later</div>
      </div>
    </div>
  );
}

export function CommandScene({ active = 0 }: { active?: number }) {
  const rows = [["Rebuild the UI", "⌘1"], ["Add motion polish", "⌘2"], ["Write launch thread", "⌘3"], ["Set up pSEO", "⌘4"]];
  return (
    <div className={`w-[320px] overflow-hidden ${card}`}>
      <div className="flex items-center gap-2 border-b border-white/8 px-3.5 py-3 text-white/50"><Search className="h-4 w-4" /><span className="text-[13px]">Type a command…</span><span className="ml-auto rounded border border-white/15 px-1.5 text-[10px]">⌘K</span></div>
      <div className="p-1.5">
        {rows.map(([label, kbd], i) => (
          <div key={label} className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] ${i === active ? "bg-accent/20 text-white" : "text-white/55"}`}>
            <span className="h-2.5 w-2.5 rounded-sm bg-gradient-to-br from-accent to-accent2" />{label}
            <span className="ml-auto text-[10px] text-white/30">{kbd}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MetricScene({ value = "84,210", label = "Active users", delta = "+12.4%" }: { value?: React.ReactNode; label?: string; delta?: string }) {
  return (
    <div className={`w-[230px] p-4 ${card}`}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-wide text-white/40">{label}</span>
        <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400"><TrendingUp className="h-3 w-3" />{delta}</span>
      </div>
      <div className="mt-1.5 text-[28px] font-bold tabular-nums text-white">{value}</div>
      <svg viewBox="0 0 100 24" className="mt-2 h-7 w-full"><path d="M0 20 L20 14 L40 17 L60 7 L80 11 L100 3" fill="none" stroke="#22d3ee" strokeWidth="2.5" /></svg>
    </div>
  );
}

export function PricingFeature({ label }: { label: string }) {
  return <div className="flex items-center gap-2 text-[12.5px] text-white/70"><Check className="h-3.5 w-3.5 text-accent2" /> {label}</div>;
}
export function PricingScene({ children }: { children?: React.ReactNode }) {
  return (
    <div className={`w-[250px] p-5 ${card}`}>
      <p className="text-[12px] text-white/50">Pro</p>
      <p className="mt-1"><span className="text-3xl font-bold text-white">$12</span><span className="text-sm text-white/40">/mo</span></p>
      <div className="mt-4 space-y-2">{children}</div>
      <div className="mt-5 w-full rounded-lg bg-gradient-to-r from-accent to-accent2 py-2 text-center text-[13px] font-semibold text-white">Start free trial</div>
    </div>
  );
}

export function ChatScene({ text }: { text: React.ReactNode }) {
  return (
    <div className="flex w-[300px] items-start gap-2.5">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#7c5cff] to-[#22d3ee]"><Sparkles className="h-3.5 w-3.5 text-white" /></span>
      <div className={`rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-[13px] leading-relaxed text-white/85 ${card}`}>{text}</div>
    </div>
  );
}

export function KanbanScene({ tag = "In progress", color = "#7c5cff" }: { tag?: string; color?: string }) {
  return (
    <div className={`w-[210px] p-3.5 ${card}`}>
      <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: `${color}22`, color }}>{tag}</span>
      <p className="mt-2 text-[13px] font-medium text-white">Polish onboarding flow</p>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex -space-x-1.5">{[0, 1, 2].map((i) => <Avatar key={i} i={i} />)}</div>
        <span className="text-[11px] text-white/35">3 subtasks</span>
      </div>
    </div>
  );
}

export function NotifRow({ i = 0, name = "Sarah Chen", text = "approved your request", time = "2m" }: { i?: number; name?: string; text?: string; time?: string }) {
  return (
    <div className={`flex w-[290px] items-center gap-3 p-3 ${card}`}>
      <span className="relative"><Avatar i={i} label={name[0]} /><Bell className="absolute -right-1 -top-1 h-3 w-3 text-accent2" /></span>
      <p className="flex-1 text-[12.5px] text-white/75"><span className="font-semibold text-white">{name}</span> {text}</p>
      <span className="text-[11px] text-white/30">{time}</span>
    </div>
  );
}

export function MediaScene() {
  return (
    <div className={`w-[200px] overflow-hidden ${card}`}>
      <div className="relative flex aspect-video items-center justify-center bg-gradient-to-br from-[#7c5cff] to-[#ec4899]">
        <Play className="h-7 w-7 text-white/90" fill="currentColor" />
      </div>
      <div className="p-3"><p className="text-[13px] font-semibold text-white">Midnight City</p><p className="text-[11px] text-white/40">M83 · 4:03</p></div>
    </div>
  );
}

export function ProfileScene() {
  return (
    <div className={`w-[230px] p-5 text-center ${card}`}>
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#f59e0b] to-[#ec4899] text-lg font-bold text-white">N</span>
      <p className="mt-2.5 text-[14px] font-semibold text-white">Nam Nguyen</p>
      <p className="text-[12px] text-white/45">Product engineer</p>
      <div className="mt-3 flex justify-around text-center">
        {[["128", "posts"], ["4.2k", "followers"], ["310", "following"]].map(([n, l]) => (
          <div key={l}><div className="text-[13px] font-bold text-white">{n}</div><div className="text-[10px] text-white/40">{l}</div></div>
        ))}
      </div>
    </div>
  );
}

export function CtaButton({ label = "Start building", className = "" }: { label?: string; className?: string }) {
  return <div className={`inline-flex items-center gap-1.5 rounded-xl bg-white px-6 py-3 text-[14px] font-semibold text-ink shadow-lg ${className}`}>{label} <Sparkles className="h-4 w-4 text-accent" /></div>;
}

export function BadgeScene() {
  return (
    <div className={`flex w-[220px] items-center gap-3 p-4 ${card}`}>
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg"><Star className="h-5 w-5 text-white" fill="currentColor" /></span>
      <div><p className="text-[13px] font-semibold text-white">7-day streak!</p><p className="text-[11px] text-white/45">Achievement unlocked</p></div>
    </div>
  );
}

export function EmptyScene() {
  return (
    <div className={`flex w-[260px] flex-col items-center p-6 text-center ${card}`}>
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-white/40"><Sparkles className="h-5 w-5" /></span>
      <p className="mt-3 text-[13px] font-semibold text-white">No projects yet</p>
      <p className="mt-1 text-[12px] text-white/45">Create your first project to get started.</p>
      <div className="mt-3 rounded-lg bg-white px-3.5 py-1.5 text-[12px] font-semibold text-ink">New project</div>
    </div>
  );
}
