---
name: accessibility
description: "Unified WCAG 2.2 accessibility audit. Crawl mode: score pages across all 78 success criteria. Session mode: return WCAG checklist for the requested level. Optional axe-core engine for ~80% automated coverage."
version: 1.0.0
license: MIT
author: project-human
---

# Accessibility Audit

## Purpose

Unified WCAG 2.2 accessibility audit covering all 78 success criteria across 4 POUR principles (Perceivable, Operable, Understandable, Robust).

Two modes:
- **Crawl mode**: Provide `pages: [{url, html}]` and get per-page scoring (0-100) with ranking, site aggregate, and detailed per-criterion findings. Manual-only criteria are flagged with `manual_reason`.
- **Session mode**: Query the user's required WCAG level (A, AA, or AAA) and receive the complete checklist. The agent enforces all criteria in the checklist throughout the session.

Two analysis engines:
- **Regex engine** (built-in, zero dependencies): 13 regex-based scoring functions covering ~55% of criteria.
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
- Color contrast: A=3:1, AA=4.5:1, AAA=7:1
- Level A: 30 criteria (18 automatable)
- Level AA: 50 criteria cumulative (25 automatable)
- Level AAA: 78 criteria cumulative (31 automatable)
