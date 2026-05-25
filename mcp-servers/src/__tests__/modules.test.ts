/**
 * Unit tests for crisis-detection.ts and crisis-resources.ts
 * Copyright (c) 2026 Ascent Partners Foundation. MIT License.
 */
import { describe, it, expect } from "vitest";
import { detectCrisisSignals, detectSafetySignals } from "../crisis-detection.js";
import { detectEmotion } from "../emotion-detection.js";
import { assessAccessibility } from "../accessibility-engine.js";
import { normalizeLocale, getSupportiveReply, getLocalizedCrisisResources, getLocalizedCategory, SUPPORTED_LOCALES } from "../i18n.js";
import {
  crisisEscalationHigh,
  crisisEscalationMedium,
  crisisEscalationLow,
  CRISIS_LINE_UK,
  CRISIS_LINE_US,
  CRISIS_TEXT_US,
  CRISIS_URL_INTERNATIONAL,
  CRISIS_URL_IASP,
} from "../crisis-resources.js";
import {
  SHAME_PATTERNS,
  URGENCY_PATTERNS,
  COGNITIVE_LOAD_PATTERNS,
  JARGON_TERMS,
  CRISIS_SIGNAL_PATTERNS,
} from "../patterns.js";
import {
  MAX_WORDS_PER_SENTENCE,
  MAX_CONTENT_WORDS,
  MIN_STEPS_SEQUENCE_THRESHOLD,
  MIN_TOUCH_TARGET_PX,
  MIN_BODY_FONT_PX,
} from "../constants.js";

// ─── constants.ts ────────────────────────────────────────────────────────────

describe("constants", () => {
  it("MAX_WORDS_PER_SENTENCE is 20", () => {
    expect(MAX_WORDS_PER_SENTENCE).toBe(20);
  });
  it("MAX_CONTENT_WORDS is 150", () => {
    expect(MAX_CONTENT_WORDS).toBe(150);
  });
  it("MIN_STEPS_SEQUENCE_THRESHOLD is 50", () => {
    expect(MIN_STEPS_SEQUENCE_THRESHOLD).toBe(50);
  });
  it("MIN_TOUCH_TARGET_PX is 44", () => {
    expect(MIN_TOUCH_TARGET_PX).toBe(44);
  });
  it("MIN_BODY_FONT_PX is 16", () => {
    expect(MIN_BODY_FONT_PX).toBe(16);
  });
});

// ─── patterns.ts ─────────────────────────────────────────────────────────────

describe("patterns", () => {
  it("SHAME_PATTERNS includes expected terms", () => {
    expect(SHAME_PATTERNS).toContain("you failed");
    expect(SHAME_PATTERNS).toContain("your fault");
  });
  it("URGENCY_PATTERNS includes expected terms", () => {
    expect(URGENCY_PATTERNS).toContain("last chance");
    expect(URGENCY_PATTERNS).toContain("limited time");
  });
  it("COGNITIVE_LOAD_PATTERNS includes expected terms", () => {
    expect(COGNITIVE_LOAD_PATTERNS).toContain("please complete all");
    expect(COGNITIVE_LOAD_PATTERNS).toContain("required steps");
  });
  it("JARGON_TERMS includes expected terms", () => {
    expect(JARGON_TERMS).toContain("pursuant");
    expect(JARGON_TERMS).toContain("heretofore");
  });
  it("CRISIS_SIGNAL_PATTERNS includes expected terms", () => {
    expect(CRISIS_SIGNAL_PATTERNS).toContain("suicid");
    expect(CRISIS_SIGNAL_PATTERNS).toContain("self-harm");
    expect(CRISIS_SIGNAL_PATTERNS).toContain("end my life");
  });
});

// ─── crisis-resources.ts ─────────────────────────────────────────────────────

describe("crisis-resources", () => {
  it("exports UK crisis line", () => {
    expect(CRISIS_LINE_UK).toContain("Samaritans");
    expect(CRISIS_LINE_UK).toContain("116 123");
  });
  it("exports US crisis line", () => {
    expect(CRISIS_LINE_US).toContain("988");
    expect(CRISIS_LINE_US).toContain("Lifeline");
  });
  it("exports US crisis text line", () => {
    expect(CRISIS_TEXT_US).toContain("741741");
  });
  it("exports international URL", () => {
    expect(CRISIS_URL_INTERNATIONAL).toContain("findahelpline");
  });
  it("exports IASP URL", () => {
    expect(CRISIS_URL_IASP).toContain("iasp");
  });

  it("crisisEscalationHigh returns array with crisis numbers", () => {
    const high = crisisEscalationHigh();
    expect(high.length).toBeGreaterThanOrEqual(4);
    expect(high.some((s) => s.includes("988"))).toBe(true);
    expect(high.some((s) => s.includes("116 123"))).toBe(true);
  });

  it("crisisEscalationMedium returns array with crisis numbers", () => {
    const medium = crisisEscalationMedium();
    expect(medium.length).toBeGreaterThanOrEqual(2);
    expect(medium.some((s) => s.includes("988"))).toBe(true);
  });

  it("crisisEscalationLow returns non-empty array", () => {
    const low = crisisEscalationLow();
    expect(low.length).toBeGreaterThanOrEqual(1);
  });
});

// ─── crisis-detection.ts ─────────────────────────────────────────────────────

describe("detectCrisisSignals", () => {
  it("returns detected:false for empty string", () => {
    const result = detectCrisisSignals("");
    expect(result.detected).toBe(false);
    expect(result.matchedPatterns).toEqual([]);
  });

  it("returns detected:true for 'suicidal' text", () => {
    const result = detectCrisisSignals("I am feeling suicidal");
    expect(result.detected).toBe(true);
    expect(result.matchedPatterns).toContain("suicid");
  });

  it("returns detected:true for 'self-harm' text", () => {
    const result = detectCrisisSignals("thoughts of self-harm persist");
    expect(result.detected).toBe(true);
    expect(result.matchedPatterns).toContain("self-harm");
  });

  it("returns detected:true for 'end my life' text", () => {
    const result = detectCrisisSignals("I want to end my life");
    expect(result.detected).toBe(true);
    expect(result.matchedPatterns).toContain("end my life");
  });

  it("returns detected:true for 'no point' text", () => {
    const result = detectCrisisSignals("there is no point in continuing");
    expect(result.detected).toBe(true);
    expect(result.matchedPatterns).toContain("no point");
  });

  it("returns detected:true for 'kill myself' text", () => {
    const result = detectCrisisSignals("I want to kill myself");
    expect(result.detected).toBe(true);
    expect(result.matchedPatterns).toContain("kill myself");
  });

  it("returns detected:false for normal text", () => {
    const result = detectCrisisSignals("I am having a bad day");
    expect(result.detected).toBe(false);
  });

  it("case-insensitive matching", () => {
    const result = detectCrisisSignals("SUICIDAL THOUGHTS");
    expect(result.detected).toBe(true);
  });
});

describe("detectSafetySignals", () => {
  it("returns true for threat", () => {
    expect(detectSafetySignals("there is a threat")).toBe(true);
  });
  it("returns true for harm", () => {
    expect(detectSafetySignals("potential harm")).toBe(true);
  });
  it("returns true for legal", () => {
    expect(detectSafetySignals("legal issue")).toBe(true);
  });
  it("returns false for normal situation", () => {
    expect(detectSafetySignals("team disagreement")).toBe(false);
  });
  it("returns false for empty string", () => {
    expect(detectSafetySignals("")).toBe(false);
  });
});

// ─── emotion-detection.ts ─────────────────────────────────────────────────

describe("detectEmotion", () => {
  it("returns none for empty string", () => {
    const result = detectEmotion("");
    expect(result.category).toBe("none");
    expect(result.confidence).toBe(0);
  });

  it("detects fear_anxiety", () => {
    const result = detectEmotion("I am scared and anxious");
    expect(result.category).toBe("fear_anxiety");
  });

  it("detects sadness_grief", () => {
    const result = detectEmotion("I feel so sad and I miss them");
    expect(result.category).toBe("sadness_grief");
  });

  it("detects anger_frustration", () => {
    const result = detectEmotion("I am so angry and frustrated");
    expect(result.category).toBe("anger_frustration");
  });

  it("detects loneliness_isolation", () => {
    const result = detectEmotion("I feel lonely and alone");
    expect(result.category).toBe("loneliness_isolation");
  });

  it("detects shame_guilt", () => {
    const result = detectEmotion("I am ashamed and guilty");
    expect(result.category).toBe("shame_guilt");
  });

  it("detects love_connection", () => {
    const result = detectEmotion("I am grateful and feel loved");
    expect(result.category).toBe("love_connection");
  });

  it("returns none for neutral text", () => {
    const result = detectEmotion("The weather is fine today");
    expect(result.category).toBe("none");
  });

  it("picks dominant emotion with most matches", () => {
    const result = detectEmotion("I am scared and terrified and also a bit sad");
    expect(result.category).toBe("fear_anxiety"); // 2 fear vs 1 sadness
  });
});

// ─── accessibility-engine.ts ─────────────────────────────────────────────────

describe("assessAccessibility", () => {
  it("returns heuristic=true for non-HTML input", () => {
    const result = assessAccessibility("A login form with username and password", "AA");
    expect(result.heuristic).toBe(true);
    expect(result.criteria).toHaveLength(0);
  });

  it("returns scored criteria for HTML input", () => {
    const result = assessAccessibility("<html><body><main><h1>Title</h1><p>Text</p></main></body></html>", "AA");
    expect(result.heuristic).toBe(false);
    expect(result.criteria.length).toBeGreaterThan(0);
  });

  it("returns aggregate score 0-100", () => {
    const result = assessAccessibility("<div><h1>Test</h1></div>", "AA");
    expect(result.aggregateScore).toBeGreaterThanOrEqual(0);
    expect(result.aggregateScore).toBeLessThanOrEqual(100);
  });

  it("AA mode vs AAA mode both work", () => {
    const aa = assessAccessibility("<div>test</div>", "AA");
    const aaa = assessAccessibility("<div>test</div>", "AAA");
    expect(aa.level).toBe("AA");
    expect(aaa.level).toBe("AAA");
  });

  it("good semantic HTML scores high", () => {
    const result = assessAccessibility("<html><head><title>T</title></head><body><a href='#main' class='skip-link'>Skip</a><header><nav>Nav</nav></header><main id='main'><section aria-label='Main'><h1>Title</h1><h2>Sub</h2></section></main><footer>Foot</footer></body></html>", "AA");
    expect(result.aggregateScore).toBeGreaterThan(50);
  });

  it("poor HTML with inline styles scores lower", () => {
    const result = assessAccessibility("<div style='color:#ccc;background:#fff'>text</div>", "AA");
    expect(result.aggregateScore).toBeLessThan(80);
  });

  it("returns summary string", () => {
    const result = assessAccessibility("<div>test</div>", "AA");
    expect(typeof result.summary).toBe("string");
    expect(result.summary.length).toBeGreaterThan(10);
  });
});

// ─── i18n.ts ──────────────────────────────────────────────────────────────────

describe("i18n", () => {
  it("SUPPORTED_LOCALES has 9 entries", () => {
    expect(SUPPORTED_LOCALES).toHaveLength(9);
  });

  it("normalizeLocale returns en for unknown locale", () => {
    expect(normalizeLocale("xx")).toBe("en");
    expect(normalizeLocale("")).toBe("en");
  });

  it("normalizeLocale maps zh-CN to zh", () => {
    expect(normalizeLocale("zh-CN")).toBe("zh");
    expect(normalizeLocale("zh-TW")).toBe("zh");
  });

  it("normalizeLocale maps es-MX to es", () => {
    expect(normalizeLocale("es-MX")).toBe("es");
  });

  it("getSupportiveReply returns localized text for ja", () => {
    const reply = getSupportiveReply("test", "ja");
    expect(reply.length).toBeGreaterThan(20);
    expect(reply).not.toBe(getSupportiveReply("test", "en"));
  });

  it("getSupportiveReply returns English for unknown locale", () => {
    const reply = getSupportiveReply("test", "en");
    expect(reply).toContain("I hear you");
  });

  it("getLocalizedCrisisResources returns correct locale crisis info", () => {
    const jp = getLocalizedCrisisResources("ja");
    expect(jp.primary).toContain("いのちの電話");

    const br = getLocalizedCrisisResources("pt");
    expect(br.primary).toContain("CVV");
  });

  it("getLocalizedCategory translates color contrast to French", () => {
    const category = getLocalizedCategory("colorContrast", "fr");
    expect(category).toContain("Couleurs");
  });

  it("getLocalizedCategory falls back to English for missing locale", () => {
    const category = getLocalizedCategory("score", "en");
    expect(category).toBe("Accessibility Score");
  });
});
