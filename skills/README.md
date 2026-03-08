# Humanity4AI Skills

This directory contains the 10 launch skill packs for Humanity4AI v0.1. Each skill is a self-contained unit with a machine-readable specification (`SKILL.md`), a YAML configuration (`skill.yaml`), evaluation scenarios, and a scoring rubric.

## Skill Index

| Skill | Category | Description |
|---|---|---|
| [`age-inclusive-design`](./age-inclusive-design/) | `age-inclusion` | Design for users of all ages. |
| [`cognitive-accessibility`](./cognitive-accessibility/) | `cognitive-support` | Improve content for varied attention, memory, and executive function. |
| [`conflict-de-escalation`](./conflict-de-escalation/) | `conflict-navigation` | De-escalate tense interactions. |
| [`cultural-sensitivity`](./cultural-sensitivity/) | `cultural-context` | Design for cultural inclusivity. |
| [`depression-sensitive-content`](./depression-sensitive-content/) | `emotional-safety` | Audit and rewrite content to reduce stigma and improve emotional safety. |
| [`empathetic-communication`](./empathetic-communication/) | `communication` | Improve emotional resonance in communication. |
| [`grief-loss-support`](./grief-loss-support/) | `emotional-safety` | Offer non-clinical, compassionate support language for grief and loss. |
| [`neurodiversity-aware-design`](./neurodiversity-aware-design/) | `neurodiversity` | Design for diverse cognitive processing. |
| [`supportive-conversation`](./supportive-conversation/) | `communication` | Generate supportive responses with safety boundaries. |
| [`wcag-aaa-accessibility`](./wcag-aaa-accessibility/) | `accessibility` | Audit a webpage or HTML for WCAG 2.2 AAA compliance. |

## Skill Structure

Each skill directory follows a consistent structure:

- **`SKILL.md`**: The core specification file for the skill, intended to be read by LLMs. It defines the skill's purpose, boundaries, and principles.
- **`skill.yaml`**: Machine-readable metadata for the skill, including its ID, category, and version.
- **`rubric.md`**: The scoring rubric used by the evaluation harness to assess the quality of the skill's output.
- **`scenarios/`**: A directory containing YAML files with test scenarios for the skill.
- **`references/`**: A directory with supporting research, standards, and best practices.
- **`README.md`**: A human-readable guide to the skill, with usage examples.
