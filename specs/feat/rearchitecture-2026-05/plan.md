# Technical Plan: Re-Architecture

## Spec Reference
Implements: `specs/feat/rearchitecture-2026-05/spec.md`

## Architecture Overview

The re-architecture has 4 independent workstreams plus 1 dependency:

```
E1 (Remove dead code) ─────────────────────────►
E2 (Consolidate content) ──────────────────────►  No inter-dependencies
E6 (GitHub settings) ──────────────────────────►
                                                  │
E3 (Auto-generate LLM) ──► E5 (Tool sigs SSoT) ─►  E3 → E5 (generation reads contracts)
                                                  │
E4 (Eval completeness) ─────────────────────────►  Independent (imports handlers)
```

## Component Breakdown

### 1. Dead Code Remover
- **Responsibility:** Move 112 Python scripts to `legacy/python-scripts/`, update SKILL.md references
- **Location:** `skills/*/scripts/` → `legacy/python-scripts/<skill>/`
- **AC Coverage:** AC-1.1, AC-1.2, AC-1.3, AC-E2

### 2. Content Consolidator
- **Responsibility:** Merge per-skill LICENSE, CHANGELOG, README into root-level files
- **Location:** Root directory + `skills/*/`
- **AC Coverage:** AC-2.1, AC-2.2, AC-2.3

### 3. LLM Prompt Generator
- **Responsibility:** Create `scripts/generate-llms.ts` that reads contracts + SKILL.md files and produces llms.txt + llms-full.txt
- **Location:** `scripts/generate-llms.ts` (new), `llms.txt`, `llms-full.txt`
- **AC Coverage:** AC-3.1, AC-3.2, AC-3.3, AC-E1

### 4. Eval Completer
- **Responsibility:** Add handler invocation + output validation to `run-evals.ts`
- **Location:** `evals/src/run-evals.ts`
- **AC Coverage:** AC-4.1, AC-4.2, AC-4.3

### 5. Tool Signature Consolidator
- **Responsibility:** Derive tool descriptions in mcp-server.ts from index.ts contracts
- **Location:** `mcp-servers/src/mcp-server.ts`, `mcp-servers/src/index.ts`
- **AC Coverage:** AC-5.1, AC-5.2

### 6. GitHub Settings Updater
- **Responsibility:** Set social preview image, expand topics
- **Location:** GitHub repo settings (API)
- **AC Coverage:** AC-6.1, AC-6.2

## New Files

| File | Purpose |
|------|---------|
| `scripts/generate-llms.ts` | Auto-generates llms.txt + llms-full.txt from contracts |
| `mcp-servers/src/__tests__/contract-validate.test.ts` | Tests for contract-schema consistency |

## Files Modified

| File | Changes |
|------|---------|
| 112 Python files | Moved to `legacy/python-scripts/` |
| 10 SKILL.md files | Remove Python script references or update paths |
| 10 skill/LICENSE files | Removed (root LICENSE covers all) |
| 10 skill/CHANGELOG.md files | Merged into root CHANGELOG.md, then removed |
| 10 skill/README.md files | Removed or merged into SKILL.md |
| `evals/src/run-evals.ts` | Import invokeAction, validate handler outputs, check crisis resources |
| `llms.txt`, `llms-full.txt` | Auto-generated (no longer hand-authored) |
| `mcp-servers/src/mcp-server.ts` | Tool descriptions read from contracts |
| `.github/workflows/ci.yml` | Add llms freshness check step |
| `CHANGELOG.md` | Merge per-skill changelogs |

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Python script removal breaks existing external users | Low | Low | Move to `legacy/` not delete; scripts were never MCP server dependency |
| Auto-generated llms.txt differs from hand-authored version | Medium | Low | Compare outputs before committing; review diff manually |
| Eval handler import fails (evals package can't import mcp-servers) | Medium | Medium | Add mcp-servers as devDependency of evals, or add workspace reference |
| CI freshness check is flaky | Low | Low | Use checksum comparison; skip on CI doc-only PRs |

## Out of Scope (Technical)

- No NLP/ML replacement for regex patterns
- No MCP protocol changes
- No new skills or MCP actions
