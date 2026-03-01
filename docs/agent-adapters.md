# Agent Adapter Guide

**Copyright (c) 2026 Ascent Partners Foundation. MIT License.**

This guide explains how to integrate the Humanity4AI MCP server into specific agent platforms.

See [`docs/protocol.md`](protocol.md) for the full request/response protocol specification.

---

## Adapter Requirements

All adapters must:

1. Start the server process and pipe stdin/stdout
2. Send well-formed JSON envelopes (one per line)
3. Parse JSON responses and handle `ok: false` errors
4. Surface `boundaryNotice` and `escalation_guidance` to users when present
5. Disclose `uncertainty` level where relevant to users

---

## OpenCode

Add the server as a local tool in your OpenCode session:

```bash
# Start the server in background, pipe via named FIFO or process substitution
pnpm --filter @humanity4ai/mcp-servers exec tsx src/server.ts &
```

In your OpenCode skill or tool definition:

```typescript
// List available actions
const response = await sendToServer({ id: "1", type: "list_actions" });

// Invoke an action
const result = await sendToServer({
  id: "2",
  type: "invoke",
  payload: {
    action: "supportive_reply",
    input: { message: userMessage, risk_level: "medium" }
  }
});

if (result.ok) {
  return result.data.output.reply;
} else {
  throw new Error(result.error);
}
```

---

## Claude Code

Start the server and communicate via stdin/stdout pipe:

```typescript
import { spawn } from "node:child_process";

const server = spawn("node", ["mcp-servers/dist/server.js"], {
  stdio: ["pipe", "pipe", "inherit"] // stderr to console for banner
});

function sendRequest(request: object): Promise<unknown> {
  return new Promise((resolve) => {
    server.stdout.once("data", (chunk: Buffer) => {
      resolve(JSON.parse(chunk.toString()));
    });
    server.stdin.write(JSON.stringify(request) + "\n");
  });
}

// List actions
const actions = await sendRequest({ id: "1", type: "list_actions" });

// Invoke
const result = await sendRequest({
  id: "2",
  type: "invoke",
  payload: {
    action: "wcagaaa_check",
    input: { target: "https://example.com", level: "AAA" }
  }
});
```

---

## Microsoft Copilot

Register each Humanity4AI action as a Copilot Plugin skill:

```yaml
# copilot-plugin.yaml excerpt
skills:
  - id: supportive_reply
    description: Generate empathetic, safety-bounded supportive conversation responses
    parameters:
      - name: message
        type: string
        required: true
      - name: risk_level
        type: string
        enum: [low, medium, high]
        required: true
    handler:
      type: process
      command: node
      args: [mcp-servers/dist/server.js]
      protocol: ndjson
      request_template: |
        {"type":"invoke","payload":{"action":"supportive_reply","input":{"message":"{{message}}","risk_level":"{{risk_level}}"}}}
      response_path: data.output.reply
```

---

## Manus AI

Use Manus AI's tool calling API to wrap the server process:

```python
import subprocess
import json

def call_humanity4ai(action: str, input_data: dict) -> dict:
    request = json.dumps({
        "id": "manus-1",
        "type": "invoke",
        "payload": {"action": action, "input": input_data}
    })
    result = subprocess.run(
        ["node", "mcp-servers/dist/server.js"],
        input=request + "\n",
        capture_output=True,
        text=True,
        timeout=10
    )
    response = json.loads(result.stdout.strip())
    if not response.get("ok"):
        raise RuntimeError(f"Action failed: {response.get('error')}")
    return response["data"]["output"]

# Example
output = call_humanity4ai("empathetic_reframe", {
    "message": "We cannot process your request.",
    "tone": "warm"
})
print(output["reframed_message"])
```

---

## OpenClaw

OpenClaw supports process-based tool execution. Register the server as a tool:

```json
{
  "tool_name": "humanity4ai_mcp",
  "type": "process",
  "command": "node mcp-servers/dist/server.js",
  "protocol": "ndjson",
  "actions": [
    {
      "name": "list_actions",
      "request": {"type": "list_actions"}
    },
    {
      "name": "invoke",
      "request": {"type": "invoke", "payload": "{{payload}}"}
    }
  ]
}
```

---

## n8n

Use the **Execute Command** node to call the server:

1. Add an **Execute Command** node
2. Set command: `echo '{{$json.request}}' | node /path/to/mcp-servers/dist/server.js`
3. Parse the stdout JSON in the next node
4. Route on `ok` field — `true` to success branch, `false` to error branch

---

## General integration pattern

```typescript
import { createInterface } from "node:readline";
import { spawn } from "node:child_process";

export class Humanity4AIClient {
  private server;
  private pending = new Map<string, (r: unknown) => void>();
  private counter = 0;

  constructor() {
    this.server = spawn("node", ["mcp-servers/dist/server.js"], {
      stdio: ["pipe", "pipe", "inherit"]
    });

    const rl = createInterface({ input: this.server.stdout });
    rl.on("line", (line) => {
      const res = JSON.parse(line) as { id?: string; ok: boolean; data?: unknown; error?: string };
      if (res.id) {
        this.pending.get(res.id)?.(res);
        this.pending.delete(res.id);
      }
    });
  }

  async send(type: string, payload?: unknown): Promise<unknown> {
    const id = `req-${++this.counter}`;
    return new Promise((resolve) => {
      this.pending.set(id, resolve);
      this.server.stdin.write(JSON.stringify({ id, type, payload }) + "\n");
    });
  }

  async listActions() {
    return this.send("list_actions");
  }

  async invoke(action: string, input: Record<string, unknown>) {
    return this.send("invoke", { action, input });
  }

  close() {
    this.server.stdin.end();
  }
}
```
