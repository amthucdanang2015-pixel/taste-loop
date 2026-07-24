import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import {
  OFFERS,
  offerHref,
  type Offer,
} from "@/config/brand";
import { Reveal } from "@/components/Reveal";

export function OfferGrid({
  headingLevel = "h3",
  className = "",
}: {
  headingLevel?: "h2" | "h3";
  className?: string;
}) {
  return (
    <div className={`grid gap-4 lg:grid-cols-2 ${className}`}>
      {OFFERS.map((offer, index) => (
        <Reveal key={offer.id} delay={index * 0.06}>
          <OfferCard offer={offer} headingLevel={headingLevel} />
        </Reveal>
      ))}
    </div>
  );
}

function OfferCard({
  offer,
  headingLevel,
}: {
  offer: Offer;
  headingLevel: "h2" | "h3";
}) {
  const Heading = headingLevel;

  return (
    <article
      id={offer.id}
      className={`flex h-full scroll-mt-28 flex-col rounded-[1.75rem] border p-6 sm:p-8 ${
        offer.featured
          ? "border-loop/45 bg-loop/[0.065]"
          : "border-line bg-surface/65"
      }`}
    >
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-signal">
          {offer.featured ? "Start here" : "Continue the work"}
        </p>
        <Heading className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
          {offer.name}
        </Heading>
      </div>

      <p className="mt-5 text-lg font-medium leading-snug text-white/88">
        {offer.promise}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-white/52">
        {offer.purpose}
      </p>

      <ul className="mt-6 flex-1 space-y-2.5">
        {offer.includes.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2 text-[13px] leading-relaxed text-white/67"
          >
            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-loop" />
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-8 border-t border-white/10 pt-5">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-5">
          <p className="text-2xl font-semibold tracking-[-0.035em] tabular-nums">
            {offer.price}
          </p>
          <p className="text-sm text-white/48 sm:text-right">{offer.timeline}</p>
        </div>
        <Link
          href={offerHref(offer.id)}
          className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition ${
            offer.featured
              ? "bg-loop text-ink hover:bg-loop/90"
              : "border border-line text-white/82 hover:border-loop/40 hover:text-white"
          }`}
        >
          {offer.cta} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
