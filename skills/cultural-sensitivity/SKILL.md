---
name: cultural-sensitivity
description: Design for cultural inclusivity. Use when user asks to 'make culturally sensitive', 'adapt for culture', 'reduce cultural bias', 'cultural awareness', 'inclusive design'.
version: 0.2.0
license: MIT
author: project-human
compatibility: Requires Python 3.8+
allowed-tools: Bash(python3:*), Read, Write
tags:
  - cultural
  - sensitivity
  - inclusion
  - diversity
  - bias
  - global
---

# Cultural Sensitivity

## Purpose

This skill helps create culturally inclusive digital experiences that respect diverse backgrounds, avoid bias, and work across different cultural contexts. Based on APA cultural competency guidelines and Hofstede's cultural dimensions.

## When to Use

Use this skill when:
- Adapting content for different regions
- Reducing cultural bias in design
- Creating global products
- Ensuring inclusive communication
- Avoiding cultural stereotyping
- Respecting diverse backgrounds

## Principles

This skill is grounded in the Humanity4AI core principles and the following skill-specific principles:

1. **No culture is monolithic.** Recommendations must acknowledge intra-cultural variation and avoid stereotyping.
2. **Explicit uncertainty over false certainty.** Cultural norms are contested and evolving. Always disclose the `uncertainty` level in responses.
3. **Humility over authority.** This skill provides guidance, not definitive cultural truth. Users with lived experience of a culture should be deferred to.
4. **Avoid cultural appropriation.** Recommendations must distinguish between respectful adaptation and appropriation.
5. **Safety boundaries apply.** Do not make claims about the superiority or inferiority of any culture.


## Cultural Dimensions to Consider

### Individualism vs. Collectivism
- Some cultures value individual achievement
- Others emphasize group harmony
- Design accordingly (personalization vs. community)

### Power Distance
- Some cultures accept hierarchy
- Others prefer equality
- Design formality levels accordingly

### Uncertainty Avoidance
- Some cultures comfortable with ambiguity
- Others prefer clear rules
- Provide appropriate guidance

### Time Orientation
- Some cultures future-oriented (planning)
- Some present-oriented (flexibility)
- Some past-oriented (tradition)
- Design pacing accordingly

### High vs. Low Context
- High context: implicit communication (some Asian, Middle Eastern cultures)
- Low context: explicit communication (Western cultures)
- Adjust communication style

## Boundaries

### Always

- Use neutral, inclusive language
- Avoid cultural stereotypes
- Respect local customs and norms
- Consider global usability
- Allow localization

### Ask First

- Ask about regional preferences
- Confirm appropriate tone
- Ask about imagery preferences
- Verify color meanings in context

### Never

- Never use culturally specific idioms
- Never assume cultural norms are universal
- Never use potentially offensive imagery
- Never make assumptions about religion
- Never ignore regional holidays/events

## Design Guidelines

### Language

**Use Clear, Simple Language**
- Avoid idioms and slang
- Use active voice
- Define abbreviations
- Consider translation

**Be Careful With**
- Humor (often doesn't translate)
- Idioms ("piece of cake," "break a leg")
- References that assume local knowledge
- Assumptions about common experiences

### Imagery

**Consider**
- Representation of diverse groups
- Local customs and dress
- Appropriate hand gestures
- Color meanings vary by culture
- Religious symbols

**Avoid**
- Stereotypical imagery
- Assumptions about family structures
- Western-centric visuals

### Color

**Cultural Meanings**
- White: Purity (West), mourning (parts of Asia)
- Red: Danger (West), luck/prosperity (China)
- Black: Death/mourning (West), prosperity (Africa)
- Yellow: Cowardice (West), royal (Thailand)

### Date/Time Formats

**Regional Differences**
- US: MM/DD/YYYY
- Europe: DD/MM/YYYY
- Asia: YYYY-MM-DD
- 12-hour vs 24-hour clocks

### Forms of Address

**Cultural Variations**
- First name vs. last name usage
- Titles (Mr., Ms., Dr.)
- Formal vs. informal
- Names order varies by culture

---

## Instructions

### Step 1: Identify Cultural Context

Determine:
- Target regions/cultures
- Local customs and norms
- Potential sensitive areas
- Local holidays/events

### Step 2: Audit Content

Review for:
- Cultural assumptions
- Idioms or slang
- Imagery appropriateness
- Color meanings
- Format preferences

### Step 3: Adapt

For each issue:
1. Identify cultural barrier
2. Provide culturally sensitive alternative
3. Explain context

---

## Examples

### Example 1: Idioms
**Input**: "This is a piece of cake!"

**Problem**: Idioms don't translate

**Solution**: "This is straightforward" or "This is easy"

---

### Example 2: Imagery
**Input**: Image shows only Western-style weddings

**Solution**: Include diverse wedding customs

---

### Example 3: Color
**Input**: Red for "error" in Chinese market

**Problem**: Red means prosperity in China

**Solution**: Use different color or test locally

---

### Example 4: Forms
**Input**: "Enter your first name" then "Enter your last name"

**Problem**: Some cultures list family name first

**Solution**: "Enter your name as it appears on your ID"

---

## What Not to Do

### Avoid
- Cultural stereotypes
- Idioms and slang
- Region-specific references
- Assuming universal norms
- Ignoring local customs

### Don't Assume
- Everyone has same family structure
- Everyone celebrates same holidays
- Same gestures mean same thing
- Same colors mean same thing
- Same communication style works

---

## Additional Resources

- **[references/standards.md](references/standards.md)** - Cultural competency standards
- **[references/patterns.md](references/patterns.md)** - Cultural patterns
- **[references/bias.md](references/bias.md)** - Implicit bias detection
- **[references/gender.md](references/gender.md)** - Gender considerations
- **[references/regional.md](references/regional.md)** - Regional differences
- **[references/checklist.md](references/checklist.md)** - Implementation checklist
- **[references/examples.md](references/examples.md)** - Examples
- **[references/quick-reference.md](references/quick-reference.md)** - Quick reference

## Script Usage

This skill includes validation scripts:

- **detect_issues.py** — Detect cultural issues
- **audit_assumptions.py** — Audit cultural assumptions
- **check_stereotypes.py** — Check for stereotypes
- **detect_bias.py** — Detect implicit bias

```bash
# Detect cultural issues
python3 scripts/detect_issues.py --input content.txt --format json

# Check for stereotypes
python3 scripts/check_stereotypes.py --input content.txt --format json
```

---

*This skill helps create culturally inclusive digital experiences.*
