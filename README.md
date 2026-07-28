# TasteLoop

TasteLoop is Nam Nguyen's founder-led product operating system and product partner. Nam owns direction, trade-offs, and quality; coordinated agents accelerate research, design, engineering, and QA; real-world evidence corrects the loop. TasteLoop is the durable company brand, not a temporary personal portfolio.

The production application lives in `web/`. It combines a proof-first company site with four launch-visible product areas:

- **Shipped** — proof from real products
- **Skills** — 40 original installable Agent Skills, 140 mapped product topics, and six focused flows
- **Playground** — taste made visible in working product demos
- **Animations** — motion with purpose

Skills publishes the quality system. Playground and Animations form **Open Loop**, the umbrella for free tools and experiments that make the system visible. AURORA source and its established `/gradient` identifier are preserved, but the public route temporarily redirects to `/playground` for launch.

## Offers

| Offer | Price and timing | Purpose |
| --- | --- | --- |
| First Loop | $2,500 · delivered in 3 working days | Turn one hard product decision into working evidence; the full fee is credited to the first Product Loop when it begins within 14 days |
| Product Loop | $9,800 · one 30-day cycle | Ship and test one important product outcome; renew cycle by cycle |

Taste Review is no longer a public offer. Its `taste-review` lead type remains in the backend only for compatibility with existing callers.

TasteLoop accepts at most two active engagements, keeps client work in client-owned tools, and gives active partners at least 30 days' notice if it cannot continue, except for non-payment or material breach. Selective deeper partnerships are considered only after paid work and real customer signal; equity never replaces a workable cash budget.

## Local development

The repository uses npm and the lockfile in `web/`. Node must satisfy `>=20.9 <25`; the checked-in launch configuration uses Node 24.

```bash
cd web
nvm use
npm ci
npm run dev:backend
```

Open [http://localhost:3000](http://localhost:3000). The local application—not the deployed site—is the implementation reference.

Core verification commands:

```bash
npm run typecheck
npm run typecheck:backend
npm run lint
npm test
NEXT_PUBLIC_ASSET_CDN_URL=https://your-distribution.cloudfront.net npm run build
# with the local server running
npm run test:links
```

`npm run check` combines frontend/backend type checking, lint, and source-contract tests. It does not include the production build or local link crawl.

When either active backend capability changes:

```bash
npm run backend:deploy
npm run verify:backend
npm run build
```

Before the first lead deployment, securely set the sandbox Resend secret:

```bash
npx ampx sandbox secret set RESEND_API_KEY --profile default
```

The deploy command targets an isolated development sandbox with the AWS `default` profile, writes an ignored `amplify_outputs.json`, reconciles the complete synthesized template, and verifies the CDN plus lead infrastructure. `npm run verify:leads` is a separate opt-in E2E check because it stores a real test lead and sends a real email. `dev:backend`/`start:backend` load the real CloudFront origin and server-only lead API URL/key from those outputs.

The current launch deliberately keeps that existing sandbox and deploys the web app from `web/` to the already-bound Vercel project:

```bash
npm run production:configure
npm run production:deploy
```

`production:configure` requires authenticated AWS and Vercel CLIs. It reads the ignored Amplify outputs and API Gateway key, then writes the four required Vercel production variables without printing secret values. It refuses to configure any project other than the compatibility-bound `vibetoreal` project. `production:deploy` performs the production Vercel deployment; `web/vercel.json` requires deterministic `npm ci` installation.

Do not delete or recreate the retained sandbox during launch work: its S3/CloudFront media and lead data are live dependencies. It remains destroyable development infrastructure, so moving the backend to a retained Amplify Hosting branch is a documented post-launch hardening task.

See [docs/QA.md](docs/QA.md) for the full browser, accessibility, link, and performance matrix. Do not treat a successful build as complete QA.

## Architecture at a glance

- Next.js 15 App Router, React 19, TypeScript, Tailwind, and Framer Motion
- Static-first marketing and content surfaces
- Typed local content and product registries
- Server-side, daily-cached Apple text-metadata enrichment for a fixed local twelve-product catalogue
- Shared Playground engine with product-specific renderers
- Preserved Canvas/WebCodecs-based AURORA rendering and export source; the launch route is temporarily hidden
- Amplify Gen 2 media delivery: private S3, CloudFront Origin Access Control, and manifest-driven Shipped assets
- Amplify Gen 2 lead intake: API-key-protected regional REST API, Node 24 Lambda, on-demand DynamoDB, and Resend notification
- Browser forms call a same-origin Next adapter; backend credentials remain server-only
- Dormant broad auth/API/storage scaffolds remain isolated and undeployed

Runtime configuration:

- `NEXT_PUBLIC_SITE_URL` — canonical public URL; production is `https://www.tasteloop.work`, while Vercel runtime URLs and localhost are inference fallbacks
- `NEXT_PUBLIC_ASSET_CDN_URL` — production Shipped asset origin; mandatory and HTTPS-only in production. Local sandbox output is consumed automatically, with `/assets` reserved for offline development before deployment
- `API_BASE_URL` — server-only REST API origin
- `LEAD_API_KEY` — server-only API Gateway key
- `RESEND_API_KEY` — Amplify secret resolved by the Lambda at runtime; never a web-host variable or committed value

The Vercel production environment receives the first four web/runtime values through `npm run production:configure`; `RESEND_API_KEY` stays only in Amplify.

See [docs/SYSTEM.md](docs/SYSTEM.md) before changing architecture.

## Shared documentation

- [AGENTS.md](AGENTS.md) — coding-agent entry point
- [docs/SYSTEM.md](docs/SYSTEM.md) — system and route architecture
- [docs/BRAND.md](docs/BRAND.md) — TasteLoop identity and voice
- [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) — visual and motion standards
- [docs/CONTENT.md](docs/CONTENT.md) — narrative and content ownership
- [docs/DECISIONS.md](docs/DECISIONS.md) — accepted decisions
- [docs/QA.md](docs/QA.md) — verification status and launch work

The numbered root documents and `Growth OS/` are retained as historical research. They may explain earlier decisions, but these shared documents and the current code govern.

## Documentation rule

Update the relevant shared document in the same change whenever architecture, brand, routes, offers, content ownership, shared components, design standards, or quality requirements change.
