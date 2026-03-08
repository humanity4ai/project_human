---
name: empathetic-communication
description: Improve emotional resonance in communication. Use when user asks to 'be more empathetic', 'improve tone', 'show empathy', 'sound more caring', 'connect emotionally', 'respond with compassion'.
version: 0.2.0
license: MIT
author: project-human
compatibility: Requires Python 3.8+
allowed-tools: Bash(python3:*), Read, Write
tags:
  - empathy
  - communication
  - tone
  - emotional-intelligence
  - active-listening
  - compassion
---

# Empathetic Communication

## Purpose

This skill helps improve emotional resonance and empathy in written communication. It guides users to connect with their audience on an emotional level while maintaining authenticity. Based on principles of emotional intelligence, active listening, and compassionate communication.

## When to Use

Use this skill when:
- Writing to someone who is upset or grieving
- Responding to emotional situations
- Improving customer communication
- Writing sympathetic messages
- Connecting with audience emotionally
- Improving tone of written content
- Responding with compassion

## Boundaries

### Always

- Lead with emotion acknowledgment before problem-solving
- Validate feelings before offering solutions
- Use "I" statements to show understanding
- Match emotional tone appropriately
- Show genuine care, not performative sympathy

### Ask First

- Ask before assuming emotional state
- Confirm tone before heavy emotional language
- Check if they want empathy or just information

### Never

- Never use hollow empathy ("I understand how you feel" when you can't)
- Never jump to solutions without acknowledging feelings
- Never use clichés that dismiss emotions
- Never make it about yourself
- Never dismiss their experience
- Never use toxic positivity

## Core Principles

### 1. Acknowledge Before Solving
Emotions first, solutions second. Always validate before moving to fix.

**Bad**: "Here's what you should do..."
**Good**: "That sounds really difficult. Here's what might help..."

### 2. Name the Emotion
Explicitly acknowledge what they're feeling.

- "I can hear how frustrated you are"
- "That sounds scary"
- "It seems like you're feeling overwhelmed"

### 3. Use "I" Statements
Show your perspective without claiming to understand fully.

- "I can only imagine how difficult this must be"
- "I hear you saying..."
- "I want to make sure I understand..."

### 4. Match Emotional Tone
Mirror the emotional intensity of the situation.

- High emotion → High empathy, quiet tone
- Medium emotion → Acknowledgment, solution path
- Low emotion → Warmth, encouragement

### 5. Be Specific
Generic sympathy feels hollow. Be specific about what you hear.

**Hollow**: "I'm sorry you're going through this."
**Empathetic**: "Losing a job brings up so much fear and uncertainty. That sounds really hard."

---

## Techniques

### Active Listening (Written)

1. **Reflect back**: "What I'm hearing is..."
2. **Name the emotion**: "You sound frustrated"
3. **Acknowledge context**: "Given everything you've described..."
4. **Validate**: "That makes complete sense"

### Empathetic Responses

1. **Lead with feeling**: "That sounds..."
2. **Name the struggle**: "What you're going through..."
3. **Show you're present**: "I'm here with you"
4. **Offer connection**: "You're not alone"

### Avoiding Hollow Empathy

| Instead of | Try |
|-----------|-----|
| "I understand" | "I can only imagine how difficult" |
| "I know how you feel" | "From what you've shared, it sounds like" |
| "It could be worse" | "This is really hard" |
| "You'll be fine" | "Whatever you need, I'm here" |
| "At least..." | Focus on their experience |

---

## Instructions

### Step 1: Identify Emotional Content

Read the message and identify:
- What emotion is present?
- How intense is it?
- What triggered it?
- What does the person need?

### Step 2: Acknowledge the Emotion

Lead with empathy:
- Name what they're feeling
- Validate their experience
- Show you're listening

### Step 3: Connect Before Solving

Before offering solutions:
- Show you understand
- Ask what would help
- Offer presence if solutions aren't ready

### Step 4: Offer Appropriate Support

- If they want solutions: Offer them
- If they want to vent: Listen
- If unsure: Ask what they need

---

## Examples

### Example 1: Customer Complaint
**Input**: "I've been trying to get this resolved for three weeks and I'm still nowhere!"

**Good Response**:
"Three weeks of this is exhausting, and I can hear how frustrated you are. I'm so sorry you've had this experience. Let me take ownership of this right now and get you to someone who can solve this today."

**Why it works**: Acknowledges frustration, apologizes, takes action.

---

### Example 2: Personal Struggles
**Input**: "I'm going through a really hard time right now."

**Good Response**:
"I'm so sorry. When you're going through something hard, it can feel so isolating. I want you to know I'm here. Would it help to talk about what's happening, or is there something specific I can do?"

**Why it works**: Validates difficulty, offers presence, asks what they need.

---

### Example 3: What Not to Say
**Input**: "I failed the exam I studied so hard for."

**Poor Response**:
"Don't worry, you'll pass next time! At least you studied hard. Plenty of people fail exams."

**Problems**:
- "Don't worry" dismisses feelings
- "At least" minimizes
- Makes it about others
- Hollow positivity

**Better Response**:
"Studying hard and not passing is so disappointing. That feeling is valid. Do you want to talk about what happened, or do you just need to vent?"

---

## Empathetic Phrases

### To Acknowledge
- "I hear you"
- "That sounds really difficult"
- "I can understand why you'd feel that way"
- "That makes complete sense"

### To Validate
- "Your feelings are valid"
- "It makes sense you'd feel..."
- "I would feel the same way"
- "What you're experiencing is real"

### To Show Presence
- "I'm here with you"
- "You're not alone"
- "I'm listening"
- "Take your time"

### To Offer Help
- "What would help most right now?"
- "Is there something specific I can do?"
- "Here's what I can do..."
- "How can I support you?"

---

## Cultural Considerations

- Different cultures express emotion differently
- Some cultures value emotional restraint
- Some prefer direct communication, others indirect
- Eye contact norms vary
- Personal space and physical comfort vary

---

## Error Handling

When you're not sure:
1. Ask what they need: "Would you like advice or just to talk?"
2. Default to presence over advice
3. It's okay to say "I don't know what to say, but I'm here"
4. Don't fake understanding you don't have

---

## Additional Resources

- **[references/standards.md](references/standards.md)** - Emotional intelligence standards
- **[references/patterns.md](references/patterns.md)** - Empathetic vs hollow patterns
- **[references/authenticity.md](references/authenticity.md)** - Authentic vs performative empathy
- **[references/tonal.md](references/tonal.md)** - Tone guidelines
- **[references/boundaries.md](references/boundaries.md)** - Empathy boundaries
- **[references/checklist.md](references/checklist.md)** - Communication checklist
- **[references/examples.md](references/examples.md)** - Response examples
- **[references/quick-reference.md](references/quick-reference.md)** - Quick reference

## Script Usage

This skill includes validation scripts:

- **validate_empathy.py** — Validate response shows genuine empathy
- **analyze_tone.py** — Analyze emotional tone
- **detect_hollow.py** — Detect hollow empathy phrases
- **suggest_improvements.py** — Suggest improvements

```bash
# Validate empathy
python3 scripts/validate_empathy.py --input response.txt --format json

# Analyze tone
python3 scripts/analyze_tone.py --input response.txt --format json
```

---

*This skill helps create emotionally resonant communication.*
