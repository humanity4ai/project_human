# Task List: Comprehensive Audit Fixes

## Plan Reference
Implements: `specs/fix/comprehensive-audit-2026-05/plan.md`

## Dependency Graph

```
Phase 1 — Independent Quick Wins (all [P])
├─ TASK-001 Fix llms.txt mode required→optional (E3)
├─ TASK-002 Fix SYSTEM_PROMPT.md tool description (E3)
├─ TASK-003 Fix llms-full.txt nav links to absolute URLs (E3)
├─ TASK-004 Fix supportive-conversation skill.yaml category (E5)
├─ TASK-005 Fix supportive-conversation SKILL.md broken script ref (E5)
├─ TASK-006 Fix age-inclusive-design SKILL.md broken ref (E5)
├─ TASK-007 Fix conflict-de-escalation SKILL.md typo (E5)
├─ TASK-008 Add references field to 6 skill.yaml files (E5)
├─ TASK-008b Document VERB/GAIN citation gap (E5)
├─ TASK-008c Add Hofstede critique caveat (E5)
└─ TASK-008d Add local filesystem method to SYSTEM_PROMPT.md (E3)

Phase 2 — Pattern Unification (E2, MUST precede Phase 3)
├─ TASK-009 Expand CRISIS_SIGNAL_PATTERNS in crisis-detection.ts (Python→TS)
├─ TASK-010 Add depression patterns to patterns.ts (stigma, medical, minimizing categories)
├─ TASK-011 Add grief patterns to patterns.ts (cliches, minimizing, crisis, overwhelm)
├─ TASK-012 Add supportive-conversation patterns to patterns.ts (emotions, boundaries)
└─ TASK-013 Create emotion-detection.ts module (6 emotion categories)

Phase 3 — Handler Safety Fixes (E1, depends on Phase 2)
├─ TASK-014 Add crisis detection + pattern analysis to grief handler
├─ TASK-015 Add auto-risk-assessment + emotion detection to supportive_reply
├─ TASK-016 Add expanded pattern categories to depression handler
├─ TASK-017 Add locale-driven crisis resource selection to supportive_reply
├─ TASK-018 Fix empathetic_reframe uncertainty from low→medium
├─ TASK-018b Fix toMcpResult to include action field
├─ TASK-018c Document validate.ts empty string strictness
└─ TASK-018d Add array item type validation to validate.ts

Phase 4 — Eval Enhancement + Remaining Items (E4, depends on Phase 3)
├─ TASK-019 Add handler output schema validation to run-evals.ts
├─ TASK-020 Add crisis resource presence check to run-evals.ts
├─ TASK-021 Add per-level scoring criteria to global-rubric.yaml
├─ TASK-021b Regenerate llms-full.txt from current files
├─ TASK-021c Document eval blind spots (Python scripts)
└─ TASK-021d Document empty taxonomy categories as intentional

Phase 5 — Verification
├─ TASK-022 Run pnpm check + pnpm test + pnpm evals
├─ TASK-023 Run benchmark: safe content false-positive check (AC-E2)
└─ TASK-024 Final gate checklist review
```

## Tasks

### Phase 1: Independent Quick Wins

- [ ] **TASK-001** [S] [P] Fix llms.txt mode field (E3)
  - Change `mode` from required to optional in `rewrite_depression_sensitive_content` row
  - Files: `llms.txt`
  - Depends on: none
  - Verifies: AC-3.2

- [ ] **TASK-002** [S] [P] Fix SYSTEM_PROMPT.md tool description (E3)
  - Replace "Use the `humanity4ai-mcp` tool" with "The humanity4ai MCP server exposes 10 individual tools"
  - Add tools/list → tools/call discovery flow
  - Files: `SYSTEM_PROMPT.md`
  - Depends on: none
  - Verifies: AC-3.1

- [ ] **TASK-003** [S] [P] Fix llms-full.txt nav links to absolute URLs (E3)
  - Replace relative paths with raw.githubusercontent.com absolute URLs
  - Files: `llms-full.txt`
  - Depends on: none
  - Verifies: AC-3.3

- [ ] **TASK-004** [S] [P] Fix supportive-conversation category (E5)
  - Change skill.yaml `category: emotional-safety` → `communication`
  - Files: `skills/supportive-conversation/skill.yaml`
  - Depends on: none
  - Verifies: AC-5.1, AC-E3

- [ ] **TASK-005** [S] [P] Fix supportive-conversation broken script reference (E5)
  - Change `validate_compassionate.py` → `validate_compassion.py`
  - Files: `skills/supportive-conversation/SKILL.md`
  - Depends on: none
  - Verifies: AC-5.2

- [ ] **TASK-006** [S] [P] Fix age-inclusive-design broken reference (E5)
  - Remove or create `references/navigation.md`
  - Files: `skills/age-inclusive-design/SKILL.md` + optionally `skills/age-inclusive-design/references/navigation.md`
  - Depends on: none
  - Verifies: AC-5.2

- [ ] **TASK-007** [S] [P] Fix conflict-de-escalation typo (E5)
  - Fix "becoming You need to..." punctuation
  - Files: `skills/conflict-de-escalation/SKILL.md`
  - Depends on: none
  - Verifies: finding 1.9

- [ ] **TASK-008** [S] [P] Add references field to 6 skill.yaml files (E5)
  - Add `references:` section to cognitive-accessibility, cultural-sensitivity, conflict-de-escalation, empathetic-communication, neurodiversity-aware-design, age-inclusive-design
  - Files: 6 × `skills/<skill>/skill.yaml`
  - Depends on: none
  - Verifies: AC-5.3

- [ ] **TASK-008b** [S] [P] Document VERB/GAIN models as needing citation (E5)
  - Add `[CITATION NEEDED]` note in conflict-de-escalation SKILL.md for "VERB Model" and "GAIN Method"
  - Or replace with established de-escalation frameworks (CPI, MOAB, LEAPS)
  - Files: `skills/conflict-de-escalation/SKILL.md`
  - Depends on: none
  - Verifies: finding 1.7

- [ ] **TASK-008c** [S] [P] Add Hofstede critique caveat to cultural-sensitivity SKILL.md (E5)
  - Add note: "Hofstede's cultural dimensions are contested (see McSweeney 2002, Ailon 2008). Color meanings and formality norms vary significantly within regions. Use as tendencies, not rules."
  - Files: `skills/cultural-sensitivity/SKILL.md`
  - Depends on: none
  - Verifies: finding 1.8

- [ ] **TASK-008d** [S] [P] Add local filesystem method to SYSTEM_PROMPT.md (E3)
  - Add "Method 3: Local Files" section referencing direct SKILL.md file reading from cloned repo
  - Files: `SYSTEM_PROMPT.md`
  - Depends on: none
  - Verifies: finding 4.5

### Phase 2: Pattern Unification (E2)

- [ ] **TASK-009** [M] Expand CRISIS_SIGNAL_PATTERNS with Python patterns
  - Merge all crisis patterns from Python scripts: `take my life`, `hurt myself`, `cut myself`, `end it all`, `make it stop`, `life isn't worth`, `can't go on`, `everyone would be better`, `want to die`, `better off dead`, `no point living`, `can't cope`, `can't take`, `overwhelmed`
  - Files: `mcp-servers/src/crisis-detection.ts`, `mcp-servers/src/patterns.ts`
  - Depends on: none
  - Verifies: AC-2.1 (partial), AC-E2

- [ ] **TASK-010** [M] Add depression patterns to patterns.ts
  - Add categories: `STIGMA_PATTERNS` (crazy, insane, psycho, nut, loony), `MEDICAL_CLAIM_PATTERNS` (cure, diagnos*, prescri*, medication without doctor, home remedy), `MINIMIZING_PATTERNS` (just get over it, snap out of it, it's all in your head, just think positive, make up your mind), `JUDGMENTAL_PATTERNS` (poor compliance, non-compliant), `STIGMATIZING_VERB_PATTERNS` (suffering from, afflicted with, victim of), `IDENTITY_FIRST_PATTERNS` (depressive person), `CRISIS_LANGUAGE_PATTERNS` (committed suicide)
  - Files: `mcp-servers/src/patterns.ts`
  - Depends on: none
  - Verifies: AC-2.1, AC-E2

- [ ] **TASK-011** [M] Add grief patterns to patterns.ts
  - Add categories: `GRIEF_CLICHE_PATTERNS` (they're in a better place, time heals all wounds, i know how you feel, at least, should be over it, be strong, move on, it could be worse, they lived a long life), `GRIEF_CRISIS_OVERLAP_PATTERNS` (can't cope, overwhelmed, can't take)
  - Files: `mcp-servers/src/patterns.ts`
  - Depends on: none
  - Verifies: AC-2.2

- [ ] **TASK-012** [M] Add supportive-conversation patterns to patterns.ts
  - Add categories: `FEAR_ANXIETY_PATTERNS`, `SADNESS_GRIEF_PATTERNS`, `ANGER_FRUSTRATION_PATTERNS`, `LONELINESS_ISOLATION_PATTERNS`, `SHAME_GUILT_PATTERNS`, `LOVE_CONNECTION_PATTERNS`, `BOUNDARY_VIOLATION_PATTERNS` (clinical_advice, promising_outcomes, dismissive, cliches)
  - Files: `mcp-servers/src/patterns.ts`
  - Depends on: none
  - Verifies: AC-2.3

- [ ] **TASK-013** [M] Create emotion-detection.ts module
  - Export `detectEmotion(text: string): { category: string; confidence: number }`
  - Categories: fear_anxiety, sadness_grief, anger_frustration, loneliness_isolation, shame_guilt, love_connection, none
  - Returns top matching category with pattern match count as confidence proxy
  - Files: `mcp-servers/src/emotion-detection.ts` (new)
  - Depends on: TASK-012
  - Verifies: AC-2.3

### Phase 3: Handler Safety Fixes (E1)

- [ ] **TASK-014** [M] Add crisis detection + pattern analysis to grief handler
  - Call detectCrisisSignals(message) — if detected, populate escalation_guidance with crisis resources
  - Check GRIEF_CLICHE_PATTERNS — if cliches detected, add to care_notes
  - Check GRIEF_CRISIS_OVERLAP_PATTERNS — if detected, elevate care level
  - Files: `mcp-servers/src/handlers.ts`
  - Depends on: TASK-009, TASK-011
  - Verifies: AC-1.1, AC-E1

- [ ] **TASK-015** [M] Add auto-risk-assessment + emotion detection to supportive_reply
  - Call detectCrisisSignals(message) — if ≥1 crisis signal, auto-escalate to high regardless of caller risk_level
  - Call detectEmotion(message) — if emotion detected, acknowledge in reply text
  - Check BOUNDARY_VIOLATION_PATTERNS — if detected, add boundary warning
  - Files: `mcp-servers/src/handlers.ts`
  - Depends on: TASK-009, TASK-012, TASK-013
  - Verifies: AC-1.2, AC-2.3

- [ ] **TASK-016** [M] Add expanded pattern categories to depression handler
  - Add checks for: STIGMA_PATTERNS, MEDICAL_CLAIM_PATTERNS, MINIMIZING_PATTERNS, JUDGMENTAL_PATTERNS, STIGMATIZING_VERB_PATTERNS, CRISIS_LANGUAGE_PATTERNS
  - Each category produces distinct safety_flags entries
  - Files: `mcp-servers/src/handlers.ts`
  - Depends on: TASK-010
  - Verifies: AC-2.1

- [ ] **TASK-017** [S] Add locale-driven crisis resource selection to supportive_reply
  - Read `locale` param → select region-specific crisis resources
  - "en-GB" → Samaritans 116 123 as primary
  - "en-US" → 988 + 741741 as primary
  - Default → international resources
  - Files: `mcp-servers/src/handlers.ts`
  - Depends on: TASK-015
  - Verifies: AC-1.3

- [ ] **TASK-018** [S] Fix empathetic_reframe uncertainty from low→medium
  - Change L419: `uncertainty: "low"` → `uncertainty: "medium"`
  - Files: `mcp-servers/src/handlers.ts`
  - Depends on: none
  - Verifies: finding 2.4

- [ ] **TASK-018b** [S] Fix toMcpResult to include action field (E1)
  - Add `action: result.data.action` to the serialized output in mcp-server.ts
  - Files: `mcp-servers/src/mcp-server.ts`
  - Depends on: none
  - Verifies: finding 2.5

- [ ] **TASK-018c** [S] Document validate.ts empty string behavior (E1)
  - Add comment in validate.ts noting intentional strictness: "Empty strings are treated as missing values — stricter than JSON Schema spec which allows empty strings for type:string"
  - Files: `mcp-servers/src/validate.ts`
  - Depends on: none
  - Verifies: finding 2.6

- [ ] **TASK-018d** [S] Add array item type validation to validate.ts (E1)
  - In validateField(): if type is "array" and value is array, and spec has "items" with "type": iterate items and validate each
  - Files: `mcp-servers/src/validate.ts`
  - Depends on: none
  - Verifies: finding 2.7

### Phase 4: Eval Enhancement (E4)

- [ ] **TASK-019** [M] Add handler output schema validation to run-evals.ts
  - For each of 10 skills: call invokeAction() with valid inputs
  - Compare output fields against declared output JSON schema
  - Flag any field in output not declared in schema
  - Flag any required schema field missing from output
  - Run as additional check (not replacing existing checks)
  - Files: `evals/src/run-evals.ts`
  - Depends on: Phase 3 completion (all handlers fixed)
  - Verifies: AC-4.1, AC-E4

- [ ] **TASK-020** [M] Add crisis resource presence check to run-evals.ts
  - For 3 safety-critical skills: invoke with known crisis input patterns
  - Verify escalation_guidance/crisis_resources contains 988, 741741, or IASP
  - Run as additional check
  - Files: `evals/src/run-evals.ts`
  - Depends on: Phase 3 completion
  - Verifies: AC-4.2, AC-E4

- [ ] **TASK-021** [S] Add per-level scoring criteria to global-rubric.yaml
  - For each of 4 dimensions: define criteria for levels 1-5
  - Format: observable indicators (e.g., "Level 5: All crisis indicators flagged with specific resources")
  - Files: `evals/rubrics/global-rubric.yaml`
  - Depends on: none
  - Verifies: AC-4.3

- [ ] **TASK-021b** [S] Regenerate llms-full.txt from current source files (E3)
  - Re-concatenate all SKILL.md + knowledge-core + docs content from current disk files
  - Ensures inlined content is not stale vs source of truth
  - Files: `llms-full.txt`
  - Depends on: Phase 1 tasks (source files may be modified)
  - Verifies: finding 4.4

- [ ] **TASK-021c** [S] Document eval blind spots as known limitations (E4)
  - Add comment in run-evals.ts: "NOTE: Does not validate Python scripts vs TypeScript handlers. Handler output validation added in E4. Python script consistency is a known gap — see specs/fix/comprehensive-audit-2026-05/spec.md Domain 3."
  - Files: `evals/src/run-evals.ts`
  - Depends on: none
  - Verifies: finding 5.3

- [ ] **TASK-021d** [S] Document empty taxonomy categories as intentional (E5)
  - Add `(available for new skills)` note to knowledge-core/taxonomy.md for `inclusive-design` and `lifecycle-support`
  - Already partially done; verify the note is clear and discoverable
  - Files: `knowledge-core/taxonomy.md`
  - Depends on: none
  - Verifies: finding 6.1

### Phase 5: Verification

- [ ] **TASK-022** [M] Run full CI pipeline
  - `pnpm check` — zero type errors
  - `pnpm --filter @humanity4ai/mcp-servers test` — all existing tests pass + new handler tests
  - `pnpm evals` — 11 existing checks pass, new checks report results
  - `pnpm --filter @humanity4ai/mcp-servers build` — dist/ compiles clean
  - Depends on: all Phase 3-4 tasks

- [ ] **TASK-023** [M] Run false-positive benchmark (AC-E2)
  - Define 10 safe/normal content samples (no crisis, no stigma, neutral language)
  - Run depression handler against all 10 samples
  - Verify pattern_count ≤ prior baseline + 10%
  - Verify no safe sample triggers crisis_resources
  - Depends on: TASK-016

- [ ] **TASK-024** [S] Final gate checklist
  - [ ] All 15 MUST ACs verified
  - [ ] All 3 safety-critical handlers analyze message content
  - [ ] All pattern categories from Python scripts present in TS
  - [ ] llms.txt, SYSTEM_PROMPT.md, llms-full.txt fixed
  - [ ] supportive-conversation category consistent across all files
  - [ ] Broken references fixed
  - [ ] `pnpm check && pnpm test && pnpm evals` all pass
  - [ ] No false-positive regressions on safe content
  - Depends on: TASK-022, TASK-023

## Legend
- `[S]` Small — under 1 hour
- `[M]` Medium — 1–3 hours
- `[P]` Parallelizable

## Task Summary

| ID | Phase | Size | Parallel | Description |
|----|-------|------|----------|-------------|
| 001 | 1 | S | P | Fix llms.txt mode field |
| 002 | 1 | S | P | Fix SYSTEM_PROMPT.md tool description |
| 003 | 1 | S | P | Fix llms-full.txt nav links |
| 004 | 1 | S | P | Fix supportive-conversation category |
| 005 | 1 | S | P | Fix broken script reference |
| 006 | 1 | S | P | Fix broken navigation reference |
| 007 | 1 | S | P | Fix conflict-de-escalation typo |
| 008 | 1 | S | P | Add references to 6 skill.yaml files |
| 008b | 1 | S | P | Document VERB/GAIN citation gap |
| 008c | 1 | S | P | Add Hofstede critique caveat |
| 008d | 1 | S | P | Add local filesystem to SYSTEM_PROMPT.md |
| 009 | 2 | M | - | Expand crisis signal patterns |
| 010 | 2 | M | - | Add depression patterns |
| 011 | 2 | M | - | Add grief patterns |
| 012 | 2 | M | - | Add supportive-conversation patterns |
| 013 | 2 | M | - | Create emotion-detection.ts |
| 014 | 3 | M | - | Add crisis detection to grief handler |
| 015 | 3 | M | - | Auto-risk + emotion to supportive_reply |
| 016 | 3 | M | - | Expanded categories to depression handler |
| 017 | 3 | S | - | Locale-driven crisis resources |
| 018 | 3 | S | - | Fix empathetic_reframe uncertainty |
| 018b | 3 | S | - | Fix toMcpResult action field |
| 018c | 3 | S | - | Document validate.ts empty string |
| 018d | 3 | S | - | Add array item validation to validate.ts |
| 019 | 4 | M | - | Handler output schema validation |
| 020 | 4 | M | - | Crisis resource presence check |
| 021 | 4 | S | - | Per-level rubric criteria |
| 021b | 4 | S | - | Regenerate llms-full.txt |
| 021c | 4 | S | - | Document eval blind spots |
| 021d | 4 | S | - | Document empty taxonomy categories |
| 022 | 5 | M | - | Full CI pipeline |
| 023 | 5 | M | - | False-positive benchmark |
| 024 | 5 | S | - | Final gate checklist |

**Total:** 33 tasks. 19× S, 14× M. 11 tasks parallelizable in Phase 1.
