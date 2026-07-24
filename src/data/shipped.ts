import shippedMedia from "../../assets/shipped-manifest.json";
import { assetUrl } from "@/config/assets";

/** Shipped work is canonical proof. Keep product order and media mappings explicit. */

export interface ShippedScreenshot {
  src: string;
  alt: string;
}

export interface ShippedSite {
  slug: keyof typeof shippedMedia.sites;
  name: string;
  url: string;
  tagline: string;
  stack: readonly string[];
  accent: string;
  icon: string;
  /** Optical correction inside the shared site-mark safe area. */
  iconAdjustment?: ProductMarkAdjustment;
  /** False when the origin blocks or cannot reliably support iframe previews. */
  embed?: boolean;
}

export interface ProductMarkAdjustment {
  scale: number;
  x?: number;
  y?: number;
}

export const SHIPPED_SITES: readonly ShippedSite[] = [
  {
    slug: "agentcto",
    name: "AgentCTO",
    url: "https://agentcto-fun-nam-nguyens-projects-2dee7f8f.vercel.app/",
    tagline: "A community-owned AI token launchpad where generated ideas go to a daily vote and launch on Pump.fun.",
    stack: ["AI agents", "Community voting", "Solana"],
    accent: "#22d3ee",
    icon: assetUrl(shippedMedia.sites.agentcto),
    iconAdjustment: { scale: 0.95 },
  },
  {
    slug: "baecafe",
    name: "BaeCafe",
    url: "https://baecafe-xyz.vercel.app/",
    tagline: "A character-led NFT world with seasonal stories, collectible reveals, a vault, and minting.",
    stack: ["Interactive story", "Digital collectibles", "Web3"],
    accent: "#f4d35e",
    icon: assetUrl(shippedMedia.sites.baecafe),
    iconAdjustment: { scale: 0.87 },
  },
  {
    slug: "moreso",
    name: "Moreso",
    url: "https://www.moreso.io/",
    tagline: "A Web3-first luxury fashion IP connecting collectible characters, digital identity, and IRL collections.",
    stack: ["Fashion IP", "Digital identity", "NFT"],
    accent: "#7c5cff",
    icon: assetUrl(shippedMedia.sites.moreso),
    iconAdjustment: { scale: 1, y: 1 },
  },
  {
    slug: "opencto",
    name: "OpenCTO",
    url: "https://opencto.vercel.app/",
    tagline: "A crypto-powered ads platform for X that rewards quality engagement and filters spam and bots.",
    stack: ["X campaigns", "Crypto rewards", "Anti-spam"],
    accent: "#10b981",
    icon: assetUrl(shippedMedia.sites.opencto),
    iconAdjustment: { scale: 0.76 },
  },
  {
    slug: "groupumpfun",
    name: "Groupump",
    url: "https://groupumpfun.vercel.app/",
    tagline: "A crowdfunding launchpad where communities fund token campaigns in SOL before they launch on Pump.fun.",
    stack: ["Crowdfunding", "Solana", "Pump.fun"],
    accent: "#f59e0b",
    icon: assetUrl(shippedMedia.sites.groupumpfun),
    iconAdjustment: { scale: 0.78 },
  },
] as const;

/** App Store developer ID is compatibility-sensitive production data. */
export const APP_STORE_DEVELOPER_ID = "1719586694";

export interface AppStoreProduct {
  id: number;
  name: string;
  genre: string;
  url: string;
  note: string;
}

/**
 * Stable track IDs define the editorial order. Apple metadata may enrich these
 * records, but an upstream failure must not remove the catalogue or reorder it.
 */
export const APP_STORE_PRODUCTS: readonly AppStoreProduct[] = [
  {
    id: 6473722198,
    name: "VocabTunes - AI Word Builder",
    genre: "Education",
    url: "https://apps.apple.com/app/id6473722198",
    note: "Learn vocabulary through music — an AI word builder that turns study into songs.",
  },
  {
    id: 6483942011,
    name: "King English Kids Anime",
    genre: "Education",
    url: "https://apps.apple.com/app/id6483942011",
    note: "English for kids, told through anime — playful, guided learning.",
  },
  {
    id: 6757947194,
    name: "Buzzed: Adult party game cards",
    genre: "Games",
    url: "https://apps.apple.com/app/id6757947194",
    note: "The adult party game that gets the room going — card after card.",
  },
  {
    id: 6748024051,
    name: "NoteFly: AI Note Recorder",
    genre: "Productivity",
    url: "https://apps.apple.com/app/id6748024051",
    note: "Capture, transcribe, and organise notes by voice with an AI recorder.",
  },
  {
    id: 6761237352,
    name: "Dilemma: What Would You Choose",
    genre: "Games",
    url: "https://apps.apple.com/app/id6761237352",
    note: "Would-you-rather dilemmas that spark real debate.",
  },
  {
    id: 6749757392,
    name: "WenLambo AI: Meme, Alt Scanner",
    genre: "Finance",
    url: "https://apps.apple.com/app/id6749757392",
    note: "An AI meme and altcoin scanner for the crypto-curious.",
  },
  {
    id: 6748883355,
    name: "Focus & To-Do Timer - No Ads",
    genre: "Productivity",
    url: "https://apps.apple.com/app/id6748883355",
    note: "A distraction-free focus timer and to-do list — no ads, just deep work.",
  },
  {
    id: 6759958663,
    name: "Most Likely To: Listen & Vote",
    genre: "Games",
    url: "https://apps.apple.com/app/id6759958663",
    note: "Most-likely-to, listen and vote — who does the group pick?",
  },
  {
    id: 6758606033,
    name: "Rouly: Party Roulette Game",
    genre: "Games",
    url: "https://apps.apple.com/app/id6758606033",
    note: "Spin-the-wheel party roulette for game nights.",
  },
  {
    id: 6749230692,
    name: "New Scan QR Code. - No Ads",
    genre: "Utilities",
    url: "https://apps.apple.com/app/id6749230692",
    note: "A fast, ad-free QR scanner that just works.",
  },
  {
    id: 6758385148,
    name: "YIKES! Truth & Dare party game",
    genre: "Entertainment",
    url: "https://apps.apple.com/app/id6758385148",
    note: "Truth or dare, reinvented for a bolder crowd.",
  },
  {
    id: 6759959558,
    name: "Never Ever: Listen & Answer",
    genre: "Games",
    url: "https://apps.apple.com/app/id6759959558",
    note: "Never-have-I-ever, listen-and-answer edition.",
  },
] as const;

export interface ShippedApp {
  id: number;
  name: string;
  icon: string;
  screenshots: ShippedScreenshot[];
  url: string;
  genre: string;
  note: string;
}

type CuratedAppId = keyof typeof shippedMedia.apps;

function curatedAppMedia(appId: number) {
  return shippedMedia.apps[String(appId) as CuratedAppId];
}

export function curatedAppIcon(appId: number): string {
  const media = curatedAppMedia(appId);
  return media ? assetUrl(media.icon) : "";
}

export function curatedScreenshots(appId: number): ShippedScreenshot[] {
  const entries = curatedAppMedia(appId)?.screenshots;
  return (entries ?? []).map((entry) => ({
    src: assetUrl(entry.path),
    alt: entry.alt,
  }));
}

export const GENRE_ACCENT: Readonly<Record<string, string>> = {
  Education: "#3b82f6",
  Productivity: "#10b981",
  Games: "#ec4899",
  Finance: "#f59e0b",
  Utilities: "#64748b",
  Entertainment: "#a855f7",
};

export const DEFAULT_APP_ACCENT = "#7c5cff";
export const appAccent = (genre: string) => GENRE_ACCENT[genre] ?? DEFAULT_APP_ACCENT;
