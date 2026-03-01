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

## Package Use

Install from npm once published:

```bash
pnpm add @humanity4ai/mcp-servers
```

Then import contracts:

```ts
import { actionContracts, validateContracts } from "@humanity4ai/mcp-servers";

const contracts = validateContracts(actionContracts);
```

## Examples

The `examples/` directory contains one complete request/response pair per action:

| File | Action |
|------|--------|
| `examples/wcagaaa_check.example.json` | `wcagaaa_check` |
| `examples/rewrite_depression_sensitive_content.example.json` | `rewrite_depression_sensitive_content` |
| `examples/supportive_reply.example.json` | `supportive_reply` |
| `examples/cognitive_accessibility_audit.example.json` | `cognitive_accessibility_audit` |
| `examples/cultural_context_check.example.json` | `cultural_context_check` |
| `examples/deescalation_plan.example.json` | `deescalation_plan` |
| `examples/empathetic_reframe.example.json` | `empathetic_reframe` |
| `examples/grief_support_response.example.json` | `grief_support_response` |
| `examples/neurodiversity_design_check.example.json` | `neurodiversity_design_check` |
| `examples/age_inclusive_design_check.example.json` | `age_inclusive_design_check` |

Each file follows the structure:

```json
{
  "request":  { "id": "...", "type": "invoke", "payload": { "action": "...", "input": { ... } } },
  "response": { "id": "...", "ok": true, "data": { "action": "...", "boundaryNotice": "...", "uncertainty": "...", "assumptions": [...], "output": { ... } } }
}
```

## Planned v0.2+

- Runtime adapters for OpenCode, Claude Code, and Copilot
- Auth policies and rate controls
- Telemetry and evaluation hooks
