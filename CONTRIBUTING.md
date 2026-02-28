# Contributing

Thanks for contributing to Humanity4AI.

## Contribution Types

- New skill proposals
- Scenario additions
- Rubric improvements
- MCP schema updates
- Documentation and translations

## Required Checks for New Skills

Every skill must include:

- `SKILL.md`
- `skill.yaml`
- `rubric.md`
- `scenarios/scenarios.yaml` with at least 10 scenarios
- `CHANGELOG.md`
- `LICENSE` (or inherited project license statement)

## Safety and Provenance

- Declare source provenance in `skill.yaml`.
- Include explicit boundaries and non-goals.
- Do not submit clinical diagnosis, treatment plans, or legal advice playbooks.

## Workflow

1. Fork and create a branch.
2. Implement changes using templates in `templates/skill/`.
3. Run checks:

```bash
pnpm check
pnpm evals
```

4. Open a pull request using the project template.
