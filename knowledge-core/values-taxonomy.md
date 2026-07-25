# Humanity4AI Value Taxonomy

Grounding the 9 humanity skills in the validated **ValueCompass** framework (Shen et al., 2024) — a taxonomy of 5 high-order dimensions, 12 motivational types, and 49 fundamental human values derived from Schwartz's theory of basic values plus a systematic review of 518 AI alignment papers.

> **Canonical programmatic reference:** `knowledge-core/values-taxonomy.ts`

## ValueCompass Dimensions

| Dimension | Orientation | Core Question |
|-----------|-------------|---------------|
| **Self-Enhancement** | Individual, self-protective | "Does this advance personal worth and success?" |
| **Openness to Change** | Individual, self-expanding | "Does this support independence and novelty?" |
| **Conservation** | Society, self-protective | "Does this preserve safety, stability, and order?" |
| **Self-Transcendence** | Society, self-expanding | "Does this advance the welfare of others?" |
| **Desired Values for AI** | AI-specific | "How should AI behave to be trustworthy?" |

---

## Skill-to-Value Mapping

### Safety & Emotional Welfare Family

**Dominant dimensions:** Conservation → Security + Self-Transcendence → Benevolence

| Skill | Primary Value | Strength | Key Insight |
|-------|--------------|----------|-------------|
| **Supportive Reply** | Conservation → Security → Health | 0.9 | Detects crisis signals (not conversational), always inserts real crisis-line numbers. LLMs tend toward generic positivity. |
| **De-escalation Plan** | Conservation → Security → Safety | 0.85 | Non-coercive by design. LLMs may escalate or mirror hostility. |
| **Safe Content Rewriter** | Self-Transcendence → Benevolence → Responsible | 0.85 | Enforces shame avoidance and person-first language. LLMs favor "Customization" over "Responsible." |

### Interpersonal & Cultural Respect Family

**Dominant dimensions:** Self-Transcendence → Universalism + Openness to Change → Diversity

| Skill | Primary Value | Strength | Key Insight |
|-------|--------------|----------|-------------|
| **Empathetic Reframe** | Self-Transcendence → Benevolence → Helpful | 0.75 | Detects hollow empathy ("I understand how you feel") and rewrites it. LLMs produce these phrases fluently. |
| **Cultural Context Check** | Self-Transcendence → Universalism → Broad-Minded | 0.6 | Defaults uncertainty to HIGH — honest about cultural limits. LLMs apply Western defaults universally. |

### Inclusive & Accessible Interaction Family

**Dominant dimensions:** Self-Transcendence → Equality + Desired AI → Interpretability

| Skill | Primary Value | Strength | Key Insight |
|-------|--------------|----------|-------------|
| **Accessibility Audit** | Self-Transcendence → Equality | 0.9 | Only scores automatable criteria (41/86). LLMs hallucinate compliance claims. |
| **Cognitive Accessibility** | Desired AI → Interpretability | 0.8 | Enforces plain language, low cognitive load. LLMs default to dense, complex output. |
| **Neurodiversity Design** | Self-Transcendence → Equality | 0.8 | Multi-modal, avoids deficit-framing. LLMs assume single "normal" user. |
| **Age-Inclusive Design** | Self-Transcendence → Equality | 0.8 | Age-appropriate without stereotypes. LLMs infantilize older users. |

---

## Why Rule-Based?

Research (ValueCompass, 2024-2025) consistently documents a systematic gap between human-preferred and LLM-default values:

| Value | Humans Prefer | LLMs Default To |
|-------|--------------|----------------|
| Decision-making | Prudent, Truthful, Honest | Choose Own Goals, Customization, Autonomy |
| Safety | Responsible, Health, Security | Utility, Economic |
| Inclusivity | Equality, Broad-Minded, Diversity | — (weak across the board) |
| Interpretability | Traceable, explainable | Opaque, unverifiable |

The Humanity4AI MCP server is **rule-based** for this exact reason: the rules encode human-preferred values that LLMs systematically undervalue when left to their own judgment. Every output is traceable to a specific rule, pattern, or criterion — there is no "model says so" black box.

## References

- Shen, T., Knearem, T., et al. (2024). *ValueCompass: A Framework of Fundamental Values for Human-AI Alignment.* arXiv:2409.09586.
- Schwartz, S. H. (2012). *An Overview of the Schwartz Theory of Basic Values.* Online Readings in Psychology and Culture, 2(1).
- Chang, J., Piff, L., et al. (2026). *EigenBench: A Comparative Behavioral Measure of Value Alignment.* ICLR 2026.
