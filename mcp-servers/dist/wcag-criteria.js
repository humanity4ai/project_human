/**
 * WCAG 2.2 Criteria Map — single source of truth for accessibility_audit tool.
 * All 86 success criteria across 4 POUR principles.
 * Each criterion includes an axeRule field for axe-core integration.
 *
 * Copyright (c) 2026 Ascent Partners Foundation. MIT License.
 */
// ─── WCAG 2.2 Criteria Array (86 entries) ────────────────────────────────────
export const WCAG_CRITERIA = [
    // ═══ Principle 1: Perceivable ═══
    // 1.1 Text Alternatives
    { id: "1.1.1", title: "Non-text Content", level: "A", principle: "perceivable", automatable: "yes", requirement: "Every <img> has descriptive alt text", implementation: "alt='...' on all <img>; alt='' for decorative images", axeRule: "image-alt" },
    // 1.2 Time-Based Media
    { id: "1.2.1", title: "Audio-only/Video-only", level: "A", principle: "perceivable", automatable: "no", requirement: "Text alternative for prerecorded media", implementation: "Transcript or text alternative alongside media", axeRule: null },
    { id: "1.2.2", title: "Captions (Prerecorded)", level: "A", principle: "perceivable", automatable: "no", requirement: "Synchronized captions for all video", implementation: "<track kind='captions'> or embedded captions", axeRule: "video-caption" },
    { id: "1.2.3", title: "Audio Description/Media Alternative", level: "A", principle: "perceivable", automatable: "no", requirement: "Audio description track or full text alternative for video", implementation: "<track kind='descriptions'> or full transcript", axeRule: null },
    { id: "1.2.4", title: "Captions (Live)", level: "AA", principle: "perceivable", automatable: "no", requirement: "Real-time captions for live streams", implementation: "Use live captioning service", axeRule: null },
    { id: "1.2.5", title: "Audio Description (Prerecorded)", level: "AA", principle: "perceivable", automatable: "no", requirement: "Narrated description of visual content in video", implementation: "<track kind='descriptions'> with audio description", axeRule: null },
    { id: "1.2.6", title: "Sign Language", level: "AAA", principle: "perceivable", automatable: "no", requirement: "Embedded sign language interpretation", implementation: "Sign language video overlay or PiP", axeRule: null },
    { id: "1.2.7", title: "Extended Audio Description", level: "AAA", principle: "perceivable", automatable: "no", requirement: "Pause video to insert descriptions when gaps are insufficient", implementation: "Extended audio description track", axeRule: null },
    { id: "1.2.8", title: "Media Alternative (Prerecorded)", level: "AAA", principle: "perceivable", automatable: "no", requirement: "Complete text transcript of all audio and visual information", implementation: "Full descriptive transcript alongside media", axeRule: null },
    { id: "1.2.9", title: "Live Audio-only Alternative", level: "AAA", principle: "perceivable", automatable: "no", requirement: "Real-time text alternative for live audio", implementation: "Live transcription service", axeRule: null },
    // 1.3 Adaptable
    { id: "1.3.1", title: "Info and Relationships", level: "A", principle: "perceivable", automatable: "yes", requirement: "Semantic HTML conveys structure and relationships", implementation: "Use <nav>, <main>, <article>, <section>, <header>, <footer>, <table> with <th scope>", axeRule: "landmark-one-main" },
    { id: "1.3.2", title: "Meaningful Sequence", level: "A", principle: "perceivable", automatable: "partial", requirement: "DOM order matches visual reading order", implementation: "Do not use CSS flex-direction/order to reverse content meaning", axeRule: null },
    { id: "1.3.3", title: "Sensory Characteristics", level: "A", principle: "perceivable", automatable: "yes", requirement: "Never rely solely on shape, color, size, position, or sound to convey information", implementation: "Pair visual indicators with text labels", axeRule: null },
    { id: "1.3.4", title: "Orientation", level: "AA", principle: "perceivable", automatable: "yes", requirement: "Content not restricted to portrait or landscape", implementation: "Use responsive layouts; avoid orientation locks", axeRule: null },
    { id: "1.3.5", title: "Identify Input Purpose", level: "AA", principle: "perceivable", automatable: "yes", requirement: "Use autocomplete attributes on form fields for personal data", implementation: "autocomplete='name', 'email', 'tel', etc.", axeRule: "autocomplete-valid" },
    { id: "1.3.6", title: "Identify Purpose", level: "AAA", principle: "perceivable", automatable: "yes", requirement: "Use ARIA landmarks and roles to identify UI component purpose", implementation: "role='banner', role='main', role='navigation', etc.", axeRule: "landmark-banner-is-top-level" },
    // 1.4 Distinguishable
    { id: "1.4.1", title: "Use of Color", level: "A", principle: "perceivable", automatable: "yes", requirement: "Never use color as the sole indicator", implementation: "Pair color with text, icons, or patterns", axeRule: "color-contrast" },
    { id: "1.4.2", title: "Audio Control", level: "A", principle: "perceivable", automatable: "no", requirement: "Auto-playing audio has pause/stop/mute within first 3 seconds", implementation: "Add audio controls; do not auto-play without user action", axeRule: "audio-caption" }, // manual; axe checks audio presence
    { id: "1.4.3", title: "Contrast (Minimum)", level: "AA", principle: "perceivable", automatable: "yes", requirement: "4.5:1 for normal text, 3:1 for large text (>=18pt or >=14pt bold)", implementation: "Verify text/background contrast meets 4.5:1", axeRule: "color-contrast" },
    { id: "1.4.4", title: "Resize Text", level: "AA", principle: "perceivable", automatable: "yes", requirement: "Text resizable to 200% without loss of content or function", implementation: "Use relative units (rem, em, %) for font sizes; avoid px", axeRule: null },
    { id: "1.4.5", title: "Images of Text", level: "AA", principle: "perceivable", automatable: "yes", requirement: "Use real text, not images of text (except logos)", implementation: "Replace text-in-images with styled text", axeRule: "image-redundant-alt" },
    { id: "1.4.6", title: "Contrast (Enhanced)", level: "AAA", principle: "perceivable", automatable: "yes", requirement: "7:1 for normal text, 4.5:1 for large text", implementation: "Verify text/background contrast meets 7:1", axeRule: "color-contrast" },
    { id: "1.4.7", title: "Low/No Background Audio", level: "AAA", principle: "perceivable", automatable: "no", requirement: "Speech recordings: background >=20dB quieter, or no background, or toggle", implementation: "Remove background audio or provide toggle", axeRule: null },
    { id: "1.4.8", title: "Visual Presentation", level: "AAA", principle: "perceivable", automatable: "yes", requirement: "User-selectable colors; max 80 chars/line; no justified text; line-height >=1.5; paragraph spacing >=2x; text resizable 200%", implementation: "White-space: pre-wrap; max-width: 80ch; text-align: left; line-height: 1.5; margin-bottom: 2em", axeRule: null },
    { id: "1.4.9", title: "Images of Text (No Exception)", level: "AAA", principle: "perceivable", automatable: "yes", requirement: "Only use images of text for pure decoration or where essential", implementation: "Replace all text images with styled text", axeRule: "image-redundant-alt" },
    { id: "1.4.10", title: "Reflow", level: "AA", principle: "perceivable", automatable: "yes", requirement: "No horizontal scroll at 320px CSS width (400% zoom)", implementation: "Use responsive layout; avoid fixed widths; overflow-x: auto", axeRule: null },
    { id: "1.4.11", title: "Non-text Contrast", level: "AA", principle: "perceivable", automatable: "partial", requirement: "UI components and graphical objects have 3:1 contrast", implementation: "Verify button borders, input borders, icon outlines meet 3:1", axeRule: null },
    { id: "1.4.12", title: "Text Spacing", level: "AA", principle: "perceivable", automatable: "yes", requirement: "No loss of content when: line-height >=1.5x, paragraph spacing >=2x, letter-spacing >=0.12em, word-spacing >=0.16em", implementation: "Use relative spacing units; test with spacing overrides", axeRule: null },
    { id: "1.4.13", title: "Content on Hover/Focus", level: "AA", principle: "perceivable", automatable: "yes", requirement: "Hoverable, dismissable, persistent tooltips/popovers", implementation: "Use CSS :hover/:focus with pointer-events; add dismiss mechanism", axeRule: null },
    // ═══ Principle 2: Operable ═══
    // 2.1 Keyboard Accessible
    { id: "2.1.1", title: "Keyboard", level: "A", principle: "operable", automatable: "yes", requirement: "All functionality operable via keyboard", implementation: "Use native interactive elements; add keyboard handlers for custom widgets", axeRule: "accesskeys" },
    { id: "2.1.2", title: "No Keyboard Trap", level: "A", principle: "operable", automatable: "no", requirement: "Focus can always be moved away from any component", implementation: "Ensure Escape key closes modals; no focus trap loops", axeRule: "focus-traps" },
    { id: "2.1.3", title: "Keyboard (No Exception)", level: "AAA", principle: "operable", automatable: "no", requirement: "ALL functionality via keyboard with zero exceptions", implementation: "Provide keyboard equivalent for every interaction", axeRule: null },
    { id: "2.1.4", title: "Character Key Shortcuts", level: "A", principle: "operable", automatable: "yes", requirement: "Single-character shortcuts can be remapped or disabled", implementation: "Avoid single-key shortcuts; use modifier+key combinations", axeRule: null },
    // 2.2 Enough Time
    { id: "2.2.1", title: "Timing Adjustable", level: "A", principle: "operable", automatable: "partial", requirement: "Time limits can be turned off, adjusted, or extended", implementation: "Provide 'extend session' button; warn before timeout", axeRule: null },
    { id: "2.2.2", title: "Pause, Stop, Hide", level: "A", principle: "operable", automatable: "yes", requirement: "Moving/blinking/scrolling content has pause/stop/hide controls", implementation: "Add play/pause to carousels; avoid <marquee>; use prefers-reduced-motion", axeRule: "blink" },
    { id: "2.2.3", title: "No Timing", level: "AAA", principle: "operable", automatable: "partial", requirement: "No time limits at all (except real-time events)", implementation: "Remove all time-based interactions", axeRule: null },
    { id: "2.2.4", title: "Interruptions", level: "AAA", principle: "operable", automatable: "no", requirement: "All non-emergency interruptions can be postponed or suppressed", implementation: "Delay non-critical notifications; allow user to dismiss", axeRule: null },
    { id: "2.2.5", title: "Re-authenticating", level: "AAA", principle: "operable", automatable: "no", requirement: "Data preserved when session expires and user re-authenticates", implementation: "Save form state before session expiry", axeRule: null },
    { id: "2.2.6", title: "Timeouts", level: "AAA", principle: "operable", automatable: "no", requirement: "Warn users about inactivity timeouts that cause data loss", implementation: "Show timeout warning modal at 80% of session duration", axeRule: null },
    // 2.3 Seizures and Physical Reactions
    { id: "2.3.1", title: "Three Flashes or Below", level: "A", principle: "operable", automatable: "partial", requirement: "No content flashes >3 times/second", implementation: "Avoid rapid CSS animations; check video frame rates", axeRule: null },
    { id: "2.3.2", title: "Three Flashes (No Exception)", level: "AAA", principle: "operable", automatable: "partial", requirement: "No content flashes >3 times/second (no exceptions)", implementation: "Strictly avoid any flashing content", axeRule: null },
    { id: "2.3.3", title: "Animation from Interactions", level: "AAA", principle: "operable", automatable: "yes", requirement: "Motion animation triggered by interaction can be disabled; respect prefers-reduced-motion", implementation: "@media (prefers-reduced-motion: reduce) { animation: none }", axeRule: null },
    // 2.4 Navigable
    { id: "2.4.1", title: "Bypass Blocks", level: "A", principle: "operable", automatable: "yes", requirement: "Skip-to-content link; ARIA landmarks", implementation: "<a href='#main-content' class='skip-link'>Skip to main content</a>", axeRule: "skip-link" },
    { id: "2.4.2", title: "Page Titled", level: "A", principle: "operable", automatable: "yes", requirement: "Descriptive, unique <title> per page", implementation: "<title>Page Name — Site Name</title>", axeRule: "document-title" },
    { id: "2.4.3", title: "Focus Order", level: "A", principle: "operable", automatable: "yes", requirement: "Tab order follows logical reading order", implementation: "Use tabindex='0'; avoid positive tabindex; test Tab key flow", axeRule: "tabindex" },
    { id: "2.4.4", title: "Link Purpose (In Context)", level: "A", principle: "operable", automatable: "yes", requirement: "Link text + context makes purpose clear", implementation: "Avoid 'click here', 'read more', 'learn more' as link text", axeRule: "link-name" },
    { id: "2.4.5", title: "Multiple Ways", level: "AA", principle: "operable", automatable: "partial", requirement: "At least two ways to find pages (nav, search, sitemap)", implementation: "Provide navigation menu + search + sitemap", axeRule: null },
    { id: "2.4.6", title: "Headings and Labels", level: "AA", principle: "operable", automatable: "yes", requirement: "Headings and labels describe topic/purpose", implementation: "Use descriptive headings; label all form inputs", axeRule: "empty-heading" },
    { id: "2.4.7", title: "Focus Visible", level: "AA", principle: "operable", automatable: "yes", requirement: "Keyboard focus indicator is visible", implementation: ":focus-visible { outline: 3px solid #0f766e }", axeRule: "focus-order-semantics" },
    { id: "2.4.8", title: "Location", level: "AAA", principle: "operable", automatable: "yes", requirement: "Breadcrumbs or other location indicator", implementation: "<nav aria-label='breadcrumb'><ol><li><a>Home</a></li>...</ol></nav>", axeRule: null },
    { id: "2.4.9", title: "Link Purpose (Link Only)", level: "AAA", principle: "operable", automatable: "yes", requirement: "Link text alone makes purpose clear (no 'click here')", implementation: "Every link text is self-descriptive without surrounding context", axeRule: "link-name" },
    { id: "2.4.10", title: "Section Headings", level: "AAA", principle: "operable", automatable: "yes", requirement: "Content organized with section headings", implementation: "Use <h2>-<h6> for all content sections; maintain logical hierarchy", axeRule: "heading-order" },
    { id: "2.4.11", title: "Focus Not Obscured (Minimum)", level: "AA", principle: "operable", automatable: "no", requirement: "Focused element not entirely hidden", implementation: "Ensure sticky headers/footers don't cover focused element", axeRule: null },
    { id: "2.4.12", title: "Focus Not Obscured (Enhanced)", level: "AAA", principle: "operable", automatable: "no", requirement: "Focused element not even partially hidden", implementation: "Scroll focused elements into view; no overlapping content", axeRule: null },
    { id: "2.4.13", title: "Focus Appearance", level: "AAA", principle: "operable", automatable: "yes", requirement: "Focus indicator: >=2px outline, 3:1 contrast against unfocused state, encloses component", implementation: ":focus-visible { outline: 2px solid; outline-offset: 2px }", axeRule: "focus-order-semantics" },
    // 2.5 Input Modalities
    { id: "2.5.1", title: "Pointer Gestures", level: "A", principle: "operable", automatable: "no", requirement: "Multi-point/path gestures have single-pointer alternatives", implementation: "Provide buttons as alternative to swipe/pinch gestures", axeRule: null },
    { id: "2.5.2", title: "Pointer Cancellation", level: "A", principle: "operable", automatable: "no", requirement: "Actions fire on up-event, not down-event; can abort", implementation: "Use 'click' not 'mousedown'; allow drag-off to cancel", axeRule: null },
    { id: "2.5.3", title: "Label in Name", level: "A", principle: "operable", automatable: "yes", requirement: "Visible label is included in accessible name", implementation: "Match aria-label or aria-labelledby to visible label text", axeRule: "label-title-only" },
    { id: "2.5.4", title: "Motion Actuation", level: "A", principle: "operable", automatable: "no", requirement: "Shake/tilt features have button alternatives; can be disabled", implementation: "Provide button alternatives for motion-based actions", axeRule: null },
    { id: "2.5.5", title: "Target Size (Enhanced)", level: "AAA", principle: "operable", automatable: "yes", requirement: "Interactive targets >=44x44 CSS pixels", implementation: "min-width: 44px; min-height: 44px on all interactive elements", axeRule: "target-size" },
    { id: "2.5.6", title: "Concurrent Input Mechanisms", level: "AAA", principle: "operable", automatable: "no", requirement: "Do not restrict to single input type (mouse, keyboard, touch)", implementation: "Support mouse, keyboard, touch, and stylus concurrently", axeRule: null },
    { id: "2.5.7", title: "Dragging Movements", level: "AA", principle: "operable", automatable: "no", requirement: "Drag-and-drop has single-pointer alternative", implementation: "Provide click-to-select + click-to-place alternative for drag", axeRule: null },
    { id: "2.5.8", title: "Target Size (Minimum)", level: "AA", principle: "operable", automatable: "yes", requirement: "Interactive targets >=24x24 CSS pixels", implementation: "min-width: 24px; min-height: 24px on buttons and links", axeRule: "target-size" },
    // ═══ Principle 3: Understandable ═══
    // 3.1 Readable
    { id: "3.1.1", title: "Language of Page", level: "A", principle: "understandable", automatable: "yes", requirement: "Page language declared in html tag", implementation: "<html lang='en'> (or appropriate language code)", axeRule: "html-has-lang" },
    { id: "3.1.2", title: "Language of Parts", level: "AA", principle: "understandable", automatable: "yes", requirement: "lang attribute on passages in different languages", implementation: "<span lang='fr'>Bonjour</span>", axeRule: "html-lang-valid" },
    { id: "3.1.3", title: "Unusual Words", level: "AAA", principle: "understandable", automatable: "no", requirement: "Glossary or inline definitions for jargon/idioms", implementation: "<dfn> or <abbr> with title; glossary page", axeRule: null },
    { id: "3.1.4", title: "Abbreviations", level: "AAA", principle: "understandable", automatable: "no", requirement: "Expand abbreviations on first use; provide <abbr> with title", implementation: "<abbr title='World Health Organization'>WHO</abbr>", axeRule: null },
    { id: "3.1.5", title: "Reading Level", level: "AAA", principle: "understandable", automatable: "no", requirement: "Supplemental content or summaries when text exceeds lower secondary education level", implementation: "Provide plain-language summary for complex content", axeRule: null },
    { id: "3.1.6", title: "Pronunciation", level: "AAA", principle: "understandable", automatable: "no", requirement: "Provide pronunciation guide for ambiguous words", implementation: "Use ruby annotation or phonetic spelling for ambiguous terms", axeRule: null },
    // 3.2 Predictable
    { id: "3.2.1", title: "On Focus", level: "A", principle: "understandable", automatable: "yes", requirement: "No context change when element receives focus", implementation: "Do not use onfocus to navigate or submit forms", axeRule: null },
    { id: "3.2.2", title: "On Input", level: "A", principle: "understandable", automatable: "yes", requirement: "No unexpected context change on input; warn users", implementation: "Do not auto-submit on selection; warn before context changes", axeRule: null },
    { id: "3.2.3", title: "Consistent Navigation", level: "AA", principle: "understandable", automatable: "no", requirement: "Navigation order consistent across pages", implementation: "Same nav menu structure on all pages", axeRule: null },
    { id: "3.2.4", title: "Consistent Identification", level: "AA", principle: "understandable", automatable: "no", requirement: "Same function = same label across pages", implementation: "Use consistent labels for identical functions", axeRule: null },
    { id: "3.2.5", title: "Change on Request", level: "AAA", principle: "understandable", automatable: "no", requirement: "Context changes only when user explicitly requests", implementation: "No automatic redirects, popups, or layout changes", axeRule: null },
    { id: "3.2.6", title: "Consistent Help", level: "A", principle: "understandable", automatable: "partial", requirement: "Help mechanisms in consistent location across pages", implementation: "Place help link/button in same position on every page", axeRule: null },
    // 3.3 Input Assistance
    { id: "3.3.1", title: "Error Identification", level: "A", principle: "understandable", automatable: "yes", requirement: "Errors described in text, field identified", implementation: "aria-describedby='error-msg'; aria-invalid='true' on error", axeRule: "aria-input-field-name" },
    { id: "3.3.2", title: "Labels or Instructions", level: "A", principle: "understandable", automatable: "yes", requirement: "All inputs have visible labels and instructions", implementation: "<label for='name'>Name</label> or aria-label", axeRule: "label" },
    { id: "3.3.3", title: "Error Suggestion", level: "AA", principle: "understandable", automatable: "partial", requirement: "Provide correction suggestions when errors are detected", implementation: "Show specific hint like 'Use format: MM/DD/YYYY'", axeRule: null },
    { id: "3.3.4", title: "Error Prevention (Legal/Financial/Data)", level: "AA", principle: "understandable", automatable: "partial", requirement: "Reversible, checked, or confirmed submissions for legal/financial/data", implementation: "Add confirmation step before irreversible actions", axeRule: null },
    { id: "3.3.5", title: "Help", level: "AAA", principle: "understandable", automatable: "no", requirement: "Context-sensitive help available for all inputs", implementation: "Add help tooltips or links next to each input", axeRule: null },
    { id: "3.3.6", title: "Error Prevention (All)", level: "AAA", principle: "understandable", automatable: "partial", requirement: "ALL form submissions are reversible, checked, or confirmed", implementation: "Add undo/confirm step for all form submissions", axeRule: null },
    { id: "3.3.7", title: "Redundant Entry", level: "A", principle: "understandable", automatable: "no", requirement: "Auto-populate previously entered information", implementation: "Use autocomplete; pre-fill known user data", axeRule: null },
    { id: "3.3.8", title: "Accessible Authentication (Minimum)", level: "AA", principle: "understandable", automatable: "no", requirement: "No cognitive function test for login", implementation: "Allow password managers; avoid CAPTCHA as sole method", axeRule: null },
    { id: "3.3.9", title: "Accessible Authentication (Enhanced)", level: "AAA", principle: "understandable", automatable: "no", requirement: "No object or user-content recognition for login", implementation: "Avoid image selection or puzzle-based CAPTCHAs", axeRule: null },
    // ═══ Principle 4: Robust ═══
    { id: "4.1.2", title: "Name, Role, Value", level: "A", principle: "robust", automatable: "yes", requirement: "All UI components have accessible name, role, and state via ARIA or native HTML", implementation: "Use native HTML elements; add aria-label for custom components", axeRule: "button-name" },
    { id: "4.1.3", title: "Status Messages", level: "AA", principle: "robust", automatable: "yes", requirement: "Status messages announced via role='status' or aria-live without focus change", implementation: "<div role='status' aria-live='polite'>Results updated</div>", axeRule: "aria-live-region" },
];
// ─── Helper Functions ─────────────────────────────────────────────────────────
export function getChecklist(level) {
    const levelHierarchy = { A: 1, AA: 2, AAA: 3 };
    const targetLevel = levelHierarchy[level];
    const principleOrder = ["perceivable", "operable", "understandable", "robust"];
    return WCAG_CRITERIA
        .filter(c => levelHierarchy[c.level] <= targetLevel)
        .sort((a, b) => {
        const pa = principleOrder.indexOf(a.principle);
        const pb = principleOrder.indexOf(b.principle);
        if (pa !== pb)
            return pa - pb;
        return a.id.localeCompare(b.id);
    })
        .map(c => ({
        id: c.id,
        title: c.title,
        level: c.level,
        principle: c.principle,
        requirement: c.requirement,
        implementation: c.implementation,
    }));
}
export function criteriaByLevel(level) {
    const levelHierarchy = { A: 1, AA: 2, AAA: 3 };
    const targetLevel = levelHierarchy[level];
    return WCAG_CRITERIA.filter(c => levelHierarchy[c.level] <= targetLevel);
}
export const ALL_CRITERIA = WCAG_CRITERIA;
export const AXE_COVERED_CRITERIA = WCAG_CRITERIA.filter(c => c.axeRule !== null);
//# sourceMappingURL=wcag-criteria.js.map