# Expanding Humanity4AI (project_human) — A Multi-Dimensional Growth Strategy

## Overview

Humanity4AI (`humanity4ai/project_human`) is an open-source, MIT-licensed TypeScript project that packages nine "humanity skills" — crisis detection, WCAG 2.2 accessibility auditing, empathetic reframing, cultural sensitivity checks, de-escalation planning, cognitive and neurodiversity accessibility, and age-inclusive design — into structured MCP (Model Context Protocol) action contracts that AI agents can call as tools rather than relying on vague prompt instructions.

It was created by Simon Mak under Ascent Partners Foundation, launched publicly around late February 2026, and has grown into a working monorepo with an MCP server, a Vercel-hosted remote endpoint, an npm package (`@humanity4ai/mcp-servers`), a documentation site, and an evaluation harness with automated quality gates.

Expanding the offering "in every aspect" means building on five already-declared axes — **skill breadth, platform reach, evaluation rigor, community governance, and distribution** — while adding new dimensions the roadmap does not yet cover, such as monetization, enterprise integration, localization, and cross-domain partnerships.

---

## Current State Snapshot

| Dimension | Current Status |
|-----------|---------------|
| **Skills** | 9 launch skills (emotional safety ×2, accessibility, cognitive support, cultural context, conflict navigation, communication, neurodiversity, age inclusion) |
| **Architecture** | MCP server (stdio + Streamable HTTP), Vercel serverless deploy, rule-based handlers with zero LLM calls, 18 inline JSON schemas |
| **Distribution** | Remote URL, npx/npm package, Docker, local clone, llms.txt/llms-full.txt for raw LLM prompting |
| **Supported Platforms** | OpenCode, Claude Code, Microsoft Copilot, Manus AI, OpenClaw, ChatGPT, Claude, Gemini |
| **Governance** | CODEOWNERS review, two-tier branching, MIT license, safety-critical path protections, manifesto-to-roadmap traceability |
| **Evaluation** | Baseline eval harness, 10 automated quality gates, `pnpm check && pnpm evals && pnpm test` CI pipeline |
| **Community** | GitHub Discussions (Skill Ideas, Integration Help, Safety & Ethics, Show & Tell), good-first-issue labeling, skill-proposal templates |

---

## Expansion Opportunities by Category

### 1. Skill Catalog Depth

The nine skills cluster around individual-user emotional and accessibility scenarios but leave organizational and domain-specific humane-AI use cases unaddressed. High-value additions include:

| Skill | Domain | Why |
|-------|--------|-----|
| **Financial & consumer-protection literacy** | Consumer protection, compliance | Flags predatory language, dark patterns, unclear fee disclosures |
| **ESG & sustainability-communication** | Governance, compliance | Audits corporate disclosures for greenwashing, vague claims, missing quantified metrics |
| **Bereavement & grief-in-workplace** | HR, People-Ops | Complements Supportive Reply for leave requests and internal communications |
| **Digital wellbeing / attention-design audit** | UX, mental health | Extends Cognitive Accessibility to flag manipulative engagement patterns (infinite scroll, dark-pattern notifications) |
| **Multilingual dignity check** | Internationalization | Lighter-weight companion to Cultural Context Check for machine-translation dignity loss |

Each new skill should follow the existing mandatory artifact structure (`SKILL.md`, `skill.yaml`, `rubric.md`, `scenarios/`, `references/`) and map explicitly to the five core principles: contextual ambiguity, uncertainty disclosure, safety boundaries, traceable contribution, structured output.

### 2. Platform and Integration Reach

- **Enterprise agent framework adapters**: Microsoft Copilot Studio connectors, Google ADK, Salesforce Agentforce, Slack/Teams bot skill packs
- **Hosted "skill marketplace" page** beyond npm/Vercel/Docker — position alongside comparable accessibility-audit skills already listed in Anthropic's accessibility-review and mcpservers.org listings
- **GitHub Action / pre-commit hook**: Accessibility and content-safety audits run automatically in third-party CI pipelines
- **Formal MCP Registry completion** (registry.modelcontextprotocol.io) — flagged as v1.1 item

### 3. Evaluation and Trust Infrastructure

- **Outcome-based scoring**: Move from structural evaluation gates toward held-out human-rated scenarios
- **Public "trust dashboard"**: Turn `evals/reports/latest.md` into an external-facing transparency report with pass rates per skill per release
- **Adversarial red-teaming scenarios**: Specifically for the two safety-critical skills (supportive-conversation, depression-sensitive-content)
- **Feedback loop**: Real (anonymized, opt-in) tool-call outcomes from production deployments feed back into scenario libraries

### 4. Governance, Community, and Contribution

- **Maintainer bench growth**: Currently bottlenecks on one global owner (@simonplmak-cloud) for safety-critical review
- **Skill council / working-group structure**: Domain experts (accessibility specialists, clinicians for non-clinical boundary review, i18n/localization contributors) co-review new skill proposals
- **Structured outreach**: Build on existing dev.to and LinkedIn manifesto posts to attract contributors from accessibility, ethics, and AI-safety communities
- **Visible "help wanted" board**: Convert tracking-only issues into contributor-friendly task descriptions

### 5. Distribution, Marketing, and Positioning

- **Cross-post to HN, Product Hunt, MCP directories** — launch-kit already scoped in PR #173
- **Submit to curated directories**: mcpservers.org, mcp.directory, mcpmarket.com — comparable accessibility and content-safety skills already listed there
- **Case studies**: Customer-support bot using De-escalation Plan, CMS using Accessibility Audit — concrete proof points
- **Leverage ESG/marine-conservation network**: Pilot Cultural Context Check and accessibility skills within nonprofit and multilateral organization communications

### 6. Monetization and Sustainability

| Option | Model |
|--------|-------|
| **Hosted "Pro" tier** | Higher-rate-limit remote endpoint, dashboards, priority support — core skills remain open-source |
| **Grant / sponsorship applications** | Accessibility foundations, digital-rights orgs, AI-safety funders |
| **GitHub Sponsors / Open Collective** | Fund maintainer time — safety-critical review currently single-person |
| **Enterprise support contracts** | For regulated products (healthcare, HR, government) embedding Humanity4AI skills |

### 7. Documentation, Localization, and Accessibility

- **Translate README.md, llms.txt, skill docs** into additional languages (v2.0 roadmap item)
- **Video walkthroughs and expanded Agent Adapter Guide** for new platforms
- **Dogfooding exercise**: Ensure the documentation site passes the project's own Accessibility Audit skill

---

## Prioritization Framework

| Initiative | Effort | Impact | Roadmap Alignment |
|-----------|--------|--------|-------------------|
| MCP Registry completion, platform adapters (v1.1) | Medium | High | Already committed |
| New skills (ESG/consumer-protection/financial literacy) | Medium | Medium-High | Extends skill pattern |
| Public trust dashboard / richer scenario scoring | High | High | Directly extends v2.0 |
| Directory/marketplace submissions | Low | Medium | Complements existing channels |
| Monetization / sponsorship | Medium | High (sustainability) | Gap identified |
| Maintainer bench expansion | Low-Medium | High (risk reduction) | Governance gap |
| Localization of docs and scenarios | Medium | Medium | Aligned with v2.0 multilingual |

**Highest-leverage:** Rich outcome-based scenario scoring + public trust dashboard — converts the project's core differentiator (evaluation gates, uncertainty disclosure) into externally verifiable proof.

**Lowest-friction:** Directory/marketplace submissions + maintainer-bench growth — compounds already-planned v1.1/v2.0 work without new architecture.

---

## References

1. project_human/README.md — "Humanity4AI is an open, community-driven project that provides reusable humanity skills"
2. Building humane behaviour into AI agents with MCP skill — AI agents calling tools rather than relying on prompts
3. Manifesto, principles.md, ROADMAP.md — five core principles, three operational families, v1.0/v1.1/v2.0 scoping
4. accessibility-review — Agent Skills Library (Anthropic) — comparable skill listed in external directory
5. WCAG Accessibility Audit Patterns — Claude Code Skill on MCP Market — comparable listing
6. Simon Mak: "Humanity for AI: A Call to Action" — LinkedIn manifesto post
7. accessibility-auditor — Agent Skill on mcp.directory — comparable directory listing
8. Accessibility Audit & WCAG Compliance — Claude Code Skill — comparable listing with remediation features
