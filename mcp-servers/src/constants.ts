/**
 * Named numeric constants for Humanity4AI MCP handlers.
 * All magic numbers in handlers.ts reference these constants.
 *
 * Copyright (c) 2026 Ascent Partners Foundation. MIT License.
 */

/** Maximum average words per sentence before cognitive overload warning */
export const MAX_WORDS_PER_SENTENCE = 20;

/** Maximum content word count before chunking recommendation */
export const MAX_CONTENT_WORDS = 150;

/** Minimum word count before numbered-step recommendation triggers */
export const MIN_STEPS_SEQUENCE_THRESHOLD = 50;

/** Minimum touch target size in pixels (WCAG 2.5.5) */
export const MIN_TOUCH_TARGET_PX = 44;

/** Minimum body font size in pixels for readability */
export const MIN_BODY_FONT_PX = 16;

/** Recommended minimum line height factor */
export const MIN_LINE_HEIGHT_FACTOR = 1.5;
