/**
 * Shared pattern arrays for Humanity4AI MCP handlers.
 * Extracted from handlers.ts to provide a single source of truth.
 *
 * Copyright (c) 2026 Ascent Partners Foundation. MIT License.
 */

/** Patterns that indicate shame or blame language */
export const SHAME_PATTERNS = [
  "you failed",
  "you must",
  "you should have",
  "try harder",
  "your fault",
] as const;

/** Patterns that indicate urgency/pressure language */
export const URGENCY_PATTERNS = [
  "last chance",
  "act now",
  "don't miss out",
  "limited time",
] as const;

/** Patterns that indicate high cognitive load demands */
export const COGNITIVE_LOAD_PATTERNS = [
  "please complete all",
  "required steps",
  "do not proceed unless",
] as const;

/** Legal/technical jargon terms to detect */
export const JARGON_TERMS = [
  "pursuant",
  "notwithstanding",
  "thereto",
  "heretofore",
  "aforementioned",
  "herein",
] as const;

/** Crisis/safety signal patterns — shared across all safety-critical handlers */
export const CRISIS_SIGNAL_PATTERNS = [
  "suicid",
  "self-harm",
  "end my life",
  "no point",
  "kill myself",
  "want to die",
  "better off dead",
] as const;

/** Blame/failure patterns for empathetic reframe */
export const BLAME_PATTERNS = [
  /you failed/gi,
  /you must/gi,
  /unfortunately/gi,
  /we cannot/gi,
  /we don'?t/gi,
  /your (issue|problem|complaint)/gi,
  /as per our policy/gi,
] as const;

/** Patterns for fixed-order rewrite in depression-sensitive content handler */
export const FIXED_ORDER_PATTERNS = [
  { pattern: /you (failed|must|should have)/gi, replacement: "let's" },
  { pattern: /last chance|act now/gi, replacement: "when you are ready" },
  { pattern: /limited time/gi, replacement: "available for a period" },
  { pattern: /please complete all/gi, replacement: "complete" },
  { pattern: /required steps/gi, replacement: "the following steps" },
  { pattern: /do not proceed unless/gi, replacement: "when you are ready, you can" },
  { pattern: /you must/gi, replacement: "you can" },
  { pattern: /you need to/gi, replacement: "when ready, you can" },
] as const;
