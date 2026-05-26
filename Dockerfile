# Humanity4AI MCP Server
# Copyright (c) 2026 Ascent Partners Foundation. MIT License.
#
# Build:  docker build -t humanity4ai-mcp .
# Run:    echo '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' | docker run --rm -i humanity4ai-mcp

FROM node:22-alpine AS base
WORKDIR /app
RUN npm install -g pnpm@10

# ── Install dependencies ──────────────────────────────────────────────────────
FROM base AS deps
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY mcp-servers/package.json ./mcp-servers/package.json
COPY evals/package.json ./evals/package.json
RUN pnpm install --frozen-lockfile

# ── Build ─────────────────────────────────────────────────────────────────────
FROM deps AS builder
COPY tsconfig.base.json ./
COPY mcp-servers/ ./mcp-servers/
RUN pnpm --filter @humanity4ai/mcp-servers build

# ── Production image ──────────────────────────────────────────────────────────
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

RUN apk add --no-cache procps

# Only copy what is needed to run the server
COPY --from=builder /app/mcp-servers/dist ./mcp-servers/dist
COPY --from=builder /app/mcp-servers/schemas ./mcp-servers/schemas
COPY --from=builder /app/mcp-servers/package.json ./mcp-servers/package.json
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/mcp-servers/node_modules ./mcp-servers/node_modules

WORKDIR /app/mcp-servers

# The server communicates via stdin/stdout — no ports exposed
CMD ["node", "dist/mcp-server.js"]

# Health check: verify the server process is running
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD pgrep -f "node dist/mcp-server.js" > /dev/null || exit 1
