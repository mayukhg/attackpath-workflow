#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────
# Qualys Cloud Platform — Startup Script (macOS / Linux)
# Qualys Enterprise TruRisk™ Platform · ETM Module
# ─────────────────────────────────────────────────────────────────

set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORT=5173
PID_FILE="$DIR/vite.pid"
LOG_FILE="$DIR/vite.log"

# ── Colours ──────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
BLUE='\033[0;34m'; BOLD='\033[1m'; NC='\033[0m'

echo ""
echo -e "${BOLD}  Qualys Cloud Platform — ETM Module${NC}"
echo "  ─────────────────────────────────────────────────"
echo ""

# ── Check Node.js ────────────────────────────────────────────────
if ! command -v node &>/dev/null; then
  echo -e "  ${RED}[ERROR]${NC} Node.js not found. Install from https://nodejs.org"
  exit 1
fi

# ── Check if port is already in use ──────────────────────────────
if lsof -i ":$PORT" -sTCP:LISTEN &>/dev/null 2>&1 || \
   netstat -an 2>/dev/null | grep -q "[:.]$PORT.*LISTEN"; then
  echo -e "  ${YELLOW}[!]${NC} Port $PORT already in use — server already running."
  echo -e "  ${YELLOW}[*]${NC} Opening app in browser..."
  sleep 1
  if command -v open &>/dev/null; then
    open "http://localhost:$PORT/"
  elif command -v xdg-open &>/dev/null; then
    xdg-open "http://localhost:$PORT/" &
  fi
  echo ""
  echo -e "  URL: ${BOLD}${BLUE}http://localhost:$PORT/${NC}"
  echo ""
  exit 0
fi

# ── Start Vite dev server ─────────────────────────────────────────
echo -e "  ${YELLOW}[*]${NC} Starting Vite dev server on port $PORT..."
nohup node "$DIR/node_modules/vite/bin/vite.js" --port $PORT > "$LOG_FILE" 2>&1 &
VITE_PID=$!
echo $VITE_PID > "$PID_FILE"
sleep 3

if kill -0 "$VITE_PID" 2>/dev/null; then
  echo -e "  ${GREEN}[✓]${NC} Vite dev server started (PID $VITE_PID)"
else
  echo -e "  ${RED}[ERROR]${NC} Vite dev server failed to start. Check $LOG_FILE"
  rm -f "$PID_FILE"
  exit 1
fi

# ── Open browser ─────────────────────────────────────────────────
echo -e "  ${YELLOW}[*]${NC} Opening Qualys Cloud Platform in browser..."
sleep 1
if command -v open &>/dev/null; then
  open "http://localhost:$PORT/"
elif command -v xdg-open &>/dev/null; then
  xdg-open "http://localhost:$PORT/" &
fi

echo ""
echo "  ─────────────────────────────────────────────────"
echo -e "  URL: ${BOLD}${BLUE}http://localhost:$PORT/${NC}"
echo "  ─────────────────────────────────────────────────"
echo -e "  To stop: ${BOLD}./stop.sh${NC}   |   Logs: vite.log"
echo ""
