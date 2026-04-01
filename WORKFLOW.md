# Attack Path Insights — Complete App Workflow Description

> **Product**: Qualys Enterprise TruRisk™ Platform — Attack Path Module
> **Version**: Current (dark-theme build)
> **Last Updated**: April 2026

---

## 1. Application Overview

The Attack Path Insights app is a dark-themed React single-page application embedded within the Qualys Enterprise TruRisk Management (ETM) platform. Its purpose is to surface multi-hop attack paths across an organisation's environment, enabling security teams to discover exposures, trace adversarial chains, and take prioritised remediation action.

The app follows a **three-step sequential workflow**: Discover → Analyze → Remediate.

---

## 2. Entry Points & Routing

| URL | Component | Description |
|-----|-----------|-------------|
| `http://localhost:5173/app.html#/insights` | `AttackPathInsights` | Primary dark-theme dashboard (main workflow) |
| `http://localhost:5173/app.html` | `AttackPathQualys` | Legacy light-theme prototype view |
| `http://localhost:3000/workflow.html` | Static HTML | Visual user journey flow diagram |
| `http://localhost:3000/diagram.html` | Static HTML | Exportable attack path canvas (PNG/GIF export) |

Routing is hash-based (`window.location.hash`). The `#/insights` hash loads the full three-tab Discover → Analyze → Remediate experience.

---

## 3. Shell Layout (Persistent Across All Tabs)

### Top Header Bar
- **Qualys logo** (red shield icon) + "Enterprise TruRisk™ Platform" wordmark
- **Right controls**: Search icon, Notifications bell, Settings gear, User avatar (A)

### Left Sidebar — ETM Navigation
Always visible, 176px wide, dark navy background (`bg-[hsl(220,30%,18%)]`).

| Nav Item | State |
|----------|-------|
| Add-ons | Inactive |
| Cyber Risk Assistant | Inactive |
| Home | Inactive |
| Dashboard | Inactive |
| Inventory | Inactive |
| Risk Management | Inactive |
| Attack Path | **Active** (indigo highlight) |

### Page Heading (below header, above tabs)
- GitBranch icon + **"Attack Path Insights"** title (h1)
- Subtitle: *"Qualys TotalCloud — Adversarial mapping, analysis & risk-correlated remediation"*

### Tab Strip
Three tabs rendered as a horizontal bar with bottom-border active indicator:

| Tab | Label | Icon | Badge |
|-----|-------|------|-------|
| 01 | Discover | Eye | — |
| 02 | Analyze | Target | Shows "CID {id}" when a path is selected |
| 03 | Remediate | Wrench | — |

Clicking a tab switches the content area. Selecting a path in Discover or clicking "Ready to Remediate" in Analyze auto-navigates to the appropriate next tab.

---

## 4. Tab 01 — Discover

**Goal**: Browse, filter, and select attack paths for deep analysis.

### 4.1 Stats Bar
Five summary metric cards displayed in a 5-column grid at the top:

| Metric | Value | Colour |
|--------|-------|--------|
| Total Paths | 14 | Slate |
| Critical Paths | 5 | Red |
| Avg Risk Score | 73 | Orange |
| Crown Jewels at Risk | 2 | Purple |
| Entry Points | 4 | Blue |

### 4.2 Quick Filters Panel (left, 208px wide)

**Severity Filter** — clicking a button applies an immediate client-side filter to the table:
- All (14) — default
- Critical (5)
- High (7)
- Medium (2)

**Entry Point Type** — informational only (counts visible, not clickable):
- Internet / Web API — 6 paths
- S3 / Cloud Storage — 3 paths
- VPN Entry — 3 paths
- Lambda / Serverless — 2 paths

**Time Range** — toggle buttons (Last 7 Days / Last 30 Days / Last 90 Days):
- "Last 30 Days" is the default active selection.

### 4.3 Attack Paths Table (main area)

**Table Header**
- "Attack Paths" label + filtered count badge (e.g., "5 of 14")
- Live search input (filters by path title OR crown jewel target)
- Refresh icon button

**Column Schema** (8 columns):

| Column | Content |
|--------|---------|
| CID | Numeric path ID (e.g., 5014, 5024) |
| Attack Path Title / Chain | Path name (bold) + path string (monospace, truncated) |
| Crown Jewel | Target asset name (e.g., "Customer PII Database") |
| Severity | Badge — CRITICAL / HIGH / MEDIUM / LOW |
| Hops / Gaps | e.g., "4 hops / 3 gaps" |
| Resources | Count + shared/unique badge (see below) |
| Risk Score | Numeric score — red (≥90), orange (≥75), yellow (<75) |
| Action | "Analyze" button (indigo, eye icon) |

**Resources Column Detail**
- Shows total resource count for the path
- If any resource appears in more than one path: orange "🔗 N shared" badge
- If all resources are unique to this path: green "✓ unique" badge

**Row Interaction**
- Clicking anywhere on a row (except the Resources column) selects that path and navigates to the Analyze tab
- The Resources column propagation is stopped — clicking it does not navigate

**Pagination Footer**
- "Showing N paths" text
- ‹ Previous | 1 (active) | Next › buttons

---

## 5. Tab 02 — Analyze

**Goal**: Trace the full attack chain of a selected path — nodes, edges, gaps, assets, privilege escalation, and identity risks.

### 5.1 Empty State (no path selected)
- Indigo info banner: *"Select an Attack Path to Analyze"*
- List of top CRITICAL paths rendered as clickable cards (numbered, showing score, path string, hops, gaps, MITRE IDs)
- Clicking any card selects it and loads the full analysis view

### 5.2 Path Header Card
Once a path is selected:
- "← Back to all paths" text button (deselects path, returns to Discover list)
- Status pill (Open / In Progress / Resolved)
- Risk score badge (colour-coded)
- Path title (bold, large)
- Severity badge, hop/gap count, MITRE chain string

### 5.3 Asset Type Breakdown Card
- Shows counts by asset type (e.g., "1 API Gateway, 1 Cache, 1 Database")
- Each type displayed as an icon + count pill
- Additional pills for: Gaps Chained (orange), Risk Score (red)

### 5.4 Shared Resources Warning Banner *(conditional)*
Appears only when ≥1 resource in the path is also part of another path:
- Orange alert icon + "N resource(s) in this path are shared with other attack paths"
- Teal pills listing shared resource names with "×N" count badge
- Clicking a pill opens the **Resource Detail Panel** (slide-over)
- Reminder text: "remediating these reduces risk across multiple paths"

### 5.5 Attack Path Flow Visualization *(interactive)*
A horizontally scrollable diagram showing the full attack chain as nodes connected by labelled edges.

**Nodes**
- Rendered left-to-right in attack order
- Styled by severity:
  - Crown Jewel (final target): red border + red background + 👑 icon
  - CRITICAL: red border, red background
  - HIGH: orange border, orange background
  - MEDIUM: yellow border, yellow background
  - Entry point (first node): blue border, blue background
- Emoji icon (e.g., 🌐 Internet, 🖥️ Server, 🔑 Credentials, ☁️ Cloud)
- "In N paths" teal link appears below shared nodes — clicking opens Resource Detail Panel
- **Hover interaction**: hovering a node with a linked resource shows a metadata tooltip below it, displaying: resource name, OS/Platform, Open Ports, Exploitability, Criticality

**Edges (Arrows)**
- Rendered as clickable buttons between each pair of nodes
- Shows edge label (attack technique, e.g., "HTTPS", "JWT Bypass", "DCSync")
- **Click interaction**: clicking an edge highlights it (indigo border) and expands the Security Gap detail panel below the diagram

**Security Gap Detail Panel** (appears when an edge is clicked)
- "Security Gap #N" badge + edge name
- Gap description from the path's `gaps_detail` array
- Dismiss instruction text
- × close button

### 5.6 Asset Metadata Enrichment Card
Two-column grid. One card per resource in the selected path:

**Each card shows:**
- Resource name (monospace)
- Cross-path count link ("×N paths") in teal — clicking opens Resource Detail Panel
- Severity badge + Exploitability badge
- OS/Platform string
- Three-column metadata row: Criticality | Open Ports | Services
- Footer (conditional):
  - If shared: teal background, "Also in N other path(s):" + clickable path ID pills (indigo)
  - If unique: green checkmark + "Unique to this path"

Card border is teal if shared, slate if unique.

### 5.7 Contextual Risk Scoring Card
Shows how Qualys adjusts raw risk scores based on graph topology.

For each item in `SCORING_ITEMS`:
- Asset name + "In N paths" cross-path link
- Reason text (e.g., "Toxic Combination: CVE + IAM + Internet-facing (+24%)")
- Base score → Adjusted score (with arrow)
- Delta badge: red if score increased (e.g., "+24%"), green if suppressed (e.g., "-57%")

**Scoring logic**: Score elevated for chokepoints (assets in multiple paths), reduced for isolated/dormant assets.

### 5.8 Toxic Combination Identification Card
Lists dangerous co-occurring conditions across the environment.

For each `TOXIC_COMBO`:
- AlertTriangle icon + Severity badge + combination title
- Asset name (clickable → Resource Detail Panel) + MITRE chain
- "Spans N paths" indicator (teal) if the involved resource spans paths
- Suppress button (right side)
- Detail rows: CVE, IAM exposure, network exposure, path to crown jewel

### 5.9 Privilege Escalation Mapping Card
Step-by-step chain from initial access to domain compromise.

**Technique tag cloud** (non-interactive): UAC Bypass, Kerberoast, Kernel Exploit, Token Impersonation, WriteDACL, DCSync

**Expandable step list** (6 steps):
Each step is a clickable row:
- Coloured number circle (red/orange/yellow/blue by severity)
- Vertical connector line between steps
- Step name + Severity badge + MITRE technique ID
- ChevronRight icon (rotates 90° on expand)
- **Click**: expands a description text block below the step

Steps (Standard User → Local Admin → NT SYSTEM → Service Account → DCSync → Domain Admin)

### 5.10 Identity & Lateral Movement Card
AD identities exposed along the attack path.

For each identity:
- Purple user icon circle
- Name (monospace) + Type tag (e.g., "Service Account") + Risk badge (e.g., "WriteDACL / Kerberoastable")
- Detail text describing group memberships, escalation potential, or Kerberos risks
- Severity badge (right)

### 5.11 Decision Gate — "Ready to Remediate?"
Green-bordered card at the bottom of the Analyze view:
- Wrench icon in green circle
- Title: "Ready to Remediate?"
- Message: *"You've traced the full attack chain, reviewed shared resources, contextual risk scores, and toxic combinations. Take action on AP-{id} now."*
- **Green CTA button**: "→ Click 'Remediate' → Tab 03" — navigates to Remediate tab (keeping path selection)
- Teal confirmation pill: "✓ Path Risk Understood · Actions Queued"

---

## 6. Tab 03 — Remediate

**Goal**: Review, prioritise, and action remediation steps. Track progress with state toggles and ROI scoring.

### 6.1 Summary Stats Bar (3 cards)

| Metric | Source |
|--------|--------|
| Toxic Combos | Count of TOXIC_COMBOS (3) |
| Score Elevated | Count of positive SCORING_ITEMS (3) |
| ROI Score | Average computed ROI across all actions (e.g., 64) |

### 6.2 Recommended Remediation Actions

**Header**: Wrench icon + title. If a path is selected, path title shown in lighter weight text beside it.

**Priority legend** (top right): Red dot = Critical | Orange dot = High | Yellow dot = Medium

**Data source**:
- If a path is selected: shows that path's `remediation` array (typically 4 actions)
- If no path selected: shows deduplicated actions from all paths, up to 12

**Action Item Layout** (one card per action):

```
[priority dot] [action text]                           [ROI badge] [More Detail] [Create Ticket] [Suppress]
               [priority badge] [CID if multi-path]
               [clock] ETA: Xh   [wrench] Effort: Low
               [link] Affects N paths — click to view  (teal, clickable)
               [state indicator if active]
```

**Priority dot colours**: red (CRITICAL), orange (HIGH), yellow (MEDIUM), green (LOW)
**Card background tints**: red-900/20 (CRITICAL), orange-900/20 (HIGH), yellow-900/20 (MEDIUM), green-900/20 (LOW)

**Action Buttons (three per row)**:

| Button | Style | Toggle State | Indicator Text |
|--------|-------|-------------|----------------|
| 👁 More Detail | Sky-blue border | `detail` | "👁 Viewed Detail" |
| 🎫 Create Ticket | Blue border | `ticket` | "🎫 Ticket Created" |
| 👁‍🗨 Suppress | Gray border | `suppressed` | "👁‍🗨 Suppressed" |

- Only one state can be active per action at a time (clicking again deactivates)
- When a state is active, the button fills with its colour and the status indicator appears inline

**ROI Badge** (right of action text, left of buttons):
- Displays a computed score (0–100)
- Colour: green (≥70), orange (≥40), gray (<40)
- Border also colour-coded
- **Click**: expands the ROI Breakdown Panel below the action row

### 6.3 ROI Score Breakdown Panel *(expanded on ROI badge click)*
Inline dark panel (slate-900) below each action row:

**Left column — Risk Reduction Value:**
- Severity points (CRITICAL=40, HIGH=30, MEDIUM=20, LOW=10)
- Path multiplier (×N, based on how many paths the resource appears in)
- Toxic combo bonus (+20 pts, if resource is in a toxic combination)
- Elevated score bonus (+10 pts, if resource has an elevated contextual score)
- **Total RRV** (sum)

**Right column — Remediation Cost:**
- Effort weight (Low=1, Medium=2, High=3)
- ETA weight (≤4h=1, same-day=2, ≤4 days=3, ≥5 days=4)
- **Total Cost** (effort × ETA weights)
- Raw score: RRV ÷ Cost
- Final score: normalised to 0–100 (÷110 × 100, clamped)

**Footer**: *"Max score = CRITICAL (40) × 2 paths + toxic bonus (20) + elevated bonus (10), cost = 1 (Low effort, ≤4h ETA)"*

---

## 7. Resource Detail Panel (Slide-Over Modal)

**Trigger**: Clicking any resource-linked element across all tabs — shared resource pills, "In N paths" links, asset names, or path entries in the Resource Detail Panel itself.

**Appearance**: Fixed panel on right edge of screen (z-50). Backdrop: semi-transparent slate with blur. Panel: 320px wide, slate-800, scrollable.

**Closes when**: Clicking the × button or clicking the backdrop.

### Panel Sections

**Header** (sticky, always visible)
- Server icon + "Resource Detail" title
- × close button

**Resource Metadata**
- Resource name (monospace, bold) + Severity badge
- Resource type (e.g., "API Gateway", "Cache", "Database")
- Exploitability badge (colour-coded: red for Critical/High, yellow for Medium, slate for others)
- Four metadata rows: OS/Platform, Criticality, Open Ports, Services

**Attack Paths Membership**
- "Part of N Attack Path(s)" heading with Link2 icon
- For each path containing this resource — a clickable card:
  - Severity badge + Path ID (monospace, e.g., "AP-5014")
  - Risk score + Status pill
  - Path title (bold, hover: indigo)
  - Path chain string (monospace, truncated)
  - **Click**: closes panel, selects path, navigates to Analyze tab

**Multi-Path Impact Tip** (shown only if N > 1)
- Teal info box: *"💡 Remediating this resource reduces combined risk across all N paths."*

---

## 8. Data Model & Relationships

### Core Data Stores

**RESOURCES** (12 records)
Each resource has: `id`, `name`, `type`, `severity`, `exploitability`, `os`, `criticality`, `ports`, `services`

**ATTACK_PATHS** (5 records)
Each path has: `id`, `title`, `severity`, `entry`, `target`, `hops`, `gaps`, `score`, `status`, `mitre`, `path` (string), `resourceIds[]`, `flowNodes[]`, `gaps_detail[]`, `remediation[]`

**SCORING_ITEMS** (5 records)
Each item: `asset`, `resourceId`, `reason`, `base`, `adjusted`, `delta`, `positive`

**TOXIC_COMBOS** (3 records)
Each combo: `title`, `severity`, `resourceId`, `asset`, `mitre`, `items[]`

### Relationships

```
ATTACK_PATH ──< resourceIds[] >── RESOURCE   (many-to-many)
ATTACK_PATH ──< flowNodes[]   >── RESOURCE   (ordered chain with edge labels)
ATTACK_PATH ──< remediation[] >── ACTION     (with optional resourceId link)
RESOURCE    ──< TOXIC_COMBOS  >── TOXIC_COMBO
RESOURCE    ──< SCORING_ITEMS >── SCORE_ADJUSTMENT
```

### Helper Functions

| Function | Purpose |
|----------|---------|
| `getResourcesByPathId(pathId)` | Returns all RESOURCE objects for a given path |
| `getPathsByResourceId(resourceId)` | Returns all paths containing a given resource (inverse lookup) |
| `getSharedResourceIds(pathId)` | Returns resourceIds in a path that appear in ≥2 paths total |
| `computeRoi(action)` | Returns `{ score: 0-100, breakdown: {...} }` for a remediation action |

---

## 9. Interaction Map

| User Action | Location | Result |
|-------------|----------|--------|
| Click severity filter button | Discover sidebar | Filters table rows in real time |
| Type in search box | Discover table | Filters by title or crown jewel name |
| Click a table row | Discover table | Selects path + navigates to Analyze tab |
| Click "Analyze" button | Discover table row | Same as row click |
| Click time range button | Discover sidebar | Highlights selected period (visual only) |
| Click path card | Analyze empty state | Selects path, loads full Analyze view |
| Click "← Back" | Analyze header | Deselects path, returns to path list view |
| Hover a flow node | Analyze diagram | Shows metadata tooltip below node |
| Click a flow edge | Analyze diagram | Highlights edge + expands security gap detail |
| Click × on gap panel | Analyze diagram | Collapses security gap detail |
| Click "In N paths" | Analyze (diagram/asset grid/scoring) | Opens Resource Detail Panel |
| Click shared resource pill | Analyze (warning banner) | Opens Resource Detail Panel |
| Click path ID pill | Analyze (asset card footer) | Selects that path and reloads Analyze |
| Click escalation step | Analyze escalation card | Expands/collapses step description |
| Click "Ready to Remediate" | Analyze footer | Navigates to Remediate tab |
| Click ROI badge | Remediate action row | Expands/collapses ROI breakdown panel |
| Click "More Detail" | Remediate action row | Toggles sky-blue "Viewed Detail" state |
| Click "Create Ticket" | Remediate action row | Toggles blue "Ticket Created" state |
| Click "Suppress" | Remediate action row | Toggles gray "Suppressed" state |
| Click "Affects N paths" | Remediate action row | Opens Resource Detail Panel |
| Click path card in panel | Resource Detail Panel | Closes panel + selects path in Analyze |
| Click × or backdrop | Resource Detail Panel | Closes panel |

---

## 10. End-to-End User Journey

```
START
│
├── Open app.html#/insights
│    └── Loads AttackPathInsights (dark-theme, ETM sidebar, 3 tabs)
│
├── TAB 01 — DISCOVER
│    ├── Review summary stats (14 paths, 5 critical, risk score 73)
│    ├── Apply severity filter (e.g., CRITICAL only → 5 paths shown)
│    ├── Search by asset name (optional)
│    ├── Notice "2 shared" badge on a path → understand cross-path risk
│    └── Click row / "Analyze" button → auto-navigate to Analyze tab
│
├── TAB 02 — ANALYZE
│    ├── Review path header (title, severity, hops, MITRE chain)
│    ├── Read asset type breakdown (N assets, N types)
│    ├── See shared resource warning (if applicable)
│    │    └── Click shared resource pill → open Resource Detail Panel
│    │         ├── Read metadata (OS, ports, exploitability)
│    │         ├── See other paths this resource belongs to
│    │         └── Close panel (×)
│    ├── Trace the attack chain (interactive flow diagram)
│    │    ├── Hover nodes → tooltip with OS, ports, exploitability
│    │    └── Click edges → expand security gap detail
│    ├── Review asset metadata enrichment (OS, criticality, shared paths)
│    ├── Review contextual risk scores (chokepoints elevated, isolated assets suppressed)
│    ├── Review toxic combinations (co-occurring CVE + IAM + internet exposure)
│    ├── Expand privilege escalation steps (UAC bypass → Kernel exploit → DCSync)
│    ├── Review identity risks (Kerberoastable accounts, WriteDACL abuse)
│    └── Click "Ready to Remediate" → navigate to Remediate tab
│
├── TAB 03 — REMEDIATE
│    ├── Review summary stats (3 toxic combos, 3 elevated scores, ROI avg)
│    ├── Review recommended actions (ordered by priority)
│    │    ├── Click ROI badge → expand detailed score breakdown
│    │    ├── Click "Create Ticket" → mark action as ticketed (blue)
│    │    ├── Click "More Detail" → mark action as viewed (sky-blue)
│    │    └── Click "Suppress" → defer action (gray)
│    └── Click "Affects N paths" → open Resource Detail Panel to understand blast radius
│
└── END
```

---

## 11. Visual Design System

| Element | Dark Theme Value |
|---------|-----------------|
| App background | `bg-slate-900` |
| Card/panel background | `bg-slate-800` |
| Nested/sub-panels | `bg-slate-700/40` |
| Primary border | `border-slate-700` |
| Primary text | `text-white` |
| Secondary text | `text-slate-200` |
| Muted text | `text-slate-300` / `text-slate-400` |
| Active/accent colour | Indigo (`indigo-400` / `indigo-600`) |
| Cross-path indicator | Teal (`teal-300` / `teal-900/20`) |
| CRITICAL severity | Red (`red-300` / `red-900/30`) |
| HIGH severity | Orange (`orange-300` / `orange-900/30`) |
| MEDIUM severity | Yellow (`yellow-300` / `yellow-900/30`) |
| LOW severity | Green (`green-400` / `green-900/30`) |
| Font | Inter (Google Fonts), monospace for IDs/paths |
| Sidebar | `hsl(220,30%,18%)` navy |

---

*Generated from source: `src/components/AttackPathInsights.jsx`, `src/components/AttackPathQualys.jsx`, `app.html`, `workflow.html`, `diagram.html`*
