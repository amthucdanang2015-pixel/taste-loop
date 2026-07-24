# TasteLoop web application

The production Next.js application for TasteLoop: Nam Nguyen’s founder-led, agent-native product company and product partner. TasteLoop remains the durable company brand.

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

The preserved product areas are `/shipped`, `/playground`, `/skills`, `/animations`, and `/gradient` (AURORA). The engagement flow at `/work` presents First Loop ($3,500, delivered in 3 working days) and Product Loop ($9,800/month). Taste Review is retired publicly; `taste-review` remains a backend compatibility ID only.

Brand, navigation, and offers are centralized in `src/config/brand.ts`. Homepage and operating-loop content live in `src/content/site.ts`. Product-specific data remains in `src/data/`.

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

Set the sandbox email secret once with `npx ampx sandbox secret set RESEND_API_KEY --profile default`; do not store it in source or `.env`. `npm run backend:deploy` deploys both capabilities, reconciles the synthesized template through CloudFormation, and verifies the CDN plus lead infrastructure. `npm run verify:leads` is intentionally separate because it persists a real test lead and sends a real notification. The ignored `amplify_outputs.json` makes the real CDN available locally; `dev:backend` and `start:backend` also resolve the REST URL and API Gateway key into server-only process variables. Browser code only calls same-origin `/api/leads`.

The current production web deployment intentionally uses the existing Amplify sandbox and the compatibility-bound Vercel project. From `web/`, configure and deploy it with:

```bash
npm run production:configure
npm run production:deploy
```

`production:configure` requires authenticated AWS and Vercel CLIs. It reads ignored Amplify outputs, resolves the API Gateway key, verifies that the local binding is the `vibetoreal` Vercel project, and writes `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_ASSET_CDN_URL`, `API_BASE_URL`, and sensitive `LEAD_API_KEY` without printing secret values. `RESEND_API_KEY` remains an Amplify/Lambda secret and is never copied to Vercel. `production:deploy` runs a Vercel production deployment; `vercel.json` makes the hosted install use `npm ci`.

Do not delete or recreate the retained sandbox during launch work because its media and lead resources are live dependencies. It is still destroyable development infrastructure; a retained Amplify Hosting branch is the future durability migration. The broad older auth, API function, and storage source folders remain dormant and must not be imported without a separate security and migration decision.
