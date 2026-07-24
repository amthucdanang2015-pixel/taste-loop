import { StyleStudio } from "@/components/products/flowtime/StyleStudio";
import { DESIGN_SYSTEMS } from "@/data/designSystems";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flowtime — one working app across 112 design languages",
  description:
    "Switch one working app across 112 design languages, direct the motion and interface live, then copy the exact product-quality prompt for your agent.",
};

export default function StylesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "The Design-System Switcher",
    numberOfItems: DESIGN_SYSTEMS.length,
    itemListElement: DESIGN_SYSTEMS.map((d, i) => ({ "@type": "ListItem", position: i + 1, name: d.name })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <StyleStudio />
    </>
  );
}
