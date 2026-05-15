from pathlib import Path

p = Path(r"C:\Users\maghosh\OneDrive - Qualys, Inc\Work\Code\AP_Test_ap-risk\src\components\AttackPathInsights.jsx")
text = p.read_text(encoding="utf-8")

ticket_btn = """                  <button
                    onClick={() => toggleAction(key, 'ticket')}
                    className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded border transition-colors
                      ${state === 'ticket' ? 'bg-blue-600 text-white border-blue-600' : 'border-blue-500 text-blue-300 hover:bg-blue-900/20'}`}
                  >
                    <Ticket className="w-3 h-3" /> Create Ticket
                  </button>
"""

complete_btn = """                  <button
                    onClick={() => markComplete(key)}
                    className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded border transition-colors
                      ${state === 'complete' ? 'bg-emerald-600 text-white border-emerald-600' : 'border-emerald-600 text-emerald-400 hover:bg-emerald-900/20'}`}
                  >
                    <CheckCircle className="w-3 h-3" /> Mark Complete
                  </button>
"""

for name, block in [("ticket", ticket_btn), ("complete", complete_btn)]:
    if block not in text:
        raise SystemExit(f"{name} block not found")
    text = text.replace(block, "")

p.write_text(text, encoding="utf-8")
print("removed Create Ticket and Mark Complete buttons")
