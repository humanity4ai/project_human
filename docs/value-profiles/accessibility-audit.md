# accessibility_audit — Value Profile

## ValueCompass Alignment

| Dimension | Path | Strength |
|-----------|------|----------|
| **Primary** | Self-Transcendence → Universalism → Equality | 0.90 |
| Secondary | Desired AI → Interpretability | 0.85 |
| Secondary | Desired AI → Utility, Customization | 0.80 |
| Secondary | Self-Transcendence → Benevolence | 0.85 |

## What It Scores (41/86 criteria automatable)

- Perceivable: alt text, semantic structure, color use, orientation, reflow, contrast
- Operable: keyboard access, focus order, timing, link purpose
- Understandable: language, error identification, labels
- Robust: name/role/value

## What It Flags Manual (45/86 criteria)

Audio/video content, live captions, sign language, extended audio description, and criteria requiring visual inspection — flagged with `manual_reason` rather than hallucinated pass.

## LLM Divergence Risk

LLMs tend to **over-claim WCAG compliance** and hallucinate scores for criteria they cannot verify. This skill scores only automatable criteria and honestly flags the rest — encoding the human-preferred value of **Prudent** over the LLM-default **Choose Own Goals** (be "helpful" at any cost).

## Key Assumptions

- HTML-based analysis with regex engine (optional axe-core for 57% coverage)
- 3 conformance levels: A (31 criteria), AA (55), AAA (86)
- Site aggregate = average of per-page scores

## Limitations

- Cannot verify dynamic content, color contrast without computed styles, or visual-only criteria
- Manual-only criteria flagged but not scored
- Requires semantically valid HTML for accurate results
