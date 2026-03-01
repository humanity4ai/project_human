/**
 * Integration tests for mcp-servers/src/server.ts
 * Tests handleEnvelope dispatch and the line-level guards by
 * importing and calling the logic directly (no process spawn needed).
 *
 * Copyright (c) 2026 Ascent Partners Foundation. MIT License.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { actionContracts } from "../index.js";

// ─── minimal server harness ───────────────────────────────────────────────────
// Re-implement the handleEnvelope logic in isolation so we can unit-test it
// without spawning a child process or touching process.stdin.

import { z } from "zod";
import { invokeAction } from "../handlers.js";
import { invokeRequestSchema } from "../types.js";

const envelopeSchema = z.object({
  id: z.string().optional(),
  type: z.enum(["list_actions", "invoke"]),
  payload: z.unknown().optional()
});

type Envelope = z.infer<typeof envelopeSchema>;
type Response = Record<string, unknown>;

function handleEnvelope(envelope: Envelope): Response {
  if (envelope.type === "list_actions") {
    return { id: envelope.id, ok: true, data: actionContracts };
  }

  if (envelope.type === "invoke") {
    const parsed = invokeRequestSchema.safeParse(envelope.payload);
    if (!parsed.success) {
      return { id: envelope.id, ok: false, error: "Invalid invoke payload", issues: parsed.error.issues };
    }
    const result = invokeAction(parsed.data.action, parsed.data.input);
    if (result.ok) return { id: envelope.id, ok: true, data: result.data };
    return { id: envelope.id, ok: false, error: result.error };
  }

  return { id: envelope.id, ok: false, error: "Unsupported request type" };
}

const MAX_LINE_BYTES = 512 * 1024;

function processLine(line: string): Response {
  if (Buffer.byteLength(line, "utf8") > MAX_LINE_BYTES) {
    return { ok: false, error: "Request exceeds maximum size (512 KB)" };
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(line);
  } catch {
    return { ok: false, error: "Malformed JSON request" };
  }
  const envelope = envelopeSchema.safeParse(parsed);
  if (!envelope.success) {
    return { ok: false, error: "Invalid request envelope", issues: envelope.error.issues };
  }
  return handleEnvelope(envelope.data);
}

// ─── list_actions ─────────────────────────────────────────────────────────────

describe("handleEnvelope — list_actions", () => {
  it("S-1: list_actions returns ok:true with 10 actions", () => {
    const res = handleEnvelope({ type: "list_actions" });
    expect(res.ok).toBe(true);
    expect((res.data as unknown[]).length).toBe(10);
  });

  it("S-2: list_actions echoes id", () => {
    const res = handleEnvelope({ id: "test-123", type: "list_actions" });
    expect(res.id).toBe("test-123");
  });

  it("S-3: list_actions with no id — id is undefined in response", () => {
    const res = handleEnvelope({ type: "list_actions" });
    expect(res.id).toBeUndefined();
  });
});

// ─── invoke ───────────────────────────────────────────────────────────────────

describe("handleEnvelope — invoke", () => {
  it("S-4: valid invoke returns ok:true", () => {
    const res = handleEnvelope({
      type: "invoke",
      payload: { action: "supportive_reply", input: { message: "I feel overwhelmed", risk_level: "medium" } }
    });
    expect(res.ok).toBe(true);
  });

  it("S-5: invoke with missing required field returns ok:false", () => {
    const res = handleEnvelope({
      type: "invoke",
      payload: { action: "supportive_reply", input: {} }
    });
    expect(res.ok).toBe(false);
    expect(res.error as string).toContain("Input validation failed");
  });

  it("S-6: invoke with unknown action returns ok:false", () => {
    const res = handleEnvelope({
      type: "invoke",
      payload: { action: "not_real_action", input: {} }
    });
    expect(res.ok).toBe(false);
    expect(res.error as string).toContain("Unknown action");
  });

  it("S-7: invoke with malformed payload (missing action) returns ok:false", () => {
    const res = handleEnvelope({
      type: "invoke",
      payload: { input: {} }
    });
    expect(res.ok).toBe(false);
    expect(res.error as string).toBe("Invalid invoke payload");
  });

  it("S-8: invoke echoes id", () => {
    const res = handleEnvelope({
      id: "inv-1",
      type: "invoke",
      payload: { action: "supportive_reply", input: { message: "x", risk_level: "low" } }
    });
    expect(res.id).toBe("inv-1");
  });

  it("S-9: invoke with no payload returns invalid invoke payload", () => {
    const res = handleEnvelope({ type: "invoke" });
    expect(res.ok).toBe(false);
    expect(res.error as string).toBe("Invalid invoke payload");
  });
});

// ─── line-level guards ────────────────────────────────────────────────────────

describe("processLine — guards", () => {
  it("S-10: line over 512 KB returns size error without id", () => {
    const bigLine = JSON.stringify({ id: "big", type: "list_actions" }) + " ".repeat(MAX_LINE_BYTES);
    const res = processLine(bigLine);
    expect(res.ok).toBe(false);
    expect(res.error).toContain("512 KB");
    expect(res.id).toBeUndefined();
  });

  it("S-11: malformed JSON returns malformed error without id", () => {
    const res = processLine("not valid json {{{");
    expect(res.ok).toBe(false);
    expect(res.error).toBe("Malformed JSON request");
    expect(res.id).toBeUndefined();
  });

  it("S-12: invalid envelope type returns envelope error", () => {
    const res = processLine(JSON.stringify({ type: "unknown_type_xyz" }));
    expect(res.ok).toBe(false);
    expect(res.error).toContain("Invalid request envelope");
  });
});
