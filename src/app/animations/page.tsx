import { AnimationStudio } from "@/components/AnimationStudio";
import { ANIM_ITEMS } from "@/data/animations";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Animation Index — every motion pattern, live, with prompts",
  description:
    "A precise motion vocabulary for product teams and their agents: 90+ patterns shown live with replay controls and copyable implementation direction.",
};

export default function AnimationsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "The Animation Index",
    numberOfItems: ANIM_ITEMS.length,
    itemListElement: ANIM_ITEMS.slice(0, 30).map((a, i) => ({ "@type": "ListItem", position: i + 1, name: a.name })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AnimationStudio />
    </>
  );
}
