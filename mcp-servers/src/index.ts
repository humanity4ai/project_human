import { z } from "zod";

export const actionContractSchema = z.object({
  skill: z.string().min(1),
  action: z.string().min(1),
  inputSchemaPath: z.string().min(1),
  outputSchemaPath: z.string().min(1),
  safetyBoundary: z.string().min(1)
});

export type ActionContract = z.infer<typeof actionContractSchema>;

export const actionContracts: ActionContract[] = [
  {
    skill: "wcag-aaa-accessibility",
    action: "wcagaaa_check",
    inputSchemaPath: "schemas/wcag-aaa-accessibility.input.json",
    outputSchemaPath: "schemas/wcag-aaa-accessibility.output.json",
    safetyBoundary: "Compliance guidance only; does not replace legal review"
  },
  {
    skill: "depression-sensitive-content",
    action: "rewrite_depression_sensitive_content",
    inputSchemaPath: "schemas/depression-sensitive-content.input.json",
    outputSchemaPath: "schemas/depression-sensitive-content.output.json",
    safetyBoundary: "Non-clinical UX/content guidance only"
  },
  {
    skill: "supportive-conversation",
    action: "supportive_reply",
    inputSchemaPath: "schemas/supportive-conversation.input.json",
    outputSchemaPath: "schemas/supportive-conversation.output.json",
    safetyBoundary: "Non-clinical support; must provide escalation cues when risk is elevated"
  },
  {
    skill: "cognitive-accessibility",
    action: "cognitive_accessibility_audit",
    inputSchemaPath: "schemas/cognitive-accessibility.input.json",
    outputSchemaPath: "schemas/cognitive-accessibility.output.json",
    safetyBoundary: "Design guidance only"
  },
  {
    skill: "cultural-sensitivity",
    action: "cultural_context_check",
    inputSchemaPath: "schemas/cultural-sensitivity.input.json",
    outputSchemaPath: "schemas/cultural-sensitivity.output.json",
    safetyBoundary: "Context-sensitive recommendations with uncertainty disclosure"
  },
  {
    skill: "conflict-de-escalation",
    action: "deescalation_plan",
    inputSchemaPath: "schemas/conflict-de-escalation.input.json",
    outputSchemaPath: "schemas/conflict-de-escalation.output.json",
    safetyBoundary: "No coercive tactics"
  },
  {
    skill: "empathetic-communication",
    action: "empathetic_reframe",
    inputSchemaPath: "schemas/empathetic-communication.input.json",
    outputSchemaPath: "schemas/empathetic-communication.output.json",
    safetyBoundary: "No manipulation or deceptive empathy"
  },
  {
    skill: "grief-loss-support",
    action: "grief_support_response",
    inputSchemaPath: "schemas/grief-loss-support.input.json",
    outputSchemaPath: "schemas/grief-loss-support.output.json",
    safetyBoundary: "Non-clinical bereavement support only"
  },
  {
    skill: "neurodiversity-aware-design",
    action: "neurodiversity_design_check",
    inputSchemaPath: "schemas/neurodiversity-aware-design.input.json",
    outputSchemaPath: "schemas/neurodiversity-aware-design.output.json",
    safetyBoundary: "Inclusive design guidance only"
  },
  {
    skill: "age-inclusive-design",
    action: "age_inclusive_design_check",
    inputSchemaPath: "schemas/age-inclusive-design.input.json",
    outputSchemaPath: "schemas/age-inclusive-design.output.json",
    safetyBoundary: "Inclusive design guidance only"
  }
];

export function validateContracts(contracts: ActionContract[]): ActionContract[] {
  return contracts.map((contract) => actionContractSchema.parse(contract));
}
