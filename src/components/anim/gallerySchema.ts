export interface ScreenshotItem {
  src: string;
  alt: string;
}

export interface GalleryOptions {
  slides: ScreenshotItem[];
  autoplay: boolean;
  showTitle: boolean;
  cardWidth: number;
  cardHeight: number;
  borderRadius: number;
  gap: number;
  tilt: number;
  sidewaysTilt: number;
  inactiveOpacity: number;
  transition: string;
  duration: number;
  easing: string;
}

export interface DisabledInfo {
  disabled: boolean;
  reason?: string;
}

export interface ControlDef {
  key: keyof GalleryOptions;
  label: string;
  type: "slider" | "toggle" | "select" | "slides";
  group: "gallery" | "layout" | "animation";
  min?: number;
  max?: number;
  step?: number;
  options?: { label: string; value: string }[];
  supportedVariants?: string[];
  appliedTo?: string;
  getDisabledInfo?: (options: GalleryOptions, variant: string) => DisabledInfo | undefined;
}

export const DEFAULT_GALLERY_OPTIONS: Record<string, GalleryOptions> = {
  "proximity-orbit": {
    slides: [],
    autoplay: true,
    showTitle: true,
    cardWidth: 100,
    cardHeight: 150,
    borderRadius: 12,
    gap: 16,
    tilt: 0,
    sidewaysTilt: 0,
    inactiveOpacity: 80,
    transition: "Tween",
    duration: 1.0,
    easing: "ease-out",
  },
  "magnetic-carousel": {
    slides: [],
    autoplay: true,
    showTitle: true,
    cardWidth: 80,
    cardHeight: 180,
    borderRadius: 12,
    gap: 10,
    tilt: 0,
    sidewaysTilt: 0,
    inactiveOpacity: 70,
    transition: "Spring",
    duration: 0.5,
    easing: "spring",
  },
  "ring-gallery": {
    slides: [],
    autoplay: true,
    showTitle: true,
    cardWidth: 100,
    cardHeight: 150,
    borderRadius: 12,
    gap: 14,
    tilt: 12,
    sidewaysTilt: 0,
    inactiveOpacity: 85,
    transition: "Linear Inertia",
    duration: 0.8,
    easing: "ease-out",
  },
  "round-carousel": {
    slides: [],
    autoplay: true,
    showTitle: true,
    cardWidth: 110,
    cardHeight: 165,
    borderRadius: 12,
    gap: 14,
    tilt: 8,
    sidewaysTilt: 0,
    inactiveOpacity: 90,
    transition: "3D Flip",
    duration: 0.6,
    easing: "ease-in-out",
  },
};

export const BASE_DEFAULT_GALLERY_OPTIONS: GalleryOptions = {
  slides: [],
  autoplay: true,
  showTitle: true,
  cardWidth: 100,
  cardHeight: 150,
  borderRadius: 12,
  gap: 14,
  tilt: 0,
  sidewaysTilt: 0,
  inactiveOpacity: 80,
  transition: "Tween",
  duration: 0.8,
  easing: "ease-out",
};

export const GALLERY_SCHEMA_CONTROLS: ControlDef[] = [
  // Gallery Group
  {
    key: "slides",
    label: "Slides",
    type: "slides",
    group: "gallery",
    appliedTo: "Applied to: Gallery image list & slide order",
  },
  {
    key: "autoplay",
    label: "Autoplay",
    type: "toggle",
    group: "gallery",
    appliedTo: "Applied to: Continuous background motion loop",
  },
  {
    key: "showTitle",
    label: "Show Title",
    type: "toggle",
    group: "gallery",
    appliedTo: "Applied to: Card caption & index overlay badges",
  },

  // Layout Group
  {
    key: "cardWidth",
    label: "Card Width",
    type: "slider",
    group: "layout",
    min: 30,
    max: 300,
    step: 2,
    appliedTo: "Applied to: Gallery card width",
  },
  {
    key: "cardHeight",
    label: "Card Height",
    type: "slider",
    group: "layout",
    min: 40,
    max: 400,
    step: 2,
    appliedTo: "Applied to: Gallery card height",
  },
  {
    key: "borderRadius",
    label: "Rounded",
    type: "slider",
    group: "layout",
    min: 0,
    max: 32,
    step: 1,
    appliedTo: "Applied to: Card corner radius",
  },
  {
    key: "tilt",
    label: "Tilt",
    type: "slider",
    group: "layout",
    min: 0,
    max: 45,
    step: 1,
    supportedVariants: ["ring-gallery", "ring", "round-carousel", "round", "proximity-orbit"],
    appliedTo: "Applied to: 3D perspective X-axis tilt",
  },
  {
    key: "sidewaysTilt",
    label: "Sideways Tilt",
    type: "slider",
    group: "layout",
    min: 0,
    max: 45,
    step: 1,
    supportedVariants: ["ring-gallery", "ring", "round-carousel", "round", "proximity-orbit"],
    appliedTo: "Applied to: 3D perspective Z-axis tilt",
  },
  {
    key: "gap",
    label: "Gap",
    type: "slider",
    group: "layout",
    min: 0,
    max: 40,
    step: 1,
    appliedTo: "Applied to: Distance between cards & orbit radius",
  },
  {
    key: "inactiveOpacity",
    label: "Inactive Opacity",
    type: "slider",
    group: "layout",
    min: 0,
    max: 100,
    step: 5,
    appliedTo: "Applied to: Non-hovered / background card opacity",
  },

  // Animation Group
  {
    key: "transition",
    label: "Transition",
    type: "select",
    group: "animation",
    options: [
      { label: "Tween · Ease In/Out", value: "Tween" },
      { label: "Spring Physics", value: "Spring" },
      { label: "3D Flip", value: "3D Flip" },
      { label: "Linear Inertia", value: "Linear Inertia" },
    ],
    appliedTo: "Applied to: Motion transition model & physics",
  },
  {
    key: "duration",
    label: "Duration",
    type: "slider",
    group: "animation",
    min: 0.1,
    max: 3.0,
    step: 0.1,
    appliedTo: "Applied to: Card flip, dock expansion & rotation speed",
    getDisabledInfo: (options) => {
      if (options.transition === "Spring") {
        return {
          disabled: true,
          reason: "Duration is determined by spring physics stiffness & damping.",
        };
      }
      if (options.transition === "Linear Inertia") {
        return {
          disabled: true,
          reason: "Duration is determined by inertia friction decay.",
        };
      }
      return undefined;
    },
  },
  {
    key: "easing",
    label: "Easing",
    type: "select",
    group: "animation",
    options: [
      { label: "ease-out", value: "ease-out" },
      { label: "ease-in-out", value: "ease-in-out" },
      { label: "spring", value: "spring" },
      { label: "linear", value: "linear" },
    ],
    appliedTo: "Applied to: Motion interpolation curve",
    getDisabledInfo: (options) => {
      if (options.transition === "Spring") {
        return {
          disabled: true,
          reason: "Easing is not supported for spring physics transitions.",
        };
      }
      if (options.transition === "Linear Inertia") {
        return {
          disabled: true,
          reason: "Easing is not supported for linear inertia transitions.",
        };
      }
      return undefined;
    },
  },
];
