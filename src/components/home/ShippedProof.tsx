import Link from "next/link";
import { ArrowUpRight, Globe2, Smartphone } from "lucide-react";
import { SHIPPED_SITES, type ShippedApp } from "@/data/shipped";
import { Reveal } from "@/components/Reveal";
import { ProductMark } from "@/components/shipped/ProductMark";

export function ShippedProof({ apps }: { apps: ShippedApp[] }) {
  return (
    <section id="proof" className="section-rule mx-auto max-w-6xl px-6 py-20 sm:py-24">
      <Reveal>
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Proof before promise</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-[-0.045em] sm:text-5xl">
              Shipped is where the story starts.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-white/55 sm:text-base">
            Real web products you can open and native products in the App Store. No invented metrics, decorative logos, or case-study theater.
          </p>
        </div>
      </Reveal>

      <div className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(min(100%,12rem),1fr))] gap-3">
        {SHIPPED_SITES.map((site, index) => (
          <Reveal key={site.slug} delay={index * 0.04}>
            <a
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group grid h-full min-h-44 grid-rows-[auto_auto_1fr] rounded-2xl border border-line bg-surface/70 p-5 transition hover:-translate-y-0.5 hover:border-loop/45"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-loop"><span className="h-1.5 w-1.5 rounded-full bg-loop" /> Live web product</span>
                <ArrowUpRight className="h-4 w-4 text-white/30 transition group-hover:text-loop" />
              </div>
              <div className="mt-7">
                <ProductMark src={site.icon} name={site.name} kind="site" size="md" adjustment={site.iconAdjustment} />
                <h3 className="mt-4 text-lg font-semibold tracking-tight">{site.name}</h3>
              </div>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{site.tagline}</p>
            </a>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="mt-4 flex flex-col gap-4 rounded-2xl border border-line bg-white/[0.025] p-4 sm:flex-row sm:items-center">
          <div className="flex min-w-48 items-center gap-3 px-1">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.06]"><Smartphone className="h-4 w-4 text-signal" /></span>
            <div>
              <p className="text-sm font-medium">Native, too.</p>
              <p className="text-xs text-muted">{apps.length ? `${apps.length} current App Store products` : "App Store catalogue"}</p>
            </div>
          </div>
          {apps.length > 0 && (
            <div className="scroll-slim flex flex-1 gap-2 overflow-x-auto pb-1">
              {apps.slice(0, 6).map((app) => (
                <a key={app.id} href={app.url} target="_blank" rel="noopener noreferrer" className="flex min-w-52 items-center gap-3 rounded-xl border border-line bg-black/25 p-2.5 transition hover:border-white/25">
                  <ProductMark src={app.icon} name={app.name} kind="app" size="sm" />
                  <span className="min-w-0"><span className="block truncate text-xs font-medium text-white/85">{app.name}</span><span className="mt-0.5 block text-[10px] text-muted">{app.genre} · App Store</span></span>
                </a>
              ))}
            </div>
          )}
          <Link href="/shipped" className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border border-line px-4 py-2 text-xs font-medium text-white/75 transition hover:border-white/30 hover:text-white">
            Explore Shipped <Globe2 className="h-3.5 w-3.5" />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
