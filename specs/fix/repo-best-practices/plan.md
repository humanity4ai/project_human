# Technical Plan: Repository Best Practices

## Spec Reference
Implements: `specs/fix/repo-best-practices/spec.md` (Version 2.0, 7 Epics, 30+ ACs)

## Architecture Overview

This is a multi-domain hygiene plan. Changes span 4 directories (`site/`, `mcp-servers/src/`,
`mcp-servers/schemas/`, repo root) and the GitHub repository settings. No new npm
dependencies required (all fixes use existing tooling). The plan creates 4 new source
modules for centralised constants/patterns/resources and fixes 4 handler bugs.

**Sequence:** Epics are independent except E4+E5 (extract modules) must precede E6
(skill fixes consume extracted modules).

```
E1 (Site WCAG)  ────────────────────────────►
E2 (Repo meta)  ────────────────────────────►  E7 (User journey)
E3 (Health files) ──────────────────────────►
E4+E5 (Extract modules) ──► E6 (Skill fixes)─►
```

## Component Breakdown

### 1. Site Accessibility Fixer
- **Responsibility:** Bring `site/index.html` + `site/styles.css` to WCAG AAA compliance
- **Location:** `site/index.html`, `site/styles.css`, new `site/assets/favicon.svg`
- **AC Coverage:** AC-1.1 through AC-1.8

### 2. Repository Metadata Updater
- **Responsibility:** Set GitHub repo description, homepage URL, language override
- **Location:** GitHub API (`gh api` to edit repo), `.gitattributes` for linguist override
- **AC Coverage:** AC-2.1, AC-2.2, AC-7.1

### 3. Community Health File Generator
- **Responsibility:** Create root `CHANGELOG.md`, `SUPPORT.md`, `CITATION.cff`, `.github/FUNDING.yml`
- **Location:** Repository root, `.github/FUNDING.yml`
- **AC Coverage:** AC-3.1 through AC-3.4

### 4. Constant Extraction Engine
- **Responsibility:** Create `src/crisis-resources.ts`, `src/constants.ts`, `src/patterns.ts`
- **Location:** `mcp-servers/src/`
- **AC Coverage:** AC-4.1, AC-4.2, AC-4.3

### 5. Shared Utility Creator
- **Responsibility:** Create `src/crisis-detection.ts`, update `mcp-server.ts` VERSION import
- **Location:** `mcp-servers/src/`
- **AC Coverage:** AC-4.4, AC-5.3, AC-5.4

### 6. Handler & Schema Fixer
- **Responsibility:** Fix 4 handler bugs, update 3 output schemas, deduplicate crisis detection
- **Location:** `mcp-servers/src/handlers.ts`, `mcp-servers/schemas/`
- **AC Coverage:** AC-6.1 through AC-6.5, AC-5.1, AC-5.2

### 7. README & Docs Cleaner
- **Responsibility:** Fix README stray code block, update version refs, add TOC
- **Location:** `README.md`
- **AC Coverage:** AC-2.3, AC-2.4, AC-7.2, AC-7.3

## Technology Choices

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Crisis resource format | TypeScript `const` arrays in single module | Type-safe, tree-shakable, no runtime JSON parse |
| Pattern extraction | `as const` string arrays | Enables `typeof` type derivation for safety |
| VERSION sync | Dynamic `import()` of package.json in mcp-server.ts | No build step needed; works in tsx and compiled mode |
| Schema fixes | Add fields to output schemas (not remove from handlers) | Backward compatible — existing consumers ignore unknown fields |
| Favicon | Inline SVG file (not emoji data URI) | Works with all browsers; avoids network request |

## New Files Created

| File | Purpose |
|------|---------|
| `mcp-servers/src/crisis-resources.ts` | Centralised crisis phone numbers, URLs, text |
| `mcp-servers/src/constants.ts` | Named numeric thresholds |
| `mcp-servers/src/patterns.ts` | Shame/urgency/cognitive/jargon/safety pattern arrays |
| `mcp-servers/src/crisis-detection.ts` | Shared `detectCrisisSignals()` function |
| `site/assets/favicon.svg` | Proper SVG favicon |
| `CHANGELOG.md` | Root-level changelog |
| `SUPPORT.md` | Support guidance |
| `CITATION.cff` | Academic citation metadata |
| `.github/FUNDING.yml` | Sponsorship configuration |

## Files Modified

| File | Changes |
|------|---------|
| `site/index.html` | Skip-link, remove inline footer styles, ARIA labels on sections, meta theme-color, favicon ref |
| `site/styles.css` | `:focus-visible` styles, `prefers-reduced-motion`, `prefers-contrast`, footer link colour to #0d5c56 (≥7:1 contrast) |
| `mcp-servers/src/handlers.ts` | Import central modules, fix wcag output, fix depression crisis detection, fix supportive reply to read message/locale, fix grief crisis numbers |
| `mcp-servers/src/mcp-server.ts` | Dynamic VERSION import from package.json |
| `mcp-servers/src/validate.ts` | Fail on missing schema, add minLength/maxLength |
| `mcp-servers/src/index.ts` | Extract safety boundaries to constants |
| `mcp-servers/schemas/wcag-aaa-accessibility.output.json` | Add `next_step` field |
| `mcp-servers/schemas/depression-sensitive-content.output.json` | Add `pattern_count`, `review_recommended`, `crisis_resources` |
| `README.md` | Remove stray code block, update version refs, add TOC |
| `mcp-servers/package.json` | Bump version to 0.2.0 (already done in PR #87 but verify) |
| `.gitattributes` | Add linguist overrides to fix Python→TypeScript detection |

## AC Coverage Map

| AC | Component(s) |
|----|-------------|
| AC-1.1 through AC-1.8 | Site Accessibility Fixer |
| AC-2.1, AC-2.2, AC-7.1 | Repository Metadata Updater |
| AC-3.1 through AC-3.4 | Community Health File Generator |
| AC-4.1, AC-4.2, AC-4.3 | Constant Extraction Engine |
| AC-4.4, AC-4.5, AC-5.3, AC-5.4 | Shared Utility Creator |
| AC-5.1, AC-5.2, AC-6.1 through AC-6.5 | Handler & Schema Fixer |
| AC-2.3, AC-2.4, AC-7.2, AC-7.3 | README & Docs Cleaner |

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| `pnpm evals` breaks after schema changes | Medium | High | Run `pnpm evals` after each schema edit; schema additions only (no removals) |
| Handler signature changes break MCP clients | Low | High | No contract signature changes — only add fields, never remove |
| Language override doesn't take effect | Low | Low | `.gitattributes` with `linguist-vendored` or `linguist-detectable`; verify after push |
| Dynamic import of package.json fails in compiled mode | Low | Medium | Add `resolveJsonModule` to tsconfig.build.json; verify `pnpm build` output |

## Out of Scope (Technical)

- No automated accessibility CI (Lighthouse, axe-core) — separate feature
- No SSE transport addition — separate feature
- No new npm dependencies
- No skill content rewrites (only handler/schema fixes)
- No new MCP tools or actions
