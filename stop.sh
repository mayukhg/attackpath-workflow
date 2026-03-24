#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────
# Attack Path Insights — Shutdown Script (macOS / Linux)
# ─────────────────────────────────────────────────────────────────

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PID_FILE="$DIR/server.pid"
PORT=3000

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'

echo ""
echo -e "  ${YELLOW}[*]${NC} Stopping Attack Path Insights server..."
echo ""

STOPPED=0

# ── Try PID file ─────────────────────────────────────────────────
if [ -f "$PID_FILE" ]; then
  SAVED_PID=$(cat "$PID_FILE")
  echo -e "  ${YELLOW}[*]${NC} Found saved PID: $SAVED_PID"
  if kill -0 "$SAVED_PID" 2>/dev/null; then
    kill "$SAVED_PID" 2>/dev/null && echo -e "  ${GREEN}[✓]${NC} Stopped PID $SAVED_PID"
    STOPPED=1
  fi
  rm -f "$PID_FILE"
fi

# ── Fallback: find by port ────────────────────────────────────────
PORT_PID=$(lsof -ti ":$PORT" 2>/dev/null || true)
if [ -n "$PORT_PID" ]; then
  echo -e "  ${YELLOW}[*]${NC} Killing process on port $PORT: PID $PORT_PID"
  kill -9 "$PORT_PID" 2>/dev/null && echo -e "  ${GREEN}[✓]${NC} Stopped PID $PORT_PID"
  STOPPED=1
fi

# ── Result ───────────────────────────────────────────────────────
if [ "$STOPPED" -eq 0 ]; then
  echo -e "  ${YELLOW}[i]${NC} No server found running on port $PORT."
else
  echo ""
  echo -e "  ${GREEN}[✓]${NC} Server stopped. Run ./start.sh to restart."
fi
echo ""
