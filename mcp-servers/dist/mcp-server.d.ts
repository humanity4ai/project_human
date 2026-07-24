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
import { VERSION } from "./server-factory.js";
export { toMcpResult, handleAccessibilityAudit, handleRewriteDepressionSensitiveContent, handleSupportiveReply, handleCognitiveAccessibilityAudit, handleCulturalContextCheck, handleDeescalationPlan, handleEmpatheticReframe, handleNeurodiversityDesignCheck, handleAgeInclusiveDesignCheck, } from "./server-factory.js";
export { VERSION };
export declare function main(): Promise<void>;
//# sourceMappingURL=mcp-server.d.ts.map