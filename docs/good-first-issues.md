# Good First Issues

Use these starter tasks to contribute quickly and learn the project structure.

---

## Open Starter Tasks

### #11 — Add multilingual supportive-conversation scenarios

Add at least 10 multilingual prompts to `skills/supportive-conversation/scenarios/scenarios.yaml` covering different languages and cultural contexts. Add a `locales` field to `skill.yaml`.

- Issue: https://github.com/humanity4ai/project_human/issues/11
- Labels: `needs-scenarios`, `help wanted`
- Manifesto principles: dignity and non-exploitation; open community implementation
- Key constraint: all scenarios must preserve the non-clinical, escalation-aware boundary

---

### #3 — Quality uplift for launch skills

Review boundary wording, `SKILL.md` anti-patterns, and rubric examples for 4 skills: `wcag-aaa-accessibility`, `depression-sensitive-content`, `supportive-conversation`, `cognitive-accessibility`.

- Issue: https://github.com/humanity4ai/project_human/issues/3
- Labels: `help wanted`
- Manifesto principles: honest uncertainty and explicit limits; boundaries over performance theater
- Key constraint: no clinical or legal advice language introduced

---

### #4 — Scenario expansion and edge coverage

Add 5+ new edge-case and ambiguity scenarios to 4 skills: `cultural-sensitivity`, `conflict-de-escalation`, `empathetic-communication`, `supportive-conversation`.

- Issue: https://github.com/humanity4ai/project_human/issues/4
- Labels: `needs-scenarios`, `help wanted`
- Manifesto principles: honest uncertainty and explicit limits; reproducible quality gates
- Key constraint: scenarios must be realistic, respectful, and non-clinical

---

## Manifesto-aligned Starter Ideas

- Manifesto coverage audit across all 10 skills (docs + rubric links)
- Improve uncertainty signaling examples in supportive and conflict scenarios
- Add contributor-facing checklist for manifesto-related PRs and tests

Use this implementation map when proposing issues: `docs/manifesto-roadmap-map.md`

---

## Contribution Path

```bash
# 1. Fork and clone your fork
git clone https://github.com/<your-username>/project_human.git
cd project_human

# 2. Branch from development (the default branch)
git checkout development
git checkout -b my-contribution

# 3. Make your changes

# 4. Run all checks — all must pass
pnpm check && pnpm evals && pnpm test

# 5. Open a PR targeting development
gh pr create --base development --title "Add: ..." --body "Closes #<issue>"
```

---

## Completed Starter Tasks

These were originally listed as good first issues and have since been resolved:

| Issue | Title | Resolution |
|-------|-------|------------|
| [#12](https://github.com/humanity4ai/project_human/issues/12) | Add MCP schema examples for all actions | Done — `mcp-servers/examples/` has 10 complete request/response example files |
| [#13](https://github.com/humanity4ai/project_human/issues/13) | Generate markdown eval report output | Done — `EVAL_REPORT=1 pnpm evals` writes `evals/reports/latest.md`; documented in `evals/README.md` |
| [#14](https://github.com/humanity4ai/project_human/issues/14) | Add new adapter walkthrough for one agent platform | Done — LangChain adapter walkthrough added to `docs/agent-adapters.md` |
| [#15](https://github.com/humanity4ai/project_human/issues/15) | Improve README first-contribution flow | Done — README now has copy-paste git commands, branch instructions, and troubleshooting table |
