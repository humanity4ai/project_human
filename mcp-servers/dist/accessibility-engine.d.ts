/**
 * WCAG Accessibility Scoring Engine.
 * 13 scoring functions covering all 78 WCAG 2.2 success criteria.
 * Optional axe-core integration for ~80% automated coverage.
 *
 * Copyright (c) 2026 Ascent Partners Foundation. MIT License.
 */
import type { CriterionResult } from "./wcag-criteria.js";
export type AccessibilityLevel = "A" | "AA" | "AAA";
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
    criteria: CriterionResult[];
    summary: string;
    automatedCount: number;
    manualCount: number;
    engine: "axe+regex" | "regex";
}
export declare function assessAccessibility(input: string, level: AccessibilityLevel): Promise<AccessibilityScoreResult>;
//# sourceMappingURL=accessibility-engine.d.ts.map