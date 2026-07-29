"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  configureAnalyticsPrivacyBoundary,
  isAnalyticsCtaLocation,
  isOfferId,
  trackEvent,
  trackPageview,
} from "@/lib/analytics";

const ANALYTICS_SCRIPT_PATH = "/_vercel/insights/script.js";

/**
 * Loads Vercel's first-party, cookie-free Web Analytics script.
 *
 * The small local loader keeps the privacy boundary visible in our code:
 * URLs are reduced to origin + pathname before transmission, explicit browser
 * privacy signals are honored, and no consent UI or persistent visitor state is
 * created.
 */
export function WebAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (!configureAnalyticsPrivacyBoundary()) return;

    const trackCta = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;

      const link = event.target.closest<HTMLAnchorElement>(
        "a[data-analytics-location]",
      );
      if (!link) return;

      const location = link.dataset.analyticsLocation;
      if (!isAnalyticsCtaLocation(location)) return;

      const targetUrl = new URL(link.href, window.location.href);
      const currentUrl = new URL(window.location.href);
      const offerId =
        targetUrl.searchParams.get("loop") ??
        currentUrl.searchParams.get("loop") ??
        (targetUrl.hash === "#intake" ? "first-loop" : null);
      if (!isOfferId(offerId)) return;

      trackEvent("cta_click", {
        cta_location: location,
        offer_id: offerId,
      });
    };

    document.addEventListener("click", trackCta);

    if (
      !document.head.querySelector<HTMLScriptElement>(
        `script[src="${ANALYTICS_SCRIPT_PATH}"]`,
      )
    ) {
      const script = document.createElement("script");
      script.src = ANALYTICS_SCRIPT_PATH;
      script.defer = true;
      script.dataset.sdkn = "tasteloop/web-analytics";
      script.dataset.sdkv = "1.0.0";
      script.dataset.disableAutoTrack = "1";
      document.head.appendChild(script);
    }

    return () => document.removeEventListener("click", trackCta);
  }, []);

  useEffect(() => {
    if (pathname) trackPageview(pathname);
  }, [pathname]);

  return null;
}
