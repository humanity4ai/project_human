#!/usr/bin/env bash
# Humanity4AI — One-Line Installer
# Supports: Windows (WSL/Git Bash), macOS, Linux
# Prerequisites: Node.js >= 22

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}╔══════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║     Humanity4AI — One-Line Installer    ║${NC}"
echo -e "${CYAN}║         v1.0.0 — 11 Humanity Skills     ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════╝${NC}"
echo ""

# ── Check Node.js ──────────────────────────────────────────────────────────
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is required but not installed.${NC}"
    echo "Download from: https://nodejs.org (v22 or later)"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo -e "${RED}Node.js v22 or later required. Current: $(node -v)${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js $(node -v)${NC}"

# ── Check pnpm ─────────────────────────────────────────────────────────────
if ! command -v pnpm &> /dev/null; then
    echo -e "${CYAN}Installing pnpm...${NC}"
    npm install -g pnpm
fi
echo -e "${GREEN}✓ pnpm $(pnpm -v)${NC}"

# ── Clone and install ──────────────────────────────────────────────────────
INSTALL_DIR="${HOME}/humanity4ai"
if [ -d "$INSTALL_DIR" ]; then
    echo -e "${CYAN}Updating existing installation at $INSTALL_DIR...${NC}"
    cd "$INSTALL_DIR"
    git pull origin main
else
    echo -e "${CYAN}Cloning to $INSTALL_DIR...${NC}"
    git clone --depth 1 https://github.com/humanity4ai/project_human.git "$INSTALL_DIR"
    cd "$INSTALL_DIR"
fi

echo -e "${CYAN}Installing dependencies...${NC}"
pnpm install --frozen-lockfile

# ── Verify ─────────────────────────────────────────────────────────────────
echo -e "${CYAN}Running verification checks...${NC}"
pnpm check && pnpm evals

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   Installation complete!                 ║${NC}"
echo -e "${GREEN}║                                          ║${NC}"
echo -e "${GREEN}║   Start the server:                      ║${NC}"
echo -e "${GREEN}║   cd $INSTALL_DIR && pnpm start         ║${NC}"
echo -e "${GREEN}║                                          ║${NC}"
echo -e "${GREEN}║   Configure your agent (see README)      ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════╝${NC}"
