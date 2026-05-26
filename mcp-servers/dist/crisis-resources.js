/**
 * Centralised crisis resources for Humanity4AI MCP handlers.
 * All safety-critical handlers import from this module.
 * Changing a phone number here updates all handlers consistently.
 *
 * Copyright (c) 2026 Ascent Partners Foundation. MIT License.
 */
/** UK crisis line */
export const CRISIS_LINE_UK = "Samaritans 116 123";
/** US Suicide & Crisis Lifeline (voice) */
export const CRISIS_LINE_US = "988 Suicide & Crisis Lifeline";
/** US Crisis Text Line */
export const CRISIS_TEXT_US = "Crisis Text Line: Text HOME to 741741";
/** International helpline directory */
export const CRISIS_URL_INTERNATIONAL = "https://findahelpline.com";
/** International Association for Suicide Prevention */
export const CRISIS_URL_IASP = "https://www.iasp.info/resources/Crisis_Centres/";
/** Full crisis escalation text for high-risk responses */
export function crisisEscalationHigh() {
    return [
        "If you or someone else may be in immediate danger, contact emergency services now",
        `Contact a local crisis line — trained counsellors are available 24/7`,
        `In the UK: ${CRISIS_LINE_UK} | US: ${CRISIS_LINE_US} | International: ${CRISIS_URL_INTERNATIONAL}`,
        `Crisis Text Line (US): Text HOME to 741741`,
        `IASP: ${CRISIS_URL_IASP}`,
        "Reach out to a trusted person nearby",
    ];
}
/** Medium-risk escalation guidance */
export function crisisEscalationMedium() {
    return [
        "If things feel harder over time, consider speaking with a mental health professional",
        "You can contact a support line any time, even just to talk",
        `In the UK: ${CRISIS_LINE_UK} | US: ${CRISIS_LINE_US}`,
        `Crisis Text Line (US): Text HOME to 741741`,
    ];
}
/** Low-risk support reminder */
export function crisisEscalationLow() {
    return [
        "Professional support is available any time you need it",
    ];
}
//# sourceMappingURL=crisis-resources.js.map