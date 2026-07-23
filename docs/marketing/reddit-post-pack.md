# Reddit Post Pack — Humanity4AI

Three posts, one per subreddit. Community-first framing: the insight/resource leads; the link is secondary. Reddit penalises self-promotion. Post these inside the 48-hour launch window (see launch-plan.md). Build karma in each sub before posting if the account is new there.

---

## Post 1 — r/accessibility

**Post type:** Text post
**Title:** I built a rule-based WCAG 2.2 auditor that runs inside AI agents (MCP) — all 86 success criteria, no API calls

**Body:**

Most AI accessibility tooling sends your HTML to an LLM and asks "is this accessible?" The answer is non-deterministic and unverifiable.

I took a different approach: a fully rule-based engine that scores pages against all 86 WCAG 2.2 success criteria (A/AA/AAA, all four POUR principles). Regex + structured heuristics only — zero LLM calls, zero network requests. Same input, same output, every time.

What it does:

- **Crawl mode:** feed it `{url, html}` pairs, get a 0–100 score per criterion, per page, plus site aggregate and ranking
- **Session mode:** declare your target level (A/AA/AAA), get the full checklist the agent must enforce
- Honest about limits: the 41 fully automatable criteria get real scores; manual-only criteria (e.g., audio description) are flagged with a `manual_reason` instead of being fake-passed
- Optional axe-core engine if you want Deque's rules too (~57% automation ceiling — it says so in the output)

It's one of 9 "humanity skills" in the project (the others cover cognitive accessibility, neurodiversity-aware design, depression-sensitive content). Everything is MIT licensed and runs as a standard MCP server:

```
npx @humanity4ai/mcp-servers
```

I ran it on its own landing page and it scored itself 79/100 at AAA — the failing criteria were instructive (no `line-height ≥ 1.5` in body CSS, touch targets under 44px). Dogfooding found real bugs.

Feedback wanted: which WCAG criteria do you most want deterministic automation for that everyone leaves manual?

→ https://github.com/humanity4ai/project_human

---

## Post 2 — r/LocalLLaMA (or r/artificial)

**Post type:** Text post
**Title:** 9 rule-based "humanity skills" for LLM agents — crisis detection, de-escalation, empathy checks, all deterministic, all local

**Body:**

A pattern I kept hitting: agents are fine at code and terrible at humans. A user says "I can't do this anymore" and the agent responds with a stack trace.

So I built 9 rule-based skills that run inside any MCP-compatible agent (Claude Code, OpenCode, Copilot, Cursor):

1. **Supportive reply** — detects crisis signals across 6 emotion categories, generates a supportive response, and always escalates to real crisis lines (988, 741741, Samaritans, IASP — localized, 9 languages). High-risk input never gets a purely AI response.
2. **Depression-sensitive content rewriter** — flags shame/blame/urgency patterns in UI copy and rewrites them, mapped to WCAG 2.2 + COGA + ISO standards.
3. **WCAG 2.2 audit** — all 86 success criteria, regex engine + optional axe-core.
4. **Cognitive accessibility audit** — reading level, structure, cognitive load.
5. **Cultural context check** — sensitivity flags for a stated audience/region, with uncertainty disclosure.
6. **De-escalation plan** — structured plans by intensity (low/medium/high), explicitly non-coercive.
7. **Empathetic reframe** — catches hollow empathy ("I understand how you feel") and rewrites it.
8. **Neurodiversity design check** — ADHD/autism/dyslexia/sensory UI audit.
9. **Age-inclusive design check** — barriers for children through older adults.

Design decisions that might interest this sub:

- **No LLM in the loop.** Every skill is patterns + heuristics. Deterministic, auditable, zero token cost, works offline. The LLM orchestrates; the skill adjudicates.
- **Uncertainty is mandatory output.** Every response states low/medium/high confidence. Cultural checks default to high uncertainty.
- **Safety boundaries are machine-readable.** Each skill declares what it will never do (no diagnosis, no therapy, no legal compliance claims).

MIT, TypeScript, 90%+ test coverage: https://github.com/humanity4ai/project_human

What humane failure modes have you hit with your agents? Genuinely asking — scenarios become test fixtures.

---

## Post 3 — r/webdev (or r/opensource)

**Post type:** Text post
**Title:** I consolidated my scattered accessibility/mental-health repos into one MCP toolkit — here's what the star data taught me

**Body:**

I maintained separate repos for a WCAG design system, a depression-sensitive content skill, and an NVDA testing pipeline. The single-purpose WCAG repo got 6x the stars of my comprehensive toolkit — matching the pattern you see across GitHub (single-purpose MCP servers like WhatsApp-MCP and Firecrawl hit thousands of stars while polished multi-tool repos sit at zero).

So I ran the experiment properly: consolidated everything into one coherent project (9 skills, one MCP server, one npm package), archived the old repos with redirects, and rebuilt the README around a 3-second comprehension test.

What actually moved the needle, ranked:

1. **A skills table above the fold.** "9 humanity skills" is abstract. A 9-row table with one-line outcomes is not.
2. **One-command install.** `npx @humanity4ai/mcp-servers` replaced a 5-step setup.
3. **20 precise topics** (mcp-server, llm, claude, openai, wcag) — GitHub caps at 20; dropping vanity topics for search-volume topics matters.
4. **Archiving old repos with redirect READMEs** instead of deleting — the stars stay visible and funnel traffic.
5. **Dogfooding the tool on itself** — the WCAG auditor scored its own landing page 79/100 and found real issues (missing line-height, small touch targets). That story is better marketing than any feature list.

The toolkit: https://github.com/humanity4ai/project_human (MIT)

Happy to share the full before/after README diff if anyone's doing the same consolidation.
