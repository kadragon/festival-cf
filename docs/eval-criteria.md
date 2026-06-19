# Evaluation Criteria

Generator and evaluator are **separate roles**. An agent grading its own work leans lenient — spawn an independent `qa-verifier` to grade against this rubric, never self-review for the pass/fail decision.

No unit-test framework exists in this repo. The mechanical gate is `pnpm build` (Next.js build + TypeScript strict). Behavioural checks run against `pnpm preview` (Workers runtime on `http://localhost:8787`) or code review.

## Criteria

### 1. Functionality (weight: 40%)

Does the feature work end-to-end against real TourAPI data (or documented proxy mode)?

| Score | Description |
|-------|-------------|
| 5 | Feature works for all listed acceptance criteria; edge cases (empty list, API 500, missing field) handled |
| 4 | Works for the happy path; one minor edge case unhandled |
| 3 | Happy path works; build passes |
| 2 | Partial — some acceptance criteria fail |
| 1 | Does not build or core path broken |

**How to test:** `pnpm build` must exit 0; then `pnpm preview` and exercise the changed route/page, or review the data flow through `lib/tourApi.ts`.

### 2. Golden Principle Compliance (weight: 30%)

Does the change respect `AGENTS.md` golden principles?

| Score | Description |
|-------|-------------|
| 5 | All principles upheld; no API keys in source, all TourAPI via `lib/tourApi.ts`, `res.ok` before `.json()`, server components by default |
| 3 | Upheld, but a borderline call left without justification |
| 1 | Any principle violated (key in source = automatic 1 / security incident) |

**How to test:** `grep` changed files for hardcoded keys and direct `apis.data.go.kr` fetches; confirm new fetches check `res.ok`; confirm no needless `"use client"`.

### 3. Error Handling (weight: 20%)

Are failures surfaced, not swallowed? (See `docs/conventions.md` → Error Handling.)

| Score | Description |
|-------|-------------|
| 5 | Errors propagate to `error.tsx`/500; no empty `catch {}`; non-200 handled |
| 3 | Errors logged via `console.warn` minimum; no silent empty-array returns |
| 1 | Empty catch block or silently swallowed error introduced |

**How to test:** Review every `try/catch` and `fetch` in the diff.

### 4. Convention Fit (weight: 10%)

Naming, server/client boundary, Tailwind v4 usage per `docs/conventions.md`.

| Score | Description |
|-------|-------------|
| 5 | Matches surrounding code and conventions exactly |
| 3 | Minor naming/style drift |
| 1 | Wrong layer (client component for data fetch) or invented patterns |

**How to test:** Diff review against `docs/conventions.md`.

## Sprint Contract

Write this before implementing. Used by `dev-tools:next-tasks` (workflows Step 2). Section names are fixed:

```markdown
### Sprint Contract: {Feature/Fix Name}

**Scope:** {specific files/areas in scope}

**Acceptance criteria:**
- [ ] {Criterion 1 — concrete and testable}
- [ ] {Criterion 2}

**Out of scope:** {explicit exclusions}

**Lint/test command:** `pnpm build`  (add `pnpm cf-typegen` if `CloudflareEnv` types change)
```

For a bundle, write **one acceptance checkbox per bundled item** — never merge into a single vague criterion.

## Pass Threshold

- Every criterion ≥ 3 (no dimension broken), AND
- Weighted average ≥ 3.5, AND
- `pnpm build` exits 0.

Any golden-principle violation (criterion 2 = 1) fails the sprint regardless of average — hard gate.

## Evaluator Protocol

1. Read the Sprint Contract acceptance criteria.
2. Read this file for grading standards; read relevant `docs/` for context.
3. Run `pnpm build`; exercise via `pnpm preview` or code review.
4. List specific findings (pass/fail per contract item) **before** assigning any score — evidence first.
5. Grade each criterion independently; do not average away a hard-gate failure.
6. Below threshold → findings become `tasks.md` Review Backlog items → fix → re-evaluate once.

Be skeptical by default: hunt for what breaks, not what works. Do not identify a defect and then talk yourself out of it — a found-then-downgraded bug stays a fail.
