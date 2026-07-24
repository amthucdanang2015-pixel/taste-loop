import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { SkillsLab } from "@/components/skills/SkillsLab";
import { PRIMARY_CTA } from "@/config/brand";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Quality Skills — gates & taste for every phase of shipping",
  description:
    "Anti-slop skills for the whole software lifecycle — discovery to operations. Pick your methodology, phase, and stack; get the gates and agent prompts that hold a world-class bar.",
};

export default function SkillsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-32">
      <Reveal>
        <p className="eyebrow">Skills · our product standards, published</p>
        <h1 className="mt-2 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
          AI can generate software. These gates make it <span className="text-gradient">a product</span>.
        </h1>
        <p className="mt-4 max-w-2xl text-white/55">
          Frontend taste is table stakes — slop leaks in at every phase: fuzzy specs, missing states, dishonest APIs, unscoped queries,
          launches with no floor. This is the full-lifecycle library we run our own product work on: pick how you build, where you are, and
          your stack — get the <span className="text-white/80">skill</span> (paste it into your agent) and the{" "}
          <span className="text-white/80">gate</span> (the checklist the phase must pass).
        </p>
      </Reveal>

      <div className="mt-10">
        <SkillsLab />
      </div>

      <Reveal>
        <div className="mt-16 flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-gradient-to-br from-accent/12 to-accent2/10 p-5">
          <p className="flex-1 text-sm text-white/75">These are the gates we hold in every loop. Need them applied to a real decision?</p>
          <Link href={PRIMARY_CTA.href} className="shrink-0 rounded-full bg-loop px-4 py-2 text-sm font-semibold text-ink transition hover:bg-loop/90">{PRIMARY_CTA.label}</Link>
        </div>
      </Reveal>
    </div>
  );
}
