# Runbook

## Quick Start

### Prerequisites

- Node.js 20+ (`node --version`)
- pnpm (`pnpm --version`)
- Cloudflare account + Wrangler auth (`wrangler whoami`)
- TourAPI key from data.go.kr

### Setup

```bash
pnpm install
cp .dev.vars.example .dev.vars
# Edit .dev.vars — add DATA_GO_KR_APIKEY value (URL-encoded)
```

### Verify

- `pnpm dev` → `http://localhost:3000` — Next.js dev server, hot reload
- `pnpm preview` → `http://localhost:8787` — Cloudflare Workers runtime preview

## Build & Dev

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Next.js dev server (Node runtime, port 3000) |
| `pnpm preview` | Build + Workers runtime preview (port 8787) |
| `pnpm build` | Next.js production build only |
| `pnpm build:worker` | OpenNext → Workers bundle (output: `.open-next/`) |
| `pnpm deploy` | Build worker + deploy to Cloudflare |

## Type Check

```bash
npx tsc --noEmit
```

No test suite currently. Verify changes via `pnpm preview` + manual browser check.

## Deploy

### Environments

| Environment | Branch | Method |
|-------------|--------|--------|
| Production | `main` | Cloudflare Workers Builds (auto on push) |
| Manual | any | `pnpm deploy` |

### Build Settings (Cloudflare Workers Builds)

- **Build command**: `pnpm run build:worker`
- **Node version**: `20` (set `NODE_VERSION=20` env var in dashboard)

### Secrets

Production env vars → Cloudflare dashboard → Settings → Variables and Secrets → **Secret** type:

| Variable | Required | Purpose |
|----------|----------|---------|
| `DATA_GO_KR_APIKEY` | Yes (direct mode) | TourAPI service key (URL-encoded) |
| `OPEN_DATA_API_PROXY_URL` | Together with key | Proxy base URL |
| `OPEN_DATA_X_API_KEY` | Together with URL | Proxy auth header |

`OPEN_DATA_API_PROXY_URL` and `OPEN_DATA_X_API_KEY` must both be set or neither.

## Failure Modes

| Symptom | Likely cause | Fix |
|---------|-------------|-----|
| `DATA_GO_KR_APIKEY not configured` | Missing env var | Check `.dev.vars` or CF dashboard |
| Both proxy vars must be set together | One of the pair missing | Set both or remove both |
| `res.json()` throws on fetch | `res.ok` not checked; API returned HTML 4xx/5xx | Fixed in `lib/tourApi.ts` — all fetch calls check `res.ok` |
| TypeScript errors in `cloudflare-env.d.ts` | Missing CF type gen | Run `pnpm cf-typegen` |
| Build fails with "not supported in Workers" | Node-only API used | Check CF Workers compat |

## _workspace/ Convention

Intermediate agent artifacts live under `_workspace/` at repo root.
Naming: `{phase:02d}_{agent}_{artifact}.{ext}`

Preserve across sessions — enables partial re-run without full restart.
Remove only on explicit "reset" request.
