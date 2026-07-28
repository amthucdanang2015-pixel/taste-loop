import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relative) => readFile(path.join(root, relative), "utf8");

test("shared Playground drawers and previews honor reduced motion", async () => {
  const promptDrawer = await read("src/components/products/engine/PromptDrawer.tsx");
  const styleRail = await read("src/components/products/engine/StyleRail.tsx");

  assert.match(promptDrawer, /useReducedMotion/);
  assert.match(promptDrawer, /initial=\{reduce \? false : \{ x: "105%" \}\}/);
  assert.match(promptDrawer, /transition=\{reduce \? \{ duration: 0 \}/);

  assert.match(styleRail, /useReducedMotion/);
  assert.match(styleRail, /animate=\{reduce \? \{ x: 0 \} : \{ x: \[0, 28\] \}\}/);
  assert.match(styleRail, /animate=\{reduce \? \{ rotate: 0 \} : \{ rotate: 360 \}\}/);
  assert.match(styleRail, /animate=\{reduce \? \{ pathLength: 1 \} : \{ pathLength: \[0, 1\] \}\}/);
});

test("Playground dialogs preserve focus and trap keyboard navigation", async () => {
  const promptDrawer = await read("src/components/products/engine/PromptDrawer.tsx");
  const styleRail = await read("src/components/products/engine/StyleRail.tsx");

  for (const source of [promptDrawer, styleRail]) {
    assert.match(source, /role="dialog"/);
    assert.match(source, /aria-modal="true"/);
    assert.match(source, /previousFocusRef/);
    assert.match(source, /event\.key === "Escape"/);
    assert.match(source, /event\.key !== "Tab"/);
  }
});

test("the live shell and card exports fail safely on narrow or unsupported clients", async () => {
  const liveShell = await read("src/components/products/engine/LiveShell.tsx");
  const cardMaker = await read("src/components/products/cards/CardMaker.tsx");
  const cardPerformer = await read("src/components/products/cards/CardPerformer.tsx");

  assert.match(liveShell, /top-14[\s\S]*sm:top-4/);
  assert.match(liveShell, /max-w-\[calc\(100vw-4\.75rem\)\][\s\S]*sm:max-w-none/);
  assert.match(liveShell, /hidden sm:inline/);
  assert.match(liveShell, /topCenter \? "pt-24 sm:pt-0"/);

  assert.match(cardPerformer, /supportsCardVideoExport/);
  assert.match(cardPerformer, /if \(!blob\) throw new Error/);
  assert.match(cardPerformer, /if \(blob\.size === 0\) throw new Error/);
  assert.match(cardPerformer, /stream\.getTracks\(\)\.forEach/);
  assert.match(cardMaker, /catch \(error\)/);
  assert.match(cardMaker, /role="alert"/);
  assert.match(cardMaker, /Video unavailable/);
});
