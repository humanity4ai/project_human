# Governance

## Governance Model

Humanity4AI uses an open governance model with a core maintainer team and open public contributions.

- Core maintainers approve standards, safety policy, and release gates.
- Community contributors can propose skills, scenarios, and rubric improvements by pull request.
- Decisions are recorded in repo issues and pull requests for traceability.

## Maintainers

See `MAINTAINERS.md` for the current maintainer list. Safety-critical changes require at least two maintainer approvals as listed there.

## Decision Policy

- Safety and boundary changes require at least two maintainer approvals (see `MAINTAINERS.md`).
- New skills require template compliance, provenance declaration, and rubric coverage.
- Breaking schema changes require a version bump and migration note.
- Security and safety reports must follow `SECURITY.md` — do not open public issues.
- Manifesto-related changes must link to a rationale issue/PR and map to `docs/manifesto-roadmap-map.md`.

## Release Policy

- Semantic versioning is required for skills and schemas.
- `v0.x` releases are rapid iteration releases.
- Every release includes changelog, known limitations, and safety notes.

## Content Boundaries

- Support-oriented skills are non-clinical and non-diagnostic.
- Harmful, discriminatory, or coercive content is not accepted.
- Uncertainty and context limits must be declared for claims with contested interpretations.

## Manifesto Evolution

- The canonical manifesto is maintained in `docs/manifesto.md`.
- Manifesto text updates require maintainer review and a traceable rationale in GitHub issues or PRs.
- Principle-level implementation changes should update `docs/manifesto-roadmap-map.md`.
