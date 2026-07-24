import { SKILLS, getSkill } from "@/content/skills";
import { getPattern } from "@/content/patterns";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { CopyBlock } from "@/components/CopyBlock";
import { CtaBlock } from "@/components/CtaBlock";

export function generateStaticParams() {
  return SKILLS.map((s) => ({ slug: s.slug }));
}

type SkillPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: SkillPageProps): Promise<Metadata> {
  const { slug } = await params;
  const s = getSkill(slug);
  if (!s) return { title: "Not found" };
  return { title: `${s.title} — paste into your AI agent`, description: s.description, openGraph: { title: s.title, description: s.description, type: "article" } };
}

export default async function SkillPage({ params }: SkillPageProps) {
  const { slug } = await params;
  const s = getSkill(slug);
  if (!s) notFound();
  const related = s.related.map(getPattern).filter(Boolean);

  return (
    <article className="mx-auto max-w-3xl px-6 pb-24 pt-32">
      <Link href="/skills" className="inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-white">
        <ArrowLeft className="h-4 w-4" /> All skills
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-muted">
        <span className="rounded-full border border-line px-2.5 py-1 text-white/70">Skill</span>
        {s.supports.map((t) => <span key={t} className="rounded-full bg-white/[0.04] px-2 py-0.5 text-white/50">{t}</span>)}
      </div>

      <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">{s.title}</h1>
      <p className="mt-4 text-lg leading-relaxed text-white/60">{s.description}</p>

      <Section title="Purpose"><p className="text-white/70">{s.purpose}</p></Section>
      <Section title="How to install / use"><p className="text-white/70">{s.install}</p></Section>

      <Section title="The skill — copy this into your agent">
        <CopyBlock text={s.skillPrompt} label="Skill prompt" />
      </Section>

      <Section title="Rules"><CheckList items={s.rules} /></Section>

      <Section title="Examples">
        <ul className="space-y-2">
          {s.examples.map((e) => <li key={e} className="text-sm leading-relaxed text-white/70">{e}</li>)}
        </ul>
      </Section>

      <Section title="Before / after">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-rose-400/20 bg-rose-400/[0.04] p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-rose-300/80">Before</p>
            <p className="mt-2 text-sm leading-relaxed text-white/70">{s.before}</p>
          </div>
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.04] p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-300/80">After</p>
            <p className="mt-2 text-sm leading-relaxed text-white/70">{s.after}</p>
          </div>
        </div>
      </Section>

      {related.length > 0 && (
        <Section title="Related patterns">
          <div className="flex flex-col gap-1.5">
            {related.map((r) => <Link key={r!.slug} href={`/patterns/${r!.slug}`} className="text-sm text-white/70 transition hover:text-accent2">{r!.title} →</Link>)}
          </div>
        </Section>
      )}

      <div className="mt-12">
        <CtaBlock text="Want this skill applied to a real product decision?" />
      </div>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-xs font-bold uppercase tracking-widest text-white/50">{title}</h2>
      <div className="mt-3 text-[15px] leading-relaxed">{children}</div>
    </section>
  );
}
function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((i) => <li key={i} className="flex gap-2 text-sm leading-relaxed text-white/75"><Check className="mt-0.5 h-4 w-4 shrink-0 text-accent2" /> {i}</li>)}
    </ul>
  );
}
