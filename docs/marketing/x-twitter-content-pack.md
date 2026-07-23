# X / Twitter Content Pack — Humanity4AI

Post the launch thread on Day 1 of the 48-hour window (see launch-plan.md). Follow with the standalone posts over the next week. Pin the thread.

---

## Launch Thread (7 posts)

**1/7**
AI agents are everywhere. Humane ones aren't.

A user tells your agent "I can't do this anymore" — and it replies with a stack trace.

I built 9 rule-based "humanity skills" that fix this. Open source, MIT, zero LLM calls. 🧵

https://github.com/humanity4ai/project_human

**2/7**
The core idea: don't ask the LLM to be humane. Adjudicate it.

Every skill is patterns + heuristics — deterministic, testable, auditable. The LLM converses; the skills govern the moments that matter.

No API calls. No tokens. ~1ms.

**3/7**
The 9 skills:

🛡️ Crisis detection → supportive reply + real helplines (9 languages)
📝 Shame/urgency content rewriter
♿ WCAG 2.2 audit (all 86 criteria)
🧠 Cognitive accessibility
🌍 Cultural context checks
🔥 De-escalation plans
💬 Empathy reframing
🧩 Neurodiversity design
👶 Age-inclusive design

**4/7**
The safety rule that matters most: high-risk input NEVER gets a purely generative response.

Crisis signals → real resources (988, 741741, Samaritans, IASP) from a single source-of-truth module. No handler can hardcode a phone number. 90%+ branch coverage on safety paths.

**5/7**
Every response carries machine-readable honesty:

→ uncertainty: low | medium | high
→ boundaryNotice: what the skill will never do (diagnose, treat, claim legal compliance)

Cultural checks default to HIGH uncertainty. Humility as a type system.

**6/7**
Dogfooding moment: I pointed the WCAG auditor at its own landing page.

79/100 at AAA. It found two real CSS bugs (missing line-height, sub-44px touch targets). Fixed, shipped, score improved.

Your tool auditing itself > any feature list.

**7/7**
One command to try it:

npx @humanity4ai/mcp-servers

Works with Claude Code, OpenCode, Copilot, Cursor — any MCP client.

⭐ if useful: https://github.com/humanity4ai/project_human

---

## Standalone Posts (spread over launch week)

**Post A — the consolidation story**
My 9-skill toolkit: 2 stars.
My simple WCAG repo: 13 stars.

Single-purpose repos win GitHub. So I consolidated the content but fragmented the pitch — every skill now has a one-sentence outcome.

Full breakdown: [Dev.to article link]

**Post B — determinism**
"Use an LLM to check the LLM" is the industry's answer to AI safety.

Mine: 19 crisis-pattern regex libraries, 6 emotion classifiers, 0 tokens.

Deterministic > hopeful.

https://github.com/humanity4ai/project_human

**Post C — WCAG honesty**
Only 41 of 86 WCAG 2.2 criteria are fully automatable (Deque: ~57% of issues).

My auditor scores those and flags the rest manual instead of fake-passing them.

Honest tools > confident tools.

**Post D — community question**
What's the most inhumane thing an AI agent has said to you?

Collecting real scenarios as test fixtures for the crisis-detection library. 👇

---

## Hashtags & Handles

- Primary: #BuildInPublic #OpenSource #AIAgents #MCP #a11y
- Tag when relevant: @github (for MCP-related posts), accessibility community accounts
- Never hashtag the words "mental health" on launch posts — attracts the wrong algorithmic context; let the content carry it
