import type { Metadata } from "next";
import { Suspense } from "react";
import { ArrowDown } from "lucide-react";
import {
  BRAND,
  OFFERS,
  PRIMARY_CTA,
  PRIMARY_OFFER,
} from "@/config/brand";
import { Reveal } from "@/components/Reveal";
import { OfferGrid } from "@/components/offers/OfferGrid";
import {
  WorkIntake,
  WorkIntakeFallback,
} from "@/components/WorkIntake";

export const metadata: Metadata = {
  title: `Work with ${BRAND.name} — ${OFFERS.map((offer) => offer.name).join(", ")}`,
  description: `Start with a fixed ${PRIMARY_OFFER.price} ${PRIMARY_OFFER.name}, or continue with an outcome-focused ${OFFERS[1].name} at ${OFFERS[1].price}.`,
};

export default function WorkPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-28 pt-32 sm:pt-36">
      <Reveal eager>
        <p className="eyebrow">Work with TasteLoop</p>
        <div className="mt-3 grid gap-8 lg:grid-cols-[1.05fr_0.75fr] lg:items-end">
          <div>
            <h1 className="max-w-4xl text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">Bring the decision, not a feature list.</h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/58">We find the smallest useful loop, make enough to meet reality, and recommend what should happen next—even when the answer is narrow it or stop.</p>
          </div>
          <div className="rounded-2xl border border-loop/30 bg-loop/[0.055] p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-loop">Best place to start</p>
            <p className="mt-2 text-lg font-medium">{PRIMARY_OFFER.name} · {PRIMARY_OFFER.price}</p>
            <p className="mt-1 text-sm text-white/55">{PRIMARY_OFFER.promise} {PRIMARY_OFFER.timeline}.</p>
            <a href="#intake" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-loop">
              {PRIMARY_CTA.label} <ArrowDown className="h-4 w-4" />
            </a>
          </div>
        </div>
      </Reveal>

      <OfferGrid headingLevel="h2" className="mt-16" />

      <Reveal eager>
        <section id="intake" className="mt-20 scroll-mt-28 rounded-[2rem] border border-line bg-surface/75 p-6 sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.68fr_1.32fr]">
            <div>
              <p className="eyebrow">Start here</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
                Start with the decision.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-white/52">
                Tell me what exists, what you are choosing between, and why it
                matters now. I read every message and reply personally.
              </p>
            </div>
            <Suspense fallback={<WorkIntakeFallback />}>
              <WorkIntake />
            </Suspense>
          </div>
        </section>
      </Reveal>
    </div>
  );
}
