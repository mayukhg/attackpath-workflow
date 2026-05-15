import { useState, useEffect } from 'react'
import { Home, LayoutDashboard, Package, Shield } from 'lucide-react'

const ICONS = [
  { id: 'home', icon: Home, hash: '/home', label: 'Home' },
  { id: 'dashboard', icon: LayoutDashboard, hash: null, label: 'Dashboard' },
  { id: 'inventory', icon: Package, hash: null, label: 'Inventory' },
  { id: 'etm', icon: Shield, hash: '/findings', label: 'ETM / Risk', activeOn: ['findings', 'attack-path'] },
]

function parseRouteKey(hash) {
  const h = hash || '#/home'
  if (h.startsWith('#/attack-path') || h.startsWith('#/insights')) return 'attack-path'
  if (h.startsWith('#/findings') || h.startsWith('#/risk-management')) return 'findings'
  return 'home'
}

export default function GlobalIconRail() {
  const [current, setCurrent] = useState(() => parseRouteKey(window.location.hash))

  useEffect(() => {
    const onHash = () => setCurrent(parseRouteKey(window.location.hash))
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const navigate = (hash) => {
    if (!hash) return
    window.location.hash = hash
  }

  return (
    <aside className="w-11 shrink-0 bg-[#0a0f18] border-r border-slate-700/40 flex flex-col items-center py-2 gap-1 z-30">
      {ICONS.map(({ id, icon: Icon, hash, label, activeOn }) => {
        const active = activeOn ? activeOn.includes(current) : current === id
        return (
          <button
            key={id}
            type="button"
            title={label}
            onClick={() => navigate(hash)}
            className={`w-9 h-9 rounded flex items-center justify-center transition-colors ${
              active ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'
            }`}
          >
            <Icon className="w-4 h-4" />
          </button>
        )
      })}
    </aside>
  )
}
