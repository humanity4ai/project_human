# Dev.to Article Drafts — Humanity4AI

Two articles ready for Dev.to. Enter tags in the Dev.to tag field, not the body. Publish Article 1 the week before launch; Article 2 during the launch window. Syndicate to Hashnode with canonical URL pointing to Dev.to.

---

## Article 1 — Technical deep-dive

**Title:** Why I built 9 AI-agent skills with zero LLM calls — deterministic humane behavior

**Tags:** `ai` `mcp` `typescript` `opensource`

**Cover image suggestion:** architecture diagram — LLM on one side, rule engine on the other, structured output between.

---

Every "AI safety" or "AI empathy" tool I evaluated had the same architecture: wrap the LLM in a prompt, ask it to be nice, hope for the best.

Hope is not a safety boundary.

[Humanity4AI](https://github.com/humanity4ai/project_human) takes the opposite approach: 9 skills that are 100% rule-based. Regex pattern libraries, scoring functions, structured decision trees. No LLM calls, no external APIs, no network access. The LLM you're already running stays in charge of conversation — the skills adjudicate the moments that matter.

### The skills

| Skill | Trigger moment |
|-------|---------------|
| Supportive Reply | User shows crisis signals |
| Safe Content Rewriter | UI copy contains shame/urgency patterns |
| Accessibility Audit | You need a WCAG 2.2 score, not vibes |
| Cognitive Accessibility | Content is too dense for stressed users |
| Cultural Context Check | Output targets an unfamiliar audience |
| De-escalation Plan | A conversation is going hostile |
| Empathetic Reframe | Your draft says "I understand how you feel" |
| Neurodiversity Design | UI audit for ADHD/autism/dyslexia/sensory |
| Age-Inclusive Design | Flow serves children or older adults |

### What "rule-based" actually means

The supportive-reply skill, for example, runs:

1. **Crisis signal detection** — 19 pattern categories (suicidal ideation, self-harm, panic, grief) matched against curated regex libraries, not model intuition
2. **Emotion classification** — 6 categories (fear, sadness, anger, loneliness, shame, love) with confidence scoring
3. **Risk calibration** — low/medium/high from signal density and severity
4. **Response assembly** — supportive template + escalation guidance + localized crisis resources (988, 741741, Samaritans, IASP, findahelpline.com) across 9 languages
5. **Mandatory disclosure** — every output carries `uncertainty: low|medium|high` and a verbatim `boundaryNotice`

High risk never produces a purely generative response. The skill inserts real crisis line numbers from a single source-of-truth module — no handler is allowed to hardcode a phone number.

### Why determinism wins here

**Auditability.** When a crisis response goes out, you can trace exactly which pattern fired and why. Try that with a prompt chain.

**Testability.** 90%+ branch coverage on safety-critical paths. Every crisis pattern has positive and negative test cases. Prompts don't have branch coverage.

**Cost and latency.** Zero tokens, ~1ms, works offline in a CLI agent.

**Honesty.** The WCAG auditor knows that only 41 of 86 criteria are fully automatable — so it scores those and flags the rest with `manual_reason` instead of hallucinating a pass. (Deque's own data: automation caps at ~57% of issues. The tool says this in its output.)

### Try it

```bash
npx @humanity4ai/mcp-servers
```

Add to your MCP client config and all 9 skills appear as tools. Or read the skill packs as plain markdown — they work as system-prompt material too.

GitHub: https://github.com/humanity4ai/project_human (MIT)

---

## Article 2 — The consolidation story

**Title:** My single-purpose repos got 6x the stars of my best project, so I ran the numbers and consolidated

**Tags:** `opensource` `github` `career` `webdev`

---

My most sophisticated project — a 9-skill humane-AI toolkit with 90% test coverage, CI gates, and a published npm package — sat at 2 stars.

My WCAG design-system repo, a fraction of the engineering effort, had 13.

I dug into the data across the MCP ecosystem and the pattern is brutal: single-purpose repos dominate. WhatsApp-MCP: 5.9k stars. Firecrawl-MCP: 7k. GhidraMCP: 9.5k. Each does exactly one thing and says so in one sentence.

### Why single-purpose wins

**3-second comprehension.** "MCP server for WhatsApp" is a complete mental model. "9 humanity skills across 6 domains" is homework.

**Urgency matching.** Nobody wakes up needing "humane AI." They wake up needing "my agent was rude to a user in crisis." One pain, one repo, one star.

**Search surface.** Ten repos = ten READMEs, ten topic sets, ten awesome-list entries. LangChain's ecosystem holds ~240k aggregate stars across repos that would be ~140k merged.

### What I did about it

Consolidated the three scattered repos into the toolkit — but as *content*, not new skills. The WCAG design system became reference guides and templates inside the existing accessibility skill. The depression-content repo became a 1,700-line implementation guide inside the existing content-safety skill. Old repos archived with redirect READMEs (stars preserved, traffic funneled).

Then rebuilt the front door:

- 9-skill table above the fold (outcome per row, not feature per row)
- One-command start: `npx @humanity4ai/mcp-servers`
- 20 GitHub topics chosen by search volume, capped at GitHub's limit
- Dogfooded the WCAG auditor on its own landing page — it scored 79/100 and found two real CSS bugs. That story is in this article, because self-hosting your own tool's output is the most credible demo there is.

### The lesson

Quality doesn't earn stars. Comprehension speed does. Consolidate the engineering, fragment the *pitch* — every skill in my toolkit now has a one-sentence outcome you could repeat without reading the docs.

Repo: https://github.com/humanity4ai/project_human

What's worked for your repos? Especially interested in awesome-list conversion rates.
