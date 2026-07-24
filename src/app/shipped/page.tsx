import Link from "next/link";
import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { Showcase } from "@/components/home/Showcase";
import { PRIMARY_CTA } from "@/config/brand";
import { getShippedApps } from "@/lib/apps";

export const metadata: Metadata = {
  title: "Shipped work — live sites & App Store apps",
  description:
    "Every product here is real and live right now: web apps you can open, native apps in the App Store — each designed and engineered end-to-end.",
};

// Same daily refresh as the home page.
export const revalidate = 86400;

export default async function ShippedPage() {
  const apps = await getShippedApps();
  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-32">
      <Reveal>
        <p className="eyebrow">Shipped · proof from real products</p>
        <h1 className="mt-2 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">The work, live.</h1>
        <p className="mt-3 max-w-xl text-white/55">
          No case-study theater — pick a product and look at the real thing. Web apps run embedded here; App Store apps show their actual screens.
        </p>
      </Reveal>
      <div id="work" className="mt-10 scroll-mt-24">
        <Showcase apps={apps} />
      </div>
      <Reveal>
        <div className="mt-16 flex max-w-full flex-wrap items-center gap-3 rounded-2xl border border-line bg-gradient-to-br from-accent/12 to-accent2/10 p-5">
          <p className="flex-1 text-sm text-white/75">Need to decide what your product should become next?</p>
          <Link href={PRIMARY_CTA.href} className="inline-flex min-h-11 shrink-0 items-center rounded-full bg-loop px-4 py-2 text-sm font-semibold text-ink transition hover:bg-loop/90">{PRIMARY_CTA.label}</Link>
        </div>
      </Reveal>
    </div>
  );
}
