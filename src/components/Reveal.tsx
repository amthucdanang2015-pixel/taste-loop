"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export function Reveal({
  children,
  delay = 0,
  y = 28,
  eager = false,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  eager?: boolean;
  className?: string;
}) {
  const reduce = useReducedMotion();

  // Above-the-fold content should be immediately readable and eligible for
  // first paint. The signature motion lives in the Living Loop itself; eager
  // wrappers deliberately avoid adding a viewport observer or animation state
  // around the headline, positioning, proof, and primary action.
  if (eager) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: reduce ? 0 : 0.7, delay: reduce ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
