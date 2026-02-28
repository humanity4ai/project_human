# Security Policy

## Scope

This policy covers security and safety concerns in:

- Skill definitions (harmful, coercive, or dangerous guidance in any skill pack)
- MCP server runtime (input handling, output leakage, injection risks)
- Evaluation harness (false-passing unsafe skills)
- Documentation (misleading safety claims)

## Reporting

To report a safety or security concern, email:

**simon@ascent.partners**

Include:
- Description of the concern
- The specific skill, file, or component affected
- Potential impact on users
- Any suggested remediation

Do not open a public GitHub issue for safety-critical reports. Use email only.

## Response Time

- Acknowledgement within 2 business days
- Initial assessment within 5 business days
- Fix or mitigation plan within 14 business days for confirmed critical issues

## Safety-Critical Skills

The following skills require additional scrutiny before modification:

- `supportive-conversation` — crisis-adjacent support patterns
- `grief-loss-support` — bereavement-sensitive content
- `depression-sensitive-content` — emotional safety in UX

Changes to these skills require explicit safety review and two maintainer approvals before merge.

## Non-Clinical Boundary

Humanity4AI skills are non-clinical tools. They do not provide medical diagnosis, treatment plans, or professional mental health services. Any skill change that could blur this boundary is treated as a security concern.
