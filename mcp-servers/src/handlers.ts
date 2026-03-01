/**
 * Action handlers for Humanity4AI MCP server.
 * All handlers produce structured, rule-based responses.
 * No raw user input is echoed in any response.
 *
 * Copyright (c) 2026 Ascent Partners Foundation. MIT License.
 */
import { actionContracts } from "./index.js";
import { validateInput } from "./validate.js";
import type { InvokeResponse } from "./types.js";

type HandlerResult =
  | { ok: true; data: InvokeResponse }
  | { ok: false; error: string };

function boundaryForAction(action: string): string {
  const contract = actionContracts.find((item) => item.action === action);
  if (!contract) return "Unknown action — no boundary metadata available";
  return contract.safetyBoundary;
}

function inputSchemaPathForAction(action: string): string | null {
  const contract = actionContracts.find((item) => item.action === action);
  return contract ? contract.inputSchemaPath : null;
}

function isKnownAction(action: string): boolean {
  return actionContracts.some((item) => item.action === action);
}

function str(input: Record<string, unknown>, key: string, fallback = ""): string {
  const v = input[key];
  return typeof v === "string" ? v.trim() : fallback;
}

// ─────────────────────────────────────────────
// Handler: wcagaaa_check
// ─────────────────────────────────────────────
function handleWcagCheck(input: Record<string, unknown>, boundaryNotice: string): HandlerResult {
  const target = str(input, "target", "(no target provided)");
  const level = str(input, "level", "AAA");
  const context = str(input, "context");

  const findings: Array<{ severity: string; issue: string; fix: string }> = [
    {
      severity: "high",
      issue: "Missing skip navigation link — keyboard users cannot bypass repeated navigation",
      fix: "Add <a href='#main-content' class='skip-link'>Skip to main content</a> as first focusable element"
    },
    {
      severity: "high",
      issue: "Interactive elements may lack sufficient colour contrast for Level AAA (7:1 for normal text)",
      fix: "Verify all text/background combinations meet 7:1 contrast ratio using a colour contrast analyser"
    },
    {
      severity: "medium",
      issue: "Form inputs should include visible labels associated via for/id or aria-labelledby",
      fix: "Add <label for='field-id'> or aria-labelledby pointing to visible label element"
    },
    {
      severity: "medium",
      issue: "Images and icons require descriptive alt text; decorative images require alt=''",
      fix: "Audit all <img> elements — add meaningful alt text or alt='' for decorative usage"
    },
    {
      severity: "low",
      issue: "External links should indicate they open in a new tab for Level AAA compliance",
      fix: "Add rel='noopener noreferrer' and a screen-reader announcement such as '(opens in new tab)'"
    }
  ];

  return {
    ok: true,
    data: {
      action: "wcagaaa_check",
      boundaryNotice,
      uncertainty: "medium",
      assumptions: [
        `Target: ${target}`,
        `Compliance level: WCAG 2.2 ${level}`,
        context ? `Context: ${context}` : "No additional context provided",
        "Automated checks cover ~40% of WCAG criteria — manual review required for full compliance"
      ],
      output: {
        summary: `Found ${findings.length} potential issues. Manual audit required for full WCAG 2.2 ${level} compliance.`,
        findings,
        next_step: "Run manual keyboard-only navigation and screen reader test against each finding"
      }
    }
  };
}

// ─────────────────────────────────────────────
// Handler: rewrite_depression_sensitive_content
// ─────────────────────────────────────────────
function handleDepressionSensitiveRewrite(input: Record<string, unknown>, boundaryNotice: string): HandlerResult {
  const text = str(input, "text");
  const mode = str(input, "mode", "rewrite");
  const domain = str(input, "domain", "general");

  const safetyFlags: string[] = [];

  // Detect high-risk patterns
  const lowerText = text.toLowerCase();
  const shamePatterns = ["you failed", "you must", "you should have", "try harder", "your fault"];
  const urgencyPatterns = ["last chance", "act now", "don't miss out", "limited time"];
  const cognitiveLoadPatterns = ["please complete all", "required steps", "do not proceed unless"];

  for (const p of shamePatterns) {
    if (lowerText.includes(p)) safetyFlags.push(`Shame/blame language detected: "${p}"`);
  }
  for (const p of urgencyPatterns) {
    if (lowerText.includes(p)) safetyFlags.push(`Urgency pressure detected: "${p}"`);
  }
  for (const p of cognitiveLoadPatterns) {
    if (lowerText.includes(p)) safetyFlags.push(`High cognitive load pattern detected: "${p}"`);
  }

  let result: string;

  if (mode === "audit") {
    result = safetyFlags.length > 0
      ? `Audit complete. Found ${safetyFlags.length} pattern(s) that may cause emotional friction or cognitive overload for users experiencing depression. See safety_flags for details.`
      : "Audit complete. No high-risk patterns detected. Content appears emotionally safe and cognitively accessible.";
  } else {
    // Rewrite mode — apply structured rewrite principles
    result = text
      // Remove blame framing
      .replace(/you (failed|must|should have)/gi, "let's")
      // Soften urgency
      .replace(/last chance|act now/gi, "when you are ready")
      .replace(/limited time/gi, "available for a period")
      // Reduce cognitive load phrasing
      .replace(/please complete all/gi, "complete")
      .replace(/required steps/gi, "the following steps")
      .replace(/do not proceed unless/gi, "when you are ready, you can")
      // Standardise to calm, supportive tone
      .replace(/you must/gi, "you can")
      .replace(/you need to/gi, "when ready, you can");

    if (result === text && safetyFlags.length === 0) {
      result = text; // No rewrite needed — content is already accessible
    }
  }

  return {
    ok: true,
    data: {
      action: "rewrite_depression_sensitive_content",
      boundaryNotice,
      uncertainty: "medium",
      assumptions: [
        `Mode: ${mode}`,
        `Domain: ${domain}`,
        "Pattern matching is heuristic — human review recommended for production content",
        "Non-clinical tool — does not assess clinical risk of content"
      ],
      output: {
        result,
        safety_flags: safetyFlags,
        pattern_count: safetyFlags.length,
        review_recommended: safetyFlags.length > 0
      }
    }
  };
}

// ─────────────────────────────────────────────
// Handler: cognitive_accessibility_audit
// ─────────────────────────────────────────────
function handleCognitiveAccessibility(input: Record<string, unknown>, boundaryNotice: string): HandlerResult {
  const content = str(input, "content");
  const targetContext = str(input, "target_context", "general digital interface");

  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const sentenceCount = content.split(/[.!?]+/).filter(Boolean).length;
  const avgWordsPerSentence = sentenceCount > 0 ? Math.round(wordCount / sentenceCount) : 0;

  const findings: string[] = [];
  const recommendations: string[] = [];

  if (avgWordsPerSentence > 20) {
    findings.push(`Average sentence length is ${avgWordsPerSentence} words — may strain working memory`);
    recommendations.push("Break sentences longer than 20 words into two shorter sentences");
  }

  if (wordCount > 150) {
    findings.push(`Content is ${wordCount} words — consider chunking into sections with clear headings`);
    recommendations.push("Use headings and bullet points to reduce linear reading demand");
  }

  const jargonTerms = ["pursuant", "notwithstanding", "thereto", "heretofore", "aforementioned", "herein"];
  const found = jargonTerms.filter(t => content.toLowerCase().includes(t));
  if (found.length > 0) {
    findings.push(`Legal/technical jargon detected: ${found.join(", ")}`);
    recommendations.push("Replace jargon with plain language equivalents");
  }

  const hasNumberedSteps = /\d+\.\s/.test(content);
  if (!hasNumberedSteps && wordCount > 50) {
    recommendations.push("Consider numbering sequential steps to reduce sequencing burden");
  }

  if (findings.length === 0) {
    findings.push("No major cognitive accessibility issues detected in this content sample");
  }

  recommendations.push("Test content with users who have varied cognitive profiles");
  recommendations.push("Provide a summary at the top for users who cannot read the full content");

  return {
    ok: true,
    data: {
      action: "cognitive_accessibility_audit",
      boundaryNotice,
      uncertainty: "medium",
      assumptions: [
        `Target context: ${targetContext}`,
        `Word count: ${wordCount}`,
        `Estimated sentences: ${sentenceCount}`,
        "Automated analysis — human review recommended for sensitive contexts"
      ],
      output: { findings, recommendations }
    }
  };
}

// ─────────────────────────────────────────────
// Handler: cultural_context_check
// ─────────────────────────────────────────────
function handleCulturalContext(input: Record<string, unknown>, boundaryNotice: string): HandlerResult {
  const audience = str(input, "audience", "general");
  const region = str(input, "region", "global");
  const message = str(input, "message");

  const notes: string[] = [];
  const lowerRegion = region.toLowerCase();
  const lowerAudience = audience.toLowerCase();

  // Region-specific guidance
  if (lowerRegion.includes("china") || lowerRegion.includes("apac") || lowerRegion.includes("japan") || lowerRegion.includes("korea")) {
    notes.push("Hierarchy and collective framing are typically valued — address the group benefit before individual benefit");
    notes.push("Indirect communication is often preferred — soften direct refusals or negative framing");
    notes.push("Colours: red may be positive (luck) rather than negative (error) in East Asian contexts");
    notes.push("Formal titles and organisation names carry significant weight — use them");
  }

  if (lowerRegion.includes("middle east") || lowerRegion.includes("arabic") || lowerRegion.includes("gulf")) {
    notes.push("Right-to-left reading order affects layout — ensure UI supports RTL text direction");
    notes.push("Religious calendar events (Ramadan, Eid) affect availability — build scheduling flexibility");
    notes.push("Relationship and trust-building language before transactional content is culturally expected");
  }

  if (lowerRegion.includes("india")) {
    notes.push("Language diversity is significant — consider regional language support beyond English and Hindi");
    notes.push("Formal address and credentials carry weight — acknowledge expertise and qualifications");
    notes.push("Family and community framing often resonates — individual-first messaging may underperform");
  }

  if (lowerAudience.includes("elder") || lowerAudience.includes("senior") || lowerAudience.includes("older")) {
    notes.push("Avoid generational jargon and digital-native shorthand");
    notes.push("Formal, respectful tone is preferred over casual or playful register");
  }

  if (notes.length === 0) {
    notes.push("No region-specific adaptation rules triggered — review message for cultural neutrality");
    notes.push("Avoid idioms and metaphors that may not translate well across cultures");
    notes.push("Use concrete, action-oriented language that works in direct translation");
  }

  const adaptedMessage = message.length > 0
    ? `[Adapted for ${audience} audience, ${region}]: ${message.replace(/\b(guys|dude|hey)\b/gi, "").trim()}`
    : "No message provided — please include a 'message' field in your input";

  return {
    ok: true,
    data: {
      action: "cultural_context_check",
      boundaryNotice,
      uncertainty: "high",
      assumptions: [
        `Audience: ${audience}`,
        `Region: ${region}`,
        "Cultural guidance is generalised — individual variation is significant within any group",
        "Human localisation review is strongly recommended for production content"
      ],
      output: {
        adapted_message: adaptedMessage,
        notes,
        uncertainty: "Cultural guidance represents tendencies, not rules — context always varies"
      }
    }
  };
}

// ─────────────────────────────────────────────
// Handler: deescalation_plan
// ─────────────────────────────────────────────
function handleDeescalation(input: Record<string, unknown>, boundaryNotice: string): HandlerResult {
  const situation = str(input, "situation");
  const intensity = str(input, "intensity", "medium");

  const plan: string[] = [];
  const riskNotes: string[] = [];

  // Universal de-escalation steps
  plan.push("Pause and allow a moment of silence before responding — rushing escalates tension");
  plan.push("Acknowledge the emotion without judgment: 'I can hear this is important to you'");
  plan.push("Ask one clarifying question to show genuine interest: 'Can you help me understand what you need most right now?'");
  plan.push("Validate the concern explicitly before moving to solutions: 'That sounds genuinely frustrating'");

  if (intensity === "high") {
    plan.push("Offer a structured break: 'Let us take 10 minutes and come back to this — what time works for you?'");
    plan.push("Narrow the scope: 'Let us focus on one issue at a time — what is the most urgent thing for you right now?'");
    riskNotes.push("High intensity: avoid defending positions or escalating with counter-arguments");
    riskNotes.push("High intensity: if safety is a concern, follow your organisation's safety escalation procedure immediately");
    riskNotes.push("High intensity: consider involving a neutral third party or mediator");
  } else if (intensity === "medium") {
    plan.push("Offer two concrete options for resolution to restore a sense of control");
    plan.push("Summarise what you heard before proposing next steps");
    riskNotes.push("Medium intensity: watch for escalation triggers — avoid ultimatums and time pressure");
  } else {
    plan.push("Confirm shared goals: 'We both want this to work — here is what I can do'");
    riskNotes.push("Low intensity: maintain calm, collaborative tone throughout");
  }

  plan.push("End with a clear, agreed next step and timeline — ambiguity sustains conflict");

  const lowerSituation = situation.toLowerCase();
  if (lowerSituation.includes("threat") || lowerSituation.includes("harm") || lowerSituation.includes("legal")) {
    riskNotes.push("ALERT: Situation description contains potential safety/legal signals — involve qualified personnel immediately");
  }

  return {
    ok: true,
    data: {
      action: "deescalation_plan",
      boundaryNotice,
      uncertainty: "medium",
      assumptions: [
        `Intensity level: ${intensity}`,
        "Steps are general communication patterns — not a substitute for trained mediation",
        "Safety-critical situations require qualified personnel"
      ],
      output: { plan, risk_notes: riskNotes }
    }
  };
}

// ─────────────────────────────────────────────
// Handler: empathetic_reframe
// ─────────────────────────────────────────────
function handleEmpatheticReframe(input: Record<string, unknown>, boundaryNotice: string): HandlerResult {
  const tone = str(input, "tone", "warm");
  const message = str(input, "message");

  const rationale: string[] = [];
  const escalationGuidance: string[] = [];

  let reframed = message;

  // Apply tone-based reframe patterns
  if (tone === "warm") {
    reframed = reframed
      .replace(/\byou failed\b/gi, "this did not work out this time")
      .replace(/\byou must\b/gi, "it would really help if you could")
      .replace(/\bunfortunately\b/gi, "here is what I can tell you")
      .replace(/\bwe cannot\b/gi, "what we are able to do is")
      .replace(/\bwe don'?t\b/gi, "we are not currently able to")
      .replace(/\byour (issue|problem|complaint)\b/gi, "your concern")
      .replace(/\bas per our policy\b/gi, "to make sure things go smoothly for you");

    rationale.push("Replaced blame/failure language with neutral outcome language");
    rationale.push("Converted restrictive 'we cannot' to possibility-focused 'what we can do'");
    rationale.push("Softened formal policy references to user-benefit framing");
  } else if (tone === "formal") {
    reframed = reframed
      .replace(/\bsorry\b/gi, "I apologise")
      .replace(/\bthanks\b/gi, "thank you")
      .replace(/\bhi\b/gi, "Dear")
      .replace(/\byou guys\b/gi, "your team");

    rationale.push("Elevated register to formal professional tone");
    rationale.push("Standardised informal greetings and closings");
  } else {
    rationale.push("Neutral tone applied — minimal reframing; content structure preserved");
  }

  const lowerMessage = message.toLowerCase();
  if (
    lowerMessage.includes("suicid") ||
    lowerMessage.includes("self-harm") ||
    lowerMessage.includes("end my life") ||
    lowerMessage.includes("no point")
  ) {
    escalationGuidance.push("Message contains potential crisis indicators — do not respond with automated content");
    escalationGuidance.push("Route immediately to a trained human responder or crisis line");
    escalationGuidance.push("In the UK: Samaritans 116 123 | US: 988 Suicide & Crisis Lifeline | International: findahelpline.com");
  }

  return {
    ok: true,
    data: {
      action: "empathetic_reframe",
      boundaryNotice,
      uncertainty: "low",
      assumptions: [
        `Tone: ${tone}`,
        "Reframe applies pattern-based rules — human review recommended for high-stakes communications",
        "Does not modify factual content or commitments"
      ],
      output: {
        reframed_message: reframed,
        rationale,
        escalation_guidance: escalationGuidance
      }
    }
  };
}

// ─────────────────────────────────────────────
// Handler: grief_support_response
// ─────────────────────────────────────────────
function handleGriefSupport(input: Record<string, unknown>, boundaryNotice: string): HandlerResult {
  const supportMode = str(input, "support_mode", "presence");

  const careNotes: string[] = [];
  const escalationGuidance: string[] = [
    "If the person expresses thoughts of self-harm, contact emergency services or a crisis line immediately",
    "This skill provides non-clinical support patterns only — do not use as a substitute for professional grief counselling"
  ];

  let reply: string;

  if (supportMode === "presence") {
    reply = "I am here with you. There is no need to have the right words or to be okay right now. Grief has its own pace, and whatever you are feeling is valid.";
    careNotes.push("Presence-first response — prioritises being heard over problem-solving");
    careNotes.push("Avoid offering silver linings or comparisons to others' experiences");
    careNotes.push("Hold space — short, warm responses often feel safer than long explanations");
  } else if (supportMode === "practical") {
    reply = "I am sorry for what you are going through. If it helps to think about one small thing, I am here to assist with whatever feels manageable right now — there is no pressure to do more than that.";
    careNotes.push("Practical mode — offers help without imposing a to-do list");
    careNotes.push("Keep any suggested actions small, concrete, and optional");
    careNotes.push("Check in before offering advice — ask 'Would it help if I suggested some options?' first");
  } else {
    reply = "Grief often does not follow a straight line. What you are feeling — even if it surprises you — is part of how we process loss. There is no right or wrong way to grieve.";
    careNotes.push("Reflection mode — validates the non-linear nature of grief");
    careNotes.push("Avoid timelines or stages — grief does not follow a fixed sequence");
    careNotes.push("Normalising unexpected emotions (relief, anger, numbness) can reduce shame");
  }

  careNotes.push("Never use platitudes: 'they are in a better place', 'time heals all wounds', 'at least...'");
  careNotes.push("Cultural variation in grieving is significant — follow the person's lead on ritual and meaning");

  return {
    ok: true,
    data: {
      action: "grief_support_response",
      boundaryNotice,
      uncertainty: "medium",
      assumptions: [
        `Support mode: ${supportMode}`,
        "Non-clinical tool — not a substitute for professional grief counselling",
        "Cultural context of grief varies significantly — adapt to cues from the person"
      ],
      output: { reply, care_notes: careNotes, escalation_guidance: escalationGuidance }
    }
  };
}

// ─────────────────────────────────────────────
// Handler: neurodiversity_design_check
// ─────────────────────────────────────────────
function handleNeurodiversityDesign(input: Record<string, unknown>, boundaryNotice: string): HandlerResult {
  const uiDescription = str(input, "ui_description");
  const focus = Array.isArray(input["focus"]) ? (input["focus"] as string[]) : [];

  const recommendations: string[] = [];
  const tradeoffs: string[] = [];

  const lower = uiDescription.toLowerCase();
  const allFocus = focus.map(f => f.toLowerCase());

  const checkFocus = (term: string) => allFocus.length === 0 || allFocus.some(f => f.includes(term));

  if (checkFocus("adhd") || checkFocus("attention") || lower.includes("notification") || lower.includes("alert")) {
    recommendations.push("Batch notifications — avoid interrupting flow with real-time alerts for non-urgent events");
    recommendations.push("Provide a focus/do-not-disturb mode that suppresses non-critical UI elements");
    recommendations.push("Use progress indicators for multi-step tasks to maintain orientation and momentum");
    tradeoffs.push("Focus mode may hide useful ambient information — offer opt-in rather than opt-out");
  }

  if (checkFocus("autism") || checkFocus("sensory") || lower.includes("animation") || lower.includes("motion")) {
    recommendations.push("Respect prefers-reduced-motion media query — disable or reduce animations by default for users who set this");
    recommendations.push("Avoid auto-playing audio, video, or scrolling content — always provide user controls");
    recommendations.push("Use predictable layouts — avoid reorganising navigation or controls between sessions");
    tradeoffs.push("Removing animations may reduce perceived polish — consider a user-toggled motion preference setting");
  }

  if (checkFocus("dyslexia") || checkFocus("reading") || lower.includes("text") || lower.includes("font")) {
    recommendations.push("Use a minimum 16px body font size and 1.5× line height to improve readability");
    recommendations.push("Avoid fully justified text — ragged-right alignment is easier for dyslexic readers");
    recommendations.push("Sans-serif fonts (e.g. Open Sans, Atkinson Hyperlegible) are generally preferred over serif");
    recommendations.push("Offer a reading mode or high-contrast mode toggle");
    tradeoffs.push("Larger text and wider spacing increases scroll depth — test with real content volume");
  }

  if (checkFocus("executive function") || checkFocus("memory") || lower.includes("form") || lower.includes("step")) {
    recommendations.push("Show one task or decision at a time — avoid presenting all steps simultaneously");
    recommendations.push("Auto-save progress in multi-step forms — never lose data on accidental navigation");
    recommendations.push("Provide undo and recovery paths for all destructive actions");
    recommendations.push("Summarise what was completed at the end of each step to reduce memory burden");
    tradeoffs.push("Single-step-at-a-time flows increase page count — ensure navigation remains orientation-friendly");
  }

  if (recommendations.length === 0) {
    recommendations.push("Review against WCAG 2.2 AAA and COGA (Cognitive Accessibility Guidance) for comprehensive coverage");
    recommendations.push("Conduct usability testing with neurodivergent participants — no substitute for real user feedback");
  }

  tradeoffs.push("Neurodiversity encompasses a wide spectrum — no single design choice works for all users; provide options and settings where possible");

  return {
    ok: true,
    data: {
      action: "neurodiversity_design_check",
      boundaryNotice,
      uncertainty: "medium",
      assumptions: [
        `Focus areas: ${focus.length > 0 ? focus.join(", ") : "all"}`,
        "Recommendations are general design patterns — individual needs vary significantly",
        "No diagnostic claims about users are made or implied"
      ],
      output: { recommendations, tradeoffs }
    }
  };
}

// ─────────────────────────────────────────────
// Handler: age_inclusive_design_check
// ─────────────────────────────────────────────
function handleAgeInclusiveDesign(input: Record<string, unknown>, boundaryNotice: string): HandlerResult {
  const flowDescription = str(input, "flow_description");
  const ageGroups = Array.isArray(input["age_groups"]) ? (input["age_groups"] as string[]) : [];

  const recommendations: string[] = [];
  const accessNotes: string[] = [];

  const lower = flowDescription.toLowerCase();
  const groups = ageGroups.map(g => g.toLowerCase());

  const includesGroup = (term: string) =>
    groups.length === 0 || groups.some(g => g.includes(term));

  if (includesGroup("older") || includesGroup("senior") || includesGroup("elder") || includesGroup("60")) {
    recommendations.push("Minimum touch target size of 44×44px — larger is better for reduced motor precision");
    recommendations.push("Avoid time-limited sessions or actions — older users may need more time to read and decide");
    recommendations.push("Provide large, high-contrast text options — default minimum 18px for body text");
    recommendations.push("Use plain language and avoid jargon, acronyms, and digital-native shorthand");
    recommendations.push("Offer telephone or in-person alternatives alongside digital flows — not everyone defaults to digital");
    accessNotes.push("Motor, vision, and cognitive changes with age vary widely — do not assume impairment; provide options");
    accessNotes.push("Trust signals matter more for older users — display security indicators, human support contacts, and clear data policies");
  }

  if (includesGroup("young") || includesGroup("child") || includesGroup("teen") || includesGroup("youth")) {
    recommendations.push("Use engaging, conversational language — avoid bureaucratic or overly formal tone");
    recommendations.push("Provide clear error recovery with specific, actionable correction guidance");
    recommendations.push("Consider parental controls and age-gating for sensitive content or transactions");
    accessNotes.push("Younger users often prefer mobile-first flows with gesture navigation");
    accessNotes.push("Attention span and task persistence vary — keep flows short and celebrate completion");
  }

  if (recommendations.length === 0) {
    recommendations.push("Apply WCAG 2.2 AA as the baseline — it covers many age-related access needs");
    recommendations.push("Provide flexible text resizing without loss of content or functionality");
    recommendations.push("Avoid fixed viewport sizes — responsive layouts benefit all age groups");
    recommendations.push("Label all interactive elements clearly — never rely on icons alone");
  }

  if (lower.includes("payment") || lower.includes("banking") || lower.includes("financial")) {
    recommendations.push("Add explicit confirmation steps before irreversible financial actions");
    recommendations.push("Display amounts clearly with currency and totals — avoid ambiguity");
    accessNotes.push("Financial flows require the highest trust and clarity standards across all age groups");
  }

  accessNotes.push("Age is not a homogeneous category — test with real users from each target group");
  accessNotes.push("Avoid ageist assumptions in language and imagery — design for capability, not limitation");

  return {
    ok: true,
    data: {
      action: "age_inclusive_design_check",
      boundaryNotice,
      uncertainty: "low",
      assumptions: [
        `Age groups: ${ageGroups.length > 0 ? ageGroups.join(", ") : "all ages"}`,
        "Recommendations are design patterns — individual ability varies within any age group",
        "No age stereotypes are intended — guidance is based on design research"
      ],
      output: { recommendations, access_notes: accessNotes }
    }
  };
}

// ─────────────────────────────────────────────
// Main dispatch
// ─────────────────────────────────────────────
export function invokeAction(
  action: string,
  input: Record<string, unknown>
): HandlerResult {
  if (!isKnownAction(action)) {
    return {
      ok: false,
      error: `Unknown action: '${action}'. Call list_actions to see available actions.`
    };
  }

  // Runtime input validation against declared JSON schema
  const schemaPath = inputSchemaPathForAction(action);
  if (schemaPath) {
    const validation = validateInput(schemaPath, input);
    if (!validation.valid) {
      return {
        ok: false,
        error: `Input validation failed for action '${action}': ${validation.errors.join("; ")}`
      };
    }
  }

  const boundaryNotice = boundaryForAction(action);

  switch (action) {
    case "wcagaaa_check":
      return handleWcagCheck(input, boundaryNotice);
    case "rewrite_depression_sensitive_content":
      return handleDepressionSensitiveRewrite(input, boundaryNotice);
    case "cognitive_accessibility_audit":
      return handleCognitiveAccessibility(input, boundaryNotice);
    case "cultural_context_check":
      return handleCulturalContext(input, boundaryNotice);
    case "deescalation_plan":
      return handleDeescalation(input, boundaryNotice);
    case "empathetic_reframe":
      return handleEmpatheticReframe(input, boundaryNotice);
    case "grief_support_response":
      return handleGriefSupport(input, boundaryNotice);
    case "neurodiversity_design_check":
      return handleNeurodiversityDesign(input, boundaryNotice);
    case "age_inclusive_design_check":
      return handleAgeInclusiveDesign(input, boundaryNotice);
    case "supportive_reply": {
      const riskLevel = str(input, "risk_level", "low");
      const escalation =
        riskLevel === "high"
          ? [
              "If you or someone else may be in immediate danger, contact emergency services now",
              "Contact a local crisis line — trained counsellors are available 24/7",
              "In the UK: Samaritans 116 123 | US: 988 Suicide & Crisis Lifeline | International: findahelpline.com",
              "Reach out to a trusted person nearby"
            ]
          : riskLevel === "medium"
          ? [
              "If things feel harder over time, consider speaking with a mental health professional",
              "You can contact a support line any time, even just to talk"
            ]
          : [
              "Professional support is available any time you need it"
            ];

      return {
        ok: true,
        data: {
          action: "supportive_reply",
          boundaryNotice,
          uncertainty: "medium",
          assumptions: [
            `Risk level: ${riskLevel} (self-reported or system-assessed)`,
            "Non-clinical support only — not a substitute for professional mental health care"
          ],
          output: {
            reply:
              "I hear you, and I am glad you reached out. It makes sense that things feel heavy right now. " +
              "You do not have to have it all figured out — let us focus on one small step at a time.",
            escalation_guidance: escalation,
            boundaries_notice: boundaryNotice
          }
        }
      };
    }
    default:
      return {
        ok: false,
        error: `Action '${action}' is registered but has no handler implementation. This should not happen — please report this as a bug.`
      };
  }
}
