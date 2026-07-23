# Directory & Awesome-List Submission Pack — Humanity4AI

Ready-to-use submission text for awesome lists, MCP directories, and responsible-tech catalogs. Adapt to each directory's form fields. Submit in the week before the launch window so listings land during the traffic spike.

---

## Standard Submission Block

**Project Name:**
Humanity4AI (project_human)

**Short Description (1 sentence):**
Open-source collection of 9 rule-based "humanity skills" for AI agents — crisis detection, WCAG 2.2 auditing, empathetic reframing, cultural sensitivity, and more — exposed as MCP tools and npm package.

**Full Description (150 words):**
Humanity4AI is an open-source skill system that gives AI agents reusable, tested behaviors for humane interaction. Nine skills cover emotional safety (crisis detection + supportive replies, depression-sensitive content rewriting), accessibility (full WCAG 2.2 audit across all 86 success criteria), cognitive accessibility, cultural sensitivity, conflict de-escalation, empathetic communication, neurodiversity-aware design, and age-inclusive design.

All skills are rule-based — no LLM calls, no external APIs — with explicit safety boundaries, uncertainty disclosure (low/medium/high), and structured JSON-schema-validated outputs. Crisis-adjacent responses always route to professional resources, never AI substitutes.

Available as a standard MCP server (`npx @humanity4ai/mcp-servers`) compatible with Claude Code, OpenCode, Copilot, Cursor, and any MCP client, or as plain markdown skill packs usable via direct prompting. MIT license, 9 languages, 90%+ test coverage.

**URL:**
https://github.com/humanity4ai/project_human

**npm:**
https://www.npmjs.com/package/@humanity4ai/mcp-servers

**License:** MIT

**Category / Tags:**
MCP, Model Context Protocol, AI agents, accessibility, WCAG, mental health, content safety, inclusive design, neurodiversity, developer tools, open source, TypeScript, LLM tools, AI ethics, responsible AI

**Target Users:**
AI agent developers, MCP integrators, accessibility specialists, UX/content teams, mental-health-adjacent product teams, trust & safety teams

**Standards Alignment:**
WCAG 2.2 (all 86 success criteria), W3C COGA, ISO 9241-110, ISO/IEC 30071-1, Model Context Protocol (JSON-RPC 2.0)

---

## Priority Awesome Lists (GitHub PR submissions)

| List | Repo | Section | Entry format |
|------|------|---------|--------------|
| awesome-mcp-servers | punkpeye/awesome-mcp-servers | Appropriate category (see PR) | `- [humanity4ai/project_human](url) 🎖️ 🐍/📇 ☁️/🏠 - description` |
| awesome-a11y | brunopulis/awesome-a11y | Tools | Follow list format |
| awesome-ai-agents | e2b-dev/awesome-ai-agents | Tools/SDKs | Follow list format |
| awesome-llm-apps | Shubhamsaboo/awesome-llm-apps | MCP section | Follow list format |
| awesome (sindresorhus) related niche lists | search `awesome wcag`, `awesome mental health` | — | — |

## MCP Registries & Directories

| Directory | URL | Notes |
|-----------|-----|-------|
| Official MCP servers repo | github.com/modelcontextprotocol/servers | PR to community servers section |
| MCP Registry | github.com/mcp/registry (or registry.modelcontextprotocol.io) | Publish server metadata |
| Smithery | smithery.ai | MCP server directory — submit |
| Glama MCP directory | glama.ai/mcp/servers | Auto-indexed from GitHub; claim listing |
| PulseMCP | pulsemcp.com | Directory + newsletter |
| mcp.so | mcp.so | Directory submission |

## Responsible Tech / Accessibility Directories

| Directory | URL | Notes |
|-----------|-----|-------|
| The A11Y Project Resources | a11yproject.com/resources/ | Submit via GitHub PR |
| Responsible Tech Guide | responsibletechguide.com | Submission form |
| W3C COGA Community Group | w3.org/community/coga-community/ | Mailing list post (accessibility + cognitive skills) |

---

## Submission Notes

- **One PR per list**, follow each list's CONTRIBUTING.md exactly (alphabetical order, badge conventions, no marketing language).
- Lead with what it does in one clause; maintainers reject vague entries.
- Don't submit to all lists on the same day — spread across the pre-launch week so each merge is a separate touchpoint.
