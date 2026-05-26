/**
 * Shared crisis signal detection for Humanity4AI MCP handlers.
 * Called by empathetic_reframe, deescalation_plan, and
 * rewrite_depression_sensitive_content to ensure consistent
 * crisis detection behaviour across all handlers.
 *
 * Copyright (c) 2026 Ascent Partners Foundation. MIT License.
 */
import { CRISIS_SIGNAL_PATTERNS } from "./patterns.js";
/**
 * Detect crisis signals (suicide/self-harm indicators) in text.
 * Returns matched patterns and a boolean flag.
 */
export function detectCrisisSignals(text) {
    if (!text)
        return { detected: false, matchedPatterns: [] };
    const lower = text.toLowerCase();
    const matched = [];
    for (const pattern of CRISIS_SIGNAL_PATTERNS) {
        if (lower.includes(pattern)) {
            matched.push(pattern);
        }
    }
    return {
        detected: matched.length > 0,
        matchedPatterns: matched,
    };
}
/**
 * Detect safety-legal signals (threat, harm, legal) in situation descriptions.
 * Used by deescalation_plan handler.
 */
export function detectSafetySignals(situation) {
    if (!situation)
        return false;
    const lower = situation.toLowerCase();
    return (lower.includes("threat") ||
        lower.includes("harm") ||
        lower.includes("legal"));
}
//# sourceMappingURL=crisis-detection.js.map