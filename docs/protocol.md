# Protocol Specification

**Copyright (c) 2026 Ascent Partners Foundation. MIT License.**

---

## Overview

The Humanity4AI MCP server uses a **line-delimited JSON (NDJSON) protocol over stdin/stdout**.

This is a custom transport layer — it is **not** the MCP SDK JSON-RPC 2.0 protocol used by Anthropic's official Model Context Protocol SDK. We use a simpler, dependency-free protocol in v0.1 to maximise compatibility and ease of integration. A JSON-RPC 2.0 adapter is planned for v0.2.

---

## Transport

- **Input**: stdin, one JSON object per line (newline-delimited)
- **Output**: stdout, one JSON object per line (newline-delimited)
- **Startup messages**: stderr only (never pollutes JSON output stream)
- **Maximum request size**: 512 KB per line

---

## Request envelope

Every request must be a JSON object with the following fields:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | No | Optional caller-assigned request ID, echoed in response |
| `type` | string | Yes | Request type: `list_actions` or `invoke` |
| `payload` | object | Conditional | Required for `invoke` — the action invocation payload |

### `list_actions` request

Returns all registered action contracts.

```json
{"id":"req-1","type":"list_actions"}
```

### `invoke` request

Invokes a named action with structured input.

```json
{
  "id": "req-2",
  "type": "invoke",
  "payload": {
    "action": "supportive_reply",
    "input": {
      "message": "I feel overwhelmed",
      "risk_level": "medium"
    }
  }
}
```

---

## Response envelope

Every response is a JSON object:

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Echoed from the request `id` field if provided |
| `ok` | boolean | `true` if the request succeeded, `false` if it failed |
| `data` | object | Present when `ok: true` — the response payload |
| `error` | string | Present when `ok: false` — human-readable error message |
| `issues` | array | Present when `ok: false` for validation errors — list of issue objects |

### Success response

```json
{
  "id": "req-2",
  "ok": true,
  "data": {
    "action": "supportive_reply",
    "boundaryNotice": "Non-clinical support; must provide escalation cues when risk is elevated",
    "uncertainty": "medium",
    "assumptions": ["Risk level: medium (self-reported or system-assessed)"],
    "output": {
      "reply": "I hear you, and I am glad you reached out...",
      "escalation_guidance": ["If things feel harder over time, consider speaking with a mental health professional"],
      "boundaries_notice": "Non-clinical support..."
    }
  }
}
```

### Error response

```json
{
  "id": "req-3",
  "ok": false,
  "error": "Input validation failed for action 'supportive_reply': Required field 'message' is missing or empty"
}
```

### Validation error response

```json
{
  "id": "req-4",
  "ok": false,
  "error": "Invalid invoke payload",
  "issues": [{"code":"invalid_type","message":"Required","path":["action"]}]
}
```

---

## Action response fields

All action responses include these top-level fields:

| Field | Type | Description |
|-------|------|-------------|
| `action` | string | The action that was invoked |
| `boundaryNotice` | string | Safety boundary notice for this action |
| `uncertainty` | `"low"` \| `"medium"` \| `"high"` | Confidence level of the response |
| `assumptions` | string[] | Assumptions made during processing |
| `output` | object | Action-specific structured output — see each skill's JSON schema |

---

## Error codes

| Condition | `ok` | `error` content |
|-----------|------|----------------|
| Unknown action | `false` | `Unknown action: '...'` |
| Input validation failure | `false` | `Input validation failed for action '...'` |
| Invalid envelope | `false` | `Invalid request envelope` |
| Malformed JSON | `false` | `Malformed JSON request` |
| Request too large | `false` | `Request exceeds maximum size (512 KB)` |

---

## Comparison with MCP SDK (JSON-RPC 2.0)

| Feature | Humanity4AI v0.1 | MCP SDK JSON-RPC 2.0 |
|---------|-----------------|----------------------|
| Transport | stdin/stdout NDJSON | stdin/stdout or HTTP |
| Framing | Newline-delimited | Length-prefixed or HTTP |
| Protocol | Custom envelope | JSON-RPC 2.0 |
| Tool discovery | `list_actions` | `tools/list` |
| Tool invocation | `invoke` | `tools/call` |
| SDK dependency | None | `@modelcontextprotocol/sdk` |

Migration to JSON-RPC 2.0 is planned for v0.2 to enable native compatibility with Claude Code, Copilot, and other MCP SDK clients. The adapter will be a thin wrapper over the existing handlers.
