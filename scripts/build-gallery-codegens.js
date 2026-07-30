const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, '../src/components/anim/gallery.tsx');
const destPath = path.join(__dirname, '../src/components/anim/galleryCodegens.ts');

const content = fs.readFileSync(srcPath, 'utf8');

// Extract the screenshots arrays from the constants
function extractScreenshots(constName) {
  const startStr = `const ${constName}: AppGalleryItem = {`;
  const startIdx = content.indexOf(startStr);
  if (startIdx === -1) return '[]';
  
  const shotsStart = content.indexOf('screenshots: [', startIdx);
  if (shotsStart === -1) return '[]';
  
  const braceStart = content.indexOf('[', shotsStart);
  let braceCount = 1;
  let endIdx = -1;
  for (let i = braceStart + 1; i < content.length; i++) {
    if (content[i] === '[') braceCount++;
    else if (content[i] === ']') braceCount--;
    if (braceCount === 0) {
      endIdx = i + 1;
      break;
    }
  }
  
  return content.substring(braceStart, endIdx);
}

const apps = {
  VOCABTUNES: extractScreenshots('VOCABTUNES_APP'),
  BUZZED: extractScreenshots('BUZZED_APP'),
  NOTEFLY: extractScreenshots('NOTEFLY_APP'),
  KING_ENGLISH: extractScreenshots('KING_ENGLISH_APP')
};

const helpers = `
export interface GallerySlide {
  src: string;
  alt: string;
}

/** Hook to measure container dimensions for responsive scaling between Card view & Detail view */
function useContainerSize(ref: React.RefObject<HTMLDivElement | null>) {
  const [size, setSize] = React.useState({ width: 300, height: 260 });
  React.useEffect(() => {
    if (!ref.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
          setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
        }
      }
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);
  return size;
}

/** Helper to scale fixed size components relative to container size */
function getResponsiveScale(size: { width: number; height: number }, isDetail: boolean) {
  if (!isDetail) {
    return Math.max(0.5, Math.min(1.2, size.width / 300));
  }
  const minDim = Math.min(size.width, size.height);
  return Math.max(0.8, Math.min(2.5, minDim / 450));
}

/** Helper to convert options into Framer Motion transition configurations */
function getMotionTransition(transitionType?: string, durationVal?: number, easingVal?: string) {
  const duration = Math.max(0.05, durationVal ?? 0.8);
  const ease = easingVal === "linear" ? "linear"
    : easingVal === "ease-in-out" ? [0.42, 0, 0.58, 1]
    : easingVal === "spring" ? undefined
    : [0.22, 1, 0.36, 1];
  if (transitionType === "Spring" || easingVal === "spring") {
    return { type: "spring", stiffness: Math.max(80, 360 / duration), damping: 24 };
  }
  if (transitionType === "Linear Inertia" || easingVal === "linear") {
    return { duration, ease: "linear" };
  }
  return { duration, ease: ease ?? [0.22, 1, 0.36, 1] };
}
`;

function extractComponentBody(name) {
  const startStr = 'function ' + name + '(';
  let startIdx = content.indexOf(startStr);
  if (startIdx === -1) return null;
  
  const sigEnd = content.indexOf('}) {', startIdx);
  if (sigEnd === -1) return null;
  
  let mainBodyStart = sigEnd + 4;
  let braceCount = 1;
  let endIdx = -1;
  for (let i = mainBodyStart; i < content.length; i++) {
    if (content[i] === '{') braceCount++;
    else if (content[i] === '}') braceCount--;
    if (braceCount === 0) {
      endIdx = i;
      break;
    }
  }
  
  let body = content.substring(mainBodyStart, endIdx);
  
  // replace <Center> wrappers
  body = body.replace(/<Center className="h-full w-full( \${isDetail \? \"p-12\" : \"\"})?">/g, '<div className="h-full w-full bg-[#0d0c14] overflow-hidden flex items-center justify-center rounded-2xl border border-white/10 p-4">');
  body = body.replace(/<\/Center>/g, '</div>');
  body = body.replace(/<Center className="h-full w-full ">/g, '<div className="h-full w-full bg-[#0d0c14] overflow-hidden flex items-center justify-center rounded-2xl border border-white/10 p-4">');
  
  // replace shots = ...
  body = body.replace(/const shots = .+;/g, 'const shots = slides;');
  
  // replace ScreenshotItem with GallerySlide
  body = body.replace(/ScreenshotItem/g, 'GallerySlide');
  
  // remove useReducedMotion - NO, KEEP IT, WE WILL IMPORT IT!
  // Instead of replacing useReducedMotion with false, let's just make sure it's imported.
  // We leave `const reduce = useReducedMotion();` as is.
  
  return body.trim();
}

const variants = [
  { id: 'proximity-orbit', comp: 'ProximityOrbitDemo', app: 'VOCABTUNES' },
  { id: 'magnetic', comp: 'MagneticCarouselDemo', app: 'BUZZED' },
  { id: 'ring', comp: 'RingGalleryDemo', app: 'NOTEFLY' },
  { id: 'round', comp: 'RoundCarouselDemo', app: 'KING_ENGLISH' },
  { id: 'box-carousel', comp: 'BoxCarouselDemo', app: 'NOTEFLY' }
];

let out = '// galleryCodegens.ts - Code generators for Gallery variants\n\nexport type CodeGen = (opts: any, item: any) => string;\n\nexport const GALLERY_CODEGENS: Record<string, CodeGen> = {};\n';

for (const v of variants) {
  const body = extractComponentBody(v.comp);
  if (!body) continue;
  
  const screenshots = apps[v.app];
  
  out += '\n' + 'GALLERY_CODEGENS["' + v.id + '"] = (opts, item) => {\n' +
    '  const compName = item.name.replace(/[^a-zA-Z0-9]/g, "");\n  \n' +
    '  return `// ${item.name} — TasteLoop Gallery Component\n' +
    '// Pattern: ${item.name}\n\n' +
    '"use client";\n\n' +
    'import React, { useState, useRef, useEffect } from "react";\n' +
    'import { motion, AnimatePresence, useMotionValue, animate, useTransform, useReducedMotion } from "framer-motion";\n' +
    'import { X, Sparkles, RotateCw, Layers } from "lucide-react";\n\n' +
    '${GALLERY_HELPERS}\n\n' +
    'export function ${compName}Gallery({\n' +
    '  slides = ' + screenshots.replace(/\n/g, '\n  ') + ',\n' +
    '  options = ${JSON.stringify(opts, null, 2).replace(/\\n/g, \'\\n  \')}\n' +
    '}: {\n' +
    '  slides?: GallerySlide[];\n' +
    '  options?: any;\n' +
    '}) {\n' +
    '  const app = { icon: "", name: "Demo App", screenshots: slides };\n\n' +
    '  ' + body.replace(/`/g, '\\`').replace(/\$/g, '\\$') + '\n' +
    '}\n\n' +
    'export default ${compName}Gallery;\n' +
    '`;\n};\n';
}

out += '\n' +
  'export function getGalleryCode(variant: string, opts: any, item: any): string | null {\n' +
  '  const mappedVariant = variant === "magnetic-carousel" ? "magnetic" \n' +
  '    : variant === "ring-gallery" ? "ring" \n' +
  '    : variant === "round-carousel" ? "round"\n' +
  '    : variant === "orbit" ? "proximity-orbit"\n' +
  '    : variant === "box" ? "box-carousel"\n' +
  '    : variant;\n' +
  '  const gen = GALLERY_CODEGENS[mappedVariant];\n' +
  '  if (!gen) return null;\n' +
  '  return gen(opts, item);\n' +
  '}\n\n' +
  'const GALLERY_HELPERS = `' + helpers.replace(/`/g, '\\`').replace(/\$/g, '\\$') + '`;\n';

fs.writeFileSync(destPath, out);
console.log("Created galleryCodegens.ts");
