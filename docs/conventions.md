# Conventions

Only documents what TypeScript strict mode and Tailwind do NOT already catch.

## Naming

| Element | Pattern | Example |
|---------|---------|---------|
| Components | PascalCase, noun | `FestivalCard.tsx`, `AreaFilter.tsx` |
| Lib utilities | camelCase, verb | `fetchFestivalList`, `todayStr` |
| Types/interfaces | PascalCase | `FestivalItem`, `DetailCommon` |
| API route dirs | kebab-case | `app/api/festivals/` |
| CSS variables | `--kebab-case` | `--header-h` |
| Env vars | `SCREAMING_SNAKE_CASE` | `DATA_GO_KR_APIKEY` |

## Error Handling

- **Every fetch must check `res.ok`** before `.json()`. Non-200 from TourAPI returns HTML; `.json()` throws silently.
- **Never swallow unknown errors** — `catch (e) { console.warn(...) }` at minimum. Empty `catch {}` blocks are prohibited (existing `readEnv` catch is documented debt in `backlog.md`).
- **Propagate errors up** to the closest `error.tsx` boundary or route handler 500 response; don't swallow and return empty arrays silently.

## Async Patterns

- All data fetching in server components via `async/await` — no `useEffect` + `fetch` in client components.
- Parallel independent requests: `Promise.all([...])`.
- Route handlers: return `Response.json(...)` with explicit status codes.

## Framework-Specific Rules

### Next.js App Router

- `"use client"` only when the component needs `useState`, `useEffect`, event handlers, or browser APIs.
- Data fetching belongs in server components or route handlers, never in client components.
- `Suspense` wraps async server components that may be slow (see `app/page.tsx` pattern).
- Dynamic routes: params are `Promise<{...}>` in Next.js 16 — always `await searchParams` / `await params`.

### Cloudflare Workers / OpenNext

- `getCloudflareContext({ async: true })` is required from RSC paths in dev — the `async: true` flag is mandatory.
- Bindings and secrets available via CF env win over `process.env`; `.dev.vars` simulates them locally.
- No Node.js-only APIs that lack CF Workers polyfills — check `@opennextjs/cloudflare` compatibility list.

### Tailwind CSS v4

- No `tailwind.config.js` — all customization via CSS `@theme` blocks in `app/globals.css`.
- Use `cn()` from `lib/cn.ts` (clsx + tailwind-merge) for conditional class merging — never template literal concatenation.
- Avoid inline `style={{}}` for layout; use Tailwind utilities or CSS variables.
