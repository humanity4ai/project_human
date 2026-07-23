# Launch Plan — Humanity4AI 48-Hour Window

GitHub Trending ranks by star velocity, not total stars. A coordinated 48-hour multi-channel push is worth ~5x the same effort spread over two weeks. This plan sequences every asset in `docs/marketing/`.

**Pick a Tuesday or Wednesday start.** Avoid weekends, holidays, and major tech-event days (Apple/Google keynotes, AWS re:Invent).

---

## Pre-Launch (T-7 to T-1 days)

- [ ] **T-7:** Publish Dev.to Article 1 ("Why I built 9 AI-agent skills with zero LLM calls") — seeds the story before launch traffic arrives
- [ ] **T-6:** Submit awesome-list PRs (see directory-submission-template.md) — stagger across T-6 to T-2 so merges land during launch week
- [ ] **T-5:** Post in 2-3 relevant communities as a genuine participant (not promoting) — build subreddit karma if the account is new to r/accessibility
- [ ] **T-3:** Syndicate Article 1 to Hashnode (canonical → Dev.to)
- [ ] **T-2:** Verify all links live: repo README renders, npm page loads, site loads at humanity4ai.simonmak.com, archived repos show redirects
- [ ] **T-1:** Prepare Product Hunt listing (logo, 5 screenshots, tagline: "9 humanity skills for AI agents — crisis detection, WCAG audits, empathy"). Schedule for 12:01 AM PT launch day. Line up a Hunter if possible.
- [ ] **T-1:** Final check: `pnpm check && pnpm evals && pnpm test` green on main (run in Codespace)

## Day 1 (Launch Tuesday/Wednesday)

| Time (ET) | Channel | Asset |
|-----------|---------|-------|
| 8:00–10:00 AM | **Hacker News** — Show HN | Title: `Show HN: Humanity4AI – 9 rule-based humanity skills for AI agents (MCP, zero LLM calls)`. First comment within 5 min: why you built it (the "agent replies with a stack trace" story) + what's deterministic vs LLM-based. Respond to every comment within 30 min for the first 6 hours. |
| 9:00 AM | **X/Twitter** — launch thread | 7-post thread from x-twitter-content-pack.md. Pin it. |
| 10:00 AM | **LinkedIn** — Post 1 | Link in first comment. |
| 11:00 AM | **Reddit** — r/accessibility | Post 1 from reddit-post-pack.md (the dogfooding story leads). |
| Afternoon | Engage | Answer every HN/Reddit/X reply. No new posts — depth over breadth. |

## Day 2

| Time (ET) | Channel | Asset |
|-----------|---------|-------|
| 12:01 AM PT | **Product Hunt** | Listing goes live. Ask supporters to upvote/comment early (PH weights first-hours velocity). |
| 9:00 AM ET | **Reddit** — r/LocalLLaMA or r/artificial | Post 2 (deterministic skills angle). |
| 12:00 PM | **Dev.to** — Article 2 | The consolidation story. Link the HN thread if it's going well. |
| 3:00 PM | **Reddit** — r/webdev | Post 3 (consolidation/lessons angle) — only if Day 1 posts weren't removed/flagged; otherwise skip to avoid spam signals. |

## Day 3–7 (Compounding)

- [ ] LinkedIn Post 2 (thought leadership)
- [ ] X standalone posts A–D, one per day
- [ ] Reply to every issue/discussion opened during launch within 24h
- [ ] Track: stars (star-history.com), npm downloads, referral traffic (GitHub Insights → Traffic)
- [ ] If GitHub Trending hits (TypeScript or all-languages): screenshot it, post it everywhere — Trending is self-reinforcing

## Success Metrics

| Metric | Conservative | Good | Great |
|--------|-------------|------|-------|
| Stars after 7 days | 50 | 200 | 1,000+ (Trending) |
| HN front page | — | 4+ hours | #1-10 |
| npm weekly downloads | 50 | 300 | 1,000+ |
| Awesome-list merges | 1 | 3 | 5+ |

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| HN flags it as self-promo | First comment is the genuine story; no marketing language in title; "rule-based, zero LLM calls" is the hook — contrarian enough to earn discussion |
| Reddit removal | Text posts, community-first framing, no link-only posts, one post per sub per day max |
| Mental-health topic attracts trolls | Respond once with the non-clinical boundary statement; never debate clinical validity — the repo's safety position is documented |
| Launch window collides with big tech news | Check the tech calendar at T-3; slide the window if a keynote lands on Day 1 |

## After Launch (Week 2+)

- [ ] Write the retrospective post (what worked, star data) — this content itself performs well
- [ ] Convert engaged commenters into contributors: label beginner-friendly items `good first issue`
- [ ] Evaluate spinning out `humanity4ai-mcp` as its own repo once total stars pass ~500 (aggregate-org-stars strategy)
- [ ] Product Hunt can be re-launched for major versions — keep the listing maintained
