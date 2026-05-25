# Technical Plan: Comprehensive Audit Fixes

## Spec Reference
Implements: `specs/fix/comprehensive-audit-2026-05/spec.md` (Version 1.0, 5 Epics, 15 MUST ACs)

## Architecture Overview

The audit revealed 42 issues across 6 domains. Fixes span 3 directories (`mcp-servers/src/`,
`skills/`, root) plus 2 standalone files (`SYSTEM_PROMPT.md`, `llms.txt`). The core structural
problem is two divergent implementations per safety-critical skill (Python scripts vs TypeScript
handlers). The fix strategy unifies pattern sets into the TypeScript handler, adds missing
safety checks, and corrects documentation.

**Sequence:** Epic 2 (unify patterns) MUST precede Epic 1 (safety fixes consume unified patterns).
Epic 5 (doc fixes) is independent. Epic 3+4 can run parallel.

```
E2 (Unify patterns) ──► E1 (Safety fixes) ──► Verify
E5 (Doc fixes) ──────────────────────────────► Verify
E3 (LLM prompts) ────────────────────────────► Verify
E4 (Eval system) ────────────────────────────► Verify
```

## Component Breakdown

### 1. Pattern Unification Engine
- **Responsibility:** Merge 34+ depression patterns, 22+ grief patterns, 85+ supportive patterns from Python scripts into TypeScript `patterns.ts`
- **Location:** `mcp-servers/src/patterns.ts`
- **AC Coverage:** AC-2.1, AC-2.2, AC-2.3, AC-E2

### 2. Safety Check Inserter
- **Responsibility:** Add crisis detection to grief handler, auto-risk-assessment to supportive_reply, locale-driven resources
- **Location:** `mcp-servers/src/handlers.ts`
- **AC Coverage:** AC-1.1, AC-1.2, AC-1.3, AC-E1

### 3. Documentation Corrector
- **Responsibility:** Fix broken references, category mismatch, missing metadata fields, typo
- **Location:** `skills/supportive-conversation/skill.yaml`, `skills/supportive-conversation/SKILL.md`, `skills/age-inclusive-design/SKILL.md`, `skills/conflict-de-escalation/SKILL.md`, plus 6 skill.yaml `references` fields
- **AC Coverage:** AC-5.1, AC-5.2, AC-5.3, AC-E3

### 4. LLM Prompt Fixer
- **Responsibility:** Fix SYSTEM_PROMPT.md tool description, llms.txt required field, llms-full.txt relative paths
- **Location:** `SYSTEM_PROMPT.md`, `llms.txt`, `llms-full.txt`
- **AC Coverage:** AC-3.1, AC-3.2, AC-3.3

### 5. Eval Enhancer
- **Responsibility:** Add handler output schema validation, crisis resource checks, per-level rubric criteria
- **Location:** `evals/src/run-evals.ts`, `evals/rubrics/global-rubric.yaml`
- **AC Coverage:** AC-4.1, AC-4.2, AC-4.3, AC-E4

## Technology Choices

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Pattern storage | `patterns.ts` with `as const` string arrays | Single source of truth, type-safe, tree-shakable |
| Crisis detection | Shared `crisis-detection.ts` | Already created in repo-best-practices; extend with new patterns |
| Emotion detection | New `emotion-detection.ts` module | Separate concern from crisis detection; enables independent thresholds |
| Doc fixes | Direct file edits | No code generation needed; targeted changes |
| Eval enhancement | Extend existing `run-evals.ts` | No new eval framework; additive to existing 11 checks |

## New Files Created

| File | Purpose |
|------|---------|
| `mcp-servers/src/emotion-detection.ts` | Emotion category detection for supportive_reply |
| `skills/age-inclusive-design/references/navigation.md` | Missing reference file |

## Files Modified

| File | Changes |
|------|---------|
| `mcp-servers/src/patterns.ts` | Add 34+ depression, 22+ grief, 85+ supportive patterns |
| `mcp-servers/src/handlers.ts` | Grief: crisis detection + pattern analysis. Supportive: auto-risk + emotion detection. Depression: expanded pattern categories |
| `mcp-servers/src/crisis-detection.ts` | Expand CRISIS_SIGNAL_PATTERNS with Python script patterns |
| `skills/supportive-conversation/skill.yaml` | Fix category to `communication`, add `references` field |
| `skills/supportive-conversation/SKILL.md` | Fix broken script reference (`validate_compassionate.py`) |
| `skills/age-inclusive-design/SKILL.md` | Fix broken reference (`references/navigation.md`) |
| `skills/conflict-de-escalation/SKILL.md` | Fix typo line 30 |
| `skills/cognitive-accessibility/skill.yaml` | Add `references` field |
| `skills/cultural-sensitivity/skill.yaml` | Add `references` field |
| `skills/conflict-de-escalation/skill.yaml` | Add `references` field |
| `skills/empathetic-communication/skill.yaml` | Add `references` field |
| `skills/neurodiversity-aware-design/skill.yaml` | Add `references` field |
| `skills/age-inclusive-design/skill.yaml` | Add `references` field |
| `SYSTEM_PROMPT.md` | Fix MCP tool description (10 individual tools, not one) |
| `llms.txt` | Fix `mode` from required to optional |
| `llms-full.txt` | Convert navigation links to absolute URLs |
| `evals/src/run-evals.ts` | Add handler output validation, crisis resource checks |
| `evals/rubrics/global-rubric.yaml` | Add per-level scoring criteria |

## AC Coverage Map

| AC | Component(s) |
|----|-------------|
| AC-1.1 | Safety Check Inserter (grief handler) |
| AC-1.2, AC-1.3 | Safety Check Inserter (supportive handler) |
| AC-2.1 | Pattern Unification Engine (depression patterns) |
| AC-2.2 | Pattern Unification Engine + Safety Check Inserter (grief) |
| AC-2.3 | Pattern Unification Engine + Safety Check Inserter (supportive) |
| AC-3.1, AC-3.2, AC-3.3 | LLM Prompt Fixer |
| AC-4.1, AC-4.2, AC-4.3 | Eval Enhancer |
| AC-5.1, AC-5.2, AC-5.3 | Documentation Corrector |
| AC-E1 | Safety Check Inserter |
| AC-E2 | Pattern Unification Engine |
| AC-E3 | Documentation Corrector |
| AC-E4 | Eval Enhancer |

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Expanded patterns cause false positives on safe content | Medium | Medium | Add minimum pattern thresholds (≥2 for escalation); benchmark against safe samples (AC-E2) |
| Emotion detection misclassifies neutral content | Medium | Low | Only match unambiguous patterns; use multi-word phrases, not single words |
| Python-to-TS pattern migration misses context-dependent patterns | Low | Medium | Audit each Python pattern for context sensitivity before migrating; skip patterns requiring semantic analysis |
| Eval system changes break existing 11 checks | Low | High | Run `pnpm evals` before and after; all new checks are additive (AC-E4) |
| Category fix breaks dependent systems | Low | Medium | Test with `pnpm evals` contract-consistency check; verify index.yaml and taxonomy.md align (AC-E3) |

## Out of Scope (Technical)

- No NLP/semantic analysis — patterns remain keyword-based
- No LLM integration in handlers
- No URL fetching for WCAG handler (remains static template; SKILL.md will be separately scoped)
- No conversation state/memory
- No CI integration of new eval checks (separate PR)
