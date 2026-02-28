# Humanity4AI

Humanity4AI is an open, community-driven project that provides reusable "humanity skills" for AI systems and agents.

The project is designed for broad compatibility across agent platforms, including OpenCode, Claude Code, Copilot, Manus AI, OpenClaw, and other tool-capable agents.

[![CI](https://github.com/humanity4ai/project_human/actions/workflows/ci.yml/badge.svg)](https://github.com/humanity4ai/project_human/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/humanity4ai/project_human)](https://github.com/humanity4ai/project_human/releases)
[![Issues](https://img.shields.io/github/issues/humanity4ai/project_human)](https://github.com/humanity4ai/project_human/issues)
[![Contributors](https://img.shields.io/github/contributors/humanity4ai/project_human)](https://github.com/humanity4ai/project_human/graphs/contributors)

## Start Here

- New users: [Get Started](#quick-start)
- Contributors: [Contributing Guide](CONTRIBUTING.md)
- Integrators: [Agent Adapter Guide](docs/agent-adapters.md)
- Team execution: [Operations Plan](OPERATIONS.md)

## Mission

- Make humane, uncertainty-aware, safety-bounded behavior practical for AI agents.
- Publish structured, testable skill specifications that can be executed through MCP-compatible tools.
- Keep skills auditable and updatable through open governance, provenance rules, and evaluation rubrics.

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

## Quick Start

```bash
pnpm install
pnpm check
pnpm evals
pnpm start:mcp
```

Open a second terminal and send a request to the MCP runtime:

```bash
printf '{"id":"1","type":"list_actions"}\n' | pnpm --filter @humanity4ai/mcp-servers exec tsx src/server.ts
```

## MCP Runtime (v0.1)

`mcp-servers` provides a contract-first line-delimited JSON runtime with two request types:

- `list_actions` - returns all registered action contracts
- `invoke` - validates payload and executes skill handler (implemented or stubbed)

This lets agents integrate now while deeper platform-specific adapters are built in later versions.

## Integrations

- OpenCode
- Claude Code
- Microsoft Copilot ecosystem
- Manus AI
- OpenClaw

See implementation notes in `docs/integrations.md` and `docs/agent-adapters.md`.

## Contribute in 10 Minutes

1. Pick one starter task in `docs/good-first-issues.md`.
2. Copy `templates/skill/` for new skill work.
3. Run `pnpm check && pnpm evals`.
4. Open a PR using `.github/pull_request_template.md`.

## Traction and Roadmap

- 14-day launch cadence: `docs/traction-14-day.md`
- Quality gates: `docs/quality-gates.md`
- Release roadmap: `ROADMAP.md`

## Safety Position

Humanity4AI includes non-clinical support-oriented skills. It does not provide diagnosis, treatment, or professional medical/legal advice.
