/**
 * Exports the Quality Skills library (src/data/qualitySkills.ts — the source of
 * truth) into the publishable /skills folder at the repo root (D-022).
 * Run from web/:  node scripts/export-skills.mjs
 */
import { execSync } from "node:child_process";
import { createRequire } from "node:module";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import url from "node:url";

const here = path.dirname(url.fileURLToPath(import.meta.url));
const webRoot = path.join(here, "..");
const out = path.join(webRoot, "..", "skills");

// compile the TS data file alone, then require the JS
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "skills-"));
execSync(`npx tsc src/data/qualitySkills.ts --target es2020 --module commonjs --skipLibCheck --outDir "${tmp}"`, { cwd: webRoot, stdio: "inherit" });
const require = createRequire(import.meta.url);
const { PHASES, METHODOLOGIES, QUALITY_SKILLS } = require(path.join(tmp, "qualitySkills.js"));

// clean slate: remove README + phase dirs, regenerate everything
if (fs.existsSync(out)) fs.rmSync(out, { recursive: true });
fs.mkdirSync(out, { recursive: true });

const bySlugPhase = (p) => QUALITY_SKILLS.filter((s) => s.phase === p.id);

let readme = `# Quality Skills — gates & taste for every phase of shipping

Anti-slop skills for the **whole software lifecycle**, not just frontend. Each skill is two things:

- **The skill** — a standing instruction you paste into your AI agent (Claude, Cursor, Copilot…).
- **The gate** — the checklist the phase must pass before it exits. No gate, no exit.

Born from shipping real products at TasteLoop — every rule traces to a real scar.

## The model — nine phases of real delivery

| # | Phase | The question it answers | Covers |
|---|-------|-------------------------|--------|
${PHASES.map((p, i) => `| ${i + 1} | [${p.name}](./${p.id}/) | ${p.question} | ${p.covers} |`).join("\n")}

Data & auth live **inside backend** (they're backend duties, not a lifecycle stage). Motion, first-run, and copy live **inside design**. Unit tests and review bars live **inside quality**.

## Methodologies — same gates, different loops

${METHODOLOGIES.map((m) => `- **${m.name}** — ${m.how}\n  Loop: ${m.loop.join(" → ")}`).join("\n")}

## The skills

Skills marked **★** are the **Essential 10** — the highest damage-prevented-per-minute set. If you adopt nothing else, adopt those.

`;

for (const p of PHASES) {
  const skills = bySlugPhase(p);
  if (!skills.length) continue;
  readme += `### ${p.name} — *${p.question}*\n\n`;
  const dir = path.join(out, p.id);
  fs.mkdirSync(dir, { recursive: true });
  for (const s of skills) {
    readme += `- [**${s.title}**](./${p.id}/${s.slug}.md)${s.essential ? " ★" : ""} — ${s.oneLiner}\n`;
    const smells = s.smells?.length ? `\n## Smells like slop — you have this problem if…\n\n${s.smells.map((x) => `- ${x}`).join("\n")}\n` : "";
    const verify = s.verify ? `\n## Prove it\n\n${s.verify}\n` : "";
    const md = `# ${s.title}${s.essential ? " ★" : ""}

> **Phase:** ${p.name} · **Applies to:** ${s.stacks.join(", ")}${s.essential ? " · **One of the Essential 10**" : ""}

${s.oneLiner}
${smells}
## The gate — the phase doesn't exit until

${s.gate.map((g) => `- [ ] ${g}`).join("\n")}
${verify}
## The skill — paste into your agent

\`\`\`
${s.prompt}
\`\`\`
`;
    fs.writeFileSync(path.join(dir, `${s.slug}.md`), md);
  }
  readme += "\n";
}

readme += `---

Generated from \`web/src/data/qualitySkills.ts\` by \`web/scripts/export-skills.mjs\` — edit the source, not these files.
MIT licensed. PRs that add a scar-backed gate are welcome; PRs that add ceremony are not.
`;
fs.writeFileSync(path.join(out, "README.md"), readme);
fs.rmSync(tmp, { recursive: true, force: true });
console.log(`Exported ${QUALITY_SKILLS.length} skills across ${PHASES.length} phases → ${out}`);
