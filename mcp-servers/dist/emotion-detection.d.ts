export interface EmotionDetectionResult {
    category: string;
    confidence: number;
    matched: string[];
}
/**
 * Detect the dominant emotion in text.
 * Returns the best-matching category with pattern matches and confidence.
 */
export declare function detectEmotion(text: string): EmotionDetectionResult;
//# sourceMappingURL=emotion-detection.d.ts.map