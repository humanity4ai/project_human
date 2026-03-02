---
name: depression-sensitive-content
description: Audit and rewrite content to reduce stigma, improve emotional safety, and lower cognitive load for people affected by depression. Use when user asks to 'make content more sensitive', 'remove stigmatizing language', 'improve emotional safety', 'rewrite for depression awareness', 'audit content for mental health sensitivity'.
version: 0.2.0
license: MIT
author: project-human
compatibility: Requires Python 3.8+
allowed-tools: Bash(python3:*), Read, Write
tags:
  - mental-health
  - emotional-safety
  - content-audit
  - stigma-reduction
  - sensitive-content
  - depression
  - cognitive-load
  - language-guidelines
---

# Depression-Sensitive Content

## Purpose

This skill audits and rewrites product content to reduce shame language, lower cognitive load, and improve emotional safety for people affected by depression. It applies person-first language, avoids stigmatizing terminology, and ensures content is emotionally safe without being clinical or prescriptive.

## When to Use

- "Make this content more sensitive to people with depression"
- "Remove stigmatizing language from this text"
- "Audit this page for mental health sensitivity"
- "Rewrite this for emotional safety"
- "Improve cognitive accessibility for depressed users"
- "Check for shame-inducing language"
- "Suggest gentler alternatives to this phrasing"

## Boundaries

### Always

- Use person-first language: "person living with depression" NOT "depressed person"
- Avoid terms like "suffering from," "mentally ill," "victim of depression"
- Never provide medical advice, diagnosis, or treatment recommendations
- Include crisis resources when content discusses suicidal ideation
- Preserve scientific accuracy when discussing depression

### Ask First

- Ask user before suggesting professional help if no crisis indicators present
- Confirm before adding clinical terminology to non-clinical content
- Verify cultural context before applying language guidelines

### Never

- Never use phrases like "committed suicide" (use "died by suicide")
- Never describe depression as "a disease" or "mental illness" in casual contexts
- Never use "mentally ill" as a noun
- Never suggest depression is a "choice" or "weakness"
- Never provide therapy techniques in non-therapeutic contexts
- Never promise cures or treatments

## Instructions

### Step 1: Analyze Content

Review the provided content for:
- Stigmatizing language and terminology
- Cognitive friction (complex sentences, jargon)
- Shame-inducing phrases
- Clinical terminology in non-clinical contexts
- Missing person-first language

### Step 2: Classify Findings

Categorize issues by severity:
- **Critical**: Crisis language, dangerous advice, stigmatizing terms
- **High**: Shame-inducing language, clinical misstatements
- **Medium**: Cognitive friction, informal clinical terms
- **Low**: Style preferences, minor terminology issues

### Step 3: Generate Rewrites

For each issue:
1. Identify the problematic phrase
2. Provide the original text
3. Suggest an alternative
4. Explain why the alternative is better

### Step 4: Assess Escalation

Determine if professional escalation is needed:
- Suicidal ideation detected → Include crisis resources immediately
- Crisis language → Flag for human review
- Safe content → Proceed with standard rewrites

## Examples

### Example 1: Removing Stigmatizing Language

**Input**: "The depressed patient showed poor compliance with treatment."

**Output**: "The person living with depression found it challenging to follow the treatment plan."

**Why it works**: Person-first language ("person living with") respects dignity. "Challenged to follow" is less judgmental than "poor compliance."

### Example 2: Reducing Cognitive Load

**Input**: "Depression is a serious mental illness that affects millions of people worldwide and requires professional intervention."

**Output**: "Depression affects millions of people. It can feel overwhelming, but support is available."

**Why it works**: Shorter sentences reduce cognitive load. "Can feel overwhelming" validates the experience without clinical framing.

### Example 3: Crisis Escalation

**Input**: "I can't take this anymore. I just want to end it all."

**Output**: "I hear you, and I'm concerned. Please reach out to a crisis line: 988 (US) or text/call 988. You're not alone."

**Why it works**: Validates the person's pain while providing immediate crisis resources.

## Error Handling

When uncertain:
- Default to person-first language
- Err on the side of emotional safety
- Include crisis resources if any risk indicators present
- Flag for human review if clinical terminology is needed

## Available Scripts

- **`scripts/audit.py`** — Scans content for stigmatizing phrases
- **`scripts/detect_harmful.py`** — Identifies harmful or dangerous language
- **`scripts/detect_cognitive.py`** — Detects cognitive friction
- **`scripts/classify_severity.py`** — Classifies issues by severity
- **`scripts/suggest_alternatives.py`** — Generates alternative phrasing
- **`scripts/validate_safe.py`** — Validates content is safe
- **`scripts/categorize_issues.py`** — Categorizes issues by type
- **`scripts/check_medical.py`** — Checks for medical claims
- **`scripts/check_stigma.py`** — Checks for stigma patterns
- **`scripts/suggest_gentle.py`** — Suggests gentler language
- **`scripts/check_escalation.py`** — Checks escalation needs
- **`scripts/generate_rationale.py`** — Generates rewrite rationale

## Additional Resources

- **[references/standards.md](references/standards.md)** - APA and clinical guidelines
- **[references/patterns.md](references/patterns.md)** - Common patterns to avoid
- **[references/checklist.md](references/checklist.md)** - Complete audit checklist
- **[references/clinical-guidelines.md](references/clinical-guidelines.md)** - Professional guidelines
- **[references/crisis-resources.md](references/crisis-resources.md)** - Escalation resources
- **[references/examples.md](references/examples.md)** - Good/bad examples
- **[references/alternatives.md](references/alternatives.md)** - Alternative phrases
- **[references/quick-reference.md](references/quick-reference.md)** - Quick reference guide

## Progressive Disclosure

- Level 1: Metadata (name, description) - Always loaded at startup
- Level 2: SKILL.md body - Loaded when skill triggers
- Level 3: references/ and scripts/ - Loaded on demand
