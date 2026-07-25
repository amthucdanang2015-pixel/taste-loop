import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relative) => readFile(path.join(root, relative), "utf8");

test("AnimationStudio.tsx includes left rail search input and modal component", async () => {
  const studio = await read("src/components/AnimationStudio.tsx");

  // Verify left rail search button exists
  assert.match(studio, /Search Components\.\.\./, "studio must include Search Components... placeholder");
  assert.match(studio, /⌘ \+ K/, "studio must include ⌘ + K shortcut badge");

  // Verify shortcut listener
  assert.match(studio, /e\.key\.toLowerCase\(\) === "k"/, "studio must listen for ⌘+K shortcut");

  // Verify modal elements
  assert.match(studio, /ref=\{searchInputRef\}/, "studio must focus search input in modal");
  assert.match(studio, /Libraries/, "studio modal must include Libraries category header");
  assert.match(studio, /ArrowRight/, "studio modal items must render item arrow indicator");
});

test("AnimationStudio.tsx left sidebar width and mobile responsiveness", async () => {
  const studio = await read("src/components/AnimationStudio.tsx");

  // Verify widened left sidebar grid definition (280px)
  assert.match(studio, /lg:grid-cols-\[280px_1fr\]/, "studio must use 280px left rail width");

  // Verify mobile responsive state and back button
  assert.match(studio, /mobileView/, "studio must track mobileView state");
  assert.match(studio, /Back to Categories/, "studio must render Back to Categories mobile button");

  // Verify single column grid on mobile screens (1 row 1 item)
  assert.match(studio, /grid grid-cols-1[^\n]*lg:grid-cols-3/, "studio grid must use 1 column on mobile and 3 columns on desktop");

  // Verify full-width mobile container and mobile detail stage min-height
  assert.match(studio, /w-full flex-1/, "body container must fill full width on mobile");
  assert.match(studio, /min-h-\[340px\]/, "detail live stage must enforce min-height on mobile");
});

test("Animation search items cover both ANIM_ITEMS and TEXT_EFFECT_TEMPLATES", async () => {
  const animsSource = await read("src/data/animations.ts");
  const textsSource = await read("src/components/anim/TextEffects.tsx");

  assert.match(animsSource, /proximity-orbit/, "animations data must contain proximity-orbit");
  assert.match(textsSource, /typewriter/, "text effects data must contain typewriter");
});
