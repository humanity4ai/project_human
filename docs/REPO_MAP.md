# Repo Map and Naming Conventions

## Directories

| Directory | Purpose |
|-----------|---------|
| `knowledge-core/` | Canonical principles, taxonomy, and uncertainty schema |
| `skills/` | 10 launch skill packs |
| `mcp-servers/` | MCP action contracts, JSON schemas, and runtime server |
| `evals/` | Baseline evaluation harness |
| `templates/` | Contributor skill template |
| `docs/` | Integration guides, quality gates, contributor docs |
| `site/` | GitHub Pages static landing site |
| `marketing/` | Launch assets and outreach templates |
| `.github/` | CI workflows, CODEOWNERS, issue templates |

## Naming Rules

- Skill repo/folder names use kebab-case.
- Action IDs use snake_case.
- Schema files follow `<skill>.(input|output).json`.
- Skill versions follow semantic versioning.
