# @humanity4ai/mcp-servers

![Humanity4AI](https://raw.githubusercontent.com/humanity4ai/project_human/main/site/assets/favicon.svg)

MCP action contracts and server runtime for Humanity4AI skills.

All 9 humanity skills are exposed as standard MCP tools using the official `@modelcontextprotocol/sdk` JSON-RPC 2.0 protocol, natively compatible with Claude Code, Copilot, Manus AI, OpenCode, LangChain, and any other MCP SDK client.

---

## Quick Start for AI Agents

### 1. Clone and install

```bash
git clone https://github.com/humanity4ai/project_human.git
cd project_human
pnpm install
```

### 2. Start the MCP server

```bash
pnpm start
# or directly:
pnpm --filter @humanity4ai/mcp-servers start
```

The server starts on **stdio** using the official MCP SDK JSON-RPC 2.0 protocol.
All 9 humanity skills are registered as MCP tools and discoverable via `tools/list`.

A remote endpoint is also available at `https://humanity4ai.ascent.partners/api/mcp` using Streamable HTTP transport — no clone needed.

### 3. Configure your MCP client

**Local (stdio):**

Add to your MCP client configuration (e.g. `claude_desktop_config.json`, `.cursor/mcp.json`, `opencode.json`):

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

Or use `npx` once published to npm (no local clone needed):

```json
{
  "mcpServers": {
    "humanity4ai": {
      "command": "npx",
      "args": ["-y", "@humanity4ai/mcp-servers"]
    }
  }
}
```

**Remote (Streamable HTTP):**

```json
{
  "mcpServers": {
    "humanity4ai": {
      "url": "https://humanity4ai.ascent.partners/api/mcp"
    }
  }
}
```

---

## Available Tools (9 skills)

| Tool name | Skill | Description |
|-----------|-------|-------------|
| `accessibility_audit` | WCAG Accessibility Audit | Audit web pages for WCAG 2.2 compliance (crawl) or set session WCAG level |
| `rewrite_depression_sensitive_content` | Depression-Sensitive Content | Audit or rewrite text for mental health sensitivity |
| `supportive_reply` | Supportive Conversation | Generate a supportive, non-clinical reply with escalation guidance; includes grief support modes (presence, practical, reflection) |
| `cognitive_accessibility_audit` | Cognitive Accessibility | Audit content for cognitive load and plain-language compliance |
| `cultural_context_check` | Cultural Sensitivity | Check a message for cultural sensitivity issues |
| `deescalation_plan` | Conflict De-escalation | Generate a structured de-escalation plan |
| `empathetic_reframe` | Empathetic Communication | Reframe a message with genuine empathy |
| `neurodiversity_design_check` | Neurodiversity-Aware Design | Audit UI for ADHD, autism, dyslexia, and sensory sensitivities |
| `age_inclusive_design_check` | Age-Inclusive Design | Audit a user flow for age-inclusive design |

---

## Protocol

The server uses the official `@modelcontextprotocol/sdk` and communicates via **JSON-RPC 2.0** over two transports:

- **stdio** — local process (clone & run, npx, Docker)
- **Streamable HTTP** — remote deployment (Vercel, stateless mode)

**Tool discovery:**
```json
{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"my-agent","version":"1.0"}}}
{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}
```

**Tool invocation:**
```json
{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"empathetic_reframe","arguments":{"message":"I failed the exam I studied so hard for","tone":"warm"}}}
```

---

## Safety Boundaries

Every tool response includes a `boundaryNotice` field. Always surface this to users:

- `accessibility_audit` — Compliance guidance only; does not replace legal review
- `rewrite_depression_sensitive_content` — Non-clinical UX/content guidance only
- `supportive_reply` — Non-clinical support; must escalate when risk is elevated (includes grief support modes)
- `cognitive_accessibility_audit` — Design guidance only
- `cultural_context_check` — Context-sensitive recommendations with uncertainty disclosure
- `deescalation_plan` — No coercive tactics
- `empathetic_reframe` — No manipulation or deceptive empathy
- `neurodiversity_design_check` — Inclusive design guidance only
- `age_inclusive_design_check` — Inclusive design guidance only

---

## Package Use

```bash
pnpm add @humanity4ai/mcp-servers
# or
npm install @humanity4ai/mcp-servers
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
| `examples/accessibility_audit.example.json` | `accessibility_audit` |
| `examples/rewrite_depression_sensitive_content.example.json` | `rewrite_depression_sensitive_content` |
| `examples/supportive_reply.example.json` | `supportive_reply` |
| `examples/cognitive_accessibility_audit.example.json` | `cognitive_accessibility_audit` |
| `examples/cultural_context_check.example.json` | `cultural_context_check` |
| `examples/deescalation_plan.example.json` | `deescalation_plan` |
| `examples/empathetic_reframe.example.json` | `empathetic_reframe` |
| `examples/neurodiversity_design_check.example.json` | `neurodiversity_design_check` |
| `examples/age_inclusive_design_check.example.json` | `age_inclusive_design_check` |

---

## Roadmap

- Auth policies and rate controls for remote deployments
- Telemetry and evaluation hooks
- Rich scenario scoring beyond structural checks
- MCP Registry listing (mcp-publisher)
