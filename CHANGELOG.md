# Changelog

All notable changes to the Humanity4AI project will be documented in this file.

## [0.2.0] — 2026-05-24 (in development)

### Added
- Academic provenance: real citations with license metadata across all 10 skills
- Cross-cultural scenarios: 17 new scenarios across 5 skills (RTL/Arabic, Japanese, Latin American, Indian, African contexts)
- Crisis resources: international crisis lines added to all 5 safety-critical skills
- References expanded: 3 `references/standards.md` files expanded with peer-reviewed research

### Changed
- Server version: `0.1.0` → `0.2.0`
- `supportive-conversation` category aligned to `emotional-safety` across skill.yaml, index.yaml, taxonomy.md
- Handler: `validate.ts` now returns `valid: false` on schema load failure (was silent pass-through)
- Handler: word-boundary regex for depression content rewrite
- Handler: grief handler interpolates user message into reply

### Fixed
- Typos: conflict-de-escalation garbled sentence, neurodiversity rubric Chinese chars, supportive-conversation grammar
- Broken URL typo: Crisis_Centries → Crisis_Centres
- Header links: relative paths replaced with absolute raw GitHub URLs in llms.txt and SYSTEM_PROMPT.md

## [0.1.0] — 2026-03-01

### Added
- Initial release with 10 humanity skills
- MCP SDK server (JSON-RPC 2.0 over stdio)
- Eval harness with 11 automated quality gates
- GitHub Pages site
- Knowledge core: principles, taxonomy, uncertainty schema
