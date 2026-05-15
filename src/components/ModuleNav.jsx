const TABS = [
  { id: 'findings', label: 'Findings', hash: '/findings' },
  { id: 'risk-workbench', label: 'Risk Workbench', hash: null },
  { id: 'risk-custom', label: 'Risk Customization', hash: null },
  { id: 'mitre', label: 'MITRE ATT&CK Matrix', hash: null },
  { id: 'finding-rules', label: 'Finding Rules', hash: null },
  { id: 'attack-path', label: 'Attack Path', hash: '/attack-path' },
]

export default function ModuleNav({ active }) {
  const go = (hash) => {
    if (!hash) return
    window.location.hash = hash
  }

  return (
    <nav className="bg-[#0d1117] border-b border-slate-700/60 shrink-0">
      <div className="flex items-center gap-0 px-2 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => go(t.hash)}
            className={`px-4 py-2.5 text-[12px] font-medium whitespace-nowrap border-b-2 transition-colors -mb-px ${
              active === t.id
                ? 'border-white text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
    </nav>
  )
}
