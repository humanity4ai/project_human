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

## Principles

This skill is grounded in the Humanity4AI core principles and the following skill-specific principles:

1. **Non-clinical scope is absolute.** This skill provides content design guidance, not clinical advice. Any content that touches on clinical treatment must be flagged in `safety_flags`.
2. **Stigma reduction is the primary goal.** Language that pathologises, dramatises, or trivialises depression must be identified and rewritten.
3. **Cognitive load matters.** People affected by depression may have reduced working memory and attention. Content must be chunked, clear, and low-demand.
4. **Explicit uncertainty over false reassurance.** Avoid language that promises recovery or implies a simple path to wellness.
5. **Escalation paths are mandatory.** Any content that touches on crisis, self-harm, or suicidality must include escalation guidance.


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

## Language Guidelines

### Person-First vs. Identity-First

**Person-First** (generally preferred):
- "person living with depression"
- "individual experiencing anxiety"
- "someone with bipolar disorder"

**Identity-First** (some prefer—respect both):
- "depressed person" (if they use this)
- "autistic person" (if they use this)
- "disabled person" (if they use this)

**Best Practice**: When in doubt, ask. If writing for a general audience, person-first is the safer default.

### Terms to Avoid

| Avoid | Preferred |
|-------|-----------|
| "committed suicide" | "died by suicide" or "took their own life" |
| "suicide victim" | "person who died by suicide" |
| "mentally ill" (noun) | "person with mental illness" |
| "suffering from" | "living with" or "experiencing" |
| "paranoid schizophrenic" | "person with schizophrenia" |
| "high-functioning" | Be specific about abilities |
| "borderline" | Specify the trait |
| "addict" | "person with substance use disorder" |
| "clean" (drug tests) | "negative" |
| "dirty" (drug tests) | "positive" |

### Crisis Language

**Required** when content discusses suicide or self-harm:
- Use "died by suicide" not "committed suicide"
- Use "suicidal thoughts" not "suicidal tendencies"
- Use "person with suicidal ideation" not "suicidal person"
- Include crisis resources: 988, Crisis Text Line (741741)

## Cognitive Accessibility

### Sentence Structure
- Keep sentences under 20 words when possible
- Use active voice
- One idea per sentence
- Break long paragraphs into shorter ones

### Word Choice
- Avoid jargon and technical terms
- Use common, everyday words
- Define abbreviations on first use
- Avoid idioms and slang that may confuse

### Formatting
- Use clear headings
- Use bullet points for lists
- Use white space generously
- Consider accessibility (screen reader friendly)

## Examples (Extended)

### Example 1: Patient Documentation
**Input**: "The depressed patient showed poor compliance with treatment."

**Output**: "The person living with depression found it challenging to follow the treatment plan."

**Why it works**: Person-first language respects dignity. "Found it challenging" is less judgmental than "poor compliance."

---

### Example 2: Website Content
**Input**: "Depression is a serious mental illness that affects millions of people worldwide and requires professional intervention. If you suffer from depression, you know how debilitating it can be."

**Output**: "Depression affects millions of people. It can feel overwhelming, but support is available. If you're experiencing depression, you may find these resources helpful."

**Why it works**: 
- Shorter sentences reduce cognitive load
- "It can feel overwhelming" validates experience
- "If you're experiencing" uses person-first language
- "Support is available" is empowering, not clinical

---

### Example 3: News Article
**Input**: "She was a victim of severe depression and committed suicide last year."

**Output**: "She was living with depression and died by suicide last year."

**Why it works**: 
- "Victim of depression" implies helplessness
- "Committed suicide" can carry stigma (implies crime/sin)
- Both alternatives are accurate and respectful

---

### Example 4: Product Copy
**Input**: "Stop feeling sad and start living again!"

**Output**: "Finding moments of joy is possible. Here's how we can support you."

**Why it works**:
- "Stop feeling sad" trivializes depression
- "Start living again" implies they weren't living
- New version acknowledges struggle while offering support

---

### Example 5: Form Fields
**Input**: "Are you depressed? Yes / No"

**Output**: "How have you been feeling lately? (Select all that apply)
- Persistent sadness
- Loss of interest
- Difficulty sleeping
- Fatigue
- None of the above"

**Why it works**:
- Single "depressed?" question is reductive
- Opens up nuance without labeling
- Gives user control over how they describe themselves

---

## Common Patterns to Fix

### 1. Language That Implies Choice
**Bad**: "They chose to live on the streets despite mental illness."
**Better**: "They experienced homelessness while living with mental illness."

### 2. Language That Implies Weakness
**Bad**: "He's just lazy and doesn't want to work."
**Better**: "He may be experiencing barriers to employment. Let's explore support options."

### 3. Language That Implies Hopelessness
**Bad**: "The treatment didn't work. There's no hope."
**Better**: "The treatment approach needs adjustment. Let's explore other options."

### 4. Language That Shames
**Bad**: "If you can't handle stress, you shouldn't be in this job."
**Better**: "Let's explore accommodations that might help manage stress in this role."

### 5. Language That Stereotypes
**Bad**: "People with depression are unpredictable."
**Better**: "Depression can affect people differently. Some may need flexibility in their work arrangements."

---

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

```bash
# Audit content
python3 scripts/audit.py --input content.txt --format json

# Suggest alternatives
python3 scripts/suggest_alternatives.py --input content.txt --format json

# Check for stigma
python3 scripts/check_stigma.py --input content.txt --format json
```

---

*This skill provides content auditing for emotional safety. It is not a substitute for professional mental health advice.*
