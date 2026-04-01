// Attack Path Insights — User Journey Slide Generator
// Uses pptxgenjs to create a single LAYOUT_WIDE (13.33" x 7.5") slide

import PptxGenJS from "pptxgenjs";

const prs = new PptxGenJS();
prs.layout = "LAYOUT_WIDE"; // 13.33" x 7.5"
prs.title = "Attack Path Insights — User Journey";
prs.author = "Qualys";

const slide = prs.addSlide();
slide.background = { color: "FFFFFF" };

// ── Dimensions ──────────────────────────────────────────────────────────
const W = 13.33;
const H = 7.5;

// Footer height
const FOOTER_H = 0.85;
const FOOTER_Y = H - FOOTER_H;

// Content area (below title, above footer)
const TITLE_H = 0.38;
const ENTRY_H = 0.52;
const ENTRY_Y = TITLE_H + 0.08;
const COL_AREA_Y = ENTRY_Y + ENTRY_H + 0.1;
const COL_AREA_H = FOOTER_Y - COL_AREA_Y - 0.06;

// Column layout (3 columns with gaps)
const COL_PAD_L = 0.18;
const COL_PAD_R = 0.18;
const COL_GAP = 0.1;
const COL_TOTAL_W = W - COL_PAD_L - COL_PAD_R;
const COL_W = (COL_TOTAL_W - 2 * COL_GAP) / 3;
const COL_X = [
  COL_PAD_L,
  COL_PAD_L + COL_W + COL_GAP,
  COL_PAD_L + 2 * (COL_W + COL_GAP),
];

// Phase colors
const C_DISCOVER  = "1d4ed8";
const C_ANALYZE   = "0e7490";
const C_REMEDIATE = "065f46";
const C_FOOTER    = "1E3A6E";

// ── SLIDE TITLE ─────────────────────────────────────────────────────────
slide.addText("Attack Path Insights — User Journey", {
  x: 0.18, y: 0.04, w: 9, h: TITLE_H,
  fontSize: 16, bold: true, color: "0f172a", fontFace: "Calibri",
  valign: "middle", margin: 0,
});

// Qualys badge top-right
slide.addShape(prs.shapes.OVAL, {
  x: W - 1.3, y: 0.05, w: 0.28, h: 0.28,
  fill: { color: "E5002B" }, line: { color: "E5002B" },
});
slide.addText("Q", {
  x: W - 1.3, y: 0.05, w: 0.28, h: 0.28,
  fontSize: 10, bold: true, color: "FFFFFF", fontFace: "Calibri",
  align: "center", valign: "middle", margin: 0,
});
slide.addText("Qualys.", {
  x: W - 1.0, y: 0.07, w: 0.75, h: 0.24,
  fontSize: 10, bold: false, color: "1e293b", fontFace: "Calibri",
  valign: "middle", margin: 0,
});

// ── ENTRY FLOW BAR ──────────────────────────────────────────────────────
const EF_Y = ENTRY_Y;
const EF_H = ENTRY_H;

// Background bar
slide.addShape(prs.shapes.RECTANGLE, {
  x: COL_PAD_L, y: EF_Y, w: COL_TOTAL_W, h: EF_H,
  fill: { color: "f1f5f9" }, line: { color: "e2e8f0", width: 1 },
});

// Entry flow label
slide.addText("Entry Flow", {
  x: COL_PAD_L + 0.06, y: EF_Y + 0.02, w: 0.7, h: 0.14,
  fontSize: 6.5, bold: true, color: "94a3b8", fontFace: "Calibri",
  valign: "top", margin: 0, charSpacing: 1,
});

// Entry nodes
const entryNodes = [
  { icon: "🔐", label: "Login to ETM",       sub: "ETM Platform",          bg: "1e293b" },
  { icon: "☰",  label: "ETM Navigation",     sub: "Left sidebar",          bg: "312e81" },
  { icon: "⎇",  label: 'Click "Attack Path"', sub: "Active nav state",     bg: "1d4ed8" },
  { icon: "📊", label: "Attack Path Insights", sub: "Lands on 01 Discover", bg: "0e7490" },
  { icon: "✦",  label: "Journey Begins",     sub: "Scan data pre-loaded",  bg: "065f46" },
];

const nodeW = 1.7;
const nodeSpacing = (COL_TOTAL_W - 0.12 - 5 * nodeW) / 4;
let nx = COL_PAD_L + 0.06;

for (let i = 0; i < entryNodes.length; i++) {
  const n = entryNodes[i];
  // Icon circle
  slide.addShape(prs.shapes.OVAL, {
    x: nx + 0.02, y: EF_Y + 0.16, w: 0.22, h: 0.22,
    fill: { color: n.bg }, line: { color: n.bg },
  });
  slide.addText(n.icon, {
    x: nx + 0.02, y: EF_Y + 0.16, w: 0.22, h: 0.22,
    fontSize: 8, align: "center", valign: "middle", margin: 0, fontFace: "Segoe UI Emoji",
  });
  // Text
  slide.addText([
    { text: n.label, options: { bold: true, breakLine: true } },
    { text: n.sub,   options: { color: "64748b" } },
  ], {
    x: nx + 0.26, y: EF_Y + 0.14, w: nodeW - 0.28, h: 0.3,
    fontSize: 7.5, color: "1e293b", fontFace: "Calibri",
    valign: "middle", margin: 0,
  });

  // Arrow between nodes
  if (i < entryNodes.length - 1) {
    const arrowX = nx + nodeW;
    slide.addShape(prs.shapes.LINE, {
      x: arrowX + 0.02, y: EF_Y + EF_H / 2, w: nodeSpacing - 0.04, h: 0,
      line: { color: "94a3b8", width: 1 },
    });
    slide.addText("▶", {
      x: arrowX + nodeSpacing - 0.16, y: EF_Y + EF_H / 2 - 0.08, w: 0.14, h: 0.14,
      fontSize: 7, color: "94a3b8", align: "center", valign: "middle", margin: 0, fontFace: "Calibri",
    });
  }
  nx += nodeW + nodeSpacing;
}

// ── COLUMN HEADERS ──────────────────────────────────────────────────────
const HEADER_H = 0.44;
const phaseHeaders = [
  { num: "01", title: "Discover",  sub: "Browse & filter attack paths", color: C_DISCOVER },
  { num: "02", title: "Analyze",   sub: "Drill into path detail",        color: C_ANALYZE },
  { num: "03", title: "Remediate", sub: "Prioritized fixes & ROI",       color: C_REMEDIATE },
];

phaseHeaders.forEach((ph, i) => {
  slide.addShape(prs.shapes.RECTANGLE, {
    x: COL_X[i], y: COL_AREA_Y, w: COL_W, h: HEADER_H,
    fill: { color: ph.color }, line: { color: ph.color },
  });
  // Big number (ghost)
  slide.addText(ph.num, {
    x: COL_X[i] + 0.06, y: COL_AREA_Y + 0.02, w: 0.42, h: HEADER_H - 0.04,
    fontSize: 28, bold: true, color: "FFFFFF", fontFace: "Calibri",
    valign: "middle", margin: 0,
    transparency: 65,
  });
  // Title + subtitle
  slide.addText([
    { text: ph.title, options: { bold: true, breakLine: true, fontSize: 13 } },
    { text: ph.sub,   options: { bold: false, fontSize: 8 } },
  ], {
    x: COL_X[i] + 0.5, y: COL_AREA_Y + 0.04, w: COL_W - 0.56, h: HEADER_H - 0.08,
    color: "FFFFFF", fontFace: "Calibri",
    valign: "middle", margin: 0,
  });
});

// ── COLUMN BACKGROUNDS ───────────────────────────────────────────────────
const BODY_Y = COL_AREA_Y + HEADER_H;
const BODY_H = COL_AREA_H - HEADER_H;

COL_X.forEach((cx, i) => {
  slide.addShape(prs.shapes.RECTANGLE, {
    x: cx, y: BODY_Y, w: COL_W, h: BODY_H,
    fill: { color: "FFFFFF" }, line: { color: "e2e8f0", width: 0.75 },
  });
});

// ── HELPER: add a step card ──────────────────────────────────────────────
// Returns the height of the card drawn
function addCard(slide, prs, x, y, w, title, lines, bgColor, borderColor, titleColor) {
  const INNER_PAD = 0.06;
  const lineH = 0.115;
  const titleH = 0.155;
  const cardH = titleH + lines.length * lineH + INNER_PAD * 2 + 0.02;

  slide.addShape(prs.shapes.RECTANGLE, {
    x, y, w, h: cardH,
    fill: { color: bgColor }, line: { color: borderColor, width: 0.75 },
  });

  // Title
  slide.addText(title, {
    x: x + INNER_PAD, y: y + INNER_PAD, w: w - INNER_PAD * 2, h: titleH,
    fontSize: 8, bold: true, color: titleColor || "1e293b", fontFace: "Calibri",
    valign: "top", margin: 0, wrap: true,
  });

  // Body lines
  lines.forEach((line, li) => {
    slide.addText(line, {
      x: x + INNER_PAD, y: y + INNER_PAD + titleH + li * lineH, w: w - INNER_PAD * 2, h: lineH,
      fontSize: 7, color: "475569", fontFace: "Calibri",
      valign: "top", margin: 0, wrap: true,
    });
  });

  return cardH;
}

// small connector arrow
function addArrow(slide, prs, x, y, w) {
  const arrowH = 0.14;
  slide.addText("▼", {
    x: x + w / 2 - 0.07, y: y + 0.01, w: 0.14, h: 0.1,
    fontSize: 7, color: "94a3b8", align: "center", valign: "middle", margin: 0, fontFace: "Calibri",
  });
  return arrowH;
}

const CARD_GAP = 0.08;
const ARROW_H = 0.13;
const CARD_W = COL_W - 0.12;
const CARD_X_OFF = 0.06;

// ═══════════════════════════════════════════════════════════════════════
// COLUMN 1 — DISCOVER
// ═══════════════════════════════════════════════════════════════════════
{
  let cy = BODY_Y + 0.06;
  const cx = COL_X[0] + CARD_X_OFF;
  const cw = CARD_W;

  // Card 1 — Dashboard
  let h = addCard(slide, prs, cx, cy, cw,
    "1. View Summary Dashboard",
    [
      "5 KPI cards auto-populate with live scan data",
      "14 Total Paths  •  5 Critical  •  Avg Score 73",
      "2 Crown Jewels  •  4 Entry Points",
    ],
    "eff6ff", "bfdbfe", "1d4ed8"
  );
  cy += h + CARD_GAP;
  addArrow(slide, prs, cx, cy - CARD_GAP, cw);

  // Card 2 — Filters
  h = addCard(slide, prs, cx, cy, cw,
    "2. Apply Quick Filters",
    [
      "Severity: All / Critical (5) / High (7) / Medium (2)",
      "Entry Point: Internet, S3, VPN, Lambda",
      "Time Range: Last 7 / 30 / 90 Days",
    ],
    "f8fafc", "e2e8f0", "1e293b"
  );
  cy += h + CARD_GAP;
  addArrow(slide, prs, cx, cy - CARD_GAP, cw);

  // Card 3 — Search
  h = addCard(slide, prs, cx, cy, cw,
    "3. Search by Any Entity",
    [
      "Asset names: redis, api-gateway, PostgreSQL",
      "CVE / Technique: CVE-2024-3094, T1190, DCSync",
      "Edge / Gap: JWT Bypass, WriteDACL, public-read",
      "Match chip shown in row for entity matched",
    ],
    "f8fafc", "e2e8f0", "1e293b"
  );
  cy += h + CARD_GAP;
  addArrow(slide, prs, cx, cy - CARD_GAP, cw);

  // Card 4 — Table
  h = addCard(slide, prs, cx, cy, cw,
    "4. Browse Attack Paths Table",
    [
      "CID — Unique path identifier (5014, 5024…)",
      "Title + Chain — Attack path narrative & hop sequence",
      "Crown Jewel — Target asset  •  Risk Score (max 97)",
      "Hops / Gaps — Path depth & chained exposures",
    ],
    "eff6ff", "bfdbfe", "1d4ed8"
  );
  cy += h + CARD_GAP;
  addArrow(slide, prs, cx, cy - CARD_GAP, cw);

  // Decision
  h = addCard(slide, prs, cx, cy, cw,
    "Decision: Select a path → click Analyze",
    [
      "Yes — Click Analyze button on row  →  02 Analyze",
      "Browse more ↑  |  Refine filters",
    ],
    "fefce8", "fde68a", "854d0e"
  );
  cy += h + CARD_GAP;
  addArrow(slide, prs, cx, cy - CARD_GAP, cw);

  // Transition
  addCard(slide, prs, cx, cy, cw,
    "→ Tab switches to 02 Analyze (tab unlocks)",
    [
      "CID badge appears in tab header",
      "02 Analyze & 03 Remediate tabs unlock",
      "Selected path context carries forward",
    ],
    "f0fdf4", "bbf7d0", "166534"
  );
}

// ═══════════════════════════════════════════════════════════════════════
// COLUMN 2 — ANALYZE
// ═══════════════════════════════════════════════════════════════════════
{
  let cy = BODY_Y + 0.06;
  const cx = COL_X[1] + CARD_X_OFF;
  const cw = CARD_W;
  const lineH_sm = 0.105;

  function addCardSm(title, lines, bgColor, borderColor, titleColor) {
    const INNER_PAD = 0.055;
    const lH = lineH_sm;
    const tH = 0.14;
    const cardH = tH + lines.length * lH + INNER_PAD * 2 + 0.01;

    slide.addShape(prs.shapes.RECTANGLE, {
      x: cx, y: cy, w: cw, h: cardH,
      fill: { color: bgColor }, line: { color: borderColor, width: 0.75 },
    });
    slide.addText(title, {
      x: cx + INNER_PAD, y: cy + INNER_PAD, w: cw - INNER_PAD * 2, h: tH,
      fontSize: 7.5, bold: true, color: titleColor || "1e293b", fontFace: "Calibri",
      valign: "top", margin: 0, wrap: true,
    });
    lines.forEach((line, li) => {
      slide.addText(line, {
        x: cx + INNER_PAD, y: cy + INNER_PAD + tH + li * lH, w: cw - INNER_PAD * 2, h: lH,
        fontSize: 6.8, color: "475569", fontFace: "Calibri",
        valign: "top", margin: 0, wrap: true,
      });
    });
    cy += cardH + CARD_GAP;
    addArrow(slide, prs, cx, cy - CARD_GAP, cw);
    return cardH;
  }

  addCardSm("1. Path Context Header",
    ["Severity, score, status, risk at a glance",
     "CRITICAL  •  Risk 97  •  Open  •  ← Back to all paths"],
    "eff6ff", "bfdbfe", "0e7490");

  addCardSm("2. Asset Type Breakdown",
    ["4 Asset Types: Internet Entry, Host/VM, IAM, Crown Jewel",
     "Hover node → OS, ports, exploitability, attack technique"],
    "eff6ff", "bfdbfe", "0e7490");

  addCardSm("3. Multi-Step Attack Path Tracing",
    ["Visual node flow: Entry → Intermediate → Crown Jewel 👑",
     "Edge labels: attack technique per hop (JWT Bypass…)",
     "Node severity color-coding: Critical/High/Medium"],
    "eff6ff", "bfdbfe", "0e7490");

  addCardSm("4. Security Gap Chaining",
    ["Click edge arrow → gap detail (technique, CVE, config)",
     "Default: first edge — updates per selected connection",
     "Selected edge highlighted in indigo with ring indicator"],
    "f8fafc", "e2e8f0", "1e293b");

  addCardSm("5. Asset Metadata Enrichment",
    ["OS Version  •  Open Ports  •  Exploitability",
     "Business Criticality  •  Services (Qualys scan data)"],
    "f8fafc", "e2e8f0", "1e293b");

  addCardSm("6. Contextual Risk Scoring",
    ["API Gateway 73→97 (+24%) · Toxic Combination chokepoint",
     "Redis Cache 65→94 (+29%) · No-auth credential store",
     "Dev Test Server 62→27 (-57%) · Isolated VLAN, no path"],
    "f8fafc", "e2e8f0", "1e293b");

  addCardSm("7. Toxic Combinations Detected",
    ["3 detected: CVE + IAM + Exposure",
     "Kerberoast + WriteDACL  •  S3 + Redis + Credentials"],
    "fef2f2", "fecaca", "dc2626");

  addCardSm("8. Privilege Escalation Mapping",
    ["Standard User → T1078.002",
     "Local Admin → T1548.002 (UAC Bypass)",
     "NT SYSTEM → T1068  •  DCSync → Domain Admin T1003.006"],
    "f8fafc", "e2e8f0", "1e293b");

  addCardSm("9. Identity & Lateral Movement",
    ["svc_backup — CRITICAL  •  admin.jones — CRITICAL",
     "WriteDACL / Kerberoastable  •  AD group memberships"],
    "f8fafc", "e2e8f0", "1e293b");

  // Transition card (no arrow after)
  const INNER_PAD2 = 0.055;
  const tH2 = 0.14;
  const lH2 = 0.105;
  const lines2 = ["Path context (CID 5014) pre-scoped to remediation", "4 remediation actions ready"];
  const cardH2 = tH2 + lines2.length * lH2 + INNER_PAD2 * 2 + 0.01;
  slide.addShape(prs.shapes.RECTANGLE, {
    x: cx, y: cy, w: cw, h: cardH2,
    fill: { color: "f0fdf4" }, line: { color: "bbf7d0", width: 0.75 },
  });
  slide.addText("→ Proceed to 03 Remediate", {
    x: cx + INNER_PAD2, y: cy + INNER_PAD2, w: cw - INNER_PAD2 * 2, h: tH2,
    fontSize: 7.5, bold: true, color: "166534", fontFace: "Calibri",
    valign: "top", margin: 0,
  });
  lines2.forEach((line, li) => {
    slide.addText(line, {
      x: cx + INNER_PAD2, y: cy + INNER_PAD2 + tH2 + li * lH2, w: cw - INNER_PAD2 * 2, h: lH2,
      fontSize: 6.8, color: "475569", fontFace: "Calibri",
      valign: "top", margin: 0,
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════
// COLUMN 3 — REMEDIATE
// ═══════════════════════════════════════════════════════════════════════
{
  let cy = BODY_Y + 0.06;
  const cx = COL_X[2] + CARD_X_OFF;
  const cw = CARD_W;

  function addCardR(title, lines, bgColor, borderColor, titleColor) {
    const INNER_PAD = 0.06;
    const lH = 0.11;
    const tH = 0.145;
    const cardH = tH + lines.length * lH + INNER_PAD * 2 + 0.01;

    slide.addShape(prs.shapes.RECTANGLE, {
      x: cx, y: cy, w: cw, h: cardH,
      fill: { color: bgColor }, line: { color: borderColor, width: 0.75 },
    });
    slide.addText(title, {
      x: cx + INNER_PAD, y: cy + INNER_PAD, w: cw - INNER_PAD * 2, h: tH,
      fontSize: 7.5, bold: true, color: titleColor || "1e293b", fontFace: "Calibri",
      valign: "top", margin: 0, wrap: true,
    });
    lines.forEach((line, li) => {
      slide.addText(line, {
        x: cx + INNER_PAD, y: cy + INNER_PAD + tH + li * lH, w: cw - INNER_PAD * 2, h: lH,
        fontSize: 6.8, color: "475569", fontFace: "Calibri",
        valign: "top", margin: 0, wrap: true,
      });
    });
    cy += cardH + CARD_GAP;
    addArrow(slide, prs, cx, cy - CARD_GAP, cw);
    return cardH;
  }

  addCardR("1. Risk Summary Dashboard",
    ["3 Toxic Combos detected  •  3 Assets score elevated",
     "Avg ROI: 5.4  (Risk Reduction Value ÷ Remediation Cost)"],
    "eff6ff", "bfdbfe", "065f46");

  addCardR("2. Prioritized Remediation Actions",
    ["CRITICAL — Patch CVE-2024-3094 · ETA: 1d · ROI: 8.2",
     "CRITICAL — Enable Redis AUTH port 6379 · ROI: 7.5",
     "HIGH     — Network segmentation cache↔DB · ROI: 3.8",
     "MEDIUM   — Remove AdministratorAccess IAM · ROI: 2.1"],
    "eff6ff", "bfdbfe", "065f46");

  addCardR("3. Take Action on Each Finding",
    ["Mark as Fixed — Issue resolved, path risk reduced",
     "Create Ticket — Sends to Jira / ServiceNow",
     "Suppress      — Accepted risk, silenced from scoring"],
    "f8fafc", "e2e8f0", "1e293b");

  addCardR("4. Toxic Combination Identification",
    ["Critical CVE + Over-Privileged IAM + Internet-Facing",
     "Kerberoastable SPN + WriteDACL + Tier-0 Proximity",
     "Public S3 + Cached Creds + No Auth Redis"],
    "fef2f2", "fecaca", "dc2626");

  // Final outcome box
  const INNER_PAD3 = 0.07;
  const tH3 = 0.14;
  const lH3 = 0.108;
  const finalLines = [
    "Attack chain broken — risk score recalculated",
    "Suppressed paths removed from active threat surface",
    "Tickets tracked in external system",
    "→ Return to Discover for next path",
  ];
  const finalH = tH3 + finalLines.length * lH3 + INNER_PAD3 * 2 + 0.04;
  slide.addShape(prs.shapes.RECTANGLE, {
    x: cx, y: cy, w: cw, h: finalH,
    fill: { color: "065f46" }, line: { color: "065f46" },
  });
  slide.addText("Path Risk Addressed", {
    x: cx + INNER_PAD3, y: cy + INNER_PAD3, w: cw - INNER_PAD3 * 2, h: tH3,
    fontSize: 7.5, bold: true, color: "FFFFFF", fontFace: "Calibri",
    valign: "top", margin: 0,
  });
  finalLines.forEach((line, li) => {
    slide.addText(line, {
      x: cx + INNER_PAD3, y: cy + INNER_PAD3 + tH3 + li * lH3, w: cw - INNER_PAD3 * 2, h: lH3,
      fontSize: 6.8, color: "d1fae5", fontFace: "Calibri",
      valign: "top", margin: 0,
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════
// FOOTER
// ═══════════════════════════════════════════════════════════════════════

// Main footer bar
slide.addShape(prs.shapes.RECTANGLE, {
  x: 0, y: FOOTER_Y, w: W, h: FOOTER_H,
  fill: { color: C_FOOTER }, line: { color: C_FOOTER },
});

// Wave ellipses (decorative)
[
  { x: -0.6, y: FOOTER_Y + 0.1,  w: 2.8, h: 1.4, tp: 75 },
  { x:  0.4, y: FOOTER_Y + 0.25, w: 2.2, h: 1.0, tp: 80 },
  { x:  1.2, y: FOOTER_Y + 0.0,  w: 3.0, h: 1.2, tp: 82 },
].forEach(e => {
  slide.addShape(prs.shapes.OVAL, {
    x: e.x, y: e.y, w: e.w, h: e.h,
    fill: { color: "2563EB", transparency: e.tp },
    line: { color: "2563EB", transparency: e.tp },
  });
});

// Dotted pattern on right side
for (let row = 0; row < 3; row++) {
  for (let col = 0; col < 8; col++) {
    slide.addShape(prs.shapes.OVAL, {
      x: W - 1.8 + col * 0.21, y: FOOTER_Y + 0.12 + row * 0.2, w: 0.055, h: 0.055,
      fill: { color: "3B82F6", transparency: 50 },
      line: { color: "3B82F6", transparency: 50 },
    });
  }
}

// DE-RISK YOUR BUSINESS text
slide.addText([
  { text: "DE-RISK YOUR ", options: { bold: false } },
  { text: "BUSINESS",      options: { bold: true } },
], {
  x: 0.28, y: FOOTER_Y + 0.22, w: 3.2, h: 0.4,
  fontSize: 13, color: "FFFFFF", fontFace: "Calibri",
  valign: "middle", margin: 0, charSpacing: 1,
});

// Qualys logo in footer (right side)
slide.addShape(prs.shapes.OVAL, {
  x: W - 2.05, y: FOOTER_Y + 0.22, w: 0.36, h: 0.36,
  fill: { color: "E5002B" }, line: { color: "E5002B" },
});
slide.addText("Q", {
  x: W - 2.05, y: FOOTER_Y + 0.22, w: 0.36, h: 0.36,
  fontSize: 14, bold: true, color: "FFFFFF", fontFace: "Calibri",
  align: "center", valign: "middle", margin: 0,
});
slide.addText("Qualys.", {
  x: W - 1.64, y: FOOTER_Y + 0.24, w: 1.42, h: 0.32,
  fontSize: 14, bold: false, color: "FFFFFF", fontFace: "Calibri",
  valign: "middle", margin: 0,
});

// ─── Write file ──────────────────────────────────────────────────────────
const outPath = "C:/Users/maghosh/OneDrive - Qualys, Inc/Work/Code/AP_Test/Attack-Path-User-Journey.pptx";
await prs.writeFile({ fileName: outPath });
console.log("Done:", outPath);
