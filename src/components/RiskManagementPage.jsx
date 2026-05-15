import { useState, useEffect, useCallback } from 'react'
import {
  ShieldAlert, Search, Filter, ChevronDown, ChevronRight, ChevronLeft,
  RefreshCw, Plus, MoreVertical, AlertTriangle, Clock, Wrench,
  BarChart2, Target, Grid, BookOpen, FileText, GitBranch, Eye,
  HelpCircle, Settings, X
} from 'lucide-react'
import AttackPathInsights from './AttackPathInsights'

// ─── Mock findings data ───────────────────────────────────────────────────────
const FINDINGS = [
  {
    id: 1, title: 'EOS Operating System', type: 'MISCONFIGURATION',
    tags: ['EOL/E...'], eolLine1: 'EOL: Oct 09, 2018, EOS: Oct 1...',
    policy: 'Organization Policy',
    tech: 'Microsoft Windows Server...', techSub: 'Windows / Server',
    qvssLevel: 'Low', qvssCount: 2,
    source: 'vmdr', asset: 'vdb10', assetType: 'HOST', assetId: '124507',
    artifacts: 3, artifactsFail: true, firstFound: 'First Found: Feb 0...', status: 'Fail',
  },
  {
    id: 2, title: 'EOS Operating System', type: 'MISCONFIGURATION',
    tags: ['EOL/E...'], eolLine1: 'EOL: Oct 09, 2018, EOS: Oct 1...',
    policy: 'Organization Policy',
    tech: 'Microsoft Windows Server...', techSub: 'Windows / Server',
    qvssLevel: 'Low', qvssCount: 2,
    source: 'vmdr', asset: 'DBSPEC', assetType: 'HOST', assetId: '132711',
    artifacts: null, artifactsFail: true, firstFound: 'First Found: Aug ...', status: 'Fail',
  },
  {
    id: 3, title: 'EOS Operating System', type: 'MISCONFIGURATION',
    tags: ['EOL/E...'], eolLine1: 'EOL: Jan 13, 2015, EOS: Jan 14...',
    policy: 'Organization Policy',
    tech: 'Microsoft Windows 7 6.1', techSub: 'Windows / Client',
    qvssLevel: 'Medium', qvssCount: 4,
    source: 'vmdr', asset: 'passive1update', assetType: 'HOST', assetId: '124243',
    artifacts: null, artifactsFail: true, firstFound: 'First Found: Feb 0...', status: 'Fail',
  },
  {
    id: 4, title: 'SSL Certificate Expired', type: 'VULNERABILITY',
    tags: ['CVE-2024-1234'], eolLine1: '',
    policy: '',
    tech: 'OpenSSL 1.1.1', techSub: 'Cryptography / TLS',
    qvssLevel: 'Critical', qvssCount: 9,
    source: 'vmdr', asset: 'web-prod-01', assetType: 'HOST', assetId: '198432',
    artifacts: 2, artifactsFail: false, firstFound: 'First Found: Mar 1...', status: 'Active',
  },
  {
    id: 5, title: 'Log4Shell Remote Code Execution', type: 'VULNERABILITY',
    tags: ['CVE-2021-44228'], eolLine1: '',
    policy: '',
    tech: 'Apache Log4j 2.x', techSub: 'Java / Logging',
    qvssLevel: 'Critical', qvssCount: 10,
    source: 'vmdr', asset: 'app-srv-01', assetType: 'HOST', assetId: '201045',
    artifacts: 5, artifactsFail: false, firstFound: 'First Found: Dec 2...', status: 'Active',
  },
  {
    id: 6, title: 'Weak SSH Key Algorithm', type: 'MISCONFIGURATION',
    tags: ['Policy'], eolLine1: '',
    policy: 'CIS Benchmark',
    tech: 'OpenSSH 7.4', techSub: 'Network / SSH',
    qvssLevel: 'Medium', qvssCount: 5,
    source: 'pc', asset: 'linux-srv-07', assetType: 'HOST', assetId: '175321',
    artifacts: 1, artifactsFail: false, firstFound: 'First Found: Jan 5...', status: 'Active',
  },
  {
    id: 7, title: 'SMBv1 Protocol Enabled', type: 'MISCONFIGURATION',
    tags: ['Policy'], eolLine1: '',
    policy: 'Organization Policy',
    tech: 'Microsoft Windows Server 2016', techSub: 'Windows / Server',
    qvssLevel: 'High', qvssCount: 7,
    source: 'vmdr', asset: 'win-dc-02', assetType: 'HOST', assetId: '143289',
    artifacts: null, artifactsFail: false, firstFound: 'First Found: Nov 3...', status: 'New',
  },
  {
    id: 8, title: 'Unencrypted S3 Bucket', type: 'MISCONFIGURATION',
    tags: ['Cloud'], eolLine1: '',
    policy: 'AWS CIS Foundations',
    tech: 'Amazon S3', techSub: 'Cloud / Storage',
    qvssLevel: 'High', qvssCount: 8,
    source: 'cspm', asset: 'prod-data-bucket', assetType: 'CLOUD ASSET', assetId: '389012',
    artifacts: 3, artifactsFail: false, firstFound: 'First Found: Feb 2...', status: 'Active',
  },
]

// ─── Sub-components ───────────────────────────────────────────────────────────
const QVSS_COLORS = {
  Critical: 'bg-red-700 text-white',
  High:     'bg-orange-600 text-white',
  Medium:   'bg-yellow-600 text-white',
  Low:      'bg-gray-600 text-white',
}

function QvssBadge({ level, count }) {
  return (
    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${QVSS_COLORS[level] || 'bg-gray-600 text-white'}`}>
      {level} • {count}
    </span>
  )
}

function SourceIcon({ src }) {
  const colors = { vmdr: 'bg-red-700', pc: 'bg-blue-700', cspm: 'bg-purple-700', easm: 'bg-teal-700' }
  return (
    <div className={`w-6 h-6 rounded flex items-center justify-center ${colors[src] || 'bg-slate-600'}`}>
      <span className="text-[8px] font-bold text-white uppercase">{src[0]}</span>
    </div>
  )
}

// ─── Stats bar ────────────────────────────────────────────────────────────────
const STATS = [
  { label: 'CISA KEV',                  value: '190K',   icon: ShieldAlert, color: 'text-slate-200' },
  { label: 'Ransomware',                value: '39.2K',  icon: AlertTriangle, color: 'text-slate-200' },
  { label: 'Critical Patchable Findings', value: '79.4K', icon: Wrench,       color: 'text-slate-200' },
  { label: 'Detection Age > 90 Days',   value: '1.13M',  icon: Clock,        color: 'text-slate-200' },
  { label: 'Critical Vulnerabilities',  value: '207K',   icon: AlertTriangle, color: 'text-slate-200' },
]

// ─── Left quick filters ───────────────────────────────────────────────────────
const FILTER_TYPE    = [{ label: 'VULNERABILITY', count: '2.34M' }, { label: 'MISCONFIGU...', count: '368K' }]
const FILTER_QVSS    = [{ label: 'LOW', count: '1.82M' }, { label: 'MEDIUM', count: '459K' }, { label: 'HIGH', count: '218K' }, { label: 'CRITICAL', count: '207K' }]
const FILTER_STATUS  = [{ label: 'ACTIVE', count: '2.32M' }, { label: 'FAIL', count: '368K' }, { label: 'NEW', count: '25.4K' }, { label: 'REOPENED', count: '372' }]
const FILTER_SOURCE  = [{ label: 'Own Security', count: '1.2M' }, { label: 'Third Party', count: '890K' }]

function FilterSection({ title, items, active, onToggle }) {
  return (
    <div className="mb-4">
      <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1.5">{title}</div>
      <div className="space-y-0.5">
        {items.map(item => (
          <button
            key={item.label}
            onClick={() => onToggle(item.label)}
            className={`w-full flex items-center justify-between px-2 py-1 rounded text-[11px] transition-colors ${
              active.includes(item.label) ? 'bg-blue-700/40 text-blue-300' : 'text-slate-300 hover:bg-slate-700/60'
            }`}
          >
            <span className="truncate">{item.label}</span>
            <span className={`text-[10px] font-semibold ml-2 shrink-0 ${active.includes(item.label) ? 'text-blue-300' : 'text-slate-400'}`}>
              {item.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

function tabFromHash(hash = window.location.hash) {
  if (hash.startsWith('#/attack-path') || hash.startsWith('#/insights')) return 'attack-path'
  if (hash.includes('workbench')) return 'risk-workbench'
  return 'findings'
}

function hashForTab(tab) {
  if (tab === 'attack-path') return '/attack-path'
  if (tab === 'risk-workbench') return '/findings/workbench'
  return '/findings'
}

function PageHeader({ topTab, onTabChange }) {
  const PAGE_TABS = [
    { id: 'findings', label: 'Findings' },
    { id: 'risk-workbench', label: 'Risk Workbench' },
    { id: 'attack-path', label: 'Attack Path' },
  ]
  return (
    <div className="px-5 pt-4 pb-0 border-b border-slate-700/40 shrink-0">
      <h1 className="text-lg font-semibold text-white">Risk Management</h1>
      <p className="text-[12px] text-slate-400 mt-1 mb-3">
        Prioritized findings, risk signals, and workbench views (prototype shell)
      </p>
      <div className="flex gap-1">
        {PAGE_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onTabChange(t.id)}
            className={`px-4 py-2 text-[12px] font-medium border-b-2 -mb-px transition-colors ${
              topTab === t.id
                ? 'border-slate-300 text-white bg-slate-800/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function RiskManagementPage() {
  const [topTab,    setTopTab]    = useState(() => tabFromHash())
  const [subTab,    setSubTab]    = useState('all')

  const onTabChange = useCallback((tab) => {
    setTopTab(tab)
    const next = hashForTab(tab)
    if (window.location.hash !== `#${next}`) {
      window.location.hash = next
    }
  }, [])

  useEffect(() => {
    const onHash = () => setTopTab(tabFromHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  const [search,    setSearch]    = useState('')
  const [activeFilters, setActiveFilters] = useState([])
  const [viewMode,  setViewMode]  = useState('finding') // 'asset' | 'finding'

  const toggleFilter = (label) =>
    setActiveFilters(prev => prev.includes(label) ? prev.filter(f => f !== label) : [...prev, label])

  const SUB_TABS = [
    { id: 'overview',          label: 'Overview' },
    { id: 'all',               label: 'All' },
    { id: 'vulnerabilities',   label: 'Vulnerabilities' },
    { id: 'misconfigurations', label: 'Misconfigurations' },
  ]

  const filtered = FINDINGS.filter(f => {
    if (!search) return true
    return f.title.toLowerCase().includes(search.toLowerCase()) ||
           f.asset.toLowerCase().includes(search.toLowerCase())
  }).filter(f => {
    if (subTab === 'vulnerabilities')   return f.type === 'VULNERABILITY'
    if (subTab === 'misconfigurations') return f.type === 'MISCONFIGURATION'
    return true
  })

  if (topTab === 'attack-path') {
    return (
      <div className="flex flex-col h-full bg-[#0d1117] text-white overflow-hidden">
        <PageHeader topTab={topTab} onTabChange={onTabChange} />
        <div className="flex-1 overflow-hidden">
          <AttackPathInsights embedded />
        </div>
      </div>
    )
  }

  if (topTab === 'risk-workbench') {
    return (
      <div className="flex flex-col h-full bg-[#0d1117] text-white">
        <PageHeader topTab={topTab} onTabChange={onTabChange} />
        <div className="flex-1 flex items-center justify-center text-slate-500 text-sm p-8">
          Risk Workbench view (prototype shell)
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-[#0d1117] text-white">
      <PageHeader topTab={topTab} onTabChange={onTabChange} />

      {/* ── Sub-tabs + total count ──────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 border-b border-slate-700/40 bg-[#0d1117] shrink-0">
        <div className="flex gap-0">
          {SUB_TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setSubTab(t.id)}
              className={`px-4 py-2 text-[12px] font-medium border-b-2 transition-colors -mb-px ${
                subTab === t.id
                  ? 'border-blue-400 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <span className="text-[11px] text-slate-400">2.71M</span>
      </div>

      <div className="flex flex-1 overflow-hidden">

        {/* ── Left quick-filter panel ─────────────────────────────────── */}
        <div className="w-48 shrink-0 border-r border-slate-700/40 bg-[#0d1117] overflow-y-auto p-3">
          <div className="flex items-center gap-1.5 mb-3">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px] font-semibold text-slate-200">Quick Filters</span>
          </div>
          <FilterSection title="Type"      items={FILTER_TYPE}   active={activeFilters} onToggle={toggleFilter} />
          <FilterSection title="QVSS Base" items={FILTER_QVSS}   active={activeFilters} onToggle={toggleFilter} />
          <FilterSection title="Status"    items={FILTER_STATUS} active={activeFilters} onToggle={toggleFilter} />
          <FilterSection title="Source"    items={FILTER_SOURCE} active={activeFilters} onToggle={toggleFilter} />
        </div>

        {/* ── Main content ────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto flex flex-col">

          {/* Stats bar */}
          <div className="flex items-stretch border-b border-slate-700/40 shrink-0">
            {STATS.map((s, i) => (
              <div key={s.label} className={`flex-1 flex items-center gap-3 px-5 py-3 ${i < STATS.length - 1 ? 'border-r border-slate-700/40' : ''}`}>
                <div>
                  <div className="text-xl font-bold text-slate-100">{s.value}</div>
                  <div className="text-[10px] text-slate-400 leading-tight">{s.label}</div>
                </div>
                <s.icon className="w-6 h-6 text-slate-600 ml-auto shrink-0" />
              </div>
            ))}
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-700/40 shrink-0 bg-[#0d1117]">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded text-[11px] text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* View toggle */}
            <button
              onClick={() => setViewMode(v => v === 'asset' ? 'finding' : 'asset')}
              className={`text-[11px] px-3 py-1.5 rounded border transition-colors ${viewMode === 'asset' ? 'bg-blue-600 border-blue-500 text-white' : 'border-slate-600 text-slate-400 hover:text-slate-200'}`}
            >
              Asset
            </button>
            <button
              onClick={() => setViewMode(v => v === 'finding' ? 'asset' : 'finding')}
              className={`text-[11px] px-3 py-1.5 rounded border transition-colors ${viewMode === 'finding' ? 'bg-blue-600 border-blue-500 text-white' : 'border-slate-600 text-slate-400 hover:text-slate-200'}`}
            >
              Finding
            </button>

            <button className="flex items-center gap-1 text-[11px] text-slate-300 border border-slate-600 px-3 py-1.5 rounded hover:bg-slate-700/40">
              Group by <ChevronDown className="w-3 h-3" />
            </button>
            <button className="flex items-center gap-1 text-[11px] text-slate-300 border border-slate-600 px-3 py-1.5 rounded hover:bg-slate-700/40">
              <Filter className="w-3 h-3" />
              <span className="bg-blue-600 text-white text-[9px] font-bold px-1 rounded">3</span>
              Filters <ChevronDown className="w-3 h-3" />
            </button>

            <div className="flex items-center gap-1 ml-auto text-[11px] text-slate-400">
              <button className="p-1.5 hover:text-slate-200"><ChevronLeft className="w-3.5 h-3.5" /></button>
              <span>1 / 54242 pages</span>
              <button className="p-1.5 hover:text-slate-200"><ChevronRight className="w-3.5 h-3.5" /></button>
              <span className="ml-2">Total 2.71M</span>
              <button className="p-1.5 hover:text-slate-200 ml-1"><RefreshCw className="w-3.5 h-3.5" /></button>
            </div>
          </div>

          {/* Table header */}
          <div className="grid gap-2 px-3 py-2 bg-slate-800/60 border-b border-slate-700/40 text-[10px] font-semibold text-slate-300 uppercase tracking-wider shrink-0"
               style={{ gridTemplateColumns: '2fr 1fr 90px 50px 130px 120px 130px' }}>
            <div>Title</div>
            <div>Technology/Category</div>
            <div>QVSS Base</div>
            <div>Sources</div>
            <div>Impacted Asset</div>
            <div>Supporting Artifacts</div>
            <div>LifeCycle</div>
          </div>

          {/* Table rows */}
          <div className="divide-y divide-slate-800 flex-1">
            {filtered.map(f => (
              <div
                key={f.id}
                className="grid gap-2 px-3 py-3 hover:bg-slate-800/40 transition-colors items-start cursor-pointer"
                style={{ gridTemplateColumns: '2fr 1fr 90px 50px 130px 120px 130px' }}
              >
                {/* Title */}
                <div>
                  <div className="text-[12px] font-semibold text-blue-400 hover:underline leading-tight">{f.title}</div>
                  <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                    <span className="text-[9px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded uppercase font-medium">{f.type}</span>
                    {f.tags.map(tag => (
                      <span key={tag} className="text-[9px] bg-slate-700/60 text-slate-400 px-1.5 py-0.5 rounded">{tag}</span>
                    ))}
                  </div>
                  {f.eolLine1 && <div className="text-[10px] text-red-400 mt-0.5 leading-tight">{f.eolLine1}</div>}
                  {f.policy && <div className="text-[10px] text-slate-400 mt-0.5">{f.policy}</div>}
                </div>

                {/* Tech */}
                <div>
                  <div className="text-[11px] text-slate-300 leading-tight">{f.tech}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{f.techSub}</div>
                </div>

                {/* QVSS */}
                <div><QvssBadge level={f.qvssLevel} count={f.qvssCount} /></div>

                {/* Source */}
                <div><SourceIcon src={f.source} /></div>

                {/* Asset */}
                <div>
                  <div className="text-[11px] text-blue-400 font-medium">{f.asset}</div>
                  <div className="text-[10px] text-slate-400">{f.assetType}</div>
                  <div className="text-[10px] text-slate-500">ID: {f.assetId}</div>
                </div>

                {/* Artifacts */}
                <div>
                  {f.artifacts
                    ? <span className="text-[11px] text-blue-400 font-semibold">{f.artifacts}</span>
                    : <span className="text-[10px] text-slate-500">No Artifacts</span>
                  }
                </div>

                {/* Lifecycle */}
                <div>
                  <div className="text-[10px] text-slate-400">{f.firstFound}</div>
                  {f.artifactsFail && (
                    <div className="text-[10px] text-red-400 font-semibold mt-0.5">Fail</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-3 py-2 border-t border-slate-700/40 shrink-0 text-[10px] text-slate-400">
            <span>Showing {filtered.length} of 2.71M findings</span>
            <div className="flex items-center gap-1">
              <button className="px-2 py-0.5 border border-slate-700 rounded hover:bg-slate-700/40">‹</button>
              <button className="px-2 py-0.5 border border-slate-600 rounded bg-slate-700 text-slate-200">1</button>
              <button className="px-2 py-0.5 border border-slate-700 rounded hover:bg-slate-700/40">2</button>
              <button className="px-2 py-0.5 border border-slate-700 rounded hover:bg-slate-700/40">›</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
