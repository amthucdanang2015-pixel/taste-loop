import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowUpRight,
  Check,
  Download,
  FlaskConical,
} from "lucide-react";
import { CopyBlock } from "@/components/CopyBlock";
import { CtaBlock } from "@/components/CtaBlock";
import { BRAND } from "@/config/brand";
import { QUALITY_SKILLS } from "@/data/qualitySkills";
import {
  getCanonicalSkillSlug,
  getQualitySkill,
  getSkillPhaseName,
  getSkillTriggerDescription,
  LEGACY_SKILL_ALIASES,
  skillMarkdown,
} from "@/lib/skills";

export function generateStaticParams() {
  return QUALITY_SKILLS.map((skill) => ({ slug: skill.slug }));
}

type SkillPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({
  params,
}: SkillPageProps): Promise<Metadata> {
  const { slug } = await params;
  const canonicalSlug = getCanonicalSkillSlug(slug);
  const skill = getQualitySkill(canonicalSlug);
  if (!skill) return { title: "Skill not found" };

  return {
    title: `${skill.title} — Agent Skill`,
    description: getSkillTriggerDescription(skill),
    alternates: { canonical: `/skills/${canonicalSlug}` },
    openGraph: {
      title: `${skill.title} — TasteLoop Skill`,
      description: skill.oneLiner,
      type: "article",
    },
  };
}

export default async function SkillPage({ params }: SkillPageProps) {
  const { slug } = await params;
  const canonicalSlug = getCanonicalSkillSlug(slug);
  if (canonicalSlug !== slug && LEGACY_SKILL_ALIASES[slug]) {
    permanentRedirect(`/skills/${canonicalSlug}`);
  }

  const skill = getQualitySkill(canonicalSlug);
  if (!skill) notFound();

  const phaseName = getSkillPhaseName(skill);
  const portableSkill = skillMarkdown(skill);
  const related = QUALITY_SKILLS.filter(
    (candidate) =>
      candidate.phase === skill.phase && candidate.slug !== skill.slug,
  ).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: skill.title,
    description: getSkillTriggerDescription(skill),
    articleSection: phaseName,
    dateModified: "2026-07-28",
    url: `${BRAND.siteUrl}/skills/${skill.slug}`,
    author: {
      "@type": "Person",
      name: BRAND.founder.name,
    },
    publisher: {
      "@type": "Organization",
      name: BRAND.name,
      url: BRAND.siteUrl,
    },
  };

  return (
    <article className="mx-auto max-w-4xl px-6 pb-24 pt-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link
        href="/skills"
        className="inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Skills directory
      </Link>

      <div className="mt-7 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-loop/30 bg-loop/[0.06] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-loop">
          {phaseName}
        </span>
        {skill.essential ? (
          <span className="rounded-full border border-amber-300/25 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-amber-200">
            Essential
          </span>
        ) : null}
        <span className="text-[11px] text-white/35">
          {skill.gate.length}-point gate · {skill.stacks.join(" · ")}
        </span>
      </div>

      <h1 className="mt-5 max-w-3xl text-balance text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">
        {skill.title}
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/58">
        {skill.oneLiner}
      </p>

      <div className="mt-7 flex flex-wrap gap-2">
        <Link
          href={`/skills/${skill.slug}/download`}
          download
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-loop px-5 text-sm font-semibold text-ink transition hover:bg-white"
        >
          <Download className="h-4 w-4" />
          Download SKILL.md
        </Link>
        <a
          href="https://agentskills.io/specification"
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-5 text-sm text-white/65 transition hover:border-white/30 hover:text-white"
        >
          Agent Skills format
          <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>

      {skill.smells && skill.smells.length > 0 ? (
        <Section title="Use this when">
          <div className="grid gap-3 sm:grid-cols-3">
            {skill.smells.map((smell) => (
              <div
                key={smell}
                className="rounded-2xl border border-rose-400/15 bg-rose-400/[0.035] p-4"
              >
                <AlertTriangle className="h-4 w-4 text-rose-300/70" />
                <p className="mt-3 text-[13px] leading-relaxed text-white/58">
                  {smell}
                </p>
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      <Section title="The quality gate">
        <ul className="space-y-2.5 rounded-2xl border border-line bg-surface/55 p-5 sm:p-6">
          {skill.gate.map((item) => (
            <li
              key={item}
              className="flex gap-2.5 text-sm leading-relaxed text-white/72"
            >
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-loop" />
              {item}
            </li>
          ))}
        </ul>
        {skill.verify ? (
          <div className="mt-3 flex items-start gap-3 rounded-2xl border border-signal/20 bg-signal/[0.045] p-4 text-sm leading-relaxed text-white/62">
            <FlaskConical className="mt-0.5 h-4 w-4 shrink-0 text-signal" />
            <p>
              <span className="font-semibold text-white/82">Prove it:</span>{" "}
              {skill.verify}
            </p>
          </div>
        ) : null}
      </Section>

      <Section title="Install or copy">
        <p className="mb-5 max-w-3xl text-sm leading-relaxed text-white/55">
          Save the download as{" "}
          <code className="rounded bg-white/[0.05] px-1.5 py-0.5 text-loop">
            {skill.slug}/SKILL.md
          </code>{" "}
          in your agent&apos;s supported skills directory, or copy the complete
          package below. Load it only when its description matches the work.
        </p>
        <CopyBlock text={portableSkill} label="Portable SKILL.md" />
      </Section>

      {related.length > 0 ? (
        <Section title={`More ${phaseName.toLowerCase()} skills`}>
          <div className="grid gap-3 sm:grid-cols-3">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={`/skills/${item.slug}`}
                className="group rounded-2xl border border-line bg-surface/45 p-4 transition hover:border-loop/30"
              >
                <h3 className="text-sm font-semibold group-hover:text-loop">
                  {item.title}
                </h3>
                <p className="mt-2 text-[12px] leading-relaxed text-white/43">
                  {item.oneLiner}
                </p>
              </Link>
            ))}
          </div>
        </Section>
      ) : null}

      <div className="mt-12">
        <CtaBlock text="Want this quality gate applied to a real product decision?" />
      </div>
    </article>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-12">
      <h2 className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-white/42">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}
