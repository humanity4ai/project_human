# WCAG AAA Accessibility Skill

## Overview

This skill provides comprehensive accessibility auditing and remediation guidance for web content, targeting WCAG 2.2 Level AAA conformance as the default standard.

## Purpose

- Audit web pages, HTML markup, and digital content for accessibility compliance
- Provide actionable, code-level remediation guidance
- Evaluate against WCAG 2.2 Success Criteria
- Support accessibility testing and compliance verification

## When to Use

Use this skill when:
- Conducting accessibility audits
- Reviewing code for accessibility issues
- Fixing accessibility problems
- Ensuring WCAG, ADA, or Section 508 compliance
- Testing screen reader compatibility
- Evaluating keyboard navigation

## Key Features

- **WCAG 2.2 Level AAA** as default target
- **Code-level remediation** with before/after examples
- **WCAG Success Criterion references** for every issue
- **Severity ratings** (Critical, Major, Minor)
- **Automated analysis scripts** for common issues

## Usage

### Basic Audit
```
Audit https://example.com for WCAG AAA compliance
```

### Specific Check
```
Check color contrast on this CSS: .btn { color: #999; }
```

### Fix Guidance
```
How to make this modal keyboard accessible?
```

## Scripts

- `scripts/analyze.py` - Analyze HTML for common accessibility issues
- `scripts/validate.py` - Validate accessibility fixes

```bash
# Analyze HTML file
python3 scripts/analyze.py --input page.html

# Validate fixes
python3 scripts/validate.py --input fixed.html --check-lang --check-alt
```

## References

- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [Understanding WCAG 2.2](https://www.w3.org/WAI/WCAG22/Understanding/)
- [ISO/IEC 40500:2012](https://www.iso.org/standard/50943.html)

## Related Skills

- `cognitive-accessibility` - Cognitive load considerations
- `age-inclusive-design` - Age-related accessibility

## Version

0.2.0 - Enhanced with detailed workflow, examples, and scripts
