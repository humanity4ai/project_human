# Worked Example: End-to-End Integration

**Copyright (c) 2026 Ascent Partners Foundation. MIT License.**

This guide walks through a complete integration from install to invoking all 10 skill actions.

---

## Step 1: Install

```bash
git clone https://github.com/humanity4ai/project_human.git
cd project_human
pnpm install
pnpm check
pnpm evals
```

All 11 checks should pass.

---

## Step 2: Start the server

```bash
pnpm start:mcp
```

You will see on stderr:

```
Humanity4AI MCP Server v0.1.0
Actions: 10 registered
Protocol: line-delimited JSON (see docs/protocol.md)
Ready — waiting for requests on stdin
```

---

## Step 3: Discover available actions

In a second terminal:

```bash
echo '{"id":"1","type":"list_actions"}' \
  | pnpm --filter @humanity4ai/mcp-servers exec tsx src/server.ts
```

Response: a JSON array of 10 action contracts, each with `skill`, `action`, `inputSchemaPath`, `outputSchemaPath`, `safetyBoundary`.

---

## Step 4: Invoke each action

### 4.1 WCAG AAA Accessibility

```bash
echo '{
  "id":"wcag-1",
  "type":"invoke",
  "payload":{
    "action":"wcagaaa_check",
    "input":{"target":"https://example.com/signup","level":"AAA"}
  }
}' | pnpm --filter @humanity4ai/mcp-servers exec tsx src/server.ts
```

Returns: `findings[]` with severity, issue, and fix for each accessibility problem.

---

### 4.2 Depression-Sensitive Content

```bash
echo '{
  "id":"dsc-1",
  "type":"invoke",
  "payload":{
    "action":"rewrite_depression_sensitive_content",
    "input":{
      "text":"You failed to complete your application. You must try again.",
      "mode":"rewrite"
    }
  }
}' | pnpm --filter @humanity4ai/mcp-servers exec tsx src/server.ts
```

Returns: `result` (rewritten text), `safety_flags[]`, `review_recommended`.

---

### 4.3 Supportive Conversation

```bash
echo '{
  "id":"sc-1",
  "type":"invoke",
  "payload":{
    "action":"supportive_reply",
    "input":{"message":"I feel overwhelmed and stuck","risk_level":"medium"}
  }
}' | pnpm --filter @humanity4ai/mcp-servers exec tsx src/server.ts
```

Returns: `reply`, `escalation_guidance[]`, `boundaries_notice`.

---

### 4.4 Cognitive Accessibility Audit

```bash
echo '{
  "id":"ca-1",
  "type":"invoke",
  "payload":{
    "action":"cognitive_accessibility_audit",
    "input":{
      "content":"Please complete all required fields in the form below. Pursuant to our terms, you must notwithstanding any prior agreements submit the form within 24 hours.",
      "target_context":"insurance claim form"
    }
  }
}' | pnpm --filter @humanity4ai/mcp-servers exec tsx src/server.ts
```

Returns: `findings[]`, `recommendations[]`.

---

### 4.5 Cultural Sensitivity

```bash
echo '{
  "id":"cs-1",
  "type":"invoke",
  "payload":{
    "action":"cultural_context_check",
    "input":{
      "message":"Hey guys, last chance to sign up before the deadline!",
      "audience":"enterprise customers",
      "region":"Japan"
    }
  }
}' | pnpm --filter @humanity4ai/mcp-servers exec tsx src/server.ts
```

Returns: `adapted_message`, `notes[]`, `uncertainty`.

---

### 4.6 Conflict De-escalation

```bash
echo '{
  "id":"cde-1",
  "type":"invoke",
  "payload":{
    "action":"deescalation_plan",
    "input":{
      "situation":"Customer is angry about a billing dispute and threatening to escalate publicly",
      "intensity":"high"
    }
  }
}' | pnpm --filter @humanity4ai/mcp-servers exec tsx src/server.ts
```

Returns: `plan[]` (step-by-step), `risk_notes[]`.

---

### 4.7 Empathetic Communication

```bash
echo '{
  "id":"ec-1",
  "type":"invoke",
  "payload":{
    "action":"empathetic_reframe",
    "input":{
      "message":"We cannot process your refund. As per our policy you should have submitted within 30 days.",
      "tone":"warm"
    }
  }
}' | pnpm --filter @humanity4ai/mcp-servers exec tsx src/server.ts
```

Returns: `reframed_message`, `rationale[]`, `escalation_guidance[]`.

---

### 4.8 Grief and Loss Support

```bash
echo '{
  "id":"gls-1",
  "type":"invoke",
  "payload":{
    "action":"grief_support_response",
    "input":{
      "message":"My colleague just told me their parent passed away",
      "support_mode":"presence"
    }
  }
}' | pnpm --filter @humanity4ai/mcp-servers exec tsx src/server.ts
```

Returns: `reply`, `care_notes[]`, `escalation_guidance[]`.

---

### 4.9 Neurodiversity-Aware Design

```bash
echo '{
  "id":"nd-1",
  "type":"invoke",
  "payload":{
    "action":"neurodiversity_design_check",
    "input":{
      "ui_description":"A multi-step form with animated progress bar, real-time validation alerts, and auto-playing tutorial video",
      "focus":["adhd","sensory"]
    }
  }
}' | pnpm --filter @humanity4ai/mcp-servers exec tsx src/server.ts
```

Returns: `recommendations[]`, `tradeoffs[]`.

---

### 4.10 Age-Inclusive Design

```bash
echo '{
  "id":"aid-1",
  "type":"invoke",
  "payload":{
    "action":"age_inclusive_design_check",
    "input":{
      "flow_description":"Online banking password reset flow with CAPTCHA and SMS verification",
      "age_groups":["older adults","seniors"]
    }
  }
}' | pnpm --filter @humanity4ai/mcp-servers exec tsx src/server.ts
```

Returns: `recommendations[]`, `access_notes[]`.

---

## Step 5: Handle errors

Input validation errors return `ok: false`:

```bash
echo '{
  "id":"err-1",
  "type":"invoke",
  "payload":{
    "action":"supportive_reply",
    "input":{}
  }
}' | pnpm --filter @humanity4ai/mcp-servers exec tsx src/server.ts
```

Response:

```json
{"id":"err-1","ok":false,"error":"Input validation failed for action 'supportive_reply': Required field 'message' is missing or empty; Required field 'risk_level' is missing or empty"}
```

---

## Step 6: Integration checklist

Before going live with any integration:

- [ ] Confirm `list_actions` returns 10 actions
- [ ] Test each action with a valid input — confirm `ok: true`
- [ ] Test each action with missing required fields — confirm `ok: false` with descriptive error
- [ ] Verify `boundaryNotice` is displayed or logged for all sensitive skill actions
- [ ] Verify `escalation_guidance` is surfaced to users when returned (supportive, grief, empathetic handlers)
- [ ] Confirm `uncertainty` level is disclosed to users where relevant
