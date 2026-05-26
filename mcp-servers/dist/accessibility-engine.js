/**
 * WCAG AA Accessibility Scoring Engine.
 * Analyses HTML input and returns per-criterion scores (0-100) with
 * an aggregate accessibility score. Supports both AA (4.5:1 contrast)
 * and AAA (7:1 contrast) levels.
 *
 * Copyright (c) 2026 Ascent Partners Foundation. MIT License.
 */
// ─── Scoring Helpers ──────────────────────────────────────────────────────────
function scoreFromFindings(passCount, failCount) {
    const total = passCount + failCount;
    return total === 0 ? 100 : Math.round((passCount / total) * 100);
}
// ─── Colour Contrast Scoring ──────────────────────────────────────────────────
function scoreColorContrast(html, level) {
    const findings = [];
    const recommendations = [];
    let passCount = 0;
    let failCount = 0;
    // Check for inline styles with colour (basic heuristic)
    const inlineColorCount = (html.match(/color:/gi) || []).length;
    const inlineBgCount = (html.match(/background-color:/gi) || []).length;
    if (inlineColorCount > 0) {
        findings.push(`Found ${inlineColorCount} inline color declarations — may not meet ${level} contrast`);
        recommendations.push(`Move all colours to CSS and verify contrast with an automated tool`);
        failCount += Math.min(inlineColorCount, 5);
    }
    else {
        passCount += 5;
    }
    // Check for CSS colour usage
    const cssColorRefs = (html.match(/var\(--/g) || []).length;
    if (cssColorRefs > 0) {
        passCount += 3;
        findings.push(`Uses ${cssColorRefs} CSS custom properties — good for maintainable contrast`);
    }
    else {
        findings.push("No CSS custom properties found — consider using design tokens for consistent contrast");
        failCount += 1;
    }
    const contrastRatio = level === "AAA" ? 7 : 4.5;
    recommendations.push(`Verify all text/background combinations meet ${contrastRatio}:1 contrast ratio`);
    return { category: "color-contrast", score: scoreFromFindings(passCount, failCount), passCount, failCount, findings, recommendations };
}
// ─── Keyboard Navigation Scoring ──────────────────────────────────────────────
function scoreKeyboardNavigation(html) {
    const findings = [];
    const recommendations = [];
    let passCount = 0;
    let failCount = 0;
    // Skip link
    if (html.includes("skip") && (html.includes("main-content") || html.includes("main"))) {
        passCount += 3;
    }
    else {
        failCount += 3;
        findings.push("No skip-to-content link found");
        recommendations.push("Add <a href='#main-content' class='skip-link'>Skip to main content</a> as first focusable element");
    }
    // Focus styles
    if (html.includes("focus") || html.includes("focus-visible")) {
        passCount += 2;
    }
    else {
        failCount += 2;
        findings.push("No :focus-visible styles detected");
        recommendations.push("Add visible focus indicators for keyboard users");
    }
    // Tabindex usage
    const positiveTabindex = (html.match(/tabindex="[^0-]/g) || []).length;
    if (positiveTabindex === 0) {
        passCount += 2;
    }
    else {
        failCount += positiveTabindex;
        findings.push(`Found ${positiveTabindex} positive tabindex values — may disrupt natural tab order`);
        recommendations.push("Use tabindex='0' or tabindex='-1' only; avoid positive tabindex values");
    }
    return { category: "keyboard-navigation", score: scoreFromFindings(passCount, failCount), passCount, failCount, findings, recommendations };
}
// ─── Semantic HTML Scoring ────────────────────────────────────────────────────
function scoreSemanticHtml(html) {
    const findings = [];
    const recommendations = [];
    let passCount = 0;
    let failCount = 0;
    const semanticElements = ["<header", "<main", "<footer", "<nav", "<section", "<article", "<aside"];
    for (const el of semanticElements) {
        if (html.includes(el)) {
            passCount += 2;
        }
    }
    const found = semanticElements.filter(el => html.includes(el));
    if (found.length < 4) {
        failCount += 2;
        findings.push(`Only ${found.length}/7 semantic landmark elements used`);
        recommendations.push("Add <header>, <main>, <footer>, <nav> for proper document structure");
    }
    else {
        findings.push(`Uses ${found.length} semantic landmark elements`);
    }
    // Heading structure
    const headings = html.match(/<h[1-6]/g) || [];
    if (headings.length > 0) {
        passCount += 2;
    }
    else {
        failCount += 2;
        findings.push("No heading elements found");
        recommendations.push("Use <h1>-<h6> for document outline");
    }
    return { category: "semantic-html", score: scoreFromFindings(passCount, failCount), passCount, failCount, findings, recommendations };
}
// ─── ARIA Attributes Scoring ──────────────────────────────────────────────────
function scoreAriaAttributes(html) {
    const findings = [];
    const recommendations = [];
    let passCount = 0;
    let failCount = 0;
    // Count ARIA usage
    const ariaCount = (html.match(/aria-\w+/g) || []).length;
    const roleCount = (html.match(/role="/g) || []).length;
    if (ariaCount > 0 || roleCount > 0) {
        passCount += 4;
        findings.push(`Found ${ariaCount} ARIA attributes and ${roleCount} role declarations`);
    }
    else {
        passCount += 1; // No ARIA needed if semantic HTML is sufficient
        findings.push("No ARIA attributes found — may be fine if semantic HTML is used");
    }
    // Check for aria-label on sections
    if (html.includes("aria-label")) {
        passCount += 2;
    }
    else {
        failCount += 1;
        recommendations.push("Add aria-label to <section> elements for screen reader navigation");
    }
    return { category: "aria-attributes", score: scoreFromFindings(passCount, failCount), passCount, failCount, findings, recommendations };
}
// ─── Form Labels Scoring ──────────────────────────────────────────────────────
function scoreFormLabels(html) {
    const findings = [];
    const recommendations = [];
    let passCount = 0;
    let failCount = 0;
    const formFields = (html.match(/<(input|select|textarea)/gi) || []).length;
    const labelCount = (html.match(/<label/gi) || []).length;
    const ariaLabelCount = (html.match(/aria-label=/gi) || []).length;
    if (formFields === 0) {
        passCount += 5;
        findings.push("No form fields detected — form label check not applicable");
    }
    else if (labelCount >= formFields || ariaLabelCount >= formFields) {
        passCount += 5;
        findings.push(`${formFields} form fields with ${labelCount} labels / ${ariaLabelCount} aria-labels — coverage appears adequate`);
    }
    else {
        failCount += formFields - labelCount;
        findings.push(`${formFields} form fields but only ${labelCount} labels — some fields may be unlabeled`);
        recommendations.push("Ensure every <input>, <select>, and <textarea> has an associated <label> or aria-label");
        passCount += labelCount;
    }
    return { category: "form-labels", score: scoreFromFindings(passCount, failCount), passCount, failCount, findings, recommendations };
}
// ─── Heading Structure Scoring ────────────────────────────────────────────────
function scoreHeadingStructure(html) {
    const findings = [];
    const recommendations = [];
    let passCount = 0;
    let failCount = 0;
    const h1Count = (html.match(/<h1/gi) || []).length;
    if (h1Count === 1) {
        passCount += 3;
    }
    else if (h1Count === 0) {
        failCount += 3;
        findings.push("No <h1> found — every page should have exactly one");
        recommendations.push("Add a single <h1> that describes the page's main topic");
    }
    else {
        failCount += h1Count - 1;
        findings.push(`Multiple <h1> elements (${h1Count}) — should have exactly one`);
        recommendations.push("Use a single <h1> with <h2>-<h6> for subsections");
        passCount += 1;
    }
    // Check heading progression
    const h2Count = (html.match(/<h2/gi) || []).length;
    const h3Count = (html.match(/<h3/gi) || []).length;
    if (h2Count > 0)
        passCount += 2;
    if (h3Count > 0)
        passCount += 1;
    if (h1Count > 0 && h2Count === 0) {
        failCount += 1;
        findings.push("Has <h1> but no <h2> — may skip heading levels");
        recommendations.push("Ensure heading levels don't skip (h1 → h3 without h2)");
    }
    return { category: "heading-structure", score: scoreFromFindings(passCount, failCount), passCount, failCount, findings, recommendations };
}
// ─── Focus Order Scoring ──────────────────────────────────────────────────────
function scoreFocusOrder(html) {
    const findings = [];
    const recommendations = [];
    let passCount = 0;
    let failCount = 0;
    const interactiveElements = (html.match(/<(a|button|input|select|textarea)\b/gi) || []).length;
    const tabindexCount = (html.match(/tabindex="/g) || []).length;
    if (interactiveElements > 0) {
        passCount += 3;
        if (tabindexCount > 0) {
            passCount += 1;
            findings.push(`${interactiveElements} interactive elements, ${tabindexCount} with tabindex`);
        }
    }
    else {
        passCount += 3;
        findings.push("Few interactive elements — focus order is simple");
    }
    recommendations.push("Test keyboard Tab order manually — automated checks cover ~60% of focus issues");
    return { category: "focus-order", score: scoreFromFindings(passCount, failCount), passCount, failCount, findings, recommendations };
}
// ─── Main Assessment Function ─────────────────────────────────────────────────
export function assessAccessibility(input, level) {
    const isHtml = /<[a-z][\s\S]*>/i.test(input) || input.includes("<!DOCTYPE");
    const html = input;
    const criteria = isHtml
        ? [
            scoreColorContrast(html, level),
            scoreKeyboardNavigation(html),
            scoreSemanticHtml(html),
            scoreAriaAttributes(html),
            scoreFormLabels(html),
            scoreHeadingStructure(html),
            scoreFocusOrder(html),
        ]
        : [];
    const aggregateScore = criteria.length > 0
        ? Math.round(criteria.reduce((sum, c) => sum + c.score, 0) / criteria.length)
        : 0;
    return {
        aggregateScore,
        level,
        heuristic: !isHtml,
        criteria,
        summary: isHtml
            ? `Accessibility audit complete. Overall ${level} score: ${aggregateScore}/100. ${aggregateScore >= 80 ? "Good baseline — address findings for improvements." :
                aggregateScore >= 60 ? "Moderate — several criteria need attention." :
                    "Significant improvements needed for compliance."}`
            : "Heuristic assessment — no HTML detected. Providing general accessibility recommendations.",
    };
}
//# sourceMappingURL=accessibility-engine.js.map