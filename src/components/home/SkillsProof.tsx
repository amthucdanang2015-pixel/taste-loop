import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { PHASES, QUALITY_SKILLS } from "@/data/qualitySkills";
import { Reveal } from "@/components/Reveal";

export function SkillsProof() {
  const essentials = QUALITY_SKILLS.filter((skill) => skill.essential).slice(0, 6);
  return (
    <section className="section-rule mx-auto max-w-6xl px-6 py-20 sm:py-24">
      <Reveal>
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <p className="eyebrow">The quality system, published</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em] sm:text-5xl">Skills make the bar reusable.</h2>
          </div>
          <div>
            <p className="max-w-2xl text-base leading-relaxed text-white/58">
              Taste should not disappear inside a meeting. We turn hard-won product judgment into gates, tests, and agent instructions—then publish the system we use ourselves.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {PHASES.map((phase) => <span key={phase.id} className="rounded-full border border-line px-3 py-1.5 text-[11px] text-white/46">{phase.name}</span>)}
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {essentials.map((skill) => (
            <Link key={skill.slug} href={`/skills#${skill.slug}`} className="group rounded-2xl border border-line bg-surface/65 p-5 transition hover:border-loop/35">
              <div className="flex items-start justify-between gap-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-signal">{skill.phase}</span>
                <ArrowUpRight className="h-4 w-4 text-white/25 transition group-hover:text-loop" />
              </div>
              <h3 className="mt-4 font-semibold tracking-tight">{skill.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-muted">{skill.oneLiner}</p>
              <p className="mt-4 flex items-center gap-1.5 text-[11px] text-white/38"><Check className="h-3 w-3 text-loop" /> {skill.gate.length}-point quality gate</p>
            </Link>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-dashed border-white/15 px-5 py-4">
          <p className="text-sm text-white/55">{QUALITY_SKILLS.length} practical skills across the full product lifecycle.</p>
          <Link href="/skills" className="shrink-0 text-sm font-medium text-loop hover:text-loop/80">Open Skills →</Link>
        </div>
      </Reveal>
    </section>
  );
}
