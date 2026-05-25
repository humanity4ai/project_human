# Documentation Audit & Fixes: User Journey Regression Test

Status: Draft
Version: 1.0
Last updated: 2026-05-25

## Overview

Comprehensive user journey audit of the `humanity4ai/project_human` repository
documentation, followed by programmatic MCP handler validation and regression
testing. Found 12 documentation bugs — the entire `docs/worked-example.md` is
unusable (uses removed legacy NDJSON protocol), `INSTALL.md` has 5 stale
references, and `docs/protocol.md` has a naming mismatch. All 10 handlers
function correctly (204/204 tests pass).

## User Journey Walkthrough Results

| Step | What user does | Expected from docs | Reality | Status |
|------|---------------|-------------------|---------|--------|
| 1 | Reads README | Clear install instructions | Good — links to INSTALL.md | ✅ |
| 2 | `pnpm install` | Dependencies install | Works | ✅ |
| 3 | `pnpm check` | TypeScript passes | Zero errors | ✅ |
| 4 | `pnpm evals` | 11 checks pass | All 11 pass | ✅ |
| 5 | `pnpm start` | Server starts | Starts correctly | ✅ |
| 6 | Follows `worked-example.md` | Sends first request | **BROKEN** — uses removed protocol | ❌ |
| 7 | Uses MCP `tools/list` | Discovers 10 tools | Returns 10 tools | ✅ |
| 8 | Uses MCP `tools/call` | Invokes skills | All 10 return valid output | ✅ |
| 9 | Tests with crisis text | Crisis resources present | Depression/grief/empathetic detect crisis | ✅ |
| 10 | Tests missing fields | Validation errors | Returns `ok: false` with message | ✅ |
| 11 | Tests unknown action | Error response | Returns descriptive error | ✅ |

## Acceptance Criteria

### Epic 1: Fix Stale Documentation [MUST]

#### AC-1.1: worked-example.md uses current protocol [MUST]
Given `docs/worked-example.md` currently uses legacy NDJSON format
  (`{"type":"invoke","payload":{...}}`) that was removed in March 2026
When the document is updated
Then all 10 invocation examples use MCP JSON-RPC 2.0 format
  (`{"jsonrpc":"2.0","method":"tools/call","params":{"name":"...","arguments":{...}}}`)
And the startup command is `pnpm start` (not `pnpm start:mcp`)
And the startup banner text matches actual server output
And the `list_actions` reference is updated to `tools/list`
And the integration checklist uses MCP terminology

#### AC-1.2: INSTALL.md uses current protocol [MUST]
Given `INSTALL.md` steps 5-6 use legacy `list_actions` and `invoke` message types
When the document is updated
Then step 5 uses `initialize` + `tools/list` MCP JSON-RPC 2.0 messages
Then step 6 uses `tools/call` with proper parameters
And the startup banner text matches actual output ("Tools: 10 registered", not "Actions: 10")
And the Docker section also uses MCP format
And the verify checklist step uses correct message format

#### AC-1.3: protocol.md server name matches code [MUST]
Given `docs/protocol.md` line 32 shows `"name":"humanity4ai-mcp"`
When checked against `mcp-server.ts` line 177 (`name: "humanity4ai"`)
Then the protocol doc matches the actual server name

### Epic 2: Handler Validation (Passed — No Fixes Needed) [MUST]

#### AC-2.1: All 10 handlers return `ok: true` with valid inputs [MUST]
Verified: 10/10 passed ✅

#### AC-2.2: Crisis detection works in safety-critical handlers [MUST]
Verified: depression handler detects suicidal text, emits crisis_resources ✅
Verified: empathetic_reframe detects "end my life", emits escalation_guidance ✅
Verified: grief handler includes 988, 741741, IASP in escalation_guidance ✅
Verified: supportive_reply interpolates user message into reply ✅

#### AC-2.3: Input validation returns errors for invalid inputs [MUST]
Verified: missing required field returns `ok: false` ✅
Verified: unknown action returns `ok: false` with descriptive error ✅
Verified: validate.ts returns `valid: false` on missing schema ✅

#### AC-2.4: Full regression test suite passes [MUST]
Verified: 204/204 tests pass ✅
Verified: pnpm check passes ✅
Verified: pnpm evals 11/11 passes ✅

## Documentation Bugs Found (12 total)

| # | File | Line | Issue | Severity |
|---|------|------|-------|----------|
| 1 | `worked-example.md` | 26 | `pnpm start:mcp` doesn't exist → should be `pnpm start` | Critical |
| 2 | `worked-example.md` | 31-36 | Startup banner shows wrong text (references "line-delimited JSON") | Critical |
| 3 | `worked-example.md` | 45-46 | Uses legacy `list_actions` → should use MCP `tools/list` | Critical |
| 4 | `worked-example.md` | 49 | Claims response contains `inputSchemaPath`/`outputSchemaPath` — not in MCP response | High |
| 5 | `worked-example.md` | 58-245 | ALL 10 invocation examples use `{"type":"invoke","payload":...}` — removed protocol | Critical |
| 6 | `worked-example.md` | 255-262 | Error test uses legacy format | Critical |
| 7 | `worked-example.md` | 277 | Checklist uses legacy `list_actions` | High |
| 8 | `INSTALL.md` | 58-64 | Startup banner shows "Actions: 10" → should be "Tools: 10 registered" | Medium |
| 9 | `INSTALL.md` | 71-73 | Step 5 uses legacy `list_actions` format | Critical |
| 10 | `INSTALL.md` | 80-81 | Step 6 uses legacy `invoke`/`payload` format | Critical |
| 11 | `INSTALL.md` | 106-107 | Docker section uses legacy `list_actions` | Critical |
| 12 | `INSTALL.md` | 204 | Verify checklist uses legacy `list_actions` | Critical |
| 13 | `protocol.md` | 32 | Server name `"humanity4ai-mcp"` should be `"humanity4ai"` | Low |

## Out of Scope

- Changing the MCP server implementation
- Adding new features to the site or handlers
- Docker-specific workflow tests
- npm package publish verification

## Non-Functional Requirements

- All doc examples must be copy-paste runnable (tested against actual server)
- Startup banner text must match server output verbatim
- No legacy `list_actions` or `invoke`/`payload` terminology anywhere in docs
