# Humanity4AI

Humanity4AI is an open, community-driven project that provides reusable "humanity skills" for AI systems and agents.

The project is designed for broad compatibility across agent platforms, including OpenCode, Claude Code, Copilot, Manus AI, OpenClaw, and other tool-capable agents.

[![CI](https://github.com/humanity4ai/project_human/actions/workflows/ci.yml/badge.svg)](https://github.com/humanity4ai/project_human/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/humanity4ai/project_human)](https://github.com/humanity4ai/project_human/releases)
[![Issues](https://img.shields.io/github/issues/humanity4ai/project_human)](https://github.com/humanity4ai/project_human/issues)
[![Contributors](https://img.shields.io/github/contributors/humanity4ai/project_human)](https://github.com/humanity4ai/project_human/graphs/contributors)
[![Pages](https://img.shields.io/badge/docs-GitHub%20Pages-1f2937)](https://humanity4ai.github.io/project_human/)

## Start Here

- New users: [Get Started](#quick-start)
- Contributors: [Contributing Guide](CONTRIBUTING.md)
- Integrators: [Agent Adapter Guide](docs/agent-adapters.md)
- Team execution: [Operations Plan](OPERATIONS.md)
- Public landing page: <https://humanity4ai.github.io/project_human/>

## Mission

- Make humane, uncertainty-aware, safety-bounded behavior practical for AI agents.
- Publish structured, testable skill specifications that can be executed through MCP-compatible tools.
- Keep skills auditable and updatable through open governance, provenance rules, and evaluation rubrics.

## Manifesto

We believe intelligence without humanity is not progress. Systems that affect people must communicate with humility, respect uncertainty, and escalate to qualified human support when risk exceeds model competence.

Read the full manifesto: [`docs/manifesto.md`](docs/manifesto.md)

- Manifesto implementation map: [`docs/manifesto-roadmap-map.md`](docs/manifesto-roadmap-map.md)
- Community call thread: https://github.com/humanity4ai/project_human/issues/41
- Help wanted issues: https://github.com/humanity4ai/project_human/issues?q=is%3Aopen+label%3A%22help+wanted%22

## Repository Layout

- `skills/` - Ten launch skill packs with machine-readable specs, rubrics, and scenarios.
- `knowledge-core/` - Canonical principles, taxonomy, and uncertainty metadata schema.
- `mcp-servers/` - MCP action contracts and TypeScript server scaffolding.
- `evals/` - Baseline evaluation harness and global scoring rubric.
- `templates/` - Skill templates for contributors.
- `marketing/` - Launch announcement and outreach assets.

## What You Can Do Right Now

- Run baseline quality gates for all 10 skills.
- List and invoke MCP action contracts locally.
- Pick a "good first issue" and submit a contribution.

## v0.1 Launch Scope

- 10 initial skill categories with safety boundaries
- MCP action schemas for each skill
- Evaluation baseline and quality gates
- Public contribution process and governance docs

## Prerequisites

- **Node.js** >= 20 — [nodejs.org/download](https://nodejs.org/en/download)
- **pnpm** >= 10 — `npm install -g pnpm`
- **Docker** (optional, for container deployment)

## Quick Start

```bash
git clone https://github.com/humanity4ai/project_human.git
cd project_human
pnpm install
pnpm check
pnpm evals
```

### For AI Agents — Standard MCP SDK (JSON-RPC 2.0)

Start the standard MCP server compatible with Claude Code, Copilot, Manus AI, OpenCode, and any MCP SDK client:

```bash
pnpm start
```

Configure your agent by adding this to your MCP client config:

```json
{
  "mcpServers": {
    "humanity4ai": {
      "command": "pnpm",
      "args": ["--filter", "@humanity4ai/mcp-servers", "start"],
      "cwd": "/path/to/project_human"
    }
  }
}
```

All 10 humanity skills are discoverable via `tools/list` and invocable via `tools/call`.
See [`mcp-servers/README.md`](mcp-servers/README.md) for full protocol details and tool reference.

Full install and deploy guide: [`INSTALL.md`](INSTALL.md)

## Docker (one command)

```bash
docker compose up
```

## MCP Runtime (v0.1)

`mcp-servers` exposes all 10 skill actions via the standard MCP SDK JSON-RPC 2.0 protocol:

| Server | Command | Protocol |
|--------|---------|----------|
| **Standard MCP SDK** | `pnpm start` | JSON-RPC 2.0 over stdio |

All tools include input validation, structured responses, safety boundaries, and uncertainty disclosure.
See [`mcp-servers/README.md`](mcp-servers/README.md) for the full tool reference.

## Alternative: Prompt Engineering

If your AI agent doesn't support MCP or skills, you can still use Humanity4AI by providing project content directly in the conversation context. This is less reliable than the MCP server but provides a good fallback.

### How It Works

You (the user) manually share the relevant file contents with your LLM. The LLM then applies those principles when responding to you. The best way to do this is to point the LLM to the `llms.txt` file.

### What to Share

Tell your LLM:

> "You are an AI assistant with the Humanity4AI skillset. Your primary goal is to interact with users in a humane, ethical, and context-aware manner. Start by reading the `llms.txt` file at the root of this repository to understand your capabilities, then apply the principles and skills you find there in our conversation."

Alternatively, you can provide the full context in one go:

> "Here is the full context for the Humanity4AI skillset. Apply these principles and skills in our conversation:
> 
> [Paste the entire content of `llms-full.txt` here]"

## Integrations

- OpenCode
- Claude Code
- Microsoft Copilot ecosystem
- Manus AI
- OpenClaw

See implementation notes in `docs/integrations.md` and `docs/agent-adapters.md`.

## Contribute in 10 Minutes

**Step 1 — Pick a task**

Browse [open starter issues](https://github.com/humanity4ai/project_human/issues/new/choose) or see `docs/good-first-issues.md` for curated tasks.

**Step 2 — Fork, branch, and implement**

```bash
# Clone your fork
git clone https://github.com/<your-username>/project_human.git
cd project_human

# Branch from development (the default branch)
git checkout development
git checkout -b my-contribution

# Copy the skill template if adding a new skill
cp -r templates/skill skills/my-skill-name

# Run all checks before opening a PR
pnpm check && pnpm evals && pnpm test
```

**Step 3 — Open a PR targeting `development`**

```bash
gh pr create \
  --base development \
  --title "Add: my contribution" \
  --body "Closes #<issue-number>"
```

Or open via GitHub UI — the default base branch is `development`.

**Troubleshooting**

| Error | Fix |
|-------|-----|
| `ERR_PNPM_OUTDATED_LOCKFILE` | Run `pnpm install` (without `--frozen-lockfile`) to update the lockfile, then commit `pnpm-lock.yaml` |
| `pnpm: command not found` | Run `npm install -g pnpm` |
| `pnpm evals` fails | Run `EVAL_REPORT=1 pnpm evals` — the report at `evals/reports/latest.md` shows which gates failed and why |

## Traction and Roadmap

- 14-day launch cadence: `docs/traction-14-day.md`
- Quality gates: `docs/quality-gates.md`
- Release roadmap: `ROADMAP.md`

## How To Help This Week

- Good first issues: https://github.com/humanity4ai/project_human/issues?q=is%3Aopen+label%3A%22good+first+issue%22
- Help wanted: https://github.com/humanity4ai/project_human/issues?q=is%3Aopen+label%3A%22help+wanted%22

## Package Release

`mcp-servers` is now prepared as a publishable package with build artifacts and schema exports.

- Build package: `pnpm --filter @humanity4ai/mcp-servers build`
- Create tarball: `pnpm --filter @humanity4ai/mcp-servers pack`
- Release guide: `docs/package-release.md`

## Safety Position

Humanity4AI includes non-clinical support-oriented skills. It does not provide diagnosis, treatment, or professional medical/legal advice.
