# Humanity4AI

Humanity4AI is an open, community-driven project that provides reusable "humanity skills" for AI systems and agents.

The project is designed for broad compatibility across agent platforms, including OpenCode, Claude Code, Copilot, Manus AI, OpenClaw, and other tool-capable agents.

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

## MCP Runtime (v0.1)

`mcp-servers` provides a contract-first line-delimited JSON runtime with two request types:

- `list_actions` - returns all registered action contracts
- `invoke` - validates payload and executes skill handler (implemented or stubbed)

This lets agents integrate now while deeper platform-specific adapters are built in later versions.

## Safety Position

Humanity4AI includes non-clinical support-oriented skills. It does not provide diagnosis, treatment, or professional medical/legal advice.
