---
name: wcag-aaa-accessibility
description: "Use this skill when the user wants to audit a webpage, HTML markup, or digital content for WCAG 2.2 AAA compliance. This includes conducting accessibility audits, reviewing code for accessibility issues, providing remediation guidance, checking color contrast, evaluating keyboard navigation, assessing screen reader compatibility, and ensuring conformance with WCAG Success Criteria at Level AAA. Trigger especially when user mentions 'accessibility audit', 'WCAG', 'ADA compliance', 'accessibility review', 'screen reader test', 'keyboard navigation', or asks to make content accessible."
version: 0.2.0
license: MIT
author: project-human
compatibility: Requires ability to read HTML/CSS, analyze web content
allowed-tools: Read, Grep, Glob
---

# WCAG AAA Accessibility

## Purpose

This skill provides comprehensive accessibility audit and remediation guidance aligned with WCAG 2.2 (Web Content Accessibility Guidelines), with Level AAA as the default target. Level AAA represents the highest level of accessibility conformance and ensures the most inclusive experience for users with disabilities.

This skill is essential for:
- **Developers** building accessible web applications
- **Designers** creating inclusive user interfaces  
- **Content creators** ensuring digital content is accessible
- **QA engineers** conducting accessibility audits
- **Compliance officers** verifying regulatory adherence

## When to Use

Use this skill when the user:

- Asks to "audit for accessibility" or "check WCAG compliance"
- Requests remediation for accessibility issues
- Needs to evaluate color contrast, keyboard navigation, or screen reader compatibility
- Asks about ADA, Section 508, or WCAG conformance
- Needs guidance on making content accessible

### Trigger Phrases
- "Use when user asks to 'audit accessibility'"
- "Use when user asks to 'check WCAG compliance'"
- "Use when user asks to 'fix accessibility issues'"
- "Use when user asks about 'screen reader compatibility'"
- "Use when user asks about 'keyboard navigation'"
- "Use when user asks about 'color contrast'"

## Boundaries

### Always
- Use WCAG 2.2 Success Criteria as the authoritative reference
- Provide specific, actionable remediation code snippets
- Reference the exact SC (Success Criterion) number for each issue
- Test against real assistive technologies when possible
- Document testing methodology and assumptions

### Ask First
- Before making assumptions about user capabilities, ask for clarification
- Before recommending specific assistive technologies, confirm user's target
- Before providing legal compliance advice, clarify this is technical guidance only
- Before suggesting major architectural changes, discuss tradeoffs first

### Never
- Provide legal certification or legal opinions on compliance
- Guarantee specific test results with assistive technologies
- Recommend deprecated WCAG techniques
- Ignore user-identified accessibility needs
- Assume one assistive technology represents all users

## Instructions

### Step 1: Analyze the Target

**Decision Point**: What is the input?
- **If URL**: Fetch and analyze the rendered HTML
- **If HTML markup**: Parse and evaluate structure
- **If file path**: Read and analyze the file
- **If vague**: Ask for clarification

1. Identify the target (URL, file, or markup)
2. Gather relevant context (framework, CMS, existing accessibility efforts)
3. Note any user-identified concerns or priorities

### Step 2: Evaluate Against WCAG Criteria

**Decision Point**: Which criteria to prioritize?
- **If time-constrained**: Prioritize Level A and AA issues first
- **If comprehensive audit requested**: Include all AAA criteria
- **If specific area requested**: Focus on that area (contrast, navigation, etc.)

Evaluate against these WCAG 2.2 Principles:

1. **Perceivable** - Information must be presentable in ways users can perceive
   - Text alternatives (1.1.1)
   - Captions (1.2.1-1.2.13)
   - Audio control (1.2.14)
   - Sign language (1.2.6)
   - Audio description (1.2.5, 1.2.7, 1.2.8)
   - Contrast enhanced (1.4.6)
   - Resize text (1.4.4)
   - Reflow (1.4.10)
   - Non-text contrast (1.4.11)
   - Text spacing (1.4.12)
   - Content on hover/focus (1.4.13)

2. **Operable** - Interface components must be operable
   - Keyboard (2.1.1-2.1.4)
   - No keyboard trap (2.1.2)
   - Character key shortcuts (2.1.4)
   - Timing adjustable (2.2.1-2.2.6)
   - Pause, stop, hide (2.2.2-2.2.5)
   - No three flashes (2.3.1-2.3.3)
   - Bypass blocks (2.4.1)
   - Page titled (2.4.2)
   - Focus order (2.4.3)
   - Link purpose (2.4.4)
   - Multiple ways (2.4.5)
   - Headings and labels (2.4.6)
   - Focus visible (2.4.7, 2.4.11)
   - Pointer gestures (2.5.1-2.5.4)
   - Motion actuation (2.5.5)

3. **Understandable** - Information and operation must be understandable
   - Language of page (3.1.1-3.1.6)
   - On focus (3.2.1-3.2.6)
   - Consistent navigation (3.2.3-3.2.4)
   - Error identification (3.3.1-3.3.6)
   - Labels or instructions (3.3.2)

4. **Robust** - Content must be robust enough for various user agents
   - Parsing (4.1.1)
   - Name, role, value (4.1.2-4.1.3)

### Step 3: Document Findings

**Decision Point**: What level of detail?
- **If quick review**: Summary with critical issues only
- **If comprehensive**: Full report with all findings

For each issue found, document:
1. WCAG Success Criterion number and name
2. Severity level (Critical, Major, Minor)
3. Current state description
4. Impact on users with disabilities
5. Remediation recommendation with code snippet
6. Reference to WCAG documentation

### Step 4: Provide Remediation

1. Generate specific, actionable code examples
2. Include before/after comparisons where helpful
3. Reference relevant WCAG Understanding documents
4. Suggest testing approaches
5. Note any tradeoffs or considerations

## Output Format

```
## Accessibility Audit Report

### Summary
[Overview of findings - number of issues by severity]

### Critical Issues
[Issues that block access for users with disabilities]
- **[SC 1.1.1]** [Issue name]
  - Location: [Where found]
  - Impact: [User impact description]
  - Remediation:
    ```html
    [Code example]
    ```
  - Reference: [WCAG link]

### Major Issues
[Issues that significantly impact experience]

### Minor Issues
[Issues that improve but don't block access]

### Recommendations
- [Additional suggestions beyond fixes]
- [Testing methodologies]
- [Resources for further learning]

### Testing Notes
[How to verify fixes, assistive technologies to test with]
```

## Examples

### Example 1: Color Contrast Audit
**Input**: "Audit this button CSS for WCAG AAA compliance: `.btn { color: #999; background: #fff; }`"

**Output**: 
```
## Finding: Color Contrast Insufficient

- **WCAG SC**: 1.4.6 Contrast (Enhanced)
- **Current Contrast**: 2.42:1 (fails AAA, passes AA)
- **Required for AAA**: 7:1

**Remediation**:
```css
.btn {
  color: #4d4d4d;  /* #4d4d4d on #ffffff = 10.8:1 */
  background: #ffffff;
}
```

**Why it works**: The revised color combination exceeds the 7:1 contrast ratio required for WCAG Level AAA, ensuring the button text is perceivable by users with low vision.
```

### Example 2: Keyboard Navigation
**Input**: "Review this modal for keyboard accessibility: `<div class="modal">...</div>`"

**Output**:
```
## Finding: Modal Not Keyboard Accessible

- **WCAG SC**: 2.1.2 No Keyboard Trap, 2.4.3 Focus Order, 2.4.11 Focus Not Obscured
- **Issue**: Modal does not trap focus or return focus on close

**Remediation**:
```javascript
function openModal() {
  modal.style.display = 'block';
  closeButton.focus(); // Move focus to close button
  modal.addEventListener('keydown', handleModalKeys);
}

function closeModal() {
  triggerButton.focus(); // Return focus to trigger
  modal.style.display = 'none';
}

function handleModalKeys(e) {
  if (e.key === 'Escape') closeModal();
  if (e.key === 'Tab') {
    // Trap focus within modal
    const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
}
```

**Why it works**: Focus management ensures keyboard users can navigate to and from the modal without losing their place in the page.
```

### Example 3: What NOT to Do
**Input**: "Make this accessible: `<img src="chart.png">`"

**Problem**: Using only title attribute for alternative text
```html
<img src="chart.png" title="Sales chart">
```

**Why it fails**: Title attribute is not reliably exposed as alternative text by assistive technologies. Screen reader users would hear nothing or "Sales chart" without context.

**Correct approach**:
```html
<img src="chart.png" alt="Bar chart showing Q1-Q4 sales. Q1: $50K, Q2: $75K, Q3: $60K, Q4: $90K" role="img" aria-describedby="chart-desc">
<p id="chart-desc" class="sr-only">Detailed breakdown: Product A sold 150 units, Product B sold 200 units...</p>
```

## Error Handling

If unable to complete the audit:

1. **Missing input**: Ask for URL, file, or markup
2. **Ambiguous target**: Clarify what needs to be audited
3. **Unable to fetch**: Request alternative input method
4. **Uncertain interpretation**: Note uncertainty and provide best-effort guidance

## Additional Resources

- **[references/standards.md](references/standards.md)** - WCAG 2.2 Success Criteria reference
- **[references/patterns.md](references/patterns.md)** - Common accessibility patterns and anti-patterns
- **[scripts/analyze.py](scripts/analyze.py)** - Automated accessibility analysis tool

## Progressive Disclosure

- **Level 1** (metadata): Always loaded for skill discovery
- **Level 2** (this file): Loaded when skill triggers
- **Level 3** (references/ and scripts/): Loaded on demand

---

*Version 0.2.0 - Enhanced with detailed workflow, examples, and remediation guidance*
