# Worked Example: End-to-End Integration

**Copyright (c) 2026 Ascent Partners Foundation. MIT License.**

This guide walks through a complete integration from install to invoking all 9 skill actions.

---

## Step 1: Install

```bash
git clone https://github.com/humanity4ai/project_human.git
cd project_human
pnpm install
pnpm check
pnpm evals
```

All 10 checks should pass.

---

## Step 2: Start the server

```bash
pnpm start
```

You will see on stderr:

```
Humanity4AI MCP Server v1.0.6 (JSON-RPC 2.0)
Tools: 9 registered
Transport: stdio (MCP SDK)
Ready — waiting for MCP client connections
```

---

## Step 3: Discover available actions

In a second terminal:

```bash
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' \
  | pnpm --filter @humanity4ai/mcp-servers exec tsx src/mcp-server.ts
```

Response: a JSON array of 9 action contracts

---

## Step 4: Invoke each action

### 4.1 WCAG Accessibility Audit

```bash
echo '{"jsonrpc":"2.0","id":"a11y-1","method":"tools/call","params":{"name":"accessibility_audit","arguments":{"mode":"session","level":"AA"}}}' \
  | pnpm --filter @humanity4ai/mcp-servers exec tsx src/mcp-server.ts
```

Returns: WCAG 2.2 checklist for AA level with criteria IDs, titles, and implementation guidance. Use `mode: "crawl"` with `pages: [{url, html}]` for per-page scoring.

---

### 4.2 Depression-Sensitive Content

```bash
echo '{"jsonrpc":"2.0","id":"dsc-1","method":"tools/call","params":{"name":"rewrite_depression_sensitive_content","arguments":{"text":"You failed to complete your application. You must try again.","mode":"rewrite"}}}' \
  | pnpm --filter @humanity4ai/mcp-servers exec tsx src/mcp-server.ts
```

Returns: `result` (rewritten text), `safety_flags[]`, `review_recommended`.

---

### 4.3 Supportive Conversation

```bash
echo '{"jsonrpc":"2.0","id":"sc-1","method":"tools/call","params":{"name":"supportive_reply","arguments":{"message":"I feel overwhelmed and stuck","risk_level":"medium"}}}' \
  | pnpm --filter @humanity4ai/mcp-servers exec tsx src/mcp-server.ts
```

Returns: `reply`, `escalation_guidance[]`, `boundaries_notice`.

---

### 4.4 Cognitive Accessibility Audit

```bash
echo '{"jsonrpc":"2.0","id":"ca-1","method":"tools/call","params":{"name":"cognitive_accessibility_audit","arguments":{"content":"Please complete all required fields in the form below. Pursuant to our terms, you must notwithstanding any prior agreements submit the form within 24 hours.","target_context":"insurance claim form"}}}' \
  | pnpm --filter @humanity4ai/mcp-servers exec tsx src/mcp-server.ts
```

Returns: `findings[]`, `recommendations[]`.

---

### 4.5 Cultural Sensitivity

```bash
echo '{"jsonrpc":"2.0","id":"cs-1","method":"tools/call","params":{"name":"cultural_context_check","arguments":{"message":"Hey guys, last chance to sign up before the deadline!","audience":"enterprise customers","region":"Japan"}}}' \
  | pnpm --filter @humanity4ai/mcp-servers exec tsx src/mcp-server.ts
```

Returns: `adapted_message`, `notes[]`, `uncertainty`.

---

### 4.6 Conflict De-escalation

```bash
echo '{"jsonrpc":"2.0","id":"cde-1","method":"tools/call","params":{"name":"deescalation_plan","arguments":{"situation":"Customer is angry about a billing dispute and threatening to escalate publicly","intensity":"high"}}}' \
  | pnpm --filter @humanity4ai/mcp-servers exec tsx src/mcp-server.ts
```

Returns: `plan[]` (step-by-step), `risk_notes[]`.

---

### 4.7 Empathetic Communication

```bash
echo '{"jsonrpc":"2.0","id":"ec-1","method":"tools/call","params":{"name":"empathetic_reframe","arguments":{"message":"We cannot process your refund. As per our policy you should have submitted within 30 days.","tone":"warm"}}}' \
  | pnpm --filter @humanity4ai/mcp-servers exec tsx src/mcp-server.ts
```

Returns: `reframed_message`, `rationale[]`, `escalation_guidance[]`.

---

### 4.8 Neurodiversity-Aware Design

```bash
echo '{"jsonrpc":"2.0","id":"nd-1","method":"tools/call","params":{"name":"neurodiversity_design_check","arguments":{"ui_description":"A multi-step form with animated progress bar, real-time validation alerts, and auto-playing tutorial video","focus":["adhd","sensory"]}}}' \
  | pnpm --filter @humanity4ai/mcp-servers exec tsx src/mcp-server.ts
```

Returns: `recommendations[]`, `tradeoffs[]`.

---

### 4.9 Age-Inclusive Design

```bash
echo '{"jsonrpc":"2.0","id":"aid-1","method":"tools/call","params":{"name":"age_inclusive_design_check","arguments":{"flow_description":"Online banking password reset flow with CAPTCHA and SMS verification","age_groups":["older adults","seniors"]}}}' \
  | pnpm --filter @humanity4ai/mcp-servers exec tsx src/mcp-server.ts
```

Returns: `recommendations[]`, `access_notes[]`.

---

## Step 5: Handle errors

Input validation errors return `ok: false`:

```bash
echo '{"jsonrpc":"2.0","id":"err-1","method":"tools/call","params":{"name":"supportive_reply","arguments":{}}}' \
  | pnpm --filter @humanity4ai/mcp-servers exec tsx src/mcp-server.ts
```

Response:

```json
{"id":"err-1","ok":false,"error":"Input validation failed for action 'supportive_reply': Required field 'message' is missing or empty; Required field 'risk_level' is missing or empty"}
```

---

## Step 6: Integration checklist

Before going live with any integration:

- [ ] Confirm `tools/list` returns 9 tools
- [ ] Test each action with a valid input — confirm `ok: true`
- [ ] Test each action with missing required fields — confirm `ok: false` with descriptive error
- [ ] Verify `boundaryNotice` is displayed or logged for all sensitive skill actions
- [ ] Verify `escalation_guidance` is surfaced to users when returned (supportive, empathetic handlers)
- [ ] Confirm `uncertainty` level is disclosed to users where relevant
