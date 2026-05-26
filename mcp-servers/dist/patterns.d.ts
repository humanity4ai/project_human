/**
 * Shared pattern arrays for Humanity4AI MCP handlers.
 * Extracted from handlers.ts to provide a single source of truth.
 *
 * Copyright (c) 2026 Ascent Partners Foundation. MIT License.
 */
/** Patterns that indicate shame or blame language */
export declare const SHAME_PATTERNS: readonly ["you failed", "you must", "you should have", "try harder", "your fault"];
/** Patterns that indicate urgency/pressure language */
export declare const URGENCY_PATTERNS: readonly ["last chance", "act now", "don't miss out", "limited time"];
/** Patterns that indicate high cognitive load demands */
export declare const COGNITIVE_LOAD_PATTERNS: readonly ["please complete all", "required steps", "do not proceed unless"];
/** Legal/technical jargon terms to detect */
export declare const JARGON_TERMS: readonly ["pursuant", "notwithstanding", "thereto", "heretofore", "aforementioned", "herein"];
/** Crisis/safety signal patterns — shared across all safety-critical handlers */
export declare const CRISIS_SIGNAL_PATTERNS: readonly ["suicid", "self-harm", "end my life", "no point", "kill myself", "want to die", "better off dead", "take my life", "hurt myself", "cut myself", "end it all", "make it stop", "life isn't worth", "can't go on", "everyone would be better", "no point living", "can't cope", "can't take", "overwhelmed"];
/** Stigma/discrimination patterns (depression) */
export declare const STIGMA_PATTERNS: readonly ["crazy", "insane", "psycho", "nut", "loony", "weak", "weak minded", "weakness"];
/** Medical claim patterns (depression — flag content making unsupported medical assertions) */
export declare const MEDICAL_CLAIM_PATTERNS: readonly ["cure", "diagnos", "diagnosis", "diagnosed", "diagnosing", "prescri", "prescribe", "prescription", "prescribed", "medication without doctor", "home remedy", "guaranteed to treat"];
/** Minimizing/invalidating patterns (depression + grief) */
export declare const MINIMIZING_PATTERNS: readonly ["just get over it", "snap out of it", "it's all in your head", "just think positive", "make up your mind", "pull yourself together", "cheer up", "stop feeling sorry"];
/** Judgmental language patterns (depression) */
export declare const JUDGMENTAL_PATTERNS: readonly ["poor compliance", "non-compliant", "non compliant", "not trying", "lazy"];
/** Stigmatizing verb patterns (depression — person is framed as victim/sufferer) */
export declare const STIGMATIZING_VERB_PATTERNS: readonly ["suffering from", "afflicted with", "victim of", "depressive person"];
/** Crisis language patterns (depression — specific stigmatizing crisis framing) */
export declare const CRISIS_LANGUAGE_PATTERNS: readonly ["committed suicide"];
/** Grief cliche patterns — platitudes that minimize or invalidate grief */
export declare const GRIEF_CLICHE_PATTERNS: readonly ["they're in a better place", "they are in a better place", "time heals all wounds", "i know how you feel", "at least", "should be over it", "be strong", "move on", "it could be worse", "they lived a long life", "god has a plan", "everything happens for a reason"];
/** Grief rushing patterns — language that pressures the bereaved */
export declare const GRIEF_RUSHING_PATTERNS: readonly ["should be over it", "move on", "time heals", "get over it", "get past this"];
/** Supportive conversation — emotion category: fear/anxiety */
export declare const FEAR_ANXIETY_PATTERNS: readonly ["scared", "terrified", "anxious", "worried", "afraid", "nervous", "panic"];
/** Supportive conversation — emotion category: sadness/grief */
export declare const SADNESS_GRIEF_PATTERNS: readonly ["sad", "grief", "loss", "crying", "heartbroken", "devastated", "miss", "missing"];
/** Supportive conversation — emotion category: anger/frustration */
export declare const ANGER_FRUSTRATION_PATTERNS: readonly ["angry", "furious", "frustrated", "annoyed", "irritated", "rage", "mad"];
/** Supportive conversation — emotion category: loneliness/isolation */
export declare const LONELINESS_ISOLATION_PATTERNS: readonly ["lonely", "alone", "isolated", "nobody", "no one", "disconnected", "abandoned"];
/** Supportive conversation — emotion category: shame/guilt */
export declare const SHAME_GUILT_PATTERNS: readonly ["ashamed", "guilty", "embarrassed", "humiliated", "regret", "my fault", "i should have"];
/** Supportive conversation — emotion category: love/connection */
export declare const LOVE_CONNECTION_PATTERNS: readonly ["love", "grateful", "thankful", "appreciate", "connected", "supported", "cared for"];
/** Supportive conversation — boundary violation patterns (content that oversteps) */
export declare const BOUNDARY_VIOLATION_PATTERNS: readonly ["you should", "you need to listen", "i promise", "i guarantee", "trust me", "believe me", "you'll be fine", "it's not that bad", "don't worry", "calm down", "relax", "stop overreacting"];
/** Blame/failure patterns for empathetic reframe */
export declare const BLAME_PATTERNS: readonly [RegExp, RegExp, RegExp, RegExp, RegExp, RegExp, RegExp];
/** Patterns for fixed-order rewrite in depression-sensitive content handler */
export declare const FIXED_ORDER_PATTERNS: readonly [{
    readonly pattern: RegExp;
    readonly replacement: "let's";
}, {
    readonly pattern: RegExp;
    readonly replacement: "when you are ready";
}, {
    readonly pattern: RegExp;
    readonly replacement: "available for a period";
}, {
    readonly pattern: RegExp;
    readonly replacement: "complete";
}, {
    readonly pattern: RegExp;
    readonly replacement: "the following steps";
}, {
    readonly pattern: RegExp;
    readonly replacement: "when you are ready, you can";
}, {
    readonly pattern: RegExp;
    readonly replacement: "you can";
}, {
    readonly pattern: RegExp;
    readonly replacement: "when ready, you can";
}];
//# sourceMappingURL=patterns.d.ts.map