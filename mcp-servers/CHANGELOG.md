# Changelog

All notable changes to the @humanity4ai/mcp-servers package.

## [1.0.0] — 2026-05-26

### Added
- WCAG AA accessibility scoring engine (`wcagaa_check`) with 7-category scoring (0–100)
- i18n framework with 9 language support (en, zh, es, fr, de, ja, ko, ar, pt)
- Locale-driven crisis resources with localized escalation guidance
- Auto-risk escalation in supportive conversation handler (detects crisis signals)
- Emotion detection in supportive conversation handler (6 emotion categories)
- Grief crisis detection in grief support handler (suicide/self-harm signals)
- Depression-sensitive content rewrite: 7 pattern categories (shame, urgency, cognitive load, stigma, medical claims, minimizing, judgmental)
- Shared modules: patterns.ts, constants.ts, crisis-resources.ts, crisis-detection.ts, emotion-detection.ts, accessibility-engine.ts, i18n.ts
- Handler output validation and crisis resource checks in eval system
- Tool descriptions single-sourced from index.ts contracts

### Changed
- 11 skill packs (was 10 in v0.1.0) — added WCAG AA accessibility
- Centralized crisis detection — all handlers share crisis-detection.ts
- Pattern arrays: all 16 categories in patterns.ts (no handler-local patterns)
- Supportive conversation category: `communication` (not `emotional-safety`)
- 236 MCP tests, 32 eval tests

### Fixed
- Array validation in validate.ts (validates array item types, enforces minLength/maxLength)
- No hardcoded crisis phone numbers in handlers — all imported from crisis-resources.ts

## [0.1.0] — 2026-05-22

### Initial release

- 10 Humanity Skills with MCP contracts and JSON schemas
- MCP SDK runtime server (stdio transport, JSON-RPC 2.0)
- Evaluation harness with structural checks
- 220+ MCP tests, 12 eval checks
