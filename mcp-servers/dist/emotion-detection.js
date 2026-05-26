/**
 * Shared emotion detection for Humanity4AI MCP handlers.
 * Called by supportive_reply to auto-detect emotional content
 * and adapt responses accordingly.
 *
 * Copyright (c) 2026 Ascent Partners Foundation. MIT License.
 */
import { FEAR_ANXIETY_PATTERNS, SADNESS_GRIEF_PATTERNS, ANGER_FRUSTRATION_PATTERNS, LONELINESS_ISOLATION_PATTERNS, SHAME_GUILT_PATTERNS, LOVE_CONNECTION_PATTERNS, } from "./patterns.js";
/**
 * Detect the dominant emotion in text.
 * Returns the best-matching category with pattern matches and confidence.
 */
export function detectEmotion(text) {
    if (!text) {
        return { category: "none", confidence: 0, matched: [] };
    }
    const lower = text.toLowerCase();
    const categories = [
        ["fear_anxiety", FEAR_ANXIETY_PATTERNS],
        ["sadness_grief", SADNESS_GRIEF_PATTERNS],
        ["anger_frustration", ANGER_FRUSTRATION_PATTERNS],
        ["loneliness_isolation", LONELINESS_ISOLATION_PATTERNS],
        ["shame_guilt", SHAME_GUILT_PATTERNS],
        ["love_connection", LOVE_CONNECTION_PATTERNS],
    ];
    let bestCategory = "none";
    let bestMatchCount = 0;
    let bestMatched = [];
    for (const [category, patterns] of categories) {
        const matched = [];
        for (const p of patterns) {
            if (lower.includes(p)) {
                matched.push(p);
            }
        }
        if (matched.length > bestMatchCount) {
            bestMatchCount = matched.length;
            bestCategory = category;
            bestMatched = matched;
        }
    }
    // Confidence is capped at 1.0
    const confidence = Math.min(bestMatchCount / 5, 1.0);
    return {
        category: bestCategory,
        confidence,
        matched: bestMatched,
    };
}
//# sourceMappingURL=emotion-detection.js.map