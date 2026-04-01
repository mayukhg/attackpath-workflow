# Attack Path Insights — CXO Walkthrough Script
**Qualys Enterprise TruRisk™ Platform · ETM Module**
**Audience:** C-Suite / Executive Leadership (CISO, CTO, CEO, Board)
**Duration:** ~12–15 minutes | **Format:** Live demo or narrated slide walkthrough

---

## OPENING — SET THE STAGE
*(Tone: Confident, outcome-first. No jargon. Lead with the business problem.)*

> "Every organization has vulnerabilities. But what keeps security leaders up at night isn't any single vulnerability — it's not knowing which ones, when chained together, could let an attacker walk straight to your most valuable data. That's the problem Attack Path Insights solves. Let me show you how."

---

## ACT 1 — ENTERING THE MODULE
*(Reference: Entry Flow bar — ETM Login → ETM Left Nav → Attack Path)*

> "Your team logs into the Qualys Enterprise TruRisk platform — no context switching, no separate tools. From the left navigation, they click into Attack Path Insights. The screen loads immediately. Everything they need is right here."

**Key message:** Embedded in the existing ETM platform. No new tool to buy or learn.

---

## PHASE 01 — DISCOVER: "KNOW WHAT YOU'RE FACING"

### Opening the Dashboard
*(Reference: KPI Summary Cards)*

> "The first thing your security leader sees are five numbers that tell the whole story at a glance."

Pause and point to each:

- **Total Attack Paths** — how many exploitable chains exist right now
- **Critical Paths** — the ones that go directly to crown jewels
- **Average Risk Score** — the aggregate exposure across your environment
- **Crown Jewels Exposed** — your most business-critical assets currently at risk
- **Entry Points** — how many doors an attacker could walk through today

> "This isn't a laundry list of 50,000 vulnerabilities. It's a boardroom-ready view of actual business risk. Five numbers. Instant answer."

**Key message:** Executive-grade risk summary, not a raw vulnerability count.

---

### Cutting Through the Noise
*(Reference: Apply Filters & Entity Search)*

> "Let's say your CISO just got a Slack message: 'There's a new CVE affecting our Redis infrastructure — are we exposed?' In a traditional tool, that question takes hours. Here, they type 'redis' into the search bar."

> "The platform instantly shows every attack path that includes a Redis node — filtering across asset names, CVE IDs, and techniques simultaneously. The relevant paths surface in seconds, with a match chip on each row showing exactly why it matched."

**Key message:** Minutes to answer the questions that used to take days.

---

### The Attack Paths Table
*(Reference: Browse Attack Paths Table — CID, Chain, Severity, Hops, Risk Score, Resources)*

> "The table gives a ranked list of attack paths, ordered by risk score. But here's what's new — and this is important — look at the Resources column."

> "Some assets show an orange badge that says '3 shared.' That means this particular asset — say, your GraphQL API — isn't just part of this one attack path. It's part of three. Patch it in one path, you're reducing risk across all three simultaneously. That's leverage."

> "Green 'unique' badges are the opposite — fixing those only helps this one path. Your team now knows exactly where to spend limited remediation hours for maximum impact."

**Key message:** Shared resource visibility tells you which fixes have the highest blast radius — for defenders, not just attackers.

---

### Making the Call
*(Reference: Investigate a Path? → Click Analyze)*

> "The team spots a critical path — Internet-facing entry point, through a misconfigured IAM role, into the Finance production database. Risk score: 94. They click Analyze. The context carries forward automatically."

---

## PHASE 02 — ANALYZE: "UNDERSTAND THE BLAST RADIUS"

### Understanding What You're Looking At
*(Reference: Path Context Header)*

> "The Analyze view opens with full context — the path ID, severity badge, current status, and that 94 risk score. They haven't lost where they were. They're drilling deeper, not starting over."

---

### The Attack Chain — Visualized
*(Reference: Asset Type Breakdown & Attack Flow)*

> "Now your team sees the full attack chain laid out visually: Internet entry point → Exposed VM with a critical CVE → Misconfigured IAM role with AdministratorAccess → Lateral move into an S3 bucket → Crown Jewel Finance Database."

> "This is the story an attacker would follow. We've made it visible — and interactive. Clicking any connection between nodes shows the exact technique the attacker would use at that step, mapped to the MITRE ATT&CK framework."

**Key message:** We visualize what an attacker sees, not just what a scanner found.

---

### The Cross-Path Warning — A Critical Differentiator
*(Reference: ⚠️ Shared Resources Warning Banner)*

> "Here's something you won't see in any other platform. Before your analyst dives deep, we surface an orange warning banner."

> "It says: 'This path shares 4 resources with 2 other attack paths.' That's not a footnote — that's the difference between patching one risk and eliminating three simultaneously."

> "It tells them: your Redis cache, your GraphQL API, your Auth Service — these are chokepoints. An attacker who compromises them doesn't just win this path. They win multiple paths. And your analyst needs to know that before they start prioritizing."

**Key message:** We surface cross-path blast radius proactively — before the analyst even has to ask.

---

### Understanding Each Asset's True Risk
*(Reference: Asset Metadata Enrichment + In N paths badge)*

> "Each node in the attack chain shows enriched context — OS version, open ports, exploitability scores, business criticality. But now, nodes that appear in multiple paths carry a teal badge: 'In 3 paths.' Your team can immediately see which assets are chokepoints across the threat landscape."

---

### The Resource Detail Panel — Seeing the Full Picture
*(Reference: 🔍 Resource Detail Panel)*

> "Click on any asset — say, the Auth Service — and a detail panel slides in from the right. It shows the full metadata for that asset. But more importantly, it lists every single attack path this asset belongs to."

> "Your CISO can now answer the question: 'If this asset is compromised, which attack paths does that enable?' That answer is now one click away. Not a 3-hour investigation."

**Key message:** Any asset, any time — instantly see its full threat exposure across all attack paths.

---

### Contextual Risk Scoring — Smart, Not Just Loud
*(Reference: Contextual Risk Scoring)*

> "Standard vulnerability scanners give every critical CVE the same score. We don't. Our contextual risk engine adjusts scores based on where an asset sits in the attack chain."

> "This API Gateway? Its base CVSS score is 73. But because it's a chokepoint — internet-facing, part of a toxic combination, on three attack paths — we elevate it to 97. That's a 24% increase. It deserves more attention, and now it gets it."

> "Conversely, a Dev Test Server with a base score of 62 gets suppressed to 27 because it's isolated — no lateral movement possible, no path to a crown jewel. Your team won't waste time on it."

**Key message:** We score based on actual business risk, not just CVSS. Your team focuses on what actually matters.

---

### Toxic Combinations — The Highest Priority Signals
*(Reference: Toxic Combinations)*

> "The platform auto-detects nodes where three or more critical risk factors intersect simultaneously — a CVE, an IAM misconfiguration, and internet exposure on the same asset. We call these Toxic Combinations."

> "These are your absolute highest priority. One asset, three vectors. An attacker who finds this doesn't need to be sophisticated. They just need to be lucky once."

---

### Understanding How Attackers Escalate Privileges
*(Reference: Privilege Escalation Mapping)*

> "We also map exactly how an attacker would move from a standard user account to full domain compromise — step by step, with the MITRE ATT&CK technique ID at each step."

> "Your security team doesn't have to guess. The attack story is written out for them. They can brief your board, your legal team, or your cyber insurer using this output directly."

---

### Identity and Lateral Movement
*(Reference: Identity & Lateral Movement)*

> "Finally, we surface identity risk — which Active Directory groups, GPOs, and Kerberos delegation paths are exposed on this attack path. Identity is the new perimeter. Your team sees exactly which privileged identities are in the blast radius."

---

## PHASE 03 — REMEDIATE: "FIX WHAT MATTERS MOST, FASTEST"

### The Risk Summary
*(Reference: Review Risk Summary)*

> "The Remediate tab opens with a summary: number of toxic combinations, how many assets had their scores elevated, and the average ROI across all available fixes. In seconds, your team knows the shape of the work ahead."

---

### Prioritized Actions with ROI
*(Reference: Prioritized Action List with ROI)*

> "Every remediation action is ranked — Critical first, then High, Medium, Low. Each action shows three numbers: estimated time to fix, level of effort, and ROI as a multiplier."

> "ROI of 8× means that fix reduces risk by 8 times the cost of implementing it. Your CISO can walk into a budget conversation and say: 'We have a $40,000 fix with an 8× ROI that eliminates our highest-severity attack path.' That's the language the CFO understands."

> "And now — critically — actions on shared resources show a cross-path impact label: 'Affects 3 paths.' One fix, three risk reductions. Your team knows exactly where to start."

**Key message:** ROI-driven remediation turns security spend into a business conversation.

---

### Taking Action
*(Reference: Choose Action — Mark Fixed / Create Ticket / Suppress)*

> "For each action, three choices: Mark it Fixed when done, Create a Ticket directly to your ITSM system, or Suppress with a documented justification — an accepted risk with an audit trail."

> "Nothing falls through the cracks. Everything is tracked. And when your auditors ask — the record is right there."

---

### The Outcome
*(Reference: ✓ Risk Score Reduced · Path Closed)*

> "As actions are addressed, the path risk score drops in real time. When all critical actions are complete, the path closes. Your risk posture, measurably improved. Documented. Defensible."

---

## CLOSING — THE BUSINESS CASE

> "Let me leave you with three numbers."

> "**Hours to minutes** — the time it used to take to answer 'are we exposed to this new threat' versus what you just saw."

> "**One fix, multiple paths** — because we surface shared resources, a single remediation can eliminate risk across multiple attack chains simultaneously. That's not just efficiency — it's strategic leverage."

> "**Measured, documented ROI** — every fix has an ROI multiplier. Your security spend is now a business investment with a calculable return, not a cost center."

> "Attack Path Insights doesn't just tell you what's broken. It tells you what to fix, in what order, and what it's worth. That's the platform your security team needs — and the clarity your board has been asking for."

---

## APPENDIX — EXECUTIVE Q&A TALKING POINTS

| Question | Answer |
|---|---|
| "How is this different from our existing vulnerability scanner?" | Scanners find individual vulnerabilities. We show how they chain together into exploitable attack paths. A CVE with no path to a crown jewel is very different from one that sits on three attack paths leading to your Finance DB. |
| "What does 'crown jewel' mean in this context?" | Any asset your organization defines as business-critical — production databases with PII, financial systems, customer data. You define them; we map every attack path that leads to them. |
| "How does the ROI number get calculated?" | Risk Reduction Value divided by Remediation Cost. The platform factors in severity, blast radius, exploitability, and effort to produce a normalized multiplier. |
| "Can this integrate with our ticketing system?" | Yes — Create Ticket actions can integrate with your ITSM (ServiceNow, Jira, etc.) directly from the Remediate tab. |
| "What happens if we can't fix something immediately?" | Suppress with a documented justification. The accepted risk is recorded with a timestamp and owner — maintaining your audit trail and compliance posture. |
| "How often does the data refresh?" | The attack path graph refreshes as your asset and vulnerability data updates in the Qualys platform — continuously, not periodically. |
