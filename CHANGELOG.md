# Changelog

## [Unreleased]

### Consolidation
- Merged `wcag-aaa-web-design` (13⭐, archived) into `skills/accessibility/`: 10 reference guides (WCAG-AAA checklist, ARIA patterns, corporate design system, form patterns, security error handling, application states, data presentation, navigation, responsive breakpoints, UX patterns) + 10 AAA-verified templates (tokens.css with 7:1 contrast palette, components.css, HTML partials, main.js)
- Merged `depression-sensitive-web-content` (archived) into `skills/depression-sensitive-content/references/implementation-guide.md`: 7 rewrite principles with clinical rationale, 15 worked examples, standards traceability matrix (WCAG 2.2 / COGA / ISO 9241-110 / ISO/IEC 30071-1), 40+ item audit checklist, localization guidance
- Archived `nvda-wcag22-testing` (empty placeholder) with redirect notice
- Salvaged launch marketing packs (Dev.to drafts, Reddit/X/LinkedIn post packs, directory submission template) into `docs/marketing/`
- `check_contrast.py` (AAA contrast checker with auto-suggestion engine) included in `skills/accessibility/templates/`

### Discoverability
- README restructured: 9-skill table above the fold, star CTA, star-history chart, one-command quick start, Share-on-X link
- GitHub topics updated to 20 high-search tags (added mcp-server, llm, claude, openai, npm-package)
- Site landing page: 9-skill card grid with category tags, npm CTA

## [1.0.4] — 2026-07-23

### Fixed

- **bin entry double-start crash** — `npx @humanity4ai/mcp-servers` no longer dies with `Fatal error: Already connected`. (PR #151)
- **F-003:** `validateContracts()` now called at server startup — malformed action contracts fail fast at boot instead of silently passing CI-only validation (#155)
- **F-006:** `engines.node` bumped from `>=20` to `>=22` across all packages — Node 20 EOL April 2026; CI tests Node 22 exclusively (#158)

### Changed

- **F-008:** `VALID_CATEGORIES` in evals now parsed from `knowledge-core/taxonomy.md` at runtime instead of hardcoding 10 slugs — editing the taxonomy no longer silently desyncs the eval gate (#160)

### Added

- **F-002:** Schema-consistency tests (I-10–I-14) bidirectionally validate `actionContracts` ↔ `schemas/`: every contract references existing files, every schema file has a contract, file count matches (#154)

### Documentation

- **F-004:** CLI auto-run-on-import design decision documented in `mcp-server.ts` (#156)
- **F-005:** Committed `dist/` policy rationale added to AGENTS.md (#157)

## [1.0.0] — 2026-05-26

### Stable Release

Graduation from development to stable. 11 skills, 236 MCP tests, 32 eval tests.

### Skills
- 10 original skills: WCAG AAA, depression-sensitive, supportive, cognitive, cultural, de-escalation, empathetic, grief, neurodiversity, age-inclusive
- 1 new skill: WCAG AA (real scoring engine with 7 criteria, 0-100 per criterion)
- All 11 skills have ≥ 10 scenarios each

### Accessibility
- WCAG AAA-compliant GitHub Pages site (skip-link, AAA contrast, prefers-reduced-motion, semantic landmarks)
- WCAG AA scoring engine: colour contrast, keyboard nav, semantic HTML, ARIA, forms, headings, focus order

### Safety
- Centralised crisis resources (all phone numbers in single source of truth)
- Shared crisis detection across 3 safety-critical handlers
- Auto-risk assessment + emotion detection for supportive replies
- Depression handler: 7 pattern categories (was 3)

### Internationalisation
- 9-language support: English, Chinese, Spanish, French, German, Japanese, Korean, Arabic, Portuguese
- Localized replies, crisis resources, and WCAG category names

### Developer Experience
- 3-step onboarding (Install → Start → Configure)
- Cross-platform: Windows, macOS, Linux, Android, iOS
- Branch model: feature/* → main (single branch)
- 220 MCP tests, 32 eval tests, 12 eval checks
- CodeQL scanning, dependency review, enforce_admins branch protection

### Repo
- Directory restructured (docs/, consolidated root files, gitignored legacy/)
- 19 GitHub topics, social preview, JSON-LD structured data
- 27 issue labels, 4 milestones

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
## Per-Skill Changes

### age-inclusive-design
# Changelog

## [0.2.0] — 2026-05-23

### Added
- ISO 25556:2025 Ageing Societies framework integration
- ISO/IEC Guide 71:2014 for accessibility in standards
- Vision, motor, cognitive, and technology comfort dimensions
- Typography, touch targets, navigation, and form design guidelines
- NIST usability guidelines for older adults reference
- Cross-cultural scenarios: multigenerational households (South Asia), rural digital literacy (Global South), formal UI expectations (East Asia)

### Changed
- Provenance updated from internal-curation to ISO 25556, ISO Guide 71, WCAG 2.2
- Expanded from 4 to 10+ design recommendations across age groups

### cognitive-accessibility
# Changelog

## [0.2.0] — 2026-05-23

### Added
- Sweller's Cognitive Load Theory (1988) with full citation and CTL-to-UI extrapolation note
- Intrinsic, extraneous, and germane cognitive load distinctions
- Sentence length, paragraph structure, and task design guidelines
- ISO 21801-1:2020 cognitive accessibility standard reference
- Readability and plain language principles

### Changed
- Provenance updated from internal-curation to ISO 21801-1 + Sweller (1988)
- Cultural scope updated to global

### conflict-de-escalation
# Changelog

## [0.2.0] — 2026-05-23

### Added
- VERB (Validate, Empathise, Reframe, Boundaries) and GAIN (Ground, Acknowledge, Inform, Next) de-escalation frameworks
- Crisis indicators section (threats, self-harm, harm to others, legal escalation)
- Cultural considerations: eye contact norms, personal space, direct vs. indirect communication, hierarchy, voice volume across 5 named cultural contexts
- International crisis resources: Befrienders Worldwide, Samaritans, 988, IMAlive
- CISA 2024 de-escalation guidelines reference
- Price & Baker (2012) peer-reviewed de-escalation meta-analysis reference

### Changed
- Provenance updated from internal-curation to CISA + academic sources

### cultural-sensitivity
# Changelog

## [0.2.0] — 2026-05-23

### Added
- Hofstede's 6 cultural dimensions with critical limitations section (McSweeney 2002, Ailon 2008)
- APA Multicultural Guidelines (2017) reference
- UNESCO Universal Declaration on Cultural Diversity (2001) reference
- Schwartz Value Theory and World Values Survey as alternative frameworks
- GLOBE Study (House et al., 2004) 9-dimension framework reference
- Multi-regional color semiotics (Western, East Asian, South Asian, African, Middle Eastern, Indigenous Australian)
- CARE Principles for Indigenous Data Governance
- Ubuntu philosophy (Southern African communal framework)
- 5 cross-cultural scenarios (Arabic RTL, Japanese hierarchy, Latin American warmth, Indian multilingual, Sub-Saharan African community-oriented)

### Changed
- Provenance updated from internal-curation to APA + UNESCO + Hofstede
- References/standards.md expanded from 7 lines to 80+ lines

### depression-sensitive-content
# Changelog

## 0.2.0

- Expanded SKILL.md with detailed workflow and examples
- Added references/ with 8 reference files:
  - standards.md (APA, DBS Alliance, SPRC guidelines)
  - patterns.md (phrases to avoid)
  - checklist.md (audit checklist)
  - clinical-guidelines.md (professional boundaries)
  - crisis-resources.md (escalation resources)
  - examples.md (good/bad examples)
  - alternatives.md (alternative phrases)
  - quick-reference.md (quick reference)
- Added scripts/ with 12 validation/analysis scripts:
  - audit.py, detect_harmful.py, detect_cognitive.py
  - classify_severity.py, suggest_alternatives.py, validate_safe.py
  - categorize_issues.py, check_medical.py, check_stigma.py
  - suggest_gentle.py, check_escalation.py, generate_rationale.py
- Enhanced skill.yaml with tags and metadata
- Expanded rubric.md with scoring criteria

## 0.1.0

- Initial launch version.

### empathetic-communication
# Changelog

## 0.2.0

- Expanded SKILL.md
- Added references/
- Added scripts/
- Enhanced metadata

## 0.1.0

- Initial version
### supportive-conversation (merged grief-loss-support)
# Changelog

## 0.2.0

- Expanded SKILL.md with detailed workflow and examples
- Added references/ with 8 reference files
- Added scripts/ with 10 validation/analysis scripts
- Enhanced skill.yaml with tags and metadata
- Expanded rubric.md with scoring criteria

## 0.1.0

- Initial launch version.

### neurodiversity-aware-design
# Changelog

## [0.2.0] — 2026-05-23

### Added
- ADHD, autism, and dyslexia design implications tables
- Sensory processing and executive function design considerations
- DSM-5-TR diagnostic context references (for design context, not clinical use)
- W3C COGA guidelines — Making Content Usable reference
- Microsoft Inclusive Design for Cognition framework
- Cross-cultural neurodiversity notes (ADHD diagnostic variation by country, dyslexia in non-alphabetic scripts)
- Participatory design principle: Nothing About Us Without Us

### Changed
- Provenance updated from internal-curation to COGA + Microsoft Inclusive Design
- Cultural scope changed to global
- Fixed untranslated Chinese character in rubric (autoplay controllable)

### supportive-conversation
# Changelog

## 0.2.0

- Expanded SKILL.md
- Added references/
- Added scripts/
- Enhanced metadata

## 0.1.0

- Initial version
### wcag-aaa-accessibility
# Changelog

## 0.2.0

### Added
- Expanded SKILL.md with detailed workflow and decision points
- Added explicit trigger phrases for better skill activation
- Added comprehensive WCAG 2.2 Success Criteria coverage (Levels A, AA, AAA)
- Added "Boundaries" section with Always/Ask First/Never rules
- Added detailed examples with Input/Output/Explanation format
- Added references/ folder with:
  - standards.md (WCAG criteria, ISO standards, regulatory references)
  - patterns.md (common accessibility patterns and anti-patterns)
- Added scripts/ folder with:
  - analyze.py (automated HTML accessibility analysis)
  - validate.py (validate accessibility fixes)
- Enhanced skill.yaml with tags, author, compatibility, allowed-tools, references

### Enhanced
- Expanded rubric.md with scoring criteria matrix
- Added good/poor examples with explanations
- Expanded README.md with usage examples and script documentation

### Changed
- Target conformance level: WCAG 2.2 Level AAA (was generic WCAG)
- Workflow now includes decision points for different input types

## 0.1.0

- Initial launch version
