#!/usr/bin/env node
/**
 * Humanity4AI MCP Server — npx entry point
 *
 * This file is the binary entry point for the npm package.
 * It starts the standard MCP SDK server (JSON-RPC 2.0 over stdio).
 *
 * Usage:
 *   npx -y @humanity4ai/mcp-servers
 *
 * Copyright (c) 2026 Ascent Partners Foundation. MIT License.
 */
import { main } from "./mcp-server.js";

main().catch((err: unknown) => {
  process.stderr.write(`Fatal error: ${String(err)}\n`);
  process.exit(1);
});
