/**
 * Export the canonical Quality Skills registry as portable Agent Skills.
 *
 * Run from web/: node scripts/export-skills.mjs
 * Output: ../skills/<skill-name>/SKILL.md
 */
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import url from "node:url";

const here = path.dirname(url.fileURLToPath(import.meta.url));
const webRoot = path.join(here, "..");
const outputRoot = path.join(webRoot, "..", "skills");
const checkOnly = process.argv.includes("--check");
const temporaryBuild = fs.mkdtempSync(
  path.join(os.tmpdir(), "tasteloop-skills-"),
);
const require = createRequire(import.meta.url);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

try {
  execFileSync(
    path.join(webRoot, "node_modules", ".bin", "tsc"),
    [
      "src/lib/skills.ts",
      "src/data/skillsCatalog.ts",
      "--target",
      "es2020",
      "--module",
      "commonjs",
      "--moduleResolution",
      "node",
      "--rootDir",
      "src",
      "--outDir",
      temporaryBuild,
      "--skipLibCheck",
      "--esModuleInterop",
    ],
    { cwd: webRoot, stdio: "inherit" },
  );

  const { PHASES, QUALITY_SKILLS } = require(
    path.join(temporaryBuild, "data", "qualitySkills.js"),
  );
  const { getSkillTriggerDescription, skillMarkdown } = require(
    path.join(temporaryBuild, "lib", "skills.js"),
  );
  const { SKILLS_CATALOG_PACKS, SKILLS_CATALOG_TOPICS } = require(
    path.join(temporaryBuild, "data", "skillsCatalog.js"),
  );

  const slugs = QUALITY_SKILLS.map((skill) => skill.slug);
  const slugSet = new Set(slugs);
  assert(slugs.length === 40, `Expected 40 skills; found ${slugs.length}.`);
  assert(slugSet.size === slugs.length, "Skill slugs must be unique.");
  assert(
    SKILLS_CATALOG_TOPICS.length >= 100,
    "The product-topic map must contain at least 100 useful topics.",
  );
  assert(
    new Set(SKILLS_CATALOG_TOPICS.map((topic) => topic.slug)).size ===
      SKILLS_CATALOG_TOPICS.length,
    "Topic slugs must be unique.",
  );
  assert(
    SKILLS_CATALOG_PACKS.length === 6,
    `Expected 6 focused flows; found ${SKILLS_CATALOG_PACKS.length}.`,
  );

  for (const topic of SKILLS_CATALOG_TOPICS) {
    for (const slug of topic.skillSlugs) {
      assert(
        slugSet.has(slug),
        `Topic "${topic.slug}" points to unknown skill "${slug}".`,
      );
    }
  }

  for (const pack of SKILLS_CATALOG_PACKS) {
    assert(
      pack.steps.length >= 5 && pack.steps.length <= 7,
      `Flow "${pack.slug}" must contain 5–7 focused steps.`,
    );
    for (const step of pack.steps) {
      assert(
        slugSet.has(step.skillSlug),
        `Flow "${pack.slug}" points to unknown skill "${step.skillSlug}".`,
      );
    }
  }

  if (!checkOnly) {
    fs.rmSync(outputRoot, { recursive: true, force: true });
    fs.mkdirSync(outputRoot, { recursive: true });
  }

  for (const skill of QUALITY_SKILLS) {
    const skillDirectory = path.join(outputRoot, skill.slug);
    const markdown = skillMarkdown(skill);
    const description = getSkillTriggerDescription(skill);
    const frontmatter = markdown.match(/^---\n([\s\S]*?)\n---/);

    assert(
      /^[a-z0-9-]{1,64}$/.test(skill.slug),
      `Invalid Agent Skill name: ${skill.slug}`,
    );
    assert(frontmatter, `Missing frontmatter for ${skill.slug}.`);
    assert(
      description.length <= 1024,
      `${skill.slug} description exceeds 1,024 characters.`,
    );
    assert(
      !description.includes("<") && !description.includes(">"),
      `${skill.slug} description may not contain angle brackets.`,
    );
    const frontmatterKeys = frontmatter[1]
      .split("\n")
      .map((line) => line.split(":")[0]);
    assert(
      frontmatterKeys.join(",") === "name,description",
      `${skill.slug} frontmatter must contain only name and description.`,
    );

    if (checkOnly) {
      assert(
        fs.existsSync(path.join(skillDirectory, "SKILL.md")),
        `Generated package missing for ${skill.slug}.`,
      );
      assert(
        fs.readFileSync(path.join(skillDirectory, "SKILL.md"), "utf8") ===
          markdown,
        `${skill.slug}/SKILL.md is stale; run the exporter.`,
      );
    } else {
      fs.mkdirSync(skillDirectory, { recursive: true });
      fs.writeFileSync(path.join(skillDirectory, "SKILL.md"), markdown);
    }
  }

  let readme = `# TasteLoop Skills

Portable product-quality skills for agents that still have to meet a human bar.

- **${QUALITY_SKILLS.length} authored skills** — each has a trigger, instruction, warning signs, a gate, and a proof test.
- **${SKILLS_CATALOG_TOPICS.length} product topics** — editorial navigation on [the TasteLoop Skills directory](https://www.tasteloop.work/skills), not thin generated skills.
- **${SKILLS_CATALOG_PACKS.length} focused flows** — small ordered sets for common product jobs.

## Install

Copy one complete folder into the skills directory supported by your agent. Keep the folder name and the \`name\` in \`SKILL.md\` identical. Skills use the open [Agent Skills specification](https://agentskills.io/specification).

Load the smallest set that matches the job. Do not concatenate the whole library into every agent session.

## Skills

`;

  for (const phase of PHASES) {
    const phaseSkills = QUALITY_SKILLS.filter(
      (skill) => skill.phase === phase.id,
    );
    if (phaseSkills.length === 0) continue;

    readme += `### ${phase.name}\n\n${phase.question}\n\n`;
    for (const skill of phaseSkills) {
      readme += `- [**${skill.title}**](./${skill.slug}/SKILL.md)${skill.essential ? " · Essential" : ""} — ${skill.oneLiner}\n`;
    }
    readme += "\n";
  }

  readme += `## Focused flows

${SKILLS_CATALOG_PACKS.map(
  (pack) =>
    `- **${pack.title}** — ${pack.promise}\n  ${pack.steps.map((step) => step.skillSlug).join(" → ")}`,
).join("\n")}

---

Generated from \`web/src/data/qualitySkills.ts\`, \`web/src/data/qualitySkills.launch.ts\`, and \`web/src/data/skillsCatalog.ts\` by \`web/scripts/export-skills.mjs\`. Edit the canonical source, then regenerate and validate the packages.
`;
  if (!checkOnly) {
    fs.writeFileSync(path.join(outputRoot, "README.md"), readme);
  }

  const packageFiles = fs
    .readdirSync(outputRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(outputRoot, entry.name, "SKILL.md"));
  assert(
    packageFiles.length === QUALITY_SKILLS.length &&
      packageFiles.every((file) => fs.existsSync(file)),
    "Every exported skill folder must contain exactly one SKILL.md entry point.",
  );

  console.log(
    checkOnly
      ? `Verified ${QUALITY_SKILLS.length} Agent Skills against their canonical source.`
      : `Exported ${QUALITY_SKILLS.length} Agent Skills, ${SKILLS_CATALOG_TOPICS.length} topics, and ${SKILLS_CATALOG_PACKS.length} focused flows to ${outputRoot}`,
  );
} finally {
  fs.rmSync(temporaryBuild, { recursive: true, force: true });
}
