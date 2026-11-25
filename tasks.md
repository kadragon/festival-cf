# Tasks

_No active sprint. Items queued in `backlog.md`._

## Review Backlog

### PR #9 — [FIX] region codes + KV incremental cache (2026-06-13)

- [x] [debt] `ensureArray<T>` widened to `val: unknown` with internal `as T[]` cast — unsound: a TourAPI item not matching T propagates silently. Acceptable for external-JSON parsing, but a runtime shape-check or type predicate would be safer (source: pr-review-toolkit:review-pr, P3) — `lib/tourApi.ts:72` *(resolved: documented as deliberate external-JSON trust-boundary cast; runtime predicate intentionally omitted)*
- [x] [debt] `const body = json.response?.body` uses a redundant optional chain — after the `resultCode` guard, `json.response` is statically guaranteed non-null. Cosmetic type-expressiveness only, zero runtime impact (verifier-confirmed P3) (source: pr-review-toolkit:review-pr) — `lib/tourApi.ts:162` *(resolved: capture `json.response` once + explicit null guard narrows it, `?.` removed)*

### PR #8 — [FIX] include today-start festivals, sort upcoming by date, add contentId to detail errors (2026-06-13)

- [x] [debt] Null-guard the `.sort()` localeCompare call — `(a.eventstartdate ?? '').localeCompare(b.eventstartdate ?? '')`; throws if TourAPI ever returns an item with missing `eventstartdate` (low confidence — required field, near-always present) (source: pr-review-toolkit:review-pr) — `app/api/festivals/route.ts:38`, `app/page.tsx:36` *(resolved: both sort sites null-guarded)*
- [x] [debt] Per-page `.sort()` sorts only within each 20-item page; "더 많은 소식" batches arrive out of global startdate order across infinite-scroll loads. Fetch-then-sort or accept the modified-date (`arrange:'C'`) pagination limitation (source: agy, P2) — `app/api/festivals/route.ts:50` *(resolved in PR #14)*
- [x] [debt] page>1 `else` branch emits duplicate `contentid` for today-starting festivals already returned as page-1 `ongoing`; masked by client `initialIds` dedup but the API contract regresses for other consumers (source: codex, P3) — `app/api/festivals/route.ts:42-52` *(resolved: documented as accepted stateless-pagination tradeoff; server-side dedup impossible without client passing page-1 ids)*
- [x] [doc] FestivalCard perforation comment imprecise — notch circles straddle the card edge (cover bg-card corner + blend outside), not merely "paint over the edge" (source: pr-review-toolkit:review-pr, P3) — `components/FestivalCard.tsx:53` *(resolved: comment rewritten to describe straddle/blend behavior)*

### PR #6 — ws vulnerability check (resolved)

- `ws@8.18.0` GHSA-58qx-3vcg-4xpx: checked GitHub Dependabot alerts — **not flagged**, no override added. Re-evaluate only if a future alert appears.

### PR #10 — [FEAT] dynamic Next.js icons + harden wrangler config (2026-06-13)

- [x] [debt] `cpu_ms: 30000` is 1000× paid-tier default; profile actual usage via `wrangler tail` and reduce to measured value — added intentionally for next/og rendering but undocumented (source: pr-review-toolkit:review-pr, P2/conf60) — `wrangler.jsonc:24` *(stale: `cpu_ms` removed in 36be3d9 — not supported on Free plan; no code action)*

### PR #14 — [FIX] accept TourAPI modification-date ordering on page 2+ (2026-06-15)

- [x] [debt] Page-1 upcoming items still sorted by `eventstartdate` (line 38) but page-2+ returns in TourAPI modify-date order — ordering inconsistency across infinite-scroll pages. Design decision needed: remove page-1 sort for full consistency, or accept two-tier model (curated page-1 sorted vs raw pagination page-2+). (source: agy, pr-review-toolkit:review-pr, P1/conf85) — `app/api/festivals/route.ts:38` *(resolved: accepted two-tier model, documented in code)*

### Out of scope (noted, not actioned)

- Dependabot open alert: `esbuild` (GHSA-g7r4-m6w7-qqqr, low, `>= 0.27.3, < 0.28.1`) — transitive dep, not in any PR backlog. Add to `backlog.md` if you want it tracked.
