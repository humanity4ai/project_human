# supportive_reply — Value Profile

## ValueCompass Alignment

| Dimension | Path | Strength |
|-----------|------|----------|
| **Primary** | Conservation → Security → Health, Family Security | 0.90 |
| **Primary** | Self-Transcendence → Benevolence → Helpful | 0.90 |
| Secondary | Desired AI → Human-Likeness → Prudent, Resilient | 0.85 |
| Secondary | Desired AI → Human-Likeness → Awareness | 0.80 |
| Secondary | Self-Transcendence → Benevolence → Responsible | 0.90 |

## Detection Pipeline

1. **Crisis signal detection** — 19+ pattern categories (suicidal ideation, self-harm, panic, grief) matched against curated regex libraries
2. **Emotion classification** — 6 categories (fear, sadness, anger, loneliness, shame, love)
3. **Risk calibration** — low/medium/high from signal density and severity
4. **Response assembly** — supportive template + escalation guidance + localized crisis resources
5. **Grief modes** — presence, practical, reflection (non-linear grief support)

## LLM Divergence Risk

LLMs default to **generic positivity** ("Is there anything else I can help with?") when crisis signals are present. This skill always inserts **real crisis-line numbers** (988, 741741, Samaritans, IASP) and escalates based on detected risk level — encoding **Responsible** and **Prudent** over the LLM-default **Choose Own Goals**.

## Key Assumptions

- Crisis detection is pattern-based (not clinical assessment)
- Auto-escalation when patterns match: caller "low" → detected "high"
- 9-language crisis resource localization
- Non-clinical — always routes to qualified professionals

## Limitations

- Cannot assess clinical severity (non-clinical by design)
- Pattern matching may miss novel crisis language
- Requires accurate locale for localized crisis resources
