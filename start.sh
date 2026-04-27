#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────
# Attack Path Insights — Startup Script (macOS / Linux)
# Qualys Enterprise TruRisk™ Platform · ETM Attack Path Module
# ─────────────────────────────────────────────────────────────────

set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORT=3000
VITE_PORT=5173
PID_FILE="$DIR/server.pid"
VITE_PID_FILE="$DIR/vite.pid"
LOG_FILE="$DIR/server.log"
VITE_LOG_FILE="$DIR/vite.log"

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

# ── Start static server (port 3000) ──────────────────────────────
if lsof -i ":$PORT" -sTCP:LISTEN &>/dev/null 2>&1 || \
   netstat -an 2>/dev/null | grep -q "[:.]$PORT.*LISTEN"; then
  echo -e "  ${YELLOW}[!]${NC} Port $PORT already in use — static server already running."
else
  echo -e "  ${YELLOW}[*]${NC} Starting static server on port $PORT..."
  nohup node "$DIR/server.cjs" > "$LOG_FILE" 2>&1 &
  SERVER_PID=$!
  echo $SERVER_PID > "$PID_FILE"
  sleep 2
  if kill -0 "$SERVER_PID" 2>/dev/null; then
    echo -e "  ${GREEN}[✓]${NC} Static server started (PID $SERVER_PID)"
  else
    echo -e "  ${RED}[ERROR]${NC} Static server failed to start. Check $LOG_FILE"
    rm -f "$PID_FILE"
    exit 1
  fi
fi

# ── Start Vite dev server (port 5173) ────────────────────────────
if lsof -i ":$VITE_PORT" -sTCP:LISTEN &>/dev/null 2>&1 || \
   netstat -an 2>/dev/null | grep -q "[:.]$VITE_PORT.*LISTEN"; then
  echo -e "  ${YELLOW}[!]${NC} Port $VITE_PORT already in use — Vite dev server already running."
else
  echo -e "  ${YELLOW}[*]${NC} Starting Vite dev server on port $VITE_PORT..."
  nohup node "$DIR/node_modules/vite/bin/vite.js" --port $VITE_PORT > "$VITE_LOG_FILE" 2>&1 &
  VITE_PID=$!
  echo $VITE_PID > "$VITE_PID_FILE"
  sleep 3
  if kill -0 "$VITE_PID" 2>/dev/null; then
    echo -e "  ${GREEN}[✓]${NC} Vite dev server started (PID $VITE_PID)"
  else
    echo -e "  ${RED}[ERROR]${NC} Vite dev server failed to start. Check $VITE_LOG_FILE"
    rm -f "$VITE_PID_FILE"
  fi
fi

# ── Open browser ─────────────────────────────────────────────────
echo -e "  ${YELLOW}[*]${NC} Opening React app in browser..."
sleep 1
if command -v open &>/dev/null; then
  open "http://localhost:$VITE_PORT/app.html#/insights"
elif command -v xdg-open &>/dev/null; then
  xdg-open "http://localhost:$VITE_PORT/app.html#/insights" &
fi

echo ""
echo "  ─────────────────────────────────────────────────"
echo "  URLs:"
echo -e "    React App (ETM)      : ${BOLD}${BLUE}http://localhost:$VITE_PORT/app.html#/insights${NC}"
echo -e "    Static Insights      : ${BLUE}http://localhost:$PORT/insights.html${NC}"
echo -e "    User Journey Workflow: ${BLUE}http://localhost:$PORT/workflow.html${NC}"
echo -e "    Original Screen      : ${BLUE}http://localhost:$PORT/index.html${NC}"
echo "  ─────────────────────────────────────────────────"
echo -e "  To stop: ${BOLD}./stop.sh${NC}   |   Logs: server.log · vite.log"
echo ""
