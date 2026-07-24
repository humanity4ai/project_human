/**
 * Humanity4AI Taxonomy — canonical category slugs
 *
 * This is the programmatic source of truth for category slugs.
 * The human-readable documentation lives at taxonomy.md.
 * Both files MUST stay in sync — changes to categories require
 * updating both this file and taxonomy.md.
 *
 * Copyright (c) 2026 Ascent Partners Foundation. MIT License.
 */

export const CATEGORY_SLUGS = [
  "accessibility",
  "emotional-safety",
  "communication",
  "cognitive-support",
  "cultural-context",
  "conflict-navigation",
  "inclusive-design",
  "lifecycle-support",
  "neurodiversity",
  "age-inclusion",
] as const;

export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

export const ESCALATION_REQUIRED_SKILLS = [
  "supportive-conversation",
  "depression-sensitive-content",
] as const;

export type EscalationRequiredSkill =
  (typeof ESCALATION_REQUIRED_SKILLS)[number];
