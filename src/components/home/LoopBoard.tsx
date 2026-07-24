"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Check,
  CircleDotDashed,
  RotateCcw,
  UserRound,
} from "lucide-react";
import { LOOP_STAGES } from "@/content/site";

const handoffFlow = ["Brief", "Design", "Build", "QA", "Launch"];

const boardNodes = [
  {
    key: "signal",
    eyebrow: "Signal inbox",
    title: "What is true?",
    description:
      "Customer, product, market, and operational inputs enter as evidence—not a feature list.",
    stages: [0],
    icon: CircleDotDashed,
  },
  {
    key: "gate",
    eyebrow: "Human required",
    title: "Decision gate",
    description:
      "Nam chooses the bet, boundaries, quality bar, and what does not proceed.",
    stages: [1, 3],
    icon: UserRound,
  },
  {
    key: "make",
    eyebrow: "Agents accelerate",
    title: "Working slice",
    description:
      "Agents expand options, prototypes, code, analysis, and checks while the intent stays fixed.",
    stages: [2],
    icon: Bot,
  },
  {
    key: "reality",
    eyebrow: "Evidence returns",
    title: "Reality answers",
    description:
      "Observed use and commercial response determine whether to ship, change, narrow, or stop.",
    stages: [4, 5, 6, 7],
    icon: RotateCcw,
  },
] as const;

export function LoopBoard() {
  const [active, setActive] = useState(1);
  const reduce = useReducedMotion();
  const stage = LOOP_STAGES[active];

  return (
    <div className="overflow-hidden rounded-[2rem] border border-line bg-surface/75">
      <div className="border-b border-line p-5 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">
            <span className="h-1.5 w-1.5 rounded-full bg-loop" />
            Illustrative product loop
          </p>
          <p className="rounded-full border border-line px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-white/40">
            One decision stays visible
          </p>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-line bg-black/20 p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/35">
              Handoff mode
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              {handoffFlow.map((item, index) => (
                <span key={item} className="contents">
                  <span className="rounded-full border border-white/10 px-2.5 py-1.5 text-[11px] text-white/42">
                    {item}
                  </span>
                  {index < handoffFlow.length - 1 && (
                    <ArrowRight className="h-3 w-3 text-white/18" />
                  )}
                </span>
              ))}
            </div>
            <p className="mt-3 text-xs leading-relaxed text-white/38">
              Output moves forward. Context and ownership fade between steps.
            </p>
          </div>

          <div className="rounded-2xl border border-loop/30 bg-loop/[0.055] p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-loop">
              Loop mode
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-white/76">
              <span className="rounded-full border border-loop/25 px-2.5 py-1.5">
                One decision owner
              </span>
              <ArrowRight className="h-3 w-3 text-loop/65" />
              <span className="rounded-full border border-loop/25 px-2.5 py-1.5">
                Working evidence
              </span>
              <ArrowLeft className="h-3 w-3 text-signal/75" />
              <span className="rounded-full border border-signal/25 px-2.5 py-1.5">
                Reality corrects
              </span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-white/58">
              Roles remain. Agents accelerate the work. Judgment and evidence
              decide the next move.
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-7">
        <div className="grid gap-3 lg:grid-cols-4">
          {boardNodes.map((node, index) => {
            const Icon = node.icon;
            const selected = (node.stages as readonly number[]).includes(active);
            const isGate = node.key === "gate";

            return (
              <div
                key={node.key}
                className={`relative flex min-h-52 flex-col rounded-2xl border p-4 transition-colors ${
                  selected
                    ? "border-loop/45 bg-loop/[0.07]"
                    : "border-line bg-black/20"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <p
                    className={`font-mono text-[9px] uppercase tracking-[0.15em] ${
                      selected ? "text-loop" : "text-white/34"
                    }`}
                  >
                    {node.eyebrow}
                  </p>
                  <Icon
                    aria-hidden="true"
                    className={`h-4 w-4 ${
                      selected ? "text-loop" : "text-white/28"
                    }`}
                  />
                </div>

                {isGate && (
                  <div
                    aria-hidden="true"
                    className="mt-4 text-6xl font-semibold leading-none tracking-[-0.12em] text-loop"
                  >
                    /
                  </div>
                )}
                <h3 className={`${isGate ? "mt-3" : "mt-8"} text-lg font-semibold`}>
                  {node.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-white/52">
                  {node.description}
                </p>

                <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
                  {node.stages.map((stageIndex) => (
                    <button
                      key={LOOP_STAGES[stageIndex].name}
                      type="button"
                      onClick={() => setActive(stageIndex)}
                      aria-pressed={active === stageIndex}
                      className={`min-h-9 rounded-full border px-2.5 py-1.5 text-[11px] transition ${
                        active === stageIndex
                          ? "border-loop/45 bg-loop text-ink"
                          : "border-white/10 text-white/48 hover:border-white/25 hover:text-white"
                      }`}
                    >
                      {LOOP_STAGES[stageIndex].name}
                    </button>
                  ))}
                </div>

                {index < boardNodes.length - 1 && (
                  <ArrowRight className="absolute -right-2.5 top-1/2 z-10 hidden h-5 w-5 -translate-y-1/2 rounded-full bg-surface p-1 text-white/25 lg:block" />
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-3 flex flex-col gap-3 rounded-2xl border border-signal/20 bg-signal/[0.045] p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 text-xs text-white/62">
            <RotateCcw className="h-4 w-4 shrink-0 text-signal" />
            Feedback returns to the decision gate. Useful corrections become
            standards, tests, and stronger context for the next loop.
          </p>
          <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.14em] text-signal">
            Reality → next decision
          </span>
        </div>

        <div
          className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-8"
          aria-label="TasteLoop operating stages"
        >
          {LOOP_STAGES.map((item, index) => (
            <button
              key={item.name}
              type="button"
              onClick={() => setActive(index)}
              aria-pressed={active === index}
              className={`min-h-11 rounded-xl border px-3 py-2 text-left transition ${
                active === index
                  ? "border-loop/40 bg-loop text-ink"
                  : "border-line bg-white/[0.018] text-white/55 hover:border-white/25 hover:text-white"
              }`}
            >
              <span className="block font-mono text-[9px] opacity-55">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="mt-0.5 block text-xs font-medium">{item.name}</span>
            </button>
          ))}
        </div>

        <motion.div
          key={stage.name}
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduce ? 0 : 0.32,
            ease: [0.22, 1, 0.36, 1],
          }}
          aria-live="polite"
          className="mt-3 grid gap-6 rounded-2xl border border-line bg-black/25 p-5 sm:p-6 lg:grid-cols-[0.68fr_1.32fr]"
        >
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-signal">
              Stage {String(active + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-[-0.035em]">
              {stage.name}
            </h3>
            <p className="mt-1 text-sm text-white/52">{stage.verb}</p>
          </div>
          <dl className="grid gap-3 sm:grid-cols-2">
            <BoardDefinition
              label="Human owns"
              value={stage.human}
              icon={<UserRound className="h-3.5 w-3.5" />}
            />
            <BoardDefinition
              label="Agents accelerate"
              value={stage.agent}
              icon={<Bot className="h-3.5 w-3.5" />}
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
        </motion.div>
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
    <div className="rounded-xl border border-white/8 bg-white/[0.018] p-3.5">
      <dt className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-white/35">
        {icon}
        {label}
      </dt>
      <dd className="mt-2 text-xs leading-relaxed text-white/67">{value}</dd>
    </div>
  );
}
