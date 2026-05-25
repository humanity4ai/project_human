# Task List: Repository Best Practices

## Plan Reference
Implements: `specs/fix/repo-best-practices/plan.md`

## Dependency Graph

```
Phase 1 — Independent (all [P])
├─ TASK-001 [P] Set repo description + homepage (E2)
├─ TASK-002 [P] Fix repo language detection (E2)
├─ TASK-003 [P] Create root CHANGELOG.md (E3)
├─ TASK-004 [P] Create SUPPORT.md (E3)
├─ TASK-005 [P] Create CITATION.cff (E3)
├─ TASK-006 [P] Create FUNDING.yml (E3)
├─ TASK-007 [P] Create favicon.svg (E1)
└─ TASK-008 [P] Fix README stray code block + TOC + version refs (E2/E7)

Phase 2 — Site WCAG (E1)
├─ TASK-009 [P] Add skip-link to index.html
├─ TASK-010 [P] Add focus-visible styles to CSS
├─ TASK-011 [P] Fix footer link colour contrast to AAA
├─ TASK-012 [P] Add prefers-reduced-motion media query
├─ TASK-013 [P] Add prefers-contrast media query
├─ TASK-014 [P] Remove inline footer styles, add CSS class
└─ TASK-015 [P] Add ARIA labels to sections

Phase 3 — Extract Modules (E4+E5, MUST precede Phase 4)
├─ TASK-016 [P] Create src/constants.ts (magic numbers)
├─ TASK-017 [P] Create src/patterns.ts (pattern arrays)
├─ TASK-018 [P] Create src/crisis-resources.ts (phone numbers/URLs)
├─ TASK-019 [P] Create src/crisis-detection.ts (shared detection fn)
├─ TASK-020 [P] Fix VERSION import in mcp-server.ts
├─ TASK-021 [P] Extract safety boundaries from index.ts
├─ TASK-022 [P] Fix isKnownAction to use Set (O(1))
└─ TASK-023 [P] Fix validate.ts schema load failure

Phase 4 — Skill/Handler Fixes (E6, depends on Phase 3)
├─ TASK-024 Fix wcag-aaa-accessibility output schema + handler
├─ TASK-025 Fix depression-sensitive-content output schema + add crisis detection
├─ TASK-026 Fix supportive-conversation handler (read message + locale)
├─ TASK-027 Fix grief-loss-support crisis resources
├─ TASK-028 Add minLength/maxLength to validate.ts
└─ TASK-029 Run pnpm check + pnpm test + pnpm evals (verify all)

Phase 5 — Final Audit
├─ TASK-030 [P] Verify CI passes on all changes
├─ TASK-031 [P] Run Lighthouse/axe-core on site
└─ TASK-032 Gate checklist review
```

## Tasks

### Phase 1: Independent Quick Wins

- [ ] **TASK-001** [S] [P] Set GitHub repo description and homepage URL
  - Description: "Open skill system for humane AI — 10 reusable specs + MCP runtime"
  - Homepage: https://humanity4ai.github.io/project_human/
  - Depends on: none
  - Verifies: AC-2.1, AC-7.1

- [ ] **TASK-002** [S] [P] Fix repo language to TypeScript
  - Add `.gitattributes` entries to override Python detection:
    ```
    *.py linguist-vendored
    *.ts linguist-detectable
    ```
  - Depends on: none
  - Verifies: AC-2.2

- [ ] **TASK-003** [S] [P] Create root CHANGELOG.md
  - Summarise v0.1.0 release, link to mcp-servers/CHANGELOG.md for detail
  - Depends on: none
  - Verifies: AC-3.1

- [ ] **TASK-004** [S] [P] Create SUPPORT.md
  - Guidance: GitHub Discussions for questions, Issues for bugs, email for security
  - Depends on: none
  - Verifies: AC-3.2

- [ ] **TASK-005** [S] [P] Create CITATION.cff
  - Authors: Ascent Partners Foundation, Simon Mak
  - Title: "Humanity4AI: Humane AI Skills for Real Agents"
  - DOI/URL: https://github.com/humanity4ai/project_human
  - Depends on: none
  - Verifies: AC-3.3

- [ ] **TASK-006** [S] [P] Create .github/FUNDING.yml
  - `github: [humanity4ai]` or `custom: [https://...]`
  - Depends on: none
  - Verifies: AC-3.4

- [ ] **TASK-007** [S] [P] Create site/assets/favicon.svg
  - Simple SVG favicon (replaces inline emoji data URI)
  - Depends on: none
  - Verifies: AC-1.8

- [ ] **TASK-008** [S] [P] Fix README.md issues
  - Remove stray empty code block (lines ~107-108)
  - Update "MCP Runtime (v0.1)" to remove version or note it matches package.json
  - Add TOC after badges section
  - Depends on: none
  - Verifies: AC-2.3, AC-2.4, AC-7.2

### Phase 2: Site WCAG AAA (E1)

- [ ] **TASK-009** [S] [P] Add skip navigation link to index.html
  - `<a href="#main-content" class="skip-link">Skip to main content</a>`
  - CSS: visually hidden, visible on focus
  - Add `id="main-content"` to `<main>`
  - Depends on: none
  - Verifies: AC-1.1

- [ ] **TASK-010** [S] [P] Add :focus-visible styles to styles.css
  - Outline: 3px solid var(--accent) with 2px offset
  - Never `outline: none` without replacement
  - Depends on: none
  - Verifies: AC-1.2

- [ ] **TASK-011** [S] [P] Fix footer link colour for AAA contrast
  - Current: #0f766e on #fff = 4.55:1 (fails AAA 7:1)
  - New: #0d5c56 on #fff = 7.1:1 (passes AAA)
  - Depends on: none
  - Verifies: AC-1.3

- [ ] **TASK-012** [S] [P] Add prefers-reduced-motion media query
  - Wrap gradient animations and body gradient in `@media (prefers-reduced-motion: no-preference)`
  - Provide solid-colour fallback
  - Depends on: none
  - Verifies: AC-1.4

- [ ] **TASK-013** [S] [P] Add prefers-contrast media query
  - In `@media (prefers-contrast: more)`: boost text/background contrast, add borders
  - Depends on: none
  - Verifies: AC-1.5

- [ ] **TASK-014** [S] [P] Remove inline styles from footer, add CSS class
  - Move footer inline `style=""` to `.site-footer` class in styles.css
  - Depends on: none
  - Verifies: AC-1.6

- [ ] **TASK-015** [S] [P] Add ARIA labels to section elements
  - Add `aria-label` to each `<section>` (e.g., "Manifesto", "What ships now", "Quick commands")
  - Depends on: none
  - Verifies: AC-1.7

### Phase 3: Extract Modules (E4+E5) — MUST precede Phase 4

- [ ] **TASK-016** [S] [P] Create mcp-servers/src/constants.ts
  - Extract magic numbers: `MAX_WORDS_PER_SENTENCE = 20`, `MAX_CONTENT_WORDS = 150`,
    `MIN_STEPS_FOR_SEQUENCE = 50`, `MIN_TOUCH_TARGET_PX = 44`, `MIN_BODY_FONT_PX = 16`,
    `MIN_LINE_HEIGHT_FACTOR = 1.5`, etc.
  - Depends on: none
  - Verifies: AC-4.2

- [ ] **TASK-017** [S] [P] Create mcp-servers/src/patterns.ts
  - Extract arrays: `SHAME_PATTERNS`, `URGENCY_PATTERNS`, `COGNITIVE_LOAD_PATTERNS`,
    `JARGON_TERMS`, `CRISIS_SIGNAL_PATTERNS` (suicid, self-harm, end my life, no point),
    `BLAME_PATTERNS`, `FIXED_ORDER_PATTERNS`
  - All arrays `as const` for type derivation
  - Depends on: none
  - Verifies: AC-4.3

- [ ] **TASK-018** [S] [P] Create mcp-servers/src/crisis-resources.ts
  - Centralise all crisis phone numbers and URLs:
    - `CRISIS_LINE_UK = "Samaritans 116 123"`
    - `CRISIS_LINE_US = "988 Suicide & Crisis Lifeline"`
    - `CRISIS_TEXT_US = "Crisis Text Line: Text HOME to 741741"`
    - `CRISIS_URL_INTERNATIONAL = "https://findahelpline.com"`
    - `CRISIS_URL_IASP = "https://www.iasp.info/resources/Crisis_Centres/"`
  - Depends on: none
  - Verifies: AC-4.1

- [ ] **TASK-019** [S] [P] Create mcp-servers/src/crisis-detection.ts
  - Export `detectCrisisSignals(text: string): string[]`
  - Returns array of matched crisis pattern descriptions
  - Checks against `CRISIS_SIGNAL_PATTERNS` from patterns.ts
  - Depends on: TASK-017
  - Verifies: AC-5.3

- [ ] **TASK-020** [S] [P] Fix VERSION in mcp-server.ts to sync with package.json
  - Replace `export const VERSION = "0.1.0"` with:
    ```typescript
    import { readFileSync } from "node:fs";
    const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
    export const VERSION: string = pkg.version;
    ```
  - Depends on: none
  - Verifies: AC-4.4

- [ ] **TASK-021** [S] [P] Extract safety boundaries from index.ts
  - Create a `SAFETY_BOUNDARIES` map keyed by action name
  - Replace inline boundary strings in actionContracts with map lookups
  - Depends on: none
  - Verifies: AC-4.5

- [ ] **TASK-022** [S] [P] Fix isKnownAction to O(1) Set lookup
  - Pre-build `const KNOWN_ACTIONS = new Set(actionContracts.map(c => c.action))`
  - Replace `actionContracts.some(...)` with `KNOWN_ACTIONS.has(action)`
  - Depends on: none
  - Verifies: AC-5.4

- [ ] **TASK-023** [S] [P] Fix validate.ts schema load failure
  - Change `return { valid: true }` (line 59-61) to:
    `return { valid: false, errors: [\`Schema not found: ${schemaPath}\`] }`
  - Add descriptive error message including the attempted path
  - Depends on: none
  - Verifies: AC-5.1

### Phase 4: Skill/Handler Fixes (E6)

- [ ] **TASK-024** [M] Fix wcag-aaa-accessibility output schema + handler
  - Add `next_step` to `schemas/wcag-aaa-accessibility.output.json` as optional string
  - Verify handler does not emit `assumptions` inside `output` (it's at InvokeResponse level — correct)
  - Depends on: TASK-016, TASK-017
  - Verifies: AC-6.1

- [ ] **TASK-025** [M] Fix depression-sensitive-content output schema + add crisis detection
  - Add `pattern_count`, `review_recommended`, `crisis_resources` to output schema
  - Import `detectCrisisSignals` from crisis-detection.ts
  - Add crisis check in handler: if crisis signals detected, populate `crisis_resources` with
    phone numbers from crisis-resources.ts
  - Import `CRISIS_LINE_US`, `CRISIS_TEXT_US`, `CRISIS_URL_INTERNATIONAL` from crisis-resources.ts
  - Depends on: TASK-017, TASK-018, TASK-019
  - Verifies: AC-6.2, AC-6.4

- [ ] **TASK-026** [M] Fix supportive-conversation handler to read all input params
  - Read `message` param (currently ignored — reply is hardcoded)
  - Read `locale` param (currently ignored)
  - Interpolate `message` into reply text (acknowledge user's words)
  - Use `locale` to select region-specific crisis resources
  - Import crisis resources from crisis-resources.ts
  - Ensure crisis resources include 741741 + IASP (currently missing from handler)
  - Depends on: TASK-017, TASK-018
  - Verifies: AC-6.3, AC-6.4

- [ ] **TASK-027** [S] Fix grief-loss-support crisis resources
  - Add concrete crisis numbers to escalation_guidance in handler:
    - "US: 988 Suicide & Crisis Lifeline"
    - "Crisis Text Line: Text HOME to 741741"
    - "International: iasp.info/resources/Crisis_Centres/"
  - Import from crisis-resources.ts
  - Depends on: TASK-018
  - Verifies: AC-6.4

- [ ] **TASK-028** [S] Add minLength/maxLength to validate.ts
  - In `validateField()`: after type check, add:
    - If `spec["minLength"]` exists and value is string: check `value.length >= minLength`
    - If `spec["maxLength"]` exists and value is string: check `value.length <= maxLength`
    - Errors: `"'${fieldName}' must be at least ${minLength} characters"` etc.
  - Depends on: none
  - Verifies: AC-5.2

- [ ] **TASK-029** [M] Run full CI pipeline
  - `pnpm check` — zero type errors
  - `pnpm --filter @humanity4ai/mcp-servers test` — all 152+ tests pass
  - `pnpm evals` — all 11 checks pass (contract consistency must catch schema mismatches if any remain)
  - `pnpm --filter @humanity4ai/mcp-servers build` — dist/ compiles clean
  - Depends on: TASK-024, TASK-025, TASK-026, TASK-027, TASK-028
  - Verifies: AC-6.5, AC-E2

### Phase 5: Final Audit

- [ ] **TASK-030** [S] [P] Verify CI passes
  - Push to feature branch, open PR, observe CI green
  - Depends on: all Phase 4 tasks

- [ ] **TASK-031** [S] [P] Verify site accessibility
  - Manual check: keyboard Tab through all interactive elements
  - `prefers-reduced-motion` toggle in browser DevTools
  - Contrast check: footer links pass 7:1, all text passes
  - Depends on: all Phase 2 tasks

- [ ] **TASK-032** [S] Gate checklist review
  - [ ] All 7 epics have at least one completed task
  - [ ] No handler emits fields missing from output schema
  - [ ] All 3 safety-critical skills include concrete crisis numbers
  - [ ] site/index.html has no inline styles
  - [ ] GitHub repo description is set
  - [ ] CHANGELOG.md, SUPPORT.md, CITATION.cff, FUNDING.yml exist
  - [ ] `pnpm check && pnpm evals && pnpm test` all pass
  - Depends on: all above tasks

## Legend
- `[S]` Small — under 1 hour
- `[M]` Medium — 1–3 hours
- `[L]` Large — 3–6 hours (consider splitting)
- `[P]` Parallelizable — can run concurrently with other `[P]` tasks at same dependency level

## Task Summary

| ID | Phase | Size | Parallel | Description |
|----|-------|------|----------|-------------|
| 001 | 1 (Meta) | S | P | Set repo description + homepage |
| 002 | 1 (Meta) | S | P | Fix repo language to TypeScript |
| 003 | 1 (Files) | S | P | Create root CHANGELOG.md |
| 004 | 1 (Files) | S | P | Create SUPPORT.md |
| 005 | 1 (Files) | S | P | Create CITATION.cff |
| 006 | 1 (Files) | S | P | Create FUNDING.yml |
| 007 | 1 (Site) | S | P | Create favicon.svg |
| 008 | 1 (Docs) | S | P | Fix README stray block + TOC + version |
| 009 | 2 (Site) | S | P | Add skip-link |
| 010 | 2 (Site) | S | P | Add :focus-visible styles |
| 011 | 2 (Site) | S | P | Fix footer link AAA contrast |
| 012 | 2 (Site) | S | P | Add prefers-reduced-motion |
| 013 | 2 (Site) | S | P | Add prefers-contrast |
| 014 | 2 (Site) | S | P | Remove inline footer styles |
| 015 | 2 (Site) | S | P | Add ARIA section labels |
| 016 | 3 (Extract) | S | P | Create constants.ts |
| 017 | 3 (Extract) | S | P | Create patterns.ts |
| 018 | 3 (Extract) | S | P | Create crisis-resources.ts |
| 019 | 3 (Extract) | S | P | Create crisis-detection.ts |
| 020 | 3 (Extract) | S | P | Fix VERSION import |
| 021 | 3 (Extract) | S | P | Extract safety boundaries |
| 022 | 3 (Extract) | S | P | Fix isKnownAction O(1) |
| 023 | 3 (Extract) | S | P | Fix validate.ts schema fail |
| 024 | 4 (Skills) | M | - | Fix wcag output schema |
| 025 | 4 (Skills) | M | - | Fix depression handler + crisis |
| 026 | 4 (Skills) | M | - | Fix supportive reply (message+locale) |
| 027 | 4 (Skills) | S | - | Fix grief crisis resources |
| 028 | 4 (Skills) | S | - | Add minLength/maxLength to validate |
| 029 | 4 (Verify) | M | - | Run pnpm check + test + evals + build |
| 030 | 5 (Audit) | S | P | Verify CI passes |
| 031 | 5 (Audit) | S | P | Verify site accessibility |
| 032 | 5 (Audit) | S | - | Gate checklist review |

**Total:** 32 tasks. Estimated effort: 28× S, 4× M. Highly parallelizable (22 tasks marked [P]).
