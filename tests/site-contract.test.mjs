import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { test } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relative) => readFile(path.join(root, relative), "utf8");

test("canonical TasteLoop offers and positioning stay exact", async () => {
  const brand = await read("src/config/brand.ts");
  for (const expected of [
    "The difference is the loop.",
    "Human taste, built into every loop.",
    'name: "First Loop"',
    'price: "$2,500"',
    'timeline: "Delivered in 3 working days"',
    'name: "Product Loop"',
    'price: "$9,800"',
    'timeline: "One 30-day product cycle"',
  ]) assert.match(brand, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.doesNotMatch(brand, /Taste Review|\$499|\$3,500|7–10 working days|month to month/i);
  assert.doesNotMatch(brand, /siteUrl:\s*configuredSiteUrl\s*\|\|\s*"https:\/\/vibetoreal\.dev"/);
});

test("all preserved product routes still have implementations", async () => {
  for (const routeFile of [
    "src/app/shipped/page.tsx",
    "src/app/playground/page.tsx",
    "src/app/playground/flowtime/page.tsx",
    "src/app/playground/flowtime/live/page.tsx",
    "src/app/playground/cards/page.tsx",
    "src/app/playground/cards/live/page.tsx",
    "src/app/skills/page.tsx",
    "src/app/animations/page.tsx",
    "src/app/gradient/page.tsx",
  ]) assert.ok((await read(routeFile)).length > 0, `${routeFile} is missing`);
});

test("compatibility redirects and the Skills crawl contract remain intact", async () => {
  const config = await read("next.config.mjs");
  for (const source of ["/audit", "/build", "/pricing", "/pro", "/services", "/styles", "/styles/live", "/tools/vibe-audit"]) {
    assert.ok(config.includes(`source: "${source}"`), `missing redirect for ${source}`);
  }
  const robots = await read("src/app/robots.ts");
  assert.doesNotMatch(robots, /disallow:[\s\S]*"\/skills"/i);
  assert.match(robots, /"\/gradient"/);
  assert.match(config, /source:\s*"\/gradient"[\s\S]*destination:\s*"\/playground"[\s\S]*permanent:\s*false/);
  const sitemap = await read("src/app/sitemap.ts");
  assert.match(sitemap, /"\/skills"/);
  assert.match(sitemap, /QUALITY_SKILLS/);
  assert.doesNotMatch(sitemap, /"\/gradient"/);
  for (const publicChrome of ["src/components/Nav.tsx", "src/components/Footer.tsx", "src/content/site.ts"]) {
    assert.doesNotMatch(await read(publicChrome), /href:\s*"\/gradient"|href="\/gradient"/, `${publicChrome} publicly links AURORA`);
  }
});

test("shared Playground engine does not import a product consumer", async () => {
  const engineDir = path.join(root, "src/components/products/engine");
  const files = (await readdir(engineDir)).filter((file) => /\.[jt]sx?$/.test(file));
  for (const file of files) {
    const source = await readFile(path.join(engineDir, file), "utf8");
    assert.doesNotMatch(source, /from\s+["'][^"']*(?:flowtime|cards)\//, `${file} imports a product consumer`);
  }
});

test("user-facing source contains no old parent brand or retired offers", async () => {
  const roots = ["src/app", "src/components", "src/content"];
  const banned = /VibeToReal|Slop Rescue|Ship It Sprint|Fractional AI Product CTO|\$12\/mo|Taste Review|\$499/;

  async function walk(relative) {
    const entries = await readdir(path.join(root, relative), { withFileTypes: true });
    for (const entry of entries) {
      const child = path.join(relative, entry.name);
      if (entry.isDirectory()) await walk(child);
      else if (/\.(?:ts|tsx|md)$/.test(entry.name)) assert.doesNotMatch(await read(child), banned, `${child} contains retired copy`);
    }
  }

  for (const relative of roots) await walk(relative);
  for (const article of [
    "content/blog/design-problem-vs-pmf-problem.md",
    "content/blog/your-prototype-isnt-a-product.md",
  ]) {
    assert.doesNotMatch(await read(article), banned, `${article} contains retired public copy`);
  }
});

test("page metadata leaves the TasteLoop suffix to the root title template", async () => {
  async function walk(relative) {
    const entries = await readdir(path.join(root, relative), { withFileTypes: true });
    for (const entry of entries) {
      const child = path.join(relative, entry.name);
      if (entry.isDirectory()) await walk(child);
      else if (entry.name === "page.tsx") {
        assert.doesNotMatch(
          await read(child),
          /title\s*:[^\n]*\|\s*TasteLoop/,
          `${child} duplicates the root metadata title suffix`,
        );
      }
    }
  }

  await walk("src/app");
});

test("generated Skills mirror is a valid 40-package Agent Skills library", async () => {
  assert.doesNotMatch(await read("../skills/README.md"), /VibeToReal|https:\/\/vibetoreal\.dev/);
  const entries = (await readdir(path.join(root, "../skills"), { withFileTypes: true }))
    .filter((entry) => entry.isDirectory());
  assert.equal(entries.length, 40);

  for (const entry of entries) {
    const directory = path.join(root, "../skills", entry.name);
    const files = await readdir(directory);
    assert.deepEqual(files, ["SKILL.md"], `${entry.name} must contain only SKILL.md`);
    const source = await readFile(path.join(directory, "SKILL.md"), "utf8");
    const parsed = matter(source);
    assert.deepEqual(Object.keys(parsed.data), ["name", "description"]);
    assert.equal(parsed.data.name, entry.name);
    assert.match(parsed.data.name, /^[a-z0-9-]{1,64}$/);
    assert.equal(typeof parsed.data.description, "string");
    assert.ok(parsed.data.description.length > 20 && parsed.data.description.length <= 1024);
    assert.doesNotMatch(parsed.data.description, /[<>]/);
    assert.match(parsed.content, /^\s*# /);
    assert.match(parsed.content, /## Instructions/);
    assert.match(parsed.content, /## Hold the gate/);
  }
});

test("Skills have one canonical source and a scalable directory contract", async () => {
  await assert.rejects(read("src/content/skills.ts"));
  const qualitySkills = await read("src/data/qualitySkills.ts");
  assert.match(qualitySkills, /LAUNCH_QUALITY_SKILLS/);
  assert.match(qualitySkills, /export const QUALITY_SKILLS/);
  assert.doesNotMatch(qualitySkills, /QUALITY_SKILLS\.push/);

  const catalog = await read("src/data/skillsCatalog.ts");
  assert.match(catalog, /SKILLS_CATALOG_TOPICS/);
  assert.match(catalog, /SKILLS_CATALOG_PACKS/);

  const directory = await read("src/components/skills/SkillsLab.tsx");
  assert.doesNotMatch(directory, /ResizeObserver|grid-auto-rows/);
  assert.match(directory, /<dialog/);
  assert.match(directory, /Download SKILL\.md/);

  const detail = await read("src/app/skills/[slug]/page.tsx");
  assert.match(detail, /QUALITY_SKILLS/);
  assert.match(detail, /TechArticle/);
  assert.doesNotMatch(detail, /@\/content\/skills/);
});
