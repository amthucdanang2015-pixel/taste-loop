"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowDownLeft,
  Bot,
  Check,
  CircleDotDashed,
  FileCheck2,
  UserRound,
} from "lucide-react";
import { LOOP_STAGES } from "@/content/site";

const exampleDecision =
  "Should the first session begin with setup—or a working example?";

const stageWork = [
  {
    label: "Signal board",
    capabilities: ["Research", "Synthesis"],
    artifacts: ["Customer language", "Observed behavior", "Product constraints"],
  },
  {
    label: "Decision brief",
    capabilities: ["Product", "Analysis"],
    artifacts: ["Options and trade-offs", "Non-goals", "Kill criterion"],
  },
  {
    label: "Working slice",
    capabilities: ["Design", "Engineering"],
    artifacts: ["Critical flow", "Real states", "Production constraints"],
  },
  {
    label: "Quality pass",
    capabilities: ["Product review", "QA"],
    artifacts: ["Clarity and craft", "Edge states", "Code and accessibility"],
  },
  {
    label: "Reality check",
    capabilities: ["Research", "Instrumentation"],
    artifacts: ["Observed use", "Comprehension", "Commercial response"],
  },
  {
    label: "Learning record",
    capabilities: ["Analysis", "Product"],
    artifacts: ["Supported", "Contradicted", "Still unknown"],
  },
  {
    label: "System memory",
    capabilities: ["Documentation", "Quality system"],
    artifacts: ["Skill", "Test", "Token or rule"],
  },
  {
    label: "Next loop",
    capabilities: ["Planning", "Context handoff"],
    artifacts: ["Next decision", "Stronger context", "Smaller uncertainty"],
  },
] as const;

export function LoopBoard() {
  const [active, setActive] = useState(1);
  const reduce = useReducedMotion();
  const stage = LOOP_STAGES[active];
  const work = stageWork[active];

  return (
    <div className="overflow-hidden rounded-[2rem] border border-line bg-surface/85 shadow-[0_36px_100px_-60px_rgba(0,0,0,.9)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-black/20 px-5 py-4 sm:px-6">
        <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/48">
          <span className="h-1.5 w-1.5 rounded-full bg-loop" />
          Example operating view
        </p>
        <div className="flex flex-wrap items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-white/38">
          <span className="rounded-full border border-line px-3 py-1.5">
            One decision
          </span>
          <span className="rounded-full border border-line px-3 py-1.5">
            One owner
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-[13.5rem_minmax(0,1fr)_minmax(17rem,.72fr)]">
        <nav
          aria-label="TasteLoop operating stages"
          className="border-b border-line bg-black/15 p-4 lg:border-b-0 lg:border-r"
        >
          <p className="px-2 font-mono text-[9px] uppercase tracking-[0.16em] text-white/30">
            Signal → repeat
          </p>
          <div className="scroll-slim mt-3 flex gap-2 overflow-x-auto pb-1 lg:grid lg:overflow-visible lg:pb-0">
            {LOOP_STAGES.map((item, index) => (
              <button
                key={item.name}
                type="button"
                onClick={() => setActive(index)}
                aria-pressed={active === index}
                aria-controls="loop-stage-detail"
                className={`relative min-h-11 min-w-[8.25rem] overflow-hidden rounded-xl border px-3 py-2.5 text-left transition lg:min-w-0 ${
                  active === index
                    ? "border-loop/45 text-ink"
                    : "border-transparent text-white/48 hover:border-white/12 hover:text-white"
                }`}
              >
                {active === index ? (
                  <motion.span
                    layoutId="loop-board-active-stage"
                    aria-hidden="true"
                    className="absolute inset-0 bg-loop"
                    transition={
                      reduce
                        ? { duration: 0 }
                        : { duration: 0.28, ease: [0.22, 1, 0.36, 1] }
                    }
                  />
                ) : null}
                <span className="relative flex items-center gap-3">
                  <span className="font-mono text-[9px] opacity-55">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-xs font-semibold">{item.name}</span>
                </span>
              </button>
            ))}
          </div>
        </nav>

        <motion.section
          id="loop-stage-detail"
          key={stage.name}
          initial={reduce ? false : { opacity: 0, y: 7 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduce ? 0 : 0.3,
            ease: [0.22, 1, 0.36, 1],
          }}
          aria-live="polite"
          className="border-b border-line p-5 sm:p-7 lg:border-b-0 lg:border-r"
        >
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-signal">
            Decision 01 · illustrative
          </p>
          <h3 className="mt-3 max-w-xl text-xl font-semibold leading-snug tracking-[-0.025em] sm:text-2xl">
            {exampleDecision}
          </h3>

          <div className="mt-7 rounded-2xl border border-white/10 bg-black/24 p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/34">
                  Work in this stage
                </p>
                <p className="mt-1 text-base font-semibold">{work.label}</p>
              </div>
              <p className="rounded-full border border-loop/25 bg-loop/[0.06] px-3 py-1.5 text-[11px] text-loop">
                {stage.verb}
              </p>
            </div>

            <div className="mt-5">
              <p className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-white/34">
                <Bot className="h-3.5 w-3.5" />
                Agent capabilities
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {work.capabilities.map((capability) => (
                  <span
                    key={capability}
                    className="rounded-lg border border-white/10 bg-white/[0.025] px-3 py-2 text-xs text-white/64"
                  >
                    {capability}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <p className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-white/34">
                <FileCheck2 className="h-3.5 w-3.5" />
                Working artifacts
              </p>
              <div className="mt-2 grid gap-2 sm:grid-cols-3">
                {work.artifacts.map((artifact) => (
                  <span
                    key={artifact}
                    className="flex min-h-12 items-center rounded-xl border border-white/8 bg-white/[0.018] px-3 text-[11px] leading-snug text-white/54"
                  >
                    {artifact}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        <motion.aside
          key={`${stage.name}-gate`}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduce ? 0 : 0.26 }}
          className="relative p-5 sm:p-7"
        >
          <div
            aria-hidden="true"
            className="absolute right-6 top-4 text-[5rem] font-semibold leading-none tracking-[-0.16em] text-loop/12"
          >
            /
          </div>
          <p className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.15em] text-loop">
            <UserRound className="h-3.5 w-3.5" />
            Human gate
          </p>
          <h3 className="mt-3 text-xl font-semibold tracking-[-0.025em]">
            Nam owns the call.
          </h3>

          <dl className="mt-6 space-y-4">
            <BoardDefinition
              label="Human owns"
              value={stage.human}
              icon={<UserRound className="h-3.5 w-3.5" />}
            />
            <BoardDefinition
              label="Evidence required"
              value={stage.evidence}
              icon={<CircleDotDashed className="h-3.5 w-3.5" />}
            />
            <BoardDefinition
              label="Output"
              value={stage.output}
              icon={<Check className="h-3.5 w-3.5" />}
            />
          </dl>

          <div className="mt-6 border-t border-signal/18 pt-5">
            <p className="flex items-start gap-2 text-xs leading-relaxed text-white/52">
              <ArrowDownLeft className="mt-0.5 h-4 w-4 shrink-0 text-signal" />
              Reality returns to the gate. The next pass starts with stronger
              context, not a blank prompt.
            </p>
            {stage.name === "Codify" ? (
              <Link
                href="/skills"
                className="mt-4 inline-flex text-xs font-semibold text-loop transition hover:text-loop/80"
              >
                See the standards this creates →
              </Link>
            ) : null}
          </div>
        </motion.aside>
      </div>
    </div>
  );
}

function BoardDefinition({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-white/34">
        {icon}
        {label}
      </dt>
      <dd className="mt-1.5 text-xs leading-relaxed text-white/67">{value}</dd>
    </div>
  );
}
