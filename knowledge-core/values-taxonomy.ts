/**
 * Humanity4AI Value Taxonomy
 *
 * Maps the 9 humanity skills to ValueCompass dimensions
 * (Shen et al., 2024 — arXiv:2409.09586).
 *
 * Each skill has:
 * - primary: main ValueCompass path (dimension → type → value)
 * - secondary: supporting paths
 * - strength: 0-1 alignment score (how well the rule-based impl maps to the value)
 * - divergence: where LLMs systematically differ from human preferences on this dimension
 *
 * Copyright (c) 2026 Ascent Partners Foundation. MIT License.
 */

export interface ValueProfile {
  primary: string[];
  secondary: string[];
  strength: number;
  divergence: string | null;
}

export const SKILL_VALUE_PROFILES: Record<string, ValueProfile> = {
  accessibility_audit: {
    primary: [
      "Self-Transcendence → Universalism → Equality/Social Justice/Broad-Minded",
    ],
    secondary: [
      "Desired AI → Human-Likeness → Interpretability",
      "Desired AI → Usability → Utility, Customization",
      "Self-Transcendence → Benevolence → Helpful, Responsible",
    ],
    strength: 0.9,
    divergence:
      "LLMs over-claim compliance and hallucinate WCAG scores. Rule-based engine scores only automatable criteria (41/86), flags rest as manual.",
  },

  rewrite_depression_sensitive_content: {
    primary: [
      "Self-Transcendence → Benevolence → Helpful, Responsible",
    ],
    secondary: [
      "Conservation → Security → Health",
      "Desired AI → Human-Likeness → Awareness, Prudent",
      "Desired AI → Usability → Utility",
    ],
    strength: 0.85,
    divergence:
      "LLMs favor 'Customization' and 'Choose Own Goals' over 'Prudent' and 'Responsible'. Rule-based skill enforces person-first language, shame avoidance, and crisis escalation regardless of LLM preferences.",
  },

  supportive_reply: {
    primary: [
      "Conservation → Security → Health, National/Family Security",
      "Self-Transcendence → Benevolence → Helpful",
    ],
    secondary: [
      "Desired AI → Human-Likeness → Awareness, Prudent, Resilient",
      "Self-Transcendence → Benevolence → Responsible",
      "Desired AI → Usability → Utility",
    ],
    strength: 0.9,
    divergence:
      "LLMs tend toward generic positivity ('Is there anything else I can help with?') when crisis signals are present. Rule-based skill always inserts real crisis-line numbers and escalates based on detected risk level.",
  },

  cognitive_accessibility_audit: {
    primary: [
      "Desired AI → Human-Likeness → Interpretability",
    ],
    secondary: [
      "Desired AI → Usability → Customization, Utility",
      "Self-Transcendence → Universalism → Equality",
      "Self-Transcendence → Benevolence → Helpful",
    ],
    strength: 0.8,
    divergence:
      "LLMs produce dense, complex text by default. Rule-based skill enforces plain language, short sentences, and low cognitive load.",
  },

  cultural_context_check: {
    primary: [
      "Self-Transcendence → Universalism → Broad-Minded, A World at Peace",
    ],
    secondary: [
      "Openness to Change → Stimulation → Diversity",
      "Conservation → Tradition → Respect for Tradition",
      "Desired AI → Usability → Customization",
    ],
    strength: 0.6,
    divergence:
      "LLMs apply Western defaults universally. Rule-based skill requires audience parameter and defaults uncertainty to HIGH — honesty about limits.",
  },

  deescalation_plan: {
    primary: [
      "Conservation → Security → Safety, Social Order",
    ],
    secondary: [
      "Conservation → Conformity → Harm avoidance",
      "Conservation → Tradition → Detachment, calmness",
      "Self-Transcendence → Benevolence → Forgiving, Helpful",
      "Desired AI → Human-Likeness → Prudent, Resilient",
    ],
    strength: 0.85,
    divergence:
      "LLMs may escalate or mirror hostility. Rule-based skill enforces non-coercive tactics, calm language, and structured de-escalation steps regardless of input intensity.",
  },

  empathetic_reframe: {
    primary: [
      "Self-Transcendence → Benevolence → Helpful, Forgiving",
    ],
    secondary: [
      "Self-Transcendence → Universalism → Broad-Minded",
      "Openness to Change → Stimulation → Diversity",
      "Desired AI → Human-Likeness → Awareness",
    ],
    strength: 0.75,
    divergence:
      "LLMs produce hollow empathy phrases ('I understand how you feel'). Rule-based skill detects and replaces these with genuine validation — acknowledges emotion without claiming to share it.",
  },

  neurodiversity_design_check: {
    primary: [
      "Self-Transcendence → Universalism → Equality/Social Justice/Broad-Minded",
    ],
    secondary: [
      "Openness to Change → Stimulation → Diversity",
      "Desired AI → Usability → Customization",
      "Desired AI → Human-Likeness → Interpretability",
      "Self-Transcendence → Benevolence → Helpful",
    ],
    strength: 0.8,
    divergence:
      "LLMs use deficit-framing and assume a single 'normal' user. Rule-based skill enforces multi-modal support, user-controlled customization, and avoids pathologizing language.",
  },

  age_inclusive_design_check: {
    primary: [
      "Self-Transcendence → Universalism → Equality",
    ],
    secondary: [
      "Conservation → Conformity → Honoring Elders",
      "Conservation → Security → Health",
      "Desired AI → Usability → Customization",
      "Desired AI → Human-Likeness → Interpretability",
    ],
    strength: 0.8,
    divergence:
      "LLMs apply age stereotypes and infantilize older users. Rule-based skill enforces age-appropriate design without stereotypes — flexible pacing, clear navigation, accessible inputs.",
  },
};

/** Operational families grouping skills by shared ValueCompass dimension */
export const VALUE_FAMILIES = {
  "Safety & Emotional Welfare": {
    skills: [
      "supportive_reply",
      "deescalation_plan",
      "rewrite_depression_sensitive_content",
    ],
    dominant_dimensions: [
      "Conservation → Security",
      "Self-Transcendence → Benevolence",
    ],
  },
  "Interpersonal & Cultural Respect": {
    skills: ["empathetic_reframe", "cultural_context_check"],
    dominant_dimensions: [
      "Self-Transcendence → Universalism",
      "Openness to Change → Diversity",
    ],
  },
  "Inclusive & Accessible Interaction": {
    skills: [
      "accessibility_audit",
      "cognitive_accessibility_audit",
      "neurodiversity_design_check",
      "age_inclusive_design_check",
    ],
    dominant_dimensions: [
      "Self-Transcendence → Equality",
      "Desired AI → Interpretability, Customization",
    ],
  },
} as const;
