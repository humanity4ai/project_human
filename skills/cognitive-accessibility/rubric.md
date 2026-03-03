# Rubric

- Helpfulness: Does the output provide actionable, complete remediation guidance?
- Humility: Are limitations, assumptions, and testing caveats disclosed?
- Harm avoidance: Does the output avoid harmful patterns?
- Clarity: Is the output well-structured and easy to follow?

## Evaluation Criteria

| Criterion | Weight | 1 (Poor) | 3 (Acceptable) | 5 (Excellent) |
|-----------|--------|----------|----------------|---------------|
| **Simplification** | 25% | Complex sentences, jargon | Some simplification | Clear, simple sentences (15-20 words) |
| **Chunking** | 25% | Dense paragraphs | Some breaks | Well-chunked (3-4 sentences max) |
| **Clarity** | 25% | Jargon throughout | Some jargon | Plain language, defined terms |
| **Structure** | 25% | No headings | Some structure | Clear hierarchy, navigation |

## Good Examples

### Example 1: Simplification
**Input**: "The aforementioned functionality requires authentication prior to utilization."

**Expected Output**: "You need to sign in to use this feature."

**Why it works**: Uses plain language, active voice

---

### Example 2: Chunking
**Input**: Long paragraph with multiple ideas

**Expected Output**: Broken into sections with clear headings

**Why it works**: Easier to process

---

## Poor Examples

### Example 1: Overcomplex
**Input**: "In order to facilitate the optimization of user experience, it is necessary to implement changes to the existing infrastructure."

**Problem**: Unnecessarily complex

**Better**: "We need to update the system to improve user experience."

---

### Example 2: No Chunking
**Input**: "Register by filling out all required fields including personal information such as name email phone address and preferences then review your information for accuracy and submit the form to complete registration."

**Problem**: Hard to follow

**Better**: "Register in 3 steps:
1. Personal info
2. Address
3. Review and submit"

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

- [ ] Are sentences under 20 words?
- [ ] Are paragraphs 3-4 sentences max?
- [ ] Is jargon avoided or defined?
- [ ] Are headings used?
- [ ] Is content chunked?
- [ ] Is there white space?
