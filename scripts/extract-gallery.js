const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, '../src/components/anim/gallery.tsx');
const destPath = path.join(__dirname, '../src/components/anim/galleryCodegens.ts');

const content = fs.readFileSync(srcPath, 'utf8');

// We want to extract the 5 component functions
const names = ['ProximityOrbitDemo', 'MagneticCarouselDemo', 'RingGalleryDemo', 'RoundCarouselDemo', 'BoxCarouselDemo'];

const parts = [];

for (const name of names) {
  const startIdx = content.indexOf(`function ${name}`);
  if (startIdx === -1) continue;
  let endIdx = startIdx;
  let braceCount = 0;
  let started = false;

  for (let i = startIdx; i < content.length; i++) {
    if (content[i] === '{') {
      braceCount++;
      started = true;
    } else if (content[i] === '}') {
      braceCount--;
    }

    if (started && braceCount === 0) {
      endIdx = i + 1;
      break;
    }
  }

  let funcStr = content.substring(startIdx, endIdx);

  // Transform the function string
  // Remove the `app` and `options` destructured args
  funcStr = funcStr.replace(/\{\s*app,\s*options,\s*\}:\s*\{\s*app:\s*AppGalleryItem;\s*options\?:\s*GalleryOptions;\s*\}/g, 'opts: GalleryOptions');
  funcStr = funcStr.replace(/\{\s*app,\s*options\s*\}:\s*\{\s*app:\s*any;\s*options\?:\s*any\s*\}/g, 'opts: GalleryOptions');

  // Convert into a code generator function
  const generatorStr = `const ${name}Gen = (opts: GalleryOptions, item: AnimItem) => {
  const compName = item.name.replace(/[^a-zA-Z0-9]/g, "");
  return \`// \${item.name} — TasteLoop Gallery Component
// Pattern: \${item.name}

"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion, useMotionValue, animate, useTransform } from "framer-motion";
import { X, Sparkles, RotateCw, Layers } from "lucide-react";

export interface GallerySlide {
  src: string;
  alt: string;
}

\${GALLERY_HELPERS}

export function \${compName}Gallery({
  slides = [
    { src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80", alt: "Slide 1" },
    { src: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=600&q=80", alt: "Slide 2" },
    { src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80", alt: "Slide 3" },
    { src: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=600&q=80", alt: "Slide 4" },
    { src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80", alt: "Slide 5" },
    { src: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=600&q=80", alt: "Slide 6" },
  ],
  autoplay = \${opts.autoplay ?? true},
  showTitle = \${opts.showTitle ?? true},
  cardWidth = \${opts.cardWidth ?? 100},
  cardHeight = \${opts.cardHeight ?? 150},
  gap = \${opts.gap ?? 16},
  borderRadius = \${opts.borderRadius ?? 12},
  duration = \${opts.duration ?? 1.0},
  tilt = \${opts.tilt ?? 0},
  sidewaysTilt = \${opts.sidewaysTilt ?? 0},
  inactiveOpacity = \${opts.inactiveOpacity ?? 80},
  animationMode = "\${opts.animationMode ?? 'Auto'}",
  direction = "\${opts.direction ?? 'left'}",
  size = "\${opts.size ?? 'medium'}",
}: {
  slides?: GallerySlide[];
  autoplay?: boolean;
  showTitle?: boolean;
  cardWidth?: number;
  cardHeight?: number;
  gap?: number;
  borderRadius?: number;
  duration?: number;
  tilt?: number;
  sidewaysTilt?: number;
  inactiveOpacity?: number;
  animationMode?: string;
  direction?: string;
  size?: string;
}) {
  // Setup options object inside to map to the original logic
  const options = {
    autoplay, showTitle, cardWidth, cardHeight, gap, borderRadius, duration, tilt, sidewaysTilt, inactiveOpacity, animationMode, direction, size
  };
  const reduce = false;
  // Replace shots reference
  const shots = slides;
  const totalShots = shots.length;

\${extractBody(funcStr)}

export default \${compName}Gallery;
\`;
};
\`\`;
`;
  // ... wait, doing it via a script is a bit complex and fragile. Let's just create a simpler, unified manual template
}
