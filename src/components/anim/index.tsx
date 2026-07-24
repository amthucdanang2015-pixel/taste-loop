"use client";

import type { ComponentType } from "react";
import { EntranceDemo, TimingDemo, TransformDemo } from "./motionA";
import { TransitionDemo, ScrollDemo, EasingDemo, SpringDemo } from "./motionB";
import { LoopDemo, PolishDemo, InteractionDemo, PerfDemo, PrincipleDemo } from "./motionC";
import { GalleryDemo } from "./gallery";

type Family = ComponentType<{ variant: string }>;

const FAMILIES: Record<string, Family> = {
  entrance: EntranceDemo,
  timing: TimingDemo,
  transform: TransformDemo,
  transition: TransitionDemo,
  scroll: ScrollDemo,
  easing: EasingDemo,
  spring: SpringDemo,
  loop: LoopDemo,
  polish: PolishDemo,
  interaction: InteractionDemo,
  perf: PerfDemo,
  principle: PrincipleDemo,
  gallery: GalleryDemo,
};

export function AnimDemo({ demo, variant }: { demo: string; variant: string }) {
  const Cmp = FAMILIES[demo];
  if (!Cmp) return <div className="flex h-full items-center justify-center text-sm text-white/30">Preview coming soon</div>;
  return <Cmp variant={variant} />;
}
