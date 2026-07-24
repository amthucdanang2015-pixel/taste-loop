"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isImmersive } from "@/lib/chrome";
import { BRAND, OFFERS, offerHref } from "@/config/brand";
import { Wordmark } from "@/components/brand/Wordmark";

const columns = [
  {
    title: "Proof",
    links: [
      { href: "/shipped", label: "Shipped" },
      { href: "/skills", label: "Skills" },
      { href: "/about", label: "Founder story" },
    ],
  },
  {
    title: "Open Loop",
    links: [
      { href: "/playground", label: "Playground" },
      { href: "/animations", label: "Animations" },
      { href: "/gradient", label: "AURORA" },
    ],
  },
  {
    title: "Work together",
    links: OFFERS.map((offer) => ({
      href: offerHref(offer.id),
      label: `${offer.name} · ${offer.price}`,
    })),
  },
];

export function Footer({ year }: { year: number }) {
  const pathname = usePathname();
  if (isImmersive(pathname ?? "")) return null;

  return (
    <footer className="relative border-t border-line px-6 py-14 sm:py-16">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.35fr_1fr_1fr_1fr]">
        <div>
          <Wordmark />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">{BRAND.positioning}</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/72">{BRAND.idea}</p>
        </div>
        {columns.map((column) => (
          <div key={column.title} className="text-sm">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">{column.title}</p>
            <ul className="space-y-2.5 text-muted">
              {column.links.map((link) => (
                <li key={link.href + link.label}>
                  <Link href={link.href} className="transition hover:text-white">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-12 flex max-w-6xl flex-col items-start justify-between gap-3 border-t border-line pt-6 text-xs text-muted md:flex-row">
        <span>© {year} {BRAND.name}.</span>
        <span>Agents make. Humans decide. Reality corrects the loop.</span>
      </div>
    </footer>
  );
}
