# Release Process

**Copyright (c) 2026 Ascent Partners Foundation. MIT License.**

This document describes the release process for Humanity4AI.

## Branch Model

```
feature/* ──► main  (all contributor work — this is the default branch)
```

All pull requests from contributors target `main`.

## Release Flow

1. All changes merged into `main` via PRs
2. CI must be green on `main`
3. Bump version in `mcp-servers/package.json`
4. Create a GitHub Release with release notes from `CHANGELOG.md`
5. Publish to npm: `pnpm --filter @humanity4ai/mcp-servers publish`

## Hotfixes

Hotfixes follow the same flow: branch from `main`, fix, PR back to `main`.
