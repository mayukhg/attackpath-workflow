# Attack Path Insights — UX Figma Walkthrough Script
**Qualys Enterprise TruRisk™ Platform · ETM Module**
**Audience:** UX / Design Team — Figma Frame Production
**Purpose:** Frame-by-frame screen spec for Figma file construction
**Duration:** Reference document (not timed) | Each section = one or more Figma frames

---

## HOW TO USE THIS DOCUMENT

Each **[FRAME]** heading maps to a dedicated Figma artboard.
- **Screen state** describes what is rendered and visible
- **Components** lists every UI element that must appear
- **Interactions** describes hover, click, and transition behaviours to annotate in Figma
- **Design notes** covers colour tokens, spacing, and edge cases
- **Figma annotation** is the label / note to place on the frame

Use the diagram at `http://localhost:3000/diagram.html` as the source-of-truth flow reference.

---

## ENTRY FLOW FRAMES

---

### [FRAME 01] — ETM Platform Login
**Screen state:** Qualys ETM login page, pre-authentication

**Components:**
- Qualys logo (top-left)
- Email + Password input fields
- "Sign In" primary CTA button
- SSO option link
- Platform branding: "Enterprise TruRisk™ Platform"

**Design notes:**
- Background: `#0f172a` (dark slate)
- CTA button: Qualys red `#E5002B`
- Standard login — no Attack Path–specific elements visible yet

**Figma annotation:** `Entry Point — User authenticates into ETM`

---

### [FRAME 02] — ETM Dashboard with Left Navigation
**Screen state:** Post-login ETM dashboard; left nav visible; "Attack Path" nav item highlighted

**Components:**
- Left sidebar navigation (collapsed icon + label style)
- Active nav item: "Attack Path" — highlighted with `#E5002B` left border or background tint
- Main content area: existing ETM dashboard widgets (can be greyed out / placeholder)
- Breadcrumb: `ETM > Attack Path Insights`

**Interactions:**
- Hover on "Attack Path" nav item → show active state (highlight)
- Click → triggers Frame 03

**Design notes:**
- Left nav width: ~240px (expanded), ~60px (collapsed)
- Use existing ETM nav component pattern

**Figma annotation:** `User clicks "Attack Path" from ETM Left Nav`

---

### [FRAME 03] — Attack Path Insights — Initial Load
**Screen state:** Attack Path Insights module loads; defaults to 01 Discover tab active

**Components:**
- Module header: "Attack Path Insights" title + "ETM Module" tag
- Tab bar: `[01 Discover]` `[02 Analyze]` `[03 Remediate]` — Discover tab active (blue underline / filled)
- KPI Summary Cards row (5 cards)
- Attack Paths table (below cards) — populated with rows
- Filter bar above table

**Design notes:**
- Tab active state: `#1d4ed8` (blue) for Discover, `#0e7490` (teal) for Analyze, `#15803d` (green) for Remediate
- Module container: white background, `border-radius: 12px`, subtle `box-shadow`

**Figma annotation:** `Screen loads — 01 Discover tab is default active state`

---

## PHASE 01 — DISCOVER FRAMES

---

### [FRAME 04] — KPI Summary Cards
**Screen state:** Five KPI cards fully rendered across top of Discover tab

**Components (5 cards, left to right):**

| Card | Label | Value (example) | Icon | Colour accent |
|---|---|---|---|---|
| 1 | Total Attack Paths | 47 | Shield/path icon | Blue `#1d4ed8` |
| 2 | Critical Paths | 12 | Alert triangle | Red `#E5002B` |
| 3 | Avg Risk Score | 76.4 | Gauge/dial | Orange `#ea580c` |
| 4 | Crown Jewels Exposed | 8 | Crown icon | Dark red `#b91c1c` |
| 5 | Entry Points | 23 | Globe/door icon | Purple `#7c3aed` |

**Card anatomy:**
- Card: `width: ~200px`, `padding: 20px 24px`, `border-radius: 10px`, border `1.5px solid #e2e8f0`
- Top: small label text (11px, `#64748b`, uppercase)
- Middle: large value (32px, bold, colour-accented)
- Bottom: icon + delta/trend text (optional: "+3 since last week")

**Interactions:**
- Hover → subtle `box-shadow` elevation increase
- No click behaviour on KPI cards in this version

**Figma annotation:** `KPI Summary Row — 5 metric cards, top of Discover tab`

---

### [FRAME 05] — Filter Bar & Entity Search
**Screen state:** Filter bar fully rendered, no active filters, search field empty

**Components:**
- Search input field (full text): placeholder `"Search by asset, CVE, technique, node…"`
  - Left icon: magnifying glass
  - Right: clear × button (hidden when empty)
- Filter pills (horizontal row):
  - `Severity` dropdown → options: All / Critical / High / Medium / Low
  - `Entry Point` dropdown → options: All / Internet / Internal / Cloud
  - `Time Range` dropdown → options: Last 7d / 30d / 90d / Custom
- Active filter chip example: `Severity: Critical ×` (blue pill, dismissible)
- Results count text: "Showing 47 attack paths"

**Interactions:**
- Type in search → table rows filter in real time; matching rows show a yellow "match chip" (see Frame 07 variant)
- Click dropdown → opens select menu
- Click × on filter chip → removes filter, table re-renders
- Empty state: if no results → show empty state illustration + guidance text (see Frame 08)

**Design notes:**
- Search field: `height: 40px`, `border-radius: 8px`, `border: 1.5px solid #cbd5e1`
- Focus state: `border-color: #3b82f6`, `box-shadow: 0 0 0 3px rgba(59,130,246,0.15)`
- Filter pills: `height: 34px`, `border-radius: 6px`

**Figma annotation:** `Filter Bar — entity-aware search + severity/entry-point/time filters`

---

### [FRAME 06] — Attack Paths Table — Default State
**Screen state:** Full table rendered, all 47 paths visible, no filters active, no row selected

**Table columns (left to right):**

| Column | Width | Content | Notes |
|---|---|---|---|
| CID | 100px | `AP-5014` (monospace) | Sortable |
| Chain | 260px | `Internet → VM → IAM → S3 → Finance DB` (truncated path chain) | |
| Severity | 90px | Badge pill: `CRITICAL` / `HIGH` / `MEDIUM` / `LOW` | Colour-coded |
| Hops | 60px | `5` | Numeric, sortable |
| Gaps | 60px | `4` | Numeric |
| Risk Score | 90px | `94` with coloured score bar | Sortable, default sort descending |
| Resources | 120px | `6 resources` + badge (see below) | **New column** |
| Action | 80px | `Analyze →` button | |

**Resources column badge variants:**
- **Shared:** Orange badge — `3 shared` — background `#fff7ed`, text `#ea580c`, border `#fb923c`
- **Unique:** Green badge — `unique` — background `#f0fdf4`, text `#16a34a`, border `#22c55e`
- **Mixed:** Resource count label `6` + orange badge if any are shared

**Severity badge colours:**
- CRITICAL: `bg #fef2f2`, text `#b91c1c`, border `#fca5a5`
- HIGH: `bg #fff7ed`, text `#c2410c`, border `#fdba74`
- MEDIUM: `bg #fefce8`, text `#854d0e`, border `#fde047`
- LOW: `bg #f0f9ff`, text `#0369a1`, border `#7dd3fc`

**Row states:**
- Default: white background
- Hover: `#f8fafc` background, `Analyze →` button becomes visible (or brightens)
- Selected: `#eff6ff` background, left border `3px solid #2563eb`

**Design notes:**
- Table header: `bg #f1f5f9`, `font-size: 11px`, `font-weight: 700`, `color: #475569`, uppercase
- Row height: `56px`
- Font: Inter, 13px body
- Risk Score: render as `[Score] [████░░░░░]` inline bar, colour gradient red→amber→green

**Figma annotation:** `Attack Paths Table — default state, all paths, Resources column visible`

---

### [FRAME 07] — Table with Entity Search Active
**Screen state:** User has typed "redis" in search bar; 3 rows match; other rows hidden

**Components (delta from Frame 06):**
- Search field: filled, shows "redis", clear × visible
- Results count: "Showing 3 of 47 attack paths"
- Matching rows: show match chip below chain text — e.g. `Match: Flow node "Redis Cache"` — chip style: `bg #fef9c3`, text `#713f12`, border `#fde047`, `font-size: 10px`
- Non-matching rows: hidden (not greyed — fully removed from DOM)

**Figma annotation:** `Search active — "redis" — 3 matching rows with match chips`

---

### [FRAME 08] — Table Empty State
**Screen state:** Filters applied with no results

**Components:**
- Empty state container (centred in table body area)
- Illustration: magnifying glass with an empty circle (SVG icon or illustration)
- Heading: "No attack paths match your filters"
- Subtext: "Try adjusting the severity filter or clearing your search term."
- CTA: "Clear all filters" (text link or ghost button)

**Figma annotation:** `Table empty state — no results`

---

### [FRAME 09] — Row Hover + Investigate Decision
**Screen state:** User hovers on a Critical path row; Analyze button highlighted

**Components (delta from Frame 06):**
- Row: hover state — `bg #eff6ff`, left border `3px solid #2563eb`
- `Analyze →` button: primary blue, `bg #2563eb`, `color: white`, `border-radius: 6px`, `padding: 6px 14px`
- Tooltip (optional): "Drill into this path in Analyze tab"

**Interaction annotation:** Click → transitions to Frame 10 (Analyze tab loads)

**Figma annotation:** `Row hover state — Analyze CTA visible — decision: investigate this path`

---

## PHASE 02 — ANALYZE FRAMES

---

### [FRAME 10] — Analyze Tab — Initial Load
**Screen state:** Tab switches to 02 Analyze; path AP-5014 context loaded at top

**Components:**
- Tab bar: Analyze tab now active (teal underline)
- **Path Context Header banner (full width):**
  - Left: `AP-5014` (monospace, large, `#0e7490`)
  - Severity badge: `CRITICAL` (red pill)
  - Status badge: `Active` (amber) or `In Review` (blue)
  - Risk Score: `94` (large number, red)
  - Right: `← Back to Discover` text button
- Below header: main Analyze content area (Frames 11–19 are sections within this view, stacked vertically on scroll)

**Design notes:**
- Header banner: `bg #f0f9ff`, `border-bottom: 1.5px solid #bae6fd`, `padding: 16px 24px`
- "Back" link: `color: #64748b`, hover `#1d4ed8`

**Figma annotation:** `02 Analyze tab — AP-5014 context loaded in header`

---

### [FRAME 11] — Asset Type Breakdown & Attack Flow Graph
**Screen state:** Visual attack flow graph rendered; 5 nodes connected by dashed arrows

**Node types and styles:**

| Node type | Background | Border | Text colour | Example |
|---|---|---|---|---|
| Entry Point | `#fef2f2` | `#fca5a5` | `#b91c1c` | 🌐 Internet Entry |
| Vulnerable Host | `#fff7ed` | `#fdba74` | `#c2410c` | 🖥 Exposed VM |
| Identity / IAM | `#fefce8` | `#fde047` | `#854d0e` | 🔑 IAM Role |
| Lateral Move | `#f5f3ff` | `#c4b5fd` | `#6d28d9` | ↔ S3 Bucket |
| Crown Jewel | `#1e293b` | `#E5002B` | `#fef2f2` | 👑 Finance DB |

**Node anatomy:**
- Box: `width: 150px`, `padding: 9px 14px`, `border-radius: 8px`, `border: 2px solid`
- Sub-label below box: `font-size: 9px`, `color: #94a3b8` — e.g. "CVSS 9.8 · Unpatched"
- Phase badge below sub-label: small pill — Discovered (blue) / Analyzed (teal) / Remediated (green)

**Edges (arrows between nodes):**
- Dashed line + arrowhead: `stroke: #94a3b8`, `stroke-dasharray: 4,2`
- Default state: `#94a3b8`
- Hover state: `#6366f1` (indigo), thickness increases to 2.5px
- Selected state: `#6366f1`, dashed line becomes solid, edge label appears (see Frame 12)

**MITRE ATT&CK tags:**
- Small teal pill attached to or near each edge: e.g. `T1190 Exploit Public App`
- `bg #ecfeff`, `color: #0e7490`, `font-size: 9px`, `border: 1px solid #67e8f9`

**Asset type count strip (above graph):**
- Horizontal count row: `Hosts: 2 · IAM Roles: 1 · Storage: 1 · Databases: 1`
- Each type: icon + count, `font-size: 12px`

**Interactions:**
- Click edge → Frame 12 (Security Gap detail appears)
- Click node → Frame 15 (Resource Detail Panel slides in)

**Figma annotation:** `Attack Flow Graph — 5-node chain, MITRE tags on edges, click edge for gap detail`

---

### [FRAME 12] — Security Gap Chaining — Edge Selected
**Screen state:** User has clicked the edge between "Exposed VM" and "IAM Role"

**Components (delta from Frame 11):**
- Selected edge: solid indigo `#6366f1`, 2.5px thickness
- **Security Gap Detail panel** (inline below or right-side card):
  - Header: `Security Gap — VM → IAM Role`
  - Technique: `T1078 Valid Accounts`
  - CVE: `CVE-2024-1234` (clickable link)
  - Config weakness: `Over-privileged IAM role with AdministratorAccess`
  - Risk contribution: `+18 pts to path score`
  - Dismiss × button top-right

**Design notes:**
- Gap detail panel: `bg #eef2ff`, `border: 1.5px solid #a5b4fc`, `border-radius: 8px`, `padding: 14px 16px`
- CVE link: `color: #2563eb`, underline on hover

**Figma annotation:** `Edge selected — Security Gap detail panel shown for VM → IAM step`

---

### [FRAME 13] — Shared Resources Warning Banner
**Screen state:** Orange warning banner rendered below Path Context Header, above flow graph

**Components:**
- **Banner container:** full-width, `bg: #fff7ed`, `border: 1.5px solid #fb923c`, `border-radius: 8px`, `padding: 12px 16px`
- Left icon: ⚠️ warning triangle, `color: #ea580c`
- Heading text (bold): "4 resources on this path are shared with 2 other attack paths"
- Shared resource chips (inline, horizontal):
  - `GraphQL API` — `in 2 paths`
  - `Redis Cache` — `in 2 paths`
  - `Auth Service` — `in 2 paths`
  - `Postgres PII DB` — `in 2 paths`
  - Each chip: `bg #fef2f2`, `border: 1px solid #fca5a5`, `color: #b91c1c`, `border-radius: 20px`, `padding: 2px 10px`, `font-size: 11px`
- Sub-text: "Remediating shared resources reduces risk across multiple paths simultaneously."
- Dismiss × (top-right, optional)

**Design notes:**
- Banner appears only when `sharedResourceIds.length > 0` (conditional render)
- This is above the flow graph — prominent, not inline

**Figma annotation:** `Shared Resources Warning Banner — orange, conditional, lists 4 shared resources with path counts`

---

### [FRAME 14] — Asset Metadata Enrichment — Node Cards
**Screen state:** Below the flow graph, 5 asset cards rendered (one per node), horizontally scrollable or in a grid

**Asset card anatomy:**
- Card: `width: ~240px`, `padding: 14px 16px`, `border-radius: 8px`, `border: 1.5px solid #e2e8f0`
- **Header row:**
  - Node type icon (coloured per type)
  - Asset name (bold, 13px)
  - **"In N paths" teal badge** (if shared): `bg #ecfeff`, `color: #0e7490`, `border: 1px solid #06b6d4`, `border-radius: 20px`, `padding: 2px 8px`, `font-size: 10px` — text: `🔗 In 3 paths`
- **Metadata rows (4–6 rows):**
  - OS: `Ubuntu 22.04 LTS`
  - Open ports: `80, 443, 8080`
  - Services: `nginx, node, redis`
  - Exploitability: score bar `████░░` + numeric
  - Criticality: `HIGH` badge
- **Cross-path membership row** (if shared):
  - Label: "Also in:"
  - Path chips: `AP-5028` `AP-5024` — each a clickable teal pill
  - Or "✓ Unique to this path" (green, if not shared)
- Footer: "View full details →" link → opens Frame 15

**Interactions:**
- Click "View full details →" or click asset name → Frame 15 (Resource Detail Panel)
- Click path chip (e.g. `AP-5028`) → navigates to that path in Analyze

**Design notes:**
- "In N paths" badge only appears if resource `belongsToMultiplePaths`
- Cross-path chips: `bg #ecfeff`, `color: #0e7490`, `font-size: 10px`, `border-radius: 20px`
- Unique indicator: `color: #16a34a`, `font-size: 11px`

**Figma annotation:** `Asset Metadata Cards — per-node enrichment, 🔗 In N paths badge, cross-path membership`

---

### [FRAME 15] — Resource Detail Panel (Slide-Over)
**Screen state:** Right-side slide-over panel open, showing "Redis Cache" resource detail

**Panel anatomy:**
- **Container:** fixed right-side panel, `width: 380px`, `height: 100vh`, white background, `box-shadow: -4px 0 24px rgba(0,0,0,0.12)`
- **Header:**
  - Icon + resource name: `Redis Cache` (large, bold)
  - Type badge: `CACHE` or `DATABASE` etc.
  - Severity badge: `HIGH` (coloured pill)
  - × close button (top-right)
- **Metadata section:**
  - OS: `Ubuntu 22.04 LTS`
  - Open ports: `6379, 6380`
  - Services: `redis-server`
  - Exploitability: score + bar
  - Criticality: `HIGH`
- **Divider**
- **"Part of N Attack Paths" section:**
  - Section heading: `Part of 2 Attack Paths` (bold, `color: #0e7490`)
  - Path list (each row):
    - Path ID: `AP-5014` (monospace, `color: #0e7490`)
    - Path chain (truncated): `Internet → VM → … → Finance DB`
    - Severity badge
    - "View path →" link on hover
  - Rows: `padding: 10px 0`, `border-bottom: 1px solid #f1f5f9`
- **Cross-path insight tip** (if shared in >1 path):
  - Teal info box: `bg #ecfeff`, `border: 1.5px solid #06b6d4`, `border-radius: 6px`, `padding: 10px 12px`
  - Text: "💡 Remediating this resource will reduce risk across all 2 paths above."

**Interactions:**
- Click × → panel slides out; user returns to current path context
- Click "View path →" on a path row → navigate to that path in Analyze

**Animation spec:**
- Slide in from right: `transform: translateX(100%)` → `translateX(0)`, `transition: 300ms ease`
- Overlay behind panel: `bg: rgba(0,0,0,0.25)`, click overlay = close

**Design notes:**
- Panel overlays the main content (not a drawer that pushes content)
- Focus trap within panel when open (accessibility)
- Same panel component reused from Analyze asset cards AND Remediate tab

**Figma annotation:** `Resource Detail Panel — slide-over, shows metadata + all paths containing this resource`

---

### [FRAME 16] — Contextual Risk Scoring Section
**Screen state:** Risk scoring table showing adjusted scores

**Components:**
- Section heading: "Contextual Risk Scoring"
- Table / card list:

| Asset | Base Score | Adjusted Score | Delta | Reason |
|---|---|---|---|---|
| API Gateway | 73 | 97 | +24 (+33%) | Toxic combo · internet-facing |
| Auth Service | 68 | 91 | +23 (+34%) | Chokepoint · 3 paths |
| Dev Test Server | 62 | 27 | -35 (-56%) | Isolated · no lateral path |

- **Score delta styling:**
  - Increase: `color: #E5002B`, upward arrow icon ↑
  - Decrease: `color: #16a34a`, downward arrow icon ↓
- **Reason tag:** small grey pill with reason text

**Figma annotation:** `Contextual Risk Scoring — adjusted scores with delta indicators and reason tags`

---

### [FRAME 17] — Toxic Combinations Section
**Screen state:** 3 toxic combo nodes shown as highlighted cards

**Components:**
- Section heading: "Toxic Combinations" + count badge `3` (red)
- Explanation sub-text: "Nodes where CVE + IAM misconfiguration + internet exposure intersect"
- 3 cards (or list rows):
  - Each: asset name + 3 intersecting factor chips:
    - `CVE-2024-1234` (red chip)
    - `IAM: AdministratorAccess` (amber chip)
    - `Internet Exposed` (purple chip)
  - Each card has a clickable asset name → opens Frame 15 (Resource Detail Panel)
  - Badge: `TOXIC COMBO` in dark red

**Design notes:**
- Asset name in toxic combo card: underlined, cursor pointer — clicking opens Resource Detail Panel for that asset

**Figma annotation:** `Toxic Combinations — 3 auto-detected nodes, clickable asset names open Resource Detail Panel`

---

### [FRAME 18] — Privilege Escalation Mapping
**Screen state:** Step-by-step escalation chain displayed

**Components:**
- Section heading: "Privilege Escalation Mapping"
- Numbered step list:
  1. Standard User → SSH into VM (T1021.004 Remote Services)
  2. VM → IAM role assumption (T1548 Abuse Elevation)
  3. IAM → AdministratorAccess (T1078 Valid Accounts)
  4. Admin → S3 bucket read (T1530 Data from Cloud Storage)
  5. S3 → Exfiltrate Finance DB (T1041 Exfiltration)
- Each step:
  - Step number circle (filled, teal)
  - Action description
  - MITRE technique chip: `T1021.004` — `bg #ecfeff`, `color: #0e7490`

**Figma annotation:** `Privilege Escalation — numbered steps with MITRE ATT&CK technique IDs`

---

### [FRAME 19] — Identity & Lateral Movement
**Screen state:** AD identity and group exposure list

**Components:**
- Section heading: "Identity & Lateral Movement"
- Identity rows:
  - Identity name: `svc-deploy` (service account)
  - Group membership: `AD Group: domain-admins` (risk badge: HIGH)
  - GPO: `GPO: Unrestricted PowerShell` (risk badge: HIGH)
  - Kerberos delegation: `Kerberos: Unconstrained delegation` (risk badge: CRITICAL)
- Each row: icon (identity/group/policy/kerberos) + label + risk badge

**Figma annotation:** `Identity & Lateral Movement — AD groups, GPO exposure, Kerberos delegation risks`

---

## PHASE 03 — REMEDIATE FRAMES

---

### [FRAME 20] — Remediate Tab — Initial Load + Risk Summary
**Screen state:** Tab switches to 03 Remediate; risk summary cards at top

**Components:**
- Tab bar: Remediate tab active (green underline)
- **Risk Summary cards (3):**
  - Toxic Combos: `3` (red)
  - Score Elevated: `8 assets` (orange)
  - Avg ROI: `6.4×` (green)
- Card style matches Frame 04 KPI cards

**Figma annotation:** `03 Remediate tab — Risk Summary cards at top`

---

### [FRAME 21] — Prioritized Action List — Default State
**Screen state:** Full remediation action list, sorted Critical → High → Medium → Low

**Action row anatomy:**

- **Severity section header:** `● CRITICAL` (bold, coloured), `3 actions` count
- **Each action row:**
  - Left: severity dot (colour-coded)
  - Action title: "Patch CVE-2024-1234 on Exposed VM" (bold, 13px)
  - Sub-text: asset name + type
  - **Toxic combo flag** (if applicable): `⚠️ TOXIC COMBO` amber badge
  - **Cross-path badge** (if shared resource): `🔗 Affects 3 paths` — teal chip, clickable → opens Frame 15 (Resource Detail Panel)
  - Right metrics row:
    - `ETA: 2h` (grey)
    - `Effort: Low` (green) / `Medium` (amber) / `High` (red)
    - `ROI: 8.2×` (bold, colour-coded by value)
  - Right: action buttons group (see Frame 22)

**Cross-path chip styling:**
- `bg: #ecfeff`, `border: 1px solid #06b6d4`, `color: #0e7490`, `border-radius: 20px`, `padding: 2px 10px`, `font-size: 11px`
- Cursor: pointer; hover → underline + slight scale

**ROI colour coding:**
- ≥ 7×: `color: #15803d` (green)
- 4–7×: `color: #d97706` (amber)
- < 4×: `color: #64748b` (grey)

**Figma annotation:** `Prioritized Action List — Critical/High/Medium/Low sections, cross-path Affects N paths chip on shared-resource actions`

---

### [FRAME 22] — Action Row — Choose Action State
**Screen state:** User hovers an action row; action buttons appear

**Components (delta from Frame 21):**
- Row hover: `bg #f8fafc`
- 3 action buttons appear (right side):
  - `Mark Fixed` — `bg #dcfce7`, `border #16a34a`, `color #15803d`
  - `Create Ticket` — `bg #dbeafe`, `border #3b82f6`, `color #1d4ed8`
  - `Suppress` — `bg #fef9c3`, `border #ca8a04`, `color #713f12`
- Button style: `border-radius: 6px`, `padding: 5px 12px`, `font-size: 11px`, `font-weight: 700`

**Interactions:**
- `Mark Fixed` → action row fades out / gets strikethrough; risk score updates
- `Create Ticket` → ITSM ticket creation modal (not in scope for this sprint)
- `Suppress` → justification input modal slides in (not in scope for this sprint)

**Figma annotation:** `Action row hover — Mark Fixed / Create Ticket / Suppress buttons`

---

### [FRAME 23] — Cross-Path Blast Radius (Resource Detail Panel from Remediate)
**Screen state:** User has clicked "🔗 Affects 3 paths" chip on a remediation action; Resource Detail Panel slides in from right

**Components:**
- Same Resource Detail Panel as Frame 15
- Context difference: opened from Remediate tab, not Analyze
- Panel header: "Redis Cache" — same metadata
- "Part of 3 Attack Paths" section — lists AP-5014, AP-5028, AP-5024
- Insight tip: "Remediating this resource will reduce risk across all 3 paths."

**Design notes:**
- The Resource Detail Panel is a globally reusable component — identical in Analyze and Remediate contexts
- Build as a Figma component with props: `resourceName`, `pathCount`, `pathList[]`

**Figma annotation:** `Resource Detail Panel — opened from Remediate context via "Affects 3 paths" chip`

---

### [FRAME 24] — All Actions Addressed — Loop State
**Screen state:** User has actioned some but not all rows; decision node

**Components:**
- Progress bar or counter: "7 of 12 actions addressed"
- Remaining actions: still visible in list
- "No → Loop back" indicator: orange callout banner — "3 critical actions remain. Continue reviewing."
- Or: accordion collapse for addressed actions (grey, strikethrough style)

**Figma annotation:** `Mid-remediation state — some actions addressed, loop indicator for remaining`

---

### [FRAME 25] — Path Closed — Outcome State
**Screen state:** All critical actions addressed; success state rendered

**Components:**
- **Success banner (full-width, green):**
  - `bg #dcfce7`, `border: 1.5px solid #16a34a`, `border-radius: 8px`
  - Icon: ✓ check circle (green)
  - Heading: "Attack Path AP-5014 — Risk Reduced"
  - Sub-text: "Risk score reduced from 94 → 38. All critical actions have been addressed."
- Action rows: all shown with green checkmarks and strikethrough
- Risk score delta: shown prominently — `94 → 38 (▼ 60%)`
- CTA: "← Return to Discover" and "View next critical path →"

**Figma annotation:** `Path Closed — success state, risk score reduced from 94 → 38, all actions addressed`

---

## COMPONENT LIBRARY CHECKLIST
*Build these as reusable Figma components (with variants) before building frames:*

| Component | Variants needed |
|---|---|
| KPI Card | 5 colour variants |
| Severity Badge | Critical / High / Medium / Low |
| Attack Path Row | Default / Hover / Selected |
| Resources Badge | Shared (orange) / Unique (green) |
| Match Chip | Active search match indicator |
| Flow Node | Entry Point / Vuln Host / Identity / Lateral / Crown Jewel |
| Edge Arrow | Default / Hover / Selected |
| MITRE Technique Tag | Standard teal pill |
| Shared Resources Banner | Visible / Hidden (conditional) |
| "In N paths" Badge | Teal, count as prop |
| Asset Metadata Card | Shared / Unique variants |
| Resource Detail Panel | Overlay component, opened from Analyze + Remediate |
| Action Row | Default / Hover / Addressed / Suppressed |
| Cross-path Chip (Affects N paths) | Teal, count as prop |
| ROI Badge | Green / Amber / Grey by value |
| Action Buttons | Mark Fixed / Create Ticket / Suppress |
| Success Banner | Green, path closed |
| Tab Bar | Discover / Analyze / Remediate active states |

---

## COLOUR TOKEN REFERENCE

| Token | Hex | Usage |
|---|---|---|
| `qualys-red` | `#E5002B` | Primary CTA, Critical severity, Crown Jewel border |
| `discover-blue` | `#2563eb` | Discover tab, primary actions |
| `analyze-teal` | `#0891b2` | Analyze tab, in-N-paths badges, Resource Detail Panel |
| `remediate-green` | `#16a34a` | Remediate tab, Mark Fixed, success states |
| `shared-orange` | `#ea580c` | Shared resource badges, warning banner |
| `toxic-amber` | `#ca8a04` | Toxic combo indicators, suppress action |
| `surface-light` | `#f8fafc` | Card backgrounds, hover states |
| `border-default` | `#e2e8f0` | Standard borders |
| `text-primary` | `#0f172a` | Body text |
| `text-muted` | `#64748b` | Labels, secondary text |
| `text-subtle` | `#94a3b8` | Captions, sub-labels |

---

## FRAME DELIVERY ORDER (SUGGESTED)

**Sprint 1 — Core Navigation + Discover:**
Frames 01, 02, 03, 04, 05, 06, 07, 08, 09

**Sprint 2 — Analyze Flow + New Features:**
Frames 10, 11, 12, 13, 14, 15, 16, 17, 18, 19

**Sprint 3 — Remediate + Outcomes:**
Frames 20, 21, 22, 23, 24, 25

**Component library:** Build in parallel with Sprint 1 — must be complete before Sprint 2 frames.
