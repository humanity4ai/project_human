# Dev.to Article Drafts — DS-WCS Skill

Three articles ready for direct posting to Dev.to. Each is written in Dev.to markdown format. Tags are listed at the top of each article — enter them in the Dev.to tag field, not in the body.

---

## Article 1 — Technical walkthrough

**Title:** How to audit your UI content for cognitive accessibility in 20 minutes

**Tags:** `accessibility` `ux` `opencode` `webdev`

**Cover image suggestion:** A side-by-side before/after of an error message — plain text screenshot is sufficient.

---

Most accessibility audits focus on colour contrast, keyboard navigation, and screen reader compatibility.

They miss the words.

This article walks through a 20-minute cognitive accessibility audit of a fictional checkout flow using the DS-WCS open-source skill for OpenCode. By the end you will have a working audit setup, a prioritised list of findings, and concrete rewrites to implement.

---

### What is cognitive accessibility?

Cognitive accessibility addresses how well an interface works for users with conditions affecting executive function — depression, anxiety, ADHD, acquired brain injury, and others.

Depression affects 280 million people globally (WHO, 2023). It impairs:

- **Working memory** — holding information across steps
- **Executive function** — planning, decision-making, task sequencing
- **Processing speed** — absorbing and acting on information
- **Emotional regulation** — sensitivity to shame, urgency, and negative feedback

Interfaces that ignore these differences do not just create friction. They create barriers that cause task abandonment — particularly on high-stakes flows like checkout, account creation, and healthcare forms.

---

### The demo component

Here is a fictional checkout error state. It is representative of patterns found on real production interfaces:

```tsx
// CheckoutError.tsx
export function CheckoutError() {
  return (
    <div className="error-container">
      <h2>Oops! Something went wrong!</h2>
      <p>You entered invalid payment details. Please try again immediately — your cart will expire soon!</p>
      <p>Error code: ERR_PAYMENT_422</p>
      <button>OK</button>
    </div>
  );
}
```

Five issues visible before even running the audit:

1. "Oops!" — dismissive opener
2. "Something went wrong!" — vague, no recovery
3. "You entered invalid payment details" — second-person blame
4. "try again immediately" + "cart will expire soon" — urgency pressure stacked twice
5. `ERR_PAYMENT_422` — technical jargon with no plain language equivalent
6. "OK" button — generic label, no outcome description

---

### Install DS-WCS

DS-WCS is an OpenCode skill. Install it project-locally:

```bash
mkdir -p .opencode/skills
git clone https://github.com/simonplmak-cloud/depression-sensitive-web-content.git \
  .opencode/skills/depression-sensitive-web-content
```

Or globally, for use across all projects:

```bash
mkdir -p ~/.config/opencode/skills
git clone https://github.com/simonplmak-cloud/depression-sensitive-web-content.git \
  ~/.config/opencode/skills/depression-sensitive-web-content
```

---

### Run the audit

Open OpenCode in your project directory and ask:

```
Audit src/components/CheckoutError.tsx for depression-sensitive content issues
```

DS-WCS will load the skill, read the file, apply the 40-item audit checklist, and return findings organised by severity with standards citations.

---

### Sample output

```markdown
## Findings

### HIGH Severity

- **CheckoutError.tsx:5** — Second-person blame language
  - Original: "You entered invalid payment details."
  - Standards: WCAG 3.3.1, COGA Objective 2, ISO 9241-110 Clause 5.7

- **CheckoutError.tsx:5** — Stacked urgency pressure
  - Original: "try again immediately — your cart will expire soon!"
  - Standards: WCAG 2.2.6, ISO 9241-110 Clause 5.5, COGA Objective 4

- **CheckoutError.tsx:7** — Generic button label with no outcome description
  - Original: "OK"
  - Standards: WCAG 2.4.6, ISO 9241-110 Clause 5.2

### MEDIUM Severity

- **CheckoutError.tsx:3** — Dismissive opener with exclamation
  - Original: "Oops! Something went wrong!"
  - Standards: ISO/IEC 30071-1 Clause 9.1, COGA Objective 1

- **CheckoutError.tsx:6** — Technical jargon without plain language
  - Original: "Error code: ERR_PAYMENT_422"
  - Standards: WCAG 3.3.1, COGA Objective 1

## Recommended Rewrites

**Before:**
"Oops! Something went wrong! You entered invalid payment details.
Please try again immediately — your cart will expire soon!"

**After:**
"Payment not processed.

Your card details could not be verified. Check the card number, expiry date,
and security code, then try again.

Your cart is saved for 30 minutes.

[Try payment again]  [Use a different card]"

**Rationale:**
- Removed blame attribution and exclamation points
- Replaced stacked urgency with a calm, specific timeframe
- Added two self-descriptive recovery actions
- Replaced "OK" with outcome-specific button labels
- Technical error code moved to secondary position if needed for support

**Standards:**
- WCAG 3.3.1 (Error Identification)
- WCAG 3.3.3 (Error Suggestion)
- WCAG 2.4.6 (Headings and Labels)
- W3C COGA Objective 2: Help users avoid mistakes
- ISO 9241-110: Error tolerance, Self-descriptiveness, Controllability
```

---

### The rewritten component

```tsx
// CheckoutError.tsx — revised
export function CheckoutError({ cartExpiryMinutes = 30 }) {
  return (
    <div className="error-container">
      <h2>Payment not processed</h2>
      <p>
        Your card details could not be verified. Check the card number,
        expiry date, and security code, then try again.
      </p>
      <p>Your cart is saved for {cartExpiryMinutes} minutes.</p>
      <div className="error-actions">
        <button className="primary">Try payment again</button>
        <button className="secondary">Use a different card</button>
      </div>
    </div>
  );
}
```

---

### What the audit covers

DS-WCS checks 40+ items across these content categories:

| Category | Example checks |
|---|---|
| Error messages | Blame language, missing recovery, technical jargon |
| CTAs | Generic labels, urgency language, ambiguous groupings |
| Forms | Memory-dependent instructions, hidden requirements, conditional fields |
| Notifications | Urgency markers, dismissive tone |
| Empty states | Obligation language, shame framing |
| Onboarding | Premature disclosure, missing progress indicators |
| Help text | Inconsistent placement, absence of inline guidance |

---

### Install, run, contribute

- **GitHub:** github.com/simonplmak-cloud/depression-sensitive-web-content
- **Install:** One `git clone` to `.opencode/skills/`
- **License:** MIT — free to use, fork, and extend
- **Contributing:** 15 before/after examples already included; PRs welcome for new content categories

If you audit your own interfaces and find patterns not covered by the checklist, open an issue. The goal is a community-maintained resource that covers every common interface context.

---

## Article 2 — Conceptual explainer

**Title:** Depression-sensitive design: what it is, why it matters, and how to implement it

**Tags:** `accessibility` `ux` `mentalhealth` `inclusivedesign`

**Cover image suggestion:** A calm, minimal interface mockup — or the DS-WCS GitHub README header.

---

There is a category of accessibility that most teams never audit.

It is not about colour contrast ratios or keyboard traps. It does not require assistive technology testing. It does not show up in automated scans.

It is about the emotional and cognitive impact of the words you put on screen.

This is depression-sensitive design.

---

### What depression does to users

Depression is not just sadness. It is a neurological condition that measurably impairs cognitive function, including:

**Working memory** — the ability to hold information in mind across steps. A user with depression may forget what they entered three fields ago. They may lose their place in a multi-step form. They may not be able to recall a policy number they looked up 30 seconds before.

**Executive function** — planning, sequencing, and decision-making. A user with depression may struggle to determine what to do next when faced with a vague error message. They may be unable to generate a recovery path independently.

**Processing speed** — absorbing and acting on information. Time pressure compounds this. A countdown timer on a checkout form is not a neutral design choice for a user whose processing speed is already impaired.

**Emotional regulation** — sensitivity to shame, blame, and negative feedback. A user experiencing depression is more susceptible to the emotional content of interface language. "You entered invalid data" is not a neutral statement. It attributes failure to the user. That attribution, however unintentional, can trigger a shame response that ends the session.

---

### Seven principles

Depression-sensitive design applies seven evidence-based principles to UI content:

**1. Remove shame and blame language**
Attribute errors to system conditions or input format, not the user.
- "You entered invalid data" → "Email format not recognised"
- "You broke something" → "Page not found"

**2. Reduce urgency pressure**
Remove countdown timers, "ACT NOW" language, and artificial scarcity from cognitive tasks.
- "Sign up now!" → "Create account"
- "60 seconds remaining!" → "Your session will expire in 5 minutes"

**3. Self-descriptive call-to-action labels**
Button labels should answer: "What happens when I click this?"
- "Submit" → "Create account"
- "OK" → "Try payment again"
- "Go" → "Start free trial"

**4. Error recovery templates**
Every error message must answer: "What do I do now?"
- "Invalid" → "Email format not recognised. Use this format: name@domain.com"
- "Error occurred" → "System error. Try again in 5 minutes or contact support."

**5. Reduce memory reliance**
Display necessary information rather than requiring recall.
- "Call for your policy number" → "Policy number (found on your insurance card, top right)"
- Show password requirements before entry, not after failure

**6. Scannable plain language**
Short paragraphs. Bullet points. Key information first.
- 8th grade reading level or lower for instructional content
- Headings to break long forms into navigable sections

**7. Calm UI microcopy**
Neutral-to-supportive tone. No excessive enthusiasm or alarm.
- "Congratulations!!!" → "Account created successfully"
- "CRITICAL ERROR" → "System error (500)"
- "Amazing! You did it!" → "Appointment confirmed"

---

### The standards behind the principles

These principles are not opinions. They map to four international standards:

| Standard | What it covers |
|---|---|
| **WCAG 2.2** | Error identification, error suggestion, labels, timeouts, redundant entry |
| **W3C COGA** | Cognitive and learning disability user needs; help users avoid mistakes, find what they need, complete tasks |
| **ISO 9241-110** | Dialogue principles: self-descriptiveness, controllability, error tolerance, conformity with expectations |
| **ISO/IEC 30071-1** | Accessibility policy: emotional safety, inclusive language, dignity in user-facing communications |

Every finding from a DS-WCS audit maps to specific criteria in these standards. This means every change is traceable and defensible — whether for a design review, an accessibility audit, or an ESG disclosure.

---

### Where to start

A practical starting point for any team:

1. Pull the last 10 error messages from your production interface
2. Check each one against three questions:
   - Does it use second-person blame? ("You entered", "You broke", "Your input is wrong")
   - Does it include a recovery path?
   - Does it use exclamation points?

If any answer is yes/no/yes — you have a HIGH severity finding.

The DS-WCS open-source skill automates this audit for teams using OpenCode. Install with one `git clone`, run against any component or file, and receive a findings report with standards citations and rewrite recommendations.

→ github.com/simonplmak-cloud/depression-sensitive-web-content

---

### A note on scope

Depression-sensitive design is a UX and content accessibility discipline. It is not a clinical practice.

DS-WCS does not diagnose depression. It does not treat depression. It does not provide mental health advice.

It addresses one specific domain: the content layer of digital interfaces, and how to make that content less harmful and more usable for people with cognitive differences.

That is a design responsibility, not a medical one.

---

## Article 3 — ESG/SDG narrative for developers

**Title:** Why developers should care about SDGs — and how one open-source skill connects to SDG 3

**Tags:** `accessibility` `opensource` `sustainability` `webdev`

**Cover image suggestion:** UN SDG colour wheel or a clean SDG 3 tile graphic.

---

Most developers encounter ESG and SDGs in one of three contexts:

1. A company all-hands where leadership announces sustainability commitments
2. A job description that mentions "responsible tech" as a value
3. A compliance checkbox somewhere in a procurement process

In all three cases, the connection to the actual work of writing code feels abstract.

This article makes it concrete. Specifically: how a free open-source tool for UI content design connects directly to UN Sustainable Development Goal 3 — and why that connection matters for the products you build.

---

### What SDG 3 actually says

SDG 3 is "Good Health and Well-Being." Most coverage focuses on vaccine access, maternal mortality, and disease prevention.

Target 3.4 reads: *"By 2030, reduce by one third premature mortality from non-communicable diseases through prevention and treatment and promote mental health and well-being."*

That last clause — promote mental health and well-being — applies beyond clinical settings. It applies to the environments people inhabit daily. And in 2026, those environments are increasingly digital.

Digital interfaces are not neutral. The language they use, the friction they create, and the emotional tone they set have measurable effects on users with mental health conditions.

---

### The cognitive impact of bad UX copy

Depression affects approximately 280 million people globally (WHO, 2023). It impairs working memory, executive function, processing speed, and emotional regulation.

When a digital interface uses blame language in error messages, it activates the brain's threat response. For users without depression, that is friction. For users with depression, that impairment compounds existing cognitive deficits — and frequently ends the session.

This is not theoretical. It is documented in cognitive psychology research and referenced in standards from the W3C Cognitive Accessibility Task Force (COGA).

Here are three patterns that cause measurable harm:

**Blame language:** "You entered invalid data" attributes failure to the user. It induces shame, which impairs problem-solving.

**Urgency pressure:** "60 seconds remaining! Act now!" creates artificial time pressure that compounds cognitive load for users whose processing speed is already impaired.

**Missing recovery paths:** "Error occurred" with no next step forces users to independently generate a solution — a task that executive function impairments make genuinely difficult.

---

### Where SDG 10 comes in

SDG 10 — Reduced Inequalities — Target 10.3 addresses non-discrimination by disability status.

Cognitive disabilities, including those related to depression and anxiety, are among the most prevalent disability categories globally. When digital interfaces are systematically inaccessible to users with these conditions, that is a form of structural exclusion.

Fixing it is not a grand gesture. It is rewriting a button label and adding a recovery path to an error message.

---

### The open-source connection

DS-WCS (Depression-Sensitive Web Content Support) is a free OpenCode skill that automates this audit.

Install it in any project:

```bash
mkdir -p .opencode/skills
git clone https://github.com/simonplmak-cloud/depression-sensitive-web-content.git \
  .opencode/skills/depression-sensitive-web-content
```

Ask OpenCode to audit any file:

```
Audit src/components/LoginError.tsx for depression-sensitive content issues
```

Every finding maps to WCAG 2.2, W3C COGA, ISO 9241-110, and ISO/IEC 30071-1 — the four international standards most relevant to cognitive accessibility.

The repository also includes a full SDG & ESG alignment document for teams that need to surface this work in reporting.

---

### Why this matters for open-source

Open-source infrastructure underlies most of the digital interfaces people use. Libraries, frameworks, component systems, design tokens — the defaults set in open-source projects propagate across thousands of products.

When error handling patterns in a component library default to blame language, that pattern ships everywhere the library ships.

Open-source maintainers have disproportionate leverage over the cognitive accessibility of the web. DS-WCS gives that community a concrete, standards-backed tool for exercising that leverage responsibly.

---

### Contribute

DS-WCS is looking for contributors from accessibility, UX writing, healthcare tech, financial services, and government digital teams. The implementation guide already covers 15 content contexts. The goal is to expand that to 50+ with community input.

- **Star or fork:** github.com/simonplmak-cloud/depression-sensitive-web-content
- **Add examples:** Edit `resources/implementation-guide.md`, Section A.2
- **Report gaps:** Open an issue describing a pattern not yet covered
- **Use it:** Run an audit on your own interfaces and share what you find

The SDGs become concrete when individual practitioners connect their daily work to them. A well-written error message is a small act. Multiplied across millions of interfaces, it is not.
