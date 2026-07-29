import { BRAND, PRIMARY_OFFER, WORK_MODEL } from "@/config/brand";

export interface WorkFaq {
  question: string;
  answer: string;
}

export const FIRST_LOOP_FAQS: WorkFaq[] = [
  {
    question: "What happens after I submit?",
    answer:
      "Nam reads every message and normally replies within 24 hours. If First Loop is the right fit, we confirm the decision, boundaries, access, start date, and payment details before you commit.",
  },
  {
    question: "When does First Loop start?",
    answer:
      "Payment is made against an agreed start date. As soon as payment clears and the required access is ready, work begins immediately; that starts the three-working-day delivery window.",
  },
  {
    question: "What will I have after three working days?",
    answer:
      "A decision brief, one testable prototype or critical working slice, product and production direction, a prioritized 30-day product bet, and a recorded recommendation to ship, change, narrow, or stop.",
  },
  {
    question: "Is this a complete product build?",
    answer:
      "Not necessarily. First Loop creates the smallest working evidence needed to resolve one important decision. A larger production build belongs in Product Loop only when the evidence supports it.",
  },
  {
    question: "Who does the work?",
    answer: `${BRAND.founder.name} leads every First Loop and owns direction, trade-offs, and final quality. ${BRAND.team} Coordinated agents accelerate research, design, engineering, and QA. You know who is involved and why.`,
  },
  {
    question: "What do you need from me?",
    answer:
      "Share what exists, the decision you face, relevant constraints and customer evidence, and any access needed to inspect or test the product. Timely answers to focused questions protect the three-day window.",
  },
  {
    question: "Can I get a refund?",
    answer:
      "First Loop payment is final and non-refundable for a change of mind because capacity is reserved and work begins immediately. This does not limit rights required by law; if TasteLoop cannot deliver the agreed scope, we will make it right.",
  },
  {
    question: `Does the ${PRIMARY_OFFER.price} carry into Product Loop?`,
    answer: PRIMARY_OFFER.note!,
  },
  {
    question: "Who owns the work?",
    answer: WORK_MODEL.ownership,
  },
  {
    question: "What if TasteLoop is not the right fit?",
    answer:
      "Nam will say so before payment. When useful, he will point you toward a smaller next step or the kind of specialist the decision needs.",
  },
];
