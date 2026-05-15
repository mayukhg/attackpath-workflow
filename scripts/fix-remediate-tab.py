from pathlib import Path

p = Path(r"C:\Users\maghosh\OneDrive - Qualys, Inc\Work\Code\AP_Test_ap-risk\src\components\AttackPathInsights.jsx")
text = p.read_text(encoding="utf-8")

roi_engine = '''
// ─── ROI Score Engine ─────────────────────────────────────────────────────────
const SEVERITY_PTS   = { CRITICAL: 40, HIGH: 30, MEDIUM: 20, LOW: 10 }
const EFFORT_WEIGHT  = { Low: 1, Medium: 2, High: 3 }
const ETA_WEIGHT = (eta = '') => {
  const s = eta.toLowerCase()
  if (s.includes('min') || (s.includes('hour') && parseInt(s) <= 4)) return 1
  if ((s.includes('hour') && parseInt(s) > 4) || (s.includes('day') && parseInt(s) <= 1)) return 2
  if (s.includes('day') && parseInt(s) <= 4) return 3
  return 4
}
const TOXIC_RES_IDS    = new Set(TOXIC_COMBOS.map(tc => tc.resourceId).filter(Boolean))
const ELEVATED_RES_IDS = new Set(SCORING_ITEMS.filter(s => s.positive && s.resourceId).map(s => s.resourceId))
const ROI_MAX_RAW = 110

function computeRoi(action) {
  const severityPts    = SEVERITY_PTS[action.priority]  ?? 10
  const pathCount      = action.resourceId ? getPathsByResourceId(action.resourceId).length : 1
  const pathMultiplier = Math.max(1, pathCount)
  const toxicBonus     = TOXIC_RES_IDS.has(action.resourceId)    ? 20 : 0
  const elevatedBonus  = ELEVATED_RES_IDS.has(action.resourceId) ? 10 : 0
  const rrv  = severityPts * pathMultiplier + toxicBonus + elevatedBonus
  const effortW = EFFORT_WEIGHT[action.effort] ?? 1
  const etaW    = ETA_WEIGHT(action.eta)
  const cost    = effortW * etaW
  const raw   = rrv / cost
  const score = Math.min(Math.round(raw / ROI_MAX_RAW * 100), 100)
  return {
    score,
    breakdown: {
      severityPts, pathCount, pathMultiplier, toxicBonus, elevatedBonus,
      rrv, effortW, etaW, cost, raw: Math.round(raw * 10) / 10,
    },
  }
}

'''

if "function computeRoi" not in text:
    text = text.replace(
        "// ─── Resource Detail Panel (slide-over) ──────────────────────────────────────",
        roi_engine + "// ─── Resource Detail Panel (slide-over) ──────────────────────────────────────",
        1,
    )

if "const [roiTooltip" not in text:
    text = text.replace(
        "  const [detailOpen,      setDetailOpen]      = useState(null)  // key whose detail/alts panel is open\n"
        "  const [remediatedBanner, setRemediatedBanner] = useState(false)",
        "  const [detailOpen,      setDetailOpen]      = useState(null)  // key whose detail/alts panel is open\n"
        "  const [roiTooltip,      setRoiTooltip]      = useState(null)\n"
        "  const [remediatedBanner, setRemediatedBanner] = useState(false)",
        1,
    )

needle = "            const isDetailOpen = detailOpen === key\n            const alternates   = getAlternates(action)\n\n            return ("
replacement = """            const isDetailOpen = detailOpen === key
            const alternates   = getAlternates(action)
            const { score: roiScore, breakdown: roiB } = computeRoi(action)
            const isRoiOpen    = roiTooltip === key
            const scoreColor   = roiScore >= 70 ? 'text-green-400' : roiScore >= 70 ? 'text-green-400' : roiScore >= 40 ? 'text-orange-500' : 'text-slate-400'
            const borderColor  = roiScore >= 70 ? 'border-green-600/50' : roiScore >= 40 ? 'border-orange-600/50' : 'border-slate-700'

            return ("""

if "const { score: roiScore" not in text:
    if needle not in text:
        raise SystemExit("map block needle not found")
    text = text.replace(needle, replacement, 1)

# fix typo in scoreColor if duplicated condition
text = text.replace(
    "roiScore >= 70 ? 'text-green-400' : roiScore >= 70 ? 'text-green-400' : roiScore >= 40",
    "roiScore >= 70 ? 'text-green-400' : roiScore >= 40",
)

p.write_text(text, encoding="utf-8")
print("fixed RemediateTab ROI")
