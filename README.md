# Humanity4AI

Humanity4AI is an open, community-driven project that provides reusable "humanity skills" for AI systems and agents.

[![CI](https://github.com/humanity4ai/project_human/actions/workflows/ci.yml/badge.svg)](https://github.com/humanity4ai/project_human/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/humanity4ai/project_human)](https://github.com/humanity4ai/project_human/releases)
[![Issues](https://img.shields.io/github/issues/humanity4ai/project_human)](https://github.com/humanity4ai/project_human/issues)
[![Contributors](https://img.shields.io/github/contributors/humanity4ai/project_human)](https://github.com/humanity4ai/project_human/graphs/contributors)
[![Pages](https://img.shields.io/badge/docs-GitHub%20Pages-1f2937)](https://humanity4ai.github.io/project_human/)

## Three Ways to Use Humanity4AI Skills

This repository provides **10 Humanity Skills** — reusable, testable specifications for humane AI behaviour covering empathy, accessibility, grief support, cultural sensitivity, and more. There are three distinct ways to access these skills, depending on your AI platform and its capabilities.

| Method | Skills Access | Best for... | How it Works |
|---|---|---|---|
| **1. MCP Server** | All 10 skills as invocable tools | Developer tools (VS Code, Cursor) and agents (Manus AI, OpenCode) | Run a local server that exposes all 10 skills as tools via the Model Context Protocol (MCP). |
| **2. LLM Prompting** | Any skill via context window | Web chat AIs (Claude, Gemini, ChatGPT) | Provide the content of `llms.txt` or a specific `SKILL.md` directly in the chat context. |
| **3. Local Files** | Any skill via filesystem | CLI tools without web access (OpenCode) | Clone the repository and point the tool to the relevant `SKILL.md` file path. |

---

### Method 1: MCP Server (for Developer Tools & Agents)

This is the most reliable and structured way to use the skills.

**Step 1 — Start the server:**

```bash
# From the project root
pnpm start
```

**Step 2 — Configure your agent:**

Add the following to your agent's MCP configuration file. See the [Agent Adapter Guide](docs/agent-adapters.md) for platform-specific file paths.

```json
{
  "mcpServers": {
    "humanity4ai": {
      "command": "pnpm",
      "args": ["--filter", "@humanity4ai/mcp-servers", "start"],
      "cwd": "/path/to/project_human"
    }
  }
}
```

Once configured, all 10 skills are discoverable via `tools/list` and invocable via `tools/call`.

---

### Method 2: LLM Prompting (for Web Chat AIs)

This method is for web-based chat interfaces like Claude, Gemini, and ChatGPT. It relies on the LLM's ability to read context provided directly in the prompt.

**Step 1 — Provide the context:**

Tell your LLM:

> "You are an AI assistant with the Humanity4AI skillset. Your primary goal is to interact with users in a humane, ethical, and context-aware manner. Start by reading the `llms.txt` file at the root of this repository to understand your capabilities, then apply the principles and skills you find there in our conversation."

**Step 2 — Verify and interact:**

The LLM should acknowledge the context and begin applying the principles. Note that not all web chat AIs can fetch URLs. If the LLM cannot access `llms.txt`, you can paste the content of `llms-full.txt` directly into the chat.

---

### Method 3: Local Files (for Offline CLI Tools)

This method is for tools like OpenCode that operate on a local filesystem and do not have web access.

**Step 1 — Clone the repository:**

```bash
git clone https://github.com/humanity4ai/project_human.git
```

**Step 2 — Point your tool to the local path:**

Follow the instructions for your specific tool to have it read the files from the cloned repository directory.

---

## Get Involved

- **Contributors**: [Contributing Guide](CONTRIBUTING.md)
- **Integrators**: [Agent Adapter Guide](docs/agent-adapters.md)
- **Team**: [Operations Plan](OPERATIONS.md)
- **Public Site**: <https://humanity4ai.github.io/project_human/>

## Prerequisites

- **Node.js** >= 20
- **pnpm** >= 10

## Quick Start (for local development)

```bash
git clone https://github.com/humanity4ai/project_human.git
cd project_human
pnpm install
pnpm check
pnpm evals
```
