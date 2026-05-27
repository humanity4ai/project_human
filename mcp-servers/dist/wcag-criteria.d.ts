/**
 * WCAG 2.2 Criteria Map — single source of truth for accessibility_audit tool.
 * All 78 unique success criteria across 4 POUR principles.
 * Each criterion includes an axeRule field for axe-core integration.
 *
 * Copyright (c) 2026 Ascent Partners Foundation. MIT License.
 */
export type WcagLevel = "A" | "AA" | "AAA";
export type WcagPrinciple = "perceivable" | "operable" | "understandable" | "robust";
export type Automatable = "yes" | "partial" | "no";
export interface WcagCriterion {
    id: string;
    title: string;
    level: WcagLevel;
    principle: WcagPrinciple;
    automatable: Automatable;
    requirement: string;
    implementation: string;
    axeRule: string | null;
}
export interface CriterionResult {
    id: string;
    title: string;
    level: WcagLevel;
    principle: WcagPrinciple;
    automatable: Automatable;
    score?: number;
    passCount?: number;
    failCount?: number;
    findings?: string[];
    recommendations?: string[];
    manualReason?: string;
}
export interface ChecklistItem {
    id: string;
    title: string;
    level: WcagLevel;
    principle: WcagPrinciple;
    requirement: string;
    implementation: string;
}
export declare const WCAG_CRITERIA: WcagCriterion[];
export declare function getChecklist(level: WcagLevel): ChecklistItem[];
export declare function criteriaByLevel(level: WcagLevel): WcagCriterion[];
export declare const ALL_CRITERIA: WcagCriterion[];
export declare const AXE_COVERED_CRITERIA: WcagCriterion[];
//# sourceMappingURL=wcag-criteria.d.ts.map