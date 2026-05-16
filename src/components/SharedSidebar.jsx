import { Home, LayoutDashboard, ShieldAlert, Package, Bot, Plus, Target, SlidersHorizontal } from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Add-ons',              icon: Plus,            hash: null },
  { label: 'Cyber Risk Assistant', icon: Bot,             hash: null },
  { label: 'Home',                 icon: Home,            hash: '/home' },
  { label: 'Dashboard',            icon: LayoutDashboard, hash: null },
  { label: 'Inventory',            icon: Package,         hash: null },
  { label: 'Risk Management',      icon: ShieldAlert,     hash: '/findings' },
  { label: 'Configuration',        icon: SlidersHorizontal, hash: '/configuration' },
]

export default function SharedSidebar({ activeItem, expanded = false }) {
  const navigate = (hash) => {
    if (hash === null) return
    window.location.hash = hash
  }

  return (
    <aside
      className={`shrink-0 flex flex-col bg-[hsl(220,35%,11%)] border-r border-slate-700/40 z-40 transition-[width] duration-200 ${
        expanded ? 'w-44' : 'group/sb absolute left-0 top-0 bottom-0 w-11 hover:w-48 overflow-hidden'
      }`}
    >
      <div className="px-3 py-3 border-b border-slate-700/30 shrink-0">
        <div className="text-[9px] text-slate-500 font-semibold uppercase tracking-widest">ETM</div>
        <div className={`text-[11px] font-semibold text-white leading-tight mt-1 ${expanded ? '' : 'opacity-0 group-hover/sb:opacity-100 transition-opacity'}`}>
          Enterprise TruRisk Management
        </div>
      </div>

      <nav className="flex-1 py-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = activeItem === item.label
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => navigate(item.hash)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : item.hash !== null
                    ? 'text-slate-400 hover:bg-slate-700/40 hover:text-slate-200 cursor-pointer'
                    : 'text-slate-500 cursor-default'
              }`}
            >
              <item.icon className="w-[18px] h-[18px] shrink-0" />
              <span
                className={`text-[11px] font-medium whitespace-nowrap ${
                  expanded ? 'opacity-100' : 'opacity-0 group-hover/sb:opacity-100 transition-opacity duration-150'
                }`}
              >
                {item.label}
              </span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
