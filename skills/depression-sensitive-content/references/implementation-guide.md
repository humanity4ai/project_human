# Depression-Sensitive Web Content Support - Implementation Guide

This document provides comprehensive guidance for auditing and rewriting web content to reduce emotional distress and cognitive load. This is a UX and content accessibility tool, NOT a clinical resource. For mental health concerns, consult qualified healthcare professionals.

---

## Section A: Rewrite Library

### A.1 Core Principles

This section defines seven foundational principles for depression-sensitive content design. Each principle includes clinical rationale, standards mapping, and practical implementation guidance.

#### Principle 1: Remove Shame and Blame Language

**Definition:** Error messages and system feedback shall attribute failures to system conditions or input format issues rather than to user character, ability, or character.

**Clinical Rationale:** Shame-inducing language activates the brain's threat response systems, including the amygdala. Research in cognitive psychology demonstrates that threat activation impairs executive function, including problem-solving capabilities and working memory. For users experiencing depressive symptoms, this impairment is compounded by existing deficits in cognitive flexibility and processing speed. Depersonalized language preserves the user's sense of agency and competence.

**Standards Mapping:**
- WCAG 2.2 Success Criterion 3.3.1 (Level A): Error Identification - "If an input error is automatically detected and the user is identified, then the error is described to the user in text."
- WCAG 2.2 Success Criterion 3.3.2 (Level A): Labels or Instructions - "Labels or instructions are provided when content requires user input."
- W3C COGA Objective 2: Help users avoid making mistakes - "Make it easy to understand what is wrong and how to correct mistakes."
- ISO 9241-110:2006 Clause 5.4 (Conformity with user expectations): "The dialogue conforms with user expectations by being consistent and conforming to generally accepted conventions."
- ISO 9241-110:2006 Clause 5.7 (Error tolerance): "The dialogue is error-tolerant if, despite evident errors in input, the intended result may be achieved with no or minimal recovery effort."

**Implementation Guidance:**
- Replace "You" statements with system-focused language: "Your session expired" → "Session expired due to inactivity"
- Use passive voice for system failures: "You entered invalid data" → "Email format not recognized"
- Avoid exclamation points in error states: "Invalid!" → "Not recognized"
- Never attribute failure to user intelligence or character: "You're too stupid to use this" → N/A (obvious)
- Provide neutral diagnostic information: "Your password is wrong" → "Password not found for this email"

---

#### Principle 2: Reduce Urgency Pressure

**Definition:** Interface communications shall avoid time-dependent pressure tactics, countdown timers, and urgent language that may induce anxiety or precipitate hasty decision-making.

**Clinical Rationale:** Depressive disorders frequently involve impaired executive function, including reduced processing speed and decision-making capacity. Time pressure creates artificial cognitive load that compounds these deficits. Additionally, anxiety and depression often co-occur, with time pressure serving as an anxiety trigger that may exacerbate depressive symptoms. Extended time allowances and neutral framing support cognitive processing without inducing stress responses.

**Standards Mapping:**
- WCAG 2.2 Success Criterion 2.2.6 (Level AAA): Timeouts - "Users are warned of the duration of any user inactivity that could cause data loss, unless the data is preserved for more than 20 hours."
- WCAG 2.2 Success Criterion 3.2.5 (Level AA): Change on Request - "Changes to the value of any user interface component does not automatically cause a change of context unless the user has been advised of the behavior before using the component."
- W3C COGA Objective 4: Provide help and support - "Make it easy to get help and have extra time if needed."
- ISO 9241-110:2006 Clause 5.5 (Controllability): "The dialogue is controllable when the user is able to initiate and control the direction and pace of interaction to the extent needed."

**Implementation Guidance:**
- Eliminate countdown timers on forms requiring cognitive input (applications, checkout, account creation)
- Replace "ACT NOW!", "Limited time!", "Last chance!" with neutral time indicators: "Offer expires in 7 days"
- Extend default timeouts to maximum practical duration; warn well in advance of expiration
- Avoid auto-submit on time limits; require explicit user action
- Remove false urgency: "Only 2 items left!" → "Limited availability" or remove entirely

---

#### Principle 3: Self-Descriptive Call-to-Action Labels

**Definition:** Interactive elements shall use labels that describe the specific outcome or result of the interaction rather than generic commands or action verbs.

**Clinical Rationale:** Depression impairs working memory capacity, reducing the ability to hold intermediate steps in conscious attention. Self-descriptive labels reduce cognitive load by eliminating the need for users to recall or infer what happens when clicking a button. Clear outcome descriptions also support prospective memory (remembering to perform future intentions) which is particularly affected in depressive states.

**Standards Mapping:**
- WCAG 2.2 Success Criterion 2.4.6 (Level AA): Headings and Labels - "Headings and labels describe topic or purpose."
- WCAG 2.2 Success Criterion 2.4.9 (Level AAA): Link Purpose (Link Only) - "A mechanism is available to allow the purpose of each link to be identified from link text alone."
- W3C COGA Objective 1: Help users understand what things are and how to use them - "Use clear and simple language and provide consistent navigation."
- ISO 9241-110:2006 Clause 5.2 (Self-descriptiveness): "The dialogue is self-descriptive when each dialogue step is immediately comprehensible through feedback from the system or is annotated by the user."

**Implementation Guidance:**
- Replace generic "Submit" with outcome description: "Create account", "Send message", "Save draft"
- Replace "Click here" with descriptive links: "View pricing plans", "Read the guide"
- Replace "Go" or "Start" with specific outcomes: "Start free trial", "Begin application"
- Button labels should answer: "What happens when I click this?"
- Consider adding parenthetical context: "Continue (to payment)" vs. "Continue (to next step)"

---

#### Principle 4: Error Recovery Templates

**Definition:** Every error condition shall include explicit, actionable guidance on how to resolve the error and proceed with the user's intended task.

**Clinical Rationale:** Learned helplessness is a well-documented phenomenon in depression research, characterized by the belief that one's actions have no effect on outcomes. Error messages without recovery paths may reinforce this belief, leading to task abandonment. Conversely, clear recovery paths restore the user's sense of agency and competence. Error recovery guidance also reduces working memory load by eliminating the need to generate solutions independently.

**Standards Mapping:**
- WCAG 2.2 Success Criterion 3.3.3 (Level AA): Error Suggestion - "If an input error is automatically detected and suggestions for correction are known, then the suggestions are provided to the user, unless it would jeopardize the security or purpose of the content."
- WCAG 2.2 Success Criterion 3.3.4 (Level AA): Error Prevention (Legal, Financial, Data) - "For pages that cause legal commitments or financial transactions for the user to occur, that result in the user's data being deleted or modified, the user can reverse, correct, or confirm the action."
- W3C COGA Objective 2: Help users avoid making mistakes - "Make it easy to understand what is wrong and how to correct mistakes. Make it easy to undo mistakes."
- ISO 9241-110:2006 Clause 5.7 (Error tolerance): "The dialogue is error-tolerant if, despite evident errors in input, the intended result may be achieved with no or minimal recovery effort."

**Implementation Guidance:**
- Every error message must answer: "What do I do now?"
- Provide concrete examples for format errors: "Email format not recognized. Example: name@domain.com"
- Include specific remediation steps: "Check your email for the confirmation link"
- Offer alternative paths: "If problems persist, contact support@example.com"
- Avoid blank "Error" messages or technical jargon without context

---

#### Principle 5: Reduce Memory Reliance

**Definition:** Interfaces shall display necessary information rather than requiring users to recall information from previous interactions, external documents, or memory.

**Clinical Rationale:** Depression is associated with significant impairments in working memory, the cognitive system responsible for temporarily holding and manipulating information. These deficits affect the ability to hold information "in mind" across multiple steps, recall credentials or identifiers from memory, and maintain task goals during interruptions. Interfaces that minimize memory demands support successful task completion for users with cognitive impairments.

**Standards Mapping:**
- WCAG 2.2 Success Criterion 3.3.7 (Level A): Redundant Entry - "Information previously entered by or provided to the user is either auto-populated or available for selection, except when re-entering information is essential, the information is required by the security settings, or the previously entered information is no longer valid."
- WCAG 2.2 Success Criterion 3.2.6 (Level AA): Consistent Help - "If a web page contains any interactive help and there is more than one web page with consistent help, the help is accessible in a consistent way."
- W3C COGA Objective 3: Help users find what they need - "Make it easy to find what they need, including making it easy to navigate and providing cues to help users find what they need."
- ISO 9241-110:2006 Clause 5.3 (Suitability for the task): "The dialogue is suitable for the task when it facilitates the effective and efficient completion of the task by the user."

**Implementation Guidance:**
- Auto-populate known information from user profiles
- Provide "Remember me" options for authentication
- Display help text inline rather than requiring recall from documentation
- Show password requirements before entry rather than after failure
- Provide clear field references: "Policy number (found on your insurance card, top right)"
- Avoid forcing users to navigate away and return to retrieve information

---

#### Principle 6: Scannable Plain Language

**Definition:** Content shall be composed of short, clearly organized sections with key information presented first, using vocabulary accessible to users with varying literacy levels.

**Clinical Rationale:** Depression frequently involves difficulties with concentration and attention, making it challenging to process lengthy or complex text. Cognitive load theory demonstrates that working memory capacity is limited; when cognitive demands exceed capacity, comprehension fails. Plain language with clear structure reduces processing demands, supporting comprehension for users with attentional deficits. Frontloading key information (inverted pyramid style) allows users to grasp essential content without completing entire passages.

**Standards Mapping:**
- WCAG 2.2 Success Criterion 3.1.5 (Level AAA): Reading Level - "When text requires reading ability more advanced than the lower secondary education level, supplemental content is available at a lower reading level."
- WCAG 2.2 Success Criterion 3.1.4 (Level AAA): Unusual Words - "A mechanism is available for identifying specific definitions of words or phrases used in an unusual or restricted way, including idioms and jargon."
- W3C COGA Objective 1: Help users understand what things are and how to use them - "Use clear and simple language."
- W3C COGA Objective 3: Help users find what they need - "Break information into smaller manageable chunks with clear titles."
- ISO 9241-110:2006 Clause 5.3 (Suitability for the task): "Information presentation shall be appropriate to the task and shall not include irrelevant or unnecessary information."

**Implementation Guidance:**
- Use bullet points and numbered lists for multi-step processes
- Frontload key information: "Account created successfully" before additional details
- Limit paragraphs to 2-3 sentences maximum
- Use headings to organize content into scannable sections
- Define technical terms on first use or in a glossary
- Aim for 8th-grade reading level or lower for instructional content

---

#### Principle 7: Calm UI Microcopy Patterns

**Definition:** Interface text shall use a neutral-to-supportive tone, avoiding excessive enthusiasm, alarm, or emotional manipulation.

**Clinical Rationale:** Depression affects emotional regulation, making users more susceptible to emotional reactions to interface text. Exaggerated positive language (excessive exclamation points, "Congratulations!", "Amazing!") may feel incongruent or dismissive when users are struggling. Conversely, alarming language (errors marked "CRITICAL", "DANGER", "URGENT") may trigger anxiety responses. Neutral, informative language maintains a professional tone that respects users' emotional states without adding additional affective load.

**Standards Mapping:**
- ISO 9241-110:2006 Clause 5.4 (Conformity with user expectations): "The dialogue conforms with user expectations by being consistent and conforming to generally accepted conventions."
- ISO/IEC 30071-1:2019 Clause 8.2: Accessibility policy shall address inclusive language and non-discriminatory content in all user-facing communications.
- W3C COGA Objective 1: Help users understand what things are - "Use a neutral tone and avoid language that may be upsetting."
- W3C COGA Objective 4: Provide help and support - "Provide a calm, supportive interface without pressure tactics."

**Implementation Guidance:**
- Use periods instead of exclamation points in most contexts
- Replace "Congratulations!" with informative confirmation: "Account created successfully"
- Use "Warning" sparingly; prefer descriptive labels: "Warning: Unsaved changes" vs. "DANGER!"
- Avoid conditional threats: "If you don't subscribe now, you'll miss..."
- Use supportive language: "We couldn't find your account" vs. "Your account doesn't exist"
- Maintain consistent tone across all interface states

---

### A.2 Before/After Rewrite Examples

The following examples demonstrate the application of depression-sensitive content principles across various interface contexts. Each example includes the original content, the recommended rewrite, rationale for changes, and standards mapping.

**Example 1: 404 Error Page (General Web)**

*Original:*
```
Oops! You broke something. This page doesn't exist.
```

*Recommended Rewrite:*
```
Page not found.

The page you're looking for doesn't exist or has been moved. Check the URL for typos, or return to the homepage to find what you need.
```

*Rationale:*
- Removed second-person blame ("You broke")
- Changed from first-person apology to neutral statement
- Provided specific recovery actions (check URL, return home)
- No exclamation points
- Clear, informative tone

*Standards Mapping:*
- WCAG 3.3.1 (Error Identification): Error is clearly described
- WCAG 3.3.3 (Error Suggestion): Recovery path provided
- ISO 9241-110 (Error tolerance): User can recover with minimal effort
- COGA Objective 2: Easy to understand and correct mistakes

---

**Example 2: Form Validation - Email Field (E-commerce)**

*Original:*
```
Invalid email! Try again.
```

*Recommended Rewrite:*
```
Email format not recognized.

Please enter an email address in this format: name@domain.com
```

*Rationale:*
- Depersonalized: attributes to format, not user
- Removed exclamation point (calm tone)
- Provided concrete example (reduces memory load)
- Includes specific format guidance (recovery)

*Standards Mapping:*
- WCAG 3.3.1 (Error Identification): Error identified as format issue
- WCAG 3.3.3 (Error Suggestion): Format example provided
- ISO 9241-110 (Self-descriptiveness): Clear error explanation
- COGA Objective 2: Easy to understand and correct

---

**Example 3: Account Signup Call-to-Action (General Web)**

*Original:*
```
Sign up now!
```

*Recommended Rewrite:*
```
Create your account

(Takes about 2 minutes)
```

*Rationale:*
- Self-descriptive outcome rather than command
- Added time expectation (reduces uncertainty)
- Neutral, informative tone
- No urgency pressure

*Standards Mapping:*
- WCAG 2.4.6 (Headings and Labels): Label describes purpose
- ISO 9241-110 (Self-descriptiveness): Clear what action does
- COGA Objective 1: Clear and simple language
- ISO 9241-110 (Controllability): User knows what to expect

---

**Example 4: Empty State - Mood Tracking Dashboard (Sensitive Context)**

*Original:*
```
No activities logged.

You should track your mood daily to see your progress over time.
```

*Recommended Rewrite:*
```
When you log activities, they'll appear here.

Optional: Track your mood daily to identify patterns in your energy and wellbeing.
```

*Rationale:*
- Removed "should" (obligation language)
- Added temporal framing ("When you log" vs. "No activities")
- Emphasized optionality
- Changed "progress" to neutral "patterns"
- Supportive rather than admonishing tone

*Standards Mapping:*
- COGA Objective 1: Clear, simple, non-obligatory language
- COGA Objective 4: Provide help without pressure
- ISO 9241-110 (Controllability): User controls pace and choice
- ISO/IEC 30071-1: Supports emotional safety in content

---

**Example 5: System Error Message (General Web)**

*Original:*
```
Fatal error! Contact administrator immediately!
```

*Recommended Rewrite:*
```
System error (Error code: 500)

We've been notified and will investigate. Please try again in 5 minutes. If the problem continues, contact support@example.com or call 555-0123.
```

*Rationale:*
- Removed alarming "Fatal" classification
- Added error code for reference (supports debugging)
- Provided timeframe for retry (reduces uncertainty)
- Included multiple contact options
- Neutral, professional tone

*Standards Mapping:*
- WCAG 3.3.1 (Error Identification): Error clearly identified
- WCAG 3.3.3 (Error Suggestion): Recovery steps provided
- ISO 9241-110 (Error tolerance): User can recover
- COGA Objective 2: Easy to understand and correct

---

**Example 6: Password Reset - Health Portal (Sensitive Context)**

*Original:*
```
Forgot password? Reset it here.
```

*Recommended Rewrite:*
```
Reset password

We'll email you a secure link to create a new password.
```

*Rationale:*
- Self-descriptive: describes what happens
- Reduced anxiety by explaining process
- "Secure link" builds trust (important for health context)
- No question-mark uncertainty
- Clear expectation setting

*Standards Mapping:*
- WCAG 3.3.8 (Accessible Authentication): Clear authentication process
- WCAG 3.3.3 (Error Suggestion): Process explained
- COGA Objective 3: Reduces memory reliance
- ISO 9241-110 (Self-descriptiveness): Clear what happens

---

**Example 7: Onboarding Step - Wellness Platform (Sensitive Context)**

*Original:*
```
Complete your profile now to unlock all features!
```

*Recommended Rewrite:*
```
Step 2 of 4: Add profile details

This step is optional. You can skip and return later, or complete it now to personalize your experience.
```

*Rationale:*
- Shows progress (reduces uncertainty)
- Emphasized optionality ("This step is optional")
- Offered skip option (controllability)
- No urgency or obligation language
- "Personalize" is positive without pressure

*Standards Mapping:*
- WCAG 3.2.6 (Consistent Help): Help is accessible and consistent
- COGA Objective 4: Provide help without pressure
- ISO 9241-110 (Controllability): User controls pace
- ISO 9241-110 (Conformity with expectations): Clear what to expect

---

**Example 8: Loading State (General Web)**

*Original:*
```
Please wait...
```

*Recommended Rewrite:*
```
Loading your content

This usually takes 3-5 seconds.
```

*Rationale:*
- Added expectation setting (duration)
- Self-descriptive ("Loading your content" vs. generic)
- Reduced uncertainty
- Specific timeframe reduces anxiety
- Professional, calm tone

*Standards Mapping:*
- COGA Objective 1: Clear and simple language
- ISO 9241-110 (Conformity with expectations): User knows what to expect
- ISO 9241-110 (Self-descriptiveness): Clear what's happening
- WCAG 2.2.6 (Timeouts): Duration information provided

---

**Example 9: Application Status - Job Platform (Sensitive Context)**

*Original:*
```
Application rejected. Better luck next time!
```

*Recommended Rewrite:*
```
Application status: Not selected

We encourage you to apply for other open positions that match your skills. You can save this search to be notified of new opportunities.
```

*Rationale:*
- Removed dismissive "rejected" framing
- Eliminated "better luck" (implies chance rather than merit)
- Provided constructive next steps
- Offered action to maintain engagement
- Neutral, professional tone

*Standards Mapping:*
- WCAG 3.3.3 (Error Suggestion): Next steps provided
- ISO 9241-110 (Error tolerance): User can recover and proceed
- COGA Objective 2: Easy to understand what happened
- ISO/IEC 30071-1: Dignified, non-discriminatory language

---

**Example 10: Form Help Text - Insurance Portal (Sensitive Context)**

*Original:*
```
Policy number (required)

If you don't know your policy number, call us at 555-0123.
```

*Recommended Rewrite:*
```
Policy number (required)

Find this on your insurance card, top right corner. It's a 9-digit number starting with "POL".
```

*Rationale:*
- Provided specific location information (reduces memory load)
- Included identifying characteristics (9-digit, prefix)
- User can self-service without calling
- Reduced cognitive burden
- Clear, instructional tone

*Standards Mapping:*
- WCAG 3.2.6 (Consistent Help): Help is clear and accessible
- WCAG 3.3.7 (Redundant Entry): Information location provided
- COGA Objective 3: Reduces memory reliance
- ISO 9241-110 (Suitability for task): Helps task completion

---

**Example 11: Session Timeout Warning (General Web)**

*Original:*
```
WARNING: Your session will expire in 60 seconds! Save now or lose all your changes!
```

*Recommended Rewrite:*
```
Your session will expire in 5 minutes due to inactivity.

Save your work to continue where you left off.
```

*Rationale:*
- Extended warning time (5 min vs. 60 sec)
- Removed alarming all-caps and exclamation
- Eliminated threat ("lose all your changes")
- Clear, single action required
- Calm, informative tone

*Standards Mapping:*
- WCAG 2.2.6 (Timeouts): Warning of duration provided
- ISO 9241-110 (Controllability): User has time to act
- COGA Objective 4: Provides help without pressure
- ISO 9241-110 (Error tolerance): Prevents data loss

---

**Example 12: Appointment Confirmation - Therapy Platform (Sensitive Context)**

*Original:*
```
Congratulations! You did it! Your appointment is confirmed!
```

*Recommended Rewrite:*
```
Appointment confirmed

Date: February 28, 2026
Time: 2:00 PM (30 minutes)
Provider: Dr. Smith

You'll receive a reminder email 24 hours before your appointment.
```

*Rationale:*
- Removed excessive enthusiasm
- Provided organized, scannable details
- Included useful next-step information
- Calm, professional confirmation
- Reduces anxiety about forgetting

*Standards Mapping:*
- COGA Objective 1: Clear, organized information
- ISO 9241-110 (Self-descriptiveness): Clear what happened
- ISO/IEC 30071-1: Accessibility includes clear communication
- WCAG 3.3.3 (Error Suggestion): Reminder included for future action

---

**Example 13: Filter and Sort Options - E-commerce Search (General Web)**

*Original:*
```
Sort: Low to High | High to Low | Relevance
```
(No indication of the currently active selection)

*Recommended Rewrite:*
```
Sort results by

• Price: Low to High  (currently selected ✓)
• Price: High to Low
• Relevance
• Customer rating
```

*Rationale:*
- Shows current selection explicitly (eliminates memory load)
- Self-descriptive labels ("Price: Low to High" vs. bare "Low to High")
- Vertical list is more scannable than horizontal tab row
- Neutral presentation with no urgency or pressure

*Standards Mapping:*
- WCAG 2.4.6 (Headings and Labels): Labels describe purpose
- WCAG 3.2.4 (Consistent Identification): Consistent labelling across pages
- W3C COGA Objective 1: Clear labels reduce cognitive demand
- ISO 9241-110 (Self-descriptiveness): Current state visible without recall

---

**Example 14: Destructive Action Confirmation - Account Management (Sensitive Context)**

*Original:*
```
Delete your account?

[OK]   [Cancel]
```

*Recommended Rewrite:*
```
Confirm account deletion

Deleting your account will permanently remove:
  • Your profile and all personal settings
  • 14 saved items
  • 3 active subscriptions (billing ends today)

This action cannot be undone.

[Keep my account]   [Permanently delete account]
```

*Rationale:*
- Specific preview of consequences enables genuinely informed consent
- Action-specific button labels replace ambiguous "OK" / "Cancel"
- Plain statement of irreversibility removes false hope without alarm
- "Keep my account" is visually and semantically the primary action
- Neutral, factual tone — no threat language, no guilt-inducing phrasing

*Standards Mapping:*
- WCAG 3.3.4 (Error Prevention): User can review before committing
- WCAG 2.4.6 (Headings and Labels): Buttons describe specific outcomes
- W3C COGA Objective 2: Help users avoid irreversible mistakes
- ISO 9241-110 (Error tolerance): User can reconsider before committing
- ISO/IEC 30071-1: Dignified language; no coercive phrasing

---

**Example 15: Search Empty State - Job Board Platform (Sensitive Context)**

*Original:*
```
0 results found.
```

*Recommended Rewrite:*
```
No jobs match "senior designer remote"

Suggestions:
  • Try broader keywords, such as "designer" or "UX"
  • Remove the location filter to see all opportunities
  • Save this search — we'll notify you when matching roles are posted

[Browse all open positions]
```

*Rationale:*
- Echoes the user's search query (confirms the system received it correctly)
- Provides three specific, actionable next steps rather than a dead end
- Save-search option maintains engagement without pressure
- "Browse all" CTA is self-descriptive and recovers the task
- No blame language; neutral factual framing

*Standards Mapping:*
- WCAG 3.3.3 (Error Suggestion): Recovery options provided
- W3C COGA Objective 2: Easy to understand what happened
- W3C COGA Objective 3: Help users find what they need
- ISO 9241-110 (Error tolerance): Task can continue despite null result
- ISO 9241-110 (Suitability for task): Interface supports alternative paths

---

### A.3 Localization Guidance for Depression-Sensitive Content

When adapting depression-sensitive content across languages and cultures, observe the following principles to maintain emotional safety and cognitive accessibility.

#### A.3.1 Language Independence Principles

**Avoid Idioms and Cultural References:**
Idioms frequently contain emotional or judgmental implications that may not translate across cultures. Depression and shame have different cultural connotations; language that feels neutral in one language may carry stigma in another.

*Example:*
- Avoid: "Don't give up!" (implies weakness/failure)
- Use: "You can continue when ready" (neutral, supportive)

**Use Literal Instruction:**
Metaphorical language requires additional cognitive processing to decode, increasing cognitive load.

*Example:*
- Avoid: "The ball is in your court" (unclear action)
- Use: "Your next step is to..." (clear instruction)

**Maintain Formal, Professional Tone:**
Informal registers may feel dismissive or inappropriate in sensitive contexts. Maintain consistent formality across languages.

#### A.3.2 Cross-Cultural Considerations

**Avoid Positive Psychology Overload:**
Languages vary in how they express encouragement. Avoid excessive positivity, which may feel dismissive or ironic to users experiencing depression.

**Honor Privacy and Autonomy:**
Some cultures value collective decision-making; others prioritize individual autonomy. Interface language around "personal" information, "sharing," and "optional" features should be evaluated by native speakers.

**Test with Native Speakers:**
Machine translation may preserve problematic patterns. Have native speakers review for:
- Tone appropriateness
- Unintended shame or blame
- Cultural sensitivity
- Cognitive accessibility

#### A.3.3 Right-to-Left (RTL) Considerations

For RTL languages (Arabic, Hebrew, Persian):

- Ensure scanability patterns work in RTL reading direction
- Test error message placement (left-aligned vs. right-aligned)
- Verify icon directionality
- Maintain consistent visual hierarchy

---

## Section B: Standards Traceability Matrix

This section maps each DS-WCS recommendation category to specific criteria from WCAG 2.2, W3C COGA Supplemental Guidance, ISO 9241-110:2006, and ISO/IEC 30071-1:2019. Full criterion citations are provided for authoritative reference.

### B.1 Mapping Table

| DS-WCS Category | WCAG 2.2 Success Criteria | W3C COGA Objectives | ISO 9241-110:2006 Principles | ISO/IEC 30071-1:2019 Clauses |
|----------------|---------------------------|---------------------|----------------------------|----------------------------|
| **Remove Shame/Blame Language** | **3.3.1 Error Identification (A):** "If an input error is automatically detected and the user is identified, then the error is described to the user in text."<br>**3.3.2 Labels or Instructions (A):** "Labels or instructions are provided when content requires user input." | **Objective 2: Help users avoid mistakes:** "Make it easy to understand what is wrong and how to correct mistakes. Make it easy to undo mistakes."<br>**Pattern 2.1:** "Use clear labels and instructions." | **5.4 Conformity with user expectations:** "The dialogue conforms with user expectations by being consistent and conforming to generally accepted conventions."<br>**5.7 Error tolerance:** "The dialogue is error-tolerant if, despite evident errors in input, the intended result may be achieved with no or minimal recovery effort." | **Clause 8.2:** "Accessibility policy shall address inclusive language and non-discriminatory content in all user-facing communications."<br>**Clause 9.1:** "Content shall be designed to avoid causing emotional distress." |
| **Reduce Urgency Pressure** | **2.2.6 Timeouts (AAA):** "Users are warned of the duration of any user inactivity that could cause data loss, unless the data is preserved for more than 20 hours."<br>**3.2.5 Change on Request (AA):** "Changes to the value of any user interface component does not automatically cause a change of context unless the user has been advised of the behavior before using the component." | **Objective 4: Provide help and support:** "Make it easy to get help and have extra time if needed."<br>**Pattern 4.6:** "Avoid barriers that may cause users to make mistakes or abandon tasks." | **5.5 Controllability:** "The dialogue is controllable when the user is able to initiate and control the direction and pace of interaction to the extent needed." | **Clause 7.3:** "Design processes shall consider diverse user needs including cognitive differences that may affect task completion."<br>**Clause 8.4:** "Accessibility statements shall document time-allocation and pacing considerations." |
| **Self-Descriptive CTAs** | **2.4.6 Headings and Labels (AA):** "Headings and labels describe topic or purpose."<br>**2.4.9 Link Purpose (Link Only) (AAA):** "A mechanism is available to allow the purpose of each link to be identified from link text alone." | **Objective 1: Help users understand what things are and how to use them:** "Use clear and simple language and provide consistent navigation."<br>**Pattern 1.3:** "Use clear and simple language." | **5.2 Self-descriptiveness:** "The dialogue is self-descriptive when each dialogue step is immediately comprehensible through feedback from the system or is annotated by the user." | **Clause 8.3:** "Content design standards shall prioritize comprehension for diverse cognitive abilities."<br>**Clause 8.4:** "Accessibility statements shall document clarity measures for interactive elements." |
| **Error Recovery Templates** | **3.3.3 Error Suggestion (AA):** "If an input error is automatically detected and suggestions for correction are known, then the suggestions are provided to the user, unless it would jeopardize the security or purpose of the content."<br>**3.3.4 Error Prevention (AA):** "For pages that cause legal commitments or financial transactions for the user to occur, that result in the user's data being deleted or modified, the user can reverse, correct, or confirm the action." | **Objective 2: Help users avoid mistakes:** "Make it easy to understand what is wrong and how to correct mistakes."<br>**Pattern 2.5:** "Make it easy to undo mistakes." | **5.7 Error tolerance:** "The dialogue is error-tolerant if, despite evident errors in input, the intended result may be achieved with no or minimal recovery effort by the user." | **Clause 8.5:** "Document error handling and recovery procedures in accessibility logs."<br>**Clause 9.1:** "Content shall provide clear paths to recovery from error states." |
| **Reduce Memory Reliance** | **3.3.7 Redundant Entry (A):** "Information previously entered by or provided to the user is either auto-populated or available for selection, except when re-entering information is essential, the information is required by the security settings, or the previously entered information is no longer valid."<br>**3.2.6 Consistent Help (AA):** "If a web page contains any interactive help and there is more than one web page with consistent help, the help is accessible in a consistent way." | **Objective 3: Help users find what they need:** "Make it easy to find what they need, including making it easy to navigate and providing cues to help users find what they need."<br>**Pattern 3.4:** "Avoid overwhelming the user with lots of information." | **5.3 Suitability for the task:** "The dialogue is suitable for the task when it facilitates the effective and efficient completion of the task by the user, and when it is appropriate to the user's level of experience and knowledge." | **Clause 7.2:** "Design shall minimize memory requirements for task completion."<br>**Clause 8.3:** "Content design shall present information to reduce recall demands." |
| **Scannable Plain Language** | **3.1.5 Reading Level (AAA):** "When text requires reading ability more advanced than the lower secondary education level, supplemental content is available at a lower reading level."<br>**3.1.4 Unusual Words (AAA):** "A mechanism is available for identifying specific definitions of words or phrases used in an unusual or restricted way, including idioms and jargon." | **Objective 1: Help users understand what things are and how to use them:** "Use clear and simple language."<br>**Pattern 1.1:** "Keep content simple and clear."<br>**Pattern 3.3:** "Break information into smaller manageable chunks with clear titles." | **5.3 Suitability for the task:** "Information presentation shall be appropriate to the task and shall not include irrelevant or unnecessary information."<br>**5.2 Self-descriptiveness:** "Instructions and labels shall be self-explanatory." | **Clause 8.3:** "Content design standards shall prioritize comprehension for diverse cognitive abilities, including varying literacy levels."<br>**Clause 9.1:** "Content shall be accessible to users with varying cognitive capacities." |
| **Calm UI Microcopy** | **2.4.11 Focus Not Obscured (Minimum) (AA):** "When a user interface component receives keyboard focus, the component is not entirely hidden by author-created content." (Visual calm supports focus)<br>**2.4.12 Focus Not Obscured (Enhanced) (AAA):** "When a user interface component receives keyboard focus, the component is not hidden by author-created content." | **Objective 4: Provide help and support:** "Provide a calm, supportive interface without pressure tactics."<br>**Pattern 4.1:** "Provide human help."<br>**Pattern 4.2:** "Give users enough time." | **5.4 Conformity with user expectations:** "The dialogue conforms with user expectations by being consistent and conforming to generally accepted conventions."<br>**5.5 Controllability:** "The dialogue supports user control of pace and direction." | **Clause 8.2:** "Accessibility policy shall address emotional safety in interface language."<br>**Clause 9.1:** "Content shall be designed to avoid causing emotional distress and shall maintain a professional, supportive tone." |
| **Consistent Help Access** | **3.2.6 Consistent Help (AA):** "If a web page contains any interactive help and there is more than one web page with consistent help, the help is accessible in a consistent way across all those pages." | **Objective 4: Provide help and support:** "Make it easy to get help and have extra time if needed."<br>**Pattern 4.1:** "Provide human help." | **5.2 Self-descriptiveness:** "Help is available when needed and is accessible in a consistent manner." | **Clause 8.4:** "Accessibility statements shall document help and support access mechanisms." |
| **Accessible Authentication** | **3.3.8 Accessible Authentication (Minimum) (A):** "A cognitive function test (such as remembering a password or turning a picture into a picture) is not required for any step in an authentication process unless that step provides at least one of [three exceptions]."<br>**3.3.9 Accessible Authentication (Enhanced) (AAA):** "A cognitive function test is not required for any step in an authentication process." | **Objective 3: Help users find what they need:** "Make it easy to find what they need."<br>**Objective 4:** "Provide help and support." | **5.5 Controllability:** "The dialogue supports user control of the authentication process."<br>**5.7 Error tolerance:** "The dialogue supports recovery from authentication errors." | **Clause 7.2:** "Design shall minimize cognitive load during authentication."<br>**Clause 8.5:** "Authentication processes shall be documented in accessibility statements." |

### B.2 Additional WCAG 2.2 Criteria Relevant to DS-WCS

The following WCAG 2.2 success criteria, while not directly mapped to DS-WCS principles above, support depression-sensitive content design and should be considered in comprehensive audits:

| Criterion | Level | Relevance to DS-WCS |
|-----------|-------|---------------------|
| 2.4.7 Focus Visible | AA | Clear focus indicators support users with attention difficulties |
| 2.4.11 Focus Not Obscured (Minimum) | AA | Ensures users can see where they are on the page |
| 2.4.12 Focus Not Obscured (Enhanced) | AAA | Full visibility of focused elements |
| 2.5.5 Target Size (Enhanced) | AAA | Larger targets (44x44px minimum) reduce frustration and errors |
| 3.2.1 On Focus | A | No context changes on focus (prevents disorientation) |
| 3.2.2 On Input | A | No unexpected changes on input (maintains user control) |
| 3.3.5 Help | AAA | Context-sensitive help available |

### B.3 Standards Source References

**WCAG 2.2:**
- Web Content Accessibility Guidelines (WCAG) 2.2, W3C Recommendation
- Published: October 2023
- URL: https://www.w3.org/TR/WCAG22/

**W3C COGA:**
- Cognitive and Learning Disabilities Accessibility Task Force
- COGA Supplement to WCAG 2.1
- Published: 2023
- URL: https://w3c.github.io/coga/content-usable/

**ISO 9241-110:**
- ISO 9241-110:2006 - Ergonomics of human-system interaction - Part 110: Dialogue principles
- International Organization for Standardization
- URL: https://www.iso.org/standard/31975.html

**ISO/IEC 30071-1:**
- ISO/IEC 30071-1:2019 - Information technology - User interface accessibility - Part 1: Accessibility guidance for IT systems and services
- International Organization for Standardization
- URL: https://www.iso.org/standard/70983.html

---

## Section C: Audit Checklist

This checklist provides structured guidance for auditing web content for depression-sensitive patterns. Each item includes a description, severity rating, examples, remediation guidance, and standards references.

### Severity Rubric Definitions

**HIGH Severity:**
- Directly causes user task abandonment or prevents completion
- Induces emotional distress or triggers shame responses
- Violates WCAG Level A success criteria
- May cause users to disengage from critical services (healthcare, financial, government)

**MEDIUM Severity:**
- Increases cognitive load beyond optimal levels
- Creates emotional friction that may lead to eventual abandonment
- Violates WCAG Level AA success criteria or ISO 9241-110 principles
- Reduces user confidence without preventing task completion

**LOW Severity:**
- Reduces user comfort or satisfaction
- Missed opportunity for improved accessibility
- Does not violate standards but could be enhanced
- May affect user perception without functional impact

---

### C.1 Error Messages

#### C.1.1 Blame Language in Errors

**Check:** Error messages attribute failure to user character, ability, or behavior in a shaming manner.

**Severity:** HIGH

**Examples:**
- "You entered invalid data"
- "You broke something"
- "Your input is wrong"
- "You should have read the instructions"
- "You're too stupid to use this system"

**Remediation:**
Use system-focused language that attributes issues to format, system conditions, or input requirements rather than user characteristics.

**Standards References:**
- WCAG 3.3.1 (Error Identification)
- WCAG 3.3.2 (Labels or Instructions)
- ISO 9241-110 (Error tolerance, Conformity with expectations)
- COGA Objective 2

---

#### C.1.2 Missing Recovery Path

**Check:** Error messages lack actionable guidance on how to resolve the error.

**Severity:** HIGH

**Examples:**
- "Error occurred"
- "Invalid"
- "Failed"
- "Wrong password"
- "Account not found"

**Remediation:**
Every error message shall include specific guidance on what the user should do next. Provide examples, links, or contact information as appropriate.

**Standards References:**
- WCAG 3.3.3 (Error Suggestion)
- ISO 9241-110 (Error tolerance, Self-descriptiveness)
- COGA Objective 2

---

#### C.1.3 Technical Jargon Without Explanation

**Check:** Error messages use technical terminology without explanation accessible to non-technical users.

**Severity:** MEDIUM

**Examples:**
- "HTTP 500 Internal Server Error"
- "NullPointerException"
- "SSL handshake failed"
- "Error code: 0x80070005"
- "Database connection timeout"

**Remediation:**
Translate technical errors into plain language. Provide error codes for reference but lead with user-comprehensible explanations.

**Standards References:**
- WCAG 3.3.1 (Error Identification)
- COGA Objective 1 (Clear language)
- ISO 9241-110 (Self-descriptiveness)

---

#### C.1.4 Exclamation Points in Error States

**Check:** Error messages use exclamation points, which increase emotional arousal.

**Severity:** LOW

**Examples:**
- "Invalid email!"
- "Password required!"
- "Please correct errors!"
- "Action failed!"
- "Warning!"

**Remediation:**
Use periods instead of exclamation points in error states. Neutral punctuation supports calm processing.

**Standards References:**
- COGA Objective 4 (Calm interface)
- ISO/IEC 30071-1 (Emotional safety)

---

### C.2 Call-to-Action (CTA) Buttons

#### C.2.1 Non-Descriptive Button Labels

**Check:** Button text uses generic commands rather than describing the outcome.

**Severity:** MEDIUM

**Examples:**
- "Submit"
- "Click here"
- "Go"
- "Start"
- "Next"
- "Continue"

**Remediation:**
Replace generic commands with outcome descriptions that answer: "What happens when I click this?"

**Standards References:**
- WCAG 2.4.6 (Headings and Labels)
- WCAG 2.4.9 (Link Purpose)
- ISO 9241-110 (Self-descriptiveness)
- COGA Objective 1

---

#### C.2.2 Urgency Language in CTAs

**Check:** Call-to-action buttons use urgency-inducing language.

**Severity:** MEDIUM

**Examples:**
- "Sign up now!"
- "Buy today!"
- "Limited time offer!"
- "Don't miss out!"
- "Act fast!"

**Remediation:**
Remove urgency language. Use neutral time indicators or omit time references entirely.

**Standards References:**
- WCAG 3.2.5 (Change on Request)
- ISO 9241-110 (Controllability)
- COGA Objective 4

---

#### C.2.3 Ambiguous Button Groupings

**Check:** Multiple buttons are presented without clear visual differentiation.

**Severity:** LOW

**Examples:**
- Two similar-looking buttons with different actions
- Primary and secondary actions with equal visual weight
- "Cancel" button styled identically to "Submit"

**Remediation:**
Use visual hierarchy to distinguish primary (intended) actions from secondary actions. Consistent button positioning helps users predict outcomes.

**Standards References:**
- WCAG 2.4.6 (Labels)
- ISO 9241-110 (Conformity with expectations)
- COGA Objective 1

---

### C.3 Forms and Input Fields

#### C.3.1 Memory-Dependent Instructions

**Check:** Form instructions require users to recall information from external sources or previous interactions.

**Severity:** HIGH (critical fields), MEDIUM (optional fields)

**Examples:**
- "Enter your policy number (call if you don't know it)"
- "Input your customer ID from your welcome email"
- "Remember your username from registration"

**Remediation:**
Provide information location guidance: "Policy number (found on your insurance card, top right)" rather than requiring memory or external contact.

**Standards References:**
- WCAG 3.3.7 (Redundant Entry)
- WCAG 3.2.6 (Consistent Help)
- COGA Objective 3 (Memory)
- ISO 9241-110 (Suitability for task)

---

#### C.3.2 Required Field Indicators Without Explanation

**Check:** Required fields are marked without clear explanation of what "required" means.

**Severity:** MEDIUM

**Examples:**
- Asterisk without legend: "*"
- "(Required)" without explanation of what happens if not completed
- Red asterisks without accessible labeling

**Remediation:**
Include clear instructions: "Required fields are marked with * and must be completed to proceed."

**Standards References:**
- WCAG 3.3.2 (Labels or Instructions)
- WCAG 1.3.1 (Info and Relationships)
- COGA Objective 1

---

#### C.3.3 Multi-Step Form Without Progress Indicator

**Check:** Multi-step forms lack indication of current position in the flow.

**Severity:** MEDIUM

**Examples:**
- "Step 1" with no total count
- Forms that transition without notification
- Long forms with no section breaks

**Remediation:**
Show progress: "Step 2 of 4: Contact Information" helps users gauge time commitment and maintain context.

**Standards References:**
- WCAG 3.2.5 (Change on Request)
- COGA Objective 3 (Find what needed)
- ISO 9241-110 (Conformity with expectations)

---

#### C.3.4 Password Requirements Hidden Until Failure

**Check:** Password strength requirements are only shown after submission with an invalid password.

**Severity:** MEDIUM

**Examples:**
- Password field with no visible requirements
- Requirements shown only on validation error
- Complex requirements without concrete examples

**Remediation:**
Display all password requirements before user input. Use inline validation with specific guidance.

**Standards References:**
- WCAG 3.3.3 (Error Suggestion)
- WCAG 3.3.7 (Redundant Entry)
- COGA Objective 2

---

#### C.3.5 Conditional Field Requirements

**Check:** Form fields appear or disappear based on previous selections without clear explanation.

**Severity:** HIGH

**Examples:**
- Selecting "Yes" reveals required fields without warning
- Hidden validation messages appear after conditional selection
- "Other" text field appears without label change

**Remediation:**
Pre-announce conditional fields: "Answering 'Yes' will show 2 additional required fields. You can skip these if not applicable."

**Standards References:**
- WCAG 3.3.2 (Labels or Instructions)
- WCAG 3.2.2 (On Input)
- COGA Objective 1 (Clear language)
- ISO 9241-110 (Self-descriptiveness)

---

#### C.3.6 Field Grouping and Visual Organization

**Check:** Related fields lack visual grouping or clear boundaries, overwhelming users with too many options.

**Severity:** MEDIUM

**Examples:**
- 20+ form fields in a single long list
- No sections or fieldset groupings
- Related fields scattered without visual cues

**Remediation:**
Group related fields using `<fieldset>` with `<legend>` for section headings. Break long forms into multiple steps.

**Standards References:**
- WCAG 1.3.1 (Info and Relationships)
- COGA Objective 3 (Help users find)
- ISO 9241-110 (Suitability for the task)

---

#### C.3.7 Placeholder Text Instead of Labels

**Check:** Input fields use placeholder text as the only label, which disappears on focus.

**Severity:** HIGH

**Examples:**
- `<input placeholder="Email address">` without visible `<label>`
- Placeholder disappears when user starts typing
- Empty fields without persistent labels

**Remediation:**
Use proper `<label>` elements. Placeholders should provide examples only, not replace labels.

**Standards References:**
- WCAG 3.3.2 (Labels or Instructions)
- WCAG 1.3.1 (Info and Relationships)
- COGA Objective 1 (Clear language)
- ISO 9241-110 (Self-descriptiveness)

---

#### C.3.8 Pre-filled Data Without Explanation

**Check:** Fields are auto-populated without indicating the source or that data was pre-filled.

**Severity:** MEDIUM

**Examples:**
- Address fields pre-filled from previous order with no notice
- Username auto-populated without indication
- Form appears to have data from previous session

**Remediation:**
Add helper text: "Using address from your last order (January 15, 2026). Edit if needed."

**Standards References:**
- WCAG 3.3.7 (Redundant Entry)
- COGA Objective 3 (Help users find)
- ISO 9241-110 (Conformity with expectations)

---

### C.4 Notifications and Alerts

#### C.4.1 Excessive Urgency Markers

**Check:** Notifications use alarming language, exclamation points, or urgency indicators.

**Severity:** MEDIUM

**Examples:**
- "URGENT: Action required!"
- "ACT NOW!"
- "LAST CHANCE!"
- Countdown timers on cognitive tasks
- Red text with "WARNING"

**Remediation:**
Use neutral language: "Session expiring in 5 minutes" rather than "60 seconds remaining!" Remove unnecessary urgency.

**Standards References:**
- WCAG 2.2.6 (Timeouts)
- ISO 9241-110 (Controllability)
- COGA Objective 4

---

#### C.4.2 Dismissive Tone in Negative Notifications

**Check:** Negative notifications (rejections, failures) use dismissive or flippant language.

**Severity:** HIGH

**Examples:**
- "Better luck next time!"
- "Oops, wrong again!"
- "Whoops!"
- "Too bad, so sad"
- "Maybe next time!"

**Remediation:**
Use neutral, informative language: "Application not selected" rather than dismissive encouragement.

**Standards References:**
- ISO/IEC 30071-1 (Dignified language)
- COGA Objective 1 (Neutral tone)
- ISO 9241-110 (Conformity with expectations)

---

#### C.4.3 Alert Fatigue

**Check:** Non-critical information presented with error alert styling.

**Severity:** LOW

**Examples:**
- Informational messages in error styling
- Warnings for optional actions
- Multiple simultaneous alerts

**Remediation:**
Use appropriate notification types: informational, success, warning, error. Reserve error styling for actionable issues.

**Standards References:**
- WCAG 3.3.1 (Error Identification)
- COGA Objective 3 (Not overwhelming)

---

#### C.4.4 Stacked or Simultaneous Alerts

**Check:** Multiple alerts appear simultaneously, overwhelming users and preventing comprehension.

**Severity:** HIGH

**Examples:**
- 3+ error messages displayed at once without prioritization
- Alerts that auto-dismiss before users can read them
- Errors and warnings stacked without clear separation

**Remediation:**
Queue alerts sequentially. Prioritize by severity. Ensure each alert is dismissible and remains visible until user acknowledges.

**Standards References:**
- WCAG 2.2.4 (No Timing)
- COGA Objective 3 (Avoid overwhelming)
- ISO 9241-110 (Controllability)

---

#### C.4.5 Unclear Alert Dismissal

**Check:** Alerts lack clear "Close" or "Dismiss" controls, or auto-dismiss without user control.

**Severity:** MEDIUM

**Examples:**
- Alert disappears after 3 seconds without manual dismiss
- Close button with no accessible label
- Toast notifications with no dismiss option

**Remediation:**
Provide clear, accessible close controls. Use `aria-label` for icon-only buttons. Allow users to control dismissal timing.

**Standards References:**
- WCAG 2.1.1 (Keyboard)
- ISO 9241-110 (Controllability)
- COGA Objective 4 (Provide help)

---

### C.5 Empty States

#### C.5.1 Obligation Language

**Check:** Empty states use "should," "must," or "need to" for optional actions.

**Severity:** MEDIUM

**Examples:**
- "You should add a profile picture"
- "You must complete your profile"
- "You need to track your mood daily"
- "Don't forget to..."

**Remediation:**
Use optional framing: "When you [action], [content] will appear here. Optional: [suggestion]"

**Standards References:**
- COGA Objective 1 (Clear, not obligatory)
- COGA Objective 4 (Without pressure)
- ISO 9241-110 (Controllability)

---

#### C.5.2 Shame in Empty States

**Check:** Empty states imply user failure or inadequacy.

**Severity:** HIGH

**Examples:**
- "You haven't done anything yet"
- "Nothing to show"
- "You're behind on your tasks"
- "Start achieving your goals!"

**Remediation:**
Use neutral framing: "When you [create/ add / log], [content] will appear here."

**Standards References:**
- ISO/IEC 30071-1 (Emotional safety)
- COGA Objective 1 (Neutral tone)
- WCAG 3.3.1 (Non-shaming)

---

#### C.5.3 Missing Value Proposition

**Check:** Empty states don't explain why the feature is useful or how to get started.

**Severity:** MEDIUM

**Examples:**
- Blank page with no guidance
- "No results" without search refinement suggestions
- Empty dashboard without feature explanation

**Remediation:**
Provide context: "No activities logged. Track your daily activities to see patterns in your energy levels over time."

**Standards References:**
- WCAG 3.2.6 (Consistent Help)
- COGA Objective 3 (Help users find)
- ISO 9241-110 (Suitability for task)

---

### C.6 Onboarding and Progressive Disclosure

#### C.6.1 Required Without Explanation

**Check:** Onboarding steps marked as required without explaining why or consequences.

**Severity:** MEDIUM

**Examples:**
- "Complete step 1 to unlock features"
- "Required fields must be completed now"
- "You must provide this to continue"

**Remediation:**
Explain purpose: "Adding your preferences helps us personalize recommendations. This step is optional but recommended."

**Standards References:**
- COGA Objective 4 (Help without pressure)
- ISO 9241-110 (Controllability)
- WCAG 3.3.2 (Instructions)

---

#### C.6.2 Premature Information Disclosure

**Check:** Onboarding requests extensive information before demonstrating value.

**Severity:** MEDIUM

**Examples:**
- Registration before any feature access
- Profile completion before using product
- Phone number required before account creation

**Remediation:**
Progressive disclosure: Allow initial access with minimal information; request additional details as value is demonstrated.

**Standards References:**
- WCAG 3.2.6 (Consistent Help)
- COGA Objective 4 (Support without pressure)
- ISO 9241-110 (Suitability for task)

---

#### C.6.3 Skipping Without Clear Consequences

**Check:** "Skip" option in onboarding doesn't explain what happens or what users miss by skipping.

**Severity:** MEDIUM

**Examples:**
- "Skip this step" button with no context
- "Skip" that hides features permanently
- No indication of what information is optional vs. required

**Remediation:**
Use descriptive skip options: "Skip for now (you can add this later in Settings)"

**Standards References:**
- WCAG 2.4.6 (Headings and Labels)
- COGA Objective 1 (Clear language)
- ISO 9241-110 (Self-descriptiveness)

---

#### C.6.4 Unclear Progress Through Onboarding

**Check:** Users don't know how many steps remain or where they are in the onboarding process.

**Severity:** MEDIUM

**Examples:**
- Multi-screen onboarding with no progress indicators
- "Next" button with no step count
- Back and forward navigation without context

**Remediation:**
Show progress: "Step 2 of 5: Add profile photo" with a visual progress bar.

**Standards References:**
- WCAG 2.4.8 (Location)
- COGA Objective 3 (Help users find)
- ISO 9241-110 (Conformity with expectations)

---

### C.7 Loading and Wait States

#### C.7.1 Ambiguous Loading Indicators

**Check:** Loading states don't indicate what is happening or expected duration.

**Severity:** LOW

**Examples:**
- "Loading..." with no context
- Spinner with no text
- "Please wait..."

**Remediation:**
Add context: "Loading your dashboard" or "This usually takes 3-5 seconds."

**Standards References:**
- WCAG 2.2.6 (Timeouts)
- COGA Objective 1 (Clear)
- ISO 9241-110 (Self-descriptiveness)

---

#### C.7.2 Unrecoverable Loading Failures

**Check:** Loading failures offer no recovery path or retry mechanism.

**Severity:** HIGH

**Examples:**
- "Error loading" with no retry
- Infinite spinner
- Automatic redirect without explanation

**Remediation:**
Provide retry: "Unable to load. Check your connection and try again, or contact support@example.com."

**Standards References:**
- WCAG 3.3.3 (Error Suggestion)
- ISO 9241-110 (Error tolerance)
- COGA Objective 2

---

### C.8 Success and Confirmation Messages

#### C.8.1 Excessive Enthusiasm

**Check:** Success messages use excessive enthusiasm that may feel dismissive or ironic.

**Severity:** LOW

**Examples:**
- "Congratulations!"
- "Amazing!"
- "You're awesome!"
- "You did it!"
- "Woohoo!"

**Remediation:**
Use informative confirmation: "Account created successfully. You'll receive a confirmation email shortly."

**Standards References:**
- COGA Objective 1 (Neutral tone)
- ISO/IEC 30071-1 (Professional tone)

---

#### C.8.2 Missing Next Steps

**Check:** Success messages don't provide guidance on what to do next.

**Severity:** MEDIUM

**Examples:**
- "Success!"
- "Done"
- "Completed"
- Green checkmark with no text

**Remediation:**
Provide next steps: "Changes saved. Return to your dashboard or continue editing."

**Standards References:**
- WCAG 3.3.3 (Next steps)
- COGA Objective 3 (Help find)
- ISO 9241-110 (Self-descriptiveness)

---

### C.9 Help Text and Tooltips

#### C.9.1 Hidden Help

**Check:** Help is only accessible through obscure mechanisms (small icons, hidden links).

**Severity:** MEDIUM

**Examples:**
- Question mark icons without labels
- Help behind multiple clicks
- Tooltips that disappear too quickly to read

**Remediation:**
Make help visible and persistent. Use clear labels: "Help with this form" rather than "?".

**Standards References:**
- WCAG 3.2.6 (Consistent Help)
- WCAG 1.3.1 (Info and Relationships)
- COGA Objective 4

---

#### C.9.2 Inconsistent Help Placement

**Check:** Help resources are positioned inconsistently across forms or pages.

**Severity:** LOW

**Examples:**
- Some fields have help text, others don't
- Help icons in different positions
- Inconsistent help content formats

**Remediation:**
Maintain consistent help placement and format across all forms.

**Standards References:**
- WCAG 3.2.6 (Consistent Help)
- ISO 9241-110 (Conformity with expectations)

---

### C.10 Navigation and Wayfinding

#### C.10.1 Disorienting Context Changes

**Check:** Navigation causes unexpected context changes (new windows, automatic redirects).

**Severity:** HIGH

**Examples:**
- Links that open new tabs without warning
- Automatic redirects without user consent
- Navigation that clears form data without warning

**Remediation:**
Warn of context changes: "Opening in new tab" or "Note: Leaving this page will clear your form."

**Standards References:**
- WCAG 3.2.1 (On Focus)
- WCAG 3.2.2 (On Input)
- WCAG 3.2.5 (Change on Request)
- ISO 9241-110 (Controllability)

---

#### C.10.2 Inconsistent Navigation Labels

**Check:** Navigation uses different terms for the same destination across pages.

**Severity:** LOW

**Examples:**
- "Home" on one page, "Dashboard" on another
- "Settings" vs. "Preferences"
- "Profile" vs. "Account"

**Remediation:**
Maintain consistent navigation labels across the entire application.

**Standards References:**
- WCAG 3.2.6 (Consistent Help)
- COGA Objective 1 (Consistent navigation)
- ISO 9241-110 (Conformity with expectations)

---

### C.11 Confirmation Dialogs

#### C.11.1 Ambiguous Confirmation Buttons

**Check:** Confirmation dialogs use generic "OK/Cancel" or "Yes/No" without clear context.

**Severity:** HIGH

**Examples:**
- Dialog: "Delete account?" Buttons: "Yes" | "No"
- "Proceed?" with generic confirmation
- Action buttons not labeled with specific outcomes

**Remediation:**
Use action-specific labels: "Delete account" | "Keep account"

**Standards References:**
- WCAG 2.4.6 (Headings and Labels)
- ISO 9241-110 (Self-descriptiveness)
- COGA Objective 2 (Help users avoid mistakes)

---

#### C.11.2 Destructive Actions Without Preview

**Check:** Irreversible actions lack preview or clear explanation of consequences.

**Severity:** HIGH

**Examples:**
- "Delete all data" without showing what will be deleted
- "Cancel subscription" without showing effective date
- "Remove" without confirming what is being removed

**Remediation:**
Show preview: "This will permanently delete: 127 files, 3 projects, 8 collaborators"

**Standards References:**
- WCAG 3.3.4 (Error Prevention)
- ISO 9241-110 (Error tolerance)
- COGA Objective 2 (Help avoid mistakes)

---

#### C.11.3 Double-Negative Confirmations

**Check:** Confirmation uses confusing double-negative phrasing.

**Severity:** MEDIUM

**Examples:**
- "Don't you want to not cancel?"
- "Disable auto-save?" with "Don't disable" button
- "Keep current settings?" with "Don't keep" as the alternative

**Remediation:**
Use positive framing: "Turn off auto-save" | "Keep auto-save enabled"

**Standards References:**
- COGA Objective 1 (Clear language)
- ISO 9241-110 (Conformity with expectations)

---

### C.12 Data Tables and Lists

#### C.12.1 Sortable Columns Without Indication

**Check:** Table columns can be sorted but lack visual indication of sortability or current state.

**Severity:** MEDIUM

**Examples:**
- Clickable headers with no sort indicator
- No visual distinction between ascending/descending
- Sort icon without accessible label

**Remediation:**
Add sort icons and accessible labels: aria-label="Sort by date (currently ascending)"

**Standards References:**
- WCAG 2.4.6 (Headings and Labels)
- COGA Objective 1 (Clear labels)
- ISO 9241-110 (Self-descriptiveness)

---

#### C.12.2 Dense Tables Without Scanability

**Check:** Tables with many columns lack visual aids to help users track rows.

**Severity:** MEDIUM

**Examples:**
- Dense financial data tables without borders
- Wide tables without alternating row colors
- No hover highlighting to track current row

**Remediation:**
Use alternating row colors, hover highlighting, and clear borders for column separation.

**Standards References:**
- WCAG 1.4.1 (Use of Color)
- COGA Objective 3 (Help users find)
- ISO 9241-110 (Suitability for task)

---

#### C.12.3 Missing Empty State for Filtered Results

**Check:** Empty search or filter results show blank table without explanation or next steps.

**Severity:** MEDIUM

**Examples:**
- Search returns 0 results with empty table
- Filters result in 0 matches with no guidance
- "No data" without suggestions

**Remediation:**
Provide guidance: "No results for 'query'. Try different keywords or clear filters."

**Standards References:**
- WCAG 3.3.3 (Error Suggestion)
- COGA Objective 3 (Help users find)
- ISO 9241-110 (Error tolerance)

---

### C.13 Mobile-Specific Patterns

#### C.13.1 Small Touch Targets

**Check:** Interactive elements smaller than 44×44px on mobile interfaces.

**Severity:** HIGH (mobile), MEDIUM (desktop)

**Examples:**
- Tiny close buttons (< 20px)
- Small checkbox or radio inputs without padding
- Compact icon buttons without adequate spacing

**Remediation:**
Ensure minimum 44×44px touch targets per WCAG 2.5.5 guidelines.

**Standards References:**
- WCAG 2.5.5 (Target Size)
- ISO 9241-110 (Suitability for task)

---

#### C.13.2 Horizontal Scrolling on Mobile

**Check:** Content requires horizontal scrolling or pinch-zoom to access.

**Severity:** HIGH

**Examples:**
- Wide forms that scroll horizontally
- Non-responsive tables on mobile
- Fixed-width containers that exceed viewport

**Remediation:**
Use responsive design with content reflow. Use accordions or cards for table data.

**Standards References:**
- WCAG 1.4.10 (Reflow)
- COGA Objective 3 (Help users find)
- ISO 9241-110 (Suitability for task)

---

## Appendix: Quick Reference Cards

### Error Message Quick Fix

| Problem | Avoid | Use Instead |
|---------|-------|-------------|
| Blame | "You entered wrong data" | "Email format not recognized" |
| No recovery | "Invalid" | "Email format not recognized. Example: name@domain.com" |
| Urgency | "Invalid!" | "Not recognized" |
| Jargon | "HTTP 500 Error" | "System error. Try again in 5 minutes." |

### CTA Quick Fix

| Problem | Avoid | Use Instead |
|---------|-------|-------------|
| Generic | "Submit" | "Create account" |
| Non-descriptive | "Click here" | "View pricing" |
| Urgency | "Sign up now!" | "Create account (2 minutes)" |

### Empty State Quick Fix

| Problem | Avoid | Use Instead |
|---------|-------|-------------|
| Obligation | "You should track daily" | "When you log activities, they'll appear here" |
| Shame | "You haven't done anything" | "When you [action], content appears here" |
| Missing value | "No results" | "No results for [query]. Try different keywords or browse categories." |

---

*Document Version: 1.0.0*
*Last Updated: February 2026*
*This is a UX and content accessibility resource, NOT a clinical tool. For mental health concerns, consult qualified healthcare professionals.*
