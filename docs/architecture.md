# Architecture

## Stack

| Layer | Technology |
|-------|-----------|
| Language | TypeScript 5.x |
| Framework | Next.js 16, App Router |
| Runtime target | Cloudflare Workers via `@opennextjs/cloudflare` |
| Styling | Tailwind CSS v4 |
| Package manager | pnpm |
| External API | 한국관광공사 TourAPI v2 (`KorService2`) |

## Source Layout

```
app/
  api/festivals/       # Route handlers (server-side API proxies)
  festivals/[contentId]/ # Detail page
  globals.css          # Tailwind v4 entry + CSS variables
  layout.tsx           # Root layout
  page.tsx             # Home page (festival list)
components/            # Shared React components (all server by default)
lib/
  tourApi.ts           # All TourAPI calls; env reading; types
  areaCodes.ts         # Area code → label mapping
  date.ts              # Date formatting helpers
  cn.ts                # clsx + tailwind-merge utility
public/                # Static assets
```

## Layer Rules

### Dependency Direction

```
app/ → components/ → lib/
         (UI)        (logic + data)
```

Upper layers import lower layers, never reverse.

### Boundaries

- `lib/tourApi.ts` is the **only** file that fetches from `apis.data.go.kr`. Route handlers and components call `lib/tourApi.ts` functions, never raw fetch.
- `app/api/` route handlers handle CORS/proxy concerns; they do not contain business logic.
- `components/` hold pure UI — no direct API calls, no env access.
- `lib/` must never import from `app/` or `components/`.

## Data Access

Single module: `lib/tourApi.ts`. Pattern:

```
fetchFestivalList(params)   → FestivalItem[]
fetchDetailCommon(id)       → DetailCommon
fetchDetailIntro(id)        → DetailIntro
fetchDetailImages(id)       → DetailImage[]
```

Env reading: `readEnv()` tries `getCloudflareContext({ async: true })` first (CF Workers), falls back to `process.env` (Node dev server). Both paths cached.

## Key Abstractions

1. **Dual-runtime env** — Same `lib/tourApi.ts` code runs on both Next.js dev server (Node) and Cloudflare Workers. `readEnv()` handles the difference.
2. **Proxy mode** — Set `OPEN_DATA_API_PROXY_URL` + `OPEN_DATA_X_API_KEY` together to route TourAPI calls through a proxy; use `DATA_GO_KR_APIKEY` for direct access.
3. **Server components by default** — All `components/*.tsx` are React Server Components unless they carry `"use client"`.
4. **OpenNext adapter** — `open-next.config.ts` + `wrangler.jsonc` translate the Next.js build into a Workers bundle.
