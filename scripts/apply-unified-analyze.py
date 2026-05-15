from pathlib import Path

ROOT = Path(r"C:\Users\maghosh\OneDrive - Qualys, Inc\Work\Code\AP_Test_ap-risk")
jsx = ROOT / "src" / "components" / "AttackPathInsights.jsx"
text = jsx.read_text(encoding="utf-8")

BODY = r'''        <p className="text-[11px] text-slate-300 mb-4">
          Qualys-enriched asset context with dynamic scores adjusted by topological position — elevated for chokepoints, suppressed for isolated assets.
        </p>
        <div className="space-y-3">
          {mergedAssetRows.map((row, idx) => {
            const a = row.resource
            const scoring = row.scoring
            const displayName = a?.name ?? scoring.asset
            const rowKey = a?.id ?? `${scoring.asset}-${idx}`

            return (
              <div
                key={rowKey}
                className="border border-slate-700 rounded-lg p-3"
              >
                <motion.div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap mb-1">
                      <span className="text-xs font-semibold text-white font-mono">{displayName}</span>
                      {!a && scoring && (
                        <span className="text-[9px] text-slate-400 bg-slate-700/60 border border-slate-600 px-1.5 py-0.5 rounded">
                          Contextual asset
                        </span>
                      )}
                    </div>
                    {a && (
                      <div className="flex gap-1.5 flex-wrap">
                        <SeverityBadge level={a.severity} />
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border
                          ${a.exploitability === 'Critical' || a.exploitability === 'High' ? 'bg-red-900/20 text-red-600 border-red-700/50' :
                            a.exploitability === 'Medium' ? 'bg-yellow-900/20 text-yellow-600 border-yellow-700/50' :
                            'bg-slate-700/40 text-slate-400 border-slate-700'}`}>
                          Exploitability: {a.exploitability}
                        </span>
                      </div>
                    )}
                  </div>
                  <ContextualScoreStrip scoring={scoring} />
                </div>

                {a && (
                  <>
                    <div className="text-[10px] text-slate-400 mb-1">{a.os}</div>
                    <div className="grid grid-cols-3 gap-2 text-[10px] mb-2">
                      <div><motion.div className="text-slate-400 font-medium">Criticality</div><div className="text-slate-200">{a.criticality}</div></div>
                      <div><div className="text-slate-400 font-medium">Open Ports</div><div className="text-slate-200 font-mono">{a.ports}</div></div>
                      <div><div className="text-slate-400 font-medium">Services</div><div className="text-slate-200">{a.services}</motion.div></div>
                    </div>
                  </>
                )}

                {scoring?.reason && (
                  <div className={`text-[10px] text-slate-400 ${a ? 'pt-2 border-t border-slate-700/60' : ''}`}>
                    {scoring.reason}
                  </div>
                )}
              </div>
            )
          })}
        </div>
'''

# strip accidental motion. tags
BODY = BODY.replace("motion.", "")

HEADER = '''      {/* ── 5. Asset metadata & risk scoring (unified per asset) ── */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-4 h-4 text-indigo-400" />
          <h3 className="font-semibold text-white text-sm">Asset Metadata &amp; Risk Scoring</h3>
        </div>
'''

start = text.find("      {/* ── 5. Asset metadata & risk scoring")
if start == -1:
    start = text.find("      {/* ── 5. Asset Metadata")
end = text.find("      {/* ── 7. Toxic Combinations ── */}", start)
if start == -1 or end == -1:
    raise SystemExit(f"markers not found start={start} end={end}")

text = text[:start] + HEADER + BODY + "\n      </div>\n\n" + text[end:]

if "const mergedAssetRows = buildMergedAssetRows" not in text:
    text = text.replace(
        "  const sharedIds = selectedPath ? getSharedResourceIds(selectedPath.id) : []\n",
        "  const sharedIds = selectedPath ? getSharedResourceIds(selectedPath.id) : []\n"
        "  const mergedAssetRows = buildMergedAssetRows(pathResources, SCORING_ITEMS)\n",
        1,
    )

jsx.write_text(text, encoding="utf-8")
print("unified Asset Metadata & Risk Scoring applied")
