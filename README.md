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
pnpm start:mcp-sdk
```

Configure your agent by adding this to your MCP client config:

```json
{
  "mcpServers": {
    "humanity4ai": {
      "command": "pnpm",
      "args": ["--filter", "@humanity4ai/mcp-servers", "start:mcp-sdk"],
      "cwd": "/path/to/project_human"
    }
  }
}
```

All 10 humanity skills are discoverable via `tools/list` and invocable via `tools/call`.
See [`mcp-servers/README.md`](mcp-servers/README.md) for full protocol details and tool reference.

### Legacy NDJSON server

The original custom NDJSON server is still available for backward compatibility:

```bash
pnpm start:mcp
```

Test the running server from a second terminal:

```bash
echo '{"id":"1","type":"list_actions"}' | pnpm --filter @humanity4ai/mcp-servers exec tsx src/server.ts
```

Invoke a skill action:

```bash
echo '{"id":"2","type":"invoke","payload":{"action":"supportive_reply","input":{"message":"I feel overwhelmed","risk_level":"medium"}}}' \
  | pnpm --filter @humanity4ai/mcp-servers exec tsx src/server.ts
```

Full install and deploy guide: [`INSTALL.md`](INSTALL.md)

## Docker (one command)

```bash
docker compose up
```

Then send requests to the running container:

```bash
echo '{"id":"1","type":"list_actions"}' | docker compose exec -T mcp-server node dist/server.js
```

## MCP Runtime (v0.1)

`mcp-servers` provides **two server implementations**:

| Server | Command | Protocol |
|--------|---------|----------|
| **Standard MCP SDK** (recommended) | `pnpm start:mcp-sdk` | JSON-RPC 2.0 over stdio |
| Legacy NDJSON | `pnpm start:mcp` | Custom NDJSON over stdio |

Both servers expose all 10 skill actions with input validation, structured responses, safety boundaries, and uncertainty disclosure.

See [`mcp-servers/README.md`](mcp-servers/README.md) for the full tool reference and [`docs/protocol.md`](docs/protocol.md) for the legacy protocol specification.

## Alternative: Prompt Engineering

If your AI agent doesn't support MCP or skills, you can still use Humanity4AI by providing project content directly in the conversation context.

### How It Works

You (the user) manually share the relevant file contents with your LLM. The LLM then applies those principles when responding to you.

### What to Share

Tell your LLM:

> "Here is the Humanity4AI skill pack for humane AI interactions. Apply these principles in our conversation:
>
> **Core Principles** (read this first):
> [Paste content from `knowledge-core/principles.md`]
>
> **Skills to Use**:
> - For empathetic responses: use `skills/empathetic-communication/SKILL.md`
> - For grief/loss situations: use `skills/grief-loss-support/SKILL.md`
> - For accessibility audits: use `skills/wcag-aaa-accessibility/SKILL.md`
> [Add other skills you'll need]
>
> **Rules**:
> - Always surface the `boundaryNotice` when risk is elevated
> - Include `escalation_guidance` for safety-critical skills
> - Disclose uncertainty level: low / medium / high
 rubric dimensions: Help> - Follow thefulness, Humility, Harm avoidance, Clarity"

### What the LLM Can Do

With skill content in context, the LLM can:

- Apply skill-specific communication patterns from SKILL.md
- Follow safety boundaries and escalation guidance
- Use rubric criteria to evaluate responses
- Reference scenarios for real-world examples
- Disclose uncertainty metadata appropriately

### Best Practices

1. **Share principles first** — Set the foundation with `knowledge-core/principles.md`
2. **Share relevant skills only** — Don't overwhelm context; load skills as needed
3. **Reference specific sections** — Point to exact files for the skill you need
4. **Check boundaries** — Always surface `boundaryNotice` for safety-critical skills

This approach works with any LLM — no MCP or tools required.

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
