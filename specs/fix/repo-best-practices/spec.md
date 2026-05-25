# Repository Best Practices: WCAG AAA, Metadata, Code Quality, Skill Accuracy

Status: Draft
Version: 2.0
Last updated: 2026-05-24

## Overview

The `humanity4ai/project_human` repository has 7 categories of best-practice gaps
identified by cross-referencing the actual codebase against 100 best practices
across 10 domains. Issues range from WCAG AAA violations on the very GitHub Pages
site touting accessibility skills, to MCP handler output mismatches that silently
drop fields, to safety-critical skills missing crisis resources in handler replies.

## User Stories

### Primary — Project Credibility
As a visitor to the GitHub Pages site or npm registry page, I want accurate metadata,
WCAG AAA compliance, and a clean README so that the project's accessibility advocacy
is credible, not hypocritical.

### Secondary — Integrator Experience
As an integrator adding humanity4ai skills to my agent, I want handlers that return
all documented output fields, input params that are actually read, and crisis resources
that match the SKILL.md promises so that my agent behaves correctly.

### Tertiary — Maintainer Safety
As a maintainer, I want hardcoded values extracted to single source-of-truth modules
and crisis detection logic deduplicated across handlers, so that updating a phone
number or safety pattern affects all handlers consistently.

## Boundaries

**Always do:**
- Extract hardcoded strings (phone numbers, URLs, patterns) into single-source modules
- Use CSS custom properties for all colours — no inline styles
- Add proper ARIA landmarks and semantic HTML to pages
- Keep version strings synced with package.json
- Match handler output exactly to the declared output JSON schema
- Include concrete crisis phone numbers in every safety-critical handler reply

**Ask first (do not proceed unilaterally):**
- Changing the visual design of the site beyond accessibility fixes
- Adding new npm dependencies (eslint, prettier, etc.)
- Changing MCP contract shapes or handler signatures
- Modifying SKILL.md crisis resource lists

**Never do:**
- Remove existing accessibility features
- Break the MCP server contract signatures (action names, field names)
- Change semantic meaning of handler output
- Ship a handler that ignores documented input parameters
- Ship a handler that emits fields missing from the output schema

## Acceptance Criteria

### Epic 1: GitHub Pages WCAG AAA Compliance [MUST]

#### AC-1.1: Skip navigation link [MUST]
Given the GitHub Pages site
When a keyboard user loads the page and presses Tab
Then a visible skip-link is the first focusable element
And activating it moves focus to the `<main>` content area

#### AC-1.2: Keyboard focus indicators [MUST]
Given any interactive element on the page
When the element receives keyboard focus via Tab
Then a visible focus outline (≥ 3px, contrast ≥ 3:1) appears
And the `:focus-visible` state is styled, never suppressed with `outline: none`

#### AC-1.3: Colour contrast AAA (7:1 normal, 4.5:1 large) [MUST]
Given all text on the GitHub Pages site
When checked against WCAG 2.2 AAA
Then normal text has contrast ≥ 7:1
And large text (≥ 18px or ≥ 14px bold) has contrast ≥ 4.5:1
Specifically: footer links (#0f766e on #fff = 4.55:1) must be fixed

#### AC-1.4: `prefers-reduced-motion` respected [MUST]
Given the site CSS
When user has `prefers-reduced-motion: reduce`
Then all animations and transitions are disabled
And decorative gradients are simplified

#### AC-1.5: `prefers-contrast` supported [SHOULD]
Given the site CSS
When user has `prefers-contrast: more`
Then colours adapt to higher contrast
And borders are more clearly defined

#### AC-1.6: No inline styles [MUST]
Given site/index.html
When audited for inline `style=""` attributes
Then zero inline styles exist — all styling in styles.css
Specifically: footer on line 102 uses inline `style=""`

#### AC-1.7: Semantic landmarks with accessible names [MUST]
Given the site HTML
When audited with axe-core
Then `<header>`, `<main>`, `<footer>` have explicit roles
And `<section>` elements have `aria-label` or `aria-labelledby`

#### AC-1.8: Proper favicon file [SHOULD]
Given the site
When a browser requests /favicon.ico
Then a static file is served (not inline data URI)

### Epic 2: GitHub Repository Metadata [MUST]

#### AC-2.1: Repo description and homepage set [MUST]
Given the GitHub repo at humanity4ai/project_human
When viewed on github.com
Then the "About" description is set (currently `null`)
And the website URL is set to https://humanity4ai.github.io/project_human/

#### AC-2.2: Repo language is TypeScript [SHOULD]
Given the repository
When language statistics are computed
Then TypeScript is the primary language (currently shows "Python")

#### AC-2.3: README stray code block removed [MUST]
Given README.md
When rendered on GitHub
Then no orphaned empty code block fences appear
Specifically: lines ~107-108 have a stray ``` with no content

#### AC-2.4: README version references match package.json [MUST]
Given README references "MCP Runtime (v0.1)"
When the current version in mcp-servers/package.json is 0.1.0
Then README version references are accurate or removed to avoid staleness

### Epic 3: Community Health Files [SHOULD]

#### AC-3.1: Root CHANGELOG.md [SHOULD]
Given the repository root
Then a `CHANGELOG.md` exists summarising major version changes across all packages

#### AC-3.2: SUPPORT.md [SHOULD]
Given the repository
Then `SUPPORT.md` exists answering "where do I ask questions?"

#### AC-3.3: CITATION.cff [COULD]
Given the project's academic leanings (manifesto, citations, research base)
Then `CITATION.cff` exists with proper metadata for academic citation

#### AC-3.4: FUNDING.yml [COULD]
Given the project is open-source community-driven
Then `.github/FUNDING.yml` exists (even if pointing to a "not yet" note)

### Epic 4: Code Quality — Extract Hardcoded Values [MUST]

#### AC-4.1: Crisis resources centralised [MUST]
Given crisis phone numbers and URLs appear in multiple handler locations
When a `src/crisis-resources.ts` module is created
Then all handlers import from it
And changing a phone number edits exactly one file

#### AC-4.2: Magic numbers extracted to named constants [MUST]
Given numeric thresholds in handlers.ts (150, 20, 50, etc.)
When `src/constants.ts` is created
Then each threshold is a named `const` with descriptive name
And handlers reference the named constant

#### AC-4.3: Pattern arrays extracted [MUST]
Given shame/urgency/cognitive/jargon pattern arrays in handlers.ts
When `src/patterns.ts` is created
Then all pattern arrays live in the module
And handlers import them

#### AC-4.4: VERSION synced with package.json [MUST]
Given `mcp-server.ts` declares `VERSION = "0.1.0"`
When the server starts
Then the version displayed matches `mcp-servers/package.json`

#### AC-4.5: Safety boundaries extracted from index.ts [SHOULD]
Given safety boundary strings inline in the actionContracts array
When boundaries are extracted to a config module
Then contract registry contains only references, not inline strings

### Epic 5: Code Quality — Anti-Pattern Fixes [MUST]

#### AC-5.1: validate.ts schema load failure is NOT silent [MUST]
Given `loadSchema` returns `null`
When `validateInput` is called
Then result is `{ valid: false, errors: ["Schema not found: <path>"] }`
And NOT `{ valid: true }` (current silent pass-through)

#### AC-5.2: validate.ts minLength/maxLength enforcement [MUST]
Given a JSON schema property with `minLength` or `maxLength`
When `validateField` checks a string value
Then length constraints are enforced with descriptive error messages

#### AC-5.3: Deduplicate crisis detection logic [MUST]
Given empathetic_reframe, deescalation_plan, and depression-sensitive-content
  each implement suicide/self-harm detection independently
When `src/crisis-detection.ts` is created
Then all 3 handlers call the same `detectCrisisSignals()` function
And behaviour is consistent across all handlers

#### AC-5.4: isKnownAction O(1) lookup [SHOULD]
Given `actionContracts` is a linear array
When `isKnownAction` is called
Then lookup uses a pre-built `Set<string>` (O(1) vs O(n))

#### AC-5.5: ESLint + Prettier config [COULD]
Given no code formatting tooling exists
When `.eslintrc.json` and `.prettierrc` are added
Then `pnpm lint` enforces consistent code style

### Epic 6: Skill/MCP Accuracy — Schema & Handler Consistency [MUST]

#### AC-6.1: wcag-aaa-accessibility output schema fix [MUST]
Given handler emits `next_step` in output
And the output schema does not declare `next_step` (with `additionalProperties: false`)
When the handler is fixed
Then `next_step` is either added to the output schema or removed from handler output
And `assumptions` is correctly placed (at InvokeResponse level, not inside output)

#### AC-6.2: depression-sensitive-content output schema fix [MUST]
Given handler emits `pattern_count` and `review_recommended` not in output schema
When the handler is fixed
Then fields are added to the output schema
And suicide/self-harm crisis detection is added to the handler
  (currently only checks shame/urgency/cognitive — never crisis patterns)

#### AC-6.3: supportive-conversation handler reads all input params [MUST]
Given handler receives `message` and `locale` input params
And handler never reads `message` (reply is hardcoded, ignores user input)
And handler never reads `locale` (ignores language customization)
When the handler is fixed
Then the reply interpolates the user's `message`
And `locale` drives region-appropriate crisis resources

#### AC-6.4: Crisis resources match across SKILL.md ↔ handler [MUST]
Given 3 safety-critical skills list crisis resources
When comparing SKILL.md resources to handler escalation guidance
Then handler resources are a superset (not subset) of SKILL.md resources
Specifically:
  - grief-loss-support: handler must include 988, 741741, IASP URL (currently has generic text)
  - supportive-conversation: handler must include Crisis Text Line 741741, IASP URL (currently missing)
  - depression-sensitive-content: handler must detect crisis patterns and emit resources (currently absent)

#### AC-6.5: All handlers emit only schema-declared output fields [SHOULD]
Given each of the 10 output JSON schemas declares `additionalProperties: false`
When any handler produces output
Then every field in the handler's `output` object is declared in the schema
And the CI `pnpm evals` gate catches new mismatches

### Epic 7: Skill Content & User Journey [SHOULD]

#### AC-7.1: Repository description is accurate [MUST]
Given the GitHub repo metadata shows `description: null`
When the repo settings are updated
Then description reads: "Open skill system for humane AI — 10 reusable specs + MCP runtime"

#### AC-7.2: README table of contents [SHOULD]
Given the README is long (>200 lines, 10+ sections)
When rendered on GitHub
Then an auto-generated TOC is present at the top

#### AC-7.3: Homepage URL in npm package.json [MUST]
Given mcp-servers/package.json `homepage` points to `tree/development/mcp-servers`
When the npm package page is viewed
Then a valid homepage link is present (development branch still correct)

#### AC-7.4: No hardcoded console.log in production paths [SHOULD]
Given mcp-server.ts uses process.stderr.write for diagnostics
When server runs
Then all output uses stderr for logs, stdout reserved for MCP JSON-RPC protocol
(passes current behaviour)

## Error Cases

### AC-E1: validate.ts path resolution survives layout changes [SHOULD]
Given `validate.ts` resolves schemas via relative path from `__dirname`
When the directory layout changes
Then path resolution fails with a clear error message (not silent pass-through)

### AC-E2: CI catches future output schema drift [SHOULD]
Given a future PR adds a field to handler output without updating the schema
When CI runs `pnpm evals`
Then the eval gate fails because contract consistency check detects the mismatch

## Out of Scope

- Redesigning the GitHub Pages visual appearance beyond accessibility fixes
- Adding new skills or MCP actions
- Modifying MCP protocol or contract shapes
- Changing AGENTS.md workflow
- Adding automated accessibility testing to CI (separate feature)
- Full i18n/localization of the site
- Adding SSE transport for remote agents (separate feature)

## Non-Functional Requirements

- Audibility: all contrast ratios verifiable via axe-core; all schema mismatches validated by `pnpm evals`
- Minimal dependency: avoid adding more than 2 new devDependencies
- Backward compatibility: no MCP contract signature changes (field additions only in output, not removals)
- Performance: extraction of constants/patterns must not add measurable overhead
- Safety: crisis resource changes must be reviewed by a human before merge
