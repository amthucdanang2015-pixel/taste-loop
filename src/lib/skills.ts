import {
  PHASES,
  QUALITY_SKILLS,
  type QualitySkill,
} from "../data/qualitySkills";
import {
  LAUNCH_SKILL_METADATA,
  type LaunchQualitySkillSlug,
} from "../data/qualitySkills.launch";

export interface SkillSummary {
  slug: string;
  phase: QualitySkill["phase"];
  phaseName: string;
  title: string;
  oneLiner: string;
  stacks: QualitySkill["stacks"];
  gateCount: number;
  smellCount: number;
  essential: boolean;
}

export const LEGACY_SKILL_ALIASES: Readonly<Record<string, string>> = {
  "motion-taste": "motion-system",
  "landing-page": "copy-voice",
  "ai-saas-dashboard": "layout-composition",
  "backend-qa": "honest-api",
  "vibe-coding-qa": "launch-floor",
  "gtm-loop": "30-day-product-loop",
};

export function getQualitySkill(slug: string): QualitySkill | undefined {
  return QUALITY_SKILLS.find((skill) => skill.slug === slug);
}

export function getCanonicalSkillSlug(slug: string): string {
  return LEGACY_SKILL_ALIASES[slug] ?? slug;
}

export function getSkillPhaseName(skill: QualitySkill): string {
  return PHASES.find((phase) => phase.id === skill.phase)?.name ?? skill.phase;
}

export function toSkillSummary(skill: QualitySkill): SkillSummary {
  return {
    slug: skill.slug,
    phase: skill.phase,
    phaseName: getSkillPhaseName(skill),
    title: skill.title,
    oneLiner: skill.oneLiner,
    stacks: skill.stacks,
    gateCount: skill.gate.length,
    smellCount: skill.smells?.length ?? 0,
    essential: Boolean(skill.essential),
  };
}

export function getSkillTriggerDescription(skill: QualitySkill): string {
  const launchMetadata =
    LAUNCH_SKILL_METADATA[skill.slug as LaunchQualitySkillSlug];

  if (launchMetadata) return launchMetadata.triggerDescription;

  const phaseName = getSkillPhaseName(skill).toLowerCase();
  return `Applies “${skill.title}” as a repeatable product-quality gate. Use during ${phaseName} work when ${skill.oneLiner.toLowerCase()}`;
}

function checklist(items: readonly string[]): string {
  return items.map((item) => `- [ ] ${item}`).join("\n");
}

function bullets(items: readonly string[]): string {
  return items.map((item) => `- ${item}`).join("\n");
}

/**
 * Produce a portable Agent Skills package with the narrow frontmatter required
 * by the open Agent Skills specification. This same function powers downloads
 * and tests; the repository exporter mirrors the format for all 40 packages.
 */
export function skillMarkdown(skill: QualitySkill): string {
  const phaseName = getSkillPhaseName(skill);
  const smells =
    skill.smells && skill.smells.length > 0
      ? `\n## Detect the problem\n\n${bullets(skill.smells)}\n`
      : "";
  const verify = skill.verify
    ? `\n## Verify the result\n\n${skill.verify}\n`
    : "";

  return `---
name: ${skill.slug}
description: ${JSON.stringify(getSkillTriggerDescription(skill))}
---

# ${skill.title}

Apply this skill during **${phaseName}** work. It supports ${skill.stacks.join(", ")}.

${skill.oneLiner}

## Instructions

${skill.prompt}
${smells}
## Hold the gate

Do not declare this phase complete until every item passes:

${checklist(skill.gate)}
${verify}`;
}
