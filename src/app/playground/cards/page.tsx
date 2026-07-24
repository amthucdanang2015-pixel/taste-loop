import type { Metadata } from "next";
import { CardStudio } from "@/components/products/cards/CardStudio";

export const metadata: Metadata = {
  title: "Card Studio — a 3D card maker across 112 design languages",
  description:
    "Type your details, pick a design language, and watch a two-sided business card come alive — animated background, real typography, full 3D flip.",
};

export default function CardsPage() {
  return <CardStudio />;
}
