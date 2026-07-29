# TasteLoop web application

The production Next.js application for TasteLoop: Nam Nguyen’s founder-led, team-backed product operating system and product partner. Nam brings more than ten years as a builder, and a trusted core team has worked alongside him for more than ten years. TasteLoop remains the durable company brand.

Start with the repository-level [`AGENTS.md`](../AGENTS.md) and shared [`docs/`](../docs/) before changing architecture, brand, content, routes, product systems, or quality standards.

## Local development

```bash
nvm use
npm ci
npm run dev:backend
npm run typecheck
npm run typecheck:backend
npm run lint
NEXT_PUBLIC_ASSET_CDN_URL=https://your-distribution.cloudfront.net npm run build
```

When either active backend capability changes:

```bash
npm run backend:deploy
npm run verify:backend
npm run build
```

The launch-visible product areas are `/shipped`, `/playground`, `/skills`, and `/animations`. `/skills` publishes 40 original installable Agent Skills, 140 mapped topics, and six focused flows through canonical `/skills/[slug]` detail and download routes. AURORA source remains under `src/components/gradient/` and `src/lib/gradient/`, while `/gradient` temporarily redirects to `/playground`.

The engagement flow at `/work` presents First Loop ($980, delivered in 3 working days, fully credited to a Product Loop begun within 14 days) and Product Loop ($9,800 for one 30-day cycle, renewed cycle by cycle). `src/content/work.ts` owns the First Loop FAQ and the manual scope/payment/access boundary. Taste Review is retired publicly; `taste-review` remains a backend compatibility ID only.

Brand, navigation, and offers are centralized in `src/config/brand.ts`. Homepage and operating-loop content live in `src/content/site.ts`; First Loop FAQ content lives in `src/content/work.ts`. Product-specific data remains in `src/data/`.

Skills use one composed registry in `src/data/qualitySkills.ts`, `qualitySkills.extra.ts`, and `qualitySkills.launch.ts`; topic and flow navigation live in `src/data/skillsCatalog.ts`; portable package generation lives in `src/lib/skills.ts`. Run `node scripts/export-skills.mjs` after changing the registry and commit the regenerated root `skills/<slug>/SKILL.md` packages.

## Environment

```bash
NEXT_PUBLIC_SITE_URL=  # canonical public URL; production uses https://www.tasteloop.work
NEXT_PUBLIC_ASSET_CDN_URL= # absolute HTTPS CloudFront origin; required in production
API_BASE_URL=          # server-only lead REST API origin
LEAD_API_KEY=          # server-only API Gateway key
```

The active Amplify Gen 2 boundary has two deliberately narrow capabilities:

1. Private S3 and CloudFront OAC delivery for only the 78 manifest-approved files in `public/assets/shipped/`.
2. Secure lead intake through API Gateway `POST /leads`, a Node 24 Lambda, on-demand DynamoDB, and Resend.

Analytics uses the local `src/components/analytics/WebAnalytics.tsx` loader for Vercel Web Analytics. It has no environment value, cookies, consent modal, analytics settings, or analytics localStorage. It suppresses the loader and events when Global Privacy Control or Do Not Track is enabled. Anonymous page views and the existing closed enum-only funnel events reduce every URL to origin plus pathname and never include form values, names, email addresses, submitted URLs, submission IDs, query strings, or hashes. Google Analytics and the supplied Firebase client configuration are retired and intentionally unused.

`npm run production:configure` idempotently enables Web Analytics for the verified Vercel project before the next deployment. Basic page analytics works on every Vercel plan; custom events require Pro or Enterprise. Vercel’s anonymous visitor session expires after 24 hours, so the implementation intentionally does not claim durable cross-day MAU/retention or true active-time measurement.

Set the sandbox email secret once with `npx ampx sandbox secret set RESEND_API_KEY --profile default`; do not store it in source or `.env`. `npm run backend:deploy` deploys both capabilities, reconciles the synthesized template through CloudFormation, and verifies the CDN plus lead infrastructure. `npm run verify:leads` is intentionally separate because it persists a real test lead and sends a real notification. The ignored `amplify_outputs.json` makes the real CDN available locally; `dev:backend` and `start:backend` also resolve the REST URL and API Gateway key into server-only process variables. Browser code only calls same-origin `/api/leads`.

The current production web deployment intentionally uses the existing Amplify sandbox and the compatibility-bound Vercel project. From `web/`, configure and deploy it with:

```bash
npm run production:configure
npm run production:deploy
```

`production:configure` requires authenticated AWS and Vercel CLIs. It reads ignored Amplify outputs, resolves the API Gateway key, verifies that the local binding is the `vibetoreal` Vercel project, idempotently enables Web Analytics, and writes `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_ASSET_CDN_URL`, `API_BASE_URL`, and sensitive `LEAD_API_KEY` without printing secret values. Analytics requires no client configuration value. `RESEND_API_KEY` remains an Amplify/Lambda secret and is never copied to Vercel. Run configuration before `production:deploy` so Vercel provisions the analytics routes on that deployment; `vercel.json` makes the hosted install use `npm ci`.

Do not delete or recreate the retained sandbox during launch work because its media and lead resources are live dependencies. It is still destroyable development infrastructure; a retained Amplify Hosting branch is the future durability migration. The broad older auth, API function, and storage source folders remain dormant and must not be imported without a separate security and migration decision.
