import { z } from "zod";

export const actionContractSchema = z.object({
  skill: z.string().min(1),
  action: z.string().min(1),
  description: z.string().min(1),
  inputSchemaPath: z.string().min(1),
  outputSchemaPath: z.string().min(1),
  safetyBoundary: z.string().min(1)
});

export type ActionContract = z.infer<typeof actionContractSchema>;

export const KNOWN_ACTIONS: Set<string> = new Set();

export const actionContracts: ActionContract[] = [
  {
    skill: "accessibility",
    action: "accessibility_audit",
    description: "Audit web pages for WCAG 2.2 compliance or set session WCAG level. Crawl mode: provide pages with URL+HTML for per-page scoring and ranking across all 78 success criteria. Session mode: returns the complete WCAG checklist for the requested level that the agent must enforce.",
    inputSchemaPath: "schemas/accessibility.input.json",
    outputSchemaPath: "schemas/accessibility.output.json",
    safetyBoundary: "Compliance guidance only; does not replace legal review"
  },
  {
    skill: "depression-sensitive-content",
    action: "rewrite_depression_sensitive_content",
    description: "Audit or rewrite text to be sensitive to depression and mental health. Removes harmful language patterns and replaces them with supportive, non-stigmatising alternatives. Safety boundary: non-clinical UX/content guidance only.",
    inputSchemaPath: "schemas/depression-sensitive-content.input.json",
    outputSchemaPath: "schemas/depression-sensitive-content.output.json",
    safetyBoundary: "Non-clinical UX/content guidance only"
  },
  {
    skill: "supportive-conversation",
    action: "supportive_reply",
    description: "Generate a supportive, non-clinical reply to a message from someone in distress. Supports general emotional support and grief-specific modes (presence, practical, reflection). Includes escalation guidance calibrated to the assessed risk level. Safety boundary: non-clinical support only; must escalate when risk is elevated.",
    inputSchemaPath: "schemas/supportive-conversation.input.json",
    outputSchemaPath: "schemas/supportive-conversation.output.json",
    safetyBoundary: "Non-clinical support; must provide escalation cues when risk is elevated"
  },
  {
    skill: "cognitive-accessibility",
    action: "cognitive_accessibility_audit",
    description: "Audit content for cognitive accessibility — plain language, reading level, structure, and clarity. Returns actionable recommendations to reduce cognitive load. Safety boundary: design guidance only.",
    inputSchemaPath: "schemas/cognitive-accessibility.input.json",
    outputSchemaPath: "schemas/cognitive-accessibility.output.json",
    safetyBoundary: "Design guidance only"
  },
  {
    skill: "cultural-sensitivity",
    action: "cultural_context_check",
    description: "Check a message for cultural sensitivity issues for a given audience or region. Returns flags, concerns, and suggested alternatives with uncertainty disclosure. Safety boundary: context-sensitive recommendations with uncertainty disclosure.",
    inputSchemaPath: "schemas/cultural-sensitivity.input.json",
    outputSchemaPath: "schemas/cultural-sensitivity.output.json",
    safetyBoundary: "Context-sensitive recommendations with uncertainty disclosure"
  },
  {
    skill: "conflict-de-escalation",
    action: "deescalation_plan",
    description: "Generate a structured de-escalation plan for a conflict or tense situation. Returns step-by-step guidance calibrated to the intensity of the conflict. Safety boundary: no coercive tactics.",
    inputSchemaPath: "schemas/conflict-de-escalation.input.json",
    outputSchemaPath: "schemas/conflict-de-escalation.output.json",
    safetyBoundary: "No coercive tactics"
  },
  {
    skill: "empathetic-communication",
    action: "empathetic_reframe",
    description: "Reframe a message with genuine empathy — acknowledging emotions, validating experience, and offering presence. Detects and replaces hollow empathy phrases with authentic alternatives. Safety boundary: no manipulation or deceptive empathy.",
    inputSchemaPath: "schemas/empathetic-communication.input.json",
    outputSchemaPath: "schemas/empathetic-communication.output.json",
    safetyBoundary: "No manipulation or deceptive empathy"
  },
  {
    skill: "neurodiversity-aware-design",
    action: "neurodiversity_design_check",
    description: "Audit a UI description for neurodiversity-aware design — covering ADHD, autism, dyslexia, and sensory sensitivities. Returns targeted recommendations for inclusive design. Safety boundary: inclusive design guidance only.",
    inputSchemaPath: "schemas/neurodiversity-aware-design.input.json",
    outputSchemaPath: "schemas/neurodiversity-aware-design.output.json",
    safetyBoundary: "Inclusive design guidance only"
  },
  {
    skill: "age-inclusive-design",
    action: "age_inclusive_design_check",
    description: "Audit a user flow or interface for age-inclusive design — covering children, adults, and older users. Returns recommendations to remove age-related barriers. Safety boundary: inclusive design guidance only.",
    inputSchemaPath: "schemas/age-inclusive-design.input.json",
    outputSchemaPath: "schemas/age-inclusive-design.output.json",
    safetyBoundary: "Inclusive design guidance only"
  }
];

// Pre-build O(1) lookup set for isKnownAction
for (const c of actionContracts) {
  KNOWN_ACTIONS.add(c.action);
}

export function validateContracts(contracts: ActionContract[]): ActionContract[] {
  return contracts.map((contract) => actionContractSchema.parse(contract));
}
