---
name: age-inclusive-design
description: Design for users of all ages. Use when user asks to 'make accessible for older adults', 'improve age-inclusive design', 'help elderly users', 'reduce age-related friction', 'design for all ages', 'age-friendly interface'.
version: 0.2.0
license: MIT
author: project-human
compatibility: Requires Python 3.8+
allowed-tools: Bash(python3:*), Read, Write
tags:
  - age-inclusive
  - elderly
  - usability
  - accessibility
  - design
  - older-adults
  - senior-users
---

# Age-Inclusive Design

## Purpose

This skill helps create digital experiences that work well for users of all ages. It addresses age-related changes in vision, motor control, cognition, and technology comfort to reduce friction and improve accessibility for older and younger users alike. Based on ISO 25556:2025 (Ageing-inclusive digital economy) and NIST usability guidelines.

## When to Use

Use this skill when:
- Designing for older adults (65+)
- Creating multi-generational products
- Improving accessibility for elderly users
- Reducing age-related friction in interfaces
- Making content accessible across age groups
- Addressing usability concerns for seniors

## Age-Related Changes to Consider

### Vision Changes
- Reduced visual acuity
- Need for larger text
- Reduced contrast sensitivity
- Difficulty focusing on close objects
- Increased sensitivity to glare
- Changes in color perception

### Motor Changes
- Reduced fine motor control
- Tremors or shaky hands
- Reduced grip strength
- Slower response times
- Difficulty with precise movements

### Cognitive Changes
- Slower processing speed
- Reduced working memory
- Difficulty with new interfaces
- May prefer familiar patterns
- May need more time for decisions

### Technology Comfort
- May be less familiar with technology
- May lack confidence with new interfaces
- May prefer step-by-step guidance
- May be wary of online security

## Boundaries

### Always

- Use minimum 16px font for body text
- Ensure 4.5:1 contrast ratio (WCAG AA)
- Make click/touch targets minimum 44x44px
- Provide clear, immediate feedback
- Use simple, familiar language
- Offer customization options

### Ask First

- Ask about preferred font sizes
- Confirm before auto-completing actions
- Ask about preferred level of assistance

### Never

- Never assume all older adults are the same
- Never use age stereotypes (e.g., "elderly don't use tech")
- Never make interactions time-sensitive without warning
- Never hide important information in small text
- Never assume low tech literacy (many seniors are tech-savvy)

## Design Guidelines

### Typography

**Font Size**
- Body text: minimum 16px (18-20px recommended)
- Headings: 24px+ for H1, 20px+ for H2
- Provide user option to increase size

**Font Choices**
- Use sans-serif fonts (easier to read)
- Avoid decorative or script fonts
- Use adequate line spacing (1.5x)
- Use adequate letter spacing

**Contrast**
- 4.5:1 minimum for normal text (WCAG AA)
- 3:1 for large text (WCAG AA)
- 7:1 for AAA compliance
- Ensure sufficient contrast without being harsh

### Touch Targets

**Minimum Size**
- 44x44px minimum (WCAG)
- 48x48px recommended for older users
- Space between targets: 8px minimum

**Placement**
- Avoid edges and corners (harder to tap)
- Place important actions in center
- Avoid requiring precise taps

### Navigation

**Clear Navigation**
- Consistent placement across pages
- Clear, descriptive labels
- Breadcrumb trails for orientation
- Skip links for screen readers

**Process Steps**
- Break complex tasks into steps
- Show progress indicators
- Allow saving progress
- Don't require memory of previous steps

### Forms

**Input Design**
- Clear labels above fields
- Show all required fields
- Provide inline validation
- Use real-time feedback
- Avoid CAPTCHA if possible (or provide audio option)

**Error Handling**
- Clear error messages
- Suggest corrections
- Don't use technical jargon
- Allow easy correction

### Content

**Writing for All Ages**
- Use simple, direct language
- Avoid jargon and slang
- Define technical terms
- Use active voice
- Short paragraphs (3-4 sentences max)

**Visual Content**
- Use clear images that support content
- Provide alt text for all images
- Avoid text in images
- Use sufficient contrast

### Interaction Design

**Time Limits**
- Avoid time limits where possible
- If required, warn clearly
- Allow extension of time limits

**Feedback**
- Immediate feedback for actions
- Clear confirmation of completed actions
- Status updates for long processes

**Error Prevention**
- Ask confirmation for important actions
- Provide undo options
- Don't require precise input

---

## Instructions

### Step 1: Audit Current State

Review the design for:
- Font sizes (minimum 16px body)
- Touch target sizes (minimum 44x44px)
- Contrast ratios (4.5:1 minimum)
- Navigation complexity
- Form design
- Content readability
- Error handling

### Step 2: Identify Issues

Categorize findings:
- Critical: Barriers preventing use
- High: Significant friction
- Medium: Minor inconvenience
- Low: Enhancement opportunity

### Step 3: Prioritize Fixes

Address issues in order:
1. Critical barriers first
2. Then high friction
3. Then medium/low improvements

### Step 4: Implement Changes

For each issue:
1. Identify the problem
2. Provide specific solution
3. Include code/examples where relevant

---

## Examples

### Example 1: Font Size
**Input**: Body text is 12px

**Issue**: Too small for many older users

**Solution**: Increase to 18px minimum

```css
body {
  font-size: 18px; /* Was 12px */
  line-height: 1.6;
}
```

---

### Example 2: Touch Targets
**Input**: Small buttons that are close together

**Issue**: Hard to tap accurately with reduced motor control

**Solution**: Increase size and spacing

```css
.button {
  min-height: 48px;
  min-width: 48px;
  margin: 8px;
  padding: 12px 24px;
}
```

---

### Example 3: Navigation
**Input**: Complex navigation with many options

**Issue**: Overwhelming, hard to find items

**Solution**: Simplify and organize

- Use clear categories
- Limit top-level items to 7
- Use familiar terminology
- Add search

---

### Example 4: Forms
**Input**: Form with no clear labels, error messages in technical language

**Issue**: Confusing, frustrating to complete

**Solution**: Clear labels and helpful errors

- Labels above fields
- "Email address" not "Email"
- Error: "Please enter a valid email" not "Invalid value"

---

## What Not to Do

### Avoid
- Tiny text (under 16px)
- Low contrast (gray on white)
- Small, close touch targets
- Time-limited interactions
- Complex navigation
- Technical jargon
- Assuming tech illiteracy

### Don't Assume
- All older users are the same
- Older users can't learn new things
- Younger users don't need accessibility
- Technology comfort is based on age alone

---

## Additional Resources

- **[references/standards.md](references/standards.md)** - ISO 25556:2025, WCAG guidelines
- **[references/patterns.md](references/patterns.md)** - Age-inclusive design patterns
- **[references/stereotypes.md](references/stereotypes.md)** - Age stereotypes to avoid
- **[references/font-guidelines.md](references/font-guidelines.md)** - Typography guidelines
- **[references/interaction.md](references/interaction.md)** - Interaction design
- **[references/navigation.md](references/navigation.md)** - Navigation patterns
- **[references/checklist.md](references/checklist.md)** - Implementation checklist
- **[references/examples.md](references/examples.md)** - Good and bad examples

## Script Usage

This skill includes validation scripts:

- **audit_assumptions.py** — Check for age-related assumptions
- **detect_stereotypes.py** — Detect age stereotypes
- **analyze_clarity.py** — Analyze font and readability
- **validate_language.py** — Validate age-friendly language

```bash
# Audit assumptions
python3 scripts/audit_assumptions.py --input design.txt --format json

# Detect stereotypes
python3 scripts/detect_stereotypes.py --input content.txt --format json
```

---

*This skill helps create age-inclusive digital experiences.*
