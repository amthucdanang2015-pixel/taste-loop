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

test("Animation search items cover both ANIM_ITEMS and TEXT_EFFECT_TEMPLATES", async () => {
  const animsSource = await read("src/data/animations.ts");
  const textsSource = await read("src/components/anim/TextEffects.tsx");

  assert.match(animsSource, /proximity-orbit/, "animations data must contain proximity-orbit");
  assert.match(textsSource, /typewriter/, "text effects data must contain typewriter");
});
