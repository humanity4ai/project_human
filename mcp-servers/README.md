# MCP Servers

This package contains action contracts and server scaffolding for Humanity4AI skills.

## v0.1 Scope

- JSON input/output schemas for all launch skills
- Type-safe registry for action contracts
- Boundary notes for sensitive skill actions
- Line-delimited JSON transport server for action listing and invocation

## Local Run

```bash
pnpm --filter @humanity4ai/mcp-servers start
```

### Request examples

List actions:

```json
{"id":"1","type":"list_actions"}
```

Invoke action:

```json
{"id":"2","type":"invoke","payload":{"action":"supportive_reply","input":{"message":"I feel overwhelmed","risk_level":"medium"}}}
```

## Planned v0.2+

- Runtime adapters for OpenCode, Claude Code, and Copilot
- Auth policies and rate controls
- Telemetry and evaluation hooks
