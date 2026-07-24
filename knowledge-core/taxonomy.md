# Humanity4AI Taxonomy

> **Canonical slugs** for programmatic consumption: `knowledge-core/taxonomy.ts`.  
> This file is the human-readable reference; `taxonomy.ts` exports `CATEGORY_SLUGS` and `ESCALATION_REQUIRED_SKILLS`.  
> Changes to categories require updating **both** files.

## Launch Categories

Each category has a display name and a canonical kebab-case slug for use in `skill.yaml`.

| # | Display Name | Slug (`category` field) | Assigned skills |
|---|-------------|------------------------|-----------------|
| 1 | Accessibility | `accessibility` | accessibility |
| 2 | Emotional Safety | `emotional-safety` | depression-sensitive-content, supportive-conversation |
| 3 | Communication | `communication` | empathetic-communication |
| 4 | Cognitive Support | `cognitive-support` | cognitive-accessibility |
| 5 | Cultural Context | `cultural-context` | cultural-sensitivity |
| 6 | Conflict Navigation | `conflict-navigation` | conflict-de-escalation |
| 7 | Inclusive Design | `inclusive-design` | (available for new skills) |
| 8 | Lifecycle Support | `lifecycle-support` | (available for new skills) |
| 9 | Neurodiversity | `neurodiversity` | neurodiversity-aware-design |
| 10 | Age Inclusion | `age-inclusion` | age-inclusive-design |

## Expansion Rules

- New categories must define clear boundaries and target outcomes.
- New categories must include a compatibility map with existing categories.
- Category additions require governance approval and versioned changelog entry.
