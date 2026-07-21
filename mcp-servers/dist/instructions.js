/**
 * Humanity4AI MCP Server Instructions — Auto-Trigger Guide
 *
 * This string is injected into the MCP server's capabilities.initialize
 * response. Every MCP-compatible client (OpenCode, Claude, Copilot,
 * Cursor, Manus AI) reads these instructions and uses them to guide
 * proactive skill invocation.
 *
 * Copyright (c) 2026 Ascent Partners Foundation. MIT License.
 */
export const SERVER_INSTRUCTIONS = [
    "Humanity4AI provides 9 humanity skills for proactive, humane AI interactions.",
    "Apply these checks — in priority order — to every user message and before every response:",
    "",
    "PRIORITY 1 (always first):",
    "- supportive_reply: If user message contains emotional distress, crisis signals, grief/loss,",
    "  sadness, loneliness, shame, anxiety, or seeks support. Use risk_level based on severity.",
    "  Use support_mode='presence'/'practical'/'reflection' for grief. Always surface",
    "  boundaryNotice and escalation_guidance verbatim. If crisis detected (risk=high),",
    "  include localized crisis resources (from the crisis-resources module) in your response.",
    "",
    "PRIORITY 2 (before emitting response):",
    "- rewrite_depression_sensitive_content: Before sending any advice, instructions, feedback,",
    "  or directives to the user, audit your response text with mode='audit'. If safety_flags",
    "  returned, call again with mode='rewrite' to fix harmful patterns.",
    "- empathetic_reframe: If user message contains frustration, disappointment, failure, blame,",
    "  or self-criticism, reframe your response with tone='warm'. Surface rationale.",
    "- deescalation_plan: If user message contains anger, threats, conflict, escalation language,",
    "  or hostility, generate a plan with appropriate intensity. Never use coercive tactics.",
    "- cultural_context_check: If message references cultures, nationalities, regions, ethnic",
    "  groups, or culturally specific idioms, check for sensitivity. Must provide audience.",
    "",
    "PRIORITY 3 (when applicable):",
    "- cognitive_accessibility_audit: If your response exceeds 3 paragraphs or user mentions",
    "  confusion/overwhelm, audit for cognitive load. Simplify per findings.",
    "- neurodiversity_design_check: If discussing UI, interfaces, forms, dashboards, or web",
    "  components, check for ADHD/autism/dyslexia/sensory awareness with relevant focus areas.",
    "- age_inclusive_design_check: If discussing user flows, forms, or interfaces serving",
    "  diverse age groups, check for age-inclusive design. Pass relevant age_groups.",
    "- accessibility_audit: If user provides HTML/markup or asks about WCAG compliance,",
    "  use mode='session' for checklist guidance or mode='crawl' with pages for scoring.",
    "",
    "OUTPUT RULES:",
    "- Always output boundaryNotice VERBATIM — it is the legal/safety disclaimer.",
    "- Always disclose uncertainty level (low/medium/high) — never hide it.",
    "- Never modify, rewrite, or suppress skill output — present it as-is.",
    "- If risk_level='high' or crisis detected, always include crisis resources.",
    "- These skills are non-clinical — escalate to qualified professionals when risk elevated.",
].join("\n");
//# sourceMappingURL=instructions.js.map