"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { LeadForm, type Field } from "@/components/LeadForm";
import { OFFERS, PRIMARY_OFFER, type OfferId } from "@/config/brand";
import { trackEvent } from "@/lib/analytics";

const fields: Field[] = [
  {
    name: "decision",
    label: "What are you deciding—and what makes it hard right now?",
    type: "textarea",
    required: true,
    full: true,
    hint:
      "Include what exists, the choice you are weighing, any customer signal or evidence you already have, what is blocking it, and why the answer matters now.",
    placeholder:
      "For example: We have a working prototype, but we are deciding whether to narrow the audience or change the onboarding before launch. Early users understand the value but do not finish setup…",
  },
  { name: "name", label: "Name", required: true, autoComplete: "name" },
  {
    name: "email",
    label: "Email",
    type: "email",
    required: true,
    autoComplete: "email",
  },
  {
    name: "engagement",
    label: "Which loop feels closest?",
    type: "select",
    required: true,
    options: OFFERS.map((offer) => ({
      value: offer.id,
      label: `${offer.name} — ${offer.price}`,
    })),
  },
  {
    name: "stage",
    label: "What exists today?",
    type: "select",
    required: true,
    options: [
      "Idea or decision only",
      "Prototype or design",
      "Live product",
      "Existing team and product",
    ],
  },
  {
    name: "url",
    label: "Product, prototype, or design URL",
    type: "url",
    placeholder: "https://",
    full: true,
  },
];

function IntakeForm({ selectedOffer }: { selectedOffer: OfferId }) {
  return (
    <LeadForm
      key={selectedOffer}
      leadType={selectedOffer}
      leadTypeField="engagement"
      fields={fields}
      initialValues={{ engagement: selectedOffer }}
      submitLabel="Send the decision"
      successTitle="Message received."
      successBody="It is saved. Nam normally replies personally within 24 hours with fit, any questions, and the clearest next step."
    />
  );
}
import { Suspense } from "react";

function WorkIntakeContent() {
  const searchParams = useSearchParams();
  const formRegion = useRef<HTMLDivElement>(null);
  const requestedOffer = searchParams.get("loop");
  const selectedOffer =
    OFFERS.find((offer) => offer.id === requestedOffer)?.id ??
    PRIMARY_OFFER.id;

  useEffect(() => {
    const target = formRegion.current;
    if (!target) return;

    let measured = false;
    const measure = () => {
      if (measured) return;
      measured = true;
      trackEvent("intake_view", { offer_id: selectedOffer });
    };

    if (!("IntersectionObserver" in window)) {
      measure();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          measure();
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [selectedOffer]);

  return (
    <div ref={formRegion}>
      <IntakeForm selectedOffer={selectedOffer} />
    </div>
  );
}

export function WorkIntake() {
  return (
    <Suspense fallback={<WorkIntakeFallback />}>
      <WorkIntakeContent />
    </Suspense>
  );
}

export function WorkIntakeFallback() {
  return <IntakeForm selectedOffer={PRIMARY_OFFER.id} />;
}
