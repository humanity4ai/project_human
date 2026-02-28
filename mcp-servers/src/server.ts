import { createInterface } from "node:readline";
import { actionContracts, validateContracts } from "./index.js";
import { invokeAction } from "./handlers.js";
import { invokeRequestSchema } from "./types.js";

type Envelope = {
  id?: string;
  type: "list_actions" | "invoke";
  payload?: unknown;
};

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

    const response = invokeAction(parsed.data.action, parsed.data.input);
    send({ id: envelope.id, ok: true, data: response });
    return;
  }

  send({ id: envelope.id, ok: false, error: "Unsupported request type" });
}

const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: false });

rl.on("line", (line: string) => {
  try {
    const envelope = JSON.parse(line) as Envelope;
    handleEnvelope(envelope);
  } catch {
    send({ ok: false, error: "Malformed JSON request" });
  }
});
