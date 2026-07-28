import type { NextRequest } from "next/server";
import {
  getCanonicalSkillSlug,
  getQualitySkill,
  skillMarkdown,
} from "@/lib/skills";

type DownloadRouteContext = { params: Promise<{ slug: string }> };

export async function GET(
  request: NextRequest,
  { params }: DownloadRouteContext,
) {
  const { slug } = await params;
  const canonicalSlug = getCanonicalSkillSlug(slug);
  const skill = getQualitySkill(canonicalSlug);

  if (!skill) {
    return Response.json(
      { ok: false, error: "skill_not_found" },
      { status: 404 },
    );
  }

  if (canonicalSlug !== slug) {
    return Response.redirect(
      new URL(`/skills/${canonicalSlug}/download`, request.url),
      308,
    );
  }

  return new Response(skillMarkdown(skill), {
    status: 200,
    headers: {
      "Cache-Control": "public, max-age=300, s-maxage=86400",
      "Content-Disposition": `attachment; filename="${skill.slug}-SKILL.md"`,
      "Content-Type": "text/markdown; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
