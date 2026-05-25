# Task List: GitHub Hygiene 2026-05

## Plan Reference
Implements: `specs/fix/github-hygiene-2026-05/plan.md`

## Dependency Graph

```
TASK-001 (Audit current state)
  └─ TASK-002 (Create reconciliation PR)
       └─ TASK-003 (Resolve merge conflicts, if any)
            └─ TASK-004 (Merge reconciliation PR)
                 └─ TASK-005 (Sync main → development)
                      ├─ TASK-007 [P] (Change PR #87 base)
                      │    └─ TASK-008 (Verify PR #87 CI)
                      ├─ TASK-009 [P] (Close failing dependabot PRs)
                      ├─ TASK-010 [P] (Merge dependabot PR #80)
                      ├─ TASK-011 [P] (Close stale dependabot PRs)
                      ├─ TASK-012 [P] (Close duplicate issue #11)
                      ├─ TASK-013 [P] (Close stale issue #36)
                      └─ TASK-014 [P] (Triage remaining issues)
                           └─ TASK-015 (Final audit — depends on all above)
```

## Tasks

### Setup

- [ ] **TASK-001** [S] Audit current state — snapshot baseline
  - Captures: current branch SHA, open PR list, open issue list with URLs
  - Outputs: confirmation that all 13 PRs and 14 issues are accounted for
  - Depends on: none
  - Tools: `gh api` for branches, PRs, issues; save to task output

### Epic 1: Branch Reconciliation

- [ ] **TASK-002** [L] Create reconciliation branch and PR
  - Creates branch: `fix/reconcile-main-into-development` from `development`
  - Merges `main` into the branch: `git merge main` (resolves `development`'s 3 unique commits with `main`'s 17)
  - Opens PR: `fix/reconcile-main-into-development` → `development`
  - Strategy: `main`'s content takes precedence for source code; regenerate lockfiles from scratch
  - Contract: `specs/fix/github-hygiene-2026-05/plan.md` → Branch Reconciliation Engine
  - Depends on: TASK-001
  - Verifies: AC-1.1, AC-1.3, AC-E1

- [ ] **TASK-003** [M] Resolve merge conflicts (conditional)
  - If TASK-002 produces merge conflicts: resolve per conflict resolution rules in AC-E1
  - If no conflicts: mark complete, skip resolution
  - Conflict rules: source code → use `main` version; docs → prefer more detailed; lockfiles → regenerate
  - Depends on: TASK-002
  - Verifies: AC-E1

- [ ] **TASK-004** [S] Merge reconciliation PR into `development`
  - Merge MR: `fix/reconcile-main-into-development` → `development`
  - Method: squash-merge to keep `development` history clean
  - Depends on: TASK-003
  - Verifies: AC-1.1

- [ ] **TASK-005** [M] Sync `main` to reconciled `development`
  - After TASK-004, `development` now contains all commits from both branches
  - Strategy: fast-forward `main` to match `development` (or create sync PR if protected)
  - If protected: open PR `development` → `main`, merge it
  - Depends on: TASK-004
  - Verifies: AC-1.2, AC-E2

- [ ] **TASK-006** [S] Verify branch sync
  - Run: `gh api repos/humanity4ai/project_human/compare/main...development`
  - Assert: `ahead_by` is 0, `behind_by` is 0 (or status is "identical")
  - Assert: all commits unique to `main` before reconciliation now appear in `development`
  - Depends on: TASK-005
  - Verifies: AC-1.2

### Epic 2: PR #87 Workflow Fix

- [ ] **TASK-007** [M] [P] Change PR #87 base to `development`
  - Command: `gh pr edit 87 --base development --repo humanity4ai/project_human`
  - If PR branch (`simonplmak-cloud:main`) conflicts with new base: notify author on PR and request rebase
  - Add comment: "Base changed to `development` per AGENTS.md workflow (`feature/* → development → main`)."
  - Depends on: TASK-005 (needs reconciled `development`)
  - Verifies: AC-2.1

- [ ] **TASK-008** [M] Verify PR #87 CI after rebase
  - Wait for CI workflow to trigger on PR #87 after base change
  - Assert: `pnpm check` passes, `pnpm test` passes (205/205), `pnpm evals` passes (11/11)
  - If CI fails: investigate, report to PR author
  - Depends on: TASK-007
  - Verifies: AC-2.2

### Epic 3: Dependabot PR Cleanup

- [ ] **TASK-009** [M] [P] Close failing dependabot PRs (#88, #89, #83, #84, #81)
  - Close each with comment: "Closed due to CI failure. @dependabot recreate after branch reconciliation."
  - PRs: #88, #89 (tsx — Install step failure), #83, #84 (@types/node), #81 (yaml)
  - Depends on: TASK-005
  - Verifies: AC-3.1

- [ ] **TASK-010** [S] [P] Merge dependabot PR #80 (pnpm/action-setup 6.0.8)
  - PR #80 passed CI successfully
  - Merge method: squash-merge into `development`
  - Depends on: TASK-005
  - Verifies: AC-3.2

- [ ] **TASK-011** [S] [P] Close stale dependabot PRs (#60, #61, #68, #69, #72, #73)
  - Close each with comment: "Closed — stale (>4 weeks). @dependabot recreate if still relevant."
  - PRs: #60 (deploy-pages, 8w), #61 (configure-pages, 8w), #68 (MCP SDK, 7w), #69 (upload-pages, 6w), #72 (typescript/evals, 5w), #73 (typescript/mcp-servers, 5w)
  - Depends on: TASK-005
  - Verifies: AC-3.3

### Epic 4: Duplicate Issue Resolution

- [ ] **TASK-012** [S] [P] Close duplicate issue #11
  - Close #11 with comment: "Closed as duplicate of #33 (more detailed version by @simonplmak-cloud). Continuing work in #33."
  - Add `duplicate` label if available
  - Depends on: TASK-005
  - Verifies: AC-4.1

### Epic 5: Stale Issue Triage

- [ ] **TASK-013** [S] [P] Close stale issue #36 (fix `build:contracts` reference)
  - Issue #36 references `pnpm build:contracts` which was removed (confirmed in AGENTS.md)
  - Close with comment: "The `build:contracts` script was removed in a prior refactor. Closing — if MCP schema examples are still needed, please open a new issue with current validation commands."
  - Depends on: TASK-005
  - Verifies: AC-5.2

- [ ] **TASK-014** [M] [P] Triage remaining 12 issues (#3, #4, #7, #8, #33, #34, #35, #37, #38, #39, #40, #41)
  - For each issue: verify it is still relevant against current project state
  - Add labels where missing: `help wanted`, `good first issue`, `needs-scenarios`
  - Ensure each issue has clear acceptance criteria
  - Issue #33: ensure it's not the same stale state as #11 (update if needed)
  - Depends on: TASK-005
  - Verifies: AC-5.1

### Final Audit

- [ ] **TASK-015** [S] Final audit and traceability report
  - Verify: `gh pr list --state open` shows ≤ 2 open PRs (#87 + at most 1 dependabot)
  - Verify: `gh issue list --state open` shows ≤ 13 open issues (14 minus 2 closed)
  - Verify: `gh api repos/humanity4ai/project_human/compare/main...development` shows sync
  - Verify: no duplicate issue titles exist
  - Output: summary of all operations performed with links to PRs/issues affected
  - Depends on: TASK-006, TASK-008, TASK-009, TASK-010, TASK-011, TASK-012, TASK-013, TASK-014

## Legend
- `[S]` Small — under 1 hour
- `[M]` Medium — 1–3 hours
- `[L]` Large — 3–6 hours
- `[P]` Parallelizable — can run concurrently with other `[P]` tasks at same dependency level

## Task Summary

| ID | Epic | Size | Parallel | Description |
|----|------|------|----------|-------------|
| 001 | Setup | S | - | Audit current state snapshot |
| 002 | E1 | L | - | Create reconciliation branch + PR |
| 003 | E1 | M | - | Resolve merge conflicts (conditional) |
| 004 | E1 | S | - | Merge reconciliation PR |
| 005 | E1 | M | - | Sync main to development |
| 006 | E1 | S | - | Verify branch sync |
| 007 | E2 | M | P | Change PR #87 base to development |
| 008 | E2 | M | - | Verify PR #87 CI |
| 009 | E3 | M | P | Close failing dependabot PRs |
| 010 | E3 | S | P | Merge dependabot PR #80 |
| 011 | E3 | S | P | Close stale dependabot PRs |
| 012 | E4 | S | P | Close duplicate issue #11 |
| 013 | E5 | S | P | Close stale issue #36 |
| 014 | E5 | M | P | Triage remaining 12 issues |
| 015 | Audit | S | - | Final audit and traceability report |

**Total:** 15 tasks. Estimated effort: 2× L, 6× M, 7× S. Parallelizable in 3 phases.
