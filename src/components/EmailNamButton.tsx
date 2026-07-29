"use client";

import { BRAND } from "@/config/brand";

export function EmailNamButton({
  className = "",
  label = "Email Nam",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => window.location.assign(`mailto:${BRAND.email}`)}
      className={className}
    >
      {label}
    </button>
  );
}
