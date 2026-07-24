/**
 * Humanity4AI Shared Server Factory
 *
 * Creates and configures an McpServer with all 9 humanity skills registered.
 * Shared by the stdio entry point (mcp-server.ts) and the HTTP/Vercel entry point
 * (api/mcp.ts). Does NOT connect a transport — callers do that.
 *
 * Copyright (c) 2026 Ascent Partners Foundation. MIT License.
 */

import { readFileSync } from "node:fs";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { invokeAction } from "./handlers.js";
import { actionContracts, validateContracts } from "./index.js";
import { SERVER_INSTRUCTIONS } from "./instructions.js";

const pkg = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8")
) as { version: string };
export const VERSION: string = pkg.version;

export function descFor(action: string): string {
  return (
    actionContracts.find((c) => c.action === action)?.description ?? ""
  );
}

export function toMcpResult(
  result: Awaited<ReturnType<typeof invokeAction>>
) {
  if (!result.ok) {
    return {
      isError: true,
      content: [{ type: "text" as const, text: result.error }],
    };
  }
  const json = JSON.stringify(result.data, null, 2);
  return {
    content: [{ type: "text" as const, text: json }],
  };
}

// ── Handler wrappers ──────────────────────────────────────────────────────────

export async function handleAccessibilityAudit(args: {
  mode: string;
  level?: string;
  pages?: { url: string; html: string }[];
  locale?: string;
}) {
  const input: Record<string, unknown> = { mode: args.mode };
  if (args.level !== undefined) input.level = args.level;
  if (args.pages !== undefined) input.pages = args.pages;
  if (args.locale !== undefined) input.locale = args.locale;
  return toMcpResult(await invokeAction("accessibility_audit", input));
}

export async function handleRewriteDepressionSensitiveContent(args: {
  text: string;
  mode?: string;
  domain?: string;
}) {
  const input: Record<string, unknown> = { text: args.text };
  if (args.mode !== undefined) input.mode = args.mode;
  if (args.domain !== undefined) input.domain = args.domain;
  return toMcpResult(
    await invokeAction("rewrite_depression_sensitive_content", input)
  );
}

export async function handleSupportiveReply(args: {
  message: string;
  risk_level: string;
  locale?: string;
  support_mode?: string;
}) {
  const input: Record<string, unknown> = {
    message: args.message,
    risk_level: args.risk_level,
  };
  if (args.locale !== undefined) input.locale = args.locale;
  if (args.support_mode !== undefined) input.support_mode = args.support_mode;
  return toMcpResult(await invokeAction("supportive_reply", input));
}

export async function handleCognitiveAccessibilityAudit(args: {
  content: string;
  target_context?: string;
}) {
  const input: Record<string, unknown> = { content: args.content };
  if (args.target_context !== undefined)
    input.target_context = args.target_context;
  return toMcpResult(
    await invokeAction("cognitive_accessibility_audit", input)
  );
}

export async function handleCulturalContextCheck(args: {
  message: string;
  audience: string;
  region?: string;
}) {
  const input: Record<string, unknown> = {
    message: args.message,
    audience: args.audience,
  };
  if (args.region !== undefined) input.region = args.region;
  return toMcpResult(await invokeAction("cultural_context_check", input));
}

export async function handleDeescalationPlan(args: {
  situation: string;
  intensity?: string;
}) {
  const input: Record<string, unknown> = { situation: args.situation };
  if (args.intensity !== undefined) input.intensity = args.intensity;
  return toMcpResult(await invokeAction("deescalation_plan", input));
}

export async function handleEmpatheticReframe(args: {
  message: string;
  tone?: string;
}) {
  const input: Record<string, unknown> = { message: args.message };
  if (args.tone !== undefined) input.tone = args.tone;
  return toMcpResult(await invokeAction("empathetic_reframe", input));
}

export async function handleNeurodiversityDesignCheck(args: {
  ui_description: string;
  focus?: string[];
}) {
  const input: Record<string, unknown> = { ui_description: args.ui_description };
  if (args.focus !== undefined) input.focus = args.focus;
  return toMcpResult(
    await invokeAction("neurodiversity_design_check", input)
  );
}

export async function handleAgeInclusiveDesignCheck(args: {
  flow_description: string;
  age_groups?: string[];
}) {
  const input: Record<string, unknown> = {
    flow_description: args.flow_description,
  };
  if (args.age_groups !== undefined) input.age_groups = args.age_groups;
  return toMcpResult(
    await invokeAction("age_inclusive_design_check", input)
  );
}

// ── Factory ───────────────────────────────────────────────────────────────────

export function createServer(): McpServer {
  validateContracts(actionContracts);

  const server = new McpServer(
    { name: "humanity4ai", version: VERSION },
    { capabilities: { tools: {} }, instructions: SERVER_INSTRUCTIONS }
  );

  server.tool(
    "accessibility_audit",
    descFor("accessibility_audit"),
    {
      mode: z
        .enum(["crawl", "session"])
        .describe(
          "crawl: score pages against all 86 WCAG 2.2 criteria. session: return WCAG checklist for this session."
        ),
      level: z
        .enum(["A", "AA", "AAA"])
        .default("AA")
        .describe("WCAG conformance level"),
      pages: z
        .array(z.object({ url: z.string(), html: z.string() }))
        .optional()
        .describe("Array of crawled pages (required for crawl mode)"),
      locale: z
        .string()
        .optional()
        .default("en")
        .describe("BCP 47 locale code"),
    },
    handleAccessibilityAudit
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
        .describe("BCP 47 locale code for the response language"),
      support_mode: z
        .enum(["general", "presence", "practical", "reflection"])
        .optional()
        .default("general")
        .describe("Support mode: 'general' for default emotional support"),
    },
    handleSupportiveReply
  );

  server.tool(
    "cognitive_accessibility_audit",
    descFor("cognitive_accessibility_audit"),
    {
      content: z.string().describe("The text or UI content to audit"),
      target_context: z
        .string()
        .optional()
        .describe("Optional context about the target audience or use case"),
    },
    handleCognitiveAccessibilityAudit
  );

  server.tool(
    "cultural_context_check",
    descFor("cultural_context_check"),
    {
      message: z.string().describe("The message or content to check"),
      audience: z.string().describe("Target audience description"),
      region: z
        .string()
        .optional()
        .describe("Optional geographic region for more specific context"),
    },
    handleCulturalContextCheck
  );

  server.tool(
    "deescalation_plan",
    descFor("deescalation_plan"),
    {
      situation: z.string().describe("Description of the conflict or tense situation"),
      intensity: z
        .enum(["low", "medium", "high"])
        .optional()
        .default("medium")
        .describe("Intensity of the conflict"),
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
        .optional()
        .default("warm")
        .describe("Desired tone of the empathetic reframe"),
    },
    handleEmpatheticReframe
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
          "Optional list of specific neurodiversity conditions to focus on"
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

  return server;
}
