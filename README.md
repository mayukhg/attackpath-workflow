# Attack Path Insights — Qualys ETM Module

> **Qualys Enterprise TruRisk™ Platform** · Attack Path — User Journey Prototype

A self-contained, CDN-based React prototype demonstrating the full Attack Path Insights user experience across three workflow stages: **Discover → Analyze → Remediate**.

---

## Screens

| URL | Description |
|-----|-------------|
| `http://localhost:3000/insights.html` | **Attack Path Insights** — main screen (3 tabs) |
| `http://localhost:3000/workflow.html` | **User Journey Workflow** diagram |
| `http://localhost:3000/index.html`    | Original Attack Path — Qualys reference screen |

---

## Quick Start

### Windows
```bat
start.bat       # starts server + opens browser
stop.bat        # gracefully stops the server
```

### macOS / Linux
```bash
chmod +x start.sh stop.sh
./start.sh      # starts server + opens browser
./stop.sh       # gracefully stops the server
```

The server runs on **port 3000**. No build step required — all dependencies loaded from CDN.

---

## Architecture

```
AP_Test/
├── index.html        # Original Attack Path — Qualys screen (CDN React)
├── insights.html     # Attack Path Insights — new 3-tab screen (CDN React)
├── workflow.html     # User journey workflow diagram (pure HTML/CSS)
├── server.cjs        # Lightweight Node.js HTTP server (port 3000)
├── start.bat / start.sh   # Startup scripts
├── stop.bat  / stop.sh    # Shutdown scripts
└── src/              # Vite-based JSX source (reference only)
    ├── App.jsx
    └── components/
        ├── AttackPathQualys.jsx
        └── AttackPathInsights.jsx
```

**Runtime:** No build step. `server.cjs` serves static files directly.
**Dependencies:** React 18, Tailwind CSS, Babel Standalone — all via CDN.

---

## Attack Path Insights — Feature Overview

### 01 Discover
- 5 KPI summary cards (Total Paths, Critical, Avg Score, Crown Jewels, Entry Points)
- Quick filters: Severity · Entry Point Type · Time Range
- Free-text search across path titles and crown jewel targets
- Sortable attack paths table with CID, chain, severity, hops/gaps, risk score
- **Click "Analyze"** on any row → auto-switches to Analyze tab with CID context

### 02 Analyze
- Path context header (severity, status, risk score, back navigation)
- Multi-step attack path flow visualization (entry → crown jewel nodes)
- Security gap chaining (cloud misconfig + CVE + identity weakness)
- Privilege escalation mapping (expandable step-by-step, MITRE ATT&CK tagged)
- Asset metadata enrichment (OS, ports, services, exploitability)
- Identity & lateral movement mapping (AD groups, GPOs, escalation risk)

### 03 Remediate
- Prioritized remediation actions (Critical → Low) with ETA and effort rating
- **Mark as Fixed / Create Ticket / Suppress** — per-action state management
- Toxic combination identification (auto-flagged ≥3 critical risk factors)
- Contextual risk scoring (base → adjusted score with topological delta)

---

## Template

Follows the **Qualys ETM template**:
- Qualys red (`#E5002B`) brand header
- Dark ETM sidebar (`hsl(220,30%,18%)`) with active nav state
- Light content area with Tailwind slate palette
- Inter typeface via Google Fonts

---

## Reference

- Source design inspiration: [Lovable App Prototype](https://requirement-whisperer-69.lovable.app)
- UX concept: Attack Path User Experience (01 Integrated ETM · 02 Discovery & Analysis · 03 Risk & Action)
