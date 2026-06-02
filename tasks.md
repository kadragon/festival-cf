# Tasks

_No active sprint. Items queued in `backlog.md`._

## Review Backlog

### PR #4 — [FIX] add res.ok checks to fetchDetailCommon, fetchDetailIntro, fetchDetailImages (2026-05-27)

- [ ] [debt] Add `contentId` to error messages in fetchDetailCommon/Intro/Images for debuggability (source: pr-review-toolkit:review-pr) — `lib/tourApi.ts:158,167,176`
- [ ] [debt] Add `app/error.tsx` boundary for festival detail page (source: pr-review-toolkit:review-pr) — already tracked in `backlog.md` Someday

### PR #5 — [REFACTOR] narrow catch + typed CF env extraction in readEnv (2026-05-27)

- [ ] [harness] Add `push: branches: [main]` trigger to CI workflow — post-merge integrity currently unguarded (source: pr-review-toolkit:review-pr) — `.github/workflows/ci.yml:4`

### PR #6 — [FIX] force postcss >=8.5.10 and qs >=6.15.2 via pnpm overrides (2026-06-02)

- [ ] [debt] `ws@8.18.0` may be vulnerable to GHSA-58qx-3vcg-4xpx (uninitialized memory disclosure); verify against GitHub Dependabot alerts and add `ws: ">=8.20.1"` override if confirmed (source: agy) — `pnpm-workspace.yaml`
