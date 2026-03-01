/**
 * Unit tests for evals/src/run-evals.ts
 * Copyright (c) 2026 Ascent Partners Foundation. MIT License.
 */
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { existsSync, mkdirSync, rmSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

import {
  countScenarioIds,
  evaluateSkill,
  evaluateContractConsistency,
  writeMarkdownReport,
  VALID_CATEGORIES,
  ESCALATION_REQUIRED_SKILLS,
  type EvalResult
} from "../run-evals.js";

// ─── path helpers ─────────────────────────────────────────────────────────────

const __dirname = dirname(fileURLToPath(import.meta.url));
const FIXTURES = join(__dirname, "..", "..", "fixtures");
// __dirname = evals/src/__tests__  →  ../../.. = project_human
const REPO_ROOT = join(__dirname, "..", "..", "..");

// ─── countScenarioIds ─────────────────────────────────────────────────────────

describe("countScenarioIds", () => {
  it("E-1: counts 10 YAML scenarios correctly", () => {
    const yaml = `scenarios:\n${Array.from({ length: 10 }, (_, i) => `  - id: s-${i + 1}\n    prompt: Scenario ${i + 1}`).join("\n")}`;
    expect(countScenarioIds(yaml)).toBe(10);
  });

  it("E-2: counts 5 scenarios", () => {
    const yaml = `scenarios:\n${Array.from({ length: 5 }, (_, i) => `  - id: s-${i + 1}\n    prompt: Scenario ${i + 1}`).join("\n")}`;
    expect(countScenarioIds(yaml)).toBe(5);
  });

  it("E-3: counts 0 for empty scenarios list", () => {
    expect(countScenarioIds("scenarios: []")).toBe(0);
  });

  it("E-4: returns 0 for empty string", () => {
    expect(countScenarioIds("")).toBe(0);
  });

  it("E-5: parses valid YAML and returns correct count", () => {
    const content = "scenarios:\n  - id: s1\n    prompt: test\n  - id: s2\n    prompt: test";
    expect(countScenarioIds(content)).toBe(2);
  });
});

// ─── evaluateSkill — fixture tests ───────────────────────────────────────────

describe("evaluateSkill — fixture tests", () => {
  it("E-6: valid-skill fixture passes all checks", () => {
    const result = evaluateSkill(join(FIXTURES, "valid-skill"));
    expect(result.pass).toBe(true);
    expect(result.issues).toHaveLength(0);
  });

  it("E-7: valid-skill has correct skill name", () => {
    const result = evaluateSkill(join(FIXTURES, "valid-skill"));
    expect(result.skill).toBe("valid-skill");
  });

  it("E-8: valid-skill has no rubric issues", () => {
    const result = evaluateSkill(join(FIXTURES, "valid-skill"));
    expect(result.issues.some(i => i.includes("Rubric"))).toBe(false);
  });

  it("E-9: invalid-missing-files reports 5 missing files", () => {
    const result = evaluateSkill(join(FIXTURES, "invalid-missing-files"));
    expect(result.pass).toBe(false);
    const missingFileIssues = result.issues.filter(i => i.startsWith("Missing file:"));
    expect(missingFileIssues.length).toBe(5);
  });

  it("E-10: invalid-missing-files does not pass", () => {
    const result = evaluateSkill(join(FIXTURES, "invalid-missing-files"));
    expect(result.pass).toBe(false);
  });

  it("E-11: invalid-few-scenarios reports scenario count issue", () => {
    const result = evaluateSkill(join(FIXTURES, "invalid-few-scenarios"));
    expect(result.pass).toBe(false);
    expect(result.issues.some(i => i.includes("Scenario count too low"))).toBe(true);
  });

  it("E-12: invalid-few-scenarios reports exactly 5 scenarios found", () => {
    const result = evaluateSkill(join(FIXTURES, "invalid-few-scenarios"));
    expect(result.issues.some(i => i.includes("5"))).toBe(true);
  });

  it("E-13: invalid-bad-rubric reports missing Harm avoidance", () => {
    const result = evaluateSkill(join(FIXTURES, "invalid-bad-rubric"));
    expect(result.pass).toBe(false);
    expect(result.issues.some(i => i.includes("Harm avoidance"))).toBe(true);
  });

  it("E-14: invalid-bad-rubric does not report Helpfulness, Humility, or Clarity as missing", () => {
    const result = evaluateSkill(join(FIXTURES, "invalid-bad-rubric"));
    expect(result.issues.some(i => i.includes("Helpfulness"))).toBe(false);
    expect(result.issues.some(i => i.includes("Humility"))).toBe(false);
    expect(result.issues.some(i => i.includes("Clarity"))).toBe(false);
  });

  it("E-15: invalid-bad-category reports invalid category", () => {
    const result = evaluateSkill(join(FIXTURES, "invalid-bad-category"));
    expect(result.pass).toBe(false);
    expect(result.issues.some(i => i.includes("Invalid category") || i.includes("humane-interaction"))).toBe(true);
  });

  it("E-16: invalid-no-escalation reports escalation requirement", () => {
    const result = evaluateSkill(join(FIXTURES, "invalid-no-escalation"));
    expect(result.pass).toBe(false);
    expect(result.issues.some(i => i.toLowerCase().includes("escalat"))).toBe(true);
  });

  it("E-17: invalid-no-escalation is in the ESCALATION_REQUIRED_SKILLS set", () => {
    // The fixture is named "supportive-conversation" inside skill.yaml
    expect(ESCALATION_REQUIRED_SKILLS.has("supportive-conversation")).toBe(true);
  });

  it("E-18: valid-skill category is in VALID_CATEGORIES", () => {
    expect(VALID_CATEGORIES.has("communication")).toBe(true);
  });

  it("E-19: invalid category is not in VALID_CATEGORIES", () => {
    expect(VALID_CATEGORIES.has("humane-interaction")).toBe(false);
  });

  it("E-20: all 10 valid taxonomy slugs are in VALID_CATEGORIES", () => {
    const expected = [
      "accessibility", "emotional-safety", "communication", "cognitive-support",
      "cultural-context", "conflict-navigation", "inclusive-design", "lifecycle-support",
      "neurodiversity", "age-inclusion"
    ];
    for (const slug of expected) {
      expect(VALID_CATEGORIES.has(slug), `${slug} should be valid`).toBe(true);
    }
    expect(VALID_CATEGORIES.size).toBe(10);
  });
});

// ─── evaluateContractConsistency ──────────────────────────────────────────────

describe("evaluateContractConsistency — real corpus", () => {
  const skillsRoot = join(REPO_ROOT, "skills");

  it("E-21: contracts.json exists in mcp-servers/src", () => {
    const contractsPath = join(REPO_ROOT, "mcp-servers", "src", "contracts.json");
    expect(existsSync(contractsPath)).toBe(true);
  });

  it("E-22: contract-consistency passes against real skill corpus", () => {
    const result = evaluateContractConsistency(skillsRoot, REPO_ROOT);
    expect(result.pass).toBe(true);
    expect(result.issues).toHaveLength(0);
  });

  it("E-23: result skill name is contract-consistency", () => {
    const result = evaluateContractConsistency(skillsRoot, REPO_ROOT);
    expect(result.skill).toBe("contract-consistency");
  });

  it("E-24: returns fail with message when contracts.json is missing", () => {
    const fakeRoot = join(tmpdir(), `no-contracts-${Date.now()}`);
    mkdirSync(join(fakeRoot, "mcp-servers", "src"), { recursive: true });
    mkdirSync(join(fakeRoot, "skills"), { recursive: true });
    const result = evaluateContractConsistency(join(fakeRoot, "skills"), fakeRoot);
    expect(result.pass).toBe(false);
    expect(result.issues.some(i => i.includes("build:contracts") || i.includes("Cannot read"))).toBe(true);
    rmSync(fakeRoot, { recursive: true });
  });

  it("E-25: all 10 real skills have matching contracts", () => {
    const result = evaluateContractConsistency(skillsRoot, REPO_ROOT);
    // If any skill is missing a contract, it will be in the issues
    expect(result.issues.some(i => i.includes("No MCP contract found"))).toBe(false);
  });

  it("E-26: all input schema files referenced in contracts exist", () => {
    const result = evaluateContractConsistency(skillsRoot, REPO_ROOT);
    expect(result.issues.some(i => i.includes("Invalid or missing JSON schema (input)"))).toBe(false);
  });

  it("E-27: all output schema files referenced in contracts exist and are valid JSON", () => {
    const result = evaluateContractConsistency(skillsRoot, REPO_ROOT);
    expect(result.issues.some(i => i.includes("Invalid or missing JSON schema (output)"))).toBe(false);
  });
});

// ─── writeMarkdownReport ──────────────────────────────────────────────────────

describe("writeMarkdownReport", () => {
  let tmpDir: string;
  let reportPath: string;

  beforeEach(() => {
    tmpDir = join(tmpdir(), `eval-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    reportPath = join(tmpDir, "reports", "test.md");
  });

  afterEach(() => {
    if (existsSync(tmpDir)) rmSync(tmpDir, { recursive: true });
  });

  it("E-28: creates file at given path", () => {
    writeMarkdownReport([{ skill: "test-skill", pass: true, issues: [] }], reportPath);
    expect(existsSync(reportPath)).toBe(true);
  });

  it("E-29: creates parent directory if absent", () => {
    writeMarkdownReport([{ skill: "test-skill", pass: true, issues: [] }], reportPath);
    expect(existsSync(dirname(reportPath))).toBe(true);
  });

  it("E-30: PASS results appear as ### PASS heading", () => {
    writeMarkdownReport([{ skill: "my-skill", pass: true, issues: [] }], reportPath);
    const content = readFileSync(reportPath, "utf8");
    expect(content).toContain("### PASS");
    expect(content).toContain("`my-skill`");
  });

  it("E-31: FAIL results appear with issue list", () => {
    writeMarkdownReport([
      { skill: "bad-skill", pass: false, issues: ["Missing file: SKILL.md", "Scenario count too low"] }
    ], reportPath);
    const content = readFileSync(reportPath, "utf8");
    expect(content).toContain("### FAIL");
    expect(content).toContain("Missing file: SKILL.md");
    expect(content).toContain("Scenario count too low");
  });

  it("E-32: header contains correct pass and fail counts", () => {
    const results: EvalResult[] = [
      { skill: "a", pass: true, issues: [] },
      { skill: "b", pass: true, issues: [] },
      { skill: "c", pass: true, issues: [] },
      { skill: "d", pass: false, issues: ["issue"] },
      { skill: "e", pass: false, issues: ["issue"] }
    ];
    writeMarkdownReport(results, reportPath);
    const content = readFileSync(reportPath, "utf8");
    expect(content).toContain("**Passed:** 3");
    expect(content).toContain("**Failed:** 2");
    expect(content).toContain("**Skills checked:** 5");
  });
});
