---
name: supportive-conversation
description: Generate supportive responses with safety boundaries. Use when user asks to 'be supportive', 'help with emotional support', 'provide encouragement', 'respond with empathy', 'offer emotional support'.
version: 0.2.0
license: MIT
author: project-human
compatibility: Requires Python 3.8+
allowed-tools: Bash(python3:*), Read, Write
tags:
  - support
  - conversation
  - empathy
  - emotional-support
  - active-listening
  - crisis-support
---

# Supportive Conversation

## Purpose

This skill provides non-clinical, emotionally supportive conversation responses. It helps users respond sensitively to people experiencing emotional distress, providing presence and validation without minimizing their feelings or offering unsolicited advice. This is NOT therapeutic support—it is presence-based emotional support that acknowledges feelings and offers connection.

This skill is **safety-critical** because it may encounter individuals expressing suicidal ideation, self-harm, or crisis. Proper escalation protocols are essential.

## When to Use

Use this skill when the user asks for help with:
- "How do I support someone who is upset?"
- "Respond to this message with empathy"
- "Be supportive of someone going through a hard time"
- "Help me find the right words to say"
- "How should I respond to someone who is grieving?"
- "Write a supportive message for [situation]"
- "I need emotional support language"
- "Help me be there for a friend"

## Boundaries

### Always

- Validate the person's emotions without minimizing
- Use presence-first language ("I'm here with you" not "It could be worse")
- Acknowledge their feelings as real and valid
- Include crisis resources when risk indicators are present
- Use person-first language (e.g., "person experiencing depression" not "depressed person")
- Respect the person's autonomy in their emotional experience

### Ask First

- Ask before suggesting "things will get better" or positive reframing
- Confirm before offering specific advice or solutions
- Ask if they want resources or just someone to listen
- Check in before suggesting professional help (unless crisis indicators present)

### Never

- Never minimize: "It could be worse", "At least...", "You should be grateful"
- Never compare suffering: "Others have it worse", "I had it harder"
- Never dismiss: "Don't cry", "It's not that bad", "Cheer up"
- Never give unsolicited advice or "fix it" solutions
- Never use clichés: "Everything happens for a reason", "Time heals all wounds"
- Never claim to understand if you don't ("I know exactly how you feel")
- Never rush the emotional process: "You need to move on", "It's been long enough"
- Never use ableist language or stigmatizing terms about mental health
- Never promise outcomes you can't guarantee

## Instructions

### Step 1: Assess the Situation

Determine the nature of the emotional support needed:

1. **Acute Crisis**: Person expresses suicidal ideation, self-harm, or severe distress
2. **Emotional Distress**: Person is upset, sad, anxious, or struggling
3. **Ongoing Support**: Person is processing a difficult experience
4. **Check-in**: Person just needs someone to talk to

**Decision Point**: If Step 1 indicates acute crisis → Go to Step 5 (Crisis Response). Otherwise → Continue to Step 2.

### Step 2: Validate Feelings

Begin by acknowledging the emotional experience:

- "That sounds really difficult"
- "I'm so sorry you're going through this"
- "It makes sense that you're feeling [emotion]"
- "Thank you for sharing this with me"

**Why it works**: Validation communicates that their feelings are real, reasonable, and worthy of attention. It creates connection without fixing.

### Step 3: Offer Presence

Use presence-first language:

- "I'm here with you"
- "You're not alone in this"
- "I'm listening"
- "Take all the time you need"
- "There's no right or wrong way to feel"

**Avoid**: "It could be worse", "At least [positive spin]", "You should [advice]"

### Step 4: Check In (Optional)

Gently offer support options:

- "Would you like to talk about it more?"
- "Is there something specific that would help?"
- "Or would you just prefer to be heard?"
- "Would it help to have some resources, or do you just need to talk?"

**Why**: Some people want advice, others want only presence. Checking in respects autonomy.

### Step 5: Crisis Response (When Risk Indicators Present)

**Risk Indicators** (if any present, include crisis resources):
- Expressing hopelessness or worthlessness
- Talking about death, suicide, or self-harm
- Saying things like "everyone would be better off without me"
- Showing signs of severe depression or anxiety
- Mentioning access to means of harm

**Required Response**:
1. Validate: "I'm so glad you reached out"
2. Express care: "I want to make sure you're safe"
3. Provide resources:
   - **988 Suicide & Crisis Lifeline**: Call or text **988** (US)
   - **Crisis Text Line**: Text **HOME** to **741741**
   - **International Association for Suicide Prevention**: https://www.iasp.info/resources/Crisis_Centres/
4. Encourage professional help: "Would you be willing to talk to someone who can help?"

### Step 6: Close with Care

End the response appropriately:

- For ongoing support: "I'm here whenever you need to talk"
- For crisis: "Please reach out to 988 or text HOME to 741741"
- For practical: "Take care of yourself"

## Examples

### Example 1: Validating Distress

**Input**: "My friend canceled our plans again. I feel like nobody cares about me."

**Good Response**:
"I'm so sorry. It really hurts when plans fall through, especially when you're looking forward to connection. Those feelings of being unimportant are real and valid. I'm here for you."

**Why it works**: Validates the emotion, acknowledges the pain, offers presence. Does not minimize or redirect.

**Poor Response**:
"At least you have other friends you can hang out with."

**Why it fails**: Minimizes the feelings and dismisses the emotional experience.

---

### Example 2: Ongoing Struggles

**Input**: "I've been feeling really overwhelmed lately with work and life. I don't know how much longer I can do this."

**Good Response**:
"That sounds like a lot to carry. The feeling of being overwhelmed is body's way of saying something needs your to change. You don't have to figure everything out right now. Would you like to talk about what's weighing on you most? Or sometimes it helps just to know someone's in your corner. I'm here."

**Why it works**: Validates the overwhelm, normalizes the feeling, offers connection without rushing to solutions.

---

### Example 3: Crisis Indicators

**Input**: "I just feel like everyone would be better off without me. I'm so tired of being a burden."

**Good Response**:
"I'm so glad you reached out to me. I want you to know that you matter—not for what you do or how you feel, but simply because you're you. This kind of pain is really hard to carry alone.

Please consider reaching out right now:
- **Call or text 988** (US Suicide & Crisis Lifeline)
- **Text HOME to 741741** (Crisis Text Line)
- https://www.iasp.info/resources/Crisis_Centries/ (International)

Would you be willing to talk to someone who can help right now? You don't have to face this alone."

**Why it works**: Validates reaching out, expresses care, provides specific crisis resources, encourages professional help.

---

### Example 4: What Not to Say

**Input**: "I failed my exam. I'm so stupid."

**Poor Response**:
"Don't be so hard on yourself. At least you tried, and plenty of people fail exams. You'll do better next time!"

**Problems**:
- Dismisses the feeling ("don't be hard on yourself")
- Minimizes ("at least you tried")
- Compares to others ("plenty of people fail")
- Rushes to fix-it ("you'll do better next time")

**Better Response**:
"Failing an exam really hurts. It makes sense you're feeling frustrated and disappointed in yourself right now. That feeling is valid. Want to talk about what happened, or do you just need to vent?"

---

## Error Handling

When uncertain about the appropriate level of support:

1. **Default to presence over advice**: It's safer to over-listen than to give unsolicited counsel
2. **Don't assume you understand their situation**: Ask before assuming
3. **When in doubt, provide resources**: Crisis resources are never harmful to include
4. **If risk indicators present, ALWAYS escalate**: Err on the side of caution
5. **Cultural variations matter**: Grief, emotional expression, and support-seeking vary across cultures

## Additional Resources

- **[references/standards.md](references/standards.md)** - Professional guidelines and boundaries
- **[references/patterns.md](references/patterns.md)** - Supportive vs harmful phrases
- **[references/checklist.md](references/checklist.md)** - Response checklist
- **[references/crisis.md](references/crisis.md)** - Crisis detection and indicators
- **[references/escalation.md](references/escalation.md)** - Escalation protocols
- **[references/resources.md](references/resources.md)** - Crisis contacts and support resources
- **[references/examples.md](references/examples.md)** - Response examples
- **[references/quick-reference.md](references/quick-reference.md)** - Quick reference guide

## Script Usage

This skill includes validation scripts in the `scripts/` folder:

- **detect_risk.py** — Detect crisis/risk language in text
- **assess_severity.py** — Assess severity of emotional distress
- **validate_compassion.py** — Validate response is supportive
- **escalate_decide.py** — Decide if escalation is needed

```bash
# Detect risk in user message
python3 scripts/detect_risk.py --input "message.txt" --format json

# Validate a response
python3 scripts/validate_compassionate.py --input response.txt
```

---

*This skill provides non-clinical emotional support only. It is not a substitute for professional mental health care.*
