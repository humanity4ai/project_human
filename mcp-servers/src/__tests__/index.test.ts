/**
 * Unit tests for mcp-servers/src/index.ts
 * Copyright (c) 2026 Ascent Partners Foundation. MIT License.
 */
import { describe, it, expect } from "vitest";
import { actionContracts, validateContracts } from "../index.js";

const EXPECTED_ACTIONS = [
  "wcagaaa_check",
  "rewrite_depression_sensitive_content",
  "supportive_reply",
  "cognitive_accessibility_audit",
  "cultural_context_check",
  "deescalation_plan",
  "empathetic_reframe",
  "grief_support_response",
  "neurodiversity_design_check",
  "age_inclusive_design_check"
];

describe("actionContracts registry", () => {
  it("I-1: has exactly 10 entries", () => {
    expect(actionContracts).toHaveLength(10);
  });

  it("I-2: all action IDs are unique", () => {
    const actions = actionContracts.map(c => c.action);
    expect(new Set(actions).size).toBe(10);
  });

  it("I-3: all skill names are unique", () => {
    const skills = actionContracts.map(c => c.skill);
    expect(new Set(skills).size).toBe(10);
  });

  it("I-4: all inputSchemaPath values start with schemas/", () => {
    for (const c of actionContracts) {
      expect(c.inputSchemaPath).toMatch(/^schemas\//);
    }
  });

  it("I-5: all outputSchemaPath values start with schemas/", () => {
    for (const c of actionContracts) {
      expect(c.outputSchemaPath).toMatch(/^schemas\//);
    }
  });

  it("I-6: all expected action IDs are present", () => {
    const registered = actionContracts.map(c => c.action);
    for (const expected of EXPECTED_ACTIONS) {
      expect(registered).toContain(expected);
    }
  });

  it("I-7: all contracts have non-empty safetyBoundary", () => {
    for (const c of actionContracts) {
      expect(c.safetyBoundary.length).toBeGreaterThan(0);
    }
  });
});

describe("validateContracts", () => {
  it("I-8: returns the valid registry unchanged", () => {
    const result = validateContracts(actionContracts);
    expect(result).toHaveLength(actionContracts.length);
    expect(result[0]?.action).toBe(actionContracts[0]?.action);
  });

  it("I-9: throws on contract with empty skill string", () => {
    const invalid = [{ ...actionContracts[0]!, skill: "" }];
    expect(() => validateContracts(invalid)).toThrow();
  });
});
