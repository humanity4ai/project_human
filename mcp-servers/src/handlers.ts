import { actionContracts } from "./index.js";
import type { InvokeResponse } from "./types.js";

function boundaryForAction(action: string): string {
  const contract = actionContracts.find((item) => item.action === action);
  if (!contract) return "Unknown action — no boundary metadata available";
  return contract.safetyBoundary;
}

function isKnownAction(action: string): boolean {
  return actionContracts.some((item) => item.action === action);
}

export function invokeAction(
  action: string,
  input: Record<string, unknown>
): { ok: true; data: InvokeResponse } | { ok: false; error: string } {
  if (!isKnownAction(action)) {
    return { ok: false, error: `Unknown action: '${action}'. Call list_actions to see available actions.` };
  }

  const boundaryNotice = boundaryForAction(action);

  switch (action) {
    case "wcagaaa_check": {
      const target = typeof input.target === "string" ? input.target : "(no target provided)";
      return {
        ok: true,
        data: {
          action,
          boundaryNotice,
          uncertainty: "medium",
          assumptions: [
            "Input sample is representative of the full page",
            "Dynamic states were described or provided"
          ],
          output: {
            summary: `Accessibility audit initiated for: ${target}`,
            findings: [
              {
                severity: "medium",
                issue: "Text contrast may fall below AAA threshold (7:1)",
                fix: "Raise foreground/background contrast ratio to at least 7:1 for normal text"
              }
            ]
          }
        }
      };
    }

    case "supportive_reply": {
      const riskLevel = typeof input.risk_level === "string" ? input.risk_level : "low";
      const escalation =
        riskLevel === "high"
          ? [
              "If you or someone else may be in immediate danger, contact emergency services now",
              "Contact a local crisis line — trained counselors are available 24/7",
              "Reach out to a trusted person nearby"
            ]
          : [
              "If things feel harder over time, consider speaking with a mental health professional",
              "You can contact a support line any time, even just to talk"
            ];

      return {
        ok: true,
        data: {
          action,
          boundaryNotice,
          uncertainty: "medium",
          assumptions: ["Risk level is self-reported by the user or calling system"],
          output: {
            reply:
              "I hear you, and I am glad you reached out. It makes sense that things feel heavy right now. Let us focus on one small step at a time — you do not have to solve everything at once.",
            escalation_guidance: escalation,
            boundaries_notice: boundaryNotice
          }
        }
      };
    }

    default: {
      // Action is known (validated above) but runtime handler not yet implemented
      return {
        ok: false,
        error: `Action '${action}' contract is registered but its runtime handler is not yet implemented in v0.1. See ROADMAP.md for implementation schedule.`
      };
    }
  }
}
