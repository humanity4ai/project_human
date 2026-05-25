# Task List: Documentation Audit Fixes

## Plan Reference
Implements: `specs/fix/doc-audit-2026-05/plan.md`

## Tasks

### Setup

- [ ] **TASK-001** [S] Verify exact server startup banner text
  - Run server, capture stderr output verbatim
  - Compare with claims in INSTALL.md and worked-example.md
  - Depends on: none

- [ ] **TASK-002** [S] Verify server name in code
  - Read `mcp-server.ts` line 177 for `name` value
  - Compare with `protocol.md` line 32
  - Depends on: none

### Epic 1: Fix worked-example.md

- [ ] **TASK-003** [M] Rewrite Step 2 (server start) in worked-example.md
  - Command: `pnpm start` (was `pnpm start:mcp`)
  - Startup banner: match actual server output from TASK-001
  - Lines: ~23-37
  - Depends on: TASK-001

- [ ] **TASK-004** [M] Rewrite Step 3 (discovery) in worked-example.md
  - Use MCP `tools/list` format instead of legacy `list_actions`
  - Use `initialize` request first, then `tools/list`
  - Update response description (remove `inputSchemaPath`/`outputSchemaPath` claims)
  - Lines: ~38-50
  - Depends on: TASK-001

- [ ] **TASK-005** [L] Rewrite Step 4 (all 10 invocation examples) in worked-example.md
  - Replace ALL `{"type":"invoke","payload":{...}}` with MCP `tools/call` format
  - Keep same input data, just change the message envelope
  - Lines: ~52-247 (10 sections × ~15 lines each)
  - Depends on: TASK-001

- [ ] **TASK-006** [S] Rewrite Step 5 (error handling) in worked-example.md
  - Replace legacy format with MCP `tools/call` with empty args
  - Lines: ~249-270
  - Depends on: TASK-001

- [ ] **TASK-007** [S] Update Step 6 (integration checklist) in worked-example.md
  - Replace `list_actions` with `tools/list`
  - Lines: ~273-282
  - Depends on: none

### Epic 2: Fix INSTALL.md

- [ ] **TASK-008** [S] Update startup banner text in INSTALL.md
  - Change `"Actions: 10 registered"` → `"Tools: 10 registered"`
  - Match actual output from TASK-001
  - Lines: ~58-64
  - Depends on: TASK-001

- [ ] **TASK-009** [M] Rewrite Step 5 (list actions) in INSTALL.md
  - Replace `{"id":"1","type":"list_actions"}` with MCP `tools/list`
  - Include `initialize` request first for completeness
  - Lines: ~66-76
  - Depends on: TASK-001

- [ ] **TASK-010** [M] Rewrite Step 6 (invoke skill) in INSTALL.md
  - Replace `{"type":"invoke","payload":{...}}` with MCP `tools/call`
  - Lines: ~77-83
  - Depends on: TASK-001

- [ ] **TASK-011** [S] Fix Docker section in INSTALL.md
  - Replace legacy `list_actions` format with MCP format
  - Lines: ~100-108
  - Depends on: TASK-001

- [ ] **TASK-012** [S] Fix verify checklist in INSTALL.md
  - Replace legacy `list_actions` with MCP `tools/list` + `initialize`
  - Lines: ~197-206
  - Depends on: TASK-001

### Epic 3: Fix protocol.md

- [ ] **TASK-013** [S] Fix server name in protocol.md
  - Change `"humanity4ai-mcp"` → `"humanity4ai"` on line 32
  - Depends on: TASK-002

### Verification

- [ ] **TASK-014** [M] Verify every example is copy-paste runnable
  - For each JSON example in the 3 files: confirm message format matches MCP spec
  - Confirm no legacy `list_actions` or `invoke`/`payload` remains
  - Depends on: all above tasks

## Legend
- `[S]` Small — under 1 hour
- `[M]` Medium — 1–3 hours
- `[L]` Large — 3–6 hours

## Task Summary

| ID | Epic | Size | Description |
|----|------|------|-------------|
| 001 | Setup | S | Verify actual server startup banner |
| 002 | Setup | S | Verify server name in code |
| 003 | E1 | M | Fix worked-example Step 2 |
| 004 | E1 | M | Fix worked-example Step 3 |
| 005 | E1 | L | Fix worked-example Step 4 (10 examples) |
| 006 | E1 | S | Fix worked-example Step 5 |
| 007 | E1 | S | Fix worked-example Step 6 |
| 008 | E2 | S | Fix INSTALL startup banner |
| 009 | E2 | M | Fix INSTALL Step 5 |
| 010 | E2 | M | Fix INSTALL Step 6 |
| 011 | E2 | S | Fix INSTALL Docker section |
| 012 | E2 | S | Fix INSTALL verify checklist |
| 013 | E3 | S | Fix protocol.md server name |
| 014 | Verify | M | Verify all examples runnable |

**Total:** 14 tasks. 9× S, 4× M, 1× L.
