/**
 * WCAG AA Accessibility Scoring Engine.
 * Analyses HTML input and returns per-criterion scores (0-100) with
 * an aggregate accessibility score. Supports both AA (4.5:1 contrast)
 * and AAA (7:1 contrast) levels.
 *
 * Copyright (c) 2026 Ascent Partners Foundation. MIT License.
 */
export type AccessibilityLevel = "AA" | "AAA";
export interface CriterionScore {
    category: string;
    score: number;
    passCount: number;
    failCount: number;
    findings: string[];
    recommendations: string[];
}
export interface AccessibilityScoreResult {
    aggregateScore: number;
    level: AccessibilityLevel;
    heuristic: boolean;
    criteria: CriterionScore[];
    summary: string;
}
export declare function assessAccessibility(input: string, level: AccessibilityLevel): AccessibilityScoreResult;
//# sourceMappingURL=accessibility-engine.d.ts.map