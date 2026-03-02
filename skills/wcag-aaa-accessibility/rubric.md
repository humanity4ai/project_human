# Rubric

## Evaluation Criteria

| Criterion | Weight | 1 (Poor) | 3 (Acceptable) | 5 (Excellent) |
|-----------|--------|----------|----------------|---------------|
| **Actionability** | 25% | Recommendations are vague or theoretical without code examples | Provides general guidance with some code snippets | Provides specific, complete code snippets that can be directly applied |
| **Standards Compliance** | 25% | Does not reference WCAG Success Criteria | References some SC numbers but not all | References exact WCAG SC numbers for every issue with links |
| **Severity Assessment** | 25% | Does not prioritize issues by impact | Some prioritization but inconsistent | Correctly categorizes as Critical/Major/Minor based on user impact |
| **Coverage** | 25% | Only covers obvious issues | Covers most common issues | Comprehensive coverage including edge cases and WCAG AAA criteria |

## Good Examples

### Example 1: Complete Remediation
**Input**: Audit this button for accessibility: `.btn { background: #999; color: white; }`

**Expected Output**:
```
## Finding: Insufficient Color Contrast

- WCAG SC: 1.4.3 Contrast (Minimum) - AA
- Current Contrast: 2.42:1 (fails both AA and AAA)
- Required for AA: 4.5:1
- Required for AAA: 7:1

## Remediation
```css
.btn {
  background: #0052cc;  /* 7.2:1 on white - passes AAA */
  color: #ffffff;
}
```
```

**Why it works**: Provides exact WCAG reference, calculates contrast ratio, and gives specific code fix that achieves AAA compliance.

### Example 2: Keyboard Navigation Guidance
**Input**: Make this modal accessible: `<div class="modal">...</div>`

**Expected Output**:
```
## Finding: Modal Not Keyboard Accessible

- WCAG SC: 2.1.2 No Keyboard Trap
- WCAG SC: 2.4.3 Focus Order
- WCAG SC: 2.4.11 Focus Not Obscured

## Remediation
1. Focus management: Trap focus within modal
2. Return focus to trigger on close
3. ESC key to close

```javascript
// Trap focus
modal.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
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
});
```
```

**Why it works**: Provides multiple WCAG references, explains the problem, and gives complete working code.

## Poor Examples

### Example 1: Vague Recommendation
**Input**: Audit this page for accessibility

**Poor Output**:
```
The page has some accessibility issues. You should add more alt text and improve contrast.
```

**Why it fails**: Does not identify specific issues, does not reference WCAG, does not provide actionable code.

### Example 2: Missing Severity
**Input**: Check button contrast

**Poor Output**:
```
Button contrast is 3:1. You might want to increase it.
```

**Why it fails**: Does not state whether this passes or fails WCAG, does not specify which level, does not provide specific fix.

### Example 3: No WCAG Reference
**Input**: Make images accessible

**Poor Output**:
```
Add alt attributes to images.
```

**Why it fails**: Does not reference WCAG 1.1.1, does not explain when to use empty alt, does not provide examples.

---

## Scoring Guide

| Score | Description |
|-------|-------------|
| 5 | Exemplary - All criteria met with excellence |
| 4 | Proficient - Meets most criteria completely |
| 3 | Competent - Basic requirements met |
| 2 | Developing - Some criteria met but incomplete |
| 1 | Beginning - Few or no criteria met |
