/**
 * Humanity4AI MCP Server — Streamable HTTP (Vercel Function)
 *
 * Serverless Vercel function that serves the Humanity4AI MCP server over HTTP.
 * Uses Stateless Streamable HTTP transport — each request creates a fresh
 * transport session. Compatible with Vercel's serverless model (cold starts,
 * per-request isolation).
 *
 * Deploy: push to GitHub, connect Vercel, configure root to `mcp-servers/`
 *
 * Copyright (c) 2026 Ascent Partners Foundation. MIT License.
 */
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createServer } from "../src/server-factory.js";
import type { IncomingMessage, ServerResponse } from "node:http";

// Module-level server — created once per cold start, reused across invocations
let cachedServer: ReturnType<typeof createServer> | null = null;

function getServer(): ReturnType<typeof createServer> {
  if (!cachedServer) {
    cachedServer = createServer();
  }
  return cachedServer;
}

/**
 * Vercel Function handler — matches Vercel's (req, res) API.
 *
 * Uses stateless Streamable HTTP (sessionIdGenerator: undefined).
 * Each request creates a fresh transport, connected to the cached server.
 */
export default async function handler(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  const server = getServer();
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined, // stateless — Vercel safe
  });

  await server.connect(transport);

  // Vercel auto-parses JSON bodies for POST requests
  const body: Record<string, unknown> | undefined = (
    req as Record<string, unknown>
  ).body as Record<string, unknown> | undefined;

  await transport.handleRequest(req, res, body);
}
