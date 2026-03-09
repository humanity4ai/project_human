---
name: grief-loss-support
description: Offer non-clinical, compassionate support language for grief and loss. Use when user asks to 'support someone grieving', 'respond to loss', 'help with grief', 'compassionate bereavement', 'sensitive grief language'.
version: 0.2.0
license: MIT
author: project-human
compatibility: Requires Python 3.8+
allowed-tools: Bash(python3:*), Read, Write
tags:
  - grief
  - bereavement
  - loss
  - emotional-support
  - compassionate
  - non-clinical
---

# Grief and Loss Support

## Purpose

This skill provides non-clinical, compassionate support language for grief and loss-related conversations. It helps users respond sensitively to people experiencing grief without minimizing their pain or offering platitudes.

## When to Use

- "How do I support someone who is grieving?"
- "Respond to this message about loss compassionately"
- "Help me write a sympathy message"
- "What should I say to someone who lost a loved one?"
- "Make this more sensitive for grieving users"

## Boundaries

### Always

- Acknowledge the loss without minimizing
- Use presence-first language
- Validate the person's grief experience
- Include crisis resources if grief becomes crisis

### Ask First

- Ask before suggesting "moving on" or "healing"
- Confirm before offering practical advice
- Verify cultural context of grief expressions

### Never

- Never say "I know how you feel"
- Never minimize with "they're in a better place"
- Never rush the grieving process
- Never offer unsolicited advice
- Never use clichés like "time heals all wounds"

## Principles

This skill is grounded in the Humanity4AI core principles and the following skill-specific principles:

1. **Grief is non-linear.** Do not imply that grief follows a fixed sequence of stages. Acknowledge that grief is unique to each person.
2. **Presence before problem-solving.** Acknowledge the person's loss before offering any guidance or resources.
3. **Non-clinical boundaries are absolute.** This skill provides supportive language, not grief therapy. Clinical risk must trigger escalation guidance.
4. **Cultural context matters.** Grief expression and mourning practices vary significantly across cultures. Recommendations must account for this.
5. **Explicit uncertainty over false reassurance.** Never promise that grief will end or that the person will "feel better soon".


## Instructions

### Step 1: Acknowledge Loss

Begin by validating the grief:
- "I'm so sorry for your loss"
- "That sounds really difficult"
- "Thank you for sharing this with me"

### Step 2: Offer Presence

Use presence-first language:
- "I'm here with you"
- "You're not alone"
- "Take all the time you need"

### Step 3: Practical Steps (Optional)

Only if asked or appropriate:
- Suggest specific support resources
- Offer concrete help (specific tasks)
- Share grief support contacts

### Step 4: Crisis Escalation

If crisis indicators appear:
- Include 988 crisis line
- Offer Crisis Text Line
- Suggest professional grief counseling

## Examples

### Example 1: Acknowledging Loss

**Input**: "My mom passed away last week."

**Output**: "I'm so sorry for your loss. Losing your mom is incredibly hard. I'm here with you."

**Why it works**: Acknowledges the specific loss, validates the difficulty, offers presence.

### Example 2: What Not to Say

**Input**: "At least they're in a better place now."

**Output**: Avoid this. Instead: "I know this is so painful. There are no words."

**Why**: Minimizes grief by suggesting the loss has a silver lining.

### Example 3: Crisis Response

**Input**: "I can't live without them. I want to end this pain."

**Output**: "I'm so glad you reached out. This pain is so hard. Please call 988 or text HOME to 741741. You don't have to face this alone."

**Why it works**: Validates pain, provides immediate crisis resources.

## Error Handling

When uncertain about the appropriate level of support:

1. **Default to presence over advice**: It's safer to listen than to give unsolicited counsel
2. **Don't assume you understand their grief**: Everyone's grief is unique
3. **When in doubt, provide resources**: Crisis resources are never harmful to include
4. **If risk indicators present, ALWAYS escalate**: Err on the side of caution
5. **Cultural variations matter**: Grief expressions and mourning practices vary across cultures
6. **Avoid making assumptions about beliefs**: Don't assume religious beliefs about afterlife
7. **Don't rush the timeline**: Grief has no expiration date

## Types of Grief

### Anticipatory Grief
Preparing for an expected loss (terminal illness, upcoming death)

### Sudden Loss
Unexpected death, accident, suicide, homicide

### Complicated Grief
Prolonged, intense grief that impacts daily functioning

### Collective/Community Grief
Shared loss affecting communities (pandemic, natural disaster, mass tragedy)

### Pet Loss
Grief specifically for animal companions

### Pregnancy/Infant Loss
Miscarriage, stillbirth, neonatal death

**Note**: Adjust your response based on the type of grief, but always lead with presence.

## Stages of Grief (Non-Linear)

People may experience grief in different orders, revisit stages, or not experience all stages:

- **Shock/Denial**: "This can't be real"
- **Anger**: "Why them? Why me?"
- **Bargaining**: "If only I had..."
- **Depression**: Deep sadness, withdrawal
- **Acceptance**: Finding ways to live with the loss

**Key Point**: Don't reference stages unless the person brings them up. Don't tell someone where they "should" be in their grief.

## Cultural Considerations

Different cultures have different mourning practices:

- **Expression**: Some cultures encourage outward expression of grief; others value quiet remembrance
- **Timeframes**: Mourning periods vary from days to years across cultures
- **Rituals**: Funerals, memorials, and remembrance practices differ
- **Language**: Terms for death and loss vary
- **Support seeking**: Some cultures view seeking support differently

**Best Practice**: Ask about cultural preferences rather than assuming

## Supporting Someone Through Grief

### What Helps
- Being present (even in silence)
- Listening without judgment
- Validating their feelings
- Using the deceased's name
- Checking in regularly
- Offering specific help (not "let me know if you need anything")
- Remembering important dates

### What Doesn't Help
- Minimizing their loss
- Comparing losses
- Telling them how to feel
- Rushing their grief
- Avoiding the topic
- Making assumptions about beliefs

## Examples (Extended)

### Example 1: Sudden Death
**Input**: "My husband died suddenly yesterday. We didn't see it coming."

**Good Response**:
"I'm so sorry. Losing someone suddenly is devastating—there are no words. I can't imagine what you're going through right now. I'm here with you. Would you like to talk about him, or would you prefer just to sit with me?"

**Why it works**: Acknowledges sudden loss, doesn't minimize, offers presence, gives choice.

---

### Example 2: Anticipatory Grief
**Input**: "My father has terminal cancer. He's got maybe a few months. I don't know how to handle this."

**Good Response**:
"That sounds incredibly hard. Anticipatory grief is real—grieving someone who's still here but facing a terminal diagnosis. There's no right way to do this. Are you able to talk about what's happening, or do you need to just vent?"

**Why it works**: Validates anticipatory grief as real, acknowledges difficulty, offers support.

---

### Example 3: Pet Loss
**Input**: "My dog of 14 years had to be put down yesterday. I feel ridiculous being this upset over a pet."

**Good Response**:
"Fourteen years of companionship—that's a deep bond. Your grief is completely valid. Losing a pet is a real loss, and it's okay to feel devastated. Don't minimize your feelings for anyone."

**Why it works**: Validates grief without dismissing, acknowledges the relationship.

---

### Example 4: What Not to Say (Avoid)
**Input**: "My mom passed away last month."

**Poor Response**:
"She's in a better place now. Everything happens for a reason. At least she lived a long life. Time heals all wounds—you'll move on soon."

**Problems**:
- Makes assumptions about afterlife beliefs
- Uses clichés that minimize pain
- Rushes the grieving process
- Dismisses the loss

**Better Response**:
"I'm so sorry for your loss. Losing your mom is incredibly hard. I'm here with you."

---

### Example 5: Supporting a Child
**Input**: "How do I explain to my 8-year-old that their grandfather died?"

**Good Response**:
"Children need honesty at their level of understanding. Use clear, simple language: 'Grandpa's body stopped working, and he won't come back.' Allow them to ask questions, express feelings, and grieve in their own way. Maintain routines as much as possible. Would you like specific guidance on talking to children about death?"

**Why it works**: Provides age-appropriate guidance, validates child's need for truth, offers more help.

---

### Example 6: Long-Term Support
**Input**: "My friend lost her husband two years ago. His birthday is coming up and she's been struggling."

**Good Response**:
"Anniversaries and milestones can bring grief right back—even years later. That's completely normal. Consider reaching out to her on his birthday with a simple message: 'I'm thinking of you and [husband's name] today. I'm here if you want to talk.'"

**Why it works**: Validates that grief can resurface, provides actionable support.

---

## Additional Resources

- **[references/standards.md](references/standards.md)** - Professional guidelines and boundaries
- **[references/patterns.md](references/patterns.md)** - Supportive vs harmful phrases
- **[references/checklist.md](references/checklist.md)** - Response checklist
- **[references/crisis-resources.md](references/crisis-resources.md)** - Crisis contacts
- **[references/phrases-avoid.md](references/phrases-avoid.md)** - Phrases to avoid
- **[references/acknowledgment.md](references/acknowledgment.md)** - Acknowledgment examples
- **[references/examples.md](references/examples.md)** - Response examples
- **[references/quick-reference.md](references/quick-reference.md)** - Quick reference

## Script Usage

This skill includes validation scripts in the `scripts/` folder:

- **detect_crisis.py** — Detect crisis/risk language in text
- **acknowledge_loss.py** — Generate acknowledgment language
- **presence_first.py** — Generate presence-based language
- **validate_compassion.py** — Validate response is compassionate

```bash
# Detect risk in user message
python3 scripts/detect_crisis.py --input "message.txt" --format json

# Generate acknowledgment
python3 scripts/acknowledge_loss.py --input "message.txt" --format json

# Validate a response
python3 scripts/validate_compassion.py --input response.txt
```

---

*This skill provides non-clinical grief support only. It is not a substitute for professional grief counseling.*

