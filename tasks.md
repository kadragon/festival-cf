# Tasks

_No active sprint. Items queued in `backlog.md`._

## Review Backlog

### PR #8 — [FIX] include today-start festivals, sort upcoming by date, add contentId to detail errors (2026-06-13)

- [ ] [debt] Null-guard the new `.sort()` localeCompare calls — `(a.eventstartdate ?? '').localeCompare(b.eventstartdate ?? '')`; throws if TourAPI ever returns an item with missing `eventstartdate` (low confidence — required field, near-always present) (source: pr-review-toolkit:review-pr) — `app/api/festivals/route.ts:38,50`, `app/page.tsx:36`
- [ ] [debt] Per-page `.sort()` sorts only within each 20-item page; "더 많은 소식" batches arrive out of global startdate order across infinite-scroll loads. Fetch-then-sort or accept the modified-date (`arrange:'C'`) pagination limitation (source: agy, P2) — `app/api/festivals/route.ts:50`
- [ ] [debt] page>1 `else` branch emits duplicate `contentid` for today-starting festivals already returned as page-1 `ongoing`; masked by client `initialIds` dedup but the API contract regresses for other consumers (source: codex, P3) — `app/api/festivals/route.ts:42-52`
- [ ] [doc] FestivalCard perforation comment imprecise — notch circles straddle the card edge (cover bg-card corner + blend outside), not merely "paint over the edge" (source: pr-review-toolkit:review-pr, P3) — `components/FestivalCard.tsx:53`

### PR #6 — ws vulnerability check (resolved)

- `ws@8.18.0` GHSA-58qx-3vcg-4xpx: checked GitHub Dependabot alerts — **not flagged**, no override added. Re-evaluate only if a future alert appears.

### Out of scope (noted, not actioned)

- Dependabot open alert: `esbuild` (GHSA-g7r4-m6w7-qqqr, low, `>= 0.27.3, < 0.28.1`) — transitive dep, not in any PR backlog. Add to `backlog.md` if you want it tracked.
