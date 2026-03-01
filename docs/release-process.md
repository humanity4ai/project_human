# Release Process

**Copyright (c) 2026 Ascent Partners Foundation. MIT License.**

This document describes how changes in `development` are promoted to `main` as a versioned release.

---

## Branch Model

```
feature/* ──► development  (integration branch — all contributor work)
                  │
                  ▼  planned release PRs only
                main  (stable, production-ready)
```

All contributor PRs target `development`. Only `@simonplmak-cloud` and `@humanity4ai` may open PRs targeting `main`.

---

## Who Can Release

| Actor | Can open `development → main` PR | Can merge |
|-------|----------------------------------|-----------|
| `@simonplmak-cloud` | Yes | Yes (with approval) |
| `@humanity4ai` | Yes | Yes (with approval) |
| Community contributors | No — PRs to `main` are blocked | No |

---

## When to Release

A release should be promoted to `main` when:

- [ ] All planned milestone items are merged into `development`
- [ ] CI is green on `development` (`validate` job passes)
- [ ] No open `safety-review` labelled PRs in `development`
- [ ] `RELEASE_NOTES.md` is updated with highlights and known limitations
- [ ] Version fields in `mcp-servers/package.json` are bumped appropriately

---

## Promotion Checklist

### 1. Verify `development` is stable

```bash
git checkout development
git pull origin development
pnpm check
pnpm evals
pnpm test
```

All must pass locally before opening the promotion PR.

### 2. Bump version (if package release)

```bash
# In mcp-servers/package.json — update "version" field
# Follow semver: patch for fixes, minor for new features, major for breaking changes
pnpm --filter @humanity4ai/mcp-servers build:contracts
pnpm --filter @humanity4ai/mcp-servers build
```

### 3. Update RELEASE_NOTES.md

Add a new section at the top:

```markdown
## vX.Y.Z — YYYY-MM-DD

### Highlights
- ...

### Skills added or updated
- ...

### Known limitations
- ...
```

Commit these changes to `development` and confirm CI is still green.

### 4. Open the promotion PR

```bash
gh pr create \
  --base main \
  --head development \
  --title "Release vX.Y.Z" \
  --body "Promotes development to main for vX.Y.Z release. See RELEASE_NOTES.md."
```

Or open via GitHub UI: `Compare & pull request` from `development` → `main`.

### 5. Wait for CI to re-run

The `validate` CI job re-runs on the promotion PR as a final release gate. Do not merge until it passes.

### 6. Get approval and merge

- One maintainer approval is required
- Both `@simonplmak-cloud` and `@humanity4ai` may approve and merge

### 7. Tag the release

```bash
git checkout main
git pull origin main
git tag vX.Y.Z -m "Release vX.Y.Z"
git push origin vX.Y.Z
```

Or create the release via GitHub:

```bash
gh release create vX.Y.Z \
  --title "Humanity4AI vX.Y.Z" \
  --notes-file RELEASE_NOTES.md
```

### 8. Announce

- Post in the `Announcements` Discussion category: `https://github.com/humanity4ai/project_human/discussions`
- Update the landing page if significant new skills were added

---

## Versioning Policy

| Change type | Version bump |
|-------------|-------------|
| New skills, new scenarios, documentation | Minor (`0.X.0`) |
| Bug fixes, eval improvements, dependency updates | Patch (`0.0.X`) |
| Breaking MCP contract or schema changes | Major (`X.0.0`) |

---

## Emergency Hotfix Process

For critical safety or security fixes that cannot wait for the normal release cycle:

1. Create a hotfix branch from `main` directly: `hotfix/fix-description`
2. Apply the minimal fix
3. Open a PR from `hotfix/*` → `main` (maintainer only)
4. Simultaneously merge the same fix into `development` to keep branches in sync
5. Tag and release immediately after merge
6. Document in `SECURITY.md` or `RELEASE_NOTES.md` as appropriate
