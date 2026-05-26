/**
 * Centralised crisis resources for Humanity4AI MCP handlers.
 * All safety-critical handlers import from this module.
 * Changing a phone number here updates all handlers consistently.
 *
 * Copyright (c) 2026 Ascent Partners Foundation. MIT License.
 */
/** UK crisis line */
export declare const CRISIS_LINE_UK = "Samaritans 116 123";
/** US Suicide & Crisis Lifeline (voice) */
export declare const CRISIS_LINE_US = "988 Suicide & Crisis Lifeline";
/** US Crisis Text Line */
export declare const CRISIS_TEXT_US = "Crisis Text Line: Text HOME to 741741";
/** International helpline directory */
export declare const CRISIS_URL_INTERNATIONAL = "https://findahelpline.com";
/** International Association for Suicide Prevention */
export declare const CRISIS_URL_IASP = "https://www.iasp.info/resources/Crisis_Centres/";
/** Full crisis escalation text for high-risk responses */
export declare function crisisEscalationHigh(): string[];
/** Medium-risk escalation guidance */
export declare function crisisEscalationMedium(): string[];
/** Low-risk support reminder */
export declare function crisisEscalationLow(): string[];
//# sourceMappingURL=crisis-resources.d.ts.map