# Install and Deploy Guide

**Copyright (c) 2026 Ascent Partners Foundation. MIT License.**

---

## Prerequisites

| Requirement | Minimum version | Install |
|-------------|----------------|---------|
| Node.js | 20.x LTS or later | [nodejs.org/download](https://nodejs.org/en/download) |
| pnpm | 10.x or later | `npm install -g pnpm` |
| Git | Any recent version | [git-scm.com](https://git-scm.com) |
| Docker | 24.x or later (optional) | [docs.docker.com/get-docker](https://docs.docker.com/get-docker/) |

---

## Option A — Local install (Node + pnpm)

### 1. Clone the repository

```bash
git clone https://github.com/humanity4ai/project_human.git
cd project_human
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Verify the install

```bash
pnpm check   # TypeScript type checks
pnpm evals   # Skill quality gates (all 11 should pass)
```

Expected output:

```
PASS  wcag-aaa-accessibility
PASS  depression-sensitive-content
...
PASS  contract-consistency

All 11 checks passed.
```

### 4. Start the MCP server

```bash
pnpm start:mcp
```

The server will print a startup banner to stderr:

```
Humanity4AI MCP Server v0.1.0
Actions: 10 registered
Protocol: line-delimited JSON (see docs/protocol.md)
Ready — waiting for requests on stdin
```

### 5. Send your first request

Open a second terminal and run:

```bash
echo '{"id":"1","type":"list_actions"}' \
  | pnpm --filter @humanity4ai/mcp-servers exec tsx src/server.ts
```

You should receive a JSON response listing all 10 registered actions.

### 6. Invoke a skill

```bash
echo '{"id":"2","type":"invoke","payload":{"action":"supportive_reply","input":{"message":"I feel overwhelmed","risk_level":"medium"}}}' \
  | pnpm --filter @humanity4ai/mcp-servers exec tsx src/server.ts
```

---

## Option B — Docker (recommended for production)

Docker requires no Node.js install on the host machine.

### 1. Clone the repository

```bash
git clone https://github.com/humanity4ai/project_human.git
cd project_human
```

### 2. Start with Docker Compose

```bash
docker compose up --build
```

### 3. Send a request to the running container

```bash
echo '{"id":"1","type":"list_actions"}' \
  | docker compose exec -T mcp-server node dist/server.js
```

### 4. Run in background

```bash
docker compose up --build -d
```

### 5. Stop

```bash
docker compose down
```

---

## Option C — npm package install

For integrating the MCP contracts and handlers into your own project:

```bash
pnpm add @humanity4ai/mcp-servers
# or
npm install @humanity4ai/mcp-servers
```

Then import contracts:

```ts
import { actionContracts, validateContracts } from "@humanity4ai/mcp-servers";
import { invokeAction } from "@humanity4ai/mcp-servers/handlers";

const result = invokeAction("supportive_reply", {
  message: "I feel overwhelmed",
  risk_level: "medium"
});

if (result.ok) {
  console.log(result.data.output);
}
```

---

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `EVAL_REPORT` | `0` | Set to `1` to write a markdown report to `evals/reports/latest.md` |
| `NODE_ENV` | `development` | Set to `production` for production deployments |

---

## Troubleshooting

### `pnpm: command not found`

Install pnpm globally:

```bash
npm install -g pnpm
```

### `error TS...` on `pnpm check`

Ensure you are using Node.js >= 20:

```bash
node --version  # should be v20.x or higher
```

### Server starts but returns no output

The server reads from stdin and writes to stdout. Pipe your request correctly:

```bash
echo '{"id":"1","type":"list_actions"}' | pnpm start:mcp
```

Do not run `pnpm start:mcp` interactively without piping input — it will wait silently.

### Docker: `port already in use`

The MCP server uses stdin/stdout only — no TCP ports are exposed. This error is unrelated to Humanity4AI. Check for port conflicts in your `docker-compose.yml` if you have added custom services.

---

## Verify everything works

Run this checklist before deploying to any environment:

```bash
pnpm install           # Dependencies installed
pnpm check             # TypeScript passes
pnpm build             # Package builds cleanly
pnpm evals             # All 11 quality gates pass
echo '{"id":"1","type":"list_actions"}' | pnpm --filter @humanity4ai/mcp-servers exec tsx src/server.ts
# Should return JSON with 10 actions
```
