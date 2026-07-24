import { Reveal } from "@/components/Reveal";
import { OfferGrid } from "@/components/offers/OfferGrid";

export function OffersSection() {
  return (
    <section id="offers" className="section-rule mx-auto max-w-6xl scroll-mt-28 px-6 py-20 sm:py-24">
      <Reveal>
        <p className="eyebrow">Ways to work together</p>
        <div className="mt-3 grid gap-8 lg:grid-cols-[1fr_0.72fr] lg:items-end">
          <h2 className="max-w-3xl text-3xl font-semibold tracking-[-0.045em] sm:text-5xl">
            Start with one decision. Leave with working direction.
          </h2>
          <p className="text-base leading-relaxed text-white/58">
            First Loop is the fixed starting point. Product Loop continues only
            when the evidence supports a larger outcome.
          </p>
        </div>
      </Reveal>
      <OfferGrid className="mt-10" />
    </section>
  );
}
