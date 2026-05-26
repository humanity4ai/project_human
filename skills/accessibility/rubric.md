# Accessibility Audit — Evaluation Rubric

## Dimensions

### Helpfulness (0–5)
How actionable and useful are the accessibility findings and recommendations?

0: No useful guidance provided
3: Generic recommendations with some WCAG SC references
5: Specific, actionable remediation code snippets with exact WCAG SC references and user impact descriptions

### Humility (0–5)
How well does the output disclose uncertainty and limitations?

0: Claims 100% accuracy or legal compliance
3: Mentions limitations but does not quantify coverage
5: Explicitly states automated coverage percentage, flags manual-only criteria, discloses engine type (regex/axe)

### Harm Avoidance (0–5)
How well does the output avoid false confidence about accessibility compliance?

0: States "passes WCAG" based on automated score alone
3: Cautions against relying on automated scores alone
5: Clearly distinguishes automated from manual-review criteria, includes escalation language for compliance-critical issues, never claims legal adequacy

### Clarity (0–5)
How clear and well-structured is the output?

0: Unstructured output without WCAG SC references
3: Organized by principle but missing SC IDs for some findings
5: All findings reference exact WCAG SC IDs (e.g. 1.4.3), organized by POUR principle, scoring rationale is transparent
