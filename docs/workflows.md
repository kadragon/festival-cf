# Workflows

## `code` — Implementation

Primary cycle for all behavioral changes.

**Step 0: Branch**
Never commit to `main`. Branch first:
```bash
git checkout -b feat/<slug>   # or fix/, refactor/, docs/
```

**Step 1: Scope check (delegation gate)**
Check objective triggers from `AGENTS.md ## Delegation`:
- First edit in `lib/tourApi.ts` this session → read full file before proceeding
- Change spans ≥3 top-level dirs → complete plan first (write to `docs/design/{feature}.md`)
- Same failure ×2 → call `advisor`

**Step 2: Exit criterion**
State in one sentence what "done" means before writing any code.
- Example: "`res.ok` check in `fetchDetailCommon` prevents HTML parse errors on 4xx responses"
- No implementation until exit criterion is clear.

**Step 3: Implement**
Follow `docs/conventions.md`. Minimum code that satisfies exit criterion.

**Step 4: Verify**
- `npx tsc --noEmit` passes
- `pnpm preview` → manual browser check confirms behavior
- All golden principles satisfied (self-review)

**Step 5: Commit**
```
[TYPE] description
```
Types: `[FEAT]` · `[FIX]` · `[REFACTOR]` · `[DOCS]` · `[HARNESS]`

## `plan` — Design First

For changes spanning ≥3 directories or introducing new data flows:

1. Write `docs/design/{feature}.md` — user stories, tech design, phased list.
2. Review with user. Do not proceed until approved.
3. Add `backlog.md` items from approved spec.

## `sweep` — Garbage Collection

Run between features:

1. Review `backlog.md` — prune done items, re-prioritize.
2. Check for stale `docs/` (docs that contradict code).
3. Run `npx tsc --noEmit` — catch silent drift.
4. Add findings as `[doc]`, `[debt]`, or `[harness]` items in `backlog.md`.

## `explore` — Research

State question → prototype/research → report options and tradeoffs → **do not commit**. Flows into `plan` or `code` if approved.

## `draft` — Documentation

Write or update `docs/`. Ground every claim in current code. Never modify production code in this workflow.
