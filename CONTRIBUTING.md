# Contributing

**Copyright (c) 2026 Ascent Partners Foundation. MIT License.**

Thanks for contributing to Humanity4AI. This guide covers all contribution types.

---

## Contribution Types

- New skill proposals
- Scenario additions and improvements
- Rubric improvements
- MCP schema or handler additions
- Documentation and translations
- Bug fixes in the eval harness or server

---

## Prerequisites

```bash
node --version   # >= 20
pnpm --version   # >= 10
```

---

## Required artifacts for a new skill

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

## Adding a new MCP action

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
  // Extract and use typed inputs — never echo raw input
  const myField = str(input, "my_field", "default");

  return {
    ok: true,
    data: {
      action: "your_action_id",
      boundaryNotice,
      uncertainty: "medium",
      assumptions: ["List assumptions here"],
      output: {
        // Match your output JSON schema
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

## Safety and provenance

- Declare source provenance in `skill.yaml`
- Include explicit boundaries and non-goals
- Do not submit clinical diagnosis, treatment plans, or legal advice playbooks
- Safety-critical skills (`supportive-conversation`, `grief-loss-support`, `depression-sensitive-content`) require escalation language in boundaries

---

## Workflow

```bash
# 1. Fork and create a branch
git checkout -b add-my-skill

# 2. Copy the template
cp -r templates/skill skills/my-skill-name

# 3. Implement your changes
# ... edit skill files, add handler, add schemas ...

# 4. Regenerate contracts if you added a new action
pnpm --filter @humanity4ai/mcp-servers build:contracts

# 5. Run all checks
pnpm check
pnpm evals

# 6. Open a pull request
```

All checks must pass before a PR is reviewed.

---

## Eval report

To see a detailed markdown report of eval results:

```bash
EVAL_REPORT=1 pnpm evals
# Report written to evals/reports/latest.md
```
