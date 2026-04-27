import { useState, useEffect } from 'react'
import { HelpCircle, Mail, Settings } from 'lucide-react'
import AttackPathInsights from './components/AttackPathInsights'
import RiskManagementPage from './components/RiskManagementPage'
import HomePage from './components/HomePage'
import SharedSidebar from './components/SharedSidebar'

export default function App() {
  const [route, setRoute] = useState(window.location.hash)

  useEffect(() => {
    const onHash = () => setRoute(window.location.hash)
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  // Standalone route — no shared chrome
  if (route === '#/insights') return <AttackPathInsights />

  const activeItem = route === '#/risk-management' ? 'Risk Management' : 'Home'
  const content = route === '#/risk-management' ? <RiskManagementPage /> : <HomePage />

  return (
    <div className="flex flex-col h-full bg-[#080e17]">
      {/* ── Top header ── */}
      <header className="h-10 shrink-0 bg-[#0d1117] border-b border-slate-700/50 flex items-center px-4 z-50">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-[#E5002B] flex items-center justify-center shrink-0">
            <span className="text-white text-[10px] font-bold">Q</span>
          </div>
          <span className="text-[11px] font-medium text-slate-300">
            Qualys <span className="text-slate-500">Cloud Platform</span>
          </span>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <button className="p-1.5 rounded hover:bg-slate-700/50 text-slate-500 transition-colors">
            <HelpCircle className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded hover:bg-slate-700/50 text-slate-500 transition-colors">
            <Mail className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded hover:bg-slate-700/50 text-slate-500 transition-colors">
            <Settings className="w-4 h-4" />
          </button>
          <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[10px] font-bold ml-1">
            A
          </div>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden relative">
        <SharedSidebar activeItem={activeItem} />
        {/* ml-11 leaves room for the collapsed sidebar (44px = w-11) */}
        <div className="flex-1 ml-11 h-full overflow-hidden">
          {content}
        </div>
      </div>
    </div>
  )
}
