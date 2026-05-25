# Technical Plan: GitHub Hygiene 2026-05

## Spec Reference
Implements: `specs/fix/github-hygiene-2026-05/spec.md`

## Architecture Overview

All operations are GitHub API-based. No local code changes required. The plan uses
`gh` CLI for API interactions, git operations for branch reconciliation, and
GitHub pull requests for protected-branch safepaths.

The plan is sequenced: Epic 1 (branch reconciliation) **must** complete first, because
all other epics depend on a consistent branch state. Epics 2-5 are independent of each
other and can run in parallel after Epic 1 finishes.

**Sequence:** E1 → (E2 || E3 || E4 || E5)

## Component Breakdown

### Branch Reconciliation Engine
- **Responsibility:** Reconcile diverged `main` and `development` branches
- **Strategy:** Create temporary reconciliation branch from `development`, merge `main` into it via PR, fast-forward `main` to match result
- **Location:** GitHub (operations run via `gh` CLI from local checkout)
- **AC Coverage:** AC-1.1, AC-1.2, AC-1.3, AC-E1, AC-E2

### PR Base Branch Updater
- **Responsibility:** Change PR #87 base from `main` to `development`
- **Strategy:** Coordinate with PR author (`simonplmak-cloud`) to rebase after reconciliation; use `gh pr edit` or GitHub UI
- **Location:** GitHub API (`gh pr edit --base development`)
- **AC Coverage:** AC-2.1, AC-2.2

### Dependabot PR Auditor
- **Responsibility:** Audit and close/merge 12 stale dependabot PRs
- **Strategy:** Query CI status for each PR. Close failing PRs (will be recreated). Merge #80 (passed CI). Batch-close oldest PRs.
- **Location:** GitHub API (`gh pr close`, `gh pr merge`)
- **AC Coverage:** AC-3.1, AC-3.2, AC-3.3, AC-E3

### Issue Duplicate Resolver
- **Responsibility:** Close duplicate issue #11, keep #33
- **Strategy:** Close #11 with a comment referencing #33. Add `duplicate` label.
- **Location:** GitHub API (`gh issue close`, `gh issue comment`)
- **AC Coverage:** AC-4.1

### Stale Issue Triage Engine
- **Responsibility:** Review 14 open issues and close/relabel as appropriate
- **Strategy:** Per-issue review against current project state. Close superseded. Label remaining.
- **Location:** GitHub API (`gh issue close`, `gh issue edit`)
- **AC Coverage:** AC-5.1, AC-5.2

## Technology Choices

| Decision | Choice | Rationale |
|----------|--------|-----------|
| GitHub API client | `gh` CLI (pre-authenticated) | Zero setup; built-in pagination and JSON output |
| Branch operations | `git` via bash in local repo | Full control over merge strategies and conflict resolution |
| Reconciliation safepath | Temporary branch + PR | Protected branches can't be force-pushed; PRs are the approved mechanism |
| Issue/PR batching | `gh` with shell loops | Simple, auditable, no extra dependencies |

## Pre-Flight Inventory

### Current Branch State
```
main:        55f7bc6 (Mar 9) + 17 unique commits
development: 55f7bc6 (Mar 9) +  3 unique commits
Divergence:  main is +17/-3 relative to development
```

### Open PRs (13 total)
| # | Type | Base | CI | Age | Action |
|---|------|------|----|-----|--------|
| 87 | Feature | main | ✅ | 2d | Change base to development |
| 89 | Dependabot: tsx/evals | development | ❌ | 1d | Close (recreate) |
| 88 | Dependabot: tsx/mcp-servers | development | ❌ | 1d | Close (recreate) |
| 84 | Dependabot: @types/node/evals | development | ❌ | 8d | Close (recreate) |
| 83 | Dependabot: @types/node/mcp-servers | development | ❌ | 8d | Close (recreate) |
| 81 | Dependabot: yaml/evals | development | ❌ | 8d | Close (recreate) |
| 80 | Dependabot: pnpm/action-setup | development | ✅ | 8d | Merge |
| 73 | Dependabot: typescript/mcp-servers | development | ? | 5w | Close (stale) |
| 72 | Dependabot: typescript/evals | development | ? | 5w | Close (stale) |
| 69 | Dependabot: upload-pages-artifact | development | ? | 6w | Close (stale) |
| 68 | Dependabot: MCP SDK/mcp-servers | development | ? | 7w | Close (stale) |
| 61 | Dependabot: configure-pages | development | ? | 8w | Close (stale) |
| 60 | Dependabot: deploy-pages | development | ? | 8w | Close (stale) |

### Open Issues (14 total)
| # | Title | Age | Action |
|---|-------|-----|--------|
| 41 | [Community Call] Manifesto to roadmap | 12w | Keep (meta) |
| 40 | Audit coverage of manifesto principles | 12w | Keep |
| 39 | Improve first-time contributor onboarding | 12w | Keep |
| 38 | Improve agent adapter parity documentation | 12w | Keep |
| 37 | Strengthen eval rubric for ambiguity handling | 12w | Keep |
| 36 | Expand MCP schema examples and docs clarity | 12w | **Close** (references removed `build:contracts`) |
| 35 | Harden escalation language in safety-critical skills | 12w | Keep |
| 34 | Add accessibility edge-case scenario coverage | 12w | Keep |
| 33 | Expand multilingual supportive-conversation scenarios | 12w | Keep (more detailed) |
| 11 | Add multilingual supportive-conversation scenarios | 12w | **Close** (duplicate of #33) |
| 8  | A8 Knowledge Core: canon expansion | 12w | Keep |
| 7  | A7 Evals: qualitative scoring extension | 12w | Keep |
| 4  | A4 Skills Factory B: scenario expansion | 12w | Keep |
| 3  | A3 Skills Factory A: quality uplift for launch skills | 12w | Keep |

## AC Coverage Map

| AC | Component(s) |
|----|-------------|
| AC-1.1, AC-1.2, AC-1.3 | Branch Reconciliation Engine |
| AC-2.1, AC-2.2 | PR Base Branch Updater |
| AC-3.1, AC-3.2, AC-3.3 | Dependabot PR Auditor |
| AC-4.1 | Issue Duplicate Resolver |
| AC-5.1, AC-5.2 | Stale Issue Triage Engine |
| AC-E1 | Branch Reconciliation Engine (merge conflict handling) |
| AC-E2 | Branch Reconciliation Engine (protected branch safepath) |
| AC-E3 | Dependabot PR Auditor (recreation behavior) |

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Merge conflict during reconciliation | Medium | Medium | Use `main` version for code, regenerate lockfiles. Document resolution. |
| Dependabot recreates PRs against old base | Low | Low | PRs will target their configured base (already `development`). Failing CI will recur if lockfiles not regenerated. |
| PR #87 author's branch diverges after rebase | Low | Medium | Coordinate with author before changing base. Notify on PR. |
| Protected branch rules block reconciliation PR | Low | High | Use a PR-based safepath; protection rules on `development` allow PR merges. |

## Out of Scope (Technical)

- No code changes to the project_human repository
- No modification to `.github/dependabot.yml`
- No branch protection rule changes
- No npm publishing or release tagging
- No changes to PR #87's content (only metadata)
