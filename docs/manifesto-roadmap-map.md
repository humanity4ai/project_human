# Manifesto to Roadmap Map

This map translates manifesto principles into concrete repository work.

## 1) Dignity and non-exploitation

- **Repository artifacts**: `skills/supportive-conversation/`, `skills/depression-sensitive-content/`, `skills/grief-loss-support/`
- **Implementation focus**: refine language boundaries to avoid coercion, manipulation, and pseudo-clinical authority.
- **Acceptance criteria**:
  - boundary language explicitly forbids diagnosis and legal advice
  - escalation language exists for crisis-adjacent scenarios
  - skill changelogs updated

## 2) Honest uncertainty and explicit limits

- **Repository artifacts**: `knowledge-core/uncertainty-schema.yaml`, `skills/*/skill.yaml`, `evals/rubrics/global-rubric.yaml`
- **Implementation focus**: ensure uncertain or contested claims include limitation signaling and confidence framing.
- **Acceptance criteria**:
  - uncertainty metadata fields present where applicable
  - rubric checks detect overclaiming
  - scenario examples include ambiguity handling

## 3) Boundaries over performance theater

- **Repository artifacts**: `mcp-servers/schemas/*.json`, `mcp-servers/src/validate.ts`, `mcp-servers/src/handlers.ts`
- **Implementation focus**: enforce strict schema validation and safe fallback responses.
- **Acceptance criteria**:
  - input and output schemas reject unsafe/invalid structure
  - handlers provide bounded response types
  - contracts regenerate cleanly (`build:contracts`)

## 4) Public accountability and auditability

- **Repository artifacts**: `GOVERNANCE.md`, `CONTRIBUTING.md`, `.github/pull_request_template.md`, `.github/CODEOWNERS`
- **Implementation focus**: require traceable rationale for boundary changes and manifesto-related edits.
- **Acceptance criteria**:
  - manifesto docs are codeowner-protected
  - PR template asks for linked principle and issue
  - governance states review requirements

## 5) Reproducible quality gates

- **Repository artifacts**: `.github/workflows/ci.yml`, `evals/src/run-evals.ts`, `mcp-servers/src/__tests__/`
- **Implementation focus**: maintain repeatable checks for type safety, contract correctness, and behavior consistency.
- **Acceptance criteria**:
  - `pnpm check`, `pnpm test`, `pnpm evals` pass in CI
  - eval report remains available in CI artifacts
  - new work includes tests or eval fixture updates

## 6) Open community implementation

- **Repository artifacts**: `docs/good-first-issues.md`, `docs/traction-14-day.md`, GitHub issues/discussions
- **Implementation focus**: convert principles into contributor-ready tasks with clear outcomes.
- **Acceptance criteria**:
  - active help-wanted issues linked to manifesto principles
  - weekly traction updates include contributor funnel metrics
  - onboarding docs include first-time contribution path

## Contribution rule for manifesto work

Every manifesto-related PR must include:

- linked principle from this map,
- linked issue,
- measurable output (docs, schema, tests, evals, or scenarios),
- passing checks (`pnpm check`, `pnpm test`, `pnpm evals`).

## Active implementation issues

- Community call thread: https://github.com/humanity4ai/project_human/issues/41
- #33 Multilingual supportive-conversation scenarios: https://github.com/humanity4ai/project_human/issues/33
- #34 Accessibility edge-case scenarios: https://github.com/humanity4ai/project_human/issues/34
- #35 Escalation language hardening: https://github.com/humanity4ai/project_human/issues/35
- #36 MCP schema examples and docs clarity: https://github.com/humanity4ai/project_human/issues/36
- #37 Eval rubric ambiguity handling: https://github.com/humanity4ai/project_human/issues/37
- #38 Agent adapter parity docs: https://github.com/humanity4ai/project_human/issues/38
- #39 First-time contributor onboarding flow: https://github.com/humanity4ai/project_human/issues/39
- #40 Manifesto coverage audit: https://github.com/humanity4ai/project_human/issues/40
