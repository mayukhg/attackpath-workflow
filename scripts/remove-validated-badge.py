from pathlib import Path

p = Path(r"C:\Users\maghosh\OneDrive - Qualys, Inc\Work\Code\AP_Test_ap-risk\src\components\AttackPathInsights.jsx")
text = p.read_text(encoding="utf-8")

old = """        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-white text-sm">Attack Path Visualization</h3>
          <span className="text-xs text-green-400 font-medium bg-green-900/20 border border-green-700/50 px-2 py-0.5 rounded">Validated</span>
        </div>"""

new = """        <h3 className="font-semibold text-white text-sm mb-1">Attack Path Visualization</h3>"""

if old not in text:
    raise SystemExit("Validated badge block not found")

p.write_text(text.replace(old, new, 1), encoding="utf-8")
print("removed Validated badge")
