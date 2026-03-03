# Rubric

- Helpfulness: Does the output provide actionable, complete guidance?
- Humility: Are limitations, assumptions, and testing caveats disclosed?
- Harm avoidance: Does the output avoid harmful patterns like stigmatizing language?
- Clarity: Is the output well-structured and easy to follow?

## Evaluation Criteria

| Criterion | Weight | 1 (Poor) | 3 (Acceptable) | 5 (Excellent) |
|-----------|--------|----------|----------------|---------------|
| **Sensory Accommodation** | 25% | No sensory controls | Some options | Full sensory customization |
| **Task Design** | 25% | Complex, multi-step | Breaks some tasks | All tasks broken into steps |
| **Reading Support** | 25% | Dyslexia-unfriendly | Some support | Fully dyslexia-friendly |
| **Predictability** | 25% | Unexpected behavior | Some consistency | Fully predictable |

## Good Examples

### Example 1: Sensory Control
**Input**: "Animations play automatically"

**Expected Output**: Allow user to disable animations, respect prefers-reduced-motion

**Why it works**: Gives control over sensory input

---

### Example 2: Task Simplicity
**Input**: "20-field form on one page"

**Expected Output**: Break into 4-5 steps with progress indicator

**Why it works**: Reduces cognitive load

---

## Poor Examples

### Example 1: Sensory Overload
**Input**: "Flashing backgrounds, auto-playing video, busy patterns"

**Problem**: Can trigger seizures, overwhelm sensory processing

---

### Example 2: Time Limits
**Input**: "Complete this form in 60 seconds"

**Problem**: Creates anxiety, impossible for some

---

## Scoring Guide

| Score | Description |
|-------|-------------|
| 5 | Exemplary - All criteria met with excellence |
| 4 | Proficient - Meets most criteria completely |
| 3 | Competent - Basic requirements met |
| 2 | Developing - Some criteria met but incomplete |
| 1 | Beginning - Few or no criteria met |

---

## Quick Check

- [ ] Are animations optional/reduceable?
- [ ] Is audio/video autoplay可控?
- [ ] Are tasks broken into simple steps?
- [ ] Is text dyslexia-friendly (sans-serif, adequate spacing)?
- [ ] Is navigation predictable?
- [ ] Are time limits avoided or extendable?
