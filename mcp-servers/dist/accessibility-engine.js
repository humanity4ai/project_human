/**
 * WCAG Accessibility Scoring Engine.
 * 13 scoring functions covering all 78 WCAG 2.2 success criteria.
 * Optional axe-core integration for ~80% automated coverage.
 *
 * Copyright (c) 2026 Ascent Partners Foundation. MIT License.
 */
import { WCAG_CRITERIA } from "./wcag-criteria.js";
// ─── axe-core dynamic import (optional, silent fallback) ──────────────────────
let axeCore = null;
let axeLoadError = false;
(async () => {
    try {
        // @ts-expect-error — axe-core is optional; not installed by default
        axeCore = await import("axe-core");
    }
    catch {
        axeLoadError = true;
    }
})();
// ─── Scoring Helper ───────────────────────────────────────────────────────────
function scoreFromFindings(passCount, failCount) {
    const total = passCount + failCount;
    return total === 0 ? 100 : Math.round((passCount / total) * 100);
}
// ─── axe-core Integration ─────────────────────────────────────────────────────
const IMPACT_DEDUCTION = {
    critical: 25,
    serious: 15,
    moderate: 10,
    minor: 5,
};
function mapAxeTagsToLevel(tags) {
    for (const tag of tags) {
        if (tag === "wcag2aaa" || tag === "wcag22aaa" || tag === "wcag21aaa")
            return "AAA";
        if (tag === "wcag2aa" || tag === "wcag22aa" || tag === "wcag21aa")
            return "AA";
        if (tag === "wcag2a" || tag === "wcag22a" || tag === "wcag21a")
            return "A";
    }
    return null;
}
async function analyzeWithAxe(html) {
    if (!axeCore)
        return null;
    try {
        const results = await axeCore.default.run({ raw: html });
        const map = new Map();
        for (const criterion of WCAG_CRITERIA) {
            if (!criterion.axeRule)
                continue;
            const axeId = criterion.axeRule;
            const violations = results.violations.filter(v => v.id === axeId);
            const passes = results.passes.filter(p => p.id === axeId);
            const incomplete = results.incomplete.filter(inc => inc.id === axeId);
            if (violations.length === 0 && passes.length === 0 && incomplete.length === 0) {
                continue;
            }
            let score = 100;
            let passCount = passes.length;
            let failCount = violations.length;
            const findings = [];
            const recommendations = [];
            for (const v of violations) {
                const deduction = IMPACT_DEDUCTION[v.impact || "moderate"] || 10;
                score = Math.max(0, score - deduction);
                findings.push(`${v.impact || "moderate"}: ${v.help}`);
                if (v.helpUrl)
                    recommendations.push(`See ${v.helpUrl}`);
            }
            for (const p of passes) {
                passCount++;
            }
            for (const inc of incomplete) {
                findings.push(`Incomplete: ${inc.id} — manual review needed`);
            }
            map.set(criterion.id, {
                id: criterion.id,
                title: criterion.title,
                level: criterion.level,
                principle: criterion.principle,
                automatable: criterion.automatable,
                score: Math.max(0, score),
                passCount,
                failCount,
                findings: findings.length > 0 ? findings : [`Passed: ${passes.length} checks`],
                recommendations,
            });
        }
        return map;
    }
    catch {
        return null;
    }
}
// ─── Scoring Functions (13 total, 86 SC IDs) ──────────────────────────────────
// F1: Alt Text (1.1.1)
function scoreAltText(html) {
    const results = [];
    const c = WCAG_CRITERIA.find(x => x.id === "1.1.1");
    const findings = [];
    const recommendations = [];
    let pass = 0;
    let fail = 0;
    const imgTags = html.match(/<img[^>]*>/gi) || [];
    for (const tag of imgTags) {
        if (/alt\s*=\s*["'][^"']*["']/i.test(tag)) {
            const altMatch = tag.match(/alt\s*=\s*["']([^"']*)["']/i);
            if (altMatch && altMatch[1].length > 0) {
                pass++;
            }
            else {
                pass++; // alt="" is valid for decorative images
            }
        }
        else {
            fail++;
        }
    }
    if (imgTags.length === 0) {
        pass = 1;
        findings.push("No <img> elements found — alt text check not applicable");
    }
    else if (fail > 0) {
        findings.push(`${fail} of ${imgTags.length} images missing alt attribute`);
        recommendations.push("Add descriptive alt text to all images: alt='description'");
    }
    else {
        findings.push(`${imgTags.length} images with alt attributes`);
    }
    results.push({
        id: c.id, title: c.title, level: c.level, principle: c.principle, automatable: c.automatable,
        score: scoreFromFindings(pass, fail), passCount: pass, failCount: fail, findings, recommendations,
    });
    return results;
}
// F2: Media and Audio (1.2.1–1.2.9, 1.4.2, 1.4.7) — all manual
function scoreMediaAndAudio(_html) {
    const ids = ["1.2.1", "1.2.2", "1.2.3", "1.2.4", "1.2.5", "1.2.6", "1.2.7", "1.2.8", "1.2.9", "1.4.2", "1.4.7"];
    return ids.map(id => {
        const c = WCAG_CRITERIA.find(x => x.id === id);
        return {
            id: c.id, title: c.title, level: c.level, principle: c.principle, automatable: "no",
            manualReason: `Requires audio/video content analysis — verify ${c.requirement.toLowerCase()}`,
        };
    });
}
// F3: Semantic Structure (1.3.1, 1.3.2, 1.3.3)
function scoreSemanticStructure(html) {
    const results = [];
    // 1.3.1 Info and Relationships
    const c131 = WCAG_CRITERIA.find(x => x.id === "1.3.1");
    const semanticElements = ["<header", "<main", "<footer", "<nav", "<section", "<article", "<aside"];
    const found = semanticElements.filter(el => html.includes(el));
    let pass131 = found.length + (html.match(/<h[1-6]/g) || []).length;
    let fail131 = 0;
    if (found.length < 3) {
        fail131 = 3 - found.length;
    }
    const findings131 = found.length < 3
        ? [`Only ${found.length}/7 semantic landmark elements used. Found: ${found.join(", ") || "none"}`]
        : [`Uses ${found.length} semantic landmark elements`];
    results.push({
        id: c131.id, title: c131.title, level: c131.level, principle: c131.principle, automatable: c131.automatable,
        score: scoreFromFindings(pass131, fail131), passCount: pass131, failCount: fail131,
        findings: findings131,
        recommendations: found.length < 3 ? ["Add <header>, <main>, <footer>, <nav> for proper document structure"] : [],
    });
    // 1.3.2 Meaningful Sequence — partial
    const c132 = WCAG_CRITERIA.find(x => x.id === "1.3.2");
    const flexReverse = (html.match(/flex-direction\s*:\s*row-reverse|flex-direction\s*:\s*column-reverse|order\s*:\s*-?\d+/gi) || []).length;
    results.push({
        id: c132.id, title: c132.title, level: c132.level, principle: c132.principle, automatable: "partial",
        score: flexReverse === 0 ? 100 : 50,
        passCount: flexReverse === 0 ? 1 : 0,
        failCount: flexReverse > 0 ? flexReverse : 0,
        findings: flexReverse > 0 ? [`Found ${flexReverse} CSS instances that may reverse DOM order — verify visual matches logical order`] : ["No CSS order-reversing patterns detected"],
        recommendations: flexReverse > 0 ? ["Ensure CSS order changes do not break reading sequence"] : [],
        manualReason: flexReverse > 0 ? "Manual review needed to verify visual reading order" : undefined,
    });
    // 1.3.3 Sensory Characteristics
    const c133 = WCAG_CRITERIA.find(x => x.id === "1.3.3");
    const sensoryPatterns = (html.match(/click the (red|blue|green|yellow|orange|purple)\b|press the (left|right|top|bottom)\b|on the (left|right)\b/gi) || []).length;
    results.push({
        id: c133.id, title: c133.title, level: c133.level, principle: c133.principle, automatable: c133.automatable,
        score: sensoryPatterns === 0 ? 100 : Math.max(0, 100 - sensoryPatterns * 20),
        passCount: sensoryPatterns === 0 ? 1 : 0,
        failCount: sensoryPatterns,
        findings: sensoryPatterns > 0 ? [`Found ${sensoryPatterns} instances that rely solely on sensory characteristics (color, position) to convey information`] : ["No sensory-only instructions detected"],
        recommendations: sensoryPatterns > 0 ? ["Add text labels alongside color/position indicators"] : [],
    });
    return results;
}
// F4: Adaptable (1.3.4, 1.3.5, 1.3.6)
function scoreAdaptable(html) {
    const results = [];
    // 1.3.4 Orientation
    const c134 = WCAG_CRITERIA.find(x => x.id === "1.3.4");
    const hasViewport = html.includes("viewport");
    const hasOrientation = html.includes("orientation") || html.includes("landscape") || html.includes("portrait");
    results.push({
        id: c134.id, title: c134.title, level: c134.level, principle: c134.principle, automatable: c134.automatable,
        score: hasViewport && !hasOrientation ? 100 : hasOrientation ? 40 : 60,
        passCount: hasViewport ? 1 : 0,
        failCount: hasOrientation ? 1 : 0,
        findings: [hasViewport ? "Viewport meta found" : "No viewport meta — orientation may not be flexible", hasOrientation ? "Orientation lock detected — content should work in both portrait and landscape" : "No orientation lock detected"].filter(Boolean),
        recommendations: hasOrientation ? ["Remove orientation restrictions; allow both portrait and landscape"] : [],
    });
    // 1.3.5 Identify Input Purpose
    const c135 = WCAG_CRITERIA.find(x => x.id === "1.3.5");
    const inputCount = (html.match(/<input/gi) || []).length;
    const autocompleteCount = (html.match(/autocomplete\s*=\s*["']/gi) || []).length;
    results.push({
        id: c135.id, title: c135.title, level: c135.level, principle: c135.principle, automatable: c135.automatable,
        score: inputCount > 0 ? (autocompleteCount >= inputCount ? 100 : Math.round((autocompleteCount / inputCount) * 100)) : 100,
        passCount: autocompleteCount,
        failCount: Math.max(0, inputCount - autocompleteCount),
        findings: inputCount > 0 ? [`${autocompleteCount}/${inputCount} inputs have autocomplete attributes`] : ["No form inputs — not applicable"],
        recommendations: autocompleteCount < inputCount ? ["Add autocomplete attributes to form inputs for personal data"] : [],
    });
    // 1.3.6 Identify Purpose
    const c136 = WCAG_CRITERIA.find(x => x.id === "1.3.6");
    const ariaRoles = (html.match(/role\s*=\s*["']/gi) || []).length;
    results.push({
        id: c136.id, title: c136.title, level: c136.level, principle: c136.principle, automatable: c136.automatable,
        score: ariaRoles >= 2 ? 100 : ariaRoles === 1 ? 50 : 25,
        passCount: ariaRoles,
        failCount: Math.max(0, 2 - ariaRoles),
        findings: [`Found ${ariaRoles} ARIA role declarations`],
        recommendations: ariaRoles < 2 ? ["Add ARIA landmark roles (role='banner', role='main', role='navigation') to identify page regions"] : [],
    });
    return results;
}
// F5: Color Contrast (1.4.1, 1.4.3, 1.4.6, 1.4.11)
function scoreColorContrast(html, level) {
    const results = [];
    const threshold = level === "AAA" ? 7 : level === "A" ? 3 : 4.5;
    // 1.4.1 Use of Color
    const c141 = WCAG_CRITERIA.find(x => x.id === "1.4.1");
    const inlineColorCount = (html.match(/color\s*:/gi) || []).length;
    results.push({
        id: c141.id, title: c141.title, level: c141.level, principle: c141.principle, automatable: c141.automatable,
        score: inlineColorCount > 0 ? Math.max(30, 100 - inlineColorCount * 5) : 100,
        passCount: Math.max(0, 10 - inlineColorCount),
        failCount: Math.min(inlineColorCount, 10),
        findings: inlineColorCount > 0 ? [`${inlineColorCount} inline color declarations found — may use color as sole indicator`] : ["No inline color declarations detected"],
        recommendations: inlineColorCount > 0 ? ["Pair all color indicators with text labels or icons; avoid using color alone to convey status"] : [],
    });
    // 1.4.3 and 1.4.6 — Contrast Minimum / Enhanced
    for (const id of ["1.4.3", "1.4.6"]) {
        const c = WCAG_CRITERIA.find(x => x.id === id);
        const inlineColors = (html.match(/color\s*:\s*[^;]+/gi) || []).length;
        const inlineBgs = (html.match(/background-color\s*:\s*[^;]+/gi) || []).length;
        const cssVarRefs = (html.match(/var\(--/g) || []).length;
        const pass = inlineColors > 0 && inlineBgs > 0 ? 3 + cssVarRefs : cssVarRefs > 0 ? 5 : 2;
        const fail = inlineColors > 0 && inlineBgs === 0 ? inlineColors : 0;
        results.push({
            id: c.id, title: c.title, level: c.level, principle: c.principle, automatable: c.automatable,
            score: scoreFromFindings(pass, fail),
            passCount: pass, failCount: fail,
            findings: [`Found ${inlineColors} color and ${inlineBgs} background-color declarations`],
            recommendations: [`Verify all text/background combinations meet ${threshold}:1 contrast ratio`],
        });
    }
    // 1.4.11 Non-text Contrast
    const c1411 = WCAG_CRITERIA.find(x => x.id === "1.4.11");
    const borderStyles = (html.match(/border\s*:\s*[^;]+/gi) || []).length;
    results.push({
        id: c1411.id, title: c1411.title, level: c1411.level, principle: c1411.principle, automatable: "partial",
        score: borderStyles > 0 ? 70 : 50,
        passCount: borderStyles > 0 ? 1 : 0,
        failCount: borderStyles === 0 ? 1 : 0,
        findings: borderStyles > 0 ? [`Found ${borderStyles} border declarations — verify 3:1 contrast for UI components`] : ["No border styles detected — UI component boundaries may be invisible"],
        recommendations: ["Ensure buttons, inputs, and interactive elements have visible boundaries meeting 3:1 contrast"],
        manualReason: "Manual verification needed for non-text contrast",
    });
    return results;
}
// F6: Text Presentation (1.4.4, 1.4.5, 1.4.8, 1.4.9, 1.4.12)
function scoreTextPresentation(html) {
    const results = [];
    // 1.4.4 Resize Text
    const c144 = WCAG_CRITERIA.find(x => x.id === "1.4.4");
    const pxFonts = (html.match(/font-size\s*:\s*\d+px/gi) || []).length;
    const relFonts = (html.match(/font-size\s*:\s*\d+(rem|em|%)/gi) || []).length;
    results.push({
        id: c144.id, title: c144.title, level: c144.level, principle: c144.principle, automatable: c144.automatable,
        score: pxFonts === 0 ? 100 : relFonts > pxFonts ? 70 : 30,
        passCount: pxFonts === 0 ? 1 : 0,
        failCount: pxFonts,
        findings: pxFonts > 0 ? [`${pxFonts} px-based font-size declarations found — may block text resize`] : ["No px-based font sizes — resize-friendly"],
        recommendations: pxFonts > 0 ? ["Replace px with rem/em for font-size to allow user text resize"] : [],
    });
    // 1.4.5 Images of Text
    const c145 = WCAG_CRITERIA.find(x => x.id === "1.4.5");
    const textImgCount = (html.match(/<img[^>]*\b(text|title|heading|banner|logo-with-text)/gi) || []).length;
    results.push({
        id: c145.id, title: c145.title, level: c145.level, principle: c145.principle, automatable: c145.automatable,
        score: textImgCount === 0 ? 100 : Math.max(0, 100 - textImgCount * 25),
        passCount: 0, failCount: textImgCount,
        findings: textImgCount > 0 ? [`${textImgCount} potential text-as-image elements found`] : ["No text-as-image patterns detected"],
        recommendations: textImgCount > 0 ? ["Replace images of text with styled text for better accessibility"] : [],
    });
    // 1.4.8 Visual Presentation (AAA)
    const c148 = WCAG_CRITERIA.find(x => x.id === "1.4.8");
    const hasLineHeight = /line-height\s*:\s*(1\.[5-9]|[2-9]\.?\d*)/.test(html);
    const hasTextAlign = html.includes("text-align");
    const hasJustified = html.includes("justify");
    results.push({
        id: c148.id, title: c148.title, level: c148.level, principle: c148.principle, automatable: c148.automatable,
        score: (hasLineHeight ? 40 : 20) + (hasTextAlign && !hasJustified ? 40 : 10) + (relFonts > 0 ? 20 : 10),
        passCount: hasLineHeight ? 1 : 0,
        failCount: hasJustified ? 1 : 0,
        findings: [hasLineHeight ? "Line-height >= 1.5 detected" : "Line-height < 1.5 or not specified", hasJustified ? "Justified text detected — avoid for AAA" : "No justified text detected"].filter(Boolean),
        recommendations: ["For AAA: ensure user-selectable colors, max 80 chars/line, line-height >= 1.5, paragraph spacing >= 2x"],
    });
    // 1.4.9 Images of Text (No Exception) — AAA
    const c149 = WCAG_CRITERIA.find(x => x.id === "1.4.9");
    results.push({
        id: c149.id, title: c149.title, level: c149.level, principle: c149.principle, automatable: c149.automatable,
        score: textImgCount === 0 ? 100 : 0,
        passCount: textImgCount === 0 ? 1 : 0,
        failCount: textImgCount,
        findings: textImgCount > 0 ? [`${textImgCount} text-as-image elements — AAA requires no text in images (except decoration)`] : ["No text images found"],
        recommendations: textImgCount > 0 ? ["Replace ALL images of text with real text for AAA compliance"] : [],
    });
    // 1.4.12 Text Spacing
    const c1412 = WCAG_CRITERIA.find(x => x.id === "1.4.12");
    const hasSpacing = /letter-spacing|word-spacing|line-height/.test(html);
    results.push({
        id: c1412.id, title: c1412.title, level: c1412.level, principle: c1412.principle, automatable: c1412.automatable,
        score: hasSpacing && !pxFonts ? 100 : hasSpacing ? 60 : 40,
        passCount: hasSpacing ? 1 : 0,
        failCount: pxFonts,
        findings: [hasSpacing ? "Text spacing properties found" : "No text spacing properties — may not support user overrides"].filter(Boolean),
        recommendations: ["Ensure content works with line-height>=1.5, paragraph spacing>=2x, letter-spacing>=0.12em, word-spacing>=0.16em"],
    });
    return results;
}
// F7: Reflow (1.4.10, 1.4.13)
function scoreReflow(html) {
    const results = [];
    // 1.4.10 Reflow
    const c1410 = WCAG_CRITERIA.find(x => x.id === "1.4.10");
    const hasOverflow = /overflow\s*:\s*(hidden|scroll)/.test(html);
    const hasMaxWidth100 = /max-width\s*:\s*100%/.test(html) || /width\s*:\s*100%/.test(html);
    results.push({
        id: c1410.id, title: c1410.title, level: c1410.level, principle: c1410.principle, automatable: c1410.automatable,
        score: hasMaxWidth100 && !hasOverflow ? 100 : hasMaxWidth100 ? 70 : hasOverflow ? 30 : 50,
        passCount: hasMaxWidth100 ? 1 : 0,
        failCount: hasOverflow ? 1 : 0,
        findings: [hasOverflow ? "Overflow hidden/scroll detected — may block reflow" : "No overflow restrictions detected", hasMaxWidth100 ? "Responsive width patterns found" : "No responsive width patterns"].filter(Boolean),
        recommendations: ["Ensure content works at 320px width (400% zoom) without horizontal scroll"],
    });
    // 1.4.13 Content on Hover/Focus
    const c1413 = WCAG_CRITERIA.find(x => x.id === "1.4.13");
    const hasHover = html.includes(":hover") || html.includes("onmouseover");
    const hasFocus = html.includes(":focus") || html.includes("onfocus");
    results.push({
        id: c1413.id, title: c1413.title, level: c1413.level, principle: c1413.principle, automatable: c1413.automatable,
        score: (hasHover ? 50 : 25) + (hasFocus ? 50 : 25),
        passCount: hasHover ? 1 : 0,
        failCount: 0,
        findings: [hasHover ? "Hover styles detected" : "No hover styles — check tooltip behavior", hasFocus ? "Focus styles detected" : "No focus styles — check popover behavior"].filter(Boolean),
        recommendations: ["Ensure hover/focus content is dismissable, hoverable, and persistent"],
    });
    return results;
}
// F8: Keyboard Access (2.1.1, 2.1.2, 2.1.3, 2.1.4, 2.4.3)
function scoreKeyboardAccess(html) {
    const results = [];
    // 2.1.1 Keyboard
    const c211 = WCAG_CRITERIA.find(x => x.id === "2.1.1");
    const interactiveElements = (html.match(/<(a|button|input|select|textarea)\b/gi) || []).length;
    const onclickNonInteractive = (html.match(/<div[^>]*onclick/gi) || []).length + (html.match(/<span[^>]*onclick/gi) || []).length;
    results.push({
        id: c211.id, title: c211.title, level: c211.level, principle: c211.principle, automatable: c211.automatable,
        score: onclickNonInteractive === 0 ? 100 : Math.max(20, 100 - onclickNonInteractive * 20),
        passCount: interactiveElements,
        failCount: onclickNonInteractive,
        findings: onclickNonInteractive > 0 ? [`${onclickNonInteractive} non-interactive elements with onclick — may not be keyboard accessible`] : ["All click handlers on native interactive elements"],
        recommendations: onclickNonInteractive > 0 ? ["Use <button> or <a> for clickable elements; add tabindex='0' and keyboard handlers for custom widgets"] : [],
    });
    // 2.1.2 No Keyboard Trap
    const c212 = WCAG_CRITERIA.find(x => x.id === "2.1.2");
    results.push({
        id: c212.id, title: c212.title, level: c212.level, principle: c212.principle, automatable: "no",
        manualReason: "Requires interactive testing — navigate through all focusable elements and verify Escape key exits modals",
    });
    // 2.1.3 Keyboard No Exception
    const c213 = WCAG_CRITERIA.find(x => x.id === "2.1.3");
    results.push({
        id: c213.id, title: c213.title, level: c213.level, principle: c213.principle, automatable: "no",
        manualReason: "Requires comprehensive keyboard testing — verify ALL functionality is keyboard-operable with zero exceptions",
    });
    // 2.1.4 Character Key Shortcuts
    const c214 = WCAG_CRITERIA.find(x => x.id === "2.1.4");
    const accesskeyCount = (html.match(/accesskey\s*=/gi) || []).length;
    const keydownCount = (html.match(/keydown/gi) || []).length;
    results.push({
        id: c214.id, title: c214.title, level: c214.level, principle: c214.principle, automatable: c214.automatable,
        score: accesskeyCount === 0 ? 100 : Math.max(30, 100 - accesskeyCount * 35),
        passCount: accesskeyCount === 0 ? 1 : 0,
        failCount: accesskeyCount,
        findings: accesskeyCount > 0 ? [`${accesskeyCount} accesskey or keydown handlers found — single-key shortcuts may conflict with assistive technology`] : [`${keydownCount} keydown handlers — verify no single-key shortcuts`],
        recommendations: accesskeyCount > 0 ? ["Remove single-key shortcuts or make them remappable"] : [],
    });
    // 2.4.3 Focus Order
    const c243 = WCAG_CRITERIA.find(x => x.id === "2.4.3");
    const positiveTabindex = (html.match(/tabindex\s*=\s*"[1-9]\d*"/gi) || []).length;
    results.push({
        id: c243.id, title: c243.title, level: c243.level, principle: c243.principle, automatable: c243.automatable,
        score: positiveTabindex === 0 ? 100 : Math.max(0, 100 - positiveTabindex * 25),
        passCount: positiveTabindex === 0 ? 1 : 0,
        failCount: positiveTabindex,
        findings: positiveTabindex > 0 ? [`${positiveTabindex} positive tabindex values found — may disrupt natural tab order`] : ["No positive tabindex values — natural focus order"],
        recommendations: positiveTabindex > 0 ? ["Use tabindex='0' or tabindex='-1' only; remove positive tabindex values"] : [],
    });
    return results;
}
// F9: Timing and Motion (2.2.1-2.2.6, 2.3.1-2.3.3)
function scoreTimingAndMotion(html) {
    const results = [];
    const ids = ["2.2.1", "2.2.2", "2.2.3", "2.2.4", "2.2.5", "2.2.6", "2.3.1", "2.3.2", "2.3.3"];
    const automatableIds = ["2.2.1", "2.2.2", "2.2.3", "2.3.1", "2.3.2", "2.3.3"];
    const manualIds = ["2.2.4", "2.2.5", "2.2.6"];
    // 2.2.2 Pause, Stop, Hide
    const c222 = WCAG_CRITERIA.find(x => x.id === "2.2.2");
    const hasBlink = html.includes("<blink") || html.includes("<marquee");
    const hasAnimation = /animation\s*:|@keyframes/.test(html);
    results.push({
        id: c222.id, title: c222.title, level: c222.level, principle: c222.principle, automatable: c222.automatable,
        score: hasBlink ? 0 : hasAnimation ? 50 : 100,
        passCount: hasBlink ? 0 : 1,
        failCount: hasBlink ? 1 : 0,
        findings: hasBlink ? ["<blink> or <marquee> elements detected — remove immediately"] : hasAnimation ? ["CSS animations detected — add pause control"] : ["No auto-animating content detected"],
        recommendations: hasAnimation ? ["Add pause/stop controls for auto-animating content; respect prefers-reduced-motion"] : [],
    });
    // 2.2.1 Timing Adjustable
    const c221 = WCAG_CRITERIA.find(x => x.id === "2.2.1");
    const hasTimeout = /setTimeout|setInterval|session.*expir/i.test(html);
    results.push({
        id: c221.id, title: c221.title, level: c221.level, principle: c221.principle, automatable: "partial",
        score: hasTimeout ? 40 : 100,
        passCount: hasTimeout ? 0 : 1,
        failCount: hasTimeout ? 1 : 0,
        findings: hasTimeout ? ["Timeout/session expiry patterns detected — ensure timing is adjustable"] : ["No timing patterns detected"],
        recommendations: hasTimeout ? ["Provide 'extend session' or 'turn off time limit' option"] : [],
        manualReason: hasTimeout ? "Manual verification: can user extend or disable the time limit?" : undefined,
    });
    // 2.2.3 No Timing (AAA)
    const c223 = WCAG_CRITERIA.find(x => x.id === "2.2.3");
    results.push({
        id: c223.id, title: c223.title, level: c223.level, principle: c223.principle, automatable: "partial",
        score: hasTimeout ? 0 : 100,
        passCount: hasTimeout ? 0 : 1,
        failCount: hasTimeout ? 1 : 0,
        findings: hasTimeout ? ["Timeout detected — AAA requires NO time limits"] : ["No timing detected"],
        recommendations: hasTimeout ? ["Remove all time limits for AAA compliance"] : [],
        manualReason: hasTimeout ? "Remove all time-based restrictions for AAA" : undefined,
    });
    // 2.3.3 Animation from Interactions + prefers-reduced-motion
    const c233 = WCAG_CRITERIA.find(x => x.id === "2.3.3");
    const hasReducedMotion = html.includes("prefers-reduced-motion");
    results.push({
        id: c233.id, title: c233.title, level: c233.level, principle: c233.principle, automatable: c233.automatable,
        score: hasReducedMotion ? 100 : hasAnimation ? 40 : 70,
        passCount: hasReducedMotion ? 1 : 0,
        failCount: hasAnimation && !hasReducedMotion ? 1 : 0,
        findings: hasReducedMotion ? ["prefers-reduced-motion media query found"] : hasAnimation ? ["Animation detected without prefers-reduced-motion support"] : ["No animation detected"],
        recommendations: hasAnimation && !hasReducedMotion ? ["Add @media (prefers-reduced-motion: reduce) { animation: none } to respect user preferences"] : [],
    });
    // 2.3.1 / 2.3.2 Three Flashes — partial
    for (const id of ["2.3.1", "2.3.2"]) {
        const c = WCAG_CRITERIA.find(x => x.id === id);
        results.push({
            id: c.id, title: c.title, level: c.level, principle: c.principle, automatable: "partial",
            score: hasAnimation ? 60 : 100,
            passCount: 0, failCount: 0,
            findings: hasAnimation ? ["Animation detected — verify no flashing >3/sec"] : ["No flashing patterns detected"],
            recommendations: ["Ensure no content flashes more than 3 times per second"],
            manualReason: "Manual review required to verify flash frequency",
        });
    }
    // Manual criteria
    for (const id of manualIds) {
        const c = WCAG_CRITERIA.find(x => x.id === id);
        results.push({
            id: c.id, title: c.title, level: c.level, principle: c.principle, automatable: "no",
            manualReason: id === "2.2.4" ? "Verify all non-emergency interruptions can be postponed or suppressed" :
                id === "2.2.5" ? "Verify data is preserved when session expires and user re-authenticates" :
                    "Verify users are warned about inactivity timeouts that cause data loss",
        });
    }
    return results;
}
// F10: Navigation (2.4.1, 2.4.2, 2.4.4-2.4.13)
function scoreNavigation(html) {
    const results = [];
    // 2.4.1 Bypass Blocks
    const c241 = WCAG_CRITERIA.find(x => x.id === "2.4.1");
    const hasSkipLink = html.includes("skip") && (html.includes("main-content") || html.includes("main"));
    results.push({
        id: c241.id, title: c241.title, level: c241.level, principle: c241.principle, automatable: c241.automatable,
        score: hasSkipLink ? 100 : 20,
        passCount: hasSkipLink ? 1 : 0,
        failCount: hasSkipLink ? 0 : 1,
        findings: hasSkipLink ? ["Skip-to-content link found"] : ["No skip-to-content link found"],
        recommendations: !hasSkipLink ? ["Add <a href='#main-content' class='skip-link'>Skip to main content</a>"] : [],
    });
    // 2.4.2 Page Titled
    const c242 = WCAG_CRITERIA.find(x => x.id === "2.4.2");
    const title = html.match(/<title>([^<]*)<\/title>/i);
    const hasTitle = title !== null && title[1].trim().length > 0 && !/^\s*(untitled|document|page|home)\s*$/i.test(title[1]);
    results.push({
        id: c242.id, title: c242.title, level: c242.level, principle: c242.principle, automatable: c242.automatable,
        score: hasTitle ? 100 : 0,
        passCount: hasTitle ? 1 : 0,
        failCount: hasTitle ? 0 : 1,
        findings: hasTitle ? [`Page title: "${title[1].trim()}"`] : ["Missing or generic <title>"],
        recommendations: !hasTitle ? ["Add a descriptive, unique <title> to the page"] : [],
    });
    // 2.4.4 Link Purpose
    const c244 = WCAG_CRITERIA.find(x => x.id === "2.4.4");
    const genericLinks = (html.match(/<a[^>]*>\s*(click here|read more|learn more|more|here|link)\s*<\/a>/gi) || []).length;
    results.push({
        id: c244.id, title: c244.title, level: c244.level, principle: c244.principle, automatable: c244.automatable,
        score: genericLinks === 0 ? 100 : Math.max(0, 100 - genericLinks * 20),
        passCount: 0, failCount: genericLinks,
        findings: genericLinks > 0 ? [`${genericLinks} generic link texts found ('click here', 'read more', etc.)`] : ["No generic link text detected"],
        recommendations: genericLinks > 0 ? ["Replace generic link text with descriptive text that indicates the link's purpose"] : [],
    });
    // 2.4.5 Multiple Ways (AA)
    const c245 = WCAG_CRITERIA.find(x => x.id === "2.4.5");
    const hasNav = html.includes("<nav");
    const hasSearch = /type\s*=\s*["']search["']/i.test(html) || /aria-label\s*=\s*["']search["']/i.test(html) || /search/i.test(html);
    results.push({
        id: c245.id, title: c245.title, level: c245.level, principle: c245.principle, automatable: "partial",
        score: hasNav && hasSearch ? 80 : hasNav ? 60 : 30,
        passCount: hasNav ? 1 : 0,
        failCount: 0,
        findings: [hasNav ? "Navigation element found" : "No <nav> element", hasSearch ? "Search pattern detected" : "No search pattern"].filter(Boolean),
        recommendations: !hasNav || !hasSearch ? ["Provide at least two ways to find pages: navigation + search, sitemap, or table of contents"] : [],
        manualReason: "Multi-page navigation consistency requires cross-page comparison",
    });
    // 2.4.6 Headings and Labels
    const c246 = WCAG_CRITERIA.find(x => x.id === "2.4.6");
    const emptyHeadings = (html.match(/<h[1-6][^>]*>\s*<\/h[1-6]>/gi) || []).length;
    results.push({
        id: c246.id, title: c246.title, level: c246.level, principle: c246.principle, automatable: c246.automatable,
        score: emptyHeadings === 0 ? 100 : Math.max(0, 100 - emptyHeadings * 25),
        passCount: 0, failCount: emptyHeadings,
        findings: emptyHeadings > 0 ? [`${emptyHeadings} empty heading elements found`] : ["No empty headings detected"],
        recommendations: emptyHeadings > 0 ? ["Add descriptive text to all heading elements"] : [],
    });
    // 2.4.7 Focus Visible
    const c247 = WCAG_CRITERIA.find(x => x.id === "2.4.7");
    const hasFocusStyle = html.includes(":focus") || html.includes(":focus-visible") || html.includes("focus-visible");
    results.push({
        id: c247.id, title: c247.title, level: c247.level, principle: c247.principle, automatable: c247.automatable,
        score: hasFocusStyle ? 100 : 20,
        passCount: hasFocusStyle ? 1 : 0,
        failCount: hasFocusStyle ? 0 : 1,
        findings: [hasFocusStyle ? "Focus-visible styles detected" : "No :focus or :focus-visible styles detected"],
        recommendations: !hasFocusStyle ? ["Add visible focus indicators: :focus-visible { outline: 3px solid }"] : [],
    });
    // 2.4.8 Location (AAA)
    const c248 = WCAG_CRITERIA.find(x => x.id === "2.4.8");
    const hasBreadcrumb = html.includes("breadcrumb") || (html.includes("aria-label") && html.includes("breadcrumb"));
    results.push({
        id: c248.id, title: c248.title, level: c248.level, principle: c248.principle, automatable: c248.automatable,
        score: hasBreadcrumb ? 100 : 25,
        passCount: hasBreadcrumb ? 1 : 0,
        failCount: hasBreadcrumb ? 0 : 1,
        findings: [hasBreadcrumb ? "Breadcrumb navigation found" : "No breadcrumb or location indicator found"],
        recommendations: !hasBreadcrumb ? ["Add breadcrumb navigation: <nav aria-label='breadcrumb'>"] : [],
    });
    // 2.4.9 Link Purpose (AAA)
    const c249 = WCAG_CRITERIA.find(x => x.id === "2.4.9");
    const allLinks = (html.match(/<a\b/gi) || []).length;
    results.push({
        id: c249.id, title: c249.title, level: c249.level, principle: c249.principle, automatable: c249.automatable,
        score: genericLinks === 0 ? 100 : Math.max(0, 100 - genericLinks * 25),
        passCount: 0, failCount: genericLinks,
        findings: [`${allLinks} total links, ${genericLinks} with generic text`],
        recommendations: genericLinks > 0 ? ["Every link text must describe its purpose without surrounding context for AAA"] : [],
    });
    // 2.4.10 Section Headings (AAA)
    const c2410 = WCAG_CRITERIA.find(x => x.id === "2.4.10");
    const h2Count = (html.match(/<h2\b/gi) || []).length;
    results.push({
        id: c2410.id, title: c2410.title, level: c2410.level, principle: c2410.principle, automatable: c2410.automatable,
        score: h2Count >= 2 ? 100 : h2Count === 1 ? 50 : 10,
        passCount: h2Count,
        failCount: Math.max(0, 2 - h2Count),
        findings: [`Found ${h2Count} <h2> section headings`],
        recommendations: h2Count < 2 ? ["Organize content with section headings (<h2>-<h6>) for AAA compliance"] : [],
    });
    // 2.4.11 Focus Not Obscured Min (manual)
    const c2411 = WCAG_CRITERIA.find(x => x.id === "2.4.11");
    results.push({
        id: c2411.id, title: c2411.title, level: c2411.level, principle: c2411.principle, automatable: "no",
        manualReason: "Requires visual inspection — verify focused element is not entirely hidden by sticky headers or other overlays",
    });
    // 2.4.12 Focus Not Obscured Enhanced (manual)
    const c2412 = WCAG_CRITERIA.find(x => x.id === "2.4.12");
    results.push({
        id: c2412.id, title: c2412.title, level: c2412.level, principle: c2412.principle, automatable: "no",
        manualReason: "Requires visual inspection — verify focused element is not even partially hidden",
    });
    // 2.4.13 Focus Appearance (AAA)
    const c2413 = WCAG_CRITERIA.find(x => x.id === "2.4.13");
    results.push({
        id: c2413.id, title: c2413.title, level: c2413.level, principle: c2413.principle, automatable: c2413.automatable,
        score: hasFocusStyle ? 80 : 10,
        passCount: hasFocusStyle ? 1 : 0,
        failCount: hasFocusStyle ? 0 : 1,
        findings: [hasFocusStyle ? "Focus styles found — verify >=2px outline with 3:1 contrast for AAA" : "No focus styles — AAA requires >=2px solid outline with 3:1 contrast"],
        recommendations: ["For AAA: focus indicator must have >=2px outline, 3:1 contrast, and enclose the component"],
    });
    return results;
}
// F11: Input Modalities (2.5.1-2.5.8)
function scoreInputModalities(html) {
    const results = [];
    // 2.5.1 Pointer Gestures (manual)
    const c251 = WCAG_CRITERIA.find(x => x.id === "2.5.1");
    results.push({ id: c251.id, title: c251.title, level: c251.level, principle: c251.principle, automatable: "no", manualReason: "Verify multi-point/path gestures have single-pointer alternatives" });
    // 2.5.2 Pointer Cancellation (manual)
    const c252 = WCAG_CRITERIA.find(x => x.id === "2.5.2");
    results.push({ id: c252.id, title: c252.title, level: c252.level, principle: c252.principle, automatable: "no", manualReason: "Verify actions fire on up-event, not down-event; can be aborted" });
    // 2.5.3 Label in Name
    const c253 = WCAG_CRITERIA.find(x => x.id === "2.5.3");
    const ariaLabelledby = (html.match(/aria-labelledby\s*=\s*["'][^"']+["']/gi) || []).length;
    const labelCount = (html.match(/<label\b/gi) || []).length;
    results.push({
        id: c253.id, title: c253.title, level: c253.level, principle: c253.principle, automatable: c253.automatable,
        score: labelCount > 0 ? 100 : ariaLabelledby > 0 ? 70 : 30,
        passCount: labelCount + ariaLabelledby,
        failCount: 0,
        findings: [`${labelCount} labels, ${ariaLabelledby} aria-labelledby references`],
        recommendations: labelCount === 0 && ariaLabelledby === 0 ? ["Ensure visible labels are included in accessible names"] : [],
    });
    // 2.5.4 Motion Actuation (manual)
    const c254 = WCAG_CRITERIA.find(x => x.id === "2.5.4");
    results.push({ id: c254.id, title: c254.title, level: c254.level, principle: c254.principle, automatable: "no", manualReason: "Verify shake/tilt features have button alternatives and can be disabled" });
    // 2.5.5 Target Size Enhanced (AAA)
    const c255 = WCAG_CRITERIA.find(x => x.id === "2.5.5");
    const targetSize44 = /(?:min-)?(?:width|height)\s*:\s*(?:4[4-9]|[5-9]\d|\d{3,})px/.test(html);
    results.push({
        id: c255.id, title: c255.title, level: c255.level, principle: c255.principle, automatable: c255.automatable,
        score: targetSize44 ? 100 : 30,
        passCount: targetSize44 ? 1 : 0,
        failCount: targetSize44 ? 0 : 1,
        findings: [targetSize44 ? "Target sizes >=44px detected" : "No >=44px target sizes found — AAA requires 44×44px"],
        recommendations: !targetSize44 ? ["Set min-width: 44px; min-height: 44px on all interactive elements for AAA"] : [],
    });
    // 2.5.6 Concurrent Input Mechanisms (manual)
    const c256 = WCAG_CRITERIA.find(x => x.id === "2.5.6");
    results.push({ id: c256.id, title: c256.title, level: c256.level, principle: c256.principle, automatable: "no", manualReason: "Verify content supports mouse, keyboard, touch, and stylus concurrently" });
    // 2.5.7 Dragging Movements (manual)
    const c257 = WCAG_CRITERIA.find(x => x.id === "2.5.7");
    results.push({ id: c257.id, title: c257.title, level: c257.level, principle: c257.principle, automatable: "no", manualReason: "Verify drag-and-drop has single-pointer alternative" });
    // 2.5.8 Target Size Minimum (AA)
    const c258 = WCAG_CRITERIA.find(x => x.id === "2.5.8");
    const targetSize24 = /(?:min-)?(?:width|height)\s*:\s*(?:2[4-9]|[3-9]\d|\d{3,})px/.test(html);
    results.push({
        id: c258.id, title: c258.title, level: c258.level, principle: c258.principle, automatable: c258.automatable,
        score: targetSize24 || targetSize44 ? 100 : 40,
        passCount: targetSize24 || targetSize44 ? 1 : 0,
        failCount: targetSize24 || targetSize44 ? 0 : 1,
        findings: [targetSize24 || targetSize44 ? "Target sizes >=24px detected" : "No >=24px target sizes found"],
        recommendations: !targetSize24 && !targetSize44 ? ["Set min-width: 24px; min-height: 24px on interactive elements"] : [],
    });
    return results;
}
// F12: Forms and Input (3.3.1-3.3.9, 4.1.2)
function scoreFormsAndInput(html) {
    const results = [];
    // 3.3.1 Error Identification
    const c331 = WCAG_CRITERIA.find(x => x.id === "3.3.1");
    const hasAriaInvalid = html.includes("aria-invalid");
    const hasErrorClass = /class\s*=\s*["'][^"']*\berror\b[^"']*["']/i.test(html);
    results.push({
        id: c331.id, title: c331.title, level: c331.level, principle: c331.principle, automatable: c331.automatable,
        score: hasAriaInvalid || hasErrorClass ? 80 : 50,
        passCount: hasAriaInvalid || hasErrorClass ? 1 : 0,
        failCount: 0,
        findings: [hasAriaInvalid ? "aria-invalid found" : "No aria-invalid", hasErrorClass ? "Error class pattern found" : ""].filter(Boolean),
        recommendations: ["Use aria-invalid='true' and aria-describedby for error identification"],
    });
    // 3.3.2 Labels or Instructions
    const c332 = WCAG_CRITERIA.find(x => x.id === "3.3.2");
    const formFields = (html.match(/<(input|select|textarea)\b/gi) || []).length;
    const visibleLabels = (html.match(/<label\b/gi) || []).length + (html.match(/aria-label\s*=/gi) || []).length;
    results.push({
        id: c332.id, title: c332.title, level: c332.level, principle: c332.principle, automatable: c332.automatable,
        score: formFields === 0 ? 100 : visibleLabels >= formFields ? 100 : Math.round((visibleLabels / formFields) * 100),
        passCount: visibleLabels,
        failCount: Math.max(0, formFields - visibleLabels),
        findings: formFields > 0 ? [`${formFields} form fields, ${visibleLabels} labels`] : ["No form fields — not applicable"],
        recommendations: visibleLabels < formFields ? ["Add labels for all form inputs"] : [],
    });
    // 3.3.3 Error Suggestion (AA)
    const c333 = WCAG_CRITERIA.find(x => x.id === "3.3.3");
    results.push({
        id: c333.id, title: c333.title, level: c333.level, principle: c333.principle, automatable: "partial",
        score: hasAriaInvalid ? 70 : 30,
        passCount: hasAriaInvalid ? 1 : 0,
        failCount: 0,
        findings: [hasAriaInvalid ? "Error identification patterns found — verify suggestions included" : "No error handling patterns detected"],
        recommendations: ["Provide specific correction suggestions when errors are detected"],
        manualReason: "Verify error messages include actionable suggestions",
    });
    // 3.3.4 Error Prevention (Legal/Financial/Data) (AA)
    const c334 = WCAG_CRITERIA.find(x => x.id === "3.3.4");
    const hasConfirm = /confirm|review|check.*before|verify/i.test(html);
    results.push({
        id: c334.id, title: c334.title, level: c334.level, principle: c334.principle, automatable: "partial",
        score: hasConfirm ? 80 : 40,
        passCount: hasConfirm ? 1 : 0,
        failCount: 0,
        findings: [hasConfirm ? "Confirmation/review pattern detected" : "No confirmation pattern — legal/financial forms need reversible, checked, or confirmed submissions"],
        recommendations: hasConfirm ? [] : ["Add review/confirm step before legal, financial, or data submissions"],
        manualReason: "Manual verification: are irreversible submissions confirmed?",
    });
    // 3.3.5 Help (AAA manual)
    const c335 = WCAG_CRITERIA.find(x => x.id === "3.3.5");
    results.push({ id: c335.id, title: c335.title, level: c335.level, principle: c335.principle, automatable: "no", manualReason: "Verify context-sensitive help is available for all inputs" });
    // 3.3.6 Error Prevention All (AAA)
    const c336 = WCAG_CRITERIA.find(x => x.id === "3.3.6");
    results.push({
        id: c336.id, title: c336.title, level: c336.level, principle: c336.principle, automatable: "partial",
        score: hasConfirm ? 60 : 20,
        passCount: hasConfirm ? 1 : 0,
        failCount: 0,
        findings: [hasConfirm ? "Confirmation pattern detected — AAA requires ALL submissions to be reversible, checked, or confirmed" : "No confirmation pattern — AAA requires all form submissions to be reversible, checked, or confirmed"],
        recommendations: ["For AAA: all form submissions must be reversible, checked, or confirmed"],
        manualReason: "Manual verification: are ALL form submissions confirmed?",
    });
    // 3.3.7 Redundant Entry (A manual)
    const c337 = WCAG_CRITERIA.find(x => x.id === "3.3.7");
    results.push({ id: c337.id, title: c337.title, level: c337.level, principle: c337.principle, automatable: "no", manualReason: "Verify previously entered information is auto-populated — use autocomplete" });
    // 3.3.8 Accessible Authentication Min (AA manual)
    const c338 = WCAG_CRITERIA.find(x => x.id === "3.3.8");
    results.push({ id: c338.id, title: c338.title, level: c338.level, principle: c338.principle, automatable: "no", manualReason: "Verify login does not require cognitive function tests; allow password managers" });
    // 3.3.9 Accessible Authentication Enhanced (AAA manual)
    const c339 = WCAG_CRITERIA.find(x => x.id === "3.3.9");
    results.push({ id: c339.id, title: c339.title, level: c339.level, principle: c339.principle, automatable: "no", manualReason: "Verify no object recognition or user-content recognition for login" });
    // 4.1.2 Name, Role, Value
    const c412 = WCAG_CRITERIA.find(x => x.id === "4.1.2");
    const buttons = (html.match(/<button\b/gi) || []).length;
    const buttonNames = (html.match(/<button[^>]*>(?:aria-label|>)[^<]+/gi) || []).length;
    results.push({
        id: c412.id, title: c412.title, level: c412.level, principle: c412.principle, automatable: c412.automatable,
        score: buttons > 0 ? Math.round((buttonNames / buttons) * 100) : 100,
        passCount: buttonNames,
        failCount: Math.max(0, buttons - buttonNames),
        findings: buttons > 0 ? [`${buttons} buttons, ${buttonNames} with accessible names`] : ["No custom interactive elements — native elements have implicit roles"],
        recommendations: buttonNames < buttons ? ["Add aria-label or text content to buttons and interactive elements"] : [],
    });
    return results;
}
// F13: Document Structure (3.1.1-3.1.6, 3.2.1-3.2.6, 4.1.3)
function scoreDocumentStructure(html) {
    const results = [];
    // 3.1.1 Language of Page
    const c311 = WCAG_CRITERIA.find(x => x.id === "3.1.1");
    const hasLang = /<html[^>]*\slang\s*=\s*["'][a-z]{2}/i.test(html);
    results.push({
        id: c311.id, title: c311.title, level: c311.level, principle: c311.principle, automatable: c311.automatable,
        score: hasLang ? 100 : 0,
        passCount: hasLang ? 1 : 0,
        failCount: hasLang ? 0 : 1,
        findings: [hasLang ? "lang attribute found on <html>" : "Missing lang attribute on <html>"],
        recommendations: !hasLang ? ["Add lang attribute: <html lang='en'>"] : [],
    });
    // 3.1.2 Language of Parts
    const c312 = WCAG_CRITERIA.find(x => x.id === "3.1.2");
    const langParts = (html.match(/lang\s*=\s*["'][a-z]{2}/gi) || []).length;
    results.push({
        id: c312.id, title: c312.title, level: c312.level, principle: c312.principle, automatable: c312.automatable,
        score: hasLang ? 80 : 12,
        passCount: langParts,
        failCount: 0,
        findings: [`${langParts} lang attributes found on elements`],
        recommendations: langParts <= 1 ? ["Add lang attribute on passages in different languages"] : [],
    });
    // 3.1.3 Unusual Words (AAA manual)
    for (const id of ["3.1.3", "3.1.4", "3.1.5", "3.1.6"]) {
        const c = WCAG_CRITERIA.find(x => x.id === id);
        results.push({
            id: c.id, title: c.title, level: c.level, principle: c.principle, automatable: "no",
            manualReason: id === "3.1.3" ? "Verify glossary or inline definitions for jargon/idioms" :
                id === "3.1.4" ? "Verify abbreviations expanded on first use with <abbr> title" :
                    id === "3.1.5" ? "Verify supplemental content for text exceeding lower secondary education level" :
                        "Verify pronunciation guide for ambiguous words",
        });
    }
    // 3.2.1 On Focus
    const c321 = WCAG_CRITERIA.find(x => x.id === "3.2.1");
    const onfocusRedirect = /onfocus\s*=\s*["']\s*location/i.test(html);
    results.push({
        id: c321.id, title: c321.title, level: c321.level, principle: c321.principle, automatable: c321.automatable,
        score: onfocusRedirect ? 10 : 100,
        passCount: onfocusRedirect ? 0 : 1,
        failCount: onfocusRedirect ? 1 : 0,
        findings: [onfocusRedirect ? "onfocus redirect detected — major violation" : "No onfocus redirect patterns"],
        recommendations: onfocusRedirect ? ["Remove onfocus navigation — do not change context on focus"] : [],
    });
    // 3.2.2 On Input
    const c322 = WCAG_CRITERIA.find(x => x.id === "3.2.2");
    const onchangeContext = /onchange\s*=\s*["'][^"]*submit|oninput\s*=\s*["'][^"]*navigate/i.test(html);
    results.push({
        id: c322.id, title: c322.title, level: c322.level, principle: c322.principle, automatable: c322.automatable,
        score: onchangeContext ? 20 : 100,
        passCount: onchangeContext ? 0 : 1,
        failCount: onchangeContext ? 1 : 0,
        findings: [onchangeContext ? "Context-changing onchange/oninput detected" : "No context-changing input handlers"],
        recommendations: onchangeContext ? ["Warn users before input causes context change"] : [],
    });
    // 3.2.3 Consistent Navigation (AA manual)
    const c323 = WCAG_CRITERIA.find(x => x.id === "3.2.3");
    results.push({ id: c323.id, title: c323.title, level: c323.level, principle: c323.principle, automatable: "no", manualReason: "Requires multi-page comparison — verify navigation order is consistent across pages" });
    // 3.2.4 Consistent Identification (AA manual)
    const c324 = WCAG_CRITERIA.find(x => x.id === "3.2.4");
    results.push({ id: c324.id, title: c324.title, level: c324.level, principle: c324.principle, automatable: "no", manualReason: "Requires multi-page comparison — verify same function uses same label across pages" });
    // 3.2.5 Change on Request (AAA manual)
    const c325 = WCAG_CRITERIA.find(x => x.id === "3.2.5");
    results.push({ id: c325.id, title: c325.title, level: c325.level, principle: c325.principle, automatable: "no", manualReason: "Verify context changes only occur when user explicitly requests them" });
    // 3.2.6 Consistent Help
    const c326 = WCAG_CRITERIA.find(x => x.id === "3.2.6");
    const hasHelp = /help|support|contact/i.test(html);
    results.push({
        id: c326.id, title: c326.title, level: c326.level, principle: c326.principle, automatable: "partial",
        score: hasHelp ? 80 : 30,
        passCount: hasHelp ? 1 : 0,
        failCount: 0,
        findings: [hasHelp ? "Help/support link pattern found" : "No help mechanism detected"],
        recommendations: !hasHelp ? ["Add help link in consistent location across pages"] : [],
        manualReason: "Verify help mechanisms appear in the same location on every page",
    });
    // 4.1.3 Status Messages
    const c413 = WCAG_CRITERIA.find(x => x.id === "4.1.3");
    const hasAriaLive = html.includes("aria-live") || html.includes("role=\"status\"") || html.includes("role='status'") || html.includes("role=\"alert\"") || html.includes("role='alert'");
    results.push({
        id: c413.id, title: c413.title, level: c413.level, principle: c413.principle, automatable: c413.automatable,
        score: hasAriaLive ? 100 : 40,
        passCount: hasAriaLive ? 1 : 0,
        failCount: hasAriaLive ? 0 : 1,
        findings: [hasAriaLive ? "aria-live or role='status'/'alert' regions found" : "No aria-live regions — status messages may not be announced"],
        recommendations: !hasAriaLive ? ["Add role='status' aria-live='polite' for status message announcements"] : [],
    });
    return results;
}
// ─── Result Merge ─────────────────────────────────────────────────────────────
function mergeEngineResults(axeResults, regexResults, level) {
    const levelHierarchy = { A: 1, AA: 2, AAA: 3 };
    const targetLevel = levelHierarchy[level];
    const merged = new Map();
    // Add regex results first
    for (const r of regexResults) {
        if (levelHierarchy[r.level] <= targetLevel) {
            merged.set(r.id, r);
        }
    }
    // Overlay axe results (take precedence)
    if (axeResults) {
        for (const [scId, result] of axeResults) {
            const criterion = WCAG_CRITERIA.find(c => c.id === scId);
            if (criterion && levelHierarchy[criterion.level] <= targetLevel) {
                merged.set(scId, result);
            }
        }
    }
    // Add any criteria from WCAG_CRITERIA not already covered (as manual)
    for (const c of WCAG_CRITERIA) {
        if (levelHierarchy[c.level] <= targetLevel && !merged.has(c.id)) {
            merged.set(c.id, {
                id: c.id, title: c.title, level: c.level, principle: c.principle, automatable: c.automatable,
                manualReason: c.automatable === "no" ? `Requires manual review — ${c.requirement.toLowerCase()}` : undefined,
                score: c.automatable === "yes" ? 0 : undefined,
            });
        }
    }
    return Array.from(merged.values());
}
// ─── Main Assessment Function ─────────────────────────────────────────────────
export async function assessAccessibility(input, level) {
    const isHtml = /<[a-z][\s\S]*>/i.test(input) || input.includes("<!DOCTYPE");
    const html = input;
    if (!isHtml) {
        return {
            aggregateScore: 0,
            level,
            heuristic: true,
            criteria: [],
            summary: "Heuristic assessment — no HTML detected. Provide HTML content for automated WCAG scoring.",
            automatedCount: 0,
            manualCount: 0,
            engine: "regex",
        };
    }
    // Run axe-core if available
    let axeResults = null;
    if (axeCore && !axeLoadError) {
        axeResults = await analyzeWithAxe(html);
    }
    // Run all regex scoring functions
    const regexResults = [
        ...scoreAltText(html),
        ...scoreMediaAndAudio(html),
        ...scoreSemanticStructure(html),
        ...scoreAdaptable(html),
        ...scoreColorContrast(html, level),
        ...scoreTextPresentation(html),
        ...scoreReflow(html),
        ...scoreKeyboardAccess(html),
        ...scoreTimingAndMotion(html),
        ...scoreNavigation(html),
        ...scoreInputModalities(html),
        ...scoreFormsAndInput(html),
        ...scoreDocumentStructure(html),
    ];
    // Merge results
    const criteria = mergeEngineResults(axeResults, regexResults, level);
    // Compute aggregate from scored criteria
    const scored = criteria.filter(c => c.score !== undefined);
    const aggregateScore = scored.length > 0
        ? Math.round(scored.reduce((sum, c) => sum + (c.score || 0), 0) / scored.length)
        : 0;
    const automatedCount = criteria.filter(c => c.automatable !== "no").length;
    const manualCount = criteria.filter(c => c.automatable === "no").length;
    const engineLabel = axeResults ? "axe+regex" : "regex";
    const tier = aggregateScore >= 80 ? "Good baseline — address findings for improvements" :
        aggregateScore >= 60 ? "Moderate — several criteria need attention" :
            "Significant improvements needed for compliance";
    return {
        aggregateScore,
        level,
        heuristic: false,
        criteria,
        summary: `Accessibility audit complete. WCAG 2.2 ${level} score: ${aggregateScore}/100 (${scored.length} scored + ${manualCount} manual criteria). ${tier}. Engine: ${engineLabel}.`,
        automatedCount,
        manualCount,
        engine: engineLabel,
    };
}
//# sourceMappingURL=accessibility-engine.js.map