/**
 * Topic discovery for the Skills product.
 *
 * A topic is an editorial navigation node, not an installable Agent Skill.
 * `skillSlugs` only points to canonical, authored skills that can help with the
 * topic. Empty topic shells should never be presented as published skills.
 */

export const CANONICAL_SKILL_SLUGS = [
  "problem-brief",
  "competitive-teardown",
  "spec-cut",
  "prompt-spec",
  "every-state-designed",
  "motion-system",
  "first-run",
  "copy-voice",
  "layout-composition",
  "boring-architecture",
  "data-model-first",
  "pure-core-logic",
  "dependency-diet",
  "frontend-taste",
  "performance-budget",
  "accessibility-floor",
  "component-api-design",
  "responsive-behavior",
  "honest-api",
  "auth-authz",
  "payments-that-balance",
  "jobs-and-webhooks",
  "unit-test-the-logic",
  "e2e-money-path",
  "review-bars",
  "ai-code-review",
  "launch-floor",
  "analytics-before-opinions",
  "env-config-parity",
  "postmortem-to-rule",
  "decision-memo",
  "riskiest-assumption-map",
  "evidence-grader",
  "testable-prototype",
  "agent-contract",
  "skill-router",
  "stop-conditions",
  "fresh-context-reviewer",
  "documentation-sync",
  "30-day-product-loop",
] as const;

export type CanonicalSkillSlug = (typeof CANONICAL_SKILL_SLUGS)[number];

export const SKILLS_CATALOG_PHASE_IDS = [
  "decide",
  "validate",
  "position",
  "scope",
  "experience-design",
  "visual-motion",
  "frontend",
  "backend-data",
  "agent-workflow",
  "quality-security",
  "launch",
  "seo-ai-discovery",
  "gtm-sales",
  "learn-retain-operate",
] as const;

export type SkillsCatalogPhaseId = (typeof SKILLS_CATALOG_PHASE_IDS)[number];

export interface SkillsCatalogPhase {
  id: SkillsCatalogPhaseId;
  title: string;
  question: string;
  description: string;
}

export const SKILLS_CATALOG_PHASES = [
  {
    id: "decide",
    title: "Decide",
    question: "What should we pursue, and why now?",
    description: "Frame the problem, expose assumptions, and make an evidence-bounded choice.",
  },
  {
    id: "validate",
    title: "Validate",
    question: "What is the cheapest honest test?",
    description: "Reduce the most consequential uncertainty before increasing build commitment.",
  },
  {
    id: "position",
    title: "Position",
    question: "Why will the right customer choose this?",
    description: "Clarify the market, promise, message, offer, and commercial distinction.",
  },
  {
    id: "scope",
    title: "Scope",
    question: "What is the smallest complete outcome?",
    description: "Turn direction into a bounded slice, explicit behavior, and a shared definition of done.",
  },
  {
    id: "experience-design",
    title: "Experience design",
    question: "Can a person understand and complete the job?",
    description: "Design the flow, hierarchy, states, words, accessibility, and responsive behavior.",
  },
  {
    id: "visual-motion",
    title: "Visual and motion",
    question: "What makes the experience clear and recognizably itself?",
    description: "Build a coherent visual language and use motion to explain continuity and feedback.",
  },
  {
    id: "frontend",
    title: "Frontend",
    question: "Does the interface behave correctly and feel deliberate?",
    description: "Implement product behavior with strong component boundaries, performance, and browser quality.",
  },
  {
    id: "backend-data",
    title: "Backend and data",
    question: "Can the system keep its promises safely?",
    description: "Protect data and money with honest contracts, explicit ownership, and failure-aware infrastructure.",
  },
  {
    id: "agent-workflow",
    title: "Agent workflow",
    question: "How should agents make progress without losing control?",
    description: "Route skills, context, authority, memory, verification, and stop conditions deliberately.",
  },
  {
    id: "quality-security",
    title: "Quality and security",
    question: "What can break, leak, regress, or mislead?",
    description: "Test the important paths, challenge assumptions, and hold a production-grade release gate.",
  },
  {
    id: "launch",
    title: "Launch",
    question: "Can this meet reality without theater?",
    description: "Prepare environments, rollout, evidence, observability, rollback, and a credible public moment.",
  },
  {
    id: "seo-ai-discovery",
    title: "SEO and AI discovery",
    question: "Can the right person or agent find and trust this?",
    description: "Connect useful subject coverage with sound technical discovery and measurable search behavior.",
  },
  {
    id: "gtm-sales",
    title: "GTM and sales",
    question: "How will attention become a qualified customer?",
    description: "Choose channels, tell the product story, qualify fit, and create a repeatable commercial path.",
  },
  {
    id: "learn-retain-operate",
    title: "Learn, retain, and operate",
    question: "How does real use make the product and system stronger?",
    description: "Turn behavior, support, incidents, and retention signals into the next focused loop.",
  },
] as const satisfies readonly SkillsCatalogPhase[];

export interface SkillsCatalogTopic {
  kind: "topic";
  slug: string;
  title: string;
  question: string;
  phase: SkillsCatalogPhaseId;
  skillSlugs: readonly CanonicalSkillSlug[];
}

type TopicSeed = readonly [
  slug: string,
  title: string,
  question: string,
  skillSlugs: readonly CanonicalSkillSlug[],
];

function topicsFor(
  phase: SkillsCatalogPhaseId,
  topics: readonly TopicSeed[],
): SkillsCatalogTopic[] {
  return topics.map(([slug, title, question, skillSlugs]) => ({
    kind: "topic",
    slug,
    title,
    question,
    phase,
    skillSlugs,
  }));
}

export const SKILLS_CATALOG_TOPICS: readonly SkillsCatalogTopic[] = [
  ...topicsFor("decide", [
    [
      "problem-framing",
      "Problem framing",
      "Whose problem are we solving, in what moment?",
      ["problem-brief"],
    ],
    [
      "customer-interviews",
      "Customer interviews",
      "What can we learn without leading the customer?",
      ["problem-brief", "evidence-grader"],
    ],
    [
      "jobs-to-be-done",
      "Jobs to be done",
      "What progress is the customer trying to make?",
      ["problem-brief"],
    ],
    [
      "ideal-customer-profile",
      "Ideal customer profile",
      "Who has the sharpest need and ability to act?",
      ["problem-brief", "competitive-teardown"],
    ],
    [
      "competitor-teardown",
      "Competitor teardown",
      "What bar already exists, and where should we differ?",
      ["competitive-teardown"],
    ],
    [
      "opportunity-sizing",
      "Opportunity sizing",
      "Is this opportunity large and reachable enough now?",
      ["evidence-grader", "decision-memo"],
    ],
    [
      "assumption-mapping",
      "Assumption mapping",
      "Which beliefs does this direction depend on?",
      ["riskiest-assumption-map"],
    ],
    [
      "riskiest-assumption",
      "Riskiest assumption",
      "Which uncertain belief could waste the most effort?",
      ["riskiest-assumption-map"],
    ],
    [
      "product-decision-memo",
      "Product decision memo",
      "What are we choosing, and what evidence earns it?",
      ["decision-memo", "evidence-grader"],
    ],
    [
      "kill-criterion",
      "Kill criterion",
      "What evidence would make us stop or narrow?",
      ["problem-brief", "stop-conditions"],
    ],
  ]),
  ...topicsFor("validate", [
    [
      "prototype-experiment",
      "Prototype experiment",
      "What must the prototype prove before more build?",
      ["testable-prototype", "riskiest-assumption-map"],
    ],
    [
      "concierge-test",
      "Concierge test",
      "Can manual delivery prove value before automation?",
      ["testable-prototype", "evidence-grader"],
    ],
    [
      "fake-door-test",
      "Fake-door test",
      "Will people take the first real step toward demand?",
      ["testable-prototype", "analytics-before-opinions"],
    ],
    [
      "demand-smoke-test",
      "Demand smoke test",
      "Does the promise create observable intent?",
      ["testable-prototype", "evidence-grader"],
    ],
    [
      "usability-test",
      "Usability test",
      "Can a representative person complete the task unaided?",
      ["testable-prototype", "every-state-designed"],
    ],
    [
      "commitment-test",
      "Commitment test",
      "Will interest become time, data, money, or reputation?",
      ["evidence-grader", "riskiest-assumption-map"],
    ],
    [
      "pricing-test",
      "Pricing test",
      "What willingness-to-pay evidence can change the offer?",
      ["testable-prototype", "evidence-grader"],
    ],
    [
      "interview-synthesis",
      "Interview synthesis",
      "Which patterns survive across interviews and contradictions?",
      ["evidence-grader"],
    ],
    [
      "evidence-grading",
      "Evidence grading",
      "How strong, current, and direct is each signal?",
      ["evidence-grader"],
    ],
    [
      "experiment-readout",
      "Experiment readout",
      "What did the test support, reject, or leave unanswered?",
      ["evidence-grader", "decision-memo"],
    ],
  ]),
  ...topicsFor("position", [
    [
      "value-proposition",
      "Value proposition",
      "What meaningful change does the customer receive?",
      ["problem-brief", "copy-voice"],
    ],
    [
      "positioning",
      "Positioning",
      "What should the right customer understand us against?",
      ["competitive-teardown", "decision-memo"],
    ],
    [
      "category-framing",
      "Category framing",
      "Which familiar frame helps without hiding the difference?",
      ["competitive-teardown", "copy-voice"],
    ],
    [
      "differentiation",
      "Differentiation",
      "Which advantage matters and can be demonstrated?",
      ["competitive-teardown", "evidence-grader"],
    ],
    [
      "messaging-hierarchy",
      "Messaging hierarchy",
      "What must be understood first, second, and last?",
      ["copy-voice", "layout-composition"],
    ],
    [
      "core-narrative",
      "Core narrative",
      "What tension, proof, and resolution make the story credible?",
      ["problem-brief", "copy-voice"],
    ],
    [
      "landing-page-story",
      "Landing-page story",
      "Does proof earn the next claim and action?",
      ["copy-voice", "layout-composition", "competitive-teardown"],
    ],
    [
      "objection-handling",
      "Objection handling",
      "Which real concern prevents the next commitment?",
      ["evidence-grader", "copy-voice"],
    ],
    [
      "pricing-research",
      "Pricing research",
      "Which price evidence reflects value rather than preference?",
      ["evidence-grader", "decision-memo"],
    ],
    [
      "offer-packaging",
      "Offer packaging",
      "What bounded outcome makes the offer easy to choose?",
      ["spec-cut", "decision-memo"],
    ],
  ]),
  ...topicsFor("scope", [
    [
      "outcome-spec",
      "Outcome specification",
      "What observable behavior must be different when done?",
      ["problem-brief", "prompt-spec"],
    ],
    [
      "job-stories",
      "Job stories",
      "What situation, motivation, and outcome define the job?",
      ["problem-brief", "prompt-spec"],
    ],
    [
      "acceptance-criteria",
      "Acceptance criteria",
      "Can every requirement be proven pass or fail?",
      ["prompt-spec", "spec-cut"],
    ],
    [
      "shippable-slice",
      "Shippable slice",
      "What is the thinnest complete customer outcome?",
      ["spec-cut"],
    ],
    [
      "explicit-non-goals",
      "Explicit non-goals",
      "What must remain outside this loop?",
      ["problem-brief", "agent-contract"],
    ],
    [
      "edge-case-inventory",
      "Edge-case inventory",
      "Which boundary or failure conditions alter behavior?",
      ["prompt-spec", "pure-core-logic"],
    ],
    [
      "state-machine",
      "State machine",
      "Which states and transitions are legal?",
      ["pure-core-logic", "data-model-first"],
    ],
    [
      "evidence-roadmap",
      "Evidence roadmap",
      "Which uncertainty should each next slice reduce?",
      ["decision-memo", "riskiest-assumption-map", "spec-cut"],
    ],
    [
      "architecture-decision",
      "Architecture decision",
      "Which trade-off is worth recording before implementation?",
      ["boring-architecture", "decision-memo"],
    ],
    [
      "definition-of-done",
      "Definition of done",
      "What code, behavior, and evidence make completion honest?",
      ["agent-contract", "review-bars"],
    ],
  ]),
  ...topicsFor("experience-design", [
    [
      "information-architecture",
      "Information architecture",
      "Can people predict where information and actions live?",
      ["layout-composition", "first-run"],
    ],
    [
      "user-flow",
      "User flow",
      "Can the user reach the outcome without a dead end?",
      ["every-state-designed", "first-run"],
    ],
    [
      "decision-wireframe",
      "Decision wireframe",
      "Does the structure test the hierarchy before visual polish?",
      ["layout-composition", "testable-prototype"],
    ],
    [
      "layout-hierarchy",
      "Layout hierarchy",
      "What should the eye and mind process first?",
      ["layout-composition"],
    ],
    [
      "interface-states",
      "Interface states",
      "Are empty, loading, error, success, and after-success designed?",
      ["every-state-designed"],
    ],
    [
      "onboarding-activation",
      "Onboarding and activation",
      "How quickly can a new user experience real value?",
      ["first-run", "analytics-before-opinions"],
    ],
    [
      "interface-copy",
      "Interface copy",
      "Does every word explain the action or outcome?",
      ["copy-voice"],
    ],
    [
      "design-system-foundation",
      "Design-system foundation",
      "Which tokens and primitives keep choices coherent?",
      ["frontend-taste", "component-api-design"],
    ],
    [
      "accessible-experience",
      "Accessible experience",
      "Can different people perceive and operate the full flow?",
      ["accessibility-floor", "every-state-designed"],
    ],
    [
      "responsive-experience",
      "Responsive experience",
      "What should reflow, resize, or change across containers?",
      ["responsive-behavior", "layout-composition"],
    ],
  ]),
  ...topicsFor("visual-motion", [
    [
      "visual-direction",
      "Visual direction",
      "Which visual choices belong uniquely to this subject?",
      ["frontend-taste", "competitive-teardown"],
    ],
    [
      "typography-system",
      "Typography system",
      "How will type carry hierarchy and character?",
      ["layout-composition", "frontend-taste"],
    ],
    [
      "color-tokens",
      "Color tokens",
      "Where does color communicate meaning rather than decoration?",
      ["frontend-taste", "accessibility-floor"],
    ],
    [
      "iconography",
      "Iconography",
      "Which actions need symbols, labels, or both?",
      ["frontend-taste", "accessibility-floor"],
    ],
    [
      "media-art-direction",
      "Media art direction",
      "What image or artifact can carry the product’s proof?",
      ["competitive-teardown", "frontend-taste"],
    ],
    [
      "motion-language",
      "Motion language",
      "Which motion explains orientation, feedback, or continuity?",
      ["motion-system"],
    ],
    [
      "shared-element-transition",
      "Shared-element transition",
      "Would spatial continuity make this state change easier to follow?",
      ["motion-system", "responsive-behavior"],
    ],
    [
      "microinteraction-feedback",
      "Microinteraction feedback",
      "How does each action respond within the first moment?",
      ["motion-system", "frontend-taste"],
    ],
    [
      "data-visualization",
      "Data visualization",
      "Which visual form makes the decision easier?",
      ["layout-composition", "accessibility-floor"],
    ],
    [
      "design-critique",
      "Design critique",
      "Which concrete bar is unmet, and what should change?",
      ["review-bars", "fresh-context-reviewer"],
    ],
  ]),
  ...topicsFor("frontend", [
    [
      "component-api",
      "Component API",
      "Does the component interface express the product domain?",
      ["component-api-design"],
    ],
    [
      "react-composition",
      "React composition",
      "Which behavior should compose instead of becoming another flag?",
      ["component-api-design", "boring-architecture"],
    ],
    [
      "client-server-boundary",
      "Client and server boundary",
      "Where should state, data, and side effects live?",
      ["boring-architecture", "component-api-design"],
    ],
    [
      "forms-validation",
      "Forms and validation",
      "Can the user prevent, understand, and recover from invalid input?",
      ["every-state-designed", "accessibility-floor", "honest-api"],
    ],
    [
      "optimistic-pending-ui",
      "Optimistic and pending UI",
      "What immediate feedback is honest while work completes?",
      ["every-state-designed", "honest-api"],
    ],
    [
      "data-fetching-cache",
      "Data fetching and cache",
      "Which data may be stale, retried, or shared?",
      ["performance-budget", "honest-api"],
    ],
    [
      "frontend-performance",
      "Frontend performance",
      "Which explicit budget protects the user’s wait?",
      ["performance-budget"],
    ],
    [
      "image-font-delivery",
      "Image and font delivery",
      "Can media load sharply without layout shift or excess bytes?",
      ["performance-budget", "frontend-taste"],
    ],
    [
      "browser-compatibility",
      "Browser compatibility",
      "Does the complete behavior survive representative browsers and widths?",
      ["responsive-behavior", "accessibility-floor"],
    ],
    [
      "frontend-review",
      "Frontend review",
      "Does the implementation meet taste, behavior, and scope bars?",
      ["frontend-taste", "ai-code-review", "review-bars"],
    ],
  ]),
  ...topicsFor("backend-data", [
    [
      "data-model",
      "Data model",
      "Which entities, ownership, and invariants must the schema enforce?",
      ["data-model-first"],
    ],
    [
      "api-contract",
      "API contract",
      "Does every response tell the truth with a stable shape?",
      ["honest-api"],
    ],
    [
      "authentication-authorization",
      "Authentication and authorization",
      "Who may perform this action on which resource?",
      ["auth-authz"],
    ],
    [
      "payments-ledger",
      "Payments and ledger",
      "Can every amount and state transition reconcile exactly?",
      ["payments-that-balance"],
    ],
    [
      "idempotent-writes",
      "Idempotent writes",
      "What happens when the same request arrives twice?",
      ["honest-api", "jobs-and-webhooks"],
    ],
    [
      "queues-background-jobs",
      "Queues and background jobs",
      "Can work retry, fail visibly, and resume safely?",
      ["jobs-and-webhooks"],
    ],
    [
      "webhook-processing",
      "Webhook processing",
      "Can the event be verified, replayed, and processed once?",
      ["jobs-and-webhooks", "payments-that-balance"],
    ],
    [
      "database-migrations",
      "Database migrations",
      "Can this change roll forward and back with production-shaped data?",
      ["data-model-first", "env-config-parity"],
    ],
    [
      "abuse-rate-limits",
      "Abuse and rate limits",
      "Which misuse or traffic shape must the boundary contain?",
      ["honest-api", "auth-authz"],
    ],
    [
      "secrets-configuration",
      "Secrets and configuration",
      "Can configuration fail safely without exposing credentials?",
      ["env-config-parity", "auth-authz"],
    ],
  ]),
  ...topicsFor("agent-workflow", [
    [
      "agent-contracting",
      "Agent contracting",
      "What outcome, context, scope, evidence, and authority does the agent have?",
      ["agent-contract"],
    ],
    [
      "agent-prompt-spec",
      "Agent prompt specification",
      "Is this one testable task with the context to act?",
      ["prompt-spec", "agent-contract"],
    ],
    [
      "context-packaging",
      "Context packaging",
      "What is the minimum context needed to make the right change?",
      ["agent-contract", "prompt-spec"],
    ],
    [
      "skill-selection",
      "Skill selection",
      "Which smallest skill set covers the required jobs?",
      ["skill-router"],
    ],
    [
      "subagent-orchestration",
      "Subagent orchestration",
      "Which bounded work can proceed independently before integration?",
      ["skill-router", "agent-contract"],
    ],
    [
      "worktree-isolation",
      "Worktree isolation",
      "What isolation keeps parallel work from expanding its blast radius?",
      ["boring-architecture", "stop-conditions"],
    ],
    [
      "agent-stop-conditions",
      "Agent stop conditions",
      "When is the loop done, blocked, unsafe, or not worth continuing?",
      ["stop-conditions"],
    ],
    [
      "agent-memory-handoff",
      "Agent memory and handoff",
      "Which decisions and unresolved facts must survive the next context?",
      ["decision-memo", "documentation-sync"],
    ],
    [
      "fresh-context-review",
      "Fresh-context review",
      "Does a clean reviewer reach the same completion verdict?",
      ["fresh-context-reviewer"],
    ],
    [
      "agent-documentation-sync",
      "Agent documentation sync",
      "Did the shared memory change with the implemented system?",
      ["documentation-sync"],
    ],
  ]),
  ...topicsFor("quality-security", [
    [
      "pure-core-unit-tests",
      "Pure-core unit tests",
      "Do tests protect the rules and expensive boundaries?",
      ["unit-test-the-logic", "pure-core-logic"],
    ],
    [
      "integration-tests",
      "Integration tests",
      "Do real boundaries agree on contracts and failure behavior?",
      ["unit-test-the-logic", "honest-api"],
    ],
    [
      "end-to-end-money-path",
      "End-to-end money path",
      "Can a clean user complete the core value path?",
      ["e2e-money-path"],
    ],
    [
      "browser-ui-pass",
      "Browser UI pass",
      "Are interaction, console, network, and layout clean in reality?",
      ["e2e-money-path", "responsive-behavior"],
    ],
    [
      "accessibility-audit",
      "Accessibility audit",
      "Can keyboard, assistive technology, and reduced motion use the flow?",
      ["accessibility-floor"],
    ],
    [
      "performance-audit",
      "Performance audit",
      "Does the production build meet its written budgets?",
      ["performance-budget"],
    ],
    [
      "threat-model",
      "Threat model",
      "Which assets, actors, boundaries, and abuse paths matter?",
      ["auth-authz", "ai-code-review"],
    ],
    [
      "dependency-license-audit",
      "Dependency and license audit",
      "Is every dependency maintained, necessary, licensed, and removable?",
      ["dependency-diet", "ai-code-review"],
    ],
    [
      "ai-code-review",
      "AI-code review",
      "Which plausible-looking change is unverified or out of scope?",
      ["ai-code-review", "fresh-context-reviewer"],
    ],
    [
      "release-quality-gate",
      "Release quality gate",
      "What evidence must pass before this reaches users?",
      ["review-bars", "launch-floor", "fresh-context-reviewer"],
    ],
  ]),
  ...topicsFor("launch", [
    [
      "production-floor",
      "Production floor",
      "Are the unglamorous launch requirements complete?",
      ["launch-floor"],
    ],
    [
      "environment-parity",
      "Environment parity",
      "Does pre-production behave like production where it matters?",
      ["env-config-parity"],
    ],
    [
      "continuous-delivery",
      "Continuous delivery",
      "Which checks and approvals protect every deployment?",
      ["launch-floor", "stop-conditions"],
    ],
    [
      "migration-rehearsal",
      "Migration rehearsal",
      "Can data and infrastructure change without surprise or loss?",
      ["data-model-first", "env-config-parity"],
    ],
    [
      "rollback-plan",
      "Rollback plan",
      "Can the release be reversed quickly and safely?",
      ["launch-floor", "stop-conditions"],
    ],
    [
      "feature-flags",
      "Feature flags",
      "Who owns each flag, default, and removal date?",
      ["env-config-parity", "boring-architecture"],
    ],
    [
      "launch-brief",
      "Launch brief",
      "What outcome, audience, proof, and action define this launch?",
      ["decision-memo", "launch-floor"],
    ],
    [
      "beta-cohort",
      "Beta cohort",
      "Which users and feedback can change the release?",
      ["testable-prototype", "evidence-grader"],
    ],
    [
      "launch-assets-demo",
      "Launch assets and demo",
      "Which artifact demonstrates the value without inflated claims?",
      ["copy-voice", "motion-system", "evidence-grader"],
    ],
    [
      "monitoring-alerts",
      "Monitoring and alerts",
      "Will a human learn quickly when the core path fails?",
      ["analytics-before-opinions", "postmortem-to-rule"],
    ],
  ]),
  ...topicsFor("seo-ai-discovery", [
    [
      "search-intent",
      "Search intent",
      "What decision or task is the searcher trying to complete?",
      ["problem-brief", "evidence-grader"],
    ],
    [
      "keyword-research",
      "Keyword research",
      "Which queries show meaningful demand and fit?",
      ["evidence-grader", "competitive-teardown"],
    ],
    [
      "topic-clusters",
      "Topic clusters",
      "Which useful subject relationships deserve connected coverage?",
      ["boring-architecture", "copy-voice"],
    ],
    [
      "crawl-index-health",
      "Crawl and index health",
      "Can crawlers find the canonical useful pages?",
      ["launch-floor", "env-config-parity"],
    ],
    [
      "metadata-canonicals-schema",
      "Metadata, canonicals, and schema",
      "Does each page describe itself without duplication or false markup?",
      ["launch-floor", "copy-voice"],
    ],
    [
      "internal-linking",
      "Internal linking",
      "Can users and crawlers move through real subject relationships?",
      ["layout-composition", "boring-architecture"],
    ],
    [
      "core-web-vitals",
      "Core Web Vitals",
      "Does search traffic arrive to a fast, stable experience?",
      ["performance-budget"],
    ],
    [
      "programmatic-seo",
      "Programmatic SEO",
      "Can every generated page remain uniquely useful and accurate?",
      ["boring-architecture", "data-model-first", "copy-voice"],
    ],
    [
      "editorial-quality",
      "Editorial quality",
      "Does the page provide sourced experience rather than keyword filler?",
      ["copy-voice", "evidence-grader"],
    ],
    [
      "ai-search-visibility",
      "AI-search visibility",
      "Can an answer engine extract accurate, attributable product knowledge?",
      ["evidence-grader", "analytics-before-opinions"],
    ],
  ]),
  ...topicsFor("gtm-sales", [
    [
      "channel-strategy",
      "Channel strategy",
      "Where can the right buyer be reached with credible proof?",
      ["decision-memo", "evidence-grader"],
    ],
    [
      "founder-led-content",
      "Founder-led content",
      "What useful artifact can only the founder show or explain?",
      ["copy-voice", "evidence-grader"],
    ],
    [
      "community-growth",
      "Community growth",
      "How can we contribute before asking for attention?",
      ["problem-brief", "evidence-grader"],
    ],
    [
      "partnerships",
      "Partnerships",
      "Which shared customer outcome makes collaboration rational?",
      ["decision-memo", "problem-brief"],
    ],
    [
      "launch-tiers-pr",
      "Launch tiers and PR",
      "How much launch effort does this evidence and moment earn?",
      ["launch-floor", "decision-memo"],
    ],
    [
      "product-demo-script",
      "Product demo script",
      "Which short flow makes the result and proof visible?",
      ["testable-prototype", "copy-voice"],
    ],
    [
      "lead-qualification",
      "Lead qualification",
      "Does this customer have the problem, urgency, and fit to act?",
      ["problem-brief", "evidence-grader"],
    ],
    [
      "proposal-scoping",
      "Proposal and scoping",
      "Can the engagement promise one bounded outcome honestly?",
      ["decision-memo", "spec-cut"],
    ],
    [
      "referral-share-loop",
      "Referral and share loop",
      "What successful product moment is naturally worth sharing?",
      ["first-run", "analytics-before-opinions"],
    ],
    [
      "case-study-proof",
      "Case-study proof",
      "Which before, intervention, and result can be verified?",
      ["evidence-grader", "copy-voice"],
    ],
  ]),
  ...topicsFor("learn-retain-operate", [
    [
      "event-instrumentation",
      "Event instrumentation",
      "Which events answer a real product decision?",
      ["analytics-before-opinions"],
    ],
    [
      "activation-funnel",
      "Activation funnel",
      "Where does a new user fail to reach first value?",
      ["first-run", "analytics-before-opinions"],
    ],
    [
      "experiment-backlog",
      "Experiment backlog",
      "Which uncertainty deserves the next evidence loop?",
      ["riskiest-assumption-map", "decision-memo"],
    ],
    [
      "onboarding-milestones",
      "Onboarding milestones",
      "Which observable steps predict durable value?",
      ["first-run", "analytics-before-opinions"],
    ],
    [
      "retention-churn",
      "Retention and churn",
      "Why do people continue, lapse, or leave?",
      ["evidence-grader", "analytics-before-opinions"],
    ],
    [
      "customer-feedback-synthesis",
      "Customer-feedback synthesis",
      "Which repeated signal should change the product?",
      ["evidence-grader", "postmortem-to-rule"],
    ],
    [
      "support-triage",
      "Support triage",
      "Which issue is urgent, repeated, and systemically preventable?",
      ["postmortem-to-rule", "stop-conditions"],
    ],
    [
      "incident-response",
      "Incident response",
      "How do we contain harm, communicate, and restore safely?",
      ["postmortem-to-rule", "stop-conditions"],
    ],
    [
      "postmortem-rule",
      "Postmortem to rule",
      "Which rule, test, or removed footgun prevents recurrence?",
      ["postmortem-to-rule", "documentation-sync"],
    ],
    [
      "thirty-day-product-loop",
      "30-day product loop",
      "What single outcome should evidence move this month?",
      ["30-day-product-loop", "decision-memo"],
    ],
  ]),
];

export interface SkillsCatalogPackStep {
  skillSlug: CanonicalSkillSlug;
  why: string;
}

export interface SkillsCatalogPack {
  kind: "pack";
  slug: string;
  title: string;
  promise: string;
  steps: readonly SkillsCatalogPackStep[];
}

export const SKILLS_CATALOG_PACKS = [
  {
    kind: "pack",
    slug: "validate-idea-this-week",
    title: "Validate an idea this week",
    promise: "Move from a broad idea to one evidence-backed next decision.",
    steps: [
      { skillSlug: "problem-brief", why: "Name the customer, problem, outcome, and non-goals." },
      { skillSlug: "riskiest-assumption-map", why: "Choose the belief most likely to waste the week." },
      { skillSlug: "testable-prototype", why: "Build only the reality needed to test that belief." },
      { skillSlug: "evidence-grader", why: "Separate observed behavior from enthusiasm and inference." },
      { skillSlug: "decision-memo", why: "Choose continue, change, narrow, or stop from the evidence." },
    ],
  },
  {
    kind: "pack",
    slug: "agent-built-launch",
    title: "Agent-built product launch",
    promise: "Give fast agent output a bounded contract, real review, and production floor.",
    steps: [
      { skillSlug: "agent-contract", why: "Define the outcome, blast radius, evidence, and authority." },
      { skillSlug: "prompt-spec", why: "Turn each implementation move into a testable task." },
      { skillSlug: "skill-router", why: "Load the smallest sufficient skill set in dependency order." },
      { skillSlug: "ai-code-review", why: "Challenge plausible code, invented APIs, and scope drift." },
      { skillSlug: "fresh-context-reviewer", why: "Judge the result without the builder’s narrative." },
      { skillSlug: "env-config-parity", why: "Make runtime configuration fail loudly and consistently." },
      { skillSlug: "launch-floor", why: "Verify the complete production experience before release." },
    ],
  },
  {
    kind: "pack",
    slug: "production-backend",
    title: "Production-ready backend",
    promise: "Protect data, identity, asynchronous work, and failure paths before traffic.",
    steps: [
      { skillSlug: "data-model-first", why: "Put ownership and invariants in the schema." },
      { skillSlug: "honest-api", why: "Make every boundary typed, truthful, and retry-aware." },
      { skillSlug: "auth-authz", why: "Enforce identity and resource authorization server-side." },
      { skillSlug: "jobs-and-webhooks", why: "Make asynchronous work idempotent and observable." },
      { skillSlug: "env-config-parity", why: "Validate server configuration before requests arrive." },
      { skillSlug: "fresh-context-reviewer", why: "Recheck contracts, failures, and preservation from clean context." },
    ],
  },
  {
    kind: "pack",
    slug: "product-polish",
    title: "Product polish pass",
    promise: "Turn a working interface into a clear, resilient, and deliberate product surface.",
    steps: [
      { skillSlug: "every-state-designed", why: "Complete empty, loading, error, and after-success behavior." },
      { skillSlug: "layout-composition", why: "Make hierarchy and spacing carry meaning." },
      { skillSlug: "copy-voice", why: "Make actions and failures specific and human." },
      { skillSlug: "responsive-behavior", why: "Design the breakpoints and the widths between them." },
      { skillSlug: "accessibility-floor", why: "Protect keyboard, semantics, contrast, and reduced motion." },
      { skillSlug: "performance-budget", why: "Measure the production experience against explicit budgets." },
      { skillSlug: "fresh-context-reviewer", why: "Finish with an evidence-based user review." },
    ],
  },
  {
    kind: "pack",
    slug: "founder-led-gtm",
    title: "Founder-led GTM",
    promise: "Turn product insight and proof into a focused path to the right customer.",
    steps: [
      { skillSlug: "problem-brief", why: "Anchor distribution in one real customer problem." },
      { skillSlug: "competitive-teardown", why: "Understand the market bar and deliberate difference." },
      { skillSlug: "copy-voice", why: "Explain the outcome in a specific founder voice." },
      { skillSlug: "testable-prototype", why: "Make the promise visible in a short, real demonstration." },
      { skillSlug: "evidence-grader", why: "Use only proof the product and customers support." },
      { skillSlug: "analytics-before-opinions", why: "Instrument the path from attention to meaningful action." },
      { skillSlug: "decision-memo", why: "Choose the channel and next experiment from evidence." },
    ],
  },
  {
    kind: "pack",
    slug: "30-day-product-loop",
    title: "30-day product loop",
    promise: "Hold one outcome while weekly evidence chooses what to make next.",
    steps: [
      { skillSlug: "decision-memo", why: "Record the month’s starting decision and trade-offs." },
      { skillSlug: "riskiest-assumption-map", why: "Choose the uncertainty that should move first." },
      { skillSlug: "testable-prototype", why: "Make the smallest evidence-producing change." },
      { skillSlug: "analytics-before-opinions", why: "Capture the primary signal and guardrails." },
      { skillSlug: "evidence-grader", why: "Read weekly evidence without inflating weak signals." },
      { skillSlug: "30-day-product-loop", why: "Run and codify the four weekly cycles." },
    ],
  },
] as const satisfies readonly SkillsCatalogPack[];
