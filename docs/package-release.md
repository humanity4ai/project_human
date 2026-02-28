# Package Release Guide

This project can publish `@humanity4ai/mcp-servers` as a reusable package.

## Why publish

- Faster adoption for integrators
- Versioned contract/runtime compatibility
- Easier downstream dependency management

## Release Steps

1. Build and validate:

```bash
pnpm check
pnpm evals
pnpm --filter @humanity4ai/mcp-servers build
```

2. Inspect tarball:

```bash
pnpm --filter @humanity4ai/mcp-servers pack
```

3. Publish from trusted CI or maintainer machine:

```bash
pnpm --filter @humanity4ai/mcp-servers publish --access public
```

## Versioning

- Use semver for package versions.
- Bump minor for backward-compatible features.
- Bump major for contract or runtime breaking changes.

## Suggested first package line

- `0.1.x` for contract-first early adopters
- `0.2.x` once platform adapters stabilize
