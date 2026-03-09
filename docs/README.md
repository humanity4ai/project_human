# Humanity4AI Documentation Index

**Copyright (c) 2026 Ascent Partners Foundation. MIT License.**

This is the central documentation hub for the `humanity4ai/project_human` repository. It provides a comprehensive, linked table of contents for all documentation, source files, and reference materials.

For LLM-native discovery, start with [`/llms.txt`](../llms.txt) at the repository root.

---

## Quick Navigation

| I want to... | Go to |
|---|---|
| Understand the project's values | [Core Principles](../knowledge-core/principles.md) |
| Start the MCP server | [README — MCP Runtime v0.1](../README.md#mcp-runtime-v01) |
| See all 10 tool signatures | [llms.txt — Tool Signatures](../llms.txt#tool-signatures) |
| Integrate with Claude / Cursor / n8n | [Agent Adapter Guide](./agent-adapters.md) |
| Read a specific skill specification | [Skill Reference](#skill-reference) below |
| Contribute a new skill | [Contributing Guide](../CONTRIBUTING.md) |
| Find a starter task | [Good First Issues](./good-first-issues.md) |

---

## Core Concepts

The following files establish the foundational principles and vocabulary of the project. All contributors and integrators should read these first.

| Document | Description |
|---|---|
| [Core Principles](../knowledge-core/principles.md) | The five core principles that govern all skills and interactions. |
| [Taxonomy](../knowledge-core/taxonomy.md) | The 10 launch categories for skills and their scope. |
| [Uncertainty Schema](../knowledge-core/uncertainty-schema.md) | The schema used to disclose uncertainty in all tool outputs. |
| [System Prompt](../SYSTEM_PROMPT.md) | The canonical system prompt for LLMs using the Humanity4AI skillset. |
| [Manifesto](./manifesto.md) | The broader vision and mission of the Humanity4AI project. |

---

## MCP Server

The MCP server is the primary runtime for all 10 skills. It implements the official `@modelcontextprotocol/sdk` JSON-RPC 2.0 protocol over stdio.

| Document | Description |
|---|---|
| [MCP Server README](../mcp-servers/README.md) | Full reference for all 10 tools, including input/output schemas. |
| [Agent Adapter Guide](./agent-adapters.md) | Step-by-step integration examples for all major agent platforms. |
| [Protocol Specification](./protocol.md) | The formal protocol specification for the MCP server. |
| [Action Contracts Source](../mcp-servers/src/index.ts) | TypeScript source for all 10 action contracts. |
| [MCP Server Source](../mcp-servers/src/mcp-server.ts) | Full MCP server implementation with tool registrations. |
| [Handler Source](../mcp-servers/src/handlers.ts) | All 10 action handler implementations. |

---

## Skill Reference

Each skill is defined by a `SKILL.md` file containing its purpose, boundaries, principles, step-by-step instructions, and worked examples.

| Skill | Category | Specification |
|---|---|---|
| Age-Inclusive Design | `age-inclusion` | [SKILL.md](../skills/age-inclusive-design/SKILL.md) |
| Cognitive Accessibility | `cognitive-support` | [SKILL.md](../skills/cognitive-accessibility/SKILL.md) |
| Conflict De-escalation | `conflict-navigation` | [SKILL.md](../skills/conflict-de-escalation/SKILL.md) |
| Cultural Sensitivity | `cultural-context` | [SKILL.md](../skills/cultural-sensitivity/SKILL.md) |
| Depression-Sensitive Content | `emotional-safety` | [SKILL.md](../skills/depression-sensitive-content/SKILL.md) |
| Empathetic Communication | `communication` | [SKILL.md](../skills/empathetic-communication/SKILL.md) |
| Grief & Loss Support | `emotional-safety` | [SKILL.md](../skills/grief-loss-support/SKILL.md) |
| Neurodiversity-Aware Design | `neurodiversity` | [SKILL.md](../skills/neurodiversity-aware-design/SKILL.md) |
| Supportive Conversation | `communication` | [SKILL.md](../skills/supportive-conversation/SKILL.md) |
| WCAG AAA Accessibility | `accessibility` | [SKILL.md](../skills/wcag-aaa-accessibility/SKILL.md) |

The full structured index of all skills is available at [`skills/index.yaml`](../skills/index.yaml).

---

## LLM Discovery Files

These files are designed for LLM consumption and provide structured, machine-readable access to the entire repository.

| File | Description |
|---|---|
| [`llms.txt`](../llms.txt) | The main LLM discovery entry point. Contains all tool signatures and links to all key files with absolute URLs. |
| [`llms-full.txt`](../llms-full.txt) | A single-file version with all content embedded inline. Use this when you need to load the entire repository into a single context window. |

---

## Governance & Contribution

| Document | Description |
|---|---|
| [Contributing Guide](../CONTRIBUTING.md) | How to contribute a new skill or improvement. |
| [Good First Issues](./good-first-issues.md) | A curated list of starter tasks for new contributors. |
| [Governance](../GOVERNANCE.md) | Project governance model and decision-making process. |
| [Code of Conduct](../CODE_OF_CONDUCT.md) | Community standards and expectations. |
| [Security Policy](../SECURITY.md) | How to report security vulnerabilities. |
| [Maintainers](../MAINTAINERS.md) | Current project maintainers and their responsibilities. |

---

## Operations & Release

| Document | Description |
|---|---|
| [Install Guide](../INSTALL.md) | How to install and run the project locally. |
| [Operations Guide](../OPERATIONS.md) | Operational runbook for maintainers. |
| [Release Notes](../RELEASE_NOTES.md) | Changelog for all releases. |
| [Roadmap](../ROADMAP.md) | Planned features and milestones. |
| [Release Process](./release-process.md) | Step-by-step guide for cutting a new release. |
| [Package Release](./package-release.md) | Guide for publishing the npm package. |
| [Quality Gates](./quality-gates.md) | Automated and manual quality checks required before release. |
| [Repository Map](../REPO_MAP.md) | A directory-level map of the entire repository. |

---

## Worked Examples

| Document | Description |
|---|---|
| [Worked Example](./worked-example.md) | An end-to-end example of using the MCP server to invoke a skill. |
