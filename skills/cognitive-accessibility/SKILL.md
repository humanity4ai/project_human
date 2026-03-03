---
name: cognitive-accessibility
description: Improve content and workflows for users with varied attention, memory, and executive function profiles. Use when user asks to 'simplify content', 'reduce cognitive load', 'improve readability', 'chunk content', 'make accessible for ADHD', 'help with focus'.
version: 0.2.0
license: MIT
author: project-human
compatibility: Requires Python 3.8+
allowed-tools: Bash(python3:*), Read, Write
tags:
  - cognitive-accessibility
  - readability
  - simplification
  - chunking
  - executive-function
  - attention
  - memory
---

# Cognitive Accessibility

## Purpose

Improves content and workflows for users with varied attention, memory, and executive function profiles. Applies cognitive load theory, chunking strategies, and clear information architecture.

## When to Use

- "Simplify this content"
- "Reduce cognitive load"
- "Make this more readable"
- "Chunk this information"
- "Help users with focus issues"
- "Improve accessibility for ADHD"
- "Simplify the user flow"

## Boundaries

### Always

- Use clear, simple language
- Chunk information into small pieces
- Provide clear signposting
- Include recovery options

### Ask First

- Confirm before major restructuring
- Check cultural context

### Never

- Never use jargon without explanation
- Never create complex multi-step flows without breaks

## Instructions

### Step 1: Assess Load

Analyze content for:
- Sentence length and complexity
- Jargon and technical terms
- Multi-step processes
- Information density

### Step 2: Identify Friction

Find:
- Ambiguous instructions
- Missing progress indicators
- No way to save progress
- Dense paragraphs

### Step 3: Recommend Changes

Suggest:
- Chunking strategies
- Clear headings
- Progress indicators
- Save/resume options

## Examples

### Example 1: Chunking

**Input**: "To register, fill out the form completely including your name, email, phone number, address, and preferences, then review your information, confirm it's correct, and submit."

**Output**: "Register in 3 steps:
1. Your details (name, email)
2. Your address
3. Review and submit"

### Example 2: Clear Language

**Input**: "The aforementioned functionality requires authentication prior to utilization."

**Output**: "You need to sign in to use this feature."

## Additional Resources

- **[references/standards.md](references/standards.md)** - Cognitive accessibility standards
- **[references/patterns.md](references/patterns.md)** - Chunking patterns
- **[references/checklist.md](references/checklist.md)** - Cognitive checklist
- **[references/load-theory.md](references/load-theory.md)** - Cognitive load theory
- **[references/simplification.md](references/simplification.md)** - Simplification techniques
- **[references/measurement.md](references/measurement.md)** - Measurement metrics
- **[references/examples.md](references/examples.md)** - Examples
- **[references/quick-reference.md](references/quick-reference.md)** - Quick reference

## Cognitive Load Theory

### Types of Cognitive Load

**Intrinsic Load**: Inherent complexity of the material
- Cannot be eliminated, can be managed
- Break complex topics into steps

**Extraneous Load**: Unnecessary burden from design
- Should be minimized
- Clear layout, simple language

**Germane Load**: Productive learning
- Should be supported
- Good examples, practice

### Reducing Cognitive Load

1. **Chunk Information**: Group related items
2. **Use White Space**: Don't crowd content
3. **Clear Hierarchy**: Headings, lists, structure
4. **Multiple Formats**: Text + images + video
5. **Allow Pacing**: Don't rush users

## Sentence and Paragraph Guidelines

### Sentence Length
- Target: 15-20 words maximum
- Avoid: Sentences over 25 words
- Split long sentences into two

### Paragraph Length
- Maximum 3-4 sentences per paragraph
- One idea per paragraph
- Use white space between paragraphs

### Word Choice
- Use common, everyday words
- Avoid jargon
- Define technical terms inline
- Use verbs, not noun forms

## Task Design

### Multi-Step Tasks
- Break into 3-5 steps maximum
- Show progress (step X of Y)
- Allow saving progress
- Don't require memory across steps

### Error Recovery
- Clear error messages
- Suggest corrections
- Don't blame users
- Easy to find and fix errors

### Navigation
- Consistent placement
- Clear labels
- Don't require remembering
- Provide search

## Script Usage

This skill includes validation scripts:

- **analyze_load.py** — Analyze cognitive load
- **measure_readability.py** — Measure readability
- **simplify_text.py** — Suggest simplifications
- **chunk_content.py** — Analyze chunking

```bash
# Analyze cognitive load
python3 scripts/analyze_load.py --input content.txt --format json

# Measure readability
python3 scripts/measure_readability.py --input content.txt --format json
```

---

*This skill helps create cognitively accessible content.*
