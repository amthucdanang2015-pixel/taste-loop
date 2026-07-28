export * from "./types";
export { CATEGORIES, getCategory } from "./categories";
export { PATTERNS, getPattern, patternsByCategory } from "./patterns";
export { QUALITY_SKILLS as SKILLS } from "@/data/qualitySkills";
export { getQualitySkill as getSkill } from "@/lib/skills";
export { TEARDOWNS, getTeardown } from "./teardowns";

import { PATTERNS } from "./patterns";
import { TEARDOWNS } from "./teardowns";
import { QUALITY_SKILLS } from "@/data/qualitySkills";
import type { BaseDoc } from "./types";

export type SearchKind = "pattern" | "skill" | "teardown";
export interface SearchHit { kind: SearchKind; slug: string; title: string; description: string; tags: string[]; }

/** Simple in-memory search across content. Swap for a real index later. */
export function searchContent(q: string): SearchHit[] {
  const needle = q.trim().toLowerCase();
  if (!needle) return [];
  const score = (d: BaseDoc) => {
    const hay = `${d.title} ${d.description} ${d.tags.join(" ")}`.toLowerCase();
    return hay.includes(needle) ? (d.title.toLowerCase().includes(needle) ? 2 : 1) : 0;
  };
  const hits: SearchHit[] = [];
  for (const p of PATTERNS) if (score(p)) hits.push({ kind: "pattern", slug: p.slug, title: p.title, description: p.description, tags: p.tags });
  for (const skill of QUALITY_SKILLS) {
    const description = skill.oneLiner;
    const tags = [skill.phase, ...skill.stacks];
    const hay = `${skill.title} ${description} ${tags.join(" ")}`.toLowerCase();
    if (hay.includes(needle)) {
      hits.push({
        kind: "skill",
        slug: skill.slug,
        title: skill.title,
        description,
        tags,
      });
    }
  }
  for (const t of TEARDOWNS) if (score(t)) hits.push({ kind: "teardown", slug: t.slug, title: t.title, description: t.description, tags: t.tags });
  return hits;
}
