# Task List: Re-Architecture

## Plan Reference
Implements: `specs/feat/rearchitecture-2026-05/plan.md`

## Dependency Graph

```
Phase 1 — Independent (all [P])
├─ E1: TASK-001..003 Archive Python scripts
├─ E2: TASK-004..006 Consolidate duplicate files
└─ E6: TASK-007..008 GitHub settings

Phase 2 — Auto-generation (E3 → E5)
├─ TASK-009 Create generate-llms.ts script
├─ TASK-010 Add CI freshness check
└─ TASK-011 Consolidate tool descriptions

Phase 3 — Eval completeness (E4)
├─ TASK-012 Add handler import support to evals
├─ TASK-013 Add handler output validation
└─ TASK-014 Add crisis resource checks

Phase 4 — Verify + Deploy
├─ TASK-015 Run full CI pipeline
└─ TASK-016 Gate checklist review
```

## Tasks

### Phase 1: Independent Quick Wins

- [ ] **TASK-001** [M] Move Python scripts to legacy directory (E1)
  - Create `legacy/python-scripts/` at repo root
  - Move each `skills/<skill>/scripts/` to `legacy/python-scripts/<skill>/`
  - 112 files across 10 skills
  - Files: 112 moves
  - Depends on: none

- [ ] **TASK-002** [M] Update SKILL.md Python script references (E1)
  - For each of 10 SKILL.md files: remove or update Python script usage examples
  - Remove `scripts/` references from Available Scripts sections
  - Add note: "Python scripts moved to legacy/python-scripts/ — the MCP server uses TypeScript handlers instead"
  - Files: 10 × `skills/*/SKILL.md`
  - Depends on: TASK-001

- [ ] **TASK-003** [S] Verify pnpm evals passes after removal (E1)
  - Run `pnpm evals` — all 11 checks must pass
  - Fix any broken path references
  - Depends on: TASK-002

- [ ] **TASK-004** [S] [P] Remove per-skill LICENSE files (E2)
  - Root `LICENSE` already covers all
  - Files: 10 × `skills/*/LICENSE` (remove)
  - Depends on: none

- [ ] **TASK-005** [S] [P] Merge per-skill CHANGELOG files into root (E2)
  - Append each skill's changelog entries to root `CHANGELOG.md`
  - Remove per-skill CHANGELOG.md files
  - Files: root `CHANGELOG.md` (edit), 10 × `skills/*/CHANGELOG.md` (remove)
  - Depends on: none

- [ ] **TASK-006** [S] [P] Merge per-skill README files into SKILL.md (E2)
  - Each skill's README.md duplicates SKILL.md content — remove
  - Move any README-unique content into SKILL.md before removal
  - Files: 10 × `skills/*/README.md` (merge + remove)
  - Depends on: none

- [ ] **TASK-007** [S] [P] Set GitHub social preview image (E6)
  - Use `site/assets/hero-architecture.svg` as Open Graph image
  - Verify via GitHub settings API or manual UI
  - Depends on: none

- [ ] **TASK-008** [S] [P] Expand GitHub topics (E6)
  - Add: `skill-framework`, `human-centered`, `agent-tools`, `content-safety`, `heuristic`
  - Via: GitHub repo settings UI (API if available)
  - Depends on: none

### Phase 2: Auto-Generation

- [ ] **TASK-009** [M] Create generate-llms.ts script (E3)
  - Read actionContracts from `mcp-servers/src/index.ts`
  - Read JSON input/output schemas for required/optional fields
  - Generate llms.txt tool signatures table
  - Generate llms-full.txt by concatenating SKILL.md files
  - Add `pnpm generate:llms` script to root package.json
  - Files: `scripts/generate-llms.ts` (new), `llms.txt`, `llms-full.txt`, `package.json`
  - Depends on: none

- [ ] **TASK-010** [S] Add CI freshness check for generated files (E3)
  - Add step to `.github/workflows/ci.yml`: run `pnpm generate:llms`, then verify llms.txt + llms-full.txt match committed versions (checksum)
  - Files: `.github/workflows/ci.yml`
  - Depends on: TASK-009

- [ ] **TASK-011** [M] [P] Consolidate tool descriptions (E5)
  - Move tool descriptions from mcp-server.ts inline strings to index.ts contracts
  - Add `description` field to actionContractSchema and actionContracts array
  - mcp-server.ts tool() calls read description from contracts
  - Files: `mcp-servers/src/index.ts`, `mcp-servers/src/mcp-server.ts`
  - Depends on: none

### Phase 3: Eval Completeness

- [ ] **TASK-012** [M] Add handler import support to evals package (E4)
  - Add `@humanity4ai/mcp-servers` as devDependency, or add workspace reference in evals/tsconfig.json to resolve `../mcp-servers/src/`
  - Import `invokeAction` and `actionContracts` in `run-evals.ts`
  - Files: `evals/package.json`, `evals/tsconfig.json`, `evals/src/run-evals.ts`
  - Depends on: none

- [ ] **TASK-013** [M] [P] Add handler output validation to run-evals.ts (E4)
  - For each of 10 skills: call `invokeAction()` with valid test inputs
  - Compare output field names against declared output JSON schema
  - Flag extra fields (in handler but not schema)
  - Flag missing required fields (in schema but not handler output)
  - Files: `evals/src/run-evals.ts`
  - Depends on: TASK-012

- [ ] **TASK-014** [M] [P] Add crisis resource presence check to run-evals.ts (E4)
  - For 3 safety-critical skills: invoke with known crisis inputs
  - Verify escalation_guidance/crisis_resources contains 988 or 741741
  - Files: `evals/src/run-evals.ts`
  - Depends on: TASK-012

### Phase 4: Verify + Deploy

- [ ] **TASK-015** [M] Run full CI pipeline
  - `pnpm check` — zero type errors
  - `pnpm test` — all existing tests pass
  - `pnpm evals` — all checks pass (including new handler validation)
  - `pnpm generate:llms` — successfully regenerates
  - `pnpm build` — dist/ compiles clean
  - Depends on: all Phase 1-3 tasks

- [ ] **TASK-016** [S] Gate checklist review
  - [ ] 112 Python scripts moved to legacy/
  - [ ] All 10 SKILL.md files updated
  - [ ] Per-skill LICENSE, CHANGELOG, README consolidated
  - [ ] llms.txt + llms-full.txt auto-generated, CI freshness check passes
  - [ ] Tool descriptions single-sourced from contracts
  - [ ] Eval invokes all 10 handlers, validates output against schemas
  - [ ] Eval checks crisis resources for safety-critical skills
  - [ ] Repo size reduced by ≥ 30%
  - [ ] `pnpm check && pnpm test && pnpm evals` all pass
  - Depends on: TASK-015

## Legend
- `[S]` Small — under 1 hour
- `[M]` Medium — 1–3 hours
- `[P]` Parallelizable

## Task Summary

| ID | Phase | Size | Parallel | Description |
|----|-------|------|----------|-------------|
| 001 | 1 | M | - | Move 112 Python scripts to legacy/ |
| 002 | 1 | M | - | Update SKILL.md Python references |
| 003 | 1 | S | - | Verify pnpm evals after removal |
| 004 | 1 | S | P | Remove per-skill LICENSE files |
| 005 | 1 | S | P | Merge per-skill CHANGELOG into root |
| 006 | 1 | S | P | Merge per-skill README into SKILL.md |
| 007 | 1 | S | P | Set GitHub social preview image |
| 008 | 1 | S | P | Expand GitHub topics |
| 009 | 2 | M | - | Create generate-llms.ts |
| 010 | 2 | S | - | Add CI freshness check |
| 011 | 2 | M | P | Consolidate tool descriptions |
| 012 | 3 | M | - | Add handler import to evals |
| 013 | 3 | M | P | Add handler output validation |
| 014 | 3 | M | P | Add crisis resource checks |
| 015 | 4 | M | - | Full CI pipeline |
| 016 | 4 | S | - | Gate checklist review |

**Total:** 16 tasks. 9× S, 7× M. 8 tasks parallelizable across Phases 1-3.
