# LinkedIn Content Pack — Humanity4AI

Two posts: a launch announcement (Day 1) and a thought-leadership follow-up (Day 4-5). LinkedIn rewards professional framing — lead with the problem and the engineering discipline, not the star count.

---

## Post 1 — Launch Announcement

**Format:** Text + link preview (put the GitHub link in the first comment, not the post body — LinkedIn deprioritises posts with external links)

**Body:**

AI agents write our code, answer our customers, and increasingly talk to people in vulnerable moments.

But when a user tells an agent "I can't do this anymore," most agents respond with whatever the model feels like generating.

Over the past months I've been building Humanity4AI — an open-source system of 9 "humanity skills" for AI agents:

→ Crisis detection with supportive replies that always escalate to real helplines (988, Samaritans, IASP — in 9 languages)
→ WCAG 2.2 accessibility auditing across all 86 success criteria
→ Depression-sensitive content rewriting, mapped to WCAG, W3C COGA, and ISO standards
→ Cultural sensitivity checks with mandatory uncertainty disclosure
→ Conflict de-escalation planning
→ Empathetic communication reframing
→ Neurodiversity-aware and age-inclusive design audits

Two engineering decisions I'm most confident about:

1. **Zero LLM calls.** Every skill is rule-based — pattern libraries and scoring functions. Deterministic, auditable, and testable (90%+ branch coverage on safety-critical paths). You can't put a prompt chain under branch coverage.

2. **Mandatory humility.** Every output declares its uncertainty (low/medium/high) and its safety boundary — what the skill will never do, including diagnosing, treating, or claiming legal compliance.

The system runs as a standard MCP server — one command, compatible with Claude Code, Copilot, Cursor, OpenCode, and any MCP client.

MIT licensed. Contributions, scenarios, and critiques welcome — especially from accessibility practitioners and mental-health-adjacent product teams.

(Link in comments)

#ResponsibleAI #Accessibility #OpenSource #AIAgents #InclusiveDesign

---

## Post 2 — Thought Leadership (Day 4-5)

**Format:** Text only, no link (link in comments)

**Body:**

A lesson from shipping open-source AI tooling: my most carefully engineered project had 2 GitHub stars. A far simpler side project had 6x more.

The data across the ecosystem explains why. Single-purpose tools dominate — the top MCP servers each do exactly one thing and say so in one sentence. Comprehensive toolkits, however well-built, fail the 3-second comprehension test.

So I ran the experiment:

1. Consolidated three scattered repos into the main toolkit — as enriched content, not new features
2. Archived the old repos with redirect notices (stars preserved, traffic funneled)
3. Rebuilt the README around a table of outcomes, not a wall of features
4. Dogfooded the WCAG auditor on its own site — it scored 79/100 and found two genuine bugs. Fixed them, and that story became the demo.

Early results: the redirect traffic alone now exceeds the original organic traffic.

The deeper point for engineering leaders: quality and discoverability are separate workstreams. The best code in your portfolio is worthless if a stranger can't articulate what it does in 3 seconds. Consolidate the engineering; fragment the pitch.

What's worked for your projects?

#OpenSource #EngineeringLeadership #DevRel

---

## Engagement Notes

- Respond to every comment within 2 hours during launch week — LinkedIn's algorithm weights early comment velocity heavily
- Repost to relevant groups: Accessibility professionals, Responsible AI, AI Ethics communities
- If Ascent Partners Foundation has a LinkedIn page, publish Post 1 there and reshare from the personal account
