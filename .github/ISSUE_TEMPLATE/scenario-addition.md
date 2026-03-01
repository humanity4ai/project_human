---
name: Scenario Addition
about: Add new test scenarios to an existing skill
title: "[Scenarios]: <skill-name>"
labels: ["needs-scenarios", "help wanted"]
---

## Skill Name

<!-- Which skill are these scenarios for? e.g. supportive-conversation -->

## New Scenarios

<!-- List each scenario in the format used in scenarios/scenarios.yaml -->
<!-- Minimum 5 new scenarios per submission -->

```yaml
scenarios:
  - id: xx-01
    prompt: Describe the scenario here
  - id: xx-02
    prompt: Describe the scenario here
```

## Why These Scenarios Matter

<!-- What gaps do these scenarios cover? Edge cases? Cultural contexts? -->

## Safety Check

- [ ] Scenarios do not request or imply clinical diagnosis or treatment
- [ ] Scenarios for sensitive skills include appropriate escalation context where needed
- [ ] Scenarios represent realistic, respectful user situations

## Test Evidence

<!-- Paste output of `pnpm evals` after adding these scenarios -->

```
PASS  skill-name
All N checks passed.
```
