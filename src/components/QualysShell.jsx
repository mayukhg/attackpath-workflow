import { HelpCircle, Mail, Settings, Search, Bell } from 'lucide-react'
import GlobalIconRail from './GlobalIconRail'

export default function QualysShell({ variant = 'module', children }) {
  const isEtm = variant === 'etm'

  return (
    <div className="flex flex-col h-full bg-[#080e17] text-white">
      <header className="h-10 shrink-0 bg-[#0d1117] border-b border-slate-700/50 flex items-center px-4 z-50">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-[#E5002B] flex items-center justify-center shrink-0">
            <span className="text-white text-[10px] font-bold">Q</span>
          </div>
          <span className="text-[11px] font-medium text-slate-300">
            Qualys <span className="text-slate-500">Cloud Platform</span>
          </span>
        </div>
        <div className="ml-auto flex items-center gap-0.5">
          {!isEtm && (
            <button type="button" className="p-1.5 rounded hover:bg-slate-700/50 text-slate-500 transition-colors" aria-label="Search">
              <Search className="w-4 h-4" />
            </button>
          )}
          <button type="button" className="p-1.5 rounded hover:bg-slate-700/50 text-slate-500 transition-colors" aria-label="Help">
            <HelpCircle className="w-4 h-4" />
          </button>
          {!isEtm && (
            <button type="button" className="p-1.5 rounded hover:bg-slate-700/50 text-slate-500 transition-colors" aria-label="Notifications">
              <Bell className="w-4 h-4" />
            </button>
          )}
          <button type="button" className="p-1.5 rounded hover:bg-slate-700/50 text-slate-500 transition-colors" aria-label="Settings">
            <Settings className="w-4 h-4" />
          </button>
          {isEtm && (
            <button type="button" className="p-1.5 rounded hover:bg-slate-700/50 text-slate-500 transition-colors" aria-label="Mail">
              <Mail className="w-4 h-4" />
            </button>
          )}
          <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[10px] font-bold ml-1">
            A
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden min-h-0">
        {!isEtm && <GlobalIconRail />}
        {children}
      </div>
    </div>
  )
}
