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

`mcp-servers` provides a line-delimited JSON runtime. Two request types:

- `list_actions` — returns all 10 registered action contracts
- `invoke` — validates input against JSON schema, executes skill handler, returns structured response

All 10 skill actions are fully implemented with structured, rule-based responses.

See [`docs/protocol.md`](docs/protocol.md) for the full protocol specification.

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

## Package Release

`mcp-servers` is now prepared as a publishable package with build artifacts and schema exports.

- Build package: `pnpm --filter @humanity4ai/mcp-servers build`
- Create tarball: `pnpm --filter @humanity4ai/mcp-servers pack`
- Release guide: `docs/package-release.md`

## Safety Position

Humanity4AI includes non-clinical support-oriented skills. It does not provide diagnosis, treatment, or professional medical/legal advice.
