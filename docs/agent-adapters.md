# Agent Adapter Guide

**Copyright (c) 2026 Ascent Partners Foundation. MIT License.**

This guide explains how to integrate the Humanity4AI MCP server into specific agent platforms. For LLM-native discovery, start with [`/llms.txt`](../llms.txt) at the repository root.

The server uses the official `@modelcontextprotocol/sdk` JSON-RPC 2.0 protocol over stdio. All examples below use this standard protocol.

---

## Adapter Requirements

All adapters must:

1. Start the server process: `pnpm --filter @humanity4ai/mcp-servers start`
2. Send JSON-RPC 2.0 messages over stdin (one per line)
3. Parse JSON-RPC 2.0 responses from stdout
4. Surface `boundaryNotice` and `escalation_guidance` to users when present
5. Disclose `uncertainty` level where relevant to users

---

## OpenCode

Add to your `~/.config/opencode/opencode.json`:

```json
{
  "mcp": {
    "humanity4ai": {
      "type": "local",
      "command": ["pnpm", "--dir", "/path/to/project_human", "--filter", "@humanity4ai/mcp-servers", "start"],
      "enabled": true
    }
  }
}
```

Or using `npx` (once published to npm):

```json
{
  "mcp": {
    "humanity4ai": {
      "type": "local",
      "command": ["npx", "-y", "@humanity4ai/mcp-servers"],
      "enabled": true
    }
  }
}
```

---

## Claude Code / Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

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

---

## Cursor

Add to `.cursor/mcp.json` in your project root:

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

---

## Microsoft Copilot

Register each Humanity4AI action as a Copilot Plugin skill using the MCP SDK server:

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
      type: mcp
      command: pnpm
      args: ["--filter", "@humanity4ai/mcp-servers", "start"]
      tool_name: supportive_reply
```

---

## Manus AI

Use Manus AI's MCP integration to connect the server:

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

Or call programmatically via the MCP SDK client:

```typescript
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const transport = new StdioClientTransport({
  command: "pnpm",
  args: ["--filter", "@humanity4ai/mcp-servers", "start"],
  cwd: "/path/to/project_human"
});

const client = new Client({ name: "manus-ai", version: "1.0" }, { capabilities: {} });
await client.connect(transport);

const result = await client.callTool({
  name: "empathetic_reframe",
  arguments: { message: "We cannot process your request.", tone: "warm" }
});

console.log(result.content);
await client.close();
```

---

## n8n

Use the **MCP Client** node (or **Execute Command** node) to call the server:

1. Add an **Execute Command** node
2. Set command: `pnpm --filter @humanity4ai/mcp-servers start`
3. Send JSON-RPC 2.0 messages via stdin and parse stdout responses
4. Route on the `result.content` field

---

## LangChain

Install dependencies:

```bash
npm install langchain @langchain/openai @modelcontextprotocol/sdk
```

### Wrap the MCP server as a LangChain DynamicTool

```typescript
import { DynamicTool } from "@langchain/core/tools";
import { ChatOpenAI } from "@langchain/openai";
import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

// ── Humanity4AI MCP client ────────────────────────────────────────────────────

async function createMcpClient(): Promise<Client> {
  const transport = new StdioClientTransport({
    command: "pnpm",
    args: ["--filter", "@humanity4ai/mcp-servers", "start"],
    cwd: "/path/to/project_human"
  });
  const client = new Client({ name: "langchain-adapter", version: "1.0" }, { capabilities: {} });
  await client.connect(transport);
  return client;
}

// ── Create a LangChain tool from any Humanity4AI MCP tool ─────────────────────

function createHumanity4AITool(
  client: Client,
  toolName: string,
  description: string
): DynamicTool {
  return new DynamicTool({
    name: toolName,
    description,
    func: async (inputJson: string) => {
      let args: Record<string, unknown>;
      try {
        args = JSON.parse(inputJson) as Record<string, unknown>;
      } catch {
        return JSON.stringify({ error: "Input must be a valid JSON object string" });
      }

      const result = await client.callTool({ name: toolName, arguments: args });

      // Surface boundary notice for audit purposes
      const text = result.content
        .filter((c: { type: string }) => c.type === "text")
        .map((c: { text: string }) => c.text)
        .join("\n");

      return text;
    }
  });
}

// ── Example: empathetic_reframe in a LangChain agent ─────────────────────────

async function main() {
  const client = await createMcpClient();

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
  const agent = await createOpenAIFunctionsAgent({ llm, tools, prompt: null! });
  const executor = new AgentExecutor({ agent, tools, verbose: true });

  const result = await executor.invoke({
    input: "A customer sent us: 'We cannot accept your excuse. This is unacceptable.' Please reframe it with empathy."
  });

  console.log(result.output);
  await client.close();
}

main().catch(console.error);
```

---

## General integration pattern (MCP SDK)

```typescript
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

export async function createHumanity4AIClient(projectRoot: string): Promise<Client> {
  const transport = new StdioClientTransport({
    command: "pnpm",
    args: ["--filter", "@humanity4ai/mcp-servers", "start"],
    cwd: projectRoot
  });
  const client = new Client({ name: "my-agent", version: "1.0" }, { capabilities: {} });
  await client.connect(transport);
  return client;
}

// List all available tools
const client = await createHumanity4AIClient("/path/to/project_human");
const { tools } = await client.listTools();
console.log(tools.map(t => t.name));

// Invoke a tool
const result = await client.callTool({
  name: "empathetic_reframe",
  arguments: { message: "Your request was denied.", tone: "warm" }
});
console.log(result.content);

await client.close();
```
