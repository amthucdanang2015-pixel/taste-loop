/**
 * TasteLoop content model. Phase 1 is data-driven and static (SEO-first, fast,
 * zero backend dependency). When content moves server-side, these same types map
 * 1:1 onto DynamoDB items (PK: <TYPE>#<slug>, SK: META) — see amplify/ + docs.
 */

export type Difficulty = "Starter" | "Intermediate" | "Advanced";

export interface ToolPrompts {
  /** v0 by Vercel */
  v0: string;
  /** Cursor / Claude Code / Codex (agentic, edits real files) */
  agent: string;
  /** Lovable / Bolt (full-app scaffolders) */
  scaffold: string;
  /** Figma Make */
  figma: string;
}

export interface BaseDoc {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  featured?: boolean;
  /** ISO date — controls ordering and sitemap lastmod */
  updatedAt: string;
}

export interface Pattern extends BaseDoc {
  category: string; // category slug
  difficulty: Difficulty;
  bestFor: string;
  avoidWhen: string;
  whyItWorks: string;
  uxPrinciple: string;
  motionPrinciple?: string;
  visualReference: string; // describes the reference; later a screenshot/video
  prompts: ToolPrompts;
  implementation: string[];
  qa: string[];
  aiMistakes: string[];
  related: string[]; // pattern slugs
}

export interface Skill extends BaseDoc {
  purpose: string;
  supports: string[]; // AI tools this skill targets
  install: string; // how to install / use
  skillPrompt: string; // the big copyable instruction block
  rules: string[];
  examples: string[];
  before: string;
  after: string;
  related: string[]; // pattern slugs
}

export interface Teardown extends BaseDoc {
  reference: string; // product/archetype name (principle, not assets)
  whatsGood: string[];
  uxLesson: string;
  motionLesson: string;
  productLesson: string;
  recreatePrompt: string;
  adaptSafely: string;
  aiMistakes: string[];
}

export interface Category {
  slug: string;
  name: string;
  blurb: string;
  accent: string; // tailwind gradient classes
}


type AnimationType = { id: string; label: string; badge?: string };

export const ANIMATION_TYPES: AnimationType[] = [
  { id: "gallery", label: "Gallery Animations" },
  { id: "text-effect", label: "Text Effect" },
  { id: "border", label: "Borders & Frames" },
  { id: "button", label: "Button" },
  { id: "image", label: "Image" },
  { id: "cursor", label: "Cursor" },
  { id: "elements", label: "Elements" },
  { id: "animations", label: "Animations" },
  { id: "background", label: "Background" },
];

