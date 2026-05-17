# Tasks

## Backlog

- [ ] `lib/tourApi.ts` — Add `res.ok` checks to `fetchDetailCommon`, `fetchDetailIntro`, `fetchDetailImages` (pre-existing gap; proxy adds extra failure surface where non-200 returns HTML and `res.json()` throws)
- [ ] `lib/tourApi.ts` — Narrow bare `catch {}` in `readEnv` to log unexpected errors via `console.warn` (currently swallows SDK bugs silently)
- [ ] `lib/tourApi.ts` — Replace `env as unknown as Record<string, string | undefined>` double cast with typed env var extraction
