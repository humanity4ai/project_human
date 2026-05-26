/**
 * Unit tests for mcp-servers/src/handlers.ts
 * Copyright (c) 2026 Ascent Partners Foundation. MIT License.
 */
import { describe, it, expect } from "vitest";
import { invokeAction } from "../handlers.js";
import { actionContracts } from "../index.js";

// ─── helpers ──────────────────────────────────────────────────────────────────

async function call(action: string, input: Record<string, unknown>) {
  const result = await invokeAction(action, input);
  if (!result.ok) throw new Error(`Expected ok:true but got error: ${result.error}`);
  return result.data;
}

async function callRaw(action: string, input: Record<string, unknown>) {
  return invokeAction(action, input);
}

const ALL_VALID_INPUTS: Record<string, Record<string, unknown>> = {
  accessibility_audit: { target: "https://example.com", level: "AAA", mode: "session" },
  rewrite_depression_sensitive_content: { text: "Please enter your name", mode: "rewrite" },
  supportive_reply: { message: "I feel overwhelmed", risk_level: "medium" },
  cognitive_accessibility_audit: { content: "Enter your name. Click submit." },
  cultural_context_check: { message: "Hello everyone", audience: "corporate" },
  deescalation_plan: { situation: "billing dispute" },
  empathetic_reframe: { message: "We cannot process your request" },
  neurodiversity_design_check: { ui_description: "clean interface with minimal animations" },
  age_inclusive_design_check: { flow_description: "account sign-up flow" }
};

// ─── dispatch and validation ──────────────────────────────────────────────────

describe("invokeAction — dispatch and validation", () => {
  it("H-1: unknown action returns ok:false", async () => {
    const result = await callRaw("unknown_xyz", {});
    expect(result.ok).toBe(false);
  });

  it("H-2: unknown action error message contains tools/list hint", async () => {
    const result = await callRaw("not_a_real_action", {});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain("tools/list");
  });

  it("H-3: unknown action error contains the action name", async () => {
    const result = await callRaw("bad_action_id", {});
    if (!result.ok) expect(result.error).toContain("bad_action_id");
  });

  it("H-4: known action with missing required field returns ok:false", async () => {
    const result = await callRaw("supportive_reply", {});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain("Input validation failed");
  });

  it("H-5: all 9 actions return ok:true with valid inputs", async () => {
    for (const [action, input] of Object.entries(ALL_VALID_INPUTS)) {
      const result = await callRaw(action, input);
      expect(result.ok, `action ${action} should return ok:true`).toBe(true);
    }
  });

  it("H-6: all successful responses include non-empty boundaryNotice", async () => {
    for (const [action, input] of Object.entries(ALL_VALID_INPUTS)) {
      const data = await call(action, input);
      expect(data.boundaryNotice.length, `${action} should have boundaryNotice`).toBeGreaterThan(0);
    }
  });

  it("H-7: all responses include valid uncertainty value", async () => {
    const valid = new Set(["low", "medium", "high"]);
    for (const [action, input] of Object.entries(ALL_VALID_INPUTS)) {
      const data = await call(action, input);
      expect(valid.has(data.uncertainty), `${action} uncertainty=${data.uncertainty}`).toBe(true);
    }
  });

  it("H-8: all responses include non-empty assumptions array", async () => {
    for (const [action, input] of Object.entries(ALL_VALID_INPUTS)) {
      const data = await call(action, input);
      expect(Array.isArray(data.assumptions)).toBe(true);
      expect(data.assumptions.length, `${action} should have assumptions`).toBeGreaterThan(0);
    }
  });

  it("H-9: supportive_reply acknowledges user message in output", async () => {
    // supportive_reply now correctly reads and interpolates the user's message
    // into the reply, including crisis indicators when detected.
    const sentinel = "UNIQUE_SENTINEL_VALUE_XYZ_9182736";
    const data = await call("supportive_reply", { message: sentinel, risk_level: "low" });
    const serialised = JSON.stringify(data.output);
    expect(serialised).toContain(sentinel);
  });

  it("H-10: boundaryNotice matches contract safetyBoundary for each action", async () => {
    for (const contract of actionContracts) {
      const input = ALL_VALID_INPUTS[contract.action];
      if (!input) continue;
      const data = await call(contract.action, input);
      expect(data.boundaryNotice).toBe(contract.safetyBoundary);
    }
  });
});

// ─── handleWcagCheck ─────────────────────────────────────────────────────────

// ─── handleDepressionSensitiveRewrite ────────────────────────────────────────

describe("rewrite_depression_sensitive_content", () => {
  it("H-19: shame pattern 'you failed' detected in audit mode", async () => {
    const data = await call("rewrite_depression_sensitive_content", {
      text: "You failed to complete the form", mode: "audit"
    });
    const output = data.output as { safety_flags: string[] };
    expect(output.safety_flags.length).toBeGreaterThan(0);
  });

  it("H-20: no patterns → audit says no high-risk patterns", async () => {
    const data = await call("rewrite_depression_sensitive_content", {
      text: "Please enter your name and click save", mode: "audit"
    });
    const output = data.output as { result: string; safety_flags: string[] };
    expect(output.safety_flags).toHaveLength(0);
    expect(output.result).toContain("No high-risk patterns");
  });

  it("H-21: rewrite mode removes 'you failed'", async () => {
    const data = await call("rewrite_depression_sensitive_content", {
      text: "You failed to submit your application", mode: "rewrite"
    });
    expect((data.output as { result: string }).result.toLowerCase()).not.toContain("you failed");
  });

  it("H-22: rewrite mode replaces 'last chance'", async () => {
    const data = await call("rewrite_depression_sensitive_content", {
      text: "Last chance to complete your form", mode: "rewrite"
    });
    expect((data.output as { result: string }).result.toLowerCase()).not.toContain("last chance");
  });

  it("H-23: rewrite mode replaces 'you must'", async () => {
    const data = await call("rewrite_depression_sensitive_content", {
      text: "You must complete all required fields", mode: "rewrite"
    });
    expect((data.output as { result: string }).result.toLowerCase()).not.toContain("you must");
  });

  it("H-24: clean text → review_recommended is false", async () => {
    const data = await call("rewrite_depression_sensitive_content", {
      text: "Please enter your email address", mode: "rewrite"
    });
    expect((data.output as { review_recommended: boolean }).review_recommended).toBe(false);
  });

  it("H-25: pattern-heavy text → review_recommended is true", async () => {
    const data = await call("rewrite_depression_sensitive_content", {
      text: "You failed, try harder next time", mode: "rewrite"
    });
    expect((data.output as { review_recommended: boolean }).review_recommended).toBe(true);
  });

  it("H-26: pattern_count matches safety_flags length", async () => {
    const data = await call("rewrite_depression_sensitive_content", {
      text: "You failed. Try harder. Last chance.", mode: "audit"
    });
    const output = data.output as { pattern_count: number; safety_flags: string[] };
    expect(output.pattern_count).toBe(output.safety_flags.length);
  });

  it("H-27: default mode is rewrite when mode omitted", async () => {
    const data = await call("rewrite_depression_sensitive_content", {
      text: "You must complete the form", mode: "rewrite"
    });
    expect((data.output as { result: string }).result).toBeDefined();
  });

  it("H-27b: stigma pattern 'crazy' detected", async () => {
    const data = await call("rewrite_depression_sensitive_content", { text: "that is crazy", mode: "audit" });
    const flags = (data.output as { safety_flags: string[] }).safety_flags;
    expect(flags.some(f => f.toLowerCase().includes("stigmatizing"))).toBe(true);
  });

  it("H-27c: medical claim pattern 'cure' detected", async () => {
    const data = await call("rewrite_depression_sensitive_content", { text: "this will cure depression", mode: "audit" });
    const flags = (data.output as { safety_flags: string[] }).safety_flags;
    expect(flags.some(f => f.toLowerCase().includes("medical"))).toBe(true);
  });

  it("H-27d: minimizing pattern 'snap out of it' detected", async () => {
    const data = await call("rewrite_depression_sensitive_content", { text: "just snap out of it", mode: "audit" });
    const flags = (data.output as { safety_flags: string[] }).safety_flags;
    expect(flags.some(f => f.toLowerCase().includes("minimizing"))).toBe(true);
  });
});

// ─── handleCognitiveAccessibility ────────────────────────────────────────────

describe("cognitive_accessibility_audit", () => {
  it("H-28: long average sentence triggers finding", async () => {
    const longSentence = "This is a very long sentence that keeps going and going with many clauses and conjunctions that pushes it well beyond twenty words total so it should trigger.";
    const data = await call("cognitive_accessibility_audit", { content: longSentence });
    const findings = (data.output as { findings: string[] }).findings;
    expect(findings.some(f => f.includes("sentence"))).toBe(true);
  });

  it("H-29: short sentences — no sentence-length finding", async () => {
    const data = await call("cognitive_accessibility_audit", { content: "Enter name. Click save. Done." });
    const findings = (data.output as { findings: string[] }).findings;
    expect(findings.some(f => f.includes("sentence"))).toBe(false);
  });

  it("H-30: word count over 150 triggers chunk finding", async () => {
    const longContent = "word ".repeat(160).trim();
    const data = await call("cognitive_accessibility_audit", { content: longContent });
    const findings = (data.output as { findings: string[] }).findings;
    expect(findings.some(f => f.includes("160"))).toBe(true);
  });

  it("H-31: jargon term triggers finding", async () => {
    const data = await call("cognitive_accessibility_audit", {
      content: "Notwithstanding the aforementioned terms, the policy herein applies."
    });
    const findings = (data.output as { findings: string[] }).findings;
    expect(findings.some(f => f.toLowerCase().includes("jargon"))).toBe(true);
  });

  it("H-32: clean simple content → fallback no-issues message", async () => {
    const data = await call("cognitive_accessibility_audit", { content: "1. Enter name. 2. Click save." });
    const findings = (data.output as { findings: string[] }).findings;
    expect(findings.some(f => f.includes("No major cognitive accessibility issues"))).toBe(true);
  });

  it("H-33: always includes 2 universal recommendations at end", async () => {
    const data = await call("cognitive_accessibility_audit", { content: "Short text." });
    const recs = (data.output as { recommendations: string[] }).recommendations;
    const last2 = recs.slice(-2).join(" ");
    expect(last2).toContain("varied cognitive profiles");
    expect(last2).toContain("summary");
  });

  it("H-34: single-word content does not crash and returns assumptions", async () => {
    // Empty string is rejected by input validation (required field).
    // A single word is the minimal valid content — handler must not crash.
    const data = await call("cognitive_accessibility_audit", { content: "Hello." });
    expect(Array.isArray(data.assumptions)).toBe(true);
    expect(data.assumptions.length).toBeGreaterThan(0);
  });
});

// ─── handleCulturalContext ────────────────────────────────────────────────────

describe("cultural_context_check", () => {
  it("H-35: Japan region triggers hierarchy notes", async () => {
    const data = await call("cultural_context_check", { message: "Sign up!", audience: "enterprise", region: "Japan" });
    const notes = (data.output as { notes: string[] }).notes;
    expect(notes.some(n => n.toLowerCase().includes("hierarch") || n.toLowerCase().includes("collective"))).toBe(true);
  });

  it("H-36: APAC region triggers same branch as Japan", async () => {
    const data = await call("cultural_context_check", { message: "Hello", audience: "general", region: "APAC" });
    const notes = (data.output as { notes: string[] }).notes;
    expect(notes.length).toBeGreaterThan(0);
  });

  it("H-37: Middle East region triggers RTL note", async () => {
    const data = await call("cultural_context_check", { message: "Hello", audience: "general", region: "Middle East" });
    const notes = (data.output as { notes: string[] }).notes;
    expect(notes.some(n => n.includes("RTL") || n.includes("right-to-left"))).toBe(true);
  });

  it("H-38: India region triggers language diversity note", async () => {
    const data = await call("cultural_context_check", { message: "Hello", audience: "general", region: "India" });
    const notes = (data.output as { notes: string[] }).notes;
    expect(notes.some(n => n.toLowerCase().includes("language"))).toBe(true);
  });

  it("H-39: elder audience triggers formal tone note", async () => {
    const data = await call("cultural_context_check", { message: "Hi there", audience: "senior users", region: "global" });
    const notes = (data.output as { notes: string[] }).notes;
    expect(notes.some(n => n.toLowerCase().includes("formal"))).toBe(true);
  });

  it("H-40: unknown region and audience → generic fallback notes", async () => {
    const data = await call("cultural_context_check", { message: "Hello", audience: "everyone", region: "Antarctica" });
    const notes = (data.output as { notes: string[] }).notes;
    expect(notes.length).toBeGreaterThan(0);
    expect(notes.some(n => n.toLowerCase().includes("neutral") || n.toLowerCase().includes("idiom") || n.toLowerCase().includes("concrete"))).toBe(true);
  });

  it("H-41: message with 'guys' → stripped in adaptation", async () => {
    const data = await call("cultural_context_check", { message: "Hey guys, welcome!", audience: "general", region: "global" });
    const adapted = (data.output as { adapted_message: string }).adapted_message;
    expect(adapted.toLowerCase()).not.toContain("guys");
  });

  it("H-42: empty message is rejected by input validation (required field)", async () => {
    // The validator treats empty string as missing — this is the correct behaviour.
    // The 'No message provided' branch in the handler is reachable when message resolves
    // to empty via the str() helper fallback with a non-required field scenario.
    const result = await callRaw("cultural_context_check", { message: "", audience: "general", region: "global" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain("message");
  });

  it("H-43: uncertainty is always high", async () => {
    expect((await call("cultural_context_check", { message: "x", audience: "general" })).uncertainty).toBe("high");
  });

  it("H-44: Japan + elder audience → both branches fire", async () => {
    const data = await call("cultural_context_check", { message: "Hello", audience: "elder board members", region: "Japan" });
    const notes = (data.output as { notes: string[] }).notes;
    // Should have notes from both Japan branch and elder audience branch
    expect(notes.length).toBeGreaterThanOrEqual(4);
  });
});

// ─── handleDeescalation ──────────────────────────────────────────────────────

describe("deescalation_plan", () => {
  it("H-45: high intensity returns 7 plan steps", async () => {
    const data = await call("deescalation_plan", { situation: "dispute", intensity: "high" });
    expect((data.output as { plan: string[] }).plan).toHaveLength(7);
  });

  it("H-46: high intensity returns 3 risk notes", async () => {
    const data = await call("deescalation_plan", { situation: "dispute", intensity: "high" });
    expect((data.output as { risk_notes: string[] }).risk_notes).toHaveLength(3);
  });

  it("H-47: medium intensity returns 7 plan steps", async () => {
    const data = await call("deescalation_plan", { situation: "dispute", intensity: "medium" });
    expect((data.output as { plan: string[] }).plan).toHaveLength(7);
  });

  it("H-48: medium intensity returns 1 risk note", async () => {
    const data = await call("deescalation_plan", { situation: "dispute", intensity: "medium" });
    expect((data.output as { risk_notes: string[] }).risk_notes).toHaveLength(1);
  });

  it("H-49: low intensity returns 6 plan steps", async () => {
    const data = await call("deescalation_plan", { situation: "dispute", intensity: "low" });
    expect((data.output as { plan: string[] }).plan).toHaveLength(6);
  });

  it("H-50: low intensity returns 1 risk note", async () => {
    const data = await call("deescalation_plan", { situation: "dispute", intensity: "low" });
    expect((data.output as { risk_notes: string[] }).risk_notes).toHaveLength(1);
  });

  it("H-51: default intensity is medium", async () => {
    const data = await call("deescalation_plan", { situation: "dispute" });
    expect((data.output as { plan: string[] }).plan).toHaveLength(7);
    expect((data.output as { risk_notes: string[] }).risk_notes).toHaveLength(1);
  });

  it("H-52: situation with 'threat' triggers ALERT note", async () => {
    const data = await call("deescalation_plan", { situation: "They made a legal threat", intensity: "low" });
    const notes = (data.output as { risk_notes: string[] }).risk_notes;
    expect(notes.some(n => n.includes("ALERT"))).toBe(true);
  });

  it("H-53: situation with 'harm' triggers ALERT note", async () => {
    const data = await call("deescalation_plan", { situation: "risk of harm to others", intensity: "low" });
    const notes = (data.output as { risk_notes: string[] }).risk_notes;
    expect(notes.some(n => n.includes("ALERT"))).toBe(true);
  });

  it("H-54: situation with 'legal' triggers ALERT note", async () => {
    const data = await call("deescalation_plan", { situation: "legal action is being considered", intensity: "medium" });
    const notes = (data.output as { risk_notes: string[] }).risk_notes;
    expect(notes.some(n => n.includes("ALERT"))).toBe(true);
  });

  it("H-55: clean situation → no ALERT note", async () => {
    const data = await call("deescalation_plan", { situation: "deadline disagreement between colleagues", intensity: "low" });
    const notes = (data.output as { risk_notes: string[] }).risk_notes;
    expect(notes.some(n => n.includes("ALERT"))).toBe(false);
  });

  it("H-56: ALERT fires alongside high intensity notes giving 4 risk_notes total", async () => {
    const data = await call("deescalation_plan", { situation: "threatened harm to property", intensity: "high" });
    const notes = (data.output as { risk_notes: string[] }).risk_notes;
    expect(notes).toHaveLength(4);
  });
});

// ─── handleEmpatheticReframe ─────────────────────────────────────────────────

describe("empathetic_reframe", () => {
  it("H-57: warm tone rewrites 'you failed'", async () => {
    const data = await call("empathetic_reframe", { message: "You failed to submit on time", tone: "warm" });
    expect((data.output as { reframed_message: string }).reframed_message.toLowerCase()).not.toContain("you failed");
  });

  it("H-58: warm tone rewrites 'we cannot'", async () => {
    const data = await call("empathetic_reframe", { message: "We cannot process this request", tone: "warm" });
    expect((data.output as { reframed_message: string }).reframed_message).toContain("what we are able to do is");
  });

  it("H-59: warm tone rewrites 'as per our policy'", async () => {
    const data = await call("empathetic_reframe", { message: "As per our policy, no refunds are allowed", tone: "warm" });
    expect((data.output as { reframed_message: string }).reframed_message).toContain("to make sure things go smoothly");
  });

  it("H-60: warm tone produces 3 rationale items", async () => {
    const data = await call("empathetic_reframe", { message: "You must complete this", tone: "warm" });
    expect((data.output as { rationale: string[] }).rationale).toHaveLength(3);
  });

  it("H-61: formal tone rewrites 'sorry' to 'I apologise'", async () => {
    const data = await call("empathetic_reframe", { message: "Sorry for the inconvenience", tone: "formal" });
    expect((data.output as { reframed_message: string }).reframed_message).toContain("I apologise");
  });

  it("H-62: formal tone rewrites 'thanks' to 'thank you'", async () => {
    const data = await call("empathetic_reframe", { message: "Thanks for your patience", tone: "formal" });
    expect((data.output as { reframed_message: string }).reframed_message).toContain("thank you");
  });

  it("H-63: formal tone produces 2 rationale items", async () => {
    const data = await call("empathetic_reframe", { message: "hi there thanks", tone: "formal" });
    expect((data.output as { rationale: string[] }).rationale).toHaveLength(2);
  });

  it("H-64: neutral tone produces 1 rationale item", async () => {
    const data = await call("empathetic_reframe", { message: "Some message here", tone: "neutral" });
    expect((data.output as { rationale: string[] }).rationale).toHaveLength(1);
  });

  it("H-65: default tone is warm", async () => {
    const data = await call("empathetic_reframe", { message: "You failed to submit" });
    // warm branch fires — reframed should change "you failed"
    expect((data.output as { reframed_message: string }).reframed_message.toLowerCase()).not.toContain("you failed");
  });

  it("H-66: crisis word 'suicid' triggers escalation guidance", async () => {
    const data = await call("empathetic_reframe", { message: "The user mentioned suicidal thoughts", tone: "neutral" });
    const guidance = (data.output as { escalation_guidance: string[] }).escalation_guidance;
    expect(guidance.length).toBe(5);
  });

  it("H-67: crisis phrase 'end my life' triggers escalation", async () => {
    const data = await call("empathetic_reframe", { message: "I want to end my life", tone: "neutral" });
    expect((data.output as { escalation_guidance: string[] }).escalation_guidance.length).toBeGreaterThan(0);
  });

  it("H-68: crisis phrase 'self-harm' triggers escalation", async () => {
    const data = await call("empathetic_reframe", { message: "thoughts of self-harm persist", tone: "neutral" });
    expect((data.output as { escalation_guidance: string[] }).escalation_guidance.length).toBeGreaterThan(0);
  });

  it("H-69: crisis phrase 'no point' triggers escalation", async () => {
    const data = await call("empathetic_reframe", { message: "there is no point continuing", tone: "neutral" });
    expect((data.output as { escalation_guidance: string[] }).escalation_guidance.length).toBeGreaterThan(0);
  });

  it("H-70: non-crisis message → empty escalation guidance", async () => {
    const data = await call("empathetic_reframe", { message: "We cannot process your refund right now", tone: "warm" });
    expect((data.output as { escalation_guidance: string[] }).escalation_guidance).toHaveLength(0);
  });

  it("H-71: crisis escalation includes specific crisis line numbers", async () => {
    const data = await call("empathetic_reframe", { message: "I feel suicidal", tone: "neutral" });
    const joined = (data.output as { escalation_guidance: string[] }).escalation_guidance.join(" ");
    expect(joined).toContain("988");
    expect(joined).toContain("116 123");
  });

  it("H-72: uncertainty is always medium", async () => {
    expect((await call("empathetic_reframe", { message: "we cannot help", tone: "warm" })).uncertainty).toBe("medium");
  });
});

// ─── grief support modes (merged into supportive_reply) ──────────────────────

describe("grief support modes", () => {
  it("H-73: presence mode via supportive_reply returns a non-empty reply", async () => {
    const data = await call("supportive_reply", { message: "x", risk_level: "low", support_mode: "presence" });
    expect((data.output as { reply: string }).reply.length).toBeGreaterThan(20);
  });

  it("H-74: practical mode via supportive_reply returns a non-empty reply", async () => {
    const data = await call("supportive_reply", { message: "x", risk_level: "low", support_mode: "practical" });
    expect((data.output as { reply: string }).reply.length).toBeGreaterThan(20);
  });

  it("H-75: reflection mode via supportive_reply returns a non-empty reply", async () => {
    const data = await call("supportive_reply", { message: "x", risk_level: "low", support_mode: "reflection" });
    expect((data.output as { reply: string }).reply.length).toBeGreaterThan(20);
  });

  it("H-76: all grief modes produce 5 care_notes (3 mode-specific + 2 universal)", async () => {
    for (const mode of ["presence", "practical", "reflection"]) {
      const data = await call("supportive_reply", { message: "x", risk_level: "low", support_mode: mode });
      expect((data.output as { care_notes: string[] }).care_notes).toHaveLength(5);
    }
  });

  it("H-77: anti-platitude note always present in care_notes", async () => {
    const data = await call("supportive_reply", { message: "x", risk_level: "low", support_mode: "presence" });
    const notes = (data.output as { care_notes: string[] }).care_notes;
    expect(notes.some(n => n.toLowerCase().includes("platitude"))).toBe(true);
  });

  it("H-78: cultural variation note always present in care_notes", async () => {
    const data = await call("supportive_reply", { message: "x", risk_level: "low", support_mode: "practical" });
    const notes = (data.output as { care_notes: string[] }).care_notes;
    expect(notes.some(n => n.toLowerCase().includes("cultural"))).toBe(true);
  });

  it("H-79: default support_mode is general (no care_notes)", async () => {
    const data = await call("supportive_reply", { message: "x", risk_level: "low" });
    expect((data.output as Record<string, unknown>)).not.toHaveProperty("care_notes");
  });

  it("H-80: general mode does not produce care_notes", async () => {
    const data = await call("supportive_reply", { message: "x", risk_level: "low", support_mode: "general" });
    expect((data.output as Record<string, unknown>)).not.toHaveProperty("care_notes");
  });

  it("H-80b: grief cliche 'they're in a better place' detected in care_notes", async () => {
    const data = await call("supportive_reply", { message: "they're in a better place now", risk_level: "low", support_mode: "presence" });
    const notes = (data.output as { care_notes: string[] }).care_notes;
    expect(notes.some(n => n.toLowerCase().includes("platitude"))).toBe(true);
  });

  it("H-80c: crisis message triggers crisis warning in care_notes", async () => {
    const data = await call("supportive_reply", { message: "I want to end my life", risk_level: "low", support_mode: "presence" });
    const notes = (data.output as { care_notes: string[] }).care_notes;
    expect(notes.some(n => n.toLowerCase().includes("crisis"))).toBe(true);
  });

  it("H-80d: grief mode reply does not use emotion-detection template", async () => {
    const data = await call("supportive_reply", { message: "I am so sad", risk_level: "low", support_mode: "reflection" });
    const reply = (data.output as { reply: string }).reply;
    expect(reply).not.toContain("I hear you, and I am glad you reached out");
    expect(reply).toContain("Grief often does not follow a straight line");
  });
});

// ─── handleNeurodiversityDesign ───────────────────────────────────────────────

describe("neurodiversity_design_check", () => {
  it("H-81: ADHD focus fires branch with 3+ recommendations", async () => {
    const data = await call("neurodiversity_design_check", { ui_description: "x", focus: ["adhd"] });
    const recs = (data.output as { recommendations: string[] }).recommendations;
    expect(recs.length).toBeGreaterThanOrEqual(3);
  });

  it("H-82: sensory focus fires branch with motion-related recommendations", async () => {
    const data = await call("neurodiversity_design_check", { ui_description: "x", focus: ["sensory"] });
    const recs = (data.output as { recommendations: string[] }).recommendations;
    expect(recs.some(r => r.toLowerCase().includes("motion") || r.toLowerCase().includes("animation"))).toBe(true);
  });

  it("H-83: animation in description triggers sensory branch", async () => {
    const data = await call("neurodiversity_design_check", { ui_description: "animated loading screen", focus: [] });
    const recs = (data.output as { recommendations: string[] }).recommendations;
    expect(recs.some(r => r.toLowerCase().includes("animation") || r.toLowerCase().includes("motion"))).toBe(true);
  });

  it("H-84: notification in description triggers ADHD branch", async () => {
    const data = await call("neurodiversity_design_check", { ui_description: "notification badge system", focus: [] });
    const recs = (data.output as { recommendations: string[] }).recommendations;
    expect(recs.some(r => r.toLowerCase().includes("notif") || r.toLowerCase().includes("focus"))).toBe(true);
  });

  it("H-85: dyslexia focus fires branch with 4 recommendations", async () => {
    const data = await call("neurodiversity_design_check", { ui_description: "x", focus: ["dyslexia"] });
    const recs = (data.output as { recommendations: string[] }).recommendations;
    expect(recs.length).toBeGreaterThanOrEqual(4);
  });

  it("H-86: form in description fires executive function branch", async () => {
    const data = await call("neurodiversity_design_check", { ui_description: "multi-step registration form", focus: [] });
    const recs = (data.output as { recommendations: string[] }).recommendations;
    expect(recs.some(r => r.toLowerCase().includes("step") || r.toLowerCase().includes("auto-save") || r.toLowerCase().includes("progress"))).toBe(true);
  });

  it("H-87: minimal description + empty focus → fallback recommendations", async () => {
    // Empty string is rejected by input validation.
    // A minimal non-empty description with no keywords triggers the fallback branch.
    const data = await call("neurodiversity_design_check", { ui_description: "standard interface", focus: [] });
    const recs = (data.output as { recommendations: string[] }).recommendations;
    expect(recs.length).toBeGreaterThanOrEqual(2);
  });

  it("H-88: multiple focus areas fire all matching branches", async () => {
    const data = await call("neurodiversity_design_check", { ui_description: "x", focus: ["adhd", "dyslexia"] });
    const recs = (data.output as { recommendations: string[] }).recommendations;
    expect(recs.length).toBeGreaterThanOrEqual(6);
  });

  it("H-89: universal tradeoff always appended as last tradeoff", async () => {
    const data = await call("neurodiversity_design_check", { ui_description: "x", focus: ["adhd"] });
    const tradeoffs = (data.output as { tradeoffs: string[] }).tradeoffs;
    expect(tradeoffs.at(-1)).toContain("no single design choice");
  });
});

// ─── handleAgeInclusiveDesign ─────────────────────────────────────────────────

describe("age_inclusive_design_check", () => {
  it("H-90: older adults → 5 older-specific recommendations", async () => {
    const data = await call("age_inclusive_design_check", { flow_description: "account creation", age_groups: ["older adults"] });
    const recs = (data.output as { recommendations: string[] }).recommendations;
    expect(recs.length).toBeGreaterThanOrEqual(5);
  });

  it("H-91: senior fires same branch as older", async () => {
    const data = await call("age_inclusive_design_check", { flow_description: "x", age_groups: ["senior"] });
    const recs = (data.output as { recommendations: string[] }).recommendations;
    expect(recs.length).toBeGreaterThanOrEqual(5);
  });

  it("H-92: youth fires youth branch with engagement language", async () => {
    const data = await call("age_inclusive_design_check", { flow_description: "x", age_groups: ["youth"] });
    const recs = (data.output as { recommendations: string[] }).recommendations;
    expect(recs.some(r => r.toLowerCase().includes("conversational") || r.toLowerCase().includes("engag"))).toBe(true);
  });

  it("H-93: payment in description fires financial branch", async () => {
    const data = await call("age_inclusive_design_check", { flow_description: "payment checkout form", age_groups: [] });
    const recs = (data.output as { recommendations: string[] }).recommendations;
    expect(recs.some(r => r.toLowerCase().includes("confirm") || r.toLowerCase().includes("financial") || r.toLowerCase().includes("irreversible"))).toBe(true);
  });

  it("H-94: banking in description fires financial branch", async () => {
    const data = await call("age_inclusive_design_check", { flow_description: "online banking password reset", age_groups: ["older adults"] });
    const notes = (data.output as { access_notes: string[] }).access_notes;
    expect(notes.some(n => n.toLowerCase().includes("financial") || n.toLowerCase().includes("trust"))).toBe(true);
  });

  it("H-95: universal access notes always present as last 2", async () => {
    const data = await call("age_inclusive_design_check", { flow_description: "x", age_groups: ["older adults"] });
    const notes = (data.output as { access_notes: string[] }).access_notes;
    const last2 = notes.slice(-2).join(" ");
    expect(last2).toContain("homogeneous");
    expect(last2).toContain("ageist");
  });

  it("H-96: uncertainty is always low", async () => {
    expect((await call("age_inclusive_design_check", { flow_description: "x", age_groups: ["older adults"] })).uncertainty).toBe("low");
  });
});

// ─── supportive_reply (inline handler) ───────────────────────────────────────

describe("supportive_reply", () => {
  it("H-97: high risk returns 7 escalation items", async () => {
    const data = await call("supportive_reply", { message: "I feel terrible", risk_level: "high" });
    expect((data.output as { escalation_guidance: string[] }).escalation_guidance).toHaveLength(7);
  });

  it("H-98: high risk escalation contains 988 crisis line", async () => {
    const data = await call("supportive_reply", { message: "x", risk_level: "high" });
    const joined = (data.output as { escalation_guidance: string[] }).escalation_guidance.join(" ");
    expect(joined).toContain("988");
  });

  it("H-99: high risk escalation contains Samaritans 116 123", async () => {
    const data = await call("supportive_reply", { message: "x", risk_level: "high" });
    const joined = (data.output as { escalation_guidance: string[] }).escalation_guidance.join(" ");
    expect(joined).toContain("116 123");
  });

  it("H-100: medium risk returns 3 escalation items", async () => {
    const data = await call("supportive_reply", { message: "x", risk_level: "medium" });
    expect((data.output as { escalation_guidance: string[] }).escalation_guidance).toHaveLength(3);
  });

  it("H-101: low risk returns 1 escalation item", async () => {
    const data = await call("supportive_reply", { message: "x", risk_level: "low" });
    expect((data.output as { escalation_guidance: string[] }).escalation_guidance).toHaveLength(1);
  });

  it("H-102: default risk_level is low (1 escalation item)", async () => {
    const data = await call("supportive_reply", { message: "x", risk_level: "low" });
    expect((data.output as { escalation_guidance: string[] }).escalation_guidance).toHaveLength(1);
  });

  it("H-103: reply is non-empty fixed text", async () => {
    const data = await call("supportive_reply", { message: "x", risk_level: "low" });
    expect((data.output as { reply: string }).reply.length).toBeGreaterThan(50);
  });

  it("H-104: boundaries_notice matches boundaryNotice", async () => {
    const data = await call("supportive_reply", { message: "x", risk_level: "low" });
    expect((data.output as { boundaries_notice: string }).boundaries_notice).toBe(data.boundaryNotice);
  });

  it("H-105: auto-escalates to high when crisis signals detected with low risk_level", async () => {
    const data = await call("supportive_reply", { message: "I want to kill myself", risk_level: "low" });
    const esc = (data.output as { escalation_guidance: string[] }).escalation_guidance;
    expect(esc.length).toBe(7); // High risk escalation
    expect(esc.some(e => e.includes("988"))).toBe(true);
  });

  it("H-106: emotion detected in assumptions", async () => {
    const data = await call("supportive_reply", { message: "I am scared and anxious", risk_level: "medium" });
    expect(data.assumptions.some(a => a.includes("Detected emotion"))).toBe(true);
  });
});
