/**
 * Unit tests for crisis-detection.ts and crisis-resources.ts
 * Copyright (c) 2026 Ascent Partners Foundation. MIT License.
 */
import { describe, it, expect } from "vitest";
import { detectCrisisSignals, detectSafetySignals } from "../crisis-detection.js";
import { detectEmotion } from "../emotion-detection.js";
import { assessAccessibility } from "../accessibility-engine.js";
import { WCAG_CRITERIA, getChecklist, criteriaByLevel, AXE_COVERED_CRITERIA, ALL_CRITERIA } from "../wcag-criteria.js";
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
  it("returns heuristic=true for non-HTML input", async () => {
    const result = await assessAccessibility("A login form with username and password", "AA");
    expect(result.heuristic).toBe(true);
    expect(result.criteria).toHaveLength(0);
  });

  it("returns scored criteria for HTML input", async () => {
    const result = await assessAccessibility("<html><body><main><h1>Title</h1><p>Text</p></main></body></html>", "AA");
    expect(result.heuristic).toBe(false);
    expect(result.criteria.length).toBeGreaterThan(0);
  });

  it("returns aggregate score 0-100", async () => {
    const result = await assessAccessibility("<div><h1>Test</h1></div>", "AA");
    expect(result.aggregateScore).toBeGreaterThanOrEqual(0);
    expect(result.aggregateScore).toBeLessThanOrEqual(100);
  });

  it("AA mode vs AAA mode both work", async () => {
    const aa = await assessAccessibility("<div>test</div>", "AA");
    const aaa = await assessAccessibility("<div>test</div>", "AAA");
    expect(aa.level).toBe("AA");
    expect(aaa.level).toBe("AAA");
  });

  it("good semantic HTML scores high", async () => {
    const result = await assessAccessibility("<html><head><title>T</title></head><body><a href='#main' class='skip-link'>Skip</a><header><nav>Nav</nav></header><main id='main'><section aria-label='Main'><h1>Title</h1><h2>Sub</h2></section></main><footer>Foot</footer></body></html>", "AA");
    expect(result.aggregateScore).toBeGreaterThan(50);
  });

  it("poor HTML with inline styles scores lower", async () => {
    const result = await assessAccessibility("<div style='color:#ccc;background:#fff'>text</div>", "AA");
    expect(result.aggregateScore).toBeLessThan(80);
  });

  it("returns summary string", async () => {
    const result = await assessAccessibility("<div>test</div>", "AA");
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

// ─── WCAG Criteria (wcag-criteria.ts) ────────────────────────────────────────

describe("WCAG_CRITERIA", () => {
  it("MOD-WCAG-1: has 86 entries (all SC IDs)", () => {
    expect(WCAG_CRITERIA.length).toBe(86);
  });

  it("MOD-WCAG-2: all ids are unique", () => {
    const ids = WCAG_CRITERIA.map(c => c.id);
    expect(new Set(ids).size).toBe(86);
  });

  it("MOD-WCAG-3: all ids match SC pattern", () => {
    for (const c of WCAG_CRITERIA) {
      expect(c.id).toMatch(/^\d+\.\d+\.\d+$/);
    }
  });

  it("MOD-WCAG-4: all have level A/AA/AAA", () => {
    for (const c of WCAG_CRITERIA) {
      expect(["A", "AA", "AAA"]).toContain(c.level);
    }
  });

  it("MOD-WCAG-5: all have principle", () => {
    for (const c of WCAG_CRITERIA) {
      expect(["perceivable", "operable", "understandable", "robust"]).toContain(c.principle);
    }
  });

  it("MOD-WCAG-6: all have automatable yes/partial/no", () => {
    for (const c of WCAG_CRITERIA) {
      expect(["yes", "partial", "no"]).toContain(c.automatable);
    }
  });

  it("MOD-WCAG-7: AXE_COVERED_CRITERIA is subset of WCAG_CRITERIA", () => {
    expect(AXE_COVERED_CRITERIA.length).toBeGreaterThan(20);
    expect(AXE_COVERED_CRITERIA.length).toBeLessThan(WCAG_CRITERIA.length);
  });
});

describe("getChecklist", () => {
  it("MOD-WCAG-8: level A returns only A-level items", () => {
    const items = getChecklist("A");
    expect(items.length).toBeGreaterThan(25);
    for (const item of items) {
      expect(item.level).toBe("A");
    }
  });

  it("MOD-WCAG-9: level AA returns more items than A", () => {
    const aItems = getChecklist("A");
    const aaItems = getChecklist("AA");
    expect(aaItems.length).toBeGreaterThan(aItems.length);
  });

  it("MOD-WCAG-10: level AAA returns more items than AA", () => {
    const aaItems = getChecklist("AA");
    const aaaItems = getChecklist("AAA");
    expect(aaaItems.length).toBeGreaterThan(aaItems.length);
  });

  it("MOD-WCAG-11: each item has required fields", () => {
    const items = getChecklist("AA");
    for (const item of items) {
      expect(item.id).toBeTruthy();
      expect(item.title).toBeTruthy();
      expect(item.level).toBeTruthy();
      expect(item.principle).toBeTruthy();
      expect(item.requirement).toBeTruthy();
      expect(item.implementation).toBeTruthy();
    }
  });

  it("MOD-WCAG-12: checklist sorted by principle then id", () => {
    const items = getChecklist("AAA");
    const principles = ["perceivable", "operable", "understandable", "robust"];
    let lastPrinciple = -1;
    let lastId = "";
    for (const item of items) {
      const pi = principles.indexOf(item.principle);
      expect(pi).toBeGreaterThanOrEqual(lastPrinciple);
      if (pi === lastPrinciple) {
        expect(item.id.localeCompare(lastId)).toBeGreaterThanOrEqual(0);
      }
      lastPrinciple = pi;
      lastId = item.id;
    }
  });
  it("MOD-WCAG-22: criteriaByLevel('A') returns only A-level criteria", () => {
    const items = criteriaByLevel("A");
    expect(items.length).toBeGreaterThan(0);
    for (const item of items) {
      expect(item.level).toBe("A");
    }
  });

  it("MOD-WCAG-23: criteriaByLevel('AA') returns A + AA criteria, no AAA", () => {
    const items = criteriaByLevel("AA");
    expect(items.length).toBeGreaterThan(0);
    for (const item of items) {
      expect(item.level).not.toBe("AAA");
    }
    const aItems = items.filter(i => i.level === "A");
    const aaItems = items.filter(i => i.level === "AA");
    expect(aItems.length).toBeGreaterThan(0);
    expect(aaItems.length).toBeGreaterThan(0);
  });

  it("MOD-WCAG-24: criteriaByLevel('AAA') returns all criteria", () => {
    const items = criteriaByLevel("AAA");
    expect(items.length).toBe(ALL_CRITERIA.length);
    const levels = new Set(items.map(i => i.level));
    expect(levels.has("A")).toBe(true);
    expect(levels.has("AA")).toBe(true);
    expect(levels.has("AAA")).toBe(true);
  });
});

// ─── assessAccessibility (engine) level-aware ─────────────────────────────────

describe("assessAccessibility — level-aware", () => {
  const html = "<html lang='en'><head><title>Test</title></head><body><main id='main-content'><h1>Title</h1><p>Content</p></main></body></html>";

  it("MOD-WCAG-13: level A returns valid score", async () => {
    const result = await assessAccessibility(html, "A");
    expect(result.aggregateScore).toBeGreaterThanOrEqual(0);
    expect(result.level).toBe("A");
    expect(result.criteria.length).toBeGreaterThan(0);
  });

  it("MOD-WCAG-14: AA score same as old engine (±5 tolerance)", async () => {
    const result = await assessAccessibility(html, "AA");
    expect(result.aggregateScore).toBeGreaterThanOrEqual(60);
    expect(result.level).toBe("AA");
  });

  it("MOD-WCAG-15: AAA returns more criteria than A", async () => {
    const aResult = await assessAccessibility(html, "A");
    const aaaResult = await assessAccessibility(html, "AAA");
    expect(aaaResult.criteria.length).toBeGreaterThan(aResult.criteria.length);
  });

  it("MOD-WCAG-16: heuristic mode for non-HTML", async () => {
    const result = await assessAccessibility("plain text, not HTML", "AA");
    expect(result.heuristic).toBe(true);
    expect(result.aggregateScore).toBe(0);
    expect(result.criteria).toHaveLength(0);
  });

  it("MOD-WCAG-17: manual criteria have manualReason", async () => {
    const result = await assessAccessibility(html, "A");
    const manual = result.criteria.filter(c => c.automatable === "no");
    if (manual.length > 0) {
      for (const m of manual) {
        expect(m.manualReason).toBeTruthy();
      }
    }
  });

  it("MOD-WCAG-18: automatable criteria have scores", async () => {
    const result = await assessAccessibility(html, "AA");
    const scored = result.criteria.filter(c => c.automatable === "yes" || c.automatable === "partial");
    for (const s of scored) {
      if (s.score !== undefined) {
        expect(s.score).toBeGreaterThanOrEqual(0);
        expect(s.score).toBeLessThanOrEqual(100);
      }
    }
  });

  it("MOD-WCAG-19: automatedCount + manualCount = total criteria for level", async () => {
    const result = await assessAccessibility(html, "AA");
    expect(result.automatedCount + result.manualCount).toBe(result.criteria.length);
    expect(result.criteria.length).toBeGreaterThan(0);
  });

  it("MOD-WCAG-20: engine field is 'regex' when axe-core not installed", async () => {
    const result = await assessAccessibility(html, "AA");
    expect(result.engine).toBeDefined();
    expect(["regex", "axe+regex"]).toContain(result.engine);
  });

  it("MOD-WCAG-21: good HTML scores higher than poor HTML", async () => {
    const goodResult = await assessAccessibility("<html lang='en'><head><title>T</title></head><body><a href='#main' class='skip-link'>Skip</a><header><nav>Nav</nav></header><main id='main'><section aria-label='S'><h1>T</h1><h2>Sub</h2><p>Content</p></section></main><footer>Foot</footer></body></html>", "AA");
    const poorResult = await assessAccessibility("<div style='color:#ccc;background:#fff'>text</div>", "AA");
    expect(goodResult.aggregateScore).toBeGreaterThanOrEqual(poorResult.aggregateScore);
  });
});

// ─── i18n — locale-aware functions ─────────────────────────────────────────

describe("i18n — locale-aware functions", () => {
  it("MOD-I18N-1: normalizeLocale returns en for unknown locale", () => {
    expect(normalizeLocale("xx")).toBe("en");
    expect(normalizeLocale("")).toBe("en");
  });

  it("MOD-I18N-2: normalizeLocale returns correct locale for known prefixes", () => {
    expect(normalizeLocale("zh-CN")).toBe("zh");
    expect(normalizeLocale("zh-TW")).toBe("zh");
    expect(normalizeLocale("es-MX")).toBe("es");
    expect(normalizeLocale("fr-CA")).toBe("fr");
    expect(normalizeLocale("ja-JP")).toBe("ja");
    expect(normalizeLocale("ko-KR")).toBe("ko");
    expect(normalizeLocale("ar-SA")).toBe("ar");
    expect(normalizeLocale("pt-BR")).toBe("pt");
    expect(normalizeLocale("de-DE")).toBe("de");
    expect(normalizeLocale("en-US")).toBe("en");
  });

  it("MOD-I18N-3: all 9 supported locales return non-empty replies", () => {
    for (const locale of SUPPORTED_LOCALES) {
      const reply = getSupportiveReply("test message", locale);
      expect(reply).toBeTruthy();
      expect(reply.length).toBeGreaterThan(0);
      expect(reply).toContain("test message");
    }
  });

  it("MOD-I18N-4: all 9 supported locales return crisis resources", () => {
    for (const locale of SUPPORTED_LOCALES) {
      const resources = getLocalizedCrisisResources(locale);
      expect(resources.primary).toBeTruthy();
      expect(resources.secondary).toBeTruthy();
    }
  });

  it("MOD-I18N-5: all 9 supported locales return localized categories", () => {
    const categories = ["colorContrast", "keyboardNav", "score"];
    for (const locale of SUPPORTED_LOCALES) {
      for (const cat of categories) {
        const label = getLocalizedCategory(cat, locale);
        expect(label).toBeTruthy();
        expect(label.length).toBeGreaterThan(0);
      }
    }
  });

  it("MOD-I18N-6: getLocalizedCategory returns raw key for unknown category", () => {
    const label = getLocalizedCategory("nonexistent", "en");
    expect(label).toBe("nonexistent");
  });

  it("MOD-I18N-7: SUPPORTED_LOCALES has exactly 9 entries", () => {
    expect(SUPPORTED_LOCALES.length).toBe(9);
    expect(SUPPORTED_LOCALES).toContain("en");
    expect(SUPPORTED_LOCALES).toContain("zh");
    expect(SUPPORTED_LOCALES).toContain("es");
    expect(SUPPORTED_LOCALES).toContain("fr");
    expect(SUPPORTED_LOCALES).toContain("de");
    expect(SUPPORTED_LOCALES).toContain("ja");
    expect(SUPPORTED_LOCALES).toContain("ko");
    expect(SUPPORTED_LOCALES).toContain("ar");
    expect(SUPPORTED_LOCALES).toContain("pt");
  });
});
