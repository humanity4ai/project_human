# Contributing

**Copyright (c) 2026 Ascent Partners Foundation. MIT License.**

Thanks for contributing to Humanity4AI. This guide covers all contribution types.

---

## Before You Open an Issue

Not everything belongs in an issue tracker. Use the right channel:

| Type | Where |
|------|-------|
| Bug in skills, eval harness, or server | Issue — Bug Report template |
| New skill proposal | Issue — Skill Proposal template |
| Scenario additions | Issue — Scenario Addition template |
| Platform integration request | Issue — Integration Request template |
| Question about usage | [Discussions — Integration Help](https://github.com/humanity4ai/project_human/discussions) |
| New skill idea (not yet concrete) | [Discussions — Skill Ideas](https://github.com/humanity4ai/project_human/discussions) |
| Safety or ethics discussion | [Discussions — Safety & Ethics](https://github.com/humanity4ai/project_human/discussions) |
| Show what you built | [Discussions — Show & Tell](https://github.com/humanity4ai/project_human/discussions) |
| Security or safety concern | Email `simon@ascent.partners` — see `SECURITY.md` |

---

## Contribution Flow

```
Have an idea?
  └─► Discuss first in GitHub Discussions (Skill Ideas or Integration Help)
        └─► Ready to build? Open an Issue (skill-proposal or integration-request)
              └─► Fork the repo and create a branch
                    └─► Implement your changes
                          └─► Run: pnpm check && pnpm evals && pnpm test
                                └─► Open a Pull Request (use the PR template)
                                      └─► CI runs automatically
                                            └─► Maintainer reviews
                                                  └─► Approved + CI green = Merged
                                                        └─► Branch auto-deleted
```

---

## What Gets Reviewed by Whom

| Path | Reviewers | Notes |
|------|-----------|-------|
| Any file | `@simonplmak-cloud` | Global owner — all PRs |
| `skills/supportive-conversation/` | `@simonplmak-cloud` | Safety-critical |
| `skills/grief-loss-support/` | `@simonplmak-cloud` | Safety-critical |
| `skills/depression-sensitive-content/` | `@simonplmak-cloud` | Safety-critical |
| `mcp-servers/` | `@simonplmak-cloud` | Runtime and contracts |
| `GOVERNANCE.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md` | `@simonplmak-cloud` | Policy files |

All PRs require 1 approving review before merge. Safety-critical paths require the CODEOWNERS reviewer specifically.

---

## Prerequisites

```bash
node --version   # >= 20
pnpm --version   # >= 10
```

---

## Contribution Types

- New skill proposals
- Scenario additions and improvements
- Rubric improvements
- MCP schema or handler additions
- Documentation and translations
- Bug fixes in the eval harness or server
- Platform integration adapters

---

## Required Artifacts for a New Skill

Every skill directory must include:

| File | Purpose |
|------|---------|
| `SKILL.md` | Purpose, boundaries, workflow, anti-patterns |
| `skill.yaml` | Machine-readable spec (name, version, category, actions, uncertainty, provenance) |
| `rubric.md` | Evaluation dimensions (Helpfulness, Humility, Harm avoidance, Clarity) |
| `scenarios/scenarios.yaml` | At least 10 test scenarios |
| `CHANGELOG.md` | Version history |
| `LICENSE` | MIT License with Ascent Partners Foundation as copyright holder |

Use the template at `templates/skill/` as your starting point.

---

## Adding a New MCP Action

When adding a new skill, you must also register the corresponding MCP action:

### Step 1: Add input/output JSON schemas

Create two files in `mcp-servers/schemas/`:

```
mcp-servers/schemas/<skill-name>.input.json
mcp-servers/schemas/<skill-name>.output.json
```

Follow the existing schema pattern — include `$schema`, `$id`, `type`, `required`, `properties`, and `additionalProperties: false`.

### Step 2: Register the action contract

Add an entry to `actionContracts` in `mcp-servers/src/index.ts`:

```typescript
{
  skill: "your-skill-name",
  action: "your_action_id",
  inputSchemaPath: "schemas/your-skill-name.input.json",
  outputSchemaPath: "schemas/your-skill-name.output.json",
  safetyBoundary: "Describe the safety boundary for this action"
}
```

### Step 3: Regenerate the contracts snapshot

```bash
pnpm --filter @humanity4ai/mcp-servers build:contracts
```

This updates `mcp-servers/src/contracts.json`, which is used by the eval harness.

### Step 4: Implement the handler

Add a handler case in `mcp-servers/src/handlers.ts`:

```typescript
case "your_action_id":
  return handleYourAction(input, boundaryNotice);
```

And implement the handler function:

```typescript
function handleYourAction(
  input: Record<string, unknown>,
  boundaryNotice: string
): HandlerResult {
  const myField = str(input, "my_field", "default");

  return {
    ok: true,
    data: {
      action: "your_action_id",
      boundaryNotice,
      uncertainty: "medium",
      assumptions: ["List assumptions here"],
      output: {
        result: "structured output here"
      }
    }
  };
}
```

### Step 5: Update `skills/index.yaml`

Add your skill to the index:

```yaml
- name: your-skill-name
  category: your-category-slug
  action: your_action_id
```

Valid category slugs: `accessibility`, `emotional-safety`, `communication`, `cognitive-support`, `cultural-context`, `conflict-navigation`, `inclusive-design`, `lifecycle-support`, `neurodiversity`, `age-inclusion`.

---

## Safety and Provenance

- Declare source provenance in `skill.yaml`
- Include explicit boundaries and non-goals
- Do not submit clinical diagnosis, treatment plans, or legal advice playbooks
- Safety-critical skills (`supportive-conversation`, `grief-loss-support`, `depression-sensitive-content`) require escalation language in boundaries
- Never reference specific individuals or organisations in scenarios without consent

---

## Full Workflow

```bash
# 1. Fork and create a branch
git checkout -b add-my-skill

# 2. Copy the template
cp -r templates/skill skills/my-skill-name

# 3. Implement your changes
# ... edit skill files, add handler, add schemas ...

# 4. Regenerate contracts if you added a new action
pnpm --filter @humanity4ai/mcp-servers build:contracts

# 5. Run all checks — all must pass
pnpm check
pnpm evals
pnpm test

# 6. Open a pull request — use the template and fill every section
```

All three checks must pass and appear in the PR test evidence section before a review begins.

---

## Eval Report

To see a detailed markdown report of eval results:

```bash
EVAL_REPORT=1 pnpm evals
# Report written to evals/reports/latest.md
```

---

## Branch Protection

The `main` branch is protected:

- Direct pushes are blocked
- 1 approving review is required
- CODEOWNERS review is required for safety-critical paths
- CI (`pnpm check`, `pnpm build`, `pnpm evals`, `pnpm test`) must pass
- Branch must be up to date with `main` before merge
- Force pushes are blocked

Merged branches are auto-deleted. Keep your branches short-lived and focused.
