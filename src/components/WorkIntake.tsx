"use client";

import { useSearchParams } from "next/navigation";
import { LeadForm, type Field } from "@/components/LeadForm";
import { OFFERS, PRIMARY_OFFER, type OfferId } from "@/config/brand";

const fields: Field[] = [
  {
    name: "decision",
    label: "What are you deciding—and what makes it hard right now?",
    type: "textarea",
    required: true,
    full: true,
    hint:
      "Include what exists, the choice you are weighing, what is blocking it, and why the answer matters now.",
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
      successBody="It is saved, and I’ll reply personally with the most useful next step."
    />
  );
}

export function WorkIntake() {
  const searchParams = useSearchParams();
  const requestedOffer = searchParams.get("loop");
  const selectedOffer =
    OFFERS.find((offer) => offer.id === requestedOffer)?.id ??
    PRIMARY_OFFER.id;

  return <IntakeForm selectedOffer={selectedOffer} />;
}

export function WorkIntakeFallback() {
  return <IntakeForm selectedOffer={PRIMARY_OFFER.id} />;
}
