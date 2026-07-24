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
  positioning: "An agent-native product company and product partner.",
  headline: "The difference is the loop.",
  idea: "Human taste, built into every loop.",
  description:
    "TasteLoop is a founder-led product company combining nearly ten years of product experience, agent speed, human judgment and real-world feedback to choose, design, build, launch and improve products people actually want.",
  socialDescription:
    "Agent speed, human judgment, and real-world feedback—looped into better products.",
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
  { href: "/gradient", label: "AURORA" },
] as const;

export const OFFERS: Offer[] = [
  {
    id: "first-loop",
    name: "First Loop",
    price: "$3,500",
    priceAmount: 3500,
    timeline: "Delivered in 3 working days",
    promise: "Turn one important product decision into a working direction.",
    purpose:
      "We define the decision, make the smallest useful product slice, and leave you with evidence-backed direction for what to do next.",
    includes: [
      "Decision brief, constraints, and success test",
      "One testable prototype or critical working slice",
      "Product and production direction",
      "A prioritized 30-day product loop",
      "Recorded walkthrough and ship, change, narrow, or stop recommendation",
    ],
    cta: "Start a First Loop",
    featured: true,
  },
  {
    id: "product-loop",
    name: "Product Loop",
    price: "$9,800 per month",
    priceAmount: 9800,
    timeline: "Month to month",
    promise: "One important product outcome at a time.",
    purpose:
      "An accountable product partner across strategy, research, UX, design, engineering, AI workflows, infrastructure, analytics, launch, and iteration.",
    includes: [
      "One named outcome with evidence and a decision owner",
      "End-to-end product and engineering execution",
      "Frequent working releases, not status theater",
      "Learnings codified into the product system",
    ],
    cta: "Discuss a Product Loop",
  },
];

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
