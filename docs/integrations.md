# Integrations

Humanity4AI is contract-first in v0.1. Runtime adapters can be implemented per platform using MCP action schemas in `mcp-servers/schemas/`.

## OpenCode

- Register relevant skill actions as callable tools.
- Map tool input/output to matching JSON schemas.
- Enforce boundaries from each `skill.yaml`.

## Claude Code

- Expose skill actions through MCP bridge.
- Pass structured output through evaluation hooks.

## Copilot

- Use action contracts as skill invocation interfaces.
- Preserve provenance and uncertainty metadata in generated responses.

## Manus AI / OpenClaw

- Implement schema-driven adapters for action invocation.
- Validate outputs against declared output schemas before returning to users.
