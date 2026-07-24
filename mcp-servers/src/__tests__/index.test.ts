/**
 * Unit tests for mcp-servers/src/index.ts
 * Copyright (c) 2026 Ascent Partners Foundation. MIT License.
 */
import { describe, it, expect } from "vitest";
import { readdirSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { actionContracts, validateContracts } from "../index.js";

const EXPECTED_ACTIONS = [
  "accessibility_audit",
  "rewrite_depression_sensitive_content",
  "supportive_reply",
  "cognitive_accessibility_audit",
  "cultural_context_check",
  "deescalation_plan",
  "empathetic_reframe",
  "neurodiversity_design_check",
  "age_inclusive_design_check"
];

describe("actionContracts registry", () => {
  it("I-1: has exactly 9 entries", () => {
    expect(actionContracts).toHaveLength(9);
  });

  it("I-2: all action IDs are unique", () => {
    const actions = actionContracts.map(c => c.action);
    expect(new Set(actions).size).toBe(9);
  });

  it("I-3: all skill names are unique", () => {
    const skills = actionContracts.map(c => c.skill);
    expect(new Set(skills).size).toBe(9);
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

describe("schema-consistency (F-002 drift guard)", () => {
  const SCHEMAS_DIR = resolve("schemas");

  it("I-10: every inputSchemaPath references an existing file", () => {
    for (const c of actionContracts) {
      statSync(c.inputSchemaPath);
    }
  });

  it("I-11: every outputSchemaPath references an existing file", () => {
    for (const c of actionContracts) {
      statSync(c.outputSchemaPath);
    }
  });

  it("I-12: every .input.json in schemas/ has a registered contract", () => {
    const entries = readdirSync(SCHEMAS_DIR, { withFileTypes: true })
      .filter((e) => e.isFile() && e.name.endsWith(".input.json"))
      .map((e) => `schemas/${e.name}`);
    for (const path of entries) {
      expect(actionContracts.some((c) => c.inputSchemaPath === path)).toBe(
        true
      );
    }
  });

  it("I-13: every .output.json in schemas/ has a registered contract", () => {
    const entries = readdirSync(SCHEMAS_DIR, { withFileTypes: true })
      .filter((e) => e.isFile() && e.name.endsWith(".output.json"))
      .map((e) => `schemas/${e.name}`);
    for (const path of entries) {
      expect(actionContracts.some((c) => c.outputSchemaPath === path)).toBe(
        true
      );
    }
  });

  it("I-14: schema file count matches contract count (9 inputs + 9 outputs)", () => {
    const inputs = readdirSync(SCHEMAS_DIR, { withFileTypes: true }).filter(
      (e) => e.isFile() && e.name.endsWith(".input.json")
    );
    const outputs = readdirSync(SCHEMAS_DIR, { withFileTypes: true }).filter(
      (e) => e.isFile() && e.name.endsWith(".output.json")
    );
    expect(inputs.length).toBe(9);
    expect(outputs.length).toBe(9);
    expect(actionContracts.length).toBe(9);
  });
});
