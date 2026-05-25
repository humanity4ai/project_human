# Humanity4AI

Humanity4AI is an open, community-driven project that provides reusable "humanity skills" for AI systems and agents.

[![CI](https://github.com/humanity4ai/project_human/actions/workflows/ci.yml/badge.svg)](https://github.com/humanity4ai/project_human/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/humanity4ai/project_human)](https://github.com/humanity4ai/project_human/releases)
[![Issues](https://img.shields.io/github/issues/humanity4ai/project_human)](https://github.com/humanity4ai/project_human/issues)
[![Contributors](https://img.shields.io/github/contributors/humanity4ai/project_human)](https://github.com/humanity4ai/project_human/graphs/contributors)
[![Pages](https://img.shields.io/badge/docs-GitHub%20Pages-1f2937)](https://humanity4ai.github.io/project_human/)

## Contents

- [Three Ways to Use Humanity4AI Skills](#three-ways-to-use-humanity4ai-skills)
- [Get Involved](#get-involved)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start-for-local-development)
- [Contribute in 10 Minutes](#contribute-in-10-minutes)
- [Safety Position](#safety-position)

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

### For AI Agents — Standard MCP SDK (JSON-RPC 2.0)

Start the standard MCP server compatible with Claude Code, Copilot, Manus AI, OpenCode, and any MCP SDK client:

```bash
pnpm start
```

Configure your agent by adding this to your MCP client config:

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

All 10 humanity skills are discoverable via `tools/list` and invocable via `tools/call`.
See [`mcp-servers/README.md`](mcp-servers/README.md) for full protocol details and tool reference.

Full install and deploy guide: [`INSTALL.md`](INSTALL.md)

## Docker (one command)

```bash
docker compose up
```

## MCP Runtime

`mcp-servers` exposes all 10 skill actions via the standard MCP SDK JSON-RPC 2.0 protocol:

| Server | Command | Protocol |
|--------|---------|----------|
| **Standard MCP SDK** | `pnpm start` | JSON-RPC 2.0 over stdio |

All tools include input validation, structured responses, safety boundaries, and uncertainty disclosure.
See [`mcp-servers/README.md`](mcp-servers/README.md) for the full tool reference.

## Alternative: Prompt Engineering

If your AI agent doesn't support MCP or skills, you can still use Humanity4AI by providing project content directly in the conversation context. This is less reliable than the MCP server but provides a good fallback.

### How It Works

You (the user) manually share the relevant file contents with your LLM. The LLM then applies those principles when responding to you. The best way to do this is to point the LLM to the `llms.txt` file.

### What to Share

Tell your LLM:

> "You are an AI assistant with the Humanity4AI skillset. Your primary goal is to interact with users in a humane, ethical, and context-aware manner. Start by reading the `llms.txt` file at the root of this repository to understand your capabilities, then apply the principles and skills you find there in our conversation."

Alternatively, you can provide the full context in one go:

> "Here is the full context for the Humanity4AI skillset. Apply these principles and skills in our conversation:
> 
> [Paste the entire content of `llms-full.txt` here]"

## Integrations

- OpenCode
- Claude Code
- Microsoft Copilot ecosystem
- Manus AI
- OpenClaw

See implementation notes in `docs/integrations.md` and `docs/agent-adapters.md`.

## Contribute in 10 Minutes

**Step 1 — Pick a task**

Browse [open starter issues](https://github.com/humanity4ai/project_human/issues/new/choose) or see `docs/good-first-issues.md` for curated tasks.

**Step 2 — Fork, branch, and implement**

```bash
# Clone your fork
git clone https://github.com/<your-username>/project_human.git
cd project_human

# Branch from main (the default branch)
git checkout main
git checkout -b my-contribution

# Copy the skill template if adding a new skill
cp -r templates/skill skills/my-skill-name

# Run all checks before opening a PR
pnpm check && pnpm evals && pnpm test
```

**Step 3 — Open a PR targeting `main`**

```bash
gh pr create \
  --base main \
  --title "Add: my contribution" \
  --body "Closes #<issue-number>"
```

Or open via GitHub UI — the default base branch is `main`.

**Troubleshooting**

| Error | Fix |
|-------|-----|
| `ERR_PNPM_OUTDATED_LOCKFILE` | Run `pnpm install` (without `--frozen-lockfile`) to update the lockfile, then commit `pnpm-lock.yaml` |
| `pnpm: command not found` | Run `npm install -g pnpm` |
| `pnpm evals` fails | Run `EVAL_REPORT=1 pnpm evals` — the report at `evals/reports/latest.md` shows which gates failed and why |

## Traction and Roadmap

- 14-day launch cadence: `docs/traction-14-day.md`
- Quality gates: `docs/quality-gates.md`
- Release roadmap: `ROADMAP.md`

## How To Help This Week

- Good first issues: https://github.com/humanity4ai/project_human/issues?q=is%3Aopen+label%3A%22good+first+issue%22
- Help wanted: https://github.com/humanity4ai/project_human/issues?q=is%3Aopen+label%3A%22help+wanted%22

## Package Release

`mcp-servers` is now prepared as a publishable package with build artifacts and schema exports.

- Build package: `pnpm --filter @humanity4ai/mcp-servers build`
- Create tarball: `pnpm --filter @humanity4ai/mcp-servers pack`
- Release guide: `docs/package-release.md`

## Safety Position

Humanity4AI includes non-clinical support-oriented skills. It does not provide diagnosis, treatment, or professional medical/legal advice.
