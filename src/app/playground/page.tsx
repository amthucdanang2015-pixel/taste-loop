import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { PRIMARY_CTA } from "@/config/brand";
import { PRODUCTS } from "@/data/products";

export const metadata: Metadata = {
  title: "The Playground — demo products in every design language",
  description:
    "One design-language engine, many products. Flowtime (a focus app in 112 styles) and Card Studio (a 3D business-card maker) — live, interactive, free.",
};

export default function PlaygroundPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-32">
      <Reveal>
        <p className="eyebrow">Playground · taste made visible</p>
        <h1 className="mt-2 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">One engine. Many products. Every design language.</h1>
        <p className="mt-3 max-w-xl text-white/55">
          Each demo product here is a real, working app driven by the same design-token engine — proof that taste is a system, not a lucky accident. Pick one and play.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {PRODUCTS.map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.08}>
            <Link href={p.href} className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface transition hover:border-white/25">
              {/* poster */}
              <div className="relative h-56 overflow-hidden" style={{ background: `radial-gradient(80% 90% at 70% 10%, ${p.accent}26, #0c0c10 70%)` }}>
                {p.slug === "flowtime" ? <FlowtimePoster accent={p.accent} /> : <CardsPoster accent={p.accent} />}
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h2 className="text-xl font-semibold tracking-tight">{p.name}</h2>
                <p className="mt-0.5 text-sm" style={{ color: p.accent }}>{p.tagline}</p>
                <p className="mt-2.5 flex-1 text-[13.5px] leading-relaxed text-muted">{p.blurb}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.proves.map((x) => <span key={x} className="rounded-full bg-white/[0.05] px-2.5 py-1 text-[11px] text-white/55">{x}</span>)}
                </div>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-white/85 transition group-hover:text-white">
                  Open the studio <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-dashed border-white/15 bg-white/[0.015] p-6">
          <p className="flex-1 text-sm text-white/55">
            <span className="text-white/85">A third product can join the same engine.</span> The point is not more skins—it is a reusable way to make, compare, and judge deliberate product direction.
          </p>
          <Link href={PRIMARY_CTA.href} className="shrink-0 rounded-full bg-loop px-4 py-2 text-sm font-semibold text-ink transition hover:bg-loop/90">{PRIMARY_CTA.label}</Link>
        </div>
      </Reveal>
    </div>
  );
}

/* Designed posters — pure CSS, no runtime engines on the listing page. */
function FlowtimePoster({ accent }: { accent: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center gap-6">
      <div className="relative flex h-36 w-36 items-center justify-center rounded-full" style={{ border: `5px solid ${accent}`, borderRightColor: "rgba(255,255,255,0.12)", borderBottomColor: "rgba(255,255,255,0.12)" }}>
        <div className="text-center">
          <p className="font-mono text-2xl font-bold tracking-tight text-white">14:59</p>
          <p className="text-[9px] uppercase tracking-widest text-white/40">focus</p>
        </div>
      </div>
      <div className="hidden w-36 space-y-2 sm:block">
        {[0.9, 0.65, 0.8].map((w, i) => (
          <div key={i} className="flex items-center gap-2 rounded-lg bg-white/[0.05] p-2 ring-1 ring-white/10">
            <span className="h-3 w-3 rounded" style={{ background: i === 0 ? accent : "transparent", border: `1.5px solid ${i === 0 ? accent : "rgba(255,255,255,0.3)"}` }} />
            <span className="h-1.5 rounded-full bg-white/20" style={{ width: `${w * 100}%` }} />
          </div>
        ))}
      </div>
    </div>
  );
}
function CardsPoster({ accent }: { accent: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: 800 }}>
      <div className="relative h-32 w-56 rounded-xl bg-[#14141a] p-4 ring-1 ring-white/15" style={{ transform: "rotateY(-16deg) rotateX(8deg)", boxShadow: `0 30px 60px -20px ${accent}44` }}>
        <span className="block h-2 w-2 rounded-full" style={{ background: accent }} />
        <p className="mt-5 text-[15px] font-semibold text-white">Nam Nguyen</p>
        <p className="text-[10px] text-white/45">Founder · Design Engineer</p>
        <span className="absolute bottom-3 right-3 rounded px-2 py-0.5 text-[8px] font-bold text-black" style={{ background: accent }}>T/L</span>
      </div>
      <div className="absolute h-32 w-56 rounded-xl bg-[#101014] ring-1 ring-white/10" style={{ transform: "translate(26px, 18px) rotateY(-16deg) rotateX(8deg)", zIndex: -1, opacity: 0.6 }} />
    </div>
  );
}
