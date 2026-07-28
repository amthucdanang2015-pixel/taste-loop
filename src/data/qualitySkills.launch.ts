import type { QualitySkill, Stack } from "./qualitySkills";

const ALL_STACKS: Stack[] = ["Any stack"];

export const LAUNCH_QUALITY_SKILLS = [
  {
    slug: "decision-memo",
    phase: "discovery",
    title: "Write the decision memo",
    oneLiner: "Turn a fuzzy debate into one explicit choice, its evidence, trade-offs, and next move.",
    gate: [
      "One decision is stated as a choice, with an owner and a decision date",
      "Observed facts, interpretations, and assumptions are visibly separated",
      "Two or three credible options are compared, including doing nothing when relevant",
      "Trade-offs, risks, reversibility, and the cost of delay are explicit",
      "The recommendation ends with the next evidence-producing action and its stop condition",
    ],
    prompt:
      "Write a decision memo before proposing more work. State the single decision, owner, and decision date. Separate observed facts from interpretations and assumptions, citing the source and freshness of each fact. Compare two or three credible options, including doing nothing when it is real, across user value, commercial value, effort, risk, reversibility, and cost of delay. Recommend one option in plain language. End with the smallest next action that can produce missing evidence, its success threshold, and the condition that would change or stop the recommendation. Do not hide uncertainty behind confident prose.",
    stacks: ALL_STACKS,
    smells: [
      "A document that describes context but never names the choice",
      "Assumptions written in the same voice as observed facts",
      "A recommendation with no next test or condition that could change it",
    ],
    verify:
      "Give the memo to someone outside the discussion; they must identify the choice, recommendation, strongest evidence, and next action without explanation.",
  },
  {
    slug: "riskiest-assumption-map",
    phase: "discovery",
    title: "Map the riskiest assumption",
    oneLiner: "Find the belief most likely to waste the loop, then test it before polishing anything else.",
    gate: [
      "The desired customer and business outcome is stated before assumptions are listed",
      "Assumptions cover desirability, viability, feasibility, and usability",
      "Each assumption is scored separately for consequence and evidence strength",
      "Exactly one current riskiest assumption is selected with a written rationale",
      "A cheap falsification test has a threshold, deadline, and resulting decision",
    ],
    prompt:
      "Map the assumptions behind this product decision. Begin with the customer outcome and business outcome. List assumptions under desirability, viability, feasibility, and usability. For each, score consequence if wrong and current evidence strength; do not use confidence as a substitute for evidence. Select exactly one riskiest assumption: the high-consequence belief with the weakest evidence that can still change the plan. Design the cheapest ethical test that could falsify it, with a deadline, numeric or observable threshold, and an explicit action for pass, fail, or ambiguous evidence. Defer lower-risk work until this test is read.",
    stacks: ALL_STACKS,
    smells: [
      "A long risk list where everything is marked high priority",
      "Technical uncertainty tested before uncertain customer demand",
      "An experiment whose result cannot change the plan",
    ],
    verify:
      "Run the proposed test as a paper walkthrough: every possible result must map to pass, fail, or gather-specific-evidence-next, with no result interpreted as automatic success.",
  },
  {
    slug: "evidence-grader",
    phase: "discovery",
    title: "Grade the evidence",
    oneLiner: "Separate what happened from what was said, inferred, or merely hoped.",
    gate: [
      "Every material claim is paired with a named source, date, and sample or context",
      "Evidence is classified as behavior, payment, observation, request, analysis, inference, or assumption",
      "Strength is graded with one consistent rubric rather than persuasive wording",
      "Contradictions, selection bias, missing evidence, and stale evidence are surfaced",
      "The decision states what the evidence supports, does not support, and cannot yet answer",
    ],
    prompt:
      "Audit the evidence behind this decision. Extract every material claim and attach its source, date, sample size or context, and collection method. Classify each item as observed behavior, payment or commitment, direct observation, stated request, quantitative analysis, inference, or assumption. Grade its strength using one rubric: directness, recency, representativeness, and reproducibility. Surface contradictory signals, selection bias, stale sources, and missing counter-evidence. Conclude with three lists: supported now, unsupported now, and unanswered. Recommend only what the available evidence earns; do not average weak signals into confidence.",
    stacks: ALL_STACKS,
    smells: [
      "Several customer quotes treated as proof of demand",
      "A dashboard number with no date, cohort, or collection method",
      "Contradictory evidence omitted from the recommendation",
    ],
    verify:
      "Choose the strongest conclusion and trace it backwards to dated source evidence; if any link is an unlabeled inference, lower the grade.",
  },
  {
    slug: "testable-prototype",
    phase: "spec",
    title: "Build the testable prototype",
    oneLiner: "Prototype only enough reality to answer one costly product question.",
    gate: [
      "The prototype names one decision and the uncertainty it is built to reduce",
      "A participant can complete one realistic end-to-end task without a guided tour",
      "Only evidence-critical behavior is real; simulated behavior is clearly identified",
      "Success, failure, and ambiguous thresholds are written before sessions begin",
      "The test plan defines participants, tasks, observations, capture, and the decision after results",
    ],
    prompt:
      "Design the smallest prototype that can answer one named product decision. State the uncertainty first, then define one realistic end-to-end task a representative participant can attempt without coaching. Make only the interactions that affect evidence behave realistically; label simulated data, manual operations, and unavailable paths instead of pretending they work. Write success, failure, and ambiguous thresholds before testing. Specify participant criteria, task script, what to observe rather than ask, how evidence will be captured, and what decision follows each threshold. Cut every screen and feature that cannot change the decision.",
    stacks: ALL_STACKS,
    smells: [
      "A polished prototype with no written decision it informs",
      "A facilitator explaining the interface during every task",
      "Success declared from positive comments without behavioral thresholds",
    ],
    verify:
      "Remove each prototype screen in turn; any screen whose removal cannot affect the named decision should stay removed.",
  },
  {
    slug: "agent-contract",
    phase: "spec",
    title: "Write the agent contract",
    oneLiner: "Give an agent one bounded outcome, the context to act, and evidence that proves it is done.",
    gate: [
      "The contract names one outcome and the user or system behavior that must change",
      "Relevant files, existing patterns, constraints, and source-of-truth documents are named",
      "In-scope and forbidden changes define a clear blast radius",
      "Verification commands and manual evidence are part of the definition of done",
      "Stop, escalate, and approval conditions are explicit before execution",
    ],
    prompt:
      "Turn this request into a bounded agent contract before execution. Name one desired outcome and the observable behavior that proves it. Provide only the relevant repository context: files, architecture, existing patterns, and source-of-truth documents. State what is in scope and explicitly forbid unrelated refactors, new dependencies, schema changes, destructive actions, invented claims, and external writes unless authorized. Define completion with exact automated checks and real interaction evidence. Define when the agent must stop, ask for approval, escalate uncertainty, or report a blocker. Resolve conflicting instructions in the contract rather than leaving the agent to choose silently.",
    stacks: ALL_STACKS,
    smells: [
      "A one-line task that silently permits repository-wide changes",
      "Done defined as code written rather than behavior verified",
      "Approval-sensitive actions discovered only after execution starts",
    ],
    verify:
      "Ask a fresh agent to restate the outcome, allowed files, forbidden moves, evidence, and stop conditions; all five must match the contract.",
  },
  {
    slug: "skill-router",
    phase: "architecture",
    title: "Route the minimum skill set",
    oneLiner: "Load only the skills the task needs, in an order that avoids conflict and context waste.",
    gate: [
      "The task is decomposed into concrete jobs before skills are selected",
      "Each selected skill has a trigger that matches one named job",
      "The smallest sufficient set is chosen and overlapping skills are resolved",
      "Dependencies and execution order are explicit",
      "Rejected candidate skills and the reason they were not loaded are recorded",
    ],
    prompt:
      "Route skills for this task using progressive disclosure. First decompose the outcome into concrete jobs. Match each job against skill trigger descriptions and select the smallest set that fully covers the work. Reject skills that are merely adjacent, duplicate another skill, conflict with project instructions, or add tools and permissions the task does not need. Order selected skills by dependency and identify which may run independently. State how conflicts are resolved and which source has authority. Record the selected set, order, and brief reasons, plus any tempting skill intentionally not loaded. Do not concatenate an entire library into context.",
    stacks: ALL_STACKS,
    smells: [
      "Every available skill loaded for every task",
      "Two overlapping skills issuing contradictory standards",
      "A tool-heavy skill selected for a task that needs only judgment",
    ],
    verify:
      "Remove each selected skill one at a time; every remaining skill must cover a distinct required job, and every removed skill must leave a named gap.",
  },
  {
    slug: "stop-conditions",
    phase: "architecture",
    title: "Define stop conditions first",
    oneLiner: "Make done, blocked, unsafe, and not-worth-continuing observable before the loop starts.",
    gate: [
      "Done is an observable outcome with required evidence, not effort spent",
      "Time, cost, turn, and scope budgets have explicit caps",
      "Unsafe, destructive, external, or authority-expanding actions require a stop or approval",
      "Repeated-failure and no-progress thresholds define when to change approach",
      "The final state requires a concise evidence, gap, and next-action report",
    ],
    prompt:
      "Define terminal conditions before starting this loop. Describe done as an observable outcome plus the evidence required to claim it. Set explicit caps for time, cost, turns, retries, and scope. List actions that must stop for approval: destructive changes, secret access, external communication, production mutation, legal or financial commitment, or any expansion of authority. Define a repeated-failure threshold and what materially different approach must follow it. Define when weak evidence means narrow or stop rather than continue producing. At termination, require a report of evidence collected, gaps remaining, changes made, and the safest next action.",
    stacks: ALL_STACKS,
    smells: [
      "Keep going until it feels finished",
      "The same failed approach retried with different wording",
      "A budget exists but has no behavior when it is reached",
    ],
    verify:
      "Present five scenarios—done, budget exhausted, repeated failure, approval required, and weak evidence—and confirm each produces one unambiguous terminal action.",
  },
  {
    slug: "fresh-context-reviewer",
    phase: "quality",
    title: "Review with fresh context",
    oneLiner: "Let a clean reviewer judge the artifact against the contract, not the builder's story.",
    gate: [
      "The reviewer receives the original contract, artifact, and evidence without the builder's persuasive summary",
      "Outcome, scope, correctness, failure paths, and preservation rules are checked separately",
      "Claims are traced to tests, screenshots, logs, or source rather than accepted by tone",
      "Findings name severity, location, user impact, and a reproducible proof",
      "The verdict is pass, pass with bounded follow-up, or fail against explicit criteria",
    ],
    prompt:
      "Review this completed work from fresh context. Read the original contract and preservation rules before the implementation summary. Inspect the actual artifact, diff, runtime behavior, and test evidence. Evaluate separately: did the user outcome change as required; did the work remain in scope; are normal and failure paths correct; were existing behaviors preserved; and does the evidence support every completion claim. Reproduce material findings and report severity, exact location, user impact, and proof. Do not reward complexity or persuasive narration. Return one verdict: pass, pass with a bounded non-blocking follow-up, or fail with the smallest corrective action.",
    stacks: ALL_STACKS,
    smells: [
      "The reviewer sees only the builder's summary",
      "Approval based on a green build without using the feature",
      "Vague findings such as 'could be cleaner' with no impact or reproduction",
    ],
    verify:
      "Seed one known contract violation before review; the reviewer must identify it with the correct impact and evidence.",
  },
  {
    slug: "documentation-sync",
    phase: "operate",
    title: "Synchronize the living documentation",
    oneLiner: "Make the shared memory describe what now exists, why it changed, and how to verify it.",
    gate: [
      "The code change is mapped to the exact architecture, content, brand, route, or QA source of truth it affects",
      "Documentation describes implemented current state rather than the original plan",
      "Commands, paths, identifiers, ownership, and compatibility constraints match the repository",
      "Superseded guidance is removed or explicitly marked historical without creating a competing document",
      "A fresh contributor can locate, change, and verify the affected system from the updated documentation",
    ],
    prompt:
      "Synchronize documentation after inspecting the implemented change. Identify which shared source-of-truth documents are affected by architecture, routes, data ownership, branding, content, design standards, compatibility, or quality requirements. Update those documents to describe the current implementation, including exact commands, paths, owners, identifiers, constraints, and verification steps. Remove contradictions and superseded current-state guidance; preserve history only where it explains a compatibility decision. Do not create a new planning file when an existing shared document owns the topic. Finish by checking every documented path and command against the repository.",
    stacks: ALL_STACKS,
    smells: [
      "Documentation still describes the proposal after the implementation changed",
      "A new readme created because the existing source of truth was not found",
      "Commands and file paths copied without checking that they exist",
    ],
    verify:
      "Give the updated entry point to a fresh contributor; they must locate the implementation, name its constraints, and choose the correct verification command without help.",
  },
  {
    slug: "30-day-product-loop",
    phase: "operate",
    title: "Run the 30-day product loop",
    oneLiner: "Hold one outcome for a month while evidence—not backlog volume—chooses each weekly move.",
    gate: [
      "One customer and business outcome is named with a current baseline",
      "The month has one primary signal and explicit guardrails",
      "Each week follows signal, decide, make, test, learn, and codify",
      "Only one important uncertainty or product change is active at a time",
      "The final review chooses continue, change, narrow, or stop and updates the operating rules",
    ],
    prompt:
      "Design a 30-day product loop around one customer outcome and one business consequence. Record the current baseline, one primary signal, and guardrails that must not worsen. Create four weekly cycles using the same sequence: inspect signal, make one decision, build the smallest evidence-producing change, test it with reality, record what was learned, and codify the correction in product rules or process. Keep only one important uncertainty or change active at a time; place everything else in a visible later list. Define weekly evidence reviews and a final continue, change, narrow, or stop decision. Measure learning and outcome movement, not tickets completed.",
    stacks: ALL_STACKS,
    smells: [
      "A monthly roadmap containing several unrelated priorities",
      "Weekly progress measured only by features shipped",
      "Lessons discussed but never added to a rule, test, or next decision",
    ],
    verify:
      "For every planned week, trace one primary signal through a decision, change, real test, recorded learning, and resulting rule; any broken chain must be redesigned.",
  },
] satisfies QualitySkill[];

export type LaunchQualitySkillSlug = (typeof LAUNCH_QUALITY_SKILLS)[number]["slug"];

export interface LaunchSkillMetadata {
  /** Agent Skills-compatible description: what the skill does and when to use it. */
  triggerDescription: string;
}

export const LAUNCH_SKILL_METADATA: Record<LaunchQualitySkillSlug, LaunchSkillMetadata> = {
  "decision-memo": {
    triggerDescription:
      "Structures a product or business choice into an evidence-backed decision memo with options, trade-offs, a recommendation, and next test. Use when a team is debating direction or needs to record why one option should be chosen.",
  },
  "riskiest-assumption-map": {
    triggerDescription:
      "Maps and prioritizes uncertain product assumptions, then designs the cheapest falsification test. Use before committing meaningful build effort or when a plan depends on several unproven beliefs.",
  },
  "evidence-grader": {
    triggerDescription:
      "Audits the strength, freshness, and limits of evidence behind a product decision. Use when research, analytics, customer requests, or inferred signals are being used to justify a recommendation.",
  },
  "testable-prototype": {
    triggerDescription:
      "Scopes a minimal prototype and test plan that answers one costly product question. Use when a prototype is needed for evidence rather than presentation or general exploration.",
  },
  "agent-contract": {
    triggerDescription:
      "Turns a coding or product request into a bounded agent contract with context, scope, verification, and stop conditions. Use before delegating non-trivial work to one or more AI agents.",
  },
  "skill-router": {
    triggerDescription:
      "Selects and orders the smallest sufficient set of agent skills for a task. Use when several installed skills could apply or when skill overlap, context size, and execution order need control.",
  },
  "stop-conditions": {
    triggerDescription:
      "Defines observable completion, budget, approval, failure, and safety terminal conditions for an agent loop. Use before autonomous, repeated, expensive, or production-adjacent work.",
  },
  "fresh-context-reviewer": {
    triggerDescription:
      "Reviews completed work from clean context against the original contract and real evidence. Use before declaring a substantial product, design, code, or launch task complete.",
  },
  "documentation-sync": {
    triggerDescription:
      "Synchronizes shared documentation with an implemented change and removes contradictory current-state guidance. Use when architecture, routes, content, brand, standards, ownership, or verification changed.",
  },
  "30-day-product-loop": {
    triggerDescription:
      "Plans a focused month of weekly evidence loops around one customer and business outcome. Use after a direction exists and the next month should optimize learning and outcome movement rather than feature volume.",
  },
};
