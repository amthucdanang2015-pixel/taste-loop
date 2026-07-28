"use client";

import Link from "next/link";
import {
  type MouseEvent as ReactMouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  AlertTriangle,
  ArrowUpRight,
  Check,
  Copy,
  Download,
  FlaskConical,
  Layers3,
  Library,
  Map as MapIcon,
  Search,
  ShieldCheck,
  Star,
  X,
} from "lucide-react";
import type { Phase, QualitySkill } from "@/data/qualitySkills";
import type {
  SkillsCatalogPack,
  SkillsCatalogPhase,
  SkillsCatalogTopic,
} from "@/data/skillsCatalog";
import type { SkillSummary } from "@/lib/skills";
import { copyText } from "@/lib/copyText";

type DirectoryMode = "skills" | "topics" | "flows";

interface SkillsLabProps {
  skills: SkillSummary[];
  qualityPhases: Phase[];
  catalogPhases: readonly SkillsCatalogPhase[];
  topics: readonly SkillsCatalogTopic[];
  packs: readonly SkillsCatalogPack[];
}

const MODE_OPTIONS: ReadonlyArray<{
  id: DirectoryMode;
  label: string;
  description: string;
}> = [
  {
    id: "skills",
    label: "Installable skills",
    description: "40 complete instructions and release gates",
  },
  {
    id: "topics",
    label: "Product topics",
    description: "140 questions mapped to useful skills",
  },
  {
    id: "flows",
    label: "Focused flows",
    description: "6 ordered paths for common product jobs",
  },
];

export function SkillsLab({
  skills,
  qualityPhases,
  catalogPhases,
  topics,
  packs,
}: SkillsLabProps) {
  const [mode, setMode] = useState<DirectoryMode>("skills");
  const [phase, setPhase] = useState("all");
  const [query, setQuery] = useState("");
  const [essentialOnly, setEssentialOnly] = useState(false);
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [detail, setDetail] = useState<QualitySkill | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const lastTriggerRef = useRef<HTMLAnchorElement | null>(null);
  const reduceMotion = useReducedMotion();

  const skillBySlug = useMemo(
    () => new Map(skills.map((skill) => [skill.slug, skill])),
    [skills],
  );
  const openSummary = openSlug ? skillBySlug.get(openSlug) : undefined;

  const visibleSkills = useMemo(() => {
    const term = query.trim().toLowerCase();
    return skills.filter(
      (skill) =>
        (phase === "all" || skill.phase === phase) &&
        (!essentialOnly || skill.essential) &&
        (!term ||
          `${skill.title} ${skill.oneLiner} ${skill.phaseName} ${skill.stacks.join(" ")}`
            .toLowerCase()
            .includes(term)),
    );
  }, [essentialOnly, phase, query, skills]);

  const visibleTopics = useMemo(() => {
    const term = query.trim().toLowerCase();
    return topics.filter(
      (topic) =>
        (phase === "all" || topic.phase === phase) &&
        (!term ||
          `${topic.title} ${topic.question} ${topic.phase}`
            .toLowerCase()
            .includes(term)),
    );
  }, [phase, query, topics]);

  const visiblePacks = useMemo(() => {
    const term = query.trim().toLowerCase();
    return packs.filter(
      (pack) =>
        !term ||
        `${pack.title} ${pack.promise} ${pack.steps.map((step) => step.why).join(" ")}`
          .toLowerCase()
          .includes(term),
    );
  }, [packs, query]);

  const syncFromUrl = useCallback(() => {
    const slug = decodeURIComponent(window.location.hash.slice(1));
    setOpenSlug(skillBySlug.has(slug) ? slug : null);
  }, [skillBySlug]);

  useEffect(() => {
    syncFromUrl();
    window.addEventListener("popstate", syncFromUrl);
    window.addEventListener("hashchange", syncFromUrl);
    return () => {
      window.removeEventListener("popstate", syncFromUrl);
      window.removeEventListener("hashchange", syncFromUrl);
    };
  }, [syncFromUrl]);

  useEffect(() => {
    if (!openSlug) {
      setDetail(null);
      return;
    }

    let current = true;
    void import("@/data/qualitySkills").then(({ QUALITY_SKILLS }) => {
      if (!current) return;
      setDetail(
        QUALITY_SKILLS.find((skill) => skill.slug === openSlug) ?? null,
      );
    });
    return () => {
      current = false;
    };
  }, [openSlug]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (openSlug && dialog && !dialog.open) dialog.showModal();
  }, [openSlug]);

  function changeMode(nextMode: DirectoryMode) {
    setMode(nextMode);
    setPhase("all");
    setEssentialOnly(false);
    setQuery("");
  }

  function openSkill(
    event: ReactMouseEvent<HTMLAnchorElement>,
    slug: string,
  ) {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    lastTriggerRef.current = event.currentTarget;
    window.history.pushState(
      { ...window.history.state, tasteLoopSkill: slug },
      "",
      `/skills#${slug}`,
    );
    setOpenSlug(slug);
  }

  function closeSkill() {
    const activeState = window.history.state as
      | { tasteLoopSkill?: string }
      | null;

    if (activeState?.tasteLoopSkill === openSlug) {
      window.history.back();
      return;
    }

    window.history.replaceState(null, "", "/skills");
    setOpenSlug(null);
  }

  function finishClosing() {
    if (openSlug) return;
    dialogRef.current?.close();
    lastTriggerRef.current?.focus();
  }

  const activePhases =
    mode === "skills" ? qualityPhases : mode === "topics" ? catalogPhases : [];
  const resultCount =
    mode === "skills"
      ? visibleSkills.length
      : mode === "topics"
        ? visibleTopics.length
        : visiblePacks.length;

  return (
    <div>
      <div
        className="grid gap-2 rounded-2xl border border-line bg-white/[0.025] p-2 sm:grid-cols-3"
        role="tablist"
        aria-label="Skills directory views"
      >
        {MODE_OPTIONS.map((option) => {
          const active = mode === option.id;
          return (
            <button
              key={option.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => changeMode(option.id)}
              className={`rounded-xl border px-4 py-3 text-left transition ${
                active
                  ? "border-loop/45 bg-loop/[0.08] text-white"
                  : "border-transparent text-white/58 hover:border-line hover:bg-white/[0.025] hover:text-white"
              }`}
            >
              <span className="block text-sm font-semibold">{option.label}</span>
              <span className="mt-1 block text-[11px] leading-relaxed text-white/42">
                {option.description}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 rounded-2xl border border-line bg-surface/65 p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="flex min-h-11 flex-1 items-center gap-2 rounded-xl border border-line bg-black/30 px-3 transition focus-within:border-loop/45">
            <Search className="h-4 w-4 shrink-0 text-white/38" />
            <span className="sr-only">Search the Skills directory</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={
                mode === "skills"
                  ? "Search skills, phases, or stacks"
                  : mode === "topics"
                    ? "Search a product question"
                    : "Search a focused flow"
              }
              className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/30"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="rounded-md p-1 text-white/38 transition hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </label>
          {mode === "skills" ? (
            <button
              type="button"
              aria-pressed={essentialOnly}
              onClick={() => setEssentialOnly((current) => !current)}
              className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-4 text-sm transition ${
                essentialOnly
                  ? "border-amber-300/45 bg-amber-300/[0.08] text-amber-100"
                  : "border-line text-white/55 hover:border-white/25 hover:text-white"
              }`}
            >
              <Star
                className={`h-4 w-4 ${
                  essentialOnly ? "fill-amber-300 text-amber-300" : ""
                }`}
              />
              Essential 10
            </button>
          ) : null}
        </div>

        {activePhases.length > 0 ? (
          <div
            className="scroll-slim mt-4 flex gap-2 overflow-x-auto pb-1"
            aria-label="Filter by product phase"
          >
            <PhaseButton
              active={phase === "all"}
              label="All phases"
              onClick={() => setPhase("all")}
            />
            {activePhases.map((item) => (
              <PhaseButton
                key={item.id}
                active={phase === item.id}
                label={"name" in item ? item.name : item.title}
                onClick={() => setPhase(item.id)}
              />
            ))}
          </div>
        ) : null}

        <p className="mt-4 text-[12px] text-white/42" aria-live="polite">
          {resultCount} {mode === "skills" ? "skills" : mode === "topics" ? "topics" : "flows"}
          {query ? ` matching “${query}”` : ""}
        </p>
      </div>

      {mode === "skills" ? (
        <section className="mt-5" aria-label="Installable product skills">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {visibleSkills.map((skill) => (
              <SkillCard
                key={skill.slug}
                skill={skill}
                reduceMotion={Boolean(reduceMotion)}
                onOpen={openSkill}
              />
            ))}
          </div>
          {visibleSkills.length === 0 ? <EmptyState /> : null}
        </section>
      ) : null}

      {mode === "topics" ? (
        <section className="mt-5" aria-label="Product topics">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {visibleTopics.map((topic) => {
              const phaseName =
                catalogPhases.find((item) => item.id === topic.phase)?.title ??
                topic.phase;
              return (
                <article
                  key={topic.slug}
                  className="rounded-2xl border border-line bg-surface/55 p-5"
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-signal">
                    {phaseName}
                  </p>
                  <h3 className="mt-3 text-base font-semibold tracking-tight">
                    {topic.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-white/52">
                    {topic.question}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {topic.skillSlugs.map((slug) => {
                      const skill = skillBySlug.get(slug);
                      if (!skill) return null;
                      return (
                        <Link
                          key={slug}
                          href={`/skills/${slug}`}
                          onClick={(event) => openSkill(event, slug)}
                          className="rounded-full border border-line px-2.5 py-1 text-[10px] text-white/52 transition hover:border-loop/35 hover:text-loop"
                        >
                          {skill.title}
                        </Link>
                      );
                    })}
                  </div>
                </article>
              );
            })}
          </div>
          {visibleTopics.length === 0 ? <EmptyState /> : null}
        </section>
      ) : null}

      {mode === "flows" ? (
        <section className="mt-5 grid gap-4 lg:grid-cols-2" aria-label="Focused skill flows">
          {visiblePacks.map((pack) => (
            <article
              key={pack.slug}
              className="rounded-2xl border border-line bg-surface/65 p-5 sm:p-6"
            >
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-loop/25 bg-loop/[0.08]">
                  <Layers3 className="h-5 w-5 text-loop" />
                </span>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">
                    {pack.title}
                  </h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-white/52">
                    {pack.promise}
                  </p>
                </div>
              </div>
              <ol className="mt-5 space-y-2">
                {pack.steps.map((step, index) => {
                  const skill = skillBySlug.get(step.skillSlug);
                  if (!skill) return null;
                  return (
                    <li
                      key={`${pack.slug}-${step.skillSlug}-${index}`}
                      className="grid grid-cols-[1.5rem_1fr] gap-2 border-t border-white/[0.06] pt-3 first:border-0 first:pt-0"
                    >
                      <span className="font-mono text-[11px] text-loop">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <Link
                          href={`/skills/${skill.slug}`}
                          onClick={(event) => openSkill(event, skill.slug)}
                          className="text-sm font-medium text-white/82 transition hover:text-loop"
                        >
                          {skill.title}
                        </Link>
                        <p className="mt-0.5 text-[12px] leading-relaxed text-white/42">
                          {step.why}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </article>
          ))}
          {visiblePacks.length === 0 ? <EmptyState /> : null}
        </section>
      ) : null}

      <dialog
        ref={dialogRef}
        className="skill-dialog"
        aria-labelledby={openSlug ? `skill-dialog-title-${openSlug}` : undefined}
        onCancel={(event) => {
          event.preventDefault();
          closeSkill();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeSkill();
        }}
      >
        <AnimatePresence onExitComplete={finishClosing}>
          {openSlug && openSummary ? (
            <motion.article
              key={openSlug}
              layoutId={reduceMotion ? undefined : `skill-${openSlug}`}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
              transition={{
                duration: reduceMotion ? 0.08 : 0.28,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="skill-dialog-panel"
            >
              <div className="skill-dialog-rail">
                <span>Quality skill</span>
                <span>{openSummary.phaseName}</span>
                <span>{openSummary.gateCount}-point gate</span>
              </div>
              <div className="skill-dialog-content">
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.17em] text-signal">
                      {openSummary.phaseName} · Agent Skill
                    </p>
                    <h2
                      id={`skill-dialog-title-${openSlug}`}
                      className="mt-3 max-w-3xl text-2xl font-semibold tracking-[-0.04em] sm:text-4xl"
                    >
                      {openSummary.title}
                    </h2>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/55 sm:text-base">
                      {openSummary.oneLiner}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closeSkill}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line text-white/55 transition hover:border-white/30 hover:text-white"
                    aria-label={`Close ${openSummary.title}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {detail ? (
                  <SkillDetail detail={detail} />
                ) : (
                  <div
                    className="mt-8 h-44 animate-pulse rounded-2xl border border-line bg-white/[0.025]"
                    aria-label="Loading skill"
                  />
                )}

                <div className="mt-7 flex flex-wrap items-center gap-2 border-t border-line pt-5">
                  {detail ? (
                    <CopyButton text={detail.prompt} label="Copy agent instruction" />
                  ) : null}
                  <Link
                    href={`/skills/${openSlug}/download`}
                    download
                    className="inline-flex min-h-10 items-center gap-2 rounded-full border border-line px-4 text-xs font-medium text-white/72 transition hover:border-white/30 hover:text-white"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download SKILL.md
                  </Link>
                  <Link
                    href={`/skills/${openSlug}`}
                    className="inline-flex min-h-10 items-center gap-2 rounded-full px-3 text-xs font-medium text-loop transition hover:text-white"
                  >
                    Permanent page
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ) : null}
        </AnimatePresence>
      </dialog>
    </div>
  );
}

function SkillCard({
  skill,
  reduceMotion,
  onOpen,
}: {
  skill: SkillSummary;
  reduceMotion: boolean;
  onOpen: (
    event: ReactMouseEvent<HTMLAnchorElement>,
    slug: string,
  ) => void;
}) {
  return (
    <Link
      href={`/skills/${skill.slug}`}
      onClick={(event) => onOpen(event, skill.slug)}
      className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-loop focus-visible:ring-offset-4 focus-visible:ring-offset-ink"
    >
      <motion.article
        layoutId={reduceMotion ? undefined : `skill-${skill.slug}`}
        className="h-full rounded-2xl border border-line bg-surface/65 p-5 transition group-hover:-translate-y-0.5 group-hover:border-loop/32 group-focus-visible:border-loop/45"
      >
        <div className="flex items-start justify-between gap-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-signal">
            {skill.phaseName}
          </p>
          <div className="flex items-center gap-2">
            {skill.essential ? (
              <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-[0.12em] text-amber-200/80">
                <Star className="h-2.5 w-2.5 fill-amber-300 text-amber-300" />
                Essential
              </span>
            ) : null}
            <ArrowUpRight className="h-4 w-4 text-white/22 transition group-hover:text-loop" />
          </div>
        </div>
        <h3 className="mt-4 text-lg font-semibold tracking-tight">
          {skill.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-white/52">
          {skill.oneLiner}
        </p>
        <p className="mt-5 text-[11px] text-white/34">
          {skill.gateCount}-point gate · {skill.smellCount} warning signs
        </p>
      </motion.article>
    </Link>
  );
}

function SkillDetail({ detail }: { detail: QualitySkill }) {
  return (
    <div className="mt-8 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-2xl border border-line bg-black/20 p-4 sm:p-5">
        <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">
          <ShieldCheck className="h-4 w-4 text-loop" />
          The gate
        </p>
        <ul className="mt-4 space-y-2.5">
          {detail.gate.map((gate) => (
            <li
              key={gate}
              className="flex items-start gap-2 text-[13px] leading-relaxed text-white/68"
            >
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-loop" />
              {gate}
            </li>
          ))}
        </ul>
        {detail.verify ? (
          <p className="mt-4 flex items-start gap-2 border-t border-line pt-4 text-[12px] leading-relaxed text-white/55">
            <FlaskConical className="mt-0.5 h-4 w-4 shrink-0 text-accent2" />
            <span>
              <span className="font-semibold text-white/72">Prove it:</span>{" "}
              {detail.verify}
            </span>
          </p>
        ) : null}
      </section>

      <div className="space-y-4">
        {detail.smells && detail.smells.length > 0 ? (
          <section className="rounded-2xl border border-rose-400/15 bg-rose-400/[0.035] p-4 sm:p-5">
            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-rose-200/58">
              <AlertTriangle className="h-4 w-4" />
              Warning signs
            </p>
            <ul className="mt-3 space-y-2">
              {detail.smells.map((smell) => (
                <li
                  key={smell}
                  className="text-[12px] leading-relaxed text-white/55"
                >
                  {smell}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
        <section className="rounded-2xl border border-line bg-black/20 p-4 sm:p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">
            Agent instruction
          </p>
          <pre className="scroll-slim mt-3 max-h-72 overflow-y-auto whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-white/58">
            {detail.prompt}
          </pre>
        </section>
      </div>
    </div>
  );
}

function PhaseButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`min-h-9 shrink-0 rounded-full border px-3 text-[11px] transition ${
        active
          ? "border-loop/45 bg-loop/[0.08] text-white"
          : "border-line text-white/48 hover:border-white/25 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}

function EmptyState() {
  return (
    <div className="mt-5 rounded-2xl border border-dashed border-line px-5 py-10 text-center">
      <p className="text-sm text-white/48">
        No exact match. Try a broader phase or a shorter question.
      </p>
    </div>
  );
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");

  async function copy() {
    setStatus((await copyText(text)) ? "copied" : "error");
  }

  return (
    <>
      <button
        type="button"
        onClick={copy}
        className="inline-flex min-h-10 items-center gap-2 rounded-full bg-loop px-4 text-xs font-semibold text-ink transition hover:bg-white"
      >
        {status === "copied" ? (
          <Check className="h-3.5 w-3.5" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
        {status === "copied"
          ? "Instruction copied"
          : status === "error"
            ? "Copy failed — retry"
            : label}
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {status === "copied"
          ? "Agent instruction copied."
          : status === "error"
            ? "Copy failed. Try again."
            : ""}
      </span>
    </>
  );
}

export function SkillsDirectoryLegend() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {[
        {
          icon: Library,
          title: "Skills are complete",
          body: "Every skill includes a trigger, instruction, failure signals, a quality gate, and a proof test.",
        },
        {
          icon: MapIcon,
          title: "Topics help you find",
          body: "Topics are editorial navigation—not thin skills. Each one maps a real product question to authored skills.",
        },
        {
          icon: Layers3,
          title: "Flows provide order",
          body: "Focused flows sequence the smallest useful skill set for a specific job without flooding agent context.",
        },
      ].map(({ icon: Icon, title, body }) => (
        <div
          key={title}
          className="rounded-2xl border border-line bg-white/[0.02] p-4"
        >
          <Icon className="h-4 w-4 text-loop" />
          <p className="mt-3 text-sm font-semibold">{title}</p>
          <p className="mt-1 text-[12px] leading-relaxed text-white/43">
            {body}
          </p>
        </div>
      ))}
    </div>
  );
}
