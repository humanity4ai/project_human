export interface CrisisDetectionResult {
    detected: boolean;
    matchedPatterns: string[];
}
/**
 * Detect crisis signals (suicide/self-harm indicators) in text.
 * Returns matched patterns and a boolean flag.
 */
export declare function detectCrisisSignals(text: string): CrisisDetectionResult;
/**
 * Detect safety-legal signals (threat, harm, legal) in situation descriptions.
 * Used by deescalation_plan handler.
 */
export declare function detectSafetySignals(situation: string): boolean;
//# sourceMappingURL=crisis-detection.d.ts.map