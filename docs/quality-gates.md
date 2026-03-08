# Quality Gates

The evaluation harness runs **11 automated checks** — one for each of the 10 skills plus contract consistency.

## Gates 1-10: Skill Completeness (per skill)

For each skill in `skills/`:

| Check | Description |
|-------|-------------|
| Required files | `SKILL.md`, `skill.yaml`, `rubric.md`, `scenarios/scenarios.yaml`, `CHANGELOG.md`, `LICENSE` all exist |
| Scenarios | At least 10 scenarios defined in `scenarios/scenarios.yaml` |
| Rubric dimensions | Must include: Helpfulness, Humility, Harm avoidance, Clarity |
| skill.yaml valid | Passes Zod schema validation |
| Name match | `skill.yaml.name` matches the folder name |
| Category valid | `skill.yaml.category` is a valid taxonomy slug |

## Gate 11: Contract Consistency

| Check | Description |
|-------|-------------|
| Skill coverage | Every skill has a matching entry in the contract registry |
| Action IDs match | Action IDs in `skill.yaml` match the contract registry |
| Schema paths | Input/output schema paths are consistent between `skill.yaml` and contracts |
| Schemas valid | All referenced JSON schema files exist and are valid JSON |

## Safety-Critical Skills

These 3 skills require additional escalation language in boundaries:

- `supportive-conversation`
- `grief-loss-support`
- `depression-sensitive-content`

For safety-critical skills, `skill.yaml.boundaries` must include escalation language.

## Running the Gates

```bash
# Run all quality gates
pnpm evals

# Generate detailed markdown report
EVAL_REPORT=1 pnpm evals
# Report written to: evals/reports/latest.md
```

## Expected Output

```
PASS  age-inclusive-design
PASS  cognitive-accessibility
PASS  conflict-de-escalation
PASS  cultural-sensitivity
PASS  depression-sensitive-content
PASS  empathetic-communication
PASS  grief-loss-support
PASS  neurodiversity-aware-design
PASS  supportive-conversation
PASS  wcag-aaa-accessibility
PASS  contract-consistency

All 11 checks passed.
```
