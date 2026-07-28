import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";
import { BRAND, PRIMARY_CTA } from "@/config/brand";
import { getShippedApps } from "@/lib/apps";
import { Reveal } from "@/components/Reveal";
import { LivingLoop } from "@/components/brand/LivingLoop";
import { ShippedProof } from "@/components/home/ShippedProof";
import { LoopBoard } from "@/components/home/LoopBoard";
import { SkillsProof } from "@/components/home/SkillsProof";
import { OpenLoopSection } from "@/components/home/OpenLoopSection";
import { OffersSection } from "@/components/home/OffersSection";
import { FounderStory } from "@/components/home/FounderStory";

export const revalidate = 86400;

export default async function Home() {
  const apps = await getShippedApps();

  return (
    <>
      <section className="mx-auto grid min-h-[92svh] max-w-7xl items-center gap-10 px-6 pb-16 pt-32 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14 lg:pb-20 lg:pt-36">
        <div className="relative z-10">
          <Reveal eager>
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.025] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/62">
              <span className="h-1.5 w-1.5 rounded-full bg-loop" /> {BRAND.positioning}
            </p>
          </Reveal>
          <Reveal eager>
            <h1 className="mt-7 max-w-3xl text-balance text-5xl font-semibold leading-[0.94] tracking-[-0.06em] sm:text-7xl lg:text-[5.7rem]">
              The difference is <span className="text-gradient">the loop.</span>
            </h1>
          </Reveal>
          <Reveal eager>
            <p className="mt-7 max-w-xl text-pretty text-base leading-relaxed text-white/62 sm:text-lg">
              TasteLoop turns difficult product decisions into working
              evidence. I direct a coordinated agent system across research,
              product, design, engineering, and QA, hold the quality gate, and
              use real feedback to decide what ships next.
            </p>
            <p className="mt-4 flex max-w-xl items-center gap-2 text-sm text-white/48">
              <span className="h-px w-5 bg-signal" />
              Built and led by {BRAND.founder.name}. One accountable partner
              from first decision to shipped product.
            </p>
          </Reveal>
          <Reveal eager>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link href={PRIMARY_CTA.href} className="inline-flex items-center gap-2 rounded-full bg-loop px-6 py-3 text-sm font-semibold text-ink transition hover:bg-loop/90">
                {PRIMARY_CTA.label} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="#proof" className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm text-white/78 transition hover:border-white/30 hover:text-white">
                Start with proof <ArrowDown className="h-4 w-4" />
              </Link>
            </div>
            <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.14em] text-white/35">Human taste, built into every loop.</p>
          </Reveal>
        </div>

        <Reveal eager>
          <LivingLoop />
        </Reveal>
      </section>

      <ShippedProof apps={apps} />

      <section id="loop" className="section-rule mx-auto max-w-6xl scroll-mt-28 px-6 py-20 sm:py-24">
        <Reveal>
          <p className="eyebrow">Why the work changed</p>
          <div className="mt-3 grid gap-8 lg:grid-cols-[1fr_0.72fr] lg:items-end">
            <h2 className="max-w-4xl text-3xl font-semibold tracking-[-0.045em] sm:text-5xl">
              Making multiplied. Judgment became the scarce part.
            </h2>
            <p className="text-base leading-relaxed text-white/58">
              Agents can research, design, code, test, and document in
              parallel. Without one owner, that creates more noise—not a better
              product. TasteLoop keeps one decision visible: agents expand the
              work, Nam holds the gate, and real evidence decides what happens
              next.
            </p>
          </div>
        </Reveal>
        <Reveal>
          <div className="mt-10"><LoopBoard /></div>
        </Reveal>
      </section>

      <SkillsProof />
      <OpenLoopSection />
      <OffersSection />
      <FounderStory />
    </>
  );
}
