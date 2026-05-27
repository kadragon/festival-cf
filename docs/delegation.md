# Delegation

## When to Delegate

All triggers are objective and measurable — no subjective "unfamiliar" or "complex" conditions.

## Routing Table

| Trigger (objective) | Action | Gate | Model |
|---------------------|--------|------|-------|
| First edit in `lib/tourApi.ts` this session | Read full file before any changes | Mandatory, blocking | — |
| Change spans `app/` + `lib/` + `components/` (≥3 dirs) | Write `docs/design/{feature}.md`, user approval | Mandatory, blocking | sonnet |
| Same failure ×2 | Call `advisor` tool | Mandatory, blocking | opus |
| Feature complete | Self-review against golden principles before commit | Mandatory | — |
| Cross-cutting refactor (≥5 files across 2+ dirs) | Spawn explore subagent first; review findings | Mandatory | sonnet |

## Pattern Selection

This is a single-agent repo. No `TeamCreate` or orchestrator needed — complexity doesn't justify it.

- **Sub-agent** (via `Agent` tool): for bounded research tasks (explore, QA check) that produce a conclusion
- **Direct inline**: default for changes ≤2 files, clear scope

## Data Transfer

Subagent output → inline summary in main context. No `_workspace/` needed for tasks of this scale.

For larger explorations, save findings to `_workspace/{phase:02d}_{agent}_{artifact}.md` and summarize key conclusions inline.

## Effort Tiers

| Tier | Scope | Approach |
|------|-------|---------|
| Small | 1-2 files, single function | Direct implementation |
| Medium | 3-5 files, single feature | Plan step first |
| Large | ≥3 dirs, architectural change | `plan` workflow + user approval |
