import { CardLive } from "@/components/products/cards/CardLive";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live demo — your card, in any design language",
  description: "The Card Studio product full-screen: flip it, restyle it, export a print-ready PNG or a spin video.",
};

export default function CardLivePage() {
  return <CardLive />;
}
