# Task List: Scientific Validity Fixes

## Plan Reference
Implements: `specs/fix/scientific-validity-audit/plan.md`

## Tasks

### Setup

- [ ] **TASK-001** [S] Catalog all patterns from Python scripts
  - For each safety-critical skill: extract ALL regex/string patterns from Python scripts
  - Compare against TypeScript patterns.ts
  - Identify gaps (patterns in Python but not TS, and vice versa)
  - Depends on: none

### Epic 1: Unify Patterns

- [ ] **TASK-002** [M] Expand patterns.ts with all Python script patterns
  - Add: `STIGMATIZING_VERB_PATTERNS`, `IDENTITY_FIRST_PATTERNS`,
    `STIGMATIZING_TERM_PATTERNS`, `MINIMIZING_PATTERNS`, `JUDGMENTAL_PATTERNS`
  - Add: `CRISIS_LANGUAGE_PATTERNS` (from Python audit.py: "committed suicide")
  - Keep existing: `SHAME_PATTERNS`, `URGENCY_PATTERNS`, `COGNITIVE_LOAD_PATTERNS`,
    `CRISIS_SIGNAL_PATTERNS`, `JARGON_TERMS`
  - Depends on: TASK-001

- [ ] **TASK-003** [M] Update depression handler to use unified patterns
  - Add checks for stigmatizing verbs, identity-first, stigmatizing terms,
    minimizing, judgmental patterns (currently only checks shame/urgency/cognitive)
  - Add pattern type classification to safety_flags output
  - Depends on: TASK-002

- [ ] **TASK-004** [S] Run pnpm test + pnpm evals after pattern changes
  - Verify existing tests pass
  - Verify evals detect no regressions
  - Depends on: TASK-003

### Epic 2: Fix Documentation

- [ ] **TASK-005** [M] Update depression-sensitive-content SKILL.md
  - Add prominent therapeutic disclaimer at top (NOT a therapeutic tool)
  - Document that MCP handler uses pattern-based keyword matching
  - Note Python scripts are reference/educational tools, not the MCP implementation
  - Remove 4-step process claims (handler doesn't do severity classification)
  - Add accurate description of what patterns the handler checks
  - Depends on: TASK-003

- [ ] **TASK-006** [M] Update grief-loss-support SKILL.md
  - Add therapeutic disclaimer
  - Document template-based response approach
  - Note handler uses 3 static templates with message interpolation
  - Depends on: none

- [ ] **TASK-007** [M] Update supportive-conversation SKILL.md
  - Add therapeutic disclaimer
  - Document template-based response approach
  - Note crisis resources are risk-level stratified
  - Depends on: none

### Epic 3: Verify

- [ ] **TASK-008** [S] Verify all disclaimers are present and consistent
  - Check all 3 safety-critical SKILL.md files
  - Check handler boundary notices match SKILL.md claims
  - Depends on: TASK-005, TASK-006, TASK-007

- [ ] **TASK-009** [M] Run full CI pipeline
  - `pnpm check` — zero type errors
  - `pnpm test` — 204+ tests pass
  - `pnpm evals` — 11/11 checks pass
  - Depends on: TASK-004, TASK-008

## Legend
- `[S]` Small — under 1 hour
- `[M]` Medium — 1–3 hours

## Task Summary

| ID | Epic | Size | Description |
|----|------|------|-------------|
| 001 | Setup | S | Catalog all Python script patterns vs TS handler patterns |
| 002 | E1 | M | Expand patterns.ts with Python script patterns |
| 003 | E1 | M | Update depression handler to use unified patterns |
| 004 | E1 | S | Run tests after pattern changes |
| 005 | E2 | M | Fix depression SKILL.md documentation |
| 006 | E2 | M | Fix grief SKILL.md documentation |
| 007 | E2 | M | Fix supportive SKILL.md documentation |
| 008 | E3 | S | Verify disclaimer consistency |
| 009 | E3 | M | Full CI pipeline |

**Total:** 9 tasks. 3× S, 6× M.
