import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import {
  SkillsDirectoryLegend,
  SkillsLab,
} from "@/components/skills/SkillsLab";
import { BRAND, PRIMARY_CTA } from "@/config/brand";
import { PHASES, QUALITY_SKILLS } from "@/data/qualitySkills";
import {
  SKILLS_CATALOG_PACKS,
  SKILLS_CATALOG_PHASES,
  SKILLS_CATALOG_TOPICS,
} from "@/data/skillsCatalog";
import { toSkillSummary } from "@/lib/skills";

export const metadata: Metadata = {
  title: "Product and Agent Skills Directory",
  description:
    "40 original Agent Skills, 140 mapped product topics, and six focused flows for founders and builders who want AI speed without AI slop.",
  alternates: { canonical: "/skills" },
  openGraph: {
    title: "TasteLoop Skills — make better products with agents",
    description:
      "Installable Agent Skills, product-quality gates, and focused building flows from decision to launch.",
    type: "website",
  },
};

const skills = QUALITY_SKILLS.map(toSkillSummary);

const collectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "TasteLoop Product and Agent Skills Directory",
  description: metadata.description,
  url: `${BRAND.siteUrl}/skills`,
  hasPart: QUALITY_SKILLS.map((skill) => ({
    "@type": "TechArticle",
    name: skill.title,
    description: skill.oneLiner,
    url: `${BRAND.siteUrl}/skills/${skill.slug}`,
  })),
};

export default function SkillsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />

      <Reveal>
        <p className="eyebrow">Open Loop · product standards, published</p>
        <div className="mt-3 grid gap-8 lg:grid-cols-[1fr_0.72fr] lg:items-end">
          <h1 className="max-w-4xl text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">
            Skills for agents that still have to meet{" "}
            <span className="text-gradient">a human bar.</span>
          </h1>
          <p className="text-base leading-relaxed text-white/58">
            A focused library for deciding, designing, building, testing, and
            shipping. Each published skill is complete enough to install—not a
            thin prompt or an unreviewed directory listing.
          </p>
        </div>
      </Reveal>

      <Reveal>
        <div className="mt-9 grid overflow-hidden rounded-2xl border border-line bg-surface/55 sm:grid-cols-3">
          {[
            [String(QUALITY_SKILLS.length), "Original skills", "Portable SKILL.md packages"],
            [String(SKILLS_CATALOG_TOPICS.length), "Mapped topics", "Real questions across 14 phases"],
            [String(SKILLS_CATALOG_PACKS.length), "Focused flows", "Small skill sets in useful order"],
          ].map(([value, label, note]) => (
            <div
              key={label}
              className="border-b border-line p-5 last:border-0 sm:border-b-0 sm:border-r sm:last:border-r-0"
            >
              <p className="font-mono text-2xl font-semibold tracking-tight text-loop">
                {value}
              </p>
              <p className="mt-2 text-sm font-semibold">{label}</p>
              <p className="mt-1 text-[11px] text-white/38">{note}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal>
        <div className="mt-7">
          <SkillsDirectoryLegend />
        </div>
      </Reveal>

      <div className="mt-10">
        <SkillsLab
          skills={skills}
          qualityPhases={PHASES}
          catalogPhases={SKILLS_CATALOG_PHASES}
          topics={SKILLS_CATALOG_TOPICS}
          packs={SKILLS_CATALOG_PACKS}
        />
      </div>

      <Reveal>
        <div className="mt-16 flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-gradient-to-br from-loop/[0.09] to-signal/[0.07] p-5 sm:p-6">
          <div className="min-w-[15rem] flex-1">
            <p className="text-sm font-semibold">
              Need the system applied, not another resource list?
            </p>
            <p className="mt-1 text-[13px] leading-relaxed text-white/48">
              First Loop turns one hard product decision into working evidence
              in three working days.
            </p>
          </div>
          <Link
            href={PRIMARY_CTA.href}
            className="shrink-0 rounded-full bg-loop px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-white"
          >
            {PRIMARY_CTA.label}
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
