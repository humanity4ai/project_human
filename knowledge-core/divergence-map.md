# AI-Human Value Divergence Map

Documented systematic gaps between human-preferred and LLM-default values. Grounded in ValueCompass research (Shen et al., 2024-2025). This is the justification for rule-based humanity skills — the rules encode human-preferred values that LLMs systematically undervalue.

---

## Core Divergence: Self-Direction vs Prudence

**Research finding:** LLMs consistently favor Self-Direction values (Choose Own Goals, Independence, Freedom, Customization, Autonomy) while humans consistently favor Conservation/Benevolence values (Prudent, Truthful, Honest, Responsible, Health).

**Impact on humanity skills:** An LLM left to its own judgment may:
- Override a safety boundary to be "helpful"
- Generate a cheery response when crisis signals are present
- Claim certainty when evidence is thin
- Apply Western cultural defaults universally

**How we handle it:** Rule-based skills enforce human-preferred values deterministically. The LLM can still converse freely; the skills adjudicate the safety-critical moments.

---

## Divergence by Value Dimension

### 1. Prudence (Conservation)

| Aspect | Human Preference | LLM Tendency |
|--------|----------------|--------------|
| Risk assessment | Be cautious; escalate uncertain cases | Be "helpful"; attempt to solve |
| Safety boundaries | Explicit and non-negotiable | Flexible; can be reasoned around |
| Crisis response | Route to professional resources | Provide AI-generated support |

**Affected skills:** supportive_reply, deescalation_plan, rewrite_depression_sensitive_content

---

### 2. Truthfulness / Honesty (Conservation)

| Aspect | Human Preference | LLM Tendency |
|--------|----------------|--------------|
| Uncertainty | Disclose "I don't know" | Fill gaps with plausible content |
| Capability limits | State what the system cannot do | Over-claim capabilities |
| WCAG compliance | Score only verifiable criteria | Hallucinate compliance claims |

**Affected skills:** accessibility_audit, cultural_context_check, cognitive_accessibility_audit

---

### 3. Equality / Broad-Mindedness (Self-Transcendence)

| Aspect | Human Preference | LLM Tendency |
|--------|----------------|--------------|
| Cultural defaults | Ask, don't assume | Apply Western norms universally |
| Accessibility | Multi-modal by default | Assume able-bodied, neurotypical user |
| Age inclusivity | Design for all ages | Infantilize older users; ignore children |

**Affected skills:** cultural_context_check, neurodiversity_design_check, age_inclusive_design_check

---

### 4. Responsibility (Benevolence)

| Aspect | Human Preference | LLM Tendency |
|--------|----------------|--------------|
| Content safety | Prevent harm before publishing | Optimize for engagement |
| Escalation | Route to qualified humans | Keep the conversation going |
| Shame language | Avoid and rewrite | Use casually |

**Affected skills:** rewrite_depression_sensitive_content, supportive_reply, de-escalation_plan

---

## Summary Table

| LLM Tendency | Human-Preferred Alternative | Rule-Based Enforcement |
|-------------|---------------------------|----------------------|
| "Be helpful" at any cost | "Be prudent" — escalate risk | Crisis detection → mandatory escalation |
| "I understand how you feel" | "That sounds really hard" | Empathetic reframe → detects hollow empathy |
| Claim confidence | Disclose uncertainty | Every output carries low/medium/high |
| Apply Western defaults | Ask about cultural context | Cultural check requires audience param |
| Assume "normal" user | Design for diversity | Neurodiversity + age-inclusive checks |
| Over-claim WCAG compliance | Score only automatable criteria | 41/86 criteria automated; rest flagged manual |

## References

- Shen, T., et al. (2024). *ValueCompass: A Framework of Fundamental Values for Human-AI Alignment.* arXiv:2409.09586.
- Shen, T., et al. (2025). *Value Compass Benchmarks.* arXiv:2501.07071.
- Chang, J., et al. (2026). *EigenBench: A Comparative Behavioral Measure of Value Alignment.* ICLR 2026.
