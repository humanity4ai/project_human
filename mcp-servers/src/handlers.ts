import { actionContracts } from "./index.js";
import type { InvokeResponse } from "./types.js";

function boundaryForAction(action: string): string {
  const contract = actionContracts.find((item) => item.action === action);
  return contract?.safetyBoundary ?? "No boundary metadata found";
}

export function invokeAction(action: string, input: Record<string, unknown>): InvokeResponse {
  const boundaryNotice = boundaryForAction(action);

  switch (action) {
    case "wcagaaa_check":
      return {
        action,
        boundaryNotice,
        uncertainty: "medium",
        assumptions: ["Input sample is representative", "Dynamic states were provided or known"],
        output: {
          summary: "Contract-first placeholder result",
          findings: [
            {
              severity: "medium",
              issue: "Low text contrast likely under AAA threshold",
              fix: "Raise contrast to at least 7:1 for normal text"
            }
          ],
          inputEcho: input
        }
      };
    case "supportive_reply":
      return {
        action,
        boundaryNotice,
        uncertainty: "medium",
        assumptions: ["Risk level is user-provided"],
        output: {
          reply:
            "I am sorry this feels heavy right now. If it helps, we can take one small step together and focus on what is most manageable first.",
          escalation_guidance: [
            "If you may be in immediate danger, contact local emergency services now",
            "Consider reaching out to a trusted person or local crisis line"
          ],
          inputEcho: input
        }
      };
    default:
      return {
        action,
        boundaryNotice,
        uncertainty: "high",
        assumptions: ["No specialized runtime implementation yet"],
        output: {
          status: "not_implemented",
          message: "Action contract exists but runtime handler is stubbed in v0.1",
          inputEcho: input
        }
      };
  }
}
