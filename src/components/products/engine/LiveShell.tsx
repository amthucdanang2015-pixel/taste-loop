"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { STAGE_BG } from "./contract";

/* ============================================================================
 * LiveShell (D-029) — /playground/<slug>/live, for any product.
 *
 * The product sits in the SAME centred stage container the studio uses, so the
 * showcase really is a preview of this page. Live mode has NO style UI: the
 * design language arrived fixed through the URL codec. Every control in the
 * dock belongs to the product.
 * ==========================================================================*/

export function LiveShell({ backHref, backLabel, styleName, topCenter, dock, children }: {
  backHref: string;
  backLabel: string;
  /** the resolved design language, named in the corner chip */
  styleName: string;
  /** optional top-centre control (flowtime's device switcher) */
  topCenter?: React.ReactNode;
  /** optional bottom control dock — product actions only */
  dock?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[55]" style={{ background: STAGE_BG }}>
      <div className={`relative flex h-full w-full items-center justify-center ${topCenter ? "pt-24 sm:pt-0" : ""}`}>{children}</div>

      <Link
        href={backHref}
        aria-label={backLabel}
        className="fixed left-3 top-3 z-[70] flex h-10 min-w-10 items-center justify-center gap-1.5 rounded-full border border-white/10 bg-black/60 px-3 text-sm text-white/85 shadow-2xl backdrop-blur-xl transition hover:border-white/25 sm:left-4 sm:top-4 sm:h-auto sm:min-w-0 sm:px-3.5 sm:py-2"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">{backLabel}</span>
      </Link>

      {topCenter && (
        <div className="fixed inset-x-2 top-14 z-[70] flex justify-center sm:left-1/2 sm:right-auto sm:top-4 sm:block sm:-translate-x-1/2">
          {topCenter}
        </div>
      )}

      <span className="pointer-events-none fixed right-3 top-3 z-[70] max-w-[calc(100vw-4.75rem)] truncate rounded-full border border-white/10 bg-black/60 px-3 py-1.5 text-[11px] text-white/50 backdrop-blur-xl sm:right-4 sm:top-4 sm:max-w-none">
        Live demo · {styleName}
      </span>

      {dock && (
        <div className="fixed inset-x-0 bottom-0 z-[70] flex justify-center p-4">
          <div className="flex max-w-full flex-wrap items-center justify-center gap-2 rounded-2xl border border-white/10 bg-black/60 px-3 py-2 shadow-2xl backdrop-blur-xl">
            {dock}
          </div>
        </div>
      )}
    </div>
  );
}
