# Re-Architecture: Effective, Efficient, Optimised Repository

Status: Draft
Version: 1.0
Last updated: 2026-05-26

## Overview

The `humanity4ai/project_human` repository has grown organically and carries
significant structural debt: 112 Python scripts that the MCP server never calls,
123 skill markdown files with heavy duplication, hand-authored LLM prompts that
drift from source, and an eval system that validates files but never invokes
handlers. This spec re-architects from 3 perspectives — efficiency (less waste),
effectiveness (better output), and optimisation (faster/smaller).

## Baseline Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Python scripts (unused MCP) | 112 | 0 (moved to legacy/ or deleted) |
| Skill MD files | 123 | ~30 (consolidated) |
| Tool signature definition points | 3 (index.ts, mcp-server.ts, llms.txt) | 1 (index.ts → auto-generated) |
| LLM prompt generation | Manual | Auto-generated from contracts + SKILL.md |
| Eval handler coverage | 0% (checks files only) | 100% (invokes all 10 handlers) |
| Repo size | 2.5M | ~1.5M |
| Root-level files | 20 | ~12 |
| Per-skill files | ~30 | ~12 |
| CI falsifiable failures | File existence + coverage | + handler output validation |

## User Stories

### Primary — Maintainer Efficiency
As a maintainer adding a new skill pattern, I want to edit exactly ONE file
(patterns.ts) so that both the TypeScript handler and the documentation
automatically reflect the change without manual sync across 3+ files.

### Secondary — Integrator Confidence
As an integrator, I want the eval system to validate handler outputs against
declared schemas so that I know the MCP server returns what it promises.

### Tertiary — LLM Discovery Accuracy
As an LLM discovering the project via llms.txt, I want tool signatures
mechanically derived from contracts so they never drift from implementation.

## Boundaries

**Always do:**
- Auto-generate LLM prompts and tool signature docs from TypeScript contracts
- Validate handler outputs against schemas in CI
- Keep patterns in a single source-of-truth file (`patterns.ts`)
- Remove unreferenced files that are not called by the MCP server

**Ask first (do not proceed unilaterally):**
- Deleting Python scripts (archive first, delete after verification)
- Changing the MCP server transport or protocol
- Changing the skill YAML schema

**Never do:**
- Hardcode crisis phone numbers outside `crisis-resources.ts`
- Write tool signatures by hand in docs — always generate from contracts
- Add a Python script without adding the equivalent pattern to `patterns.ts`

## Acceptance Criteria

### Epic 1: Remove Dead Code [MUST]

#### AC-1.1: Python scripts archived [MUST]
Given 112 Python scripts exist in skills/*/scripts/
When the re-architecture is complete
Then no Python scripts remain in the skills/ directory tree
And scripts are moved to a single `legacy/python-scripts/` directory at root
And SKILL.md files updated to reflect the move or remove Python references

#### AC-1.2: Repo size reduced [MUST]
Given the repo is 2.5MB (excluding node_modules and .git)
When unused files are removed or archived
Then disk usage drops by ≥ 30%

#### AC-1.3: pnpm evals passes after removal [MUST]
Given Python scripts are removed from skills/
When `pnpm evals` runs
Then all 11 checks pass (no path dependency on scripts/ directory)

### Epic 2: Consolidate Duplicate Content [SHOULD]

#### AC-2.1: Skill LICENSE files consolidated [SHOULD]
Given each skill has its own LICENSE file (identical MIT text)
When consolidated
Then a single root `LICENSE` file covers all skills
And per-skill LICENSE files are removed

#### AC-2.2: Skill CHANGELOG files consolidated [SHOULD]
Given 10 per-skill CHANGELOG.md files exist alongside root CHANGELOG.md
When consolidated
Then per-skill changelog entries are in the root `CHANGELOG.md`
And per-skill CHANGELOG.md files are removed

#### AC-2.3: Skill README files consolidated [SHOULD]
Given 10 per-skill README.md files exist
When reviewed
Then each README.md is either removed (if content duplicates SKILL.md) or merged into SKILL.md

### Epic 3: Auto-Generate LLM Prompts [MUST]

#### AC-3.1: llms.txt generated from contracts [MUST]
Given the tool signatures table in llms.txt is hand-authored
When a generation script is created (`pnpm generate:llms`)
Then running it produces llms.txt with tool signatures derived from index.ts contracts
And required/optional fields match actual JSON input schemas

#### AC-3.2: llms-full.txt generated from source [MUST]
Given llms-full.txt concatenates SKILL.md content
When `pnpm generate:llms` runs
Then llms-full.txt is regenerated from current disk files
And all internal links use absolute raw.githubusercontent.com URLs

#### AC-3.3: CI verifies generated files match source [SHOULD]
Given llms.txt and llms-full.txt are auto-generated
When CI runs
Then a checksum comparison verifies the committed files match the output of `pnpm generate:llms`
And any PR with generated files that diverge from source fails CI

### Epic 4: Eval System Completeness [MUST]

#### AC-4.1: Eval runs handler verification for all 10 skills [MUST]
Given the eval system currently checks only file existence
When enhanced
Then for each of the 10 registered skill actions, the eval sends valid input and validates that the response output fields match the declared output JSON schema
And any field in handler output not declared in the schema is flagged as an error
And any required schema field missing from handler output is flagged as an error

#### AC-4.2: Eval checks crisis resource presence [MUST]
Given 3 safety-critical skills
When `pnpm evals` runs
Then the eval verifies that crisis resources (988, 741741) appear in
  escalation_guidance for safety-critical handler outputs

#### AC-4.3: Eval uses real handler invocation with test inputs [MUST]
Given the eval package can access the MCP server's handler dispatcher
When enhanced
Then it sends both valid and crisis-signal test inputs to each of the 10 skill handlers
And verifies that crisis inputs trigger escalation or crisis resource output

### Epic 5: Tool Signature Single Source of Truth [MUST]

#### AC-5.1: Tool descriptions match between registration and docs [MUST]
Given tool descriptions appear in 3 places (index.ts contracts, mcp-server.ts tool()
  calls, llms.txt table)
When consolidated
Then tool descriptions in mcp-server.ts tool() calls are derived from contracts
And llms.txt table is auto-generated from the same contracts

#### AC-5.2: Contract schema references validated at build time [SHOULD]
Given index.ts references schema file paths
When `pnpm build` runs
Then a build step verifies all referenced schema files exist
And contract references match skill.yaml action definitions

### Epic 6: GitHub Settings & Social Presence [SHOULD]

#### AC-6.1: Repo social preview image [SHOULD]
Given the repo has no social preview image
When configured
Then an Open Graph image is set for link sharing

#### AC-6.2: Topics array complete [SHOULD]
Given the repo has 14 topics
When reviewed
Then the following discovery-relevant topics are added: `skill-framework`, `human-centered`, `agent-tools`, `content-safety`, `heuristic`

## Error Cases

### AC-E1: llms.txt generation fails on missing schema [MUST]
Given llms.txt generation reads skill contracts
When a referenced schema file is missing
Then generation fails with a clear error message listing the missing file
And CI blocks the PR

### AC-E2: Python script removal does not break SKILL.md references [MUST]
Given SKILL.md files reference Python scripts with `scripts/audit.py` etc.
When Python scripts are moved to legacy/
Then all SKILL.md Python script references are updated to point to the new location
Or removed if the script is no longer maintained

## Out of Scope

- Replacing regex patterns with NLP/ML approaches
- Changing the MCP server protocol (staying JSON-RPC 2.0 over stdio)
- Adding SSE transport
- Changing skill YAML schema format
- Merging skills or changing the 10-skill portfolio
