import { Info, AlertTriangle, Globe, Settings } from 'lucide-react'

function TruRiskGauge({ score = 1000 }) {
  const pct = Math.min(score / 1000, 1)
  const r = 75, cx = 100, cy = 100
  const toPoint = (deg) => {
    const rad = (deg * Math.PI) / 180
    return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) }
  }
  const left = toPoint(180)
  const right = toPoint(0)
  const endAngle = 180 - 180 * pct
  const end = toPoint(endAngle)
  const largeArc = pct > 0.5 ? 1 : 0

  return (
    <svg viewBox="15 20 170 90" className="w-72 mx-auto">
      {/* Range band labels */}
      <text x="22" y="72" fill="#475569" fontSize="7" textAnchor="middle">Low</text>
      <text x="40" y="42" fill="#475569" fontSize="7" textAnchor="middle">Med</text>
      <text x="100" y="28" fill="#475569" fontSize="7" textAnchor="middle">High</text>
      <text x="158" y="42" fill="#ef4444" fontSize="7" textAnchor="middle">Crit</text>
      {/* Background track */}
      <path
        d={`M ${left.x} ${left.y} A ${r} ${r} 0 0 0 ${right.x} ${right.y}`}
        fill="none" stroke="#1e3a5f" strokeWidth="16" strokeLinecap="round"
      />
      {/* Filled arc */}
      {pct > 0.01 && (
        <path
          d={`M ${left.x} ${left.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`}
          fill="none" stroke="#dc2626" strokeWidth="16" strokeLinecap="round"
        />
      )}
      {/* Score text */}
      <text x={cx} y={cy - 14} textAnchor="middle" fill="white" fontSize="26" fontWeight="bold">{score}</text>
      <text x={cx} y={cy + 4} textAnchor="middle" fill="#ef4444" fontSize="10">Critical</text>
      {/* Min / Max */}
      <text x={left.x + 2} y={cy + 18} fill="#475569" fontSize="8">0</text>
      <text x={right.x - 2} y={cy + 18} fill="#475569" fontSize="8" textAnchor="end">1000</text>
    </svg>
  )
}

const RISK_FACTORS = [
  { label: 'CISA KEV',          value: '190K' },
  { label: 'Ransomware',        value: '39.2K' },
  { label: 'Threat Actors',     value: '394' },
  { label: 'Weaponized Vulns',  value: '342K' },
]

const BAR_HEIGHTS = [38, 55, 82, 47, 66, 78, 100, 42, 52, 60]

export default function HomePage() {
  return (
    <div className="h-full bg-[#080e17] text-white overflow-y-auto">
      <div className="p-6 max-w-6xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-3">
          <span>⌂</span>
          <span>Home</span>
        </div>

        {/* Title */}
        <h1 className="text-lg font-bold text-white mb-5">
          TruRisk™ Summary:&nbsp;
          <span className="font-normal text-slate-400">Qualys Inc1_edit_yghdc a11</span>
        </h1>

        <div className="grid grid-cols-2 gap-5">
          {/* ── TruRisk Score card ── */}
          <div className="bg-[#0d1929] rounded-xl p-5 border border-slate-700/40">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-sm font-semibold text-white">TruRisk™ Score</span>
              <Info className="w-3.5 h-3.5 text-slate-500" />
            </div>
            <div className="text-[10px] text-slate-500 mb-4">Last Calculated: 16 Apr 2026 12:41 PM</div>

            <div className="text-[11px] text-slate-400 text-center mb-1">
              Contributing Assets:&nbsp;
              <span className="text-blue-400 font-semibold">118K</span>&nbsp;of&nbsp;
              <span className="text-blue-400 font-semibold">321K</span> Total
              <Info className="w-3 h-3 inline-block ml-1 text-slate-600" />
            </div>

            <TruRiskGauge score={1000} />

            <div className="grid grid-cols-2 gap-4 mt-4 text-[11px]">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-yellow-500 mt-0.5 shrink-0" />
                <div>
                  <div className="font-medium text-white">Risk Appetite</div>
                  <div className="text-slate-400 mt-0.5">31/47 business entities are above risk appetite</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Globe className="w-3.5 h-3.5 text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <div className="font-medium text-white">Asset Exposure</div>
                  <div className="text-slate-400 mt-0.5">
                    <span className="text-red-400 font-medium">133 Critical</span> internet exposed assets
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 text-center text-[10px] text-slate-500 flex items-center justify-center gap-1">
              <span className="text-green-400 font-medium">↑ 0 pts</span>
              <span>Since last 7 Days</span>
              <Settings className="w-3 h-3 ml-1 text-slate-600" />
            </div>

            <div className="mt-1 text-center text-[10px] text-slate-500">Showing trend for 90 days</div>
          </div>

          {/* ── Right column ── */}
          <div className="flex flex-col gap-5">
            {/* Top Risk Factors */}
            <div className="bg-[#0d1929] rounded-xl p-5 border border-slate-700/40">
              <div className="text-sm font-semibold text-white mb-3">Top Risk Factors</div>
              <div className="space-y-2.5">
                {RISK_FACTORS.map(f => (
                  <div key={f.label} className="flex items-center justify-between">
                    <span className="text-[12px] text-blue-400 font-semibold">{f.value}</span>
                    <span className="text-[11px] text-slate-400">{f.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Business Entities */}
            <div className="bg-[#0d1929] rounded-xl p-5 border border-slate-700/40 flex-1">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-white">Business Entities</span>
                <div className="flex items-center gap-3">
                  <button className="text-[10px] text-blue-400 hover:underline">View All</button>
                  <button className="text-[10px] bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded transition-colors">
                    Create Business Entity
                  </button>
                </div>
              </div>

              <div className="flex gap-4 border-b border-slate-700/40 pb-2 mb-3">
                {['Overall', 'Top Risky', 'Best Performing'].map((t, i) => (
                  <button key={t} className={`text-[11px] pb-1 border-b-2 -mb-2 transition-colors ${
                    i === 0 ? 'text-white border-blue-500' : 'text-slate-500 border-transparent hover:text-slate-300'
                  }`}>{t}</button>
                ))}
              </div>

              {/* Currency row */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] text-slate-400">Currency</span>
                <div className="flex items-center gap-1 border border-slate-600 rounded px-2 py-0.5 text-[10px] text-slate-300">
                  Australian Dollar ($)
                  <span className="ml-1 text-slate-500">▾</span>
                </div>
              </div>

              {/* Bar chart */}
              <div className="flex items-end gap-1 h-24">
                {BAR_HEIGHTS.map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm"
                    style={{
                      height: `${h}%`,
                      background: i === 7 ? '#dc2626' : '#2563eb',
                    }}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[9px] text-slate-500">0</span>
                <span className="text-[9px] text-slate-500">125</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
