import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Bot, CircleDotDashed, UserRound } from "lucide-react";
import { BRAND, WORK_MODEL } from "@/config/brand";
import { PRINCIPLES } from "@/content/site";
import { CtaBlock } from "@/components/CtaBlock";
import { PageHeader } from "@/components/PageHeader";
import { Wordmark } from "@/components/brand/Wordmark";

export const metadata: Metadata = {
  title: "About TasteLoop",
  description:
    "TasteLoop is Nam Nguyen's founder-led product operating system: human direction and quality, coordinated agent speed, and real-world evidence.",
};

const ownership = [
  {
    eyebrow: "Nam owns",
    title: "Direction and the quality gate",
    body: "The product decision, trade-offs, non-goals, taste bar, commercial coherence, and final call never disappear into a queue.",
    icon: UserRound,
  },
  {
    eyebrow: "Agents accelerate",
    title: "Parallel product work",
    body: "Research synthesis, product options, design, implementation, systematic QA, and documentation move together around the same decision.",
    icon: Bot,
  },
  {
    eyebrow: "Reality decides",
    title: "What survives the next loop",
    body: "Observed use, comprehension, reliability, conversion, and willingness to pay correct the work—even when the answer is narrow it or stop.",
    icon: CircleDotDashed,
  },
] as const;

const proofLinks = [
  {
    href: "/shipped",
    title: "Shipped",
    body: "Products you can open and App Store work you can inspect.",
  },
  {
    href: "/skills",
    title: "Skills",
    body: "The quality gates and agent workflows behind the work.",
  },
  {
    href: "/playground",
    title: "Playground",
    body: "Working interfaces across a wide range of design languages.",
  },
  {
    href: "/animations",
    title: "Animations",
    body: "A precise, replayable vocabulary for motion with purpose.",
  },
] as const;

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 pb-28 pt-32 sm:pt-36">
      <PageHeader
        eyebrow="About TasteLoop"
        title="One accountable partner. An agent system behind the work."
        intro="TasteLoop is the product system. Nam is the accountable operator. Agents expand the work. Evidence corrects it."
      />

      <section className="mt-12 grid gap-10 text-[15px] leading-relaxed text-white/68 md:grid-cols-[0.62fr_1.38fr]">
        <div>
          <Wordmark />
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.15em] text-signal">
            The difference is the loop.
          </p>
        </div>
        <div className="space-y-5">
          <p className="text-xl leading-relaxed text-white/82">
            I’m {BRAND.founder.name}. For nearly ten years, I’ve helped turn
            product ideas into shipped software—from direction and design
            through engineering, QA, launch, and iteration.
          </p>
          <p>
            TasteLoop is the operating system I built around that experience.
            A coordinated agent system creates more range and speed without
            breaking the work into handoffs. I set the direction, review every
            critical output, and stay accountable until evidence says ship,
            change, narrow, or stop.
          </p>
          <p>
            This is not a fictional team or an AI feature factory. When
            specialist human expertise is needed, I name the person and the
            scope before the work starts. There is never an invisible team
            between you and the decision.
          </p>
        </div>
      </section>

      <section className="mt-14 grid gap-3 lg:grid-cols-3">
        {ownership.map((item) => {
          const Icon = item.icon;
          return (
            <article
              key={item.title}
              className="rounded-2xl border border-line bg-surface/72 p-5"
            >
              <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.15em] text-loop">
                <Icon className="h-3.5 w-3.5" />
                {item.eyebrow}
              </div>
              <h2 className="mt-4 text-lg font-semibold tracking-[-0.025em]">
                {item.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-white/52">
                {item.body}
              </p>
            </article>
          );
        })}
      </section>

      <section className="mt-14 rounded-3xl border border-line bg-surface/75 p-6 sm:p-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-signal">
          Small by design
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em]">
          Protected capacity. Client-owned work. No lock-in.
        </h2>
        <div className="mt-5 grid gap-5 text-sm leading-relaxed text-white/55 sm:grid-cols-2">
          <p>
            {WORK_MODEL.capacity} {WORK_MODEL.continuity}
          </p>
          <p>{WORK_MODEL.ownership}</p>
        </div>
      </section>

      <section className="mt-14">
        <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-signal">
          Inspect the system
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
          Proof, standards, and working experiments.
        </h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {proofLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-2xl border border-line bg-white/[0.018] p-5 transition hover:border-loop/35"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold">{item.title}</h3>
                <ArrowUpRight className="h-4 w-4 text-white/25 transition group-hover:text-loop" />
              </div>
              <p className="mt-2 text-sm leading-relaxed text-white/48">
                {item.body}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-14 grid gap-2 sm:grid-cols-2">
        {PRINCIPLES.map((principle) => (
          <p
            key={principle}
            className="rounded-xl border border-line bg-white/[0.02] px-4 py-3 text-sm text-white/68"
          >
            {principle}
          </p>
        ))}
      </section>

      <div className="mt-12">
        <CtaBlock />
      </div>
    </div>
  );
}
