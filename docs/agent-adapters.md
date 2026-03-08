# Agent Adapter Guide

**Copyright (c) 2026 Ascent Partners Foundation. MIT License.**

This guide explains how to integrate the Humanity4AI MCP server into specific agent platforms. For LLM-native discovery, start with [`/llms.txt`](../llms.txt) at the repository root.

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

## LangChain

Install dependencies:

```bash
npm install langchain @langchain/openai
```

### Wrap the MCP server as a LangChain DynamicTool

```typescript
import { DynamicTool } from "@langchain/core/tools";
import { ChatOpenAI } from "@langchain/openai";
import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";
import { spawn, ChildProcess } from "node:child_process";
import { createInterface } from "node:readline";

// ── Humanity4AI client ────────────────────────────────────────────────────────

class Humanity4AIClient {
  private server: ChildProcess;
  private pending = new Map<string, (r: unknown) => void>();
  private counter = 0;

  constructor(serverPath = "mcp-servers/dist/server.js") {
    this.server = spawn("node", [serverPath], {
      stdio: ["pipe", "pipe", "inherit"] // stderr shows startup banner
    });

    const rl = createInterface({ input: this.server.stdout! });
    rl.on("line", (line) => {
      try {
        const res = JSON.parse(line) as { id?: string; ok: boolean; data?: unknown; error?: string };
        if (res.id) {
          this.pending.get(res.id)?.(res);
          this.pending.delete(res.id);
        }
      } catch { /* ignore malformed lines */ }
    });
  }

  async invoke(action: string, input: Record<string, unknown>): Promise<unknown> {
    const id = `lc-${++this.counter}`;
    return new Promise((resolve) => {
      this.pending.set(id, resolve);
      this.server.stdin!.write(
        JSON.stringify({ id, type: "invoke", payload: { action, input } }) + "\n"
      );
    });
  }

  close(): void {
    this.server.stdin!.end();
  }
}

// ── Create a LangChain tool from any Humanity4AI action ──────────────────────

function createHumanity4AITool(
  client: Humanity4AIClient,
  actionId: string,
  description: string
): DynamicTool {
  return new DynamicTool({
    name: actionId,
    description,
    func: async (inputJson: string) => {
      let input: Record<string, unknown>;
      try {
        input = JSON.parse(inputJson) as Record<string, unknown>;
      } catch {
        return JSON.stringify({ error: "Input must be a valid JSON object string" });
      }

      const res = await client.invoke(actionId, input) as { ok: boolean; data?: { output: unknown; boundaryNotice: string }; error?: string };

      if (!res.ok) {
        // Surface boundary or validation errors as tool errors
        throw new Error(`Humanity4AI action '${actionId}' failed: ${res.error}`);
      }

      // Log boundary notice for audit purposes
      if (res.data?.boundaryNotice) {
        console.log(`[Humanity4AI] Boundary notice: ${res.data.boundaryNotice}`);
      }

      return JSON.stringify(res.data?.output ?? {});
    }
  });
}

// ── Example: empathetic_reframe in a LangChain agent ─────────────────────────

async function main() {
  const client = new Humanity4AIClient();

  const tools = [
    createHumanity4AITool(
      client,
      "empathetic_reframe",
      "Reframes a message with empathy. Input JSON: {message: string, tone: 'warm'|'formal'|'neutral'}"
    ),
    createHumanity4AITool(
      client,
      "supportive_reply",
      "Generates a supportive, non-clinical reply. Input JSON: {message: string, risk_level: 'low'|'medium'|'high'}"
    )
  ];

  const llm = new ChatOpenAI({ model: "gpt-4o", temperature: 0 });
  const agent = await createOpenAIFunctionsAgent({ llm, tools, prompt: /* your prompt hub pull */ null! });
  const executor = new AgentExecutor({ agent, tools, verbose: true });

  const result = await executor.invoke({
    input: "A customer sent us this message: 'We cannot accept your excuse. This is unacceptable.' Please reframe it with empathy."
  });

  console.log(result.output);
  client.close();
}

main().catch(console.error);
```

### Boundary notice handling

Every action response includes a `boundaryNotice` field. Always log or surface this to your observability layer:

```typescript
// In your tool wrapper — before returning output
if (res.data?.boundaryNotice) {
  auditLogger.info({ action: actionId, boundary: res.data.boundaryNotice });
}
```

### Error handling

`ok: false` responses are surfaced as thrown errors in the tool wrapper above, so LangChain's agent will retry or route to an error handler automatically.

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
