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
];
/** Patterns that indicate urgency/pressure language */
export const URGENCY_PATTERNS = [
    "last chance",
    "act now",
    "don't miss out",
    "limited time",
];
/** Patterns that indicate high cognitive load demands */
export const COGNITIVE_LOAD_PATTERNS = [
    "please complete all",
    "required steps",
    "do not proceed unless",
];
/** Legal/technical jargon terms to detect */
export const JARGON_TERMS = [
    "pursuant",
    "notwithstanding",
    "thereto",
    "heretofore",
    "aforementioned",
    "herein",
];
/** Crisis/safety signal patterns — shared across all safety-critical handlers */
export const CRISIS_SIGNAL_PATTERNS = [
    "suicid",
    "self-harm",
    "end my life",
    "no point",
    "kill myself",
    "want to die",
    "better off dead",
    "take my life",
    "hurt myself",
    "cut myself",
    "end it all",
    "make it stop",
    "life isn't worth",
    "can't go on",
    "everyone would be better",
    "no point living",
    "can't cope",
    "can't take",
    "overwhelmed",
];
/** Stigma/discrimination patterns (depression) */
export const STIGMA_PATTERNS = [
    "crazy",
    "insane",
    "psycho",
    "nut",
    "loony",
    "weak",
    "weak minded",
    "weakness",
];
/** Medical claim patterns (depression — flag content making unsupported medical assertions) */
export const MEDICAL_CLAIM_PATTERNS = [
    "cure",
    "diagnos",
    "diagnosis",
    "diagnosed",
    "diagnosing",
    "prescri",
    "prescribe",
    "prescription",
    "prescribed",
    "medication without doctor",
    "home remedy",
    "guaranteed to treat",
];
/** Minimizing/invalidating patterns (depression + grief) */
export const MINIMIZING_PATTERNS = [
    "just get over it",
    "snap out of it",
    "it's all in your head",
    "just think positive",
    "make up your mind",
    "pull yourself together",
    "cheer up",
    "stop feeling sorry",
];
/** Judgmental language patterns (depression) */
export const JUDGMENTAL_PATTERNS = [
    "poor compliance",
    "non-compliant",
    "non compliant",
    "not trying",
    "lazy",
];
/** Stigmatizing verb patterns (depression — person is framed as victim/sufferer) */
export const STIGMATIZING_VERB_PATTERNS = [
    "suffering from",
    "afflicted with",
    "victim of",
    "depressive person",
];
/** Crisis language patterns (depression — specific stigmatizing crisis framing) */
export const CRISIS_LANGUAGE_PATTERNS = [
    "committed suicide",
];
/** Grief cliche patterns — platitudes that minimize or invalidate grief */
export const GRIEF_CLICHE_PATTERNS = [
    "they're in a better place",
    "they are in a better place",
    "time heals all wounds",
    "i know how you feel",
    "at least",
    "should be over it",
    "be strong",
    "move on",
    "it could be worse",
    "they lived a long life",
    "god has a plan",
    "everything happens for a reason",
];
/** Grief rushing patterns — language that pressures the bereaved */
export const GRIEF_RUSHING_PATTERNS = [
    "should be over it",
    "move on",
    "time heals",
    "get over it",
    "get past this",
];
/** Supportive conversation — emotion category: fear/anxiety */
export const FEAR_ANXIETY_PATTERNS = [
    "scared",
    "terrified",
    "anxious",
    "worried",
    "afraid",
    "nervous",
    "panic",
];
/** Supportive conversation — emotion category: sadness/grief */
export const SADNESS_GRIEF_PATTERNS = [
    "sad",
    "grief",
    "loss",
    "crying",
    "heartbroken",
    "devastated",
    "miss",
    "missing",
];
/** Supportive conversation — emotion category: anger/frustration */
export const ANGER_FRUSTRATION_PATTERNS = [
    "angry",
    "furious",
    "frustrated",
    "annoyed",
    "irritated",
    "rage",
    "mad",
];
/** Supportive conversation — emotion category: loneliness/isolation */
export const LONELINESS_ISOLATION_PATTERNS = [
    "lonely",
    "alone",
    "isolated",
    "nobody",
    "no one",
    "disconnected",
    "abandoned",
];
/** Supportive conversation — emotion category: shame/guilt */
export const SHAME_GUILT_PATTERNS = [
    "ashamed",
    "guilty",
    "embarrassed",
    "humiliated",
    "regret",
    "my fault",
    "i should have",
];
/** Supportive conversation — emotion category: love/connection */
export const LOVE_CONNECTION_PATTERNS = [
    "love",
    "grateful",
    "thankful",
    "appreciate",
    "connected",
    "supported",
    "cared for",
];
/** Supportive conversation — boundary violation patterns (content that oversteps) */
export const BOUNDARY_VIOLATION_PATTERNS = [
    "you should",
    "you need to listen",
    "i promise",
    "i guarantee",
    "trust me",
    "believe me",
    "you'll be fine",
    "it's not that bad",
    "don't worry",
    "calm down",
    "relax",
    "stop overreacting",
];
/** Blame/failure patterns for empathetic reframe */
export const BLAME_PATTERNS = [
    /you failed/gi,
    /you must/gi,
    /unfortunately/gi,
    /we cannot/gi,
    /we don'?t/gi,
    /your (issue|problem|complaint)/gi,
    /as per our policy/gi,
];
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
];
//# sourceMappingURL=patterns.js.map