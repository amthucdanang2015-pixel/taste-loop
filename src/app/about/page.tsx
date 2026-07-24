import type { Metadata } from "next";
import { BRAND } from "@/config/brand";
import { PRINCIPLES } from "@/content/site";
import { CtaBlock } from "@/components/CtaBlock";
import { LeadForm } from "@/components/LeadForm";
import { PageHeader } from "@/components/PageHeader";
import { Wordmark } from "@/components/brand/Wordmark";

export const metadata: Metadata = {
  title: "About TasteLoop",
  description: "TasteLoop is a founder-led, agent-native product company built by Nam Nguyen and shaped by nearly ten years across product, design, engineering, QA, launch, and growth.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 pb-28 pt-32 sm:pt-36">
      <PageHeader eyebrow="About TasteLoop" title="Human taste, built into every loop." intro={BRAND.positioning} />

      <div className="mt-12 grid gap-10 text-[15px] leading-relaxed text-white/68 md:grid-cols-[0.7fr_1.3fr]">
        <div><Wordmark /><p className="mt-4 font-mono text-[10px] uppercase tracking-[0.15em] text-signal">The difference is the loop.</p></div>
        <div className="space-y-5">
          <p className="text-xl leading-relaxed text-white/82">AI gives every team more output. It does not decide which customer signal matters, which trade-off is worth making, or what evidence should change the plan.</p>
          <p>TasteLoop is built and led by {BRAND.founder.name}. I bring nearly ten years across product, design, engineering, QA, launch, and growth with real users, then use agents to create more options, faster working slices, tighter checks, and better continuity from one pass to the next.</p>
          <p>I lead every engagement and stay accountable for the decision, the quality gate, and what the evidence means. TasteLoop is not a generic AI agency or a feature-request conveyor belt. Agents make. Humans decide. Reality corrects the loop.</p>
          <p>Shipped shows the proof. Skills publishes the quality system. Playground, Animations, and AURORA are Open Loop: free tools and experiments that make the product taste visible.</p>
        </div>
      </div>

      <div className="mt-14 grid gap-2 sm:grid-cols-2">
        {PRINCIPLES.map((principle) => <p key={principle} className="rounded-xl border border-line bg-white/[0.02] px-4 py-3 text-sm text-white/68">{principle}</p>)}
      </div>

      <div className="mt-12"><CtaBlock /></div>

      <div className="mt-8 rounded-3xl border border-line bg-surface/75 p-6 sm:p-8">
        <h2 className="text-lg font-semibold">Occasional notes from the loop</h2>
        <p className="mt-1 text-sm text-white/55">New standards, product decisions, and hard-won lessons. No automated sales sequence.</p>
        <div className="mt-5">
          <LeadForm
            leadType="newsletter"
            compact
            fields={[{ name: "email", label: "Email", type: "email", required: true, placeholder: "you@company.com", autoComplete: "email" }]}
            submitLabel="Subscribe"
            successTitle="You’re in the loop."
            successBody="Watch your inbox for the next useful note."
          />
        </div>
      </div>
    </div>
  );
}
