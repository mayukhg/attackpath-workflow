from pathlib import Path

p = Path(r"C:\Users\maghosh\OneDrive - Qualys, Inc\Work\Code\AP_Test_ap-risk\src\components\AttackPathInsights.jsx")
text = p.read_text(encoding="utf-8")

header_old = """        <motion.div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            <h3 className="font-semibold text-white text-sm">Asset Metadata &amp; Risk Scoring</h3>
          </div>
          <span className="text-[10px] text-teal-400 bg-teal-900/20 border border-teal-700/50 px-2 py-0.5 rounded font-medium flex items-center gap-1">
            <Link2 className="w-3 h-3" />
            {sharedIds.length > 0 ? `${sharedIds.length} shared across paths` : 'All resources unique to this path'}
          </span>
        </div>"""

header_old = header_old.replace("motion.", "")

header_new = """        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-4 h-4 text-indigo-400" />
          <h3 className="font-semibold text-white text-sm">Asset Metadata &amp; Risk Scoring</h3>
        </div>"""

if header_old not in text:
    raise SystemExit("header block not found")

text = text.replace(header_old, header_new, 1)

# Strip cross-path logic from mergedAssetRows cards
replacements = [
    (
        """            const pathCount = scoring?.resourceId ? getPathsByResourceId(scoring.resourceId).length : 0
            const otherPaths = a ? getPathsByResourceId(a.id).filter(p => p.id !== selectedPath.id) : []
            const rowKey = a?.id ?? `${scoring.asset}-${idx}`""",
        """            const rowKey = a?.id ?? `${scoring.asset}-${idx}`""",
    ),
    (
        '                className={`border rounded-lg p-3 ${otherPaths.length > 0 ? \'border-teal-700/50 bg-teal-900/20\' : \'border-slate-700\'}`}',
        '                className="border border-slate-700 rounded-lg p-3"',
    ),
    (
        """                      {otherPaths.length > 0 && a && (
                        <button
                          type="button"
                          onClick={() => onOpenResource(a.id)}
                          className="text-[9px] bg-teal-900/30 text-teal-300 border border-teal-700/50 px-1.5 py-0.5 rounded-full hover:bg-teal-800/40 transition-colors flex items-center gap-0.5"
                        >
                          <Link2 className="w-2.5 h-2.5" />
                          ×{otherPaths.length + 1} paths
                        </button>
                      )}
                      {pathCount > 1 && scoring?.resourceId && (
                        <button
                          type="button"
                          onClick={() => onOpenResource(scoring.resourceId)}
                          className="text-[9px] bg-teal-900/20 text-teal-300 border border-teal-700/50 px-1.5 py-0.5 rounded-full hover:bg-teal-900/30 transition-colors flex items-center gap-0.5"
                        >
                          <Link2 className="w-2.5 h-2.5" /> In {pathCount} paths
                        </button>
                      )}
""",
        "",
    ),
    (
        """                    {otherPaths.length > 0 ? (
                      <div className="mt-2 pt-2 border-t border-teal-700/50 flex items-center gap-1.5 flex-wrap">
                        <Link2 className="w-3 h-3 text-teal-300 shrink-0" />
                        <span className="text-[10px] text-teal-300">Also in {otherPaths.length} other path{otherPaths.length > 1 ? 's' : ''}:</span>
                        {otherPaths.map(p => (
                          <button key={p.id} type="button" onClick={() => onSelectPath(p)}
                            className="text-[9px] bg-indigo-900/30 text-indigo-300 border border-indigo-700 px-1.5 py-0.5 rounded hover:bg-indigo-800/40 transition-colors font-mono">
                            AP-{p.id}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-2 pt-2 border-t border-slate-600/50 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-green-500 shrink-0" />
                        <span className="text-[10px] text-green-400">Unique to this path</span>
                      </div>
                    )}
""",
        "",
    ),
]

for old, new in replacements:
    if old not in text:
        raise SystemExit(f"block not found:\n{old[:80]}...")
    text = text.replace(old, new, 1)

p.write_text(text, encoding="utf-8")
print("removed shared path UI from asset metadata section")
