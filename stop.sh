#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────
# Attack Path Insights — Shutdown Script (macOS / Linux)
# ─────────────────────────────────────────────────────────────────

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PID_FILE="$DIR/server.pid"
VITE_PID_FILE="$DIR/vite.pid"
PORT=3000
VITE_PORT=5173

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'

echo ""
echo -e "  ${YELLOW}[*]${NC} Stopping Attack Path Insights servers..."
echo ""

STOPPED=0

# ── Stop static server (PID file) ────────────────────────────────
if [ -f "$PID_FILE" ]; then
  SAVED_PID=$(cat "$PID_FILE")
  if kill -0 "$SAVED_PID" 2>/dev/null; then
    kill "$SAVED_PID" 2>/dev/null && echo -e "  ${GREEN}[✓]${NC} Static server stopped (PID $SAVED_PID)"
    STOPPED=1
  fi
  rm -f "$PID_FILE"
fi

# ── Stop static server (fallback: port) ──────────────────────────
PORT_PID=$(lsof -ti ":$PORT" 2>/dev/null || true)
if [ -n "$PORT_PID" ]; then
  kill -9 "$PORT_PID" 2>/dev/null && echo -e "  ${GREEN}[✓]${NC} Static server stopped (port $PORT, PID $PORT_PID)"
  STOPPED=1
fi

# ── Stop Vite dev server (PID file) ──────────────────────────────
if [ -f "$VITE_PID_FILE" ]; then
  VITE_PID=$(cat "$VITE_PID_FILE")
  if kill -0 "$VITE_PID" 2>/dev/null; then
    kill "$VITE_PID" 2>/dev/null && echo -e "  ${GREEN}[✓]${NC} Vite dev server stopped (PID $VITE_PID)"
    STOPPED=1
  fi
  rm -f "$VITE_PID_FILE"
fi

# ── Stop Vite dev server (fallback: port) ────────────────────────
VITE_PID=$(lsof -ti ":$VITE_PORT" 2>/dev/null || true)
if [ -n "$VITE_PID" ]; then
  kill -9 "$VITE_PID" 2>/dev/null && echo -e "  ${GREEN}[✓]${NC} Vite dev server stopped (port $VITE_PORT, PID $VITE_PID)"
  STOPPED=1
fi

# ── Result ───────────────────────────────────────────────────────
if [ "$STOPPED" -eq 0 ]; then
  echo -e "  ${YELLOW}[i]${NC} No servers found running on ports $PORT or $VITE_PORT."
else
  echo ""
  echo -e "  ${GREEN}[✓]${NC} All servers stopped. Run ./start.sh to restart."
fi
echo ""
