/**
 * Unit tests for mcp-servers/src/validate.ts
 * Copyright (c) 2026 Ascent Partners Foundation. MIT License.
 */
import { describe, it, expect } from "vitest";
import { validateInput } from "../validate.js";

// ─── helpers ──────────────────────────────────────────────────────────────────

function makeSchema(
  required: string[],
  properties: Record<string, Record<string, unknown>>
): string {
  return JSON.stringify({
    $schema: "https://json-schema.org/draft/2020-12/schema",
    type: "object",
    required,
    properties,
    additionalProperties: false
  });
}

// ─── loadSchema (tested via validateInput behaviour) ──────────────────────────

describe("loadSchema via validateInput", () => {
  it("V-1: valid schema path loads and validates correctly", () => {
    const result = validateInput(
      "schemas/accessibility.input.json",
      { mode: "session", level: "AAA" }
    );
    expect(result.valid).toBe(true);
  });

  it("V-2: non-existent schema path returns valid:false with error", () => {
    const result = validateInput("schemas/does-not-exist.json", {});
    expect(result.valid).toBe(false);
  });

  it("V-3: malformed schema path returns valid:false with error", () => {
    const result = validateInput("schemas/../../../etc/passwd", {});
    expect(result.valid).toBe(false);
  });
});

// ─── validateField — type checks ─────────────────────────────────────────────

describe("validateField — type checks via validateInput", () => {
  it("V-4: string type — valid value passes", () => {
    const result = validateInput(
      "schemas/supportive-conversation.input.json",
      { message: "hello", risk_level: "low" }
    );
    expect(result.valid).toBe(true);
  });

  it("V-5: string type — number value fails", () => {
    const result = validateInput(
      "schemas/supportive-conversation.input.json",
      { message: 42, risk_level: "low" }
    );
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors.some(e => e.includes("'message'") && e.includes("string"))).toBe(true);
    }
  });

  it("V-6: enum valid value passes", () => {
    const result = validateInput(
      "schemas/conflict-de-escalation.input.json",
      { situation: "dispute", intensity: "medium" }
    );
    expect(result.valid).toBe(true);
  });

  it("V-7: enum invalid value fails with list of valid options", () => {
    const result = validateInput(
      "schemas/conflict-de-escalation.input.json",
      { situation: "dispute", intensity: "critical" }
    );
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors.some(e => e.includes("must be one of"))).toBe(true);
    }
  });

  it("V-8: array type — valid array passes", () => {
    const result = validateInput(
      "schemas/neurodiversity-aware-design.input.json",
      { ui_description: "animated dashboard", focus: ["adhd"] }
    );
    expect(result.valid).toBe(true);
  });

  it("V-9: array type — non-array value fails", () => {
    const result = validateInput(
      "schemas/neurodiversity-aware-design.input.json",
      { ui_description: "animated dashboard", focus: "adhd" }
    );
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors.some(e => e.includes("'focus'") && e.includes("array"))).toBe(true);
    }
  });
});

// ─── validateInput — required field checks ────────────────────────────────────

describe("validateInput — required field checks", () => {
  it("V-10: all required fields present returns valid:true", () => {
    const result = validateInput(
      "schemas/supportive-conversation.input.json",
      { message: "I feel overwhelmed", risk_level: "medium" }
    );
    expect(result.valid).toBe(true);
  });

  it("V-11: missing required field returns valid:false with error", () => {
    const result = validateInput(
      "schemas/supportive-conversation.input.json",
      { message: "hello" }
    );
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors.some(e => e.includes("'risk_level'"))).toBe(true);
    }
  });

  it("V-12: required field present but empty string is treated as missing", () => {
    const result = validateInput(
      "schemas/supportive-conversation.input.json",
      { message: "", risk_level: "low" }
    );
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors.some(e => e.includes("'message'"))).toBe(true);
    }
  });

  it("V-13: required field is null returns valid:false", () => {
    const result = validateInput(
      "schemas/supportive-conversation.input.json",
      { message: null as unknown as string, risk_level: "low" }
    );
    expect(result.valid).toBe(false);
  });

  it("V-14: required field is undefined returns valid:false", () => {
    const result = validateInput(
      "schemas/supportive-conversation.input.json",
      { message: undefined as unknown as string, risk_level: "low" }
    );
    expect(result.valid).toBe(false);
  });

  it("V-15: optional field wrong type returns valid:false", () => {
    const result = validateInput(
      "schemas/accessibility.input.json",
      { level: 42 as unknown as string }
    );
    // level has enum — will fail enum check
    expect(result.valid).toBe(false);
  });

  it("V-16: optional field absent — no error produced", () => {
    const result = validateInput(
      "schemas/accessibility.input.json",
      { mode: "session", level: "AAA" }
    );
    expect(result.valid).toBe(true);
  });

  it("V-17: multiple missing required fields — all reported", () => {
    const result = validateInput(
      "schemas/supportive-conversation.input.json",
      {}
    );
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("V-18: field with undefined value in input is skipped (no error)", () => {
    const result = validateInput(
      "schemas/accessibility.input.json",
      { target: "https://example.com", level: "AAA", context: undefined as unknown as string }
    );
    expect(result.valid).toBe(true);
  });
});

// ─── validateInput — wcag schema specifics ───────────────────────────────────

describe("validateInput — accessibility schema", () => {
  it("V-19: valid level AAA passes", () => {
    expect(validateInput("schemas/accessibility.input.json", { mode: "session", level: "AAA" }).valid).toBe(true);
  });

  it("V-20: valid level A passes", () => {
    expect(validateInput("schemas/accessibility.input.json", { mode: "session", level: "A" }).valid).toBe(true);
  });

  it("V-21: invalid level value fails", () => {
    const result = validateInput("schemas/accessibility.input.json", { mode: "session", level: "AAAA" });
    expect(result.valid).toBe(false);
  });

  it("V-22: missing required mode fails", () => {
    const result = validateInput("schemas/accessibility.input.json", { level: "AA" });
    expect(result.valid).toBe(false);
  });
});

// ─── validateInput — cultural-sensitivity schema ──────────────────────────────

describe("validateInput — cultural-sensitivity schema", () => {
  it("V-23: all required fields present passes", () => {
    const result = validateInput(
      "schemas/cultural-sensitivity.input.json",
      { message: "Hello", audience: "enterprise" }
    );
    expect(result.valid).toBe(true);
  });

  it("V-24: missing message fails", () => {
    const result = validateInput(
      "schemas/cultural-sensitivity.input.json",
      { audience: "enterprise" }
    );
    expect(result.valid).toBe(false);
  });
});

// ─── validateInput — supportive-conversation support_mode ─────────────────

describe("validateInput — supportive-conversation support_mode", () => {
  it("V-25: valid grief support_mode presence passes", () => {
    const result = validateInput(
      "schemas/supportive-conversation.input.json",
      { message: "I lost my parent", risk_level: "low", support_mode: "presence" }
    );
    expect(result.valid).toBe(true);
  });

  it("V-26: invalid support_mode fails enum check", () => {
    const result = validateInput(
      "schemas/supportive-conversation.input.json",
      { message: "I lost my parent", risk_level: "low", support_mode: "therapy" }
    );
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors.some(e => e.includes("must be one of"))).toBe(true);
    }
  });

  it("V-27: empty support_mode fails", () => {
    const result = validateInput(
      "schemas/supportive-conversation.input.json",
      { message: "x", risk_level: "low", support_mode: "" }
    );
    expect(result.valid).toBe(false);
  });
});
