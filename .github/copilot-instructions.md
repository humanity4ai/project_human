# Copilot Instructions

These instructions apply to all Copilot coding agent and Copilot code review activity in this repository.

## Stack rules

- pnpm only (respect `packageManager` pin; commit lockfile changes) — never npm/yarn
- TypeScript strict; no `any`; ESM; Zod for runtime validation
- Conventional commits; PR-only changes; never commit secrets or `.env`
- Do not weaken CI steps, tests, or coverage to force green — document pre-existing failures instead

## MCP tools — use ALL available, for their strengths

| Tool | Use it for |
|------|-----------|
| context7 (`resolve-library-id`, `get-library-docs`) | Any library/framework API question — check docs before writing API code; never guess signatures |
| perplexity (`perplexity_search/ask/reason/research`) | Current best practices, comparisons, error diagnosis, multi-source research |
| brave-search (`brave_web_search`, `brave_news_search`) | Real-time facts, release notes, changelogs, breaking changes |
| Playwright (default) | Verify UI changes render correctly; check console errors; screenshot before finishing frontend work |
| GitHub (default) | Issues, PRs, code search, prior art in this and related repos |

If an MCP tool fails, report the error and continue with the remaining tools — never skip verification silently.

## Custom agents in this repo

- **software-developer** — all code changes (features, fixes, refactors)
- **researcher** — R&D, technology evaluations, decision records (documents only, no code)
- **writer-publisher** — content, docs, i18n, translations in multiple languages/styles/tones/formats

Choose the agent matching the task type; combine researcher → software-developer for research-driven implementation.

## Repo specifics

- pnpm monorepo: `@humanity4ai/mcp-servers` (publishable, `dist/` committed) + `@humanity4ai/evals`
- Rule-based MCP server — NO LLM calls in handlers; patterns live in `src/patterns.ts`
- Crisis resources only in `src/crisis-resources.ts` — never hardcode phone numbers elsewhere
- Coverage thresholds: mcp-servers 90% stmts/83% branches, evals 78/65 — new conditionals need tests
- Nine skills only (no grief-loss-support, no 10th skill); schemas in `schemas/`
- Required checks: `validate (22)` + `CodeQL`; ESM with `.js` extensions in relative imports (NodeNext)
- Pre-commit: `pnpm check && pnpm evals && pnpm test`
