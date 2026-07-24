/**
 * Humanity4AI MCP Server — JSON-RPC 2.0 over stdio
 *
 * Implements the official Model Context Protocol (MCP) SDK JSON-RPC 2.0
 * protocol, making all Humanity4AI skills natively accessible to standard
 * MCP-compatible AI agents (Claude Code, Copilot, Manus AI, OpenCode,
 * LangChain, and any other MCP SDK client).
 *
 * Protocol: @modelcontextprotocol/sdk (JSON-RPC 2.0 over stdio)
 *
 * Usage:
 *   pnpm start
 *   npx -y @humanity4ai/mcp-servers
 *
 * Copyright (c) 2026 Ascent Partners Foundation. MIT License.
 */

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createServer, VERSION } from "./server-factory.js";

// Re-export for test compatibility
export {
  toMcpResult,
  handleAccessibilityAudit,
  handleRewriteDepressionSensitiveContent,
  handleSupportiveReply,
  handleCognitiveAccessibilityAudit,
  handleCulturalContextCheck,
  handleDeescalationPlan,
  handleEmpatheticReframe,
  handleNeurodiversityDesignCheck,
  handleAgeInclusiveDesignCheck,
} from "./server-factory.js";
export { VERSION };

// ── Start server (stdio transport — covered by integration tests) ────────────

/* istanbul ignore next */
export async function main(): Promise<void> {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  process.stderr.write(
    `Humanity4AI MCP Server v${VERSION} (JSON-RPC 2.0)\n` +
      `Tools: 9 registered\n` +
      `Transport: stdio (MCP SDK)\n` +
      `Ready — waiting for MCP client connections\n`
  );
}

/* istanbul ignore next */
// Design decision (F-004): auto-run on import guarded by NODE_ENV !== "test".
// The bin.ts entry point also imports this file — the guard prevents double-start
// (the double-start bug was fixed in PR #151). The alternative (explicit CLI entry
// only) would break `pnpm start` (tsx src/mcp-server.ts). The current pattern works
// and is documented in AGENTS.md.
if (process.env.NODE_ENV !== "test") {
  main().catch((err: unknown) => {
    process.stderr.write(`Fatal error: ${String(err)}\n`);
    process.exit(1);
  });
}
