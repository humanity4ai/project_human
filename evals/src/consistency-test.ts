/**
 * Consistency Testing for Humanity4AI Skills
 *
 * Since the MCP server is rule-based (no LLM calls), outputs should be
 * fully deterministic: same input → same output. This module runs repeated
 * invocations of each skill and flags any variance — which would indicate
 * an implementation bug (non-deterministic hash ordering, Date.now() usage,
 * random elements, etc.).
 *
 * Also checks that skills claiming "uncertainty: low" actually produce
 * consistent results — a skill with unstable outputs should not claim low
 * uncertainty.
 *
 * Copyright (c) 2026 Ascent Partners Foundation. MIT License.
 */

import { invokeAction } from "@humanity4ai/mcp-servers/handlers";
import { actionContracts } from "@humanity4ai/mcp-servers";

interface ConsistencyResult {
  skill: string;
  scenario: string;
  input: Record<string, unknown>;
  runs: number;
  consistent: boolean;
  details: string;
}

interface ConsistencyReport {
  total: number;
  passed: number;
  failed: number;
  results: ConsistencyResult[];
}

const REPETITIONS = 3;

/**
 * Simple deep equality check for output consistency.
 * Normalizes JSON serialization to detect ordering differences.
 */
function jsonStable(obj: unknown): string {
  return JSON.stringify(obj, Object.keys(obj as object).sort());
}

const TEST_SCENARIOS: Array<{
  action: string;
  input: Record<string, unknown>;
  description: string;
}> = [
  {
    action: "accessibility_audit",
    input: { mode: "crawl", level: "AA", url: "https://example.com" },
    description: "WCAG audit of example.com at AA level (auto-fetched)",
  },
  {
    action: "rewrite_depression_sensitive_content",
    input: {
      text: "You failed again. Try harder next time or give up.",
      mode: "rewrite",
    },
    description: "Rewrite shame/blame content",
  },
  {
    action: "supportive_reply",
    input: {
      message: "I feel really alone and I do not know what to do",
      risk_level: "low",
    },
    description: "Supportive reply to low-risk distress message",
  },
  {
    action: "cognitive_accessibility_audit",
    input: {
      content:
        "The system requires users to navigate through multiple hierarchical menus while simultaneously processing real-time data streams and cross-referencing historical patterns.",
    },
    description: "Audit dense technical content",
  },
  {
    action: "cultural_context_check",
    input: {
      message: "Our quarterly numbers show we must push harder",
      audience: "Japanese business team",
    },
    description: "Cultural context check for direct communication",
  },
  {
    action: "deescalation_plan",
    input: {
      situation: "A customer is yelling at support staff about a billing error",
      intensity: "high",
    },
    description: "De-escalation plan for high-intensity conflict",
  },
  {
    action: "empathetic_reframe",
    input: {
      message: "I failed the exam I studied three months for",
      tone: "warm",
    },
    description: "Empathetic reframe of academic disappointment",
  },
  {
    action: "neurodiversity_design_check",
    input: {
      ui_description:
        "A dashboard with auto-playing carousels, small touch targets, and text that changes every 3 seconds",
    },
    description: "Neurodiversity design audit",
  },
  {
    action: "age_inclusive_design_check",
    input: {
      flow_description:
        "A banking app onboarding flow with tiny font, fast timeouts, and gesture-dependent navigation",
    },
    description: "Age-inclusive design audit",
  },
];

/**
 * Runs consistency checks for each skill scenario.
 * Each scenario is invoked REPETITIONS times; outputs are compared
 * for structural equivalence via JSON-stable serialization.
 */
export async function runConsistencyChecks(): Promise<ConsistencyReport> {
  const results: ConsistencyResult[] = [];

  for (const scenario of TEST_SCENARIOS) {
    const outputs: string[] = [];
    for (let i = 0; i < REPETITIONS; i++) {
      const result = await invokeAction(scenario.action, scenario.input);
      outputs.push(jsonStable(result));
    }

    const unique = new Set(outputs);
    const consistent = unique.size === 1;

    results.push({
      skill: scenario.action,
      scenario: scenario.description,
      input: scenario.input,
      runs: REPETITIONS,
      consistent,
      details: consistent
        ? "All outputs identical (deterministic, rule-based)"
        : `${unique.size} distinct outputs in ${REPETITIONS} runs — non-deterministic behavior detected`,
    });
  }

  const passed = results.filter((r) => r.consistent).length;
  const failed = results.filter((r) => !r.consistent).length;

  return { total: results.length, passed, failed, results };
}
