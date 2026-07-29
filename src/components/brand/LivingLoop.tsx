"use client";

import { useRef, type CSSProperties } from "react";
import { useInView, useReducedMotion } from "framer-motion";

const sequence = [
  "Signal",
  "Decide",
  "Make",
  "Review",
  "Test",
  "Learn",
  "Codify",
  "Repeat",
] as const;

export function LivingLoop({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.25 });
  const reduce = useReducedMotion();

  return (
    <figure
      ref={ref}
      className={`living-loop ${inView && !reduce ? "is-animated" : ""} ${className}`}
      aria-labelledby="living-loop-title living-loop-caption"
    >
      <header className="living-loop-header">
        <div>
          <p className="living-loop-kicker">
            <span aria-hidden="true" />
            Live operating loop
          </p>
          <h2 id="living-loop-title">One decision. Four connected moves.</h2>
        </div>
        <p className="living-loop-status">Human-led · evidence-closed</p>
      </header>

      <div className="living-loop-board">
        <article className="living-loop-card">
          <CardHeader number="01" label="Frame" owner="Human owned" />
          <h3>Make the decision explicit.</h3>
          <p>
            Nam sets the customer, trade-off, non-goals, and success test before
            production expands.
          </p>
          <div className="loop-mini-flow" aria-hidden="true">
            <span className="loop-signal-chip">real signal</span>
            <b>→</b>
            <span className="loop-decision-chip">
              one decision
              <small>+ success test</small>
            </span>
          </div>
        </article>

        <article className="living-loop-card">
          <CardHeader number="02" label="Fan out" owner="Agents accelerate" />
          <h3>Run useful work in parallel.</h3>
          <p>
            One shared brief coordinates research, product, design, engineering,
            and QA without losing intent.
          </p>
          <div className="loop-fanout" aria-hidden="true">
            <span className="loop-brief-chip">shared brief</span>
            <div className="loop-agent-stack">
              {["research", "product", "build", "QA"].map((label, index) => (
                <span
                  key={label}
                  className="loop-agent-node"
                  style={{ "--loop-node-index": index } as CSSProperties}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </article>

        <article className="living-loop-card living-loop-gate-card">
          <CardHeader number="03" label="Review" owner="TasteLoop gate" />
          <h3>Many outputs. One deliberate direction.</h3>
          <p>
            Nam makes the final call. A trusted long-running team adds depth
            where the outcome needs it.
          </p>
          <div className="loop-gate-diagram" aria-hidden="true">
            <div className="loop-option-stack">
              <span>option A</span>
              <span>option B</span>
              <span>option C</span>
            </div>
            <strong className="loop-gate-symbol">/</strong>
            <span className="loop-slice-chip">
              working slice
              <small>approved to test</small>
            </span>
          </div>
        </article>

        <article className="living-loop-card">
          <CardHeader number="04" label="Close" owner="Reality decides" />
          <h3>Let evidence strengthen the system.</h3>
          <p>
            Real use corrects the choice. The correction becomes context, a
            test, or a skill for the next pass.
          </p>
          <div className="loop-reality-diagram" aria-hidden="true">
            <div>
              <span>release</span>
              <b>→</b>
              <span>real use</span>
              <b>→</b>
              <span className="loop-evidence-chip">evidence</span>
            </div>
            <p>
              correction <b>→</b> system memory <b>↺</b>
            </p>
          </div>
        </article>
      </div>

      <ol className="living-loop-sequence" aria-label="TasteLoop stages">
        {sequence.map((stage, index) => (
          <li key={stage}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            {stage}
          </li>
        ))}
      </ol>

      <figcaption id="living-loop-caption">
        Agents multiply the making. Nam and the team protect intent and quality.
        Real-world evidence decides what survives, and every correction improves
        the next loop.
      </figcaption>
    </figure>
  );
}

function CardHeader({
  number,
  label,
  owner,
}: {
  number: string;
  label: string;
  owner: string;
}) {
  return (
    <div className="living-loop-card-header">
      <p>
        <span>{number}</span>
        {label}
      </p>
      <small>{owner}</small>
    </div>
  );
}
