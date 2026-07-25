import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relative) => readFile(path.join(root, relative), "utf8");

test("gallerySchema.ts defines appliedTo annotations and getDisabledInfo capability rules", async () => {
  const schema = await read("src/components/anim/gallerySchema.ts");

  // Verify appliedTo annotations exist
  assert.match(schema, /appliedTo:\s*"Applied to:/, "schema must contain appliedTo annotations");
  assert.match(schema, /Applied to: Gallery image list & slide order/);
  assert.match(schema, /Applied to: Motion transition model & physics/);
  assert.match(schema, /Applied to: Card flip, dock expansion & rotation speed/);
  assert.match(schema, /Applied to: Motion interpolation curve/);

  // Verify capability rules for Spring and Linear Inertia
  assert.match(schema, /if\s*\(options\.transition === "Spring"\)/, "schema must check Spring transition for disabling");
  assert.match(schema, /Duration is determined by spring physics stiffness & damping\./);
  assert.match(schema, /Easing is not supported for spring physics transitions\./);
  assert.match(schema, /if\s*\(options\.transition === "Linear Inertia"\)/);
});

test("GalleryOptionsPanel.tsx renders active target annotations and disabled tooltips", async () => {
  const panel = await read("src/components/anim/GalleryOptionsPanel.tsx");

  // Verify active target annotations indicator
  assert.match(panel, /<span>\{ctrl\.appliedTo\}<\/span>/, "panel must render ctrl.appliedTo text");
  assert.match(panel, /Applied to: Continuous background motion loop/);
  assert.match(panel, /Applied to: Card caption & index overlay badges/);

  // Verify disabled tooltips display
  assert.match(panel, /disabledInfo\?\.reason/, "panel must render disabledInfo.reason");
  assert.match(panel, /AlertCircle/, "panel must render warning icon for disabled tooltips");
  assert.match(panel, /disabled=\{isDisabled\}/, "panel inputs must bind disabled attribute");
});

test("gallery.tsx binds duration, easing, and transition to live animation runtime", async () => {
  const gallery = await read("src/components/anim/gallery.tsx");

  // Verify getMotionTransition helper exists and binds options
  assert.match(gallery, /function getMotionTransition\(/, "gallery.tsx must define getMotionTransition helper");
  assert.match(gallery, /options\?\.transition/, "gallery.tsx must read options.transition");
  assert.match(gallery, /options\?\.duration/, "gallery.tsx must read options.duration");
  assert.match(gallery, /options\?\.easing/, "gallery.tsx must read options.easing");

  // Verify runtime revolution speed and transition bindings across components
  assert.match(gallery, /dt \* 16[^\n]*Math\.max\(0\.1, duration\)/, "Proximity Orbit must adapt speed based on duration");
  assert.match(gallery, /350 \* Math\.max\(0\.1, duration\)/, "Magnetic Carousel must adapt ambient wave speed based on duration");
  assert.match(gallery, /0\.4 \/ Math\.max\(0\.1, duration\)/, "Ring Gallery must adapt spin velocity based on duration");
  assert.match(gallery, /0\.35 \/ Math\.max\(0\.1, duration\)/, "Round Carousel must adapt spin velocity based on duration");
  assert.match(gallery, /animate=\{\{ rotateY: isFlipped \? 180 : 0 \}\}\s*transition=\{motionTrans\}/, "Round Carousel must bind 3D card flip transition");
});
