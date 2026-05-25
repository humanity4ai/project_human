# GitHub Hygiene: Branch Reconciliation, PR Cleanup, Issue Triage

Status: Draft
Version: 1.0
Last updated: 2026-05-24

## Overview

The humanity4ai/project_human repository has accumulated 5 categories of operational debt:
diverged branches, a workflow-violating feature PR, 12 stale dependabot PRs with failing CI,
duplicate open issues, and 14 issues with no activity for 12+ weeks. This spec addresses
all five via systematic hygiene operations on the GitHub repository.

## User Stories

### Primary
As a project maintainer, I want branches reconciled to the stated workflow
(`feature/* → development → main`) so that PRs target the correct base and CI gates
are meaningful.

### Secondary
As a community contributor, I want a clean open-issue list so that I can find
actionable, current issues without wading through 12-week-old stale tickets.

## Boundaries

**Always do:**
- Preserve the `development` branch as the default target branch per AGENTS.md workflow
- Verify CI passes before closing or merging any PR
- Ensure all dependabot PRs that are closed get recreated against the correct base
- Resolve duplicate issues by keeping the most detailed/complete one

**Ask first (do not proceed unilaterally):**
- Force-pushing to any protected branch
- Deleting the `development` branch
- Closing any non-dependabot PR without explicit review

**Never do:**
- Amend or rewrite history on `main` or `development`
- Close a draft PR from an active contributor without notification
- Delete a branch whose corresponding PR is still open

## Acceptance Criteria

### Epic 1: Branch Reconciliation [MUST]

#### AC-1.1: Single source of truth [MUST]
Given `main` is 17 commits ahead of `development` and `development` is 3 commits ahead of `main`
When branches are reconciled
Then `development` contains all commits from both branches (no lost work)
And `main` is either fast-forwarded to match `development` or reset to an appropriate state
And the AGENTS.md workflow (`feature/* → development → main`) is restored

#### AC-1.2: No divergent history [MUST]
Given reconciliation is complete
When `main...development` comparison is made via GitHub API
Then `ahead_by` and `behind_by` are both 0 (branches in sync, or one is a strict descendant of the other)

#### AC-1.3: Existing open PRs remain valid [MUST]
Given PR #87 and all dependabot PRs are open at reconciliation start
When branches are reconciled
Then the destination branch of each open PR still exists and contains the expected history
And no PR shows "unknown base branch"

### Epic 2: PR #87 Workflow Fix [MUST]

#### AC-2.1: PR targets development [MUST]
Given PR #87 currently targets `main`
When the base branch is changed
Then PR #87 targets `development`
And the PR description reflects the correct target

#### AC-2.2: CI passes after rebase [MUST]
Given PR #87 is rebased onto reconciled `development`
When CI workflow runs
Then `pnpm check`, `pnpm test`, and `pnpm evals` all pass

### Epic 3: Dependabot PR Cleanup [MUST]

#### AC-3.1: Failing dependabot PRs closed [MUST]
Given 12 dependabot PRs are open, most with failing CI (install step)
When audit is complete
Then all dependabot PRs with failing CI are closed with a comment indicating they will be recreated
And all dependabot PRs older than 4 weeks with no CI activity are closed

#### AC-3.2: Mergeable dependabot PRs merged [SHOULD]
Given PR #80 (pnpm/action-setup 6.0.8) passed CI
When maintainer approves
Then PR #80 is merged into `development`

#### AC-3.3: Clean slate [MUST]
Given dependabot cleanup is complete
When checking open PRs list
Then no dependabot PR is older than 2 weeks
And no dependabot PR has failing CI

### Epic 4: Duplicate Issue Resolution [MUST]

#### AC-4.1: Duplicate closed [MUST]
Given issue #33 (by simonplmak-cloud) and issue #11 (by humanity4ai) are duplicates
  ("Add multilingual supportive-conversation scenarios")
When duplicate resolution is performed
Then one issue remains open (the more detailed one)
And the other is closed with a comment referencing the kept issue

### Epic 5: Stale Issue Triage [SHOULD]

#### AC-5.1: Issues are current [SHOULD]
Given 14 open issues, all 12+ weeks old with zero comments
When triage is complete
Then issues with clearly superseded or completed work are closed
And issues still relevant are labeled appropriately (e.g., `help wanted`, `good first issue`)
And each closed issue includes a brief closing comment

#### AC-5.2: Issue #36 validation reference fixed [MUST]
Given issue #36 references `pnpm build:contracts` in its validation steps
And `build:contracts` was removed from the project (confirmed in AGENTS.md)
When issue text is reviewed
Then the stale `build:contracts` reference is corrected or the issue is closed

## Error Cases

### AC-E1: Branch reconciliation merge conflict [MUST]
Given files conflict during merge of diverged branches
When reconciliation is attempted
Then conflict resolution follows these rules:
  - For source code: use the `main` branch version (most recent)
  - For documentation: prefer the more detailed version
  - For lockfiles: regenerate from scratch
And the resolution is documented in a commit message

### AC-E2: Protected branch restriction blocks operation [MUST]
Given `main` and `development` are both protected branches
When a direct push is required for reconciliation
Then the operation is performed via a temporary branch + PR
Or protection rules are temporarily adjusted with an audit trail

### AC-E3: Dependabot recreates PRs against wrong branch [SHOULD]
Given dependabot PRs are closed as part of cleanup
When dependabot recreates them
Then they target the correct base branch (determined by dependabot config)
And if they still fail, dependabot update rules are adjusted for the failing dependencies

## Out of Scope

- Changing the AGENTS.md workflow (`feature/* → development → main`)
- Resolving issues #33-#40 (Manifesto feature work) — those are feature requests, not hygiene
- Updating or modifying PR #87's code content
- Changing branch protection rules permanently
- Publishing a new release
- Modifying the `.github/dependabot.yml` configuration (unless blocked PRs recur)

## Non-Functional Requirements

- Auditability: every branch merge/close/change must have a traceable commit or PR comment
- Communication: any closed issue/PR must include a comment explaining the reason
- Reversibility: no operation should be irreversible (use PRs, not direct pushes, when possible)
