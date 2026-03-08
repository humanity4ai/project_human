---
name: neurodiversity-aware-design
description: Design for diverse cognitive processing. Use when user asks to 'make ADHD-friendly', 'autism-friendly design', 'sensory-friendly', 'reduce cognitive overload', 'dyslexia-friendly', 'neurodiversity design'.
version: 0.2.0
license: MIT
author: project-human
compatibility: Requires Python 3.8+
allowed-tools: Bash(python3:*), Read, Write
tags:
  - neurodiversity
  - ADHD
  - autism
  - dyslexia
  - sensory
  - cognitive-accessibility
  - inclusive-design
---

# Neurodiversity-Aware Design

## Purpose

This skill helps create digital experiences that accommodate diverse cognitive processing styles, including ADHD, autism, dyslexia, and other neurological differences. Based on Microsoft Inclusive Design for Cognition and COGA (Cognitive and Learning Disabilities Accessibility) guidelines.

## When to Use

Use this skill when:
- Making ADHD-friendly interfaces
- Creating autism-friendly experiences
- Reducing sensory overload
- Designing for dyslexia
- Improving cognitive accessibility
- Accommodating diverse attention patterns

## Principles

This skill is grounded in the Humanity4AI core principles and the following skill-specific principles:

1. **Neurodiversity is not a deficit.** Design guidance must treat neurodivergent users as capable individuals with different processing styles, not as impaired users.
2. **Context determines accessibility.** Neurodivergent profiles vary widely between individuals. Recommendations must be framed as considerations, not absolute requirements.
3. **Explicit uncertainty over false certainty.** Acknowledge when a recommendation may not apply to all users with a given neurodivergent profile.
4. **Inclusive design benefits everyone.** Improvements for neurodivergent users (predictable layouts, reduced sensory overload, clear language) improve usability for all users.
5. **Safety boundaries apply.** Do not make medical or clinical claims about neurodivergent conditions such as ADHD or autism.


## Understanding Neurodiversity

### ADHD (Attention Deficit Hyperactivity Disorder)
- Difficulty focusing on boring tasks
- Hyperfocus on interesting tasks
- Impulsivity
- Time blindness
- Working memory challenges

**Design Implications**:
- Reduce distractions
- Break tasks into small steps
- Provide reminders and deadlines
- Allow focus mode
- Avoid timed tasks

### Autism Spectrum
- Sensory sensitivity
- Need for predictability
- Literal interpretation
- Difficulty with social cues
- Special interests

**Design Implications**:
- Minimize sensory input
- Provide clear structure
- Be explicit, not implied
- Avoid figurative language
- Allow customization

### Dyslexia
- Difficulty with reading
- Letter/word reversals
- Slow reading
- Visual stress

**Design Implications**:
- Use readable fonts
- Good contrast (not too high)
- Avoid justified text
- Provide audio options

## Boundaries

### Always

- Provide sensory control (reduce animations, allow customization)
- Use clear, simple language
- Offer predictability (consistent navigation)
- Break complex tasks into steps
- Provide feedback and confirmation

### Ask First

- Ask about sensory preferences
- Confirm before auto-playing media
- Ask about preferred communication style

### Never

- Never make diagnostic claims
- Never assume all neurodivergent users are the same
- Never use sensory-heavy designs without alternatives
- Never rely solely on written instructions
- Never use time limits without warnings

## Design Guidelines

### Sensory Considerations

**Visual**
- Avoid flashing/blinking content
- Provide dark mode option
- Allow color customization
- Use solid backgrounds (not busy)
- Minimize visual clutter

**Auditory**
- Allow volume control
- Provide captions/transcripts
- Don't auto-play audio
- Allow muting

**Motion**
- Respect "prefers-reduced-motion"
- Don't require tracking moving content
- Provide static alternatives

### Attention & Focus

**For ADHD**
- Clear visual hierarchy
- Remove distractions from focus areas
- Progress indicators for long tasks
- Reminders and notifications (opt-in)
- Save progress automatically

**For Autism**
- Predictable navigation
- Clear labels
- Consistent patterns
- Explicit instructions
- No surprises

### Reading & Comprehension

**For Dyslexia**
- Use sans-serif fonts (Arial, Verdana, OpenDyslexic)
- 14-18px minimum font size
- Line height 1.5-1.75
- Left-align text (never justified)
- Adequate letter spacing
- Good contrast (but not harsh white)

### Task Completion

**Break Tasks Into Steps**
- One action per screen
- Clear progress indicators
- Allow saving progress
- Don't require memory of previous steps

**Provide Guidance**
- Clear instructions
- Multiple formats (text + visual)
- Help available at each step

---

## Instructions

### Step 1: Identify User Needs

Determine which neurodiversity aspects to address:
- ADHD-friendly features
- Autism accommodations
- Dyslexia support
- General cognitive accessibility

### Step 2: Audit Current Design

Review for:
- Sensory triggers (flashing, motion, clutter)
- Attention challenges (distractions, complexity)
- Reading challenges (font, spacing, layout)
- Task complexity (steps, memory demands)

### Step 3: Implement Changes

For each issue:
1. Identify the barrier
2. Provide specific solution
3. Include code examples

---

## Examples

### Example 1: ADHD-Friendly Task
**Input**: Long form with many required fields at once

**Solution**: Break into steps with progress indicator

```html
<!-- Step 1 of 3 -->
<div class="progress">Step 1: Basic Info</div>
<button>Next</button>
```

---

### Example 2: Autism-Friendly Navigation
**Input**: Navigation that changes based on context

**Solution**: Consistent navigation that doesn't surprise users

```html
<!-- Same nav on every page -->
<nav>
  <a href="/home">Home</a>
  <a href="/about">About</a>
</nav>
```

---

### Example 3: Sensory-Friendly Colors
**Input**: Bright white background with neon accents

**Solution**: Offer dark mode, muted colors

```css
@media (prefers-color-scheme: dark) {
  body {
    background: #1a1a1a;
    color: #e0e0e0;
  }
}
```

---

### Example 4: Dyslexia-Friendly Text
**Input**: Small serif font, justified, tight spacing

**Solution**: Sans-serif, adequate spacing, left-aligned

```css
body {
  font-family: Arial, Verdana, sans-serif;
  font-size: 18px;
  line-height: 1.6;
  text-align: left; /* Never justify */
  letter-spacing: 0.05em;
}
```

---

## What Not to Do

### Avoid
- Flashing/blinking content
- Autoplay media
- Busy/patterned backgrounds
- Time-limited tasks
- Complex navigation
- Justified text
- Small fonts
- Assumptions about ability

### Don't Assume
- All ADHD users have the same needs
- All autism users have the same needs
- Neurodivergent users want the same experience
- Familiarity with conventions

---

## Additional Resources

- **[references/standards.md](references/standards.md)** - COGA guidelines
- **[references/patterns.md](references/patterns.md)** - Design patterns
- **[references/sensory-guide.md](references/sensory-guide.md)** - Sensory considerations
- **[references/communication.md](references/communication.md)** - Clear communication
- **[references/accommodations.md](references/accommodations.md)** - Accommodation options
- **[references/checklist.md](references/checklist.md)** - Implementation checklist
- **[references/examples.md](references/examples.md)** - Examples
- **[references/quick-reference.md](references/quick-reference.md)** - Quick reference

## Script Usage

This skill includes validation scripts:

- **sensory_check.py** — Check for sensory triggers
- **analyze_sensory.py** — Analyze sensory impact
- **detect_overwhelming.py** — Detect overwhelming patterns
- **suggest_accommodations.py** — Suggest accommodations

```bash
# Check for sensory triggers
python3 scripts/sensory_check.py --input design.txt --format json

# Suggest accommodations
python3 scripts/suggest_accommodations.py --input design.txt --format json
```

---

*This skill helps create neurodiversity-friendly digital experiences.*
