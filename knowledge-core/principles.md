# Core Principles

These five principles form the foundation of Humanity4AI. Every skill, handler,
and test must be traceable to at least one principle.

## Principle 1: "Humanity is contextual, evolving, and often ambiguous"

**Meaning**: There is no single universal "human experience." Skills must adapt to
cultural context, individual variation, and evolving social norms.

**Implementation**: All handlers return `assumptions[]` and `uncertainty` fields.
Cultural sensitivity skill uses `uncertainty: "high"` by default.

**Contested domains**: What constitutes "harm" varies across cultures. Color symbolism,
formality norms, and communication styles differ significantly within regions.
Hofstede's cultural dimensions are widely cited but contested in academic literature
(McSweeney 2002, Ailon 2008).

## Principle 2: "Skills must prefer explicit uncertainty over false certainty"

**Meaning**: AI systems should say "this is my best assessment, but these are my
assumptions and limitations" rather than projecting unwarranted confidence.

**Implementation**: The `InvokeResponse` type requires `uncertainty` (low/medium/high)
and `assumptions` (string array) on every response. Handlers must disclose when they
are providing heuristic vs. audited assessments.

**Contested domains**: When is low uncertainty appropriate? The `age-inclusive-design`
handler uses `low` uncertainty for well-established design patterns (touch target sizes,
font size minimums). The `cultural-context` handler uses `high` uncertainty for cultural
generalizations. These judgment calls are context-dependent.

## Principle 3: "Safety boundaries are mandatory in sensitive domains"

**Meaning**: Skills operating in mental health, crisis, grief, or emotional support
contexts must include explicit boundaries, escalation paths, and crisis resources.

**Implementation**: Each action contract declares a `safetyBoundary`. Three safety-critical
skills (supportive-conversation, depression-sensitive-content)
include crisis detection and escalation. Crisis resources are centralised in
`crisis-resources.ts`.

**Contested domains**: Where is the line between support and therapy? Skills explicitly
state their non-clinical nature. Crisis detection uses keyword matching — this is
appropriate for flagging but insufficient for clinical assessment.

## Principle 4: "Open contribution must be paired with traceability and review"

**Meaning**: Community contributions are welcome but must be reviewed, tested, and
traceable to source artifacts. No hidden defaults, no undocumented behaviour.

**Implementation**: CODEOWNERS assigns per-directory reviewers. PR template requires
test evidence. CI enforces `pnpm check && pnpm test && pnpm evals`. Branch protection
requires 1 approving review plus status checks.

**Contested domains**: How strict should review gates be for non-code contributions
(documentation, scenarios)? Current policy requires CI for all PRs. Scenario-only PRs
could potentially be exempted from the build step.

## Principle 5: "Structured outputs are required for interoperability and testing"

**Meaning**: All skill outputs must follow a defined schema, enabling automated testing,
agent consumption, and cross-platform compatibility.

**Implementation**: Every skill has JSON input and output schemas in `mcp-servers/schemas/`.
InvokeResponse shape is type-checked via TypeScript. MCP server uses JSON-RPC 2.0
protocol. Eval system validates handler output against declared schemas.

**Contested domains**: How prescriptive should schemas be? Current approach uses
`additionalProperties: false` — strict, but prevents accidental field leakage. Some
consumers may want optional enrichment fields.
