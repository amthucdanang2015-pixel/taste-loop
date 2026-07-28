export type OfferId = "first-loop" | "product-loop";

export interface Offer {
  id: OfferId;
  name: string;
  price: string;
  priceAmount: number;
  timeline: string;
  promise: string;
  purpose: string;
  includes: string[];
  cta: string;
  note?: string;
  featured?: boolean;
}

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
const vercelHost = (process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL)?.replace(/\/$/, "");
const inferredSiteUrl = configuredSiteUrl || (vercelHost ? `https://${vercelHost}` : "http://localhost:3000");

export const BRAND = {
  name: "TasteLoop",
  wordmark: "TASTE/LOOP",
  compactMark: "T/L",
  siteUrl: inferredSiteUrl,
  legacySiteUrl: "https://vibetoreal.dev",
  email: "mailnamnv@gmail.com",
  positioning: "A founder-led product partner, amplified by agents.",
  headline: "The difference is the loop.",
  idea: "Human taste, built into every loop.",
  description:
    "TasteLoop is Nam Nguyen's product operating system: founder-led direction and quality, coordinated agent-accelerated research, design, engineering and QA, and real-world evidence looped into better products.",
  socialDescription:
    "Founder-led product direction, coordinated agent speed, and real-world evidence—looped into better products.",
  founder: {
    name: "Nam Nguyen",
    role: "Founder · Design Engineer",
  },
} as const;

export const NAV_LINKS = [
  { href: "/shipped", label: "Shipped" },
  { href: "/skills", label: "Skills" },
  { href: "/playground", label: "Playground" },
  { href: "/animations", label: "Animations" },
] as const;

export const OFFERS: Offer[] = [
  {
    id: "first-loop",
    name: "First Loop",
    price: "$2,500",
    priceAmount: 2500,
    timeline: "Delivered in 3 working days",
    promise: "Turn one hard product decision into working evidence.",
    purpose:
      "I frame one decision, make the smallest useful product slice, and leave you with evidence-backed direction for what should happen next.",
    includes: [
      "One decision brief, constraints, and success test",
      "One testable prototype or critical working slice",
      "Product and production direction",
      "A prioritized 30-day product bet",
      "Recorded walkthrough and ship, change, narrow, or stop recommendation",
    ],
    cta: "Start a First Loop",
    note:
      "Begin a Product Loop within 14 days of delivery and the full $2,500 First Loop fee is credited to that first 30-day cycle.",
    featured: true,
  },
  {
    id: "product-loop",
    name: "Product Loop",
    price: "$9,800",
    priceAmount: 9800,
    timeline: "One 30-day product cycle",
    promise: "Ship and test one important product outcome.",
    purpose:
      "Nam owns the direction, trade-offs, and quality while a coordinated agent system accelerates the work and evidence determines the next move.",
    includes: [
      "One named outcome and explicit success test",
      "End-to-end product direction and execution",
      "Agent-accelerated research, design, engineering, and QA",
      "Frequent working releases and evidence reviews",
      "Client-owned code, accounts, documentation, and decision history",
    ],
    cta: "Discuss a Product Loop",
  },
];

export const WORK_MODEL = {
  capacity:
    "TasteLoop keeps no more than two active engagements at once. Active Product Loop partners receive first priority on the next cycle.",
  continuity:
    "Active partners receive at least 30 days' notice if TasteLoop cannot continue, except for non-payment or material breach.",
  ownership:
    "Code, accounts, design files, decisions, runbooks, and release history live in tools you own from day one, so continuation or handoff is straightforward.",
  partnership:
    "Occasionally a Product Loop becomes a deeper product partnership. That starts after paid work and real customer signal; equity never replaces a workable cash budget.",
  partnershipPrompt:
    "Already bring customers or distribution? Mention it in the intake.",
} as const;

export const offerById = (id: OfferId) => OFFERS.find((offer) => offer.id === id)!;
export const PRIMARY_OFFER = offerById("first-loop");
export const PRIMARY_CTA = {
  href: "/work?loop=first-loop#intake",
  label: PRIMARY_OFFER.cta,
  compactLabel: "First Loop",
} as const;
export const offerHref = (id: OfferId) => `/work?loop=${id}#intake`;

/**
 * Compatibility-sensitive identifiers. They remain unchanged until a deliberate
 * migration can preserve existing URLs, local access state, and deployed infra.
 */
export const LEGACY_IDENTIFIERS = {
  storagePrefix: "v2r_",
  showcaseEvent: "vtr:showcase-select",
  tableEnv: "VTR_TABLE_NAME",
  gradientPath: "/gradient",
} as const;
