/**
 * Unit tests for mcp-servers/src/mcp-server.ts
 * Copyright (c) 2026 Ascent Partners Foundation. MIT License.
 */
import { describe, it, expect } from "vitest";
import {
  toMcpResult,
  handleWcagaaaCheck,
  handleRewriteDepressionSensitiveContent,
  handleSupportiveReply,
  handleCognitiveAccessibilityAudit,
  handleCulturalContextCheck,
  handleDeescalationPlan,
  handleEmpatheticReframe,
  handleGriefSupportResponse,
  handleNeurodiversityDesignCheck,
  handleAgeInclusiveDesignCheck,
  VERSION,
} from "../mcp-server.js";

// ── toMcpResult ───────────────────────────────────────────────────────────────

describe("toMcpResult", () => {
  it("MS-1: converts a successful result to a content array", () => {
    const result = toMcpResult({
      ok: true,
      data: {
        boundaryNotice: "non-clinical only",
        uncertainty: "low",
        assumptions: "none",
        output: { reply: "You are heard." },
      },
    });
    expect(result.isError).toBeUndefined();
    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe("text");
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.boundaryNotice).toBe("non-clinical only");
    expect(parsed.uncertainty).toBe("low");
  });

  it("MS-2: converts a failed result to an error response", () => {
    const result = toMcpResult({
      ok: false,
      error: "Unknown action: bad_action",
    });
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toBe("Unknown action: bad_action");
  });

  it("MS-3: VERSION is the expected semver string", () => {
    expect(VERSION).toMatch(/^\d+\.\d+\.\d+$/);
  });
});

// ── Tool handlers ─────────────────────────────────────────────────────────────

describe("handleWcagaaaCheck", () => {
  it("MS-4: returns ok result for a valid URL target", async () => {
    const result = await handleWcagaaaCheck({ target: "https://example.com", level: "AAA" });
    expect(result.isError).toBeUndefined();
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.output).toBeDefined();
  });

  it("MS-5: passes optional context when provided", async () => {
    const result = await handleWcagaaaCheck({
      target: "<button>Submit</button>",
      level: "AA",
      context: "checkout flow",
    });
    expect(result.isError).toBeUndefined();
  });

  it("MS-6: omits context when not provided", async () => {
    const result = await handleWcagaaaCheck({ target: "<p>Hello</p>", level: "A" });
    expect(result.isError).toBeUndefined();
  });
});

describe("handleRewriteDepressionSensitiveContent", () => {
  it("MS-7: rewrites text in rewrite mode", async () => {
    const result = await handleRewriteDepressionSensitiveContent({
      text: "Just try harder",
      mode: "rewrite",
    });
    expect(result.isError).toBeUndefined();
  });

  it("MS-8: audits text in audit mode", async () => {
    const result = await handleRewriteDepressionSensitiveContent({
      text: "You should be able to handle this",
      mode: "audit",
    });
    expect(result.isError).toBeUndefined();
  });

  it("MS-9: passes optional domain when provided", async () => {
    const result = await handleRewriteDepressionSensitiveContent({
      text: "Please enter your name",
      mode: "rewrite",
      domain: "healthcare",
    });
    expect(result.isError).toBeUndefined();
  });
});

describe("handleSupportiveReply", () => {
  it("MS-10: generates a reply for low risk", async () => {
    const result = await handleSupportiveReply({
      message: "I feel a bit down today",
      risk_level: "low",
    });
    expect(result.isError).toBeUndefined();
  });

  it("MS-11: generates a reply for medium risk", async () => {
    const result = await handleSupportiveReply({
      message: "I feel overwhelmed",
      risk_level: "medium",
    });
    expect(result.isError).toBeUndefined();
  });

  it("MS-12: generates a reply for high risk", async () => {
    const result = await handleSupportiveReply({
      message: "I don't want to be here anymore",
      risk_level: "high",
    });
    expect(result.isError).toBeUndefined();
  });

  it("MS-13: passes optional locale when provided", async () => {
    const result = await handleSupportiveReply({
      message: "I feel sad",
      risk_level: "low",
      locale: "fr",
    });
    expect(result.isError).toBeUndefined();
  });
});

describe("handleCognitiveAccessibilityAudit", () => {
  it("MS-14: audits plain text content", async () => {
    const result = await handleCognitiveAccessibilityAudit({
      content: "Click submit to proceed with your application.",
    });
    expect(result.isError).toBeUndefined();
  });

  it("MS-15: passes optional target_context when provided", async () => {
    const result = await handleCognitiveAccessibilityAudit({
      content: "Enter your date of birth",
      target_context: "elderly users",
    });
    expect(result.isError).toBeUndefined();
  });
});

describe("handleCulturalContextCheck", () => {
  it("MS-16: checks a message for a given audience", async () => {
    const result = await handleCulturalContextCheck({
      message: "Hello everyone",
      audience: "corporate",
    });
    expect(result.isError).toBeUndefined();
  });

  it("MS-17: passes optional region when provided", async () => {
    const result = await handleCulturalContextCheck({
      message: "Good luck!",
      audience: "Japanese business professionals",
      region: "Japan",
    });
    expect(result.isError).toBeUndefined();
  });

  it("MS-18: omits region when not provided", async () => {
    const result = await handleCulturalContextCheck({
      message: "Cheers!",
      audience: "global audience",
    });
    expect(result.isError).toBeUndefined();
  });
});

describe("handleDeescalationPlan", () => {
  it("MS-19: generates a plan for a low intensity situation", async () => {
    const result = await handleDeescalationPlan({
      situation: "minor billing dispute",
      intensity: "low",
    });
    expect(result.isError).toBeUndefined();
  });

  it("MS-20: generates a plan for a high intensity situation", async () => {
    const result = await handleDeescalationPlan({
      situation: "heated argument in public",
      intensity: "high",
    });
    expect(result.isError).toBeUndefined();
  });
});

describe("handleEmpatheticReframe", () => {
  it("MS-21: reframes a message with warm tone", async () => {
    const result = await handleEmpatheticReframe({
      message: "We cannot process your request",
      tone: "warm",
    });
    expect(result.isError).toBeUndefined();
  });

  it("MS-22: reframes a message with formal tone", async () => {
    const result = await handleEmpatheticReframe({
      message: "Your ticket has been closed",
      tone: "formal",
    });
    expect(result.isError).toBeUndefined();
  });

  it("MS-23: reframes a message with neutral tone", async () => {
    const result = await handleEmpatheticReframe({
      message: "We understand your frustration",
      tone: "neutral",
    });
    expect(result.isError).toBeUndefined();
  });
});

describe("handleGriefSupportResponse", () => {
  it("MS-24: generates a presence-mode response", async () => {
    const result = await handleGriefSupportResponse({
      message: "I lost my parent last week",
      support_mode: "presence",
    });
    expect(result.isError).toBeUndefined();
  });

  it("MS-25: generates a practical-mode response", async () => {
    const result = await handleGriefSupportResponse({
      message: "I don't know what to do next",
      support_mode: "practical",
    });
    expect(result.isError).toBeUndefined();
  });

  it("MS-26: generates a reflection-mode response", async () => {
    const result = await handleGriefSupportResponse({
      message: "I keep thinking about what could have been",
      support_mode: "reflection",
    });
    expect(result.isError).toBeUndefined();
  });
});

describe("handleNeurodiversityDesignCheck", () => {
  it("MS-27: audits a UI description without focus", async () => {
    const result = await handleNeurodiversityDesignCheck({
      ui_description: "A form with many fields and flashing animations",
    });
    expect(result.isError).toBeUndefined();
  });

  it("MS-28: passes optional focus array when provided", async () => {
    const result = await handleNeurodiversityDesignCheck({
      ui_description: "A dashboard with dense data tables",
      focus: ["ADHD", "dyslexia"],
    });
    expect(result.isError).toBeUndefined();
  });
});

describe("handleAgeInclusiveDesignCheck", () => {
  it("MS-29: audits a flow description without age_groups", async () => {
    const result = await handleAgeInclusiveDesignCheck({
      flow_description: "Account sign-up flow with CAPTCHA",
    });
    expect(result.isError).toBeUndefined();
  });

  it("MS-30: passes optional age_groups when provided", async () => {
    const result = await handleAgeInclusiveDesignCheck({
      flow_description: "Onboarding wizard",
      age_groups: ["children", "elderly"],
    });
    expect(result.isError).toBeUndefined();
  });
});

// ── All handlers return structured MCP content ────────────────────────────────

describe("All handlers return valid MCP content structure", () => {
  const allHandlers = [
    () => handleWcagaaaCheck({ target: "https://example.com", level: "AAA" }),
    () => handleRewriteDepressionSensitiveContent({ text: "Try harder", mode: "rewrite" }),
    () => handleSupportiveReply({ message: "I feel sad", risk_level: "low" }),
    () => handleCognitiveAccessibilityAudit({ content: "Click submit" }),
    () => handleCulturalContextCheck({ message: "Hello", audience: "global" }),
    () => handleDeescalationPlan({ situation: "dispute", intensity: "medium" }),
    () => handleEmpatheticReframe({ message: "We cannot help", tone: "warm" }),
    () => handleGriefSupportResponse({ message: "I lost someone", support_mode: "presence" }),
    () => handleNeurodiversityDesignCheck({ ui_description: "clean UI" }),
    () => handleAgeInclusiveDesignCheck({ flow_description: "sign-up flow" }),
  ];

  it("MS-31: all 10 handlers return content array with at least one text item", async () => {
    for (const handler of allHandlers) {
      const result = await handler();
      expect(result.content).toBeDefined();
      expect(result.content.length).toBeGreaterThan(0);
      expect(result.content[0].type).toBe("text");
    }
  });

  it("MS-32: all 10 handlers return parseable JSON in content text", async () => {
    for (const handler of allHandlers) {
      const result = await handler();
      expect(() => JSON.parse(result.content[0].text)).not.toThrow();
    }
  });

  it("MS-33: all 10 handlers include boundaryNotice in output", async () => {
    for (const handler of allHandlers) {
      const result = await handler();
      const parsed = JSON.parse(result.content[0].text);
      expect(parsed.boundaryNotice).toBeDefined();
      expect(typeof parsed.boundaryNotice).toBe("string");
    }
  });
});
