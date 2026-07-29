import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import path from "node:path";
import ts from "typescript";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relative) => readFile(path.join(root, relative), "utf8");

async function loadAnalyticsModule() {
  const source = await read("src/lib/analytics.ts");
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  const encoded = Buffer.from(compiled).toString("base64");
  return import(`data:text/javascript;base64,${encoded}#${crypto.randomUUID()}`);
}

async function withBrowserGlobals(
  {
    hostname = "www.tasteloop.work",
    globalPrivacyControl = false,
    navigatorDoNotTrack = "0",
    windowDoNotTrack = "0",
  } = {},
  run,
) {
  const windowDescriptor = Object.getOwnPropertyDescriptor(globalThis, "window");
  const navigatorDescriptor = Object.getOwnPropertyDescriptor(
    globalThis,
    "navigator",
  );
  const browserWindow = {
    location: {
      hostname,
      origin: `https://${hostname}`,
    },
    doNotTrack: windowDoNotTrack,
  };

  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: browserWindow,
  });
  Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    value: {
      doNotTrack: navigatorDoNotTrack,
      globalPrivacyControl,
    },
  });

  try {
    return await run(browserWindow);
  } finally {
    if (windowDescriptor) {
      Object.defineProperty(globalThis, "window", windowDescriptor);
    } else {
      delete globalThis.window;
    }
    if (navigatorDescriptor) {
      Object.defineProperty(globalThis, "navigator", navigatorDescriptor);
    } else {
      delete globalThis.navigator;
    }
  }
}

test("analytics is anonymous, cookie-free, and has no consent interruption", async () => {
  const component = await read("src/components/analytics/WebAnalytics.tsx");
  const analytics = await read("src/lib/analytics.ts");
  const footer = await read("src/components/Footer.tsx");

  assert.match(component, /\/_vercel\/insights\/script\.js/);
  assert.match(analytics, /"beforeSend"/);
  assert.match(analytics, /globalPrivacyControl/);
  assert.match(analytics, /doNotTrack/);
  assert.match(component, /usePathname/);
  assert.match(component, /disableAutoTrack/);
  assert.match(component, /trackPageview\(pathname\)/);
  assert.doesNotMatch(
    `${component}\n${analytics}\n${footer}`,
    /GoogleAnalytics|gtag|firebase\/analytics|Analytics settings|localStorage/,
  );
});

test("analytics locations discard queries and hashes before measurement", async () => {
  const analytics = await read("src/lib/analytics.ts");
  assert.match(analytics, /url:\s*`\$\{url\.origin\}\$\{url\.pathname\}`/);
  assert.match(analytics, /url\.origin !== origin/);
  assert.doesNotMatch(analytics, /url:\s*[^,\n]*(?:search|hash)/);

  const analyticsModule = await loadAnalyticsModule();
  assert.deepEqual(
    analyticsModule.sanitizeAnalyticsEvent(
      {
        type: "pageview",
        url: "https://www.tasteloop.work/work?email=private#intake",
      },
      "https://www.tasteloop.work",
    ),
    {
      type: "pageview",
      url: "https://www.tasteloop.work/work",
    },
  );
  assert.equal(
    analyticsModule.sanitizeAnalyticsEvent(
      { type: "pageview", url: "https://example.com/private" },
      "https://www.tasteloop.work",
    ),
    null,
  );
});

test("privacy signals, loopback hosts, and queue ordering are enforced", async () => {
  const analyticsModule = await loadAnalyticsModule();

  for (const hostname of [
    "localhost",
    "preview.localhost",
    "127.0.0.1",
    "0.0.0.0",
    "::1",
    "[::1]",
  ]) {
    assert.equal(analyticsModule.isLocalAnalyticsHostname(hostname), true);
  }

  await withBrowserGlobals({}, async (browserWindow) => {
    analyticsModule.trackEvent("intake_start", { offer_id: "first-loop" });
    assert.deepEqual(
      browserWindow.vaq.map(([command]) => command),
      ["beforeSend", "event"],
    );

    const privacyHook = browserWindow.vaq[0][1];
    Object.defineProperty(globalThis.navigator, "globalPrivacyControl", {
      configurable: true,
      value: true,
    });
    assert.equal(
      privacyHook({
        type: "pageview",
        url: "https://www.tasteloop.work/work?private=yes",
      }),
      null,
    );
  });

  for (const privacyOptions of [
    { globalPrivacyControl: true },
    { navigatorDoNotTrack: "1" },
    { windowDoNotTrack: "1" },
    { hostname: "[::1]" },
  ]) {
    const freshModule = await loadAnalyticsModule();
    await withBrowserGlobals(privacyOptions, async () => {
      assert.equal(freshModule.shouldMeasureAnalytics(), false);
    });
  }
});

test("the intake event model sends enums, never visitor answers or identity", async () => {
  const analytics = await read("src/lib/analytics.ts");
  const observer = await read("src/components/analytics/WebAnalytics.tsx");
  const intake = await read("src/components/WorkIntake.tsx");
  for (const event of [
    "cta_click",
    "intake_view",
    "intake_start",
    "intake_submit_attempt",
    "intake_validation_error",
    "intake_submit_error",
    "generate_lead",
  ]) assert.match(analytics, new RegExp(`${event}:`));

  const eventMap = analytics.match(
    /interface AnalyticsEventMap \{([\s\S]*?)\n\}/,
  )?.[1];
  assert.ok(eventMap);
  assert.doesNotMatch(
    eventMap,
    /\b(?:decision|email|name|product_url|submission_id|search_term):/,
  );
  assert.doesNotMatch(eventMap, /\b(?:cta_id|persisted):/);
  assert.match(analytics, /NoInfer<AnalyticsEventMap\[Name\]>/);
  assert.match(observer, /a\[data-analytics-location\]/);
  assert.match(observer, /trackEvent\("cta_click"/);
  assert.match(intake, /IntersectionObserver/);
  assert.match(intake, /trackEvent\("intake_view"/);

  const form = await read("src/components/LeadForm.tsx");
  assert.match(form, /typeof body\.id === "string"/);
  assert.match(form, /trackLeadOnce\(offerId, "accepted"\)/);
  assert.match(form, /trackLeadOnce\(offerId, "delayed"\)/);
  assert.doesNotMatch(form, /trackEvent\([^)]*values/);
});

test("production config does not depend on Google or Firebase browser config", async () => {
  const script = await read("scripts/configure-vercel-production.mjs");
  assert.match(script, /"project",\s*"web-analytics"/);
  assert.doesNotMatch(script, /NEXT_PUBLIC_GA_MEASUREMENT_ID|firebase|gtag/i);
  assert.doesNotMatch(script, /\bAIza[0-9A-Za-z_-]{20,}\b/);
});
