# Accessibility Skill Changelog

## 1.0.0 — 2026-05-26

### Consolidated
- Merged `wcag-aaa-accessibility` and `wcag-aa-accessibility` into single `accessibility` skill
- Unified `accessibility_audit` action replaces `wcagaaa_check` and `wcagaa_check`
- Covers all 78 WCAG 2.2 success criteria across 4 POUR principles

### Added
- Crawl mode: site-wide scoring with per-page ranking and site aggregate
- Session mode: WCAG checklist filtered by level (A/AA/AAA) for agent enforcement
- axe-core optional engine: detects axe-core at import time, ~80% automated coverage
- Level-aware scoring: A=3:1, AA=4.5:1, AAA=7:1 contrast thresholds
- Manual-review criteria flagged with manual_reason for non-automatable checks
