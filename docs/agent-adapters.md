# Agent Adapter Guide

## Adapter Contract

All adapters should support:

1. `list_actions`
2. `invoke`

and preserve:

- schema validation
- boundary notices
- assumptions and uncertainty fields

## OpenCode

- Map action contracts to OpenCode tool declarations.
- On invoke, pass `payload.action` and `payload.input` directly.

## Claude Code

- Use MCP bridge with line-delimited JSON transport.
- Enforce output schema checks before returning agent output.

## Copilot

- Map actions to extension commands or skill endpoints.
- Keep safety boundary and uncertainty metadata in final output.

## Manus AI / OpenClaw

- Integrate through wrapper process that forwards requests to `mcp-servers` runtime.
- Add platform-specific auth and observability outside the core contract.
