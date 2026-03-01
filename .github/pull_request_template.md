## Summary

<!-- One paragraph describing what this PR does and why -->

## Contribution Type

- [ ] New skill
- [ ] Scenario addition to existing skill
- [ ] Bug fix (eval harness, MCP server, schemas)
- [ ] MCP action addition or update
- [ ] Documentation
- [ ] Integration adapter
- [ ] Other: <!-- describe -->

## Impact Area

- [ ] `skills/` — one or more skill packs
- [ ] `mcp-servers/` — contracts, schemas, or handlers
- [ ] `evals/` — eval harness or fixtures
- [ ] `docs/` — documentation
- [ ] `.github/` — workflows or templates
- [ ] `site/` — GitHub Pages landing site

## Test Evidence

<!-- Paste full output of the commands below. Do not skip this section. -->

```
$ pnpm check
...

$ pnpm evals
...

$ pnpm test
...
```

## Safety Checklist

- [ ] No clinical diagnosis, treatment plans, or medical advice content
- [ ] No legal advice content
- [ ] Safety boundaries are explicit in all modified `skill.yaml` files
- [ ] Safety-critical skills (`supportive-conversation`, `grief-loss-support`, `depression-sensitive-content`) include escalation language in boundaries
- [ ] Crisis-adjacent content routes to professional resources, not AI responses

## Quality Checklist

- [ ] `pnpm check` passes (TypeScript)
- [ ] `pnpm evals` passes (all 11 gates)
- [ ] `pnpm test` passes (all tests)
- [ ] New skills have at least 10 scenarios
- [ ] Provenance and license metadata included in `skill.yaml`
- [ ] `CHANGELOG.md` updated for modified skills

## MCP Checklist (if adding/modifying MCP action)

- [ ] `mcp-servers/schemas/<skill>.input.json` updated or created
- [ ] `mcp-servers/schemas/<skill>.output.json` updated or created
- [ ] `mcp-servers/src/index.ts` contract registry updated
- [ ] `pnpm --filter @humanity4ai/mcp-servers build:contracts` run
- [ ] Handler implemented in `mcp-servers/src/handlers.ts`
- [ ] `skills/index.yaml` updated

## Self-Certification

By opening this PR I confirm:

- This contribution does not introduce content that could be mistaken for clinical, medical, or legal advice
- I have read `CONTRIBUTING.md` and `SECURITY.md`
- The content is original or properly attributed with a compatible license
