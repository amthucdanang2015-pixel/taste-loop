import type { CSSProperties } from "react";
import type { ProductMarkAdjustment } from "@/data/shipped";

type ProductMarkKind = "site" | "app";
type ProductMarkSize = "sm" | "md" | "lg" | "xl" | "2xl";

const SIZE_CLASSES: Record<ProductMarkSize, string> = {
  sm: "h-10 w-10 rounded-[11px]",
  md: "h-11 w-11 rounded-xl",
  lg: "h-16 w-16 rounded-2xl",
  xl: "h-20 w-20 rounded-[1.2rem]",
  "2xl": "h-28 w-28 rounded-[1.7rem]",
};

interface ProductMarkProps {
  src: string;
  name: string;
  kind: ProductMarkKind;
  size?: ProductMarkSize;
  adjustment?: ProductMarkAdjustment;
  className?: string;
  style?: CSSProperties;
}

/**
 * One presentation boundary for heterogeneous product identity assets.
 * Site marks use a calibrated optical safe area; App Store icons remain
 * full-bleed because their artwork is authored for a square icon mask.
 */
export function ProductMark({
  src,
  name,
  kind,
  size = "md",
  adjustment,
  className = "",
  style,
}: ProductMarkProps) {
  const initial = name.trim().charAt(0).toUpperCase() || "•";
  const correction = adjustment ?? { scale: 1 };
  const imageStyle = kind === "site"
    ? {
        transform: `translate(${correction.x ?? 0}%, ${correction.y ?? 0}%) scale(${correction.scale})`,
      }
    : undefined;

  return (
    <span
      aria-hidden="true"
      data-product-mark={kind}
      className={`flex shrink-0 items-center justify-center overflow-hidden bg-white/[0.04] font-semibold text-white/65 ring-1 ring-white/10 ${SIZE_CLASSES[size]} ${className}`}
      style={style}
    >
      {src ? (
        <img
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
          draggable={false}
          className={kind === "site" ? "h-[86%] w-[86%] object-contain" : "h-full w-full object-cover"}
          style={imageStyle}
        />
      ) : (
        <span>{initial}</span>
      )}
    </span>
  );
}
