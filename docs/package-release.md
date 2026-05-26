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

- `1.0.x` for stable releases with full MCP runtime
- `1.1.x` once platform adapters stabilize
