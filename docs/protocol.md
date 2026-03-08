# Protocol Specification

**Copyright (c) 2026 Ascent Partners Foundation. MIT License.**

---

## Overview

Humanity4AI uses the official `@modelcontextprotocol/sdk` JSON-RPC 2.0 protocol over stdio. This is the standard protocol natively understood by Claude Code, Copilot, Manus AI, OpenCode, LangChain, and any other MCP SDK-compatible agent.

---

## Transport

- **Input**: stdin, one JSON-RPC 2.0 message per line
- **Output**: stdout, one JSON-RPC 2.0 message per line
- **Startup messages**: stderr only (never pollutes the JSON output stream)

---

## Initialisation

Before calling any tools, clients must send an `initialize` request:

```json
{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"my-agent","version":"1.0"}}}
```

Response:

```json
{"jsonrpc":"2.0","id":1,"result":{"protocolVersion":"2024-11-05","capabilities":{"tools":{}},"serverInfo":{"name":"humanity4ai-mcp","version":"0.1.0"}}}
```

---

## Tool Discovery

```json
{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}
```

Response includes all 10 registered tools with their name, description, and input schema.

---

## Tool Invocation

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "supportive_reply",
    "arguments": {
      "message": "I feel overwhelmed",
      "risk_level": "medium"
    }
  }
}
```

### Success response

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "{\n  \"action\": \"supportive_reply\",\n  \"boundaryNotice\": \"Non-clinical support; must escalate when risk is elevated\",\n  \"uncertainty\": \"medium\",\n  \"assumptions\": [\"Risk level: medium (self-reported)\"],\n  \"output\": {\n    \"reply\": \"I hear you, and I am glad you reached out...\",\n    \"escalation_guidance\": [\"If things feel harder over time, consider speaking with a mental health professional\"]\n  }\n}"
      }
    ]
  }
}
```

### Error response

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "error": {
    "code": -32602,
    "message": "Input validation failed for action 'supportive_reply': Required field 'message' is missing or empty"
  }
}
```

---

## Tool Response Fields

All tool responses return a single `text` content item containing a JSON-encoded `InvokeResponse` object:

| Field | Type | Description |
|-------|------|-------------|
| `action` | string | The tool that was invoked |
| `boundaryNotice` | string | Safety boundary notice — always surface to users |
| `uncertainty` | `"low"` \| `"medium"` \| `"high"` | Confidence level of the response |
| `assumptions` | string[] | Assumptions made during processing |
| `output` | object | Tool-specific structured output — see each skill's JSON schema |

---

## Error Codes

| Condition | JSON-RPC error code | Message |
|-----------|---------------------|---------|
| Unknown tool | `-32601` | `Method not found` |
| Input validation failure | `-32602` | `Input validation failed for action '...'` |
| Invalid params | `-32602` | `Invalid params` |
| Internal error | `-32603` | `Internal error` |

---

## Available Tools (10)

| Tool name | Skill |
|-----------|-------|
| `wcagaaa_check` | WCAG AAA Accessibility |
| `rewrite_depression_sensitive_content` | Depression-Sensitive Content |
| `supportive_reply` | Supportive Conversation |
| `cognitive_accessibility_audit` | Cognitive Accessibility |
| `cultural_context_check` | Cultural Sensitivity |
| `deescalation_plan` | Conflict De-escalation |
| `empathetic_reframe` | Empathetic Communication |
| `grief_support_response` | Grief & Loss Support |
| `neurodiversity_design_check` | Neurodiversity-Aware Design |
| `age_inclusive_design_check` | Age-Inclusive Design |

See [`mcp-servers/README.md`](../mcp-servers/README.md) for full tool reference and input/output schemas.
