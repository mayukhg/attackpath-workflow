#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────
# Attack Path Insights — Startup Script (macOS / Linux)
# Qualys Enterprise TruRisk™ Platform · ETM Attack Path Module
# ─────────────────────────────────────────────────────────────────

set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORT=3000
PID_FILE="$DIR/server.pid"
LOG_FILE="$DIR/server.log"

# ── Colours ──────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
BLUE='\033[0;34m'; BOLD='\033[1m'; NC='\033[0m'

echo ""
echo -e "${BOLD}  Attack Path Insights — ETM Module${NC}"
echo "  ─────────────────────────────────────────────────"
echo ""

# ── Check Node.js ────────────────────────────────────────────────
if ! command -v node &>/dev/null; then
  echo -e "  ${RED}[ERROR]${NC} Node.js not found. Install from https://nodejs.org"
  exit 1
fi

# ── Check if already running ─────────────────────────────────────
if lsof -i ":$PORT" -sTCP:LISTEN &>/dev/null 2>&1 || \
   netstat -an 2>/dev/null | grep -q "[:.]$PORT.*LISTEN"; then
  echo -e "  ${YELLOW}[!]${NC} Port $PORT already in use — server may already be running."
  echo ""
  echo -e "  ${BLUE}Opening app in browser...${NC}"
  if command -v open &>/dev/null; then
    open "http://localhost:$PORT/insights.html"
  elif command -v xdg-open &>/dev/null; then
    xdg-open "http://localhost:$PORT/insights.html"
  fi
  echo ""
  echo "  URLs:"
  echo -e "    Attack Path Insights : ${BLUE}http://localhost:$PORT/insights.html${NC}"
  echo -e "    User Journey Workflow: ${BLUE}http://localhost:$PORT/workflow.html${NC}"
  echo -e "    Original Screen      : ${BLUE}http://localhost:$PORT/index.html${NC}"
  exit 0
fi

# ── Start server ─────────────────────────────────────────────────
echo -e "  ${YELLOW}[*]${NC} Starting server on port $PORT..."
nohup node "$DIR/server.cjs" > "$LOG_FILE" 2>&1 &
SERVER_PID=$!
echo $SERVER_PID > "$PID_FILE"

# ── Wait for ready ───────────────────────────────────────────────
echo -e "  ${YELLOW}[*]${NC} Waiting for server to initialise..."
sleep 2

# ── Verify ───────────────────────────────────────────────────────
if kill -0 "$SERVER_PID" 2>/dev/null; then
  echo -e "  ${GREEN}[✓]${NC} Server started  (PID $SERVER_PID)"
else
  echo -e "  ${RED}[ERROR]${NC} Server failed to start. Check $LOG_FILE"
  rm -f "$PID_FILE"
  exit 1
fi

# ── Open browser ─────────────────────────────────────────────────
echo -e "  ${YELLOW}[*]${NC} Opening in browser..."
sleep 1
if command -v open &>/dev/null; then
  open "http://localhost:$PORT/insights.html"
elif command -v xdg-open &>/dev/null; then
  xdg-open "http://localhost:$PORT/insights.html" &
fi

echo ""
echo "  ─────────────────────────────────────────────────"
echo "  URLs:"
echo -e "    Attack Path Insights : ${BLUE}http://localhost:$PORT/insights.html${NC}"
echo -e "    User Journey Workflow: ${BLUE}http://localhost:$PORT/workflow.html${NC}"
echo -e "    Original Screen      : ${BLUE}http://localhost:$PORT/index.html${NC}"
echo "  ─────────────────────────────────────────────────"
echo -e "  To stop: ${BOLD}./stop.sh${NC}   |   Logs: server.log"
echo ""
