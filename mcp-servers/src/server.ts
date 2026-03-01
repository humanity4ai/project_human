/**
 * Humanity4AI MCP Server — line-delimited JSON transport
 * Protocol: see docs/protocol.md
 * Copyright (c) 2026 Ascent Partners Foundation. MIT License.
 */
import { createInterface } from "node:readline";
import { z } from "zod";
import { actionContracts, validateContracts } from "./index.js";
import { invokeAction } from "./handlers.js";
import { invokeRequestSchema } from "./types.js";

const VERSION = "0.1.0";

const MAX_LINE_BYTES = 512 * 1024; // 512 KB hard limit per request

const envelopeSchema = z.object({
  id: z.string().optional(),
  type: z.enum(["list_actions", "invoke"]),
  payload: z.unknown().optional()
});

type Envelope = z.infer<typeof envelopeSchema>;

function send(message: unknown): void {
  process.stdout.write(`${JSON.stringify(message)}\n`);
}

function handleEnvelope(envelope: Envelope): void {
  if (envelope.type === "list_actions") {
    send({
      id: envelope.id,
      ok: true,
      data: validateContracts(actionContracts)
    });
    return;
  }

  if (envelope.type === "invoke") {
    const parsed = invokeRequestSchema.safeParse(envelope.payload);
    if (!parsed.success) {
      send({
        id: envelope.id,
        ok: false,
        error: "Invalid invoke payload",
        issues: parsed.error.issues
      });
      return;
    }

    const result = invokeAction(parsed.data.action, parsed.data.input);
    if (result.ok) {
      send({ id: envelope.id, ok: true, data: result.data });
    } else {
      send({ id: envelope.id, ok: false, error: result.error });
    }
    return;
  }

  send({ id: envelope.id, ok: false, error: "Unsupported request type" });
}

// Startup banner written to stderr so it does not pollute the JSON stdout stream
process.stderr.write(
  `Humanity4AI MCP Server v${VERSION}\n` +
  `Actions: ${actionContracts.length} registered\n` +
  `Protocol: line-delimited JSON (see docs/protocol.md)\n` +
  `Ready — waiting for requests on stdin\n`
);

const rl = createInterface({ input: process.stdin, terminal: false });

rl.on("line", (line: string) => {
  if (Buffer.byteLength(line, "utf8") > MAX_LINE_BYTES) {
    send({ ok: false, error: "Request exceeds maximum size (512 KB)" });
    return;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(line);
  } catch {
    send({ ok: false, error: "Malformed JSON request" });
    return;
  }

  const envelope = envelopeSchema.safeParse(parsed);
  if (!envelope.success) {
    send({ ok: false, error: "Invalid request envelope", issues: envelope.error.issues });
    return;
  }

  handleEnvelope(envelope.data);
});

function shutdown(): void {
  rl.close();
  process.exit(0);
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
