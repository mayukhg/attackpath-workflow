import { Home, LayoutDashboard, ShieldAlert, Package, Bot, Plus } from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Add-ons',          icon: Plus,            hash: null },
  { label: 'Home',             icon: Home,            hash: '' },
  { label: 'Dashboard',        icon: LayoutDashboard, hash: null },
  { label: 'Inventory',        icon: Package,         hash: null },
  { label: 'Risk Management',  icon: ShieldAlert,     hash: '/risk-management' },
]

export default function SharedSidebar({ activeItem }) {
  const navigate = (hash) => {
    if (hash === null) return
    window.location.hash = hash
  }

  return (
    <aside className="group/sb absolute left-0 top-0 bottom-0 z-40 flex flex-col bg-[hsl(220,35%,11%)] border-r border-slate-700/40 overflow-hidden transition-[width] duration-200 ease-in-out w-11 hover:w-48">

      {/* ETM label */}
      <div className="px-3 py-2 border-b border-slate-700/30 shrink-0">
        <div className="text-[9px] text-slate-500 font-semibold uppercase tracking-widest whitespace-nowrap">ETM</div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-1">
        {NAV_ITEMS.map(item => {
          const isActive = activeItem === item.label
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.hash)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors
                ${isActive
                  ? 'bg-blue-600/80 text-white'
                  : item.hash !== null
                    ? 'text-slate-400 hover:bg-slate-700/40 hover:text-slate-200 cursor-pointer'
                    : 'text-slate-500 cursor-default'
                }`}
            >
              <item.icon className="w-4.5 h-4.5 shrink-0 w-[18px] h-[18px]" />
              <span className="text-[11px] font-medium whitespace-nowrap opacity-0 group-hover/sb:opacity-100 transition-opacity duration-150">
                {item.label}
              </span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
