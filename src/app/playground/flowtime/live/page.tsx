import { LiveDemo } from "@/components/products/flowtime/LiveDemo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live demo — Flowtime, in your chosen design language",
  description: "The same canonical app from the Design-System Switcher, fully interactive. Start the timer, check tasks, ask the assistant — in any design language.",
};

export default function LivePage() {
  return <LiveDemo />;
}
