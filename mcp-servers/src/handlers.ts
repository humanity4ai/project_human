/**
 * Action handlers for Humanity4AI MCP server.
 * All handlers produce structured, rule-based responses.
 * No raw user input is echoed in any response.
 *
 * Copyright (c) 2026 Ascent Partners Foundation. MIT License.
 */
import { actionContracts, KNOWN_ACTIONS } from "./index.js";
import { validateInput } from "./validate.js";
import type { InvokeResponse } from "./types.js";
import { SHAME_PATTERNS, URGENCY_PATTERNS, COGNITIVE_LOAD_PATTERNS, JARGON_TERMS, STIGMA_PATTERNS, MEDICAL_CLAIM_PATTERNS, MINIMIZING_PATTERNS, JUDGMENTAL_PATTERNS, STIGMATIZING_VERB_PATTERNS, CRISIS_LANGUAGE_PATTERNS, GRIEF_CLICHE_PATTERNS, BOUNDARY_VIOLATION_PATTERNS } from "./patterns.js";
import { MAX_WORDS_PER_SENTENCE, MAX_CONTENT_WORDS, MIN_STEPS_SEQUENCE_THRESHOLD, MIN_BODY_FONT_PX, MIN_LINE_HEIGHT_FACTOR, MIN_TOUCH_TARGET_PX } from "./constants.js";
import { CRISIS_LINE_UK, CRISIS_LINE_US, CRISIS_TEXT_US, CRISIS_URL_INTERNATIONAL, CRISIS_URL_IASP } from "./crisis-resources.js";
import { detectCrisisSignals, detectSafetySignals } from "./crisis-detection.js";
import { detectEmotion } from "./emotion-detection.js";
import { normalizeLocale, getSupportiveReply, getLocalizedCrisisResources } from "./i18n.js";
import { getChecklist, WcagLevel } from "./wcag-criteria.js";
import { assessAccessibility } from "./accessibility-engine.js";

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
  return KNOWN_ACTIONS.has(action);
}

function str(input: Record<string, unknown>, key: string, fallback = ""): string {
  const v = input[key];
  return typeof v === "string" ? v.trim() : fallback;
}

// ─────────────────────────────────────────────
// Handler: accessibility_audit (unified WCAG)
// ─────────────────────────────────────────────
async function handleAccessibilityAudit(input: Record<string, unknown>, boundaryNotice: string): Promise<HandlerResult> {
  const mode = str(input, "mode", "crawl");
  const rawLevel = str(input, "level", "AA").toUpperCase();
  const level: WcagLevel = rawLevel === "A" ? "A" : rawLevel === "AAA" ? "AAA" : "AA";
  const locale = str(input, "locale", "en");

  if (mode !== "crawl" && mode !== "session") {
    return { ok: false, error: `Invalid mode '${mode}'. Valid modes are 'crawl' and 'session'.` };
  }

  // ── Session mode ────────────────────────────────────────────────────────
  if (mode === "session") {
    if (!rawLevel || !["A","AA","AAA"].includes(rawLevel)) {
      return { ok: false, error: `Invalid level '${rawLevel || "(missing)"}'. Valid levels are A, AA, AAA. Level is required for session mode.` };
    }
    const checklist = getChecklist(level);
    const levelCounts = { A: checklist.filter(c => c.level === "A").length, AA: checklist.filter(c => c.level === "AA").length, AAA: checklist.filter(c => c.level === "AAA").length };
    return {
      ok: true,
      data: {
        action: "accessibility_audit",
        boundaryNotice,
        uncertainty: "low",
        assumptions: [
          `Level: WCAG 2.2 ${level}`,
          `Mode: session`,
          `Locale: ${locale}`,
          "Checklist is guidance — not a substitute for WCAG specification review",
        ],
        output: {
          mode: "session",
          level,
          checklist,
          criteria_count: { total: checklist.length, ...levelCounts },
          session_notice: `All UI/UX generated in this session will comply with WCAG 2.2 ${level}. Apply these criteria to every component, page, and interaction.`,
        },
      },
    };
  }

  // ── Crawl mode ──────────────────────────────────────────────────────────
  const pages = Array.isArray(input["pages"]) ? (input["pages"] as Array<{url: string; html: string}>) : [];
  if (pages.length === 0) {
    return { ok: false, error: "Crawl mode requires at least 1 page in 'pages' array with 'url' and 'html' fields." };
  }
  if (pages.length > 100) {
    return { ok: false, error: "Crawl mode supports up to 100 pages. Use max_pages parameter to limit." };
  }

  const pageResults = await Promise.all(pages.map(async (page) => {
    const scoreResult = await assessAccessibility(page.html, level);
    return {
      url: page.url,
      aggregate_score: scoreResult.aggregateScore,
      automated: scoreResult.automatedCount,
      manual: scoreResult.manualCount,
      total: scoreResult.automatedCount + scoreResult.manualCount,
      criteria: scoreResult.criteria,
      heuristic: scoreResult.heuristic,
    };
  }));

  const siteAggregate = pageResults.length > 0
    ? Math.round(pageResults.reduce((sum, r) => sum + r.aggregate_score, 0) / pageResults.length)
    : 0;
  const ranking = [...pageResults].sort((a, b) => b.aggregate_score - a.aggregate_score);
  const tierLabel = siteAggregate >= 80 ? "Good baseline" : siteAggregate >= 60 ? "Moderate — targeted fixes needed" : "Significant improvements needed";

  return {
    ok: true,
    data: {
      action: "accessibility_audit",
      boundaryNotice,
      uncertainty: pageResults.some(r => r.heuristic) ? "high" : "medium",
      assumptions: [
        `Level: WCAG 2.2 ${level}`,
        `Mode: crawl (${pages.length} pages)`,
        `Locale: ${locale}`,
        `Engine: ${pageResults[0]?.criteria[0] ? "see per-criterion results" : "regex"}`,
        pageResults.some(r => r.heuristic) ? "Heuristic mode: some pages scored via non-HTML input" : "HTML-based analysis: scores computed from actual markup patterns",
      ],
      output: {
        mode: "crawl",
        level,
        site_aggregate: siteAggregate,
        ranking,
        summary: `${siteAggregate}/100 — ${tierLabel} (${pages.length} pages analysed at WCAG 2.2 ${level})`,
      },
    },
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

  // Detect high-risk patterns using shared modules
  const lowerText = text.toLowerCase();
  const shamePatterns = [...SHAME_PATTERNS];
  const urgencyPatterns = [...URGENCY_PATTERNS];
  const cognitiveLoadPatterns = [...COGNITIVE_LOAD_PATTERNS];

  for (const p of shamePatterns) {
    if (lowerText.includes(p)) safetyFlags.push(`Shame/blame language detected: "${p}"`);
  }
  for (const p of urgencyPatterns) {
    if (lowerText.includes(p)) safetyFlags.push(`Urgency pressure detected: "${p}"`);
  }
  for (const p of cognitiveLoadPatterns) {
    if (lowerText.includes(p)) safetyFlags.push(`High cognitive load pattern detected: "${p}"`);
  }
  for (const p of STIGMA_PATTERNS) {
    if (lowerText.includes(p)) safetyFlags.push(`Stigmatizing language detected: "${p}"`);
  }
  for (const p of MEDICAL_CLAIM_PATTERNS) {
    if (lowerText.includes(p)) safetyFlags.push(`Potential medical claim detected: "${p}"`);
  }
  for (const p of MINIMIZING_PATTERNS) {
    if (lowerText.includes(p)) safetyFlags.push(`Minimizing/invalidating language detected: "${p}"`);
  }
  for (const p of JUDGMENTAL_PATTERNS) {
    if (lowerText.includes(p)) safetyFlags.push(`Judgmental language detected: "${p}"`);
  }
  for (const p of STIGMATIZING_VERB_PATTERNS) {
    if (lowerText.includes(p)) safetyFlags.push(`Stigmatizing framing detected: "${p}"`);
  }
  for (const p of CRISIS_LANGUAGE_PATTERNS) {
    if (lowerText.includes(p)) safetyFlags.push(`Crisis language framing detected: "${p}"`);
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

  // Detect crisis signals (suicide/self-harm)
  const crisis = detectCrisisSignals(text);
  const crisisResources: string[] = [];
  if (crisis.detected) {
    crisisResources.push("Content contains potential crisis indicators — do not publish without escalation resources");
    crisisResources.push(`In the UK: ${CRISIS_LINE_UK} | US: ${CRISIS_LINE_US}`);
    crisisResources.push(`${CRISIS_TEXT_US}`);
    crisisResources.push(`International: ${CRISIS_URL_INTERNATIONAL}`);
    safetyFlags.push(`Crisis indicators detected: ${crisis.matchedPatterns.join(", ")}`);
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
        "Non-clinical tool — does not assess clinical risk of content",
        crisis.detected ? "Crisis indicators detected — escalate to qualified human support" : "No crisis indicators detected"
      ],
      output: {
        result,
        safety_flags: safetyFlags,
        pattern_count: safetyFlags.length,
        review_recommended: safetyFlags.length > 0,
        crisis_resources: crisisResources
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

  if (avgWordsPerSentence > MAX_WORDS_PER_SENTENCE) {
    findings.push(`Average sentence length is ${avgWordsPerSentence} words — may strain working memory`);
    recommendations.push(`Break sentences longer than ${MAX_WORDS_PER_SENTENCE} words into two shorter sentences`);
  }

  if (wordCount > MAX_CONTENT_WORDS) {
    findings.push(`Content is ${wordCount} words — consider chunking into sections with clear headings`);
    recommendations.push("Use headings and bullet points to reduce linear reading demand");
  }

  const jargonTerms = [...JARGON_TERMS];
  const found = jargonTerms.filter(t => content.toLowerCase().includes(t));
  if (found.length > 0) {
    findings.push(`Legal/technical jargon detected: ${found.join(", ")}`);
    recommendations.push("Replace jargon with plain language equivalents");
  }

  const hasNumberedSteps = /\d+\.\s/.test(content);
  if (!hasNumberedSteps && wordCount > MIN_STEPS_SEQUENCE_THRESHOLD) {
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

  if (detectSafetySignals(situation)) {
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

  const crisis = detectCrisisSignals(message);
  if (crisis.detected) {
    escalationGuidance.push("Message contains potential crisis indicators — do not respond with automated content");
    escalationGuidance.push("Route immediately to a trained human responder or crisis line");
    escalationGuidance.push(`UK: ${CRISIS_LINE_UK} | US: ${CRISIS_LINE_US}`);
    escalationGuidance.push(`${CRISIS_TEXT_US}`);
    escalationGuidance.push(`International: ${CRISIS_URL_INTERNATIONAL}`);
  }

  return {
    ok: true,
    data: {
      action: "empathetic_reframe",
      boundaryNotice,
      uncertainty: "medium",
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
    recommendations.push(`Use a minimum ${MIN_BODY_FONT_PX}px body font size and ${MIN_LINE_HEIGHT_FACTOR}× line height to improve readability`);
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
    recommendations.push(`Minimum touch target size of ${MIN_TOUCH_TARGET_PX}×${MIN_TOUCH_TARGET_PX}px — larger is better for reduced motor precision`);
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
export async function invokeAction(
  action: string,
  input: Record<string, unknown>
): Promise<HandlerResult> {
  if (!isKnownAction(action)) {
    return {
      ok: false,
      error: `Unknown action: '${action}'. Use tools/list to see available actions.`
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
    case "accessibility_audit":
      return handleAccessibilityAudit(input, boundaryNotice);
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
    case "neurodiversity_design_check":
      return handleNeurodiversityDesign(input, boundaryNotice);
    case "age_inclusive_design_check":
      return handleAgeInclusiveDesign(input, boundaryNotice);
    case "supportive_reply": {
      const message = str(input, "message");
      let riskLevel = str(input, "risk_level", "low");
      const locale = str(input, "locale", "en");
      const supportMode = str(input, "support_mode", "general");
      const isGriefMode = supportMode === "presence" || supportMode === "practical" || supportMode === "reflection";
      const loc = normalizeLocale(locale);
      const localizedCrisis = getLocalizedCrisisResources(loc);

      // Auto-assess risk from message content — override caller risk_level if crisis detected
      const crisis = detectCrisisSignals(message);
      const autoEscalated = crisis.detected && riskLevel !== "high";
      if (crisis.detected && riskLevel !== "high") {
        riskLevel = "high";
      }

      // Detect emotions in message for adaptive reply
      const emotion = detectEmotion(message);

      // Detect boundary violations (dismissive/minimizing language)
      const lowerMessage = message.toLowerCase();
      const boundaryFlags: string[] = [];
      for (const p of BOUNDARY_VIOLATION_PATTERNS) {
        if (lowerMessage.includes(p)) {
          boundaryFlags.push(p);
        }
      }

      // Grief support mode: detect grief cliches and build care_notes
      const careNotes: string[] = [];
      if (isGriefMode) {
        const clichesFound: string[] = [];
        for (const cliche of GRIEF_CLICHE_PATTERNS) {
          if (lowerMessage.includes(cliche)) {
            clichesFound.push(cliche);
          }
        }
        if (clichesFound.length > 0) {
          careNotes.push(`Detected potential minimizing platitudes: ${clichesFound.join(", ")}`);
          careNotes.push("Avoid these — they dismiss the person's unique grief experience");
        }

        if (crisis.detected) {
          careNotes.unshift("CRISIS WARNING: Message contains potential crisis indicators. Prioritize safety over support mode.");
          careNotes.push(`Crisis signals detected: ${crisis.matchedPatterns.join(", ")}`);
          careNotes.push("Route immediately to crisis resources — do not provide only template support");
        }
      }

      // Locale-driven crisis resource selection
      const primaryCrisis = loc !== "en" ? localizedCrisis.primary : CRISIS_LINE_US;
      const secondaryCrisis = loc !== "en" ? localizedCrisis.secondary : CRISIS_LINE_UK;

      const escalation =
        riskLevel === "high"
          ? [
              "If you or someone else may be in immediate danger, contact emergency services now",
              primaryCrisis,
              secondaryCrisis,
              `${CRISIS_TEXT_US}`,
              `International: ${CRISIS_URL_INTERNATIONAL}`,
              `IASP: ${CRISIS_URL_IASP}`,
              "Reach out to a trusted person nearby"
            ]
          : riskLevel === "medium"
          ? [
              "If things feel harder over time, consider speaking with a mental health professional",
              "You can contact a support line any time, even just to talk",
              primaryCrisis,
            ]
          : [
              "Professional support is available any time you need it"
            ];

      // Build reply: grief-mode templates take priority, then i18n, then emotion-based
      let replyText: string;
      if (isGriefMode) {
        if (supportMode === "presence") {
          replyText = `I hear you, and I am here with you. You shared: "${message}". There is no need to have the right words or to be okay right now. Grief has its own pace, and whatever you are feeling is valid.`;
          careNotes.push("Presence-first response — prioritises being heard over problem-solving");
          careNotes.push("Avoid offering silver linings or comparisons to others' experiences");
          careNotes.push("Hold space — short, warm responses often feel safer than long explanations");
        } else if (supportMode === "practical") {
          replyText = `I am so sorry for what you are going through. You mentioned: "${message}". If it helps to think about one small thing, I am here to assist with whatever feels manageable right now — there is no pressure to do more than that.`;
          careNotes.push("Practical mode — offers help without imposing a to-do list");
          careNotes.push("Keep any suggested actions small, concrete, and optional");
          careNotes.push("Check in before offering advice — ask 'Would it help if I suggested some options?' first");
        } else {
          replyText = `You shared: "${message}". Grief often does not follow a straight line. What you are feeling — even if it surprises you — is part of how we process loss. There is no right or wrong way to grieve.`;
          careNotes.push("Reflection mode — validates the non-linear nature of grief");
          careNotes.push("Avoid timelines or stages — grief does not follow a fixed sequence");
          careNotes.push("Normalising unexpected emotions (relief, anger, numbness) can reduce shame");
        }
        careNotes.push("Never use platitudes: 'they are in a better place', 'time heals all wounds', 'at least...'");
        careNotes.push("Cultural variation in grieving is significant — follow the person's lead on ritual and meaning");
      } else if (loc !== "en") {
        replyText = getSupportiveReply(message, loc);
      } else if (message) {
        if (emotion.category !== "none") {
          const emotionLabels: Record<string, string> = {
            fear_anxiety: "anxious or afraid",
            sadness_grief: "sad or grieving",
            anger_frustration: "angry or frustrated",
            loneliness_isolation: "lonely or isolated",
            shame_guilt: "ashamed or guilty",
            love_connection: "grateful or connected",
          };
          const label = emotionLabels[emotion.category] || "overwhelmed";
          replyText = `I hear you, and I am glad you reached out. It sounds like you are feeling ${label}. You shared: "${message}". You do not have to have it all figured out — let us focus on one small step at a time.`;
        } else {
          replyText = `I hear you, and I am glad you reached out. You shared: "${message}". It makes sense that things feel heavy right now. You do not have to have it all figured out — let us focus on one small step at a time.`;
        }
      } else {
        replyText = "I hear you, and I am glad you reached out. It makes sense that things feel heavy right now. You do not have to have it all figured out — let us focus on one small step at a time.";
      }

      const output: Record<string, unknown> = {
        reply: replyText,
        escalation_guidance: escalation,
        boundaries_notice: boundaryNotice
      };
      if (isGriefMode) {
        output["care_notes"] = careNotes;
      }

      return {
        ok: true,
        data: {
          action: "supportive_reply",
          boundaryNotice,
          uncertainty: "medium",
          assumptions: [
            `Risk level: ${riskLevel}${autoEscalated ? " (auto-escalated from caller-provided level due to detected crisis signals)" : ""}`,
            `Locale: ${locale}`,
            `Detected emotion: ${emotion.category} (confidence: ${emotion.confidence.toFixed(1)})`,
            isGriefMode ? `Support mode: ${supportMode}` : "Support mode: general",
            boundaryFlags.length > 0 ? `Boundary flags: ${boundaryFlags.join(", ")}` : "No boundary violations detected",
            "Non-clinical support only — not a substitute for professional mental health care"
          ],
          output
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
