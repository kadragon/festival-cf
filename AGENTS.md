# Festival Korea Agent Rules

Next.js 16 (App Router) + Cloudflare Workers app — Korean festival data from TourAPI v2.

## Docs Index

| File | When to read |
|------|-------------|
| `docs/architecture.md` | Before modifying module structure or API layer |
| `docs/conventions.md` | Before writing components, API routes, or lib functions |
| `docs/runbook.md` | For build, preview, deploy commands and troubleshooting |
| `docs/workflows.md` | When starting any implementation cycle |

## Golden Principles

1. **API keys never in source** — `DATA_GO_KR_APIKEY`, `OPEN_DATA_X_API_KEY` always from env. Committing either key is an immediate security incident.
2. **All TourAPI calls through `lib/tourApi.ts`** — No direct fetch to `apis.data.go.kr` from components, pages, or route handlers.
3. **`res.ok` check before `.json()`** — Every fetch in `lib/tourApi.ts` must verify HTTP status; non-200 returns HTML, `.json()` throws.
4. **Server components by default** — `"use client"` only for browser APIs or event handlers; never for data fetching.
5. **Agent Integrity Principle** — Value not read from a file or command output this session → write `[unknown — read {source} to verify]`. Never guess port numbers, env var names, API paths, field names, or version strings.

## Delegation

| Trigger (objective) | Action | Gate |
|---------------------|--------|------|
| First edit in `lib/tourApi.ts` this session | Read full file before any changes | Mandatory, blocking |
| Change spans `app/` + `lib/` + `components/` (≥3 dirs) | Complete plan step in `docs/workflows.md` first | Mandatory, blocking |
| Same failure ×2 | Call `advisor` tool | Mandatory, blocking |
| Feature complete | Self-review against golden principles before commit | Mandatory |

## Token Economy

1. Don't re-read files already read this session — check diff/region only.
2. Run independent tool calls in parallel (reads, greps, globs).
3. Don't restate what the user just said.

## Working with Existing Code

- `lib/tourApi.ts` wraps all TourAPI calls; dual-runtime env reading (CF `getCloudflareContext` + `process.env`)
- `components/` are server components by default — check for `"use client"` before assuming browser context
- Tailwind CSS v4: no `tailwind.config.js`; configured via `postcss.config.mjs` + CSS `@import`
- `pnpm preview` builds + runs Workers runtime locally on `http://localhost:8787`
- Proxy mode: `OPEN_DATA_API_PROXY_URL` + `OPEN_DATA_X_API_KEY` must be set together or not at all

## Language Policy

Code, commits, docs: English. User-facing strings: Korean (hardcoded — no i18n library used).

## Maintenance

Update this file **only** when ALL of the following are true:

1. Information is not directly discoverable from code, config, or manifests
2. It is operationally significant — affects build, test, deploy, or runtime safety
3. It would likely cause agent mistakes if undocumented
4. It is stable and not task-specific

Never add architecture summaries, directory overviews, style conventions enforced by tooling, or temporary/task-specific instructions. Prefer modifying or removing outdated entries over appending. When unsure, add an inline `TODO:` comment rather than inventing guidance.

Size budget: target ≤100 lines (hard warn >200). Move long content to `docs/*.md` with a pointer line here.
