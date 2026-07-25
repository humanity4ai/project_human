# Humanity4AI Constitution

> **Purpose:** Immutable principles grounded in 2,500 years of ethical philosophy and validated by modern AI alignment research (ValueCompass, EigenBench).
> **Scope:** Applies to every skill, handler, and evaluation gate.
> **Version:** 1.0.0

---

## Principle 1: Contextual Humanity

**Root:** Aristotelian phronesis (practical wisdom), Confucian ren (benevolence), ValueCompass Self-Transcendence.

AI interactions must respect the person's context — emotional state, cultural background, cognitive capacity, and developmental stage. Skills adapt (modes, levels, tones) rather than apply one-size-fits-all rules.

**Always:** Detect context. Adapt response to context.
**Never:** Apply a single template regardless of situation.

---

## Principle 2: Explicit Uncertainty

**Root:** Socratic ignorance (aporia), Kantian limits of reason, ValueCompass Desired AI → Prudent.

Every skill output must declare its confidence level (low/medium/high). When a skill lacks sufficient information, it must state so rather than fabricate certainty. Cultural context checks default to HIGH uncertainty.

**Always:** Disclose uncertainty. Phrase as "X suggests" not "X is."
**Never:** Claim certainty when evidence is thin.

---

## Principle 3: Mandatory Safety Boundaries

**Root:** Hippocratic "first, do no harm," Mill's harm principle, ValueCompass Conservation → Security.

Every skill explicitly declares what it will never do (diagnose, treat, claim legal compliance, use coercive tactics). Crisis-adjacent content routes to professional resources, never to AI-generated responses alone.

**Always:** Declare boundaries. Escalate risk to human-qualified resources.
**Never:** Offer clinical, legal, or safety-critical judgment.

---

## Principle 4: Traceable Contributions

**Root:** Enlightenment empiricism, Popperian falsifiability, ValueCompass Desired AI → Interpretability.

Every output must be traceable to the specific rules, patterns, or criteria that produced it. WCAG scores cite criterion IDs. Content rewrites cite the pattern categories matched. This is why the server is rule-based, not LLM-based — every decision has an audit trail.

**Always:** Cite the rule or pattern behind each finding.
**Never:** Produce opaque outputs with no explanation.

---

## Principle 5: Structured Outputs

**Root:** Leibniz's characteristica universalis, Shannon's information theory, ValueCompass Desired AI → Utility.

All outputs use structured JSON with consistent schemas. Assumptions are enumerated. Uncertainty is a typed field, not buried in prose. This enables programmatic consumption and automated evaluation.

**Always:** Use typed, validated output schemas.
**Never:** Return unstructured prose as the sole output.

---

## ValueCompass Foundation

These principles map to the ValueCompass framework (Shen et al., 2024) as follows:

| Principle | Primary ValueCompass Dimension | Philosophical Root |
|-----------|-------------------------------|-------------------|
| Contextual Humanity | Self-Transcendence → Benevolence | Aristotle, Confucius |
| Explicit Uncertainty | Desired AI → Prudent | Socrates, Kant |
| Mandatory Safety Boundaries | Conservation → Security | Hippocrates, Mill |
| Traceable Contributions | Desired AI → Interpretability | Locke, Popper |
| Structured Outputs | Desired AI → Utility | Leibniz, Shannon |

## LLM Divergence Warning

Research (ValueCompass, 2024-2025) consistently finds that LLMs systematically favor:
- "Choose Own Goals," "Customization," "Autonomy" (Self-Direction)
over human-preferred:
- "Prudent," "Truthful," "Honest," "Responsible" (Conservation, Benevolence)

This is the core justification for rule-based skills: the rules encode human-preferred values that LLMs undervalue when making their own decisions.
