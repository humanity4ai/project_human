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

import { readFileSync } from "node:fs";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { invokeAction } from "./handlers.js";
import { actionContracts } from "./index.js";

const pkg = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8")
) as { version: string };
export const VERSION: string = pkg.version;

function descFor(action: string): string {
  return actionContracts.find(c => c.action === action)?.description ?? "";
}

// ── Helper: convert invokeAction result to MCP CallToolResult ────────────────

export function toMcpResult(result: ReturnType<typeof invokeAction>) {
  if (!result.ok) {
    return {
      isError: true,
      content: [{ type: "text" as const, text: result.error }],
    };
  }
  const { action, boundaryNotice, uncertainty, assumptions, output } = result.data;
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(
          { action, boundaryNotice, uncertainty, assumptions, output },
          null,
          2
        ),
      },
    ],
  };
}

// ── Tool handlers (exported for testability) ─────────────────────────────────

export async function handleWcagaaaCheck({
  target,
  level,
  context,
}: {
  target: string;
  level: "A" | "AA" | "AAA";
  context?: string;
}) {
  const input: Record<string, unknown> = { target, level };
  if (context !== undefined) input.context = context;
  return toMcpResult(invokeAction("wcagaaa_check", input));
}

export async function handleRewriteDepressionSensitiveContent({
  text,
  mode,
  domain,
}: {
  text: string;
  mode: "audit" | "rewrite";
  domain?: string;
}) {
  const input: Record<string, unknown> = { text, mode };
  if (domain !== undefined) input.domain = domain;
  return toMcpResult(invokeAction("rewrite_depression_sensitive_content", input));
}

export async function handleSupportiveReply({
  message,
  risk_level,
  locale,
}: {
  message: string;
  risk_level: "low" | "medium" | "high";
  locale?: string;
}) {
  const input: Record<string, unknown> = { message, risk_level };
  if (locale !== undefined) input.locale = locale;
  return toMcpResult(invokeAction("supportive_reply", input));
}

export async function handleCognitiveAccessibilityAudit({
  content,
  target_context,
}: {
  content: string;
  target_context?: string;
}) {
  const input: Record<string, unknown> = { content };
  if (target_context !== undefined) input.target_context = target_context;
  return toMcpResult(invokeAction("cognitive_accessibility_audit", input));
}

export async function handleCulturalContextCheck({
  message,
  audience,
  region,
}: {
  message: string;
  audience: string;
  region?: string;
}) {
  const input: Record<string, unknown> = { message, audience };
  if (region !== undefined) input.region = region;
  return toMcpResult(invokeAction("cultural_context_check", input));
}

export async function handleDeescalationPlan({
  situation,
  intensity,
}: {
  situation: string;
  intensity: "low" | "medium" | "high";
}) {
  return toMcpResult(invokeAction("deescalation_plan", { situation, intensity }));
}

export async function handleEmpatheticReframe({
  message,
  tone,
}: {
  message: string;
  tone: "neutral" | "warm" | "formal";
}) {
  return toMcpResult(invokeAction("empathetic_reframe", { message, tone }));
}

export async function handleGriefSupportResponse({
  message,
  support_mode,
}: {
  message: string;
  support_mode: "presence" | "practical" | "reflection";
}) {
  return toMcpResult(invokeAction("grief_support_response", { message, support_mode }));
}

export async function handleNeurodiversityDesignCheck({
  ui_description,
  focus,
}: {
  ui_description: string;
  focus?: string[];
}) {
  const input: Record<string, unknown> = { ui_description };
  if (focus !== undefined) input.focus = focus;
  return toMcpResult(invokeAction("neurodiversity_design_check", input));
}

export async function handleAgeInclusiveDesignCheck({
  flow_description,
  age_groups,
}: {
  flow_description: string;
  age_groups?: string[];
}) {
  const input: Record<string, unknown> = { flow_description };
  if (age_groups !== undefined) input.age_groups = age_groups;
  return toMcpResult(invokeAction("age_inclusive_design_check", input));
}

// ── Server setup ─────────────────────────────────────────────────────────────

const server = new McpServer(
  {
    name: "humanity4ai",
    version: VERSION,
  },
  {
    capabilities: { tools: {} },
    instructions:
      "Humanity4AI provides reusable 'humanity skills' for AI agents. " +
      "Each tool enforces safety boundaries and discloses uncertainty. " +
      "Always surface the boundaryNotice and uncertainty fields to users. " +
      "These skills are non-clinical — escalate to qualified professionals when risk is elevated.",
  }
);

// ── Tool registrations ────────────────────────────────────────────────────────

server.tool(
  "wcagaaa_check",
  descFor("wcagaaa_check"),
  {
    target: z.string().describe("URL or HTML input to audit"),
    level: z
      .enum(["A", "AA", "AAA"])
      .default("AAA")
      .describe("WCAG compliance level to check against"),
    context: z
      .string()
      .optional()
      .describe("Optional additional context about the page or component"),
  },
  handleWcagaaaCheck
);

server.tool(
  "rewrite_depression_sensitive_content",
  descFor("rewrite_depression_sensitive_content"),
  {
    text: z.string().describe("The text content to audit or rewrite"),
    mode: z
      .enum(["audit", "rewrite"])
      .default("rewrite")
      .describe("'audit' returns issues found; 'rewrite' returns improved text"),
    domain: z
      .string()
      .optional()
      .describe("Optional domain context (e.g. 'healthcare', 'social media')"),
  },
  handleRewriteDepressionSensitiveContent
);

server.tool(
  "supportive_reply",
  descFor("supportive_reply"),
  {
    message: z.string().describe("The message from the person in distress"),
    risk_level: z
      .enum(["low", "medium", "high"])
      .describe(
        "Assessed risk level: 'low' for general distress, 'medium' for concerning signals, 'high' for crisis"
      ),
    locale: z
      .string()
      .optional()
      .default("en")
      .describe("BCP 47 locale code for the response language (default: 'en')"),
  },
  handleSupportiveReply
);

server.tool(
  "cognitive_accessibility_audit",
  descFor("cognitive_accessibility_audit"),
  {
    content: z
      .string()
      .describe("The text or UI content to audit for cognitive accessibility"),
    target_context: z
      .string()
      .optional()
      .describe(
        "Optional context about the target audience or use case (e.g. 'healthcare patients', 'elderly users')"
      ),
  },
  handleCognitiveAccessibilityAudit
);

server.tool(
  "cultural_context_check",
  descFor("cultural_context_check"),
  {
    message: z.string().describe("The message or content to check"),
    audience: z
      .string()
      .describe(
        "Description of the target audience (e.g. 'Japanese business professionals', 'Latin American families')"
      ),
    region: z
      .string()
      .optional()
      .describe("Optional geographic region for more specific cultural context"),
  },
  handleCulturalContextCheck
);

server.tool(
  "deescalation_plan",
  descFor("deescalation_plan"),
  {
    situation: z
      .string()
      .describe("Description of the conflict or tense situation"),
    intensity: z
      .enum(["low", "medium", "high"])
      .default("medium")
      .describe("Intensity of the conflict: 'low', 'medium', or 'high'"),
  },
  handleDeescalationPlan
);

server.tool(
  "empathetic_reframe",
  descFor("empathetic_reframe"),
  {
    message: z.string().describe("The message to reframe with empathy"),
    tone: z
      .enum(["neutral", "warm", "formal"])
      .default("warm")
      .describe("Desired tone of the empathetic reframe"),
  },
  handleEmpatheticReframe
);

server.tool(
  "grief_support_response",
  descFor("grief_support_response"),
  {
    message: z
      .string()
      .describe("The message from the person experiencing grief or loss"),
    support_mode: z
      .enum(["presence", "practical", "reflection"])
      .describe(
        "'presence' for emotional companionship, 'practical' for next steps, 'reflection' for meaning-making"
      ),
  },
  handleGriefSupportResponse
);

server.tool(
  "neurodiversity_design_check",
  descFor("neurodiversity_design_check"),
  {
    ui_description: z
      .string()
      .describe(
        "Description of the UI, interface, or interaction flow to audit"
      ),
    focus: z
      .array(z.string())
      .optional()
      .describe(
        "Optional list of specific neurodiversity conditions to focus on (e.g. ['ADHD', 'dyslexia'])"
      ),
  },
  handleNeurodiversityDesignCheck
);

server.tool(
  "age_inclusive_design_check",
  descFor("age_inclusive_design_check"),
  {
    flow_description: z
      .string()
      .describe(
        "Description of the user flow, interface, or product experience to audit"
      ),
    age_groups: z
      .array(z.string())
      .optional()
      .describe(
        "Optional list of age groups to focus on (e.g. ['children', 'elderly', 'teenagers'])"
      ),
  },
  handleAgeInclusiveDesignCheck
);

server.tool(
  "wcagaa_check",
  descFor("wcagaa_check"),
  {
    target: z.string().describe("URL or HTML input to audit for WCAG AA accessibility"),
    level: z
      .enum(["AA", "AAA"])
      .default("AA")
      .describe("WCAG compliance level"),
    locale: z
      .string()
      .optional()
      .default("en")
      .describe("BCP 47 locale code for localized output"),
  },
  async ({ target, level, locale }) => {
    return toMcpResult(invokeAction("wcagaa_check", { target, level, locale }));
  }
);

// ── Start server ──────────────────────────────────────────────────────────────

export async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  process.stderr.write(
    `Humanity4AI MCP Server v${VERSION} (JSON-RPC 2.0)\n` +
      `Tools: 11 registered\n` +
      `Transport: stdio (MCP SDK)\n` +
      `Ready — waiting for MCP client connections\n`
  );
}

/* istanbul ignore next */
if (process.env.NODE_ENV !== "test") {
  main().catch((err: unknown) => {
    process.stderr.write(`Fatal error: ${String(err)}\n`);
    process.exit(1);
  });
}
