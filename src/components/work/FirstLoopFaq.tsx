import { ChevronDown } from "lucide-react";
import { FIRST_LOOP_FAQS } from "@/content/work";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FIRST_LOOP_FAQS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export function FirstLoopFaq() {
  return (
    <section
      aria-labelledby="first-loop-faq-title"
      className="section-rule mt-20 pt-20"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="grid gap-10 lg:grid-cols-[0.58fr_1.42fr]">
        <div>
          <p className="eyebrow">Before you start</p>
          <h2
            id="first-loop-faq-title"
            className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl"
          >
            First Loop, without the fine-print fog.
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/52">
            Clear scope, timing, ownership, and payment boundaries before you
            commit.
          </p>
        </div>

        <div className="divide-y divide-white/10 border-y border-white/10">
          {FIRST_LOOP_FAQS.map((item) => (
            <details key={item.question} className="group">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-5 py-5 text-left font-medium text-white/88 marker:content-none">
                <span>{item.question}</span>
                <ChevronDown
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 text-loop transition-transform duration-200 group-open:rotate-180"
                />
              </summary>
              <p className="max-w-3xl pb-5 pr-10 text-sm leading-relaxed text-white/56">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
