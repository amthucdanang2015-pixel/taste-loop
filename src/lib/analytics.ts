import type { OfferId } from "@/config/brand";

export type AnalyticsCtaLocation =
  | "nav"
  | "footer"
  | "home-hero"
  | "home-offers"
  | "home-final"
  | "work-intro"
  | "work-offers"
  | "about-final"
  | "other";

type IntakeField =
  | "decision"
  | "name"
  | "email"
  | "engagement"
  | "stage"
  | "url";

type IntakeErrorCategory =
  | "backend"
  | "conflict"
  | "network"
  | "notification"
  | "rate_limit"
  | "timeout"
  | "unconfigured"
  | "unknown";

interface AnalyticsEventMap {
  cta_click: {
    cta_location: AnalyticsCtaLocation;
    offer_id: OfferId;
  };
  intake_view: {
    offer_id: OfferId;
  };
  intake_start: {
    offer_id: OfferId;
  };
  intake_submit_attempt: {
    offer_id: OfferId;
  };
  intake_validation_error: {
    offer_id: OfferId;
    first_invalid_field: IntakeField;
  };
  intake_submit_error: {
    offer_id: OfferId;
    error_category: IntakeErrorCategory;
  };
  generate_lead: {
    offer_id: OfferId;
    notification_status: "accepted" | "delayed";
  };
}

export type AnalyticsEvent = {
  type: "event" | "pageview";
  url: string;
};

const ANALYTICS_CTA_LOCATIONS: AnalyticsCtaLocation[] = [
  "nav",
  "footer",
  "home-hero",
  "home-offers",
  "home-final",
  "work-intro",
  "work-offers",
  "about-final",
  "other",
];

let privacyBoundaryConfigured = false;

declare global {
  interface Window {
    doNotTrack?: string;
    va?: (
      command: "beforeSend" | "event" | "pageview",
      payload?: unknown,
    ) => void;
    vaq?: [string, unknown?][];
  }

  interface Navigator {
    globalPrivacyControl?: boolean;
  }
}

export function isOfferId(value: string | null | undefined): value is OfferId {
  return value === "first-loop" || value === "product-loop";
}

export function isAnalyticsCtaLocation(
  value: string | null | undefined,
): value is AnalyticsCtaLocation {
  return ANALYTICS_CTA_LOCATIONS.some((location) => location === value);
}

export function sanitizeAnalyticsEvent(
  event: AnalyticsEvent,
  origin: string,
): AnalyticsEvent | null {
  try {
    const url = new URL(event.url, origin);
    if (url.origin !== origin) return null;
    return { ...event, url: `${url.origin}${url.pathname}` };
  } catch {
    return null;
  }
}

export function initAnalyticsQueue() {
  if (typeof window === "undefined" || window.va) return;
  window.va = (...parameters) => {
    window.vaq ??= [];
    window.vaq.push(parameters);
  };
}

export function configureAnalyticsPrivacyBoundary() {
  if (!shouldMeasureAnalytics()) return false;

  initAnalyticsQueue();
  if (!privacyBoundaryConfigured) {
    window.va?.("beforeSend", (event: AnalyticsEvent) => {
      if (!shouldMeasureAnalytics()) return null;
      return sanitizeAnalyticsEvent(event, window.location.origin);
    });
    privacyBoundaryConfigured = true;
  }
  return true;
}

export function isLocalAnalyticsHostname(hostname: string) {
  return (
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname === "127.0.0.1" ||
    hostname === "0.0.0.0" ||
    hostname === "::1" ||
    hostname === "[::1]"
  );
}

export function shouldMeasureAnalytics() {
  if (typeof window === "undefined") return false;
  if (isLocalAnalyticsHostname(window.location.hostname)) return false;
  return (
    navigator.globalPrivacyControl !== true &&
    navigator.doNotTrack !== "1" &&
    window.doNotTrack !== "1"
  );
}

export function trackEvent<Name extends keyof AnalyticsEventMap>(
  name: Name,
  parameters: NoInfer<AnalyticsEventMap[Name]>,
) {
  if (!configureAnalyticsPrivacyBoundary()) return;
  window.va?.("event", { name, data: parameters });
}

export function trackPageview(pathname: string) {
  if (!configureAnalyticsPrivacyBoundary()) return;
  window.va?.("pageview", {
    route: pathname,
    path: pathname,
  });
}
