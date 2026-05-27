# Backlog

## Now

- [x] `lib/tourApi.ts` — Add `res.ok` checks to `fetchDetailCommon`, `fetchDetailIntro`, `fetchDetailImages` (pre-existing gap; proxy adds extra failure surface where non-200 returns HTML and `res.json()` throws)

## Next

- [x] `lib/tourApi.ts` — Narrow bare `catch {}` in `readEnv` to log unexpected errors via `console.warn` (currently swallows SDK bugs silently)
- [x] `lib/tourApi.ts` — Replace `env as unknown as Record<string, string | undefined>` double cast with typed env var extraction

## Someday

- [x] Add CI workflow (`pnpm build:worker` + `npx tsc --noEmit`) on every PR
- [x] Add error boundaries to festival detail page
