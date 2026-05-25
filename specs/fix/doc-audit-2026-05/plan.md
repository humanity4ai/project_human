# Technical Plan: Documentation Audit Fixes

## Spec Reference
Implements: `specs/fix/doc-audit-2026-05/spec.md`

## Architecture Overview

Two documentation files are critically broken: `docs/worked-example.md` (entirely
uses removed NDJSON protocol) and `INSTALL.md` (5 stale references to legacy
message format). One minor fix in `docs/protocol.md`. No code changes needed —
all handlers verified correct.

## Files to Fix

| File | Issues | Severity |
|------|--------|----------|
| `docs/worked-example.md` | 7 issues: wrong command, wrong startup banner, all 10 examples use removed protocol, wrong response description, wrong checklist | Critical |
| `INSTALL.md` | 5 issues: wrong startup banner, steps 5+6 use legacy format, Docker section legacy, verify checklist legacy | Critical |
| `docs/protocol.md` | 1 issue: server name mismatch | Low |

## Rewrite Strategy

### worked-example.md — Full Rewrite

Replace every `{"type":"invoke","payload":{...}}` example with actual MCP
JSON-RPC 2.0 `tools/call` format. Replace `list_actions` with `tools/list`.
Replace `pnpm start:mcp` with `pnpm start`. Update startup banner to match
actual server output. Update checklist terminology.

Before (broken):
```json
{"id":"wcag-1","type":"invoke","payload":{"action":"wcagaaa_check","input":{...}}}
```

After (correct):
```json
{"jsonrpc":"2.0","id":"wcag-1","method":"tools/call","params":{"name":"wcagaaa_check","arguments":{...}}}
```

### INSTALL.md — Targeted Fixes

Update steps 5-6 and the verify checklist, plus Docker section. Update startup
banner text to match reality.

### protocol.md — Line Fix

Change `"humanity4ai-mcp"` to `"humanity4ai"` in the initialize response example.

## Verification

After fixes, every command and JSON example in the docs must be copy-paste
runnable against a running MCP server in the correct protocol.

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| MCP SDK changes protocol format | Low | Medium | All examples use stable MCP JSON-RPC 2.0 spec |
| Server startup banner changes again | Low | Low | Keep docs generic (describe format, not exact text) or sync when VERSION changes |

## Out of Scope

- No code changes
- No handler or server changes
- No schema changes
