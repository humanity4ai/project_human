# Reddit Post Pack — DS-WCS Skill

Three posts, one per subreddit. Each is written community-first — the value (resource, examples, discussion) leads; the project link is secondary. Reddit penalises posts that read as self-promotion. These are framed as contributions to the community.

---

## Post 1 — r/accessibility

**Subreddit:** r/accessibility
**Post type:** Text post (no link post — text posts perform better in this sub)
**Title:** Free cognitive accessibility audit checklist for UI content — 40 items, maps to WCAG 2.2 and W3C COGA

---

**Body:**

I put together an open-source audit framework for cognitive accessibility in UI content — specifically for the content layer that most accessibility audits skip: error messages, CTAs, empty states, form instructions, notifications, and onboarding flows.

It covers 40+ audit items across those categories, with severity ratings (HIGH/MEDIUM/LOW), remediation guidance, and full traceability to WCAG 2.2, W3C COGA, ISO 9241-110, and ISO/IEC 30071-1 for every finding.

A few examples of what it catches:

**HIGH severity:**
- Blame language in error messages ("You entered invalid data" → attribute to format, not user)
- Missing recovery paths ("Error occurred" with no next step)
- Placeholder text used as the only label (disappears on focus, violates WCAG 3.3.2)
- Conditional fields that appear without warning

**MEDIUM severity:**
- Generic button labels ("Submit", "OK", "Go") — violates WCAG 2.4.6
- Password requirements hidden until after failure
- Multi-step forms with no progress indicator
- Memory-dependent form instructions ("Call us for your policy number")

**LOW severity:**
- Exclamation points in error states
- Excessive enthusiasm in confirmations ("Congratulations!!! You did it!!!")

The checklist is in a GitHub repo along with a 15-example before/after rewrite library and a full standards traceability matrix.

Would be interested in feedback from practitioners on gaps — particularly for native app contexts, voice interfaces, or domains I haven't covered well (e.g., education platforms, government services).

→ https://github.com/simonplmak-cloud/depression-sensitive-web-content

---

## Post 2 — r/UXDesign

**Subreddit:** r/UXDesign
**Post type:** Text post
**Title:** 15 before/after UI content rewrites for cognitive accessibility — looking for critique

---

**Body:**

I've been building an open-source audit framework for cognitive accessibility in UI content and wanted to share the rewrite library here for critique. These are the patterns I see most frequently in audits — interested to know if practitioners here agree with the rewrites or would approach them differently.

Here are 5 of the 15 examples:

---

**Error message — e-commerce checkout:**
Before: "Invalid email! Try again."
After: "Email format not recognised. Please use this format: name@domain.com"

Rationale: Removes blame attribution, removes exclamation point, provides concrete recovery path and format example.

---

**Empty state — wellness app:**
Before: "No activities logged. You should track your mood daily to see your progress over time."
After: "When you log activities, they'll appear here. Optional: track your mood to identify patterns in your energy and wellbeing."

Rationale: Removes "should" (obligation language), removes "progress" (implies current failure), emphasises optionality.

---

**CTA — account signup:**
Before: "Sign up now!"
After: "Create your account (takes about 2 minutes)"

Rationale: Self-descriptive outcome, time expectation reduces uncertainty, no urgency pressure.

---

**Session timeout — general web:**
Before: "WARNING: Your session expires in 60 seconds! Save now or lose all your changes!"
After: "Your session will expire in 5 minutes due to inactivity. Save your work to continue."

Rationale: Extended warning window, removed caps and exclamation points, removed threat language, single calm action.

---

**Job application rejection — job platform:**
Before: "Application rejected. Better luck next time!"
After: "Application status: Not selected. You can apply for other open positions that match your skills."

Rationale: Removed "rejected" framing, removed "luck" (implies random outcome), provided constructive next step.

---

All 15 rewrites map to WCAG 2.2, W3C COGA, ISO 9241-110, and ISO/IEC 30071-1 — so the rationale isn't subjective, it's grounded in the relevant standards.

The full library, audit checklist, and standards traceability matrix are in the repo if anyone wants to dig in:
→ https://github.com/simonplmak-cloud/depression-sensitive-web-content

Happy to discuss any of the rewrites — particularly cases where the before version might be appropriate in certain contexts, or where the after version introduces new problems.

---

## Post 3 — r/opensource

**Subreddit:** r/opensource
**Post type:** Text post
**Title:** DS-WCS — open-source OpenCode skill for cognitive accessibility audits in UI content [MIT]

---

**Body:**

**What it is:**
An OpenCode agent skill that audits and rewrites UI content for cognitive accessibility. It targets the content layer — error messages, CTAs, form instructions, empty states, notifications — that most accessibility tools don't cover.

**How it works:**
Install with one `git clone` into your `.opencode/skills/` directory. Ask OpenCode to audit any file or content snippet. It returns prioritised findings with standards citations (WCAG 2.2, W3C COGA, ISO 9241-110, ISO/IEC 30071-1) and before/after rewrite recommendations.

```bash
mkdir -p .opencode/skills
git clone https://github.com/simonplmak-cloud/depression-sensitive-web-content.git \
  .opencode/skills/depression-sensitive-web-content
```

Then in OpenCode:
```
Audit src/components/ErrorState.tsx for depression-sensitive content issues
```

**What's in the repo:**
- `SKILL.md` — main skill definition loaded by OpenCode
- `resources/implementation-guide.md` — 7 core rewrite principles, 15 before/after examples, 40-item audit checklist, full standards traceability matrix
- `AGENTS.md` — agent context and auto-invocation triggers
- `docs/` — SDG/ESG alignment documentation, fork instructions

**License:** MIT

**Looking for contributors:**
The implementation guide currently covers general web, e-commerce, healthcare, financial services, and job platform contexts. Would like to expand to:
- Education platforms
- Government / public sector services
- Native mobile (iOS/Android content patterns)
- Voice interfaces
- Additional language/localization examples

If you work in any of these domains and want to add before/after examples or audit checklist items, the contribution guide is in `.github/CONTRIBUTING.md`.

→ https://github.com/simonplmak-cloud/depression-sensitive-web-content
