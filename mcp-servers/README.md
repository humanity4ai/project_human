# @humanity4ai/mcp-servers

MCP action contracts and server runtime for Humanity4AI skills.

This package ships **two server implementations**:

| Server | File | Protocol | Compatible with |
|--------|------|----------|-----------------|
| **Standard MCP SDK** (recommended) | `src/mcp-server.ts` | JSON-RPC 2.0 over stdio | Claude Code, Copilot, Manus AI, OpenCode, LangChain, any MCP SDK client |
| Legacy NDJSON | `src/server.ts` | Custom NDJSON over stdio | Custom integrations (see `docs/agent-adapters.md`) |

---

## Quick Start for AI Agents (Standard MCP SDK)

### 1. Clone and install

```bash
git clone https://github.com/humanity4ai/project_human.git
cd project_human
pnpm install
```

### 2. Start the standard MCP server

```bash
pnpm start:mcp-sdk
# or directly:
pnpm --filter @humanity4ai/mcp-servers start:mcp-sdk
```

The server starts on **stdio** using the official MCP SDK JSON-RPC 2.0 protocol.
All 10 humanity skills are registered as MCP tools and discoverable via `tools/list`.

### 3. Configure your MCP client

Add to your MCP client configuration (e.g. `claude_desktop_config.json`, `.cursor/mcp.json`, `manus-mcp.json`):

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

---

## Available Tools (10 skills)

| Tool name | Skill | Description |
|-----------|-------|-------------|
| `wcagaaa_check` | WCAG AAA Accessibility | Audit a URL or HTML snippet for WCAG 2.2 compliance |
| `rewrite_depression_sensitive_content` | Depression-Sensitive Content | Audit or rewrite text for mental health sensitivity |
| `supportive_reply` | Supportive Conversation | Generate a supportive, non-clinical reply with escalation guidance |
| `cognitive_accessibility_audit` | Cognitive Accessibility | Audit content for cognitive load and plain-language compliance |
| `cultural_context_check` | Cultural Sensitivity | Check a message for cultural sensitivity issues |
| `deescalation_plan` | Conflict De-escalation | Generate a structured de-escalation plan |
| `empathetic_reframe` | Empathetic Communication | Reframe a message with genuine empathy |
| `grief_support_response` | Grief & Loss Support | Generate a compassionate grief support response |
| `neurodiversity_design_check` | Neurodiversity-Aware Design | Audit UI for ADHD, autism, dyslexia, and sensory sensitivities |
| `age_inclusive_design_check` | Age-Inclusive Design | Audit a user flow for age-inclusive design |

---

## Protocol Details

### Standard MCP SDK server (recommended)

The standard server (`src/mcp-server.ts`) uses the official `@modelcontextprotocol/sdk` and communicates via **JSON-RPC 2.0 over stdio**. This is the protocol natively understood by Claude Code, Copilot, Manus AI, OpenCode, and any other MCP SDK-compatible agent.

**Tool discovery:**
```json
{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"my-agent","version":"1.0"}}}
{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}
```

**Tool invocation:**
```json
{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"empathetic_reframe","arguments":{"message":"I failed the exam I studied so hard for","tone":"warm"}}}
```

### Legacy NDJSON server

The legacy server (`src/server.ts`) uses a custom line-delimited JSON protocol. See [`docs/protocol.md`](../docs/protocol.md) for the full specification and [`docs/agent-adapters.md`](../docs/agent-adapters.md) for integration examples.

```bash
pnpm --filter @humanity4ai/mcp-servers start
```

---

## Safety Boundaries

Every tool response includes a `boundaryNotice` field. Always surface this to users:

- `wcagaaa_check` — Compliance guidance only; does not replace legal review
- `rewrite_depression_sensitive_content` — Non-clinical UX/content guidance only
- `supportive_reply` — Non-clinical support; must escalate when risk is elevated
- `cognitive_accessibility_audit` — Design guidance only
- `cultural_context_check` — Context-sensitive recommendations with uncertainty disclosure
- `deescalation_plan` — No coercive tactics
- `empathetic_reframe` — No manipulation or deceptive empathy
- `grief_support_response` — Non-clinical bereavement support only
- `neurodiversity_design_check` — Inclusive design guidance only
- `age_inclusive_design_check` — Inclusive design guidance only

---

## Package Use

Install from npm once published:

```bash
pnpm add @humanity4ai/mcp-servers
```

Import contracts programmatically:

```ts
import { actionContracts, validateContracts } from "@humanity4ai/mcp-servers";
const contracts = validateContracts(actionContracts);
```

---

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

---

## Planned v0.2+

- HTTP/SSE transport for remote MCP server deployments
- Auth policies and rate controls
- Telemetry and evaluation hooks
- JSON-RPC 2.0 adapter for the legacy NDJSON server
