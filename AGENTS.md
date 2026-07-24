# AGENTS.md — Agentic Coding Guidelines

---

## CRITICAL: All compute in GitHub Codespaces

**NEVER run compilation, testing, builds, linting, or installs on the local machine.**
These operations are blocked in opencode.json and must run in a GitHub Codespace.

```bash
gh cs ssh <name> -- "cd /workspaces/project_human && pnpm check"
gh cs cp <changed-file> remote:/workspaces/project_human/<path>
```

Sync files to your codespace after making edits, then run verification there.

---

## Commands (Codespace only)

pnpm monorepo. Two packages: `@humanity4ai/mcp-servers` (publishable) and `@humanity4ai/evals` (private).

```bash
pnpm check          # tsc --noEmit across all packages
pnpm start          # MCP server via tsx (stdio transport)
pnpm test           # vitest run (both packages)
pnpm test:coverage  # vitest --coverage
pnpm evals          # skill eval harness (10 checks: 9 skills + contract-consistency)
pnpm build          # compile mcp-servers → dist/
```

**Single test / single package:**
```bash
pnpm --filter @humanity4ai/mcp-servers test -- --test-name-pattern "H-1"
pnpm --filter @humanity4ai/mcp-servers test -- src/__tests__/handlers.test.ts
pnpm --filter @humanity4ai/mcp-servers check
pnpm --filter @humanity4ai/evals test
```

**Pre-commit (run in codespace):** `pnpm check && pnpm evals && pnpm test`.
CI order: `check` → `build` → `EVAL_REPORT=1 pnpm evals` → `test:coverage` (both packages).

---

## Coverage Thresholds

| Package | Stmts | Branch | Funcs | Lines |
|---------|-------|--------|-------|-------|
| mcp-servers | 90% | **83%** | 90% | 90% |
| evals | 78% | 65% | 80% | 78% |

**Excluded from coverage (vitest.config.ts):** `bin.ts`, `accessibility-engine.ts`, `server-factory.ts`.
`wcag-criteria.ts` included (96% covered by modules.test.ts).
New conditionals → new tests in `__tests__/modules.test.ts`.

---

## Architecture

### Package layout
- **`mcp-servers/src/server-factory.ts`** — shared `createServer()` → registers all 9 tools on an `McpServer`. Used by both stdio (`mcp-server.ts`) and HTTP (`api/mcp.ts`) transports.
- **`mcp-servers/src/mcp-server.ts`** — thin stdio wrapper: imports factory, connects `StdioServerTransport`. Re-exports handlers + `VERSION` for test compatibility.
- **`mcp-servers/api/mcp.ts`** — Vercel serverless function using `StreamableHTTPServerTransport` in stateless mode. Imports factory + handlers from npm package.
- **`mcp-servers/src/schemas-data.ts`** — auto-generated at build time: all 18 JSON schemas as inline JS objects. `validate.ts` imports this instead of `readFileSync` — zero file I/O, works in all bundler environments (Vercel, Cloudflare).
- **`mcp-servers/src/validate.ts`** — input validation against inline `SCHEMA_REGISTRY`. No `node:fs` dependency. Called by `invokeAction` at handler dispatch time.
- **`mcp-servers/src/handlers.ts`** — 9 private handler functions + `invokeAction(action, input)` dispatcher.
- **`knowledge-core/taxonomy.ts`** — canonical `CATEGORY_SLUGS` + `ESCALATION_REQUIRED_SKILLS` (typed `const` arrays). `taxonomy.md` is the human-readable reference.
- **`evals/src/run-evals.ts`** — parses `VALID_CATEGORIES` from `knowledge-core/taxonomy.md` at runtime (no hardcoded duplicate). 10 checks: 9 skills + `contract-consistency`.

### Key facts
- **MCP server is rule-based** — no LLM calls, no external APIs.
- **Contracts** in `index.ts` (TypeScript array of `ActionContract`).
- **Schemas**: `schemas/<skill>.input|output.json` — 18 files (9 skills × 2). Bundled at build time into `schemas-data.ts`.
- **Shared modules** (import from these, don't duplicate):
  - `patterns.ts` — 16 pattern categories (shame, urgency, crisis, grief, emotion, etc.)
  - `crisis-resources.ts` — crisis phone numbers/URLs (988, 741741, 116 123, IASP, findahelpline.com)
  - `crisis-detection.ts` — `detectCrisisSignals()`, `detectSafetySignals()`
  - `emotion-detection.ts` — `detectEmotion()` (6 categories)
  - `accessibility-engine.ts` — 13 scoring functions (86 WCAG 2.2 criteria), optional axe-core integration
  - `wcag-criteria.ts` — `WCAG_CRITERIA` array (86 entries), `getChecklist(level)`, `criteriaByLevel(level)`
  - `i18n.ts` — 9 languages, `normalizeLocale()`, `getLocalizedCrisisResources()`
- **`invokeAction` is async** — returns `Promise<HandlerResult>`. All callers must `await`.
- **`validateContracts()` called at startup** — `createServer()` in `server-factory.ts` calls it before registering tools. Fail-fast on malformed contracts.
- **Server startup guard**: `mcp-server.ts` skips auto-start when `NODE_ENV === "test"`.
- **`mcpName`** in `mcp-servers/package.json`: `io.github.humanity4ai/project-human` — for MCP Registry publishing.
- **engines.node**: `>=22` across all packages. Node 20 is EOL. CI tests Node 22 exclusively.

### npm package: `@humanity4ai/mcp-servers`
- Subpath exports: `.`, `./handlers`, `./types`, `./validate`, `./schemas/*`
- Bin: `mcp-servers` → `./dist/bin.js` (imports `mcp-server.js`; auto-run guard prevents double-start)
- `prepack` → `pnpm build` (rebuilds dist before publish)
- Publish: build dist in Codespace → `pnpm pack` → copy tarball locally → `npm publish <tarball> --access public` (local Node 20 can't run prepack; publish tarball directly)

### Vercel deployment
- Project: `humanity4ai-mcp` on `simon-maks-projects` team
- Deploy: `vercel_deploy_to_vercel` MCP tool with `api/mcp.ts` + `package.json` + optional `vercel.json`
- SSO protection disabled via `PATCH /v9/projects/:id` with `{"ssoProtection": null}`
- Aliases: `humanity4ai-mcp-simon-maks-projects.vercel.app`

---

## Code Conventions

**Handler pattern** (all 9 handlers return this):
```typescript
type HandlerResult =
  | { ok: true; data: InvokeResponse }
  | { ok: false; error: string };
```
`InvokeResponse`: `{ action, output, assumptions, uncertainty, boundaryNotice }`

- Error messages include hints (e.g., "Use tools/list to see available actions")
- ESM with `.js` extension in relative imports (NodeNext)
- Zod for contract validation; `validate.ts` for MCP input validation (uses inline `SCHEMA_REGISTRY`)
- `validate.ts`: rejects empty strings for required fields, validates array item types, enforces minLength/maxLength

---

## Git Workflow

```
feature/* → main (default branch)
```

All PRs target `main`. CI on push/PR. Merged branches auto-deleted. `development` branch deleted — do not recreate.

**Branch protection (ruleset `main-protection`):** PR required + `validate (22)`/`CodeQL` checks must pass. Direct pushes to `main` are rejected (409). If CI doesn't auto-trigger on a PR, manually dispatch via `gh workflow run ci.yml --ref <branch>`.

**Auth (repo-local only):** pushes to `https://github.com/humanity4ai/` authenticate as `humanity4ai` via fine-grained PAT in `$HUMANITY4AI_PAT` (`~/.env.opencode`), wired through a URL-scoped credential helper in `.git/config`. For gh CLI admin calls: `GH_TOKEN="$HUMANITY4AI_PAT" gh api ...`.

---

## Pitfalls

### Never hardcode crisis phone numbers
Import from `crisis-resources.ts`. All crisis numbers live there. Adding one edits exactly one file.

### Coverage threshold is 83% branches
New if/else/ternary/switch = new tests. `server-factory.ts`, `accessibility-engine.ts`, and `bin.ts` are excluded. Run `pnpm --filter @humanity4ai/mcp-servers test:coverage` before push.

### supportive-conversation category
Category is `emotional-safety`. Now includes grief support modes (presence, practical, reflection). Enforced in `knowledge-core/taxonomy.md` and `skills/index.yaml`.

### Nine skills, not ten or eleven
WCAG AAA + AA consolidated into `accessibility` (1 skill). Grief-loss-support removed. No reproduction. `skills/index.yaml` count must be 9.

### Python scripts are in legacy/
The 112 Python scripts were moved to `legacy/python-scripts/` — the MCP server never called them. All patterns are in `patterns.ts`.

### specs/ is gitignored
SDD artifacts are local-only. Don't reference them in committed code.

### docs/ is where documentation lives
ROADMAP, INSTALL, GOVERNANCE, SYSTEM_PROMPT, etc. are in `docs/` (not root).

### Site deploys automatically
Push to `main` with `site/**` changes triggers GitHub Pages deploy.

### dist/ is committed
NOT in `.gitignore`. Built `dist/` directory must be committed (needed for npm pack and npx entry point). Run `pnpm build` before release commits.
**Design decision (F-005 — maintained):** Retained for npx compatibility, reviewable diffs, and fresh checkout guarantees.

### schemas are bundled at build time
`schemas-data.ts` contains all 18 JSON schemas as inline JS objects. `validate.ts` imports from it — no `readFileSync`, no `node:fs`, no `import.meta.url` path resolution. This means the package works in all bundler environments (Vercel, Cloudflare Workers, etc.) without additional config. When adding a new skill schema, regenerate `schemas-data.ts`.

### CI may not trigger on non-feature/* branches
If a PR's head branch doesn't match `feature/*`, CI might not auto-trigger. Manually dispatch: `gh workflow run ci.yml --ref <branch>`. Both `validate (22)` and `CodeQL` must pass before merge.

### No grief-loss-support
Grief support is handled by `supportive_reply` (supportive-conversation skill). Grief-loss-support skill dir, schemas, and contract were removed — do not recreate them.

### Vercel deploy requires inline schemas
The Vercel function at `api/mcp.ts` calls `invokeAction` from the npm package. Since v1.0.6, schemas are inline — no need to copy schema files to deployment root. Deploy with bare `npm install` (no postinstall tricks, no buildCommand).
