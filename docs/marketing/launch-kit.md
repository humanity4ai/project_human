# Launch Kit — Copy-Paste Ready

Every text below is ready for direct copy-paste into the platform. Substitute `[LINK]` with the actual URL where indicated.

**Launch date:** Pick a Tuesday or Wednesday. Avoid major tech events.

---

## Hacker News — Show HN

**Title (max 80 chars):**
```
Show HN: Humanity4AI – 9 rule-based humanity skills for AI agents (MCP, zero LLM calls)
```

**URL field:** https://github.com/humanity4ai/project_human

**First comment (post within 5 minutes of submission):**

```
I built this after watching AI agents consistently fail at humane interaction. A user says "I can't do this anymore" and the agent responds with a stack trace or a cheery "Is there anything else I can help with?"

The problem isn't the LLM — it's that we're asking the LLM to be both sword and shield. Humanity4AI runs alongside the LLM as a deterministic adjudication layer:

- 9 skills, all rule-based. Zero LLM calls. Pattern libraries + scoring functions.
- Crisis detection fires first, before the model generates. High-risk input inserts real crisis-line numbers (988, 741741, Samaritans, IASP) into the response and never lets the model handle it alone.
- Every output carries uncertainty (low/medium/high) and a machine-readable boundary notice (what the skill will never do — diagnose, treat, claim legal compliance).
- The WCAG auditor knows only 41 of 86 criteria are fully automatable, so it scores those and flags the rest with `manual_reason` instead of hallucinating a pass.

One command: npx @humanity4ai/mcp-servers

Happy to answer questions. Particularly interested in feedback from accessibility practitioners and anyone who's tackled AI safety with deterministic approaches.
```

---

## Product Hunt — Listing Prep

**Tagline:**
```
9 humanity skills for AI agents — crisis detection, WCAG audits, empathy
```

**Description (260 chars max):**
```
Rule-based skills for humane AI agents: crisis detection, WCAG 2.2 auditing, empathy reframing, cultural sensitivity, de-escalation, content safety. 9 skills, zero LLM calls, one npm command. MIT.
```

**Suggested screenshots (at least 3):**
1. The 9-skill table from the README — shows what it does at a glance
2. Terminal: `npx @humanity4ai/mcp-servers` output — one-command install
3. MCP client config snippet — integration simplicity
4. The WCAG audit dogfood output (79/100 AAA on its own site) — self-hosting credibility
5. The architecture diagram from the landing page hero

**Logo:** Use the favicon from site/assets/favicon.svg or the hero-architecture.svg

**First comment (post immediately after listing goes live):**

```
👋 I built Humanity4AI after watching my agents fail at the human moments. A user in crisis, a culture-specific phrase, a wall of text that drowns a stressed reader — LLMs get these wrong in unpredictable ways.

So I took the LLM out of the safety loop. All 9 skills are rule-based — deterministic, auditable, and honestly limited. The WCAG auditor literally scored itself 79/100 at AAA and found real bugs in its own landing page. Fixed them. Shipped.

Zero tokens, ~1ms per check, works with any MCP-compatible agent (Claude Code, OpenCode, Copilot, Cursor).

Happy to answer questions — especially from accessibility practitioners and anyone building AI safety tooling.
```

**Categories:** Developer Tools, AI, Open Source

**Topics/Hashtags:** MCP, AI-Agents, Accessibility, WCAG, Responsible-AI

**Schedule:** 12:01 AM PT on launch day (Day 2 of the 48-hour window, Day 1 = HN + X + Reddit)

---

## X/Twitter Launch Thread

From docs/marketing/x-twitter-content-pack.md — copy-paste each post individually, number them 1/7 through 7/7. Pin the thread.

---

## Reddit Posts

From docs/marketing/reddit-post-pack.md.

| Day | Subreddit | Post |
|-----|-----------|------|
| Day 1 11:00 AM ET | r/accessibility | Post 1 (dogfooding angle) |
| Day 2 9:00 AM ET | r/LocalLLaMA | Post 2 (deterministic skills angle) |
| Day 2 3:00 PM ET | r/webdev | Post 3 (consolidation lessons) — only if Day 1 posts live |

---

## LinkedIn Posts

From docs/marketing/linkedin-content-pack.md. Link in first comment (LinkedIn deprioritises external links in post body).

---

## Dev.to Articles

From docs/marketing/devto-article-drafts.md. Publish Article 1 7 days before launch; Article 2 during Day 2.

---

## Before You Launch — Verification Checklist

- [ ] Repo README renders correctly: https://github.com/humanity4ai/project_human
- [ ] Site loads: https://humanity4ai.simonmak.com/ (zero console errors)
- [ ] npm package page loads: https://www.npmjs.com/package/@humanity4ai/mcp-servers
- [ ] Archived repos show redirects: wcag-aaa-web-design, depression-sensitive-web-content, nvda-wcag22-testing
- [ ] Awesome-mcp-servers PR merged: https://github.com/punkpeye/awesome-mcp-servers/pull/10793
- [ ] awesome-a11y PR merged: https://github.com/brunopulis/awesome-a11y/pull/258
- [ ] MCP Registry published (run in Codespace: mcp-publisher publish)
- [ ] `pnpm check && pnpm evals && pnpm test` green on main (run in Codespace)
- [ ] No major tech event collides with launch window (check news)

---

## MCP Registry Publishing (run in Codespace)

After the PR with `mcpName` in package.json is merged:

```bash
# In Codespace:
cd /workspaces/project_human/mcp-servers
npm install -g mcp-publisher
mcp-publisher login github
mcp-publisher init    # edit server.json if needed
mcp-publisher publish
```
