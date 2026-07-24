---
name: accessibility
description: "Unified WCAG 2.2 accessibility audit. Crawl mode: score pages across all 86 success criteria. Session mode: return WCAG checklist for the requested level. Optional axe-core engine (Deque: automation detects ~57% of accessibility issues; manual testing still required)."
version: 1.0.0
license: MIT
author: project-human
---

# Accessibility Audit

## Purpose

Unified WCAG 2.2 accessibility audit covering all 86 success criteria across 4 POUR principles (Perceivable, Operable, Understandable, Robust).

Two modes:
- **Crawl mode**: Provide `pages: [{url, html}]` and get per-page scoring (0-100) with ranking, site aggregate, and detailed per-criterion findings. Manual-only criteria are flagged with `manual_reason`.
- **Session mode**: Query the user's required WCAG level (A, AA, or AAA) and receive the complete checklist. The agent enforces all criteria in the checklist throughout the session.

Two analysis engines:
- **Regex engine** (built-in, zero dependencies): 13 regex-based scoring functions covering the 41 fully automatable criteria (~48% of all 86; per `wcag-criteria.ts` automatable flags).
- **axe-core engine** (optional, `pnpm add axe-core`): 57 rule checks providing ~80% automated coverage. Auto-detected at import time — silent fallback if not installed.

## Boundaries

### Always
- Score real HTML against all automatable criteria
- Return structured per-criterion results with WCAG SC ID references
- Distinguish automated findings from manual-review items

### Never
- Claim legal compliance
- Score criteria requiring visual inspection as if automated
- Make external network calls

## Level-Aware Scoring
- Color contrast: no Level A requirement; AA=4.5:1 normal text / 3:1 large text (SC 1.4.3); AAA=7:1 / 4.5:1 (SC 1.4.6)
- Level A: 31 criteria (18 automatable, 4 partial)
- Level AA: 55 criteria cumulative (31 automatable, 8 partial)
- Level AAA: 86 criteria cumulative (41 automatable, 15 partial)

## References

Implementation guidance and enterprise patterns (merged from `wcag-aaa-web-design`):

- `references/wcag-aaa-checklist.md` — all 86 WCAG 2.2 criteria with implementation guidance and AAA design implications
- `references/corporate-design-system.md` — AAA-verified color palette with precomputed contrast ratios, type scale, BEM architecture
- `references/aria-patterns.md` — ARIA widget patterns (modals, tabs, accordions, focus traps)
- `references/form-patterns.md` — accessible form design and validation
- `references/security-error-handling.md` — OWASP-aligned secure error handling (CSP, CSRF, output encoding)
- `references/application-states.md` — loading, empty, and error state patterns
- `references/data-presentation.md` — accessible data table and density patterns
- `references/navigation-patterns.md` — sidebar, breadcrumb, and wayfinding patterns
- `references/responsive-breakpoints.md` — mobile-first breakpoint system
- `references/corporate-ux-patterns.md` — enterprise UX conventions

## Templates

AAA-verified starter templates in `templates/`: design tokens with precomputed 7:1 contrast palette (`tokens.css`), BEM component library (`components.css`), semantic HTML partials, and defensive vanilla JS (`main.js`). A standalone contrast checker with auto-suggestion engine is included as `templates/check_contrast.py` (stdlib-only Python; can audit `--color-*` tokens directly from `tokens.css`).
