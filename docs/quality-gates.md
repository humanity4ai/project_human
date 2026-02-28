# Quality Gates

## Gate 1: Skill Completeness

- Required files exist
- At least 10 scenarios are defined
- Rubric includes core dimensions

## Gate 2: Contract Consistency

- `skill.yaml` action id matches `mcp-servers` contract action
- Input/output schema paths are aligned
- JSON schema files are parseable

## Gate 3: Safety and Boundaries

- Skill boundaries are explicit and non-empty
- Sensitive skills include non-clinical and escalation constraints

## Gate 4: Release Readiness

- `pnpm check` passes
- `pnpm evals` passes
- Release notes updated
