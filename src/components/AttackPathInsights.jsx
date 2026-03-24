import { useState } from 'react'
import {
  Search, Bell, Settings, Shield, AlertTriangle, ArrowRight,
  Database, Users, Bot, Plus, Home, LayoutDashboard, Package,
  GitBranch, ChevronRight, Filter, Clock, Target, Zap, Eye,
  Wrench, CheckCircle, XCircle, AlertCircle, ShieldAlert,
  TrendingUp, RefreshCw, Ticket, EyeOff, User, Server, Cloud
} from 'lucide-react'

// ─── Severity Badge ─────────────────────────────────────────────────────────
function SeverityBadge({ level }) {
  const colors = {
    CRITICAL: 'bg-red-100 text-red-700 border border-red-200',
    HIGH:     'bg-orange-100 text-orange-700 border border-orange-200',
    MEDIUM:   'bg-yellow-100 text-yellow-700 border border-yellow-200',
    LOW:      'bg-green-100 text-green-700 border border-green-200',
  }
  return (
    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${colors[level] || colors.LOW}`}>
      {level}
    </span>
  )
}

// ─── STATUS PILL ─────────────────────────────────────────────────────────────
function StatusPill({ status }) {
  const map = {
    open:       'bg-red-100 text-red-700 border-red-200',
    inprogress: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    resolved:   'bg-green-100 text-green-700 border-green-200',
  }
  const labels = { open: 'Open', inprogress: 'In Progress', resolved: 'Resolved' }
  return (
    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${map[status]}`}>
      {labels[status]}
    </span>
  )
}

// ─── Attack Path data ────────────────────────────────────────────────────────
const ATTACK_PATHS = [
  {
    id: 5014,
    title: 'Publicly Exposed VM with No Encryption on EBS',
    severity: 'CRITICAL',
    entry: 'Internet (Web API)',
    target: 'Customer PII Database',
    hops: 4,
    gaps: 3,
    score: 97,
    resources: 63,
    mitre: 'T1190 → T1021 → T1565',
    path: 'Internet → GraphQL API → Redis Cache → PostgreSQL (PII)',
    status: 'open',
    flowNodes: [
      { label: 'Internet', icon: '🌐', severity: null, isStart: true },
      { label: 'GraphQL API', icon: '🖥️', severity: 'HIGH', edge: 'HTTPS' },
      { label: 'Redis Cache', icon: '🖥️', severity: 'CRITICAL', edge: 'JWT Bypass' },
      { label: 'Auth Service', icon: '🖥️', severity: 'MEDIUM', edge: 'Query Injection' },
      { label: 'PostgreSQL (PII)', icon: null, severity: 'CRITICAL', edge: 'JDBC Direct', isCrown: true },
    ],
    gaps_detail: [
      { label: 'Weak Auth:', value: 'Redis cache with no authentication on port 6379' },
      { label: 'Network Misconfig:', value: 'No segmentation between cache tier and database tier' },
      { label: 'Chained Path:', value: 'GraphQL → Redis Cache → PostgreSQL (PII)' },
    ],
    remediation: [
      { priority: 'CRITICAL', action: 'Patch CVE-2024-3094 on api-gateway-prod', effort: 'Low', eta: '1 day' },
      { priority: 'CRITICAL', action: 'Enable authentication on Redis port 6379', effort: 'Low', eta: '4 hours' },
      { priority: 'HIGH',     action: 'Add network segmentation between cache and DB tiers', effort: 'Medium', eta: '3 days' },
      { priority: 'MEDIUM',   action: 'Remove AdministratorAccess IAM role from api-gateway', effort: 'Low', eta: '2 hours' },
    ],
  },
  {
    id: 5024,
    title: 'Public Serverless Function with Administrative Privilege',
    severity: 'CRITICAL',
    entry: 'S3 Config Bucket',
    target: 'Authentication Service',
    hops: 4,
    gaps: 2,
    score: 94,
    resources: 19,
    mitre: 'T1530 → T1552 → T1078',
    path: 'S3 Config → SSH Key → Auth Service → PostgreSQL (PII)',
    status: 'open',
    flowNodes: [
      { label: 'S3 Bucket', icon: '☁️', severity: null, isStart: true },
      { label: 'SSH Key Leak', icon: '🔑', severity: 'CRITICAL', edge: 'Public Read' },
      { label: 'Auth Service', icon: '🖥️', severity: 'HIGH', edge: 'SSH Key' },
      { label: 'PostgreSQL (PII)', icon: null, severity: 'CRITICAL', edge: 'Service Auth', isCrown: true },
    ],
    gaps_detail: [
      { label: 'Cloud Misconfig:', value: 'S3 bucket with public-read ACL exposes config files' },
      { label: 'Software CVE:', value: 'CVE-2024-22234 in Spring Boot auth bypass' },
      { label: 'Chained Path:', value: 'S3 Config → SSH Key → Auth Service → PostgreSQL (PII)' },
    ],
    remediation: [
      { priority: 'CRITICAL', action: 'Block public access on S3 config bucket immediately', effort: 'Low', eta: '30 mins' },
      { priority: 'CRITICAL', action: 'Rotate all SSH keys exposed in S3 objects', effort: 'Medium', eta: '2 hours' },
      { priority: 'HIGH',     action: 'Apply Spring Boot CVE-2024-22234 patch', effort: 'Low', eta: '1 day' },
      { priority: 'MEDIUM',   action: 'Enforce bucket policy with deny public-read statements', effort: 'Low', eta: '1 hour' },
    ],
  },
  {
    id: 5025,
    title: 'Public VM with Privilege to Create IAM Artifacts',
    severity: 'CRITICAL',
    entry: 'VPN Entry Point',
    target: 'Domain Controller (Tier-0)',
    hops: 6,
    gaps: 4,
    score: 91,
    resources: 40,
    mitre: 'T1078 → T1548 → T1068 → T1003',
    path: 'VPN → Workstation → Local Admin → SYSTEM → DCSync → Domain Admin',
    status: 'inprogress',
    flowNodes: [
      { label: 'VPN', icon: '🔐', severity: null, isStart: true },
      { label: 'Workstation', icon: '🖥️', severity: 'MEDIUM', edge: 'Authenticated' },
      { label: 'Local Admin', icon: '👤', severity: 'HIGH', edge: 'UAC Bypass' },
      { label: 'NT SYSTEM', icon: '👤', severity: 'CRITICAL', edge: 'Kernel Exploit' },
      { label: 'Domain Admin', icon: null, severity: 'CRITICAL', edge: 'DCSync', isCrown: true },
    ],
    gaps_detail: [
      { label: 'Identity:', value: 'Kerberoastable SPN (weak password)' },
      { label: 'ACL Abuse:', value: 'WriteDACL on AdminSDHolder' },
      { label: 'Chained Path:', value: 'svc_backup → AdminSDHolder → DCSync → Domain Admin' },
    ],
    remediation: [
      { priority: 'CRITICAL', action: 'Patch Kernel CVE-2024-1086 on all workstations', effort: 'High', eta: '1 week' },
      { priority: 'CRITICAL', action: 'Remove WriteDACL from svc_backup on AdminSDHolder', effort: 'Low', eta: '1 hour' },
      { priority: 'HIGH',     action: 'Reset svc_backup password with 25+ char policy', effort: 'Low', eta: '30 mins' },
      { priority: 'HIGH',     action: 'Enable Credential Guard on all workstations', effort: 'High', eta: '5 days' },
    ],
  },
  {
    id: 5028,
    title: 'IAM User with Privilege Escalation — MFA Not Enabled',
    severity: 'HIGH',
    entry: 'GraphQL API',
    target: 'Active Directory',
    hops: 4,
    gaps: 2,
    score: 82,
    resources: 41,
    mitre: 'T1190 → T1552 → T1078.002',
    path: 'GraphQL → Redis → Cached Creds → LDAP / AD',
    status: 'open',
    flowNodes: [
      { label: 'GraphQL', icon: '🖥️', severity: null, isStart: true },
      { label: 'Redis Cache', icon: '🖥️', severity: 'HIGH', edge: 'Introspection' },
      { label: 'Cached Creds', icon: '🔑', severity: 'HIGH', edge: 'Memory Dump' },
      { label: 'LDAP / AD', icon: null, severity: 'CRITICAL', edge: 'LDAP Bind', isCrown: true },
    ],
    gaps_detail: [
      { label: 'API Exposure:', value: 'GraphQL introspection enabled, unlimited query depth' },
      { label: 'Identity Weakness:', value: 'Service account with LDAP bind credentials cached in Redis' },
      { label: 'Chained Path:', value: 'GraphQL → Redis → Cached Creds → LDAP / AD' },
    ],
    remediation: [
      { priority: 'HIGH',   action: 'Disable GraphQL introspection in production', effort: 'Low', eta: '2 hours' },
      { priority: 'HIGH',   action: 'Enable MFA for all IAM users with console access', effort: 'Medium', eta: '2 days' },
      { priority: 'MEDIUM', action: 'Flush Redis and clear cached service credentials', effort: 'Low', eta: '1 hour' },
      { priority: 'MEDIUM', action: 'Implement Redis AUTH and TLS for data-in-transit', effort: 'Medium', eta: '3 days' },
    ],
  },
  {
    id: 5033,
    title: 'Data Breach Risk via Public Serverless with RDS Permissions',
    severity: 'HIGH',
    entry: 'Internet (Lambda)',
    target: 'RDS Database',
    hops: 3,
    gaps: 2,
    score: 79,
    resources: 29,
    mitre: 'T1190 → T1078.004 → T1530',
    path: 'Internet → Lambda (Over-privileged) → RDS SQL Execution',
    status: 'open',
    flowNodes: [
      { label: 'Internet', icon: '🌐', severity: null, isStart: true },
      { label: 'Lambda Fn', icon: '⚡', severity: 'HIGH', edge: 'API Trigger' },
      { label: 'IAM Role', icon: '🔑', severity: 'CRITICAL', edge: 'Admin Assume' },
      { label: 'RDS Database', icon: null, severity: 'CRITICAL', edge: 'SQL Execute', isCrown: true },
    ],
    gaps_detail: [
      { label: 'Lambda Exposure:', value: 'Public Lambda with no auth executing arbitrary SQL' },
      { label: 'IAM Over-privilege:', value: 'Lambda IAM role has RDS full access + S3 read' },
      { label: 'Chained Path:', value: 'Internet → Lambda → IAM Role → RDS SQL Execution' },
    ],
    remediation: [
      { priority: 'CRITICAL', action: 'Add authorizer to public Lambda function endpoint', effort: 'Low', eta: '4 hours' },
      { priority: 'HIGH',     action: 'Scope Lambda IAM role to minimum required permissions', effort: 'Medium', eta: '1 day' },
      { priority: 'MEDIUM',   action: 'Enable RDS IAM database authentication', effort: 'Medium', eta: '2 days' },
      { priority: 'LOW',      action: 'Enable AWS CloudTrail logging for Lambda invocations', effort: 'Low', eta: '1 hour' },
    ],
  },
]

// ─── Discover Tab ────────────────────────────────────────────────────────────
function DiscoverTab({ onSelectPath }) {
  const [severityFilter, setSeverityFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const stats = [
    { label: 'Total Paths',        value: '14', icon: GitBranch, color: 'text-slate-800' },
    { label: 'Critical Paths',     value: '5',  icon: AlertTriangle, color: 'text-red-600' },
    { label: 'Avg Risk Score',     value: '73', icon: TrendingUp, color: 'text-orange-600' },
    { label: 'Crown Jewels at Risk', value: '2', icon: Target, color: 'text-purple-600' },
    { label: 'Entry Points',       value: '4',  icon: Zap, color: 'text-blue-600' },
  ]

  const severityCounts = { Critical: 5, High: 7, Medium: 2 }
  const entryPoints = [
    { label: 'Internet / Web API', count: 6 },
    { label: 'S3 / Cloud Storage', count: 3 },
    { label: 'VPN Entry',          count: 3 },
    { label: 'Lambda / Serverless', count: 2 },
  ]

  const filtered = ATTACK_PATHS.filter(p => {
    const matchSev = severityFilter === 'all' || p.severity === severityFilter
    const matchSearch = !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.target.toLowerCase().includes(searchQuery.toLowerCase())
    return matchSev && matchSearch
  })

  return (
    <div className="space-y-4">
      {/* Stats bar */}
      <div className="grid grid-cols-5 gap-3">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-lg border border-slate-200 p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <div>
              <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-[10px] text-slate-500 leading-tight">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        {/* Quick Filters panel */}
        <div className="w-52 shrink-0 space-y-3">
          <div className="bg-white rounded-lg border border-slate-200 p-3">
            <div className="flex items-center gap-1.5 mb-3">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-xs font-semibold text-slate-700">Quick Filters</span>
            </div>

            <div className="mb-3">
              <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-2">Severity</div>
              <div className="space-y-1">
                {[['all', 'All', 14], ['CRITICAL', 'Critical', 5], ['HIGH', 'High', 7], ['MEDIUM', 'Medium', 2]].map(([val, label, count]) => (
                  <button
                    key={val}
                    onClick={() => setSeverityFilter(val)}
                    className={`w-full flex items-center justify-between px-2 py-1 rounded text-[11px] transition-colors
                      ${severityFilter === val ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    <span>{label}</span>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded
                      ${val === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                        val === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                        val === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-slate-100 text-slate-600'}`}>{count}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-2">Entry Point Type</div>
              <div className="space-y-1">
                {entryPoints.map(ep => (
                  <div key={ep.label} className="flex items-center justify-between px-2 py-1 text-[11px] text-slate-600">
                    <span>{ep.label}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">{ep.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-3">
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-2">Time Range</div>
            {['Last 7 Days', 'Last 30 Days', 'Last 90 Days'].map((t, i) => (
              <button key={t} className={`w-full text-left px-2 py-1 text-[11px] rounded transition-colors
                ${i === 1 ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Attack Paths Table */}
        <div className="flex-1 bg-white rounded-lg border border-slate-200">
          {/* Table header */}
          <div className="p-3 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-800">Attack Paths</span>
              <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">{filtered.length} of 14</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search attack paths..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-7 pr-3 py-1 text-[11px] border border-slate-200 rounded text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 w-52"
                />
              </div>
              <button className="p-1.5 rounded border border-slate-200 text-slate-500 hover:bg-slate-50">
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Column headers */}
          <div className="grid grid-cols-[64px_1fr_100px_80px_80px_80px_90px] gap-2 px-3 py-2 bg-slate-50 border-b border-slate-200 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            <div>CID</div>
            <div>Attack Path Title / Chain</div>
            <div>Crown Jewel</div>
            <div>Severity</div>
            <div>Hops / Gaps</div>
            <div>Risk Score</div>
            <div>Action</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-slate-100">
            {filtered.map(ap => (
              <div
                key={ap.id}
                className="grid grid-cols-[64px_1fr_100px_80px_80px_80px_90px] gap-2 px-3 py-3 items-center hover:bg-slate-50 transition-colors group cursor-pointer"
                onClick={() => onSelectPath(ap)}
              >
                <div className="text-[11px] font-mono text-slate-500 font-semibold">{ap.id}</div>
                <div>
                  <div className="text-[12px] font-semibold text-slate-800 group-hover:text-indigo-700 leading-tight mb-0.5">{ap.title}</div>
                  <div className="text-[10px] font-mono text-slate-500 leading-tight truncate">{ap.path}</div>
                </div>
                <div className="text-[10px] text-slate-600 leading-tight">{ap.target}</div>
                <div><SeverityBadge level={ap.severity} /></div>
                <div className="text-[11px] text-slate-600">{ap.hops} hops / {ap.gaps} gaps</div>
                <div className={`text-sm font-bold ${ap.score >= 90 ? 'text-red-600' : ap.score >= 75 ? 'text-orange-600' : 'text-yellow-600'}`}>{ap.score}</div>
                <div>
                  <button
                    onClick={e => { e.stopPropagation(); onSelectPath(ap) }}
                    className="flex items-center gap-1 text-[10px] bg-indigo-600 text-white px-2.5 py-1 rounded hover:bg-indigo-700 transition-colors"
                  >
                    <Eye className="w-3 h-3" />
                    Analyze
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-3 py-2 border-t border-slate-200 flex items-center justify-between">
            <span className="text-[10px] text-slate-400">Showing {filtered.length} paths · Last scan: 4 minutes ago</span>
            <div className="flex items-center gap-1 text-[10px] text-slate-500">
              <button className="px-2 py-0.5 border border-slate-200 rounded hover:bg-slate-50">‹</button>
              <button className="px-2 py-0.5 border border-indigo-300 rounded bg-indigo-50 text-indigo-700 font-medium">1</button>
              <button className="px-2 py-0.5 border border-slate-200 rounded hover:bg-slate-50">›</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Analyze Tab ─────────────────────────────────────────────────────────────
function AnalyzeTab({ selectedPath, onSelectPath }) {
  const [expandedStep, setExpandedStep] = useState(null)

  const escalationSteps = [
    { step: 'Standard User',  level: 'LOW',      mitre: 'T1078.002', desc: 'Attacker begins as jsmith — a marketing dept standard user with no admin privileges' },
    { step: 'Local Admin',    level: 'MEDIUM',   mitre: 'T1548.002', desc: 'UAC bypass on workstation WS-047 grants local administrator access' },
    { step: 'SYSTEM',         level: 'CRITICAL', mitre: 'T1068',     desc: 'Kernel exploit CVE-2024-1086 escalates from Local Admin to NT AUTHORITY\\SYSTEM' },
    { step: 'Service Account',level: 'HIGH',     mitre: 'T1558.003', desc: 'Kerberoasting cracks svc_deploy SPN password (weak 8-char password)' },
    { step: 'DCSync',         level: 'CRITICAL', mitre: 'T1003.006', desc: 'WriteDACL on AdminSDHolder enables DCSync replication rights' },
    { step: 'Domain Admin',   level: 'CRITICAL', mitre: 'T1003.006', desc: 'Full domain compromise — attacker extracts all credential hashes via DCSync' },
  ]

  const assets = [
    { name: 'api-gateway-prod', severity: 'CRITICAL', exploitability: 'High',     os: 'Amazon Linux 2',   criticality: 'Mission Critical', ports: '443, 8080', services: 'Kong API Gateway' },
    { name: 'redis-cache-01',   severity: 'CRITICAL', exploitability: 'Critical', os: 'Ubuntu 22.04 LTS', criticality: 'High',             ports: '6379',      services: 'Redis 7.2 (no auth)' },
    { name: 'auth-service-01',  severity: 'HIGH',     exploitability: 'Medium',   os: 'Alpine Linux 3.18',criticality: 'Mission Critical', ports: '8443, 5432',services: 'Spring Boot 3.1' },
    { name: 'dev-test-server',  severity: 'LOW',      exploitability: 'None',     os: 'Windows Server 2019', criticality: 'Low',           ports: '3389, 445', services: 'RDP, SMB' },
  ]

  // If no path selected, show a selection prompt with top paths
  if (!selectedPath) {
    return (
      <div className="space-y-4">
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 flex items-center gap-3">
          <Eye className="w-5 h-5 text-indigo-600 shrink-0" />
          <div>
            <div className="text-sm font-semibold text-indigo-800">Select an Attack Path to Analyze</div>
            <div className="text-[11px] text-indigo-600 mt-0.5">Click any attack path from the Discover tab, or select one below to drill into its full detail.</div>
          </div>
        </div>

        {/* Quick-pick top 3 */}
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <h3 className="font-semibold text-slate-800 text-sm mb-3">Top Critical Attack Paths — Select to Analyze</h3>
          <div className="space-y-2.5">
            {ATTACK_PATHS.filter(p => p.severity === 'CRITICAL').map((ap, i) => (
              <button
                key={ap.id}
                onClick={() => onSelectPath(ap)}
                className="w-full text-left border border-slate-200 rounded-lg p-3 hover:border-indigo-300 hover:bg-indigo-50/40 transition-colors group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold shrink-0">{i+1}</div>
                    <SeverityBadge level={ap.severity} />
                    <span className="text-xs font-semibold text-slate-800 group-hover:text-indigo-700">{ap.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-red-600">Score: {ap.score}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                  </div>
                </div>
                <div className="text-[10px] font-mono text-slate-500 bg-slate-50 px-2 py-1 rounded">{ap.path}</div>
                <div className="flex gap-3 mt-1.5 text-[10px] text-slate-400">
                  <span>{ap.hops} hops</span>
                  <span>{ap.gaps} gaps chained</span>
                  <span className="font-mono text-indigo-500">{ap.mitre}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Path selected — full drill-down view
  return (
    <div className="space-y-4">
      {/* Path header */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelectPath(null)}
              className="text-[11px] text-slate-500 hover:text-indigo-600 flex items-center gap-1"
            >
              ← Back to all paths
            </button>
          </div>
          <div className="flex gap-2">
            <StatusPill status={selectedPath.status} />
            <span className={`text-sm font-bold px-2 py-0.5 rounded ${selectedPath.score >= 90 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
              Risk {selectedPath.score}
            </span>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div>
            <h3 className="font-bold text-slate-800 text-base">{selectedPath.title}</h3>
            <div className="flex items-center gap-3 mt-1">
              <SeverityBadge level={selectedPath.severity} />
              <span className="text-[11px] text-slate-500">{selectedPath.hops} hops · {selectedPath.gaps} gaps chained</span>
              <span className="text-[10px] font-mono text-indigo-600">{selectedPath.mitre}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary stats for this path */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Path Depth',        value: `${selectedPath.hops} hops` },
          { label: 'Gaps Chained',      value: `${selectedPath.gaps} gaps` },
          { label: 'Impacted Resources',value: `${selectedPath.resources}` },
          { label: 'Risk Score',        value: `${selectedPath.score}` },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-lg border border-slate-200 p-3 text-center">
            <div className="text-xl font-bold text-slate-800">{s.value}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Attack Path Flow Visualization */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-slate-800 text-sm">Multi-Step Attack Path Tracing</h3>
          <span className="text-xs text-green-600 font-medium bg-green-50 border border-green-200 px-2 py-0.5 rounded">Validated</span>
        </div>
        <p className="text-[11px] text-slate-500 mb-4">
          Entry: <span className="font-medium text-slate-700">{selectedPath.entry}</span> &nbsp;→&nbsp; Crown Jewel: <span className="font-medium text-red-700">{selectedPath.target}</span>
        </p>
        <div className="flex items-center gap-0 overflow-x-auto pb-2">
          {selectedPath.flowNodes.map((node, i) => (
            <div key={node.label} className="flex items-center">
              <div className="flex flex-col items-center">
                {i > 0 && (
                  <div className="flex flex-col items-center mx-1">
                    <span className="text-[9px] text-indigo-500 font-medium mb-0.5 whitespace-nowrap">{node.edge}</span>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                )}
              </div>
              <div className={`flex flex-col items-center min-w-[80px]`}>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl border-2 mb-1
                  ${node.isCrown ? 'border-red-400 bg-red-50' :
                    node.severity === 'CRITICAL' ? 'border-red-300 bg-red-50' :
                    node.severity === 'HIGH' ? 'border-orange-300 bg-orange-50' :
                    node.severity === 'MEDIUM' ? 'border-yellow-300 bg-yellow-50' :
                    'border-blue-300 bg-blue-50'}`}>
                  {node.icon ? <span>{node.icon}</span> : <Database className="w-5 h-5 text-slate-600" />}
                </div>
                <span className="text-[10px] text-slate-700 font-medium text-center leading-tight">{node.label}</span>
                {node.severity && <SeverityBadge level={node.severity} />}
                {node.isCrown && <span className="text-[9px] text-red-600 font-semibold mt-0.5">👑 Crown Jewel</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Gap Chaining */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <h3 className="font-semibold text-slate-800 text-sm mb-1">Security Gap Chaining</h3>
        <p className="text-[11px] text-slate-500 mb-3">Disparate exposures chained into this contiguous attack path</p>
        <div className="border border-red-200 bg-red-50/20 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
            <SeverityBadge level={selectedPath.severity} />
            <span className="text-[11px] font-semibold text-slate-800">
              {selectedPath.gaps} Security Gaps Chained — {selectedPath.title}
            </span>
          </div>
          <div className="space-y-1 ml-5">
            {selectedPath.gaps_detail.map(item => (
              <div key={item.label} className="flex gap-2 text-[10px]">
                <span className="text-slate-400 font-medium w-28 shrink-0">{item.label}</span>
                <span className={item.label === 'Chained Path:' ? 'font-mono text-slate-700' : 'text-slate-600'}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Privilege Escalation Mapping */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-slate-800 text-sm">Privilege Escalation Mapping — Standard User to Domain Admin</h3>
          <span className="text-xs text-green-600 font-medium bg-green-50 border border-green-200 px-2 py-0.5 rounded">MITRE ATT&CK Mapped</span>
        </div>
        <p className="text-[11px] text-slate-500 mb-4">Step-by-step escalation chain from least-privileged account to full domain compromise</p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {['UAC Bypass', 'Kerberoast', 'Kernel Exploit', 'Token Impersonation', 'WriteDACL', 'DCSync'].map(t => (
            <span key={t} className="text-[10px] bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-full">{t}</span>
          ))}
        </div>
        <div className="space-y-2">
          {escalationSteps.map((s, i) => (
            <button
              key={s.step}
              onClick={() => setExpandedStep(expandedStep === i ? null : i)}
              className="w-full flex gap-3 items-start text-left hover:bg-slate-50 rounded-lg p-1.5 transition-colors group"
            >
              <div className="flex flex-col items-center shrink-0">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white
                  ${s.level === 'CRITICAL' ? 'bg-red-500' :
                    s.level === 'HIGH' ? 'bg-orange-500' :
                    s.level === 'MEDIUM' ? 'bg-yellow-500' : 'bg-blue-400'}`}>
                  {i + 1}
                </div>
                {i < escalationSteps.length - 1 && <div className="w-px h-4 bg-slate-200 mt-0.5" />}
              </div>
              <div className="flex-1 pb-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-semibold text-slate-800">{s.step}</span>
                  <SeverityBadge level={s.level} />
                  <span className="text-[10px] font-mono text-indigo-500">{s.mitre}</span>
                  <ChevronRight className={`w-3.5 h-3.5 text-slate-400 ml-auto transition-transform ${expandedStep === i ? 'rotate-90' : ''}`} />
                </div>
                {expandedStep === i && (
                  <p className="text-[11px] text-slate-500 mt-1 bg-slate-50 px-2 py-1.5 rounded border border-slate-200">{s.desc}</p>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Asset Enrichment */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <h3 className="font-semibold text-slate-800 text-sm mb-1">Asset Metadata Enrichment</h3>
        <p className="text-[11px] text-slate-500 mb-3">Qualys-enriched asset context — OS, services, criticality, and exploitability assessment</p>
        <div className="grid grid-cols-2 gap-3">
          {assets.map(a => (
            <div key={a.name} className="border border-slate-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-800 font-mono">{a.name}</span>
                <div className="flex gap-1.5">
                  <SeverityBadge level={a.severity} />
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border
                    ${a.exploitability === 'Critical' || a.exploitability === 'High' ? 'bg-red-50 text-red-600 border-red-200' :
                      a.exploitability === 'Medium' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' :
                      'bg-slate-50 text-slate-500 border-slate-200'}`}>
                    Exploitability: {a.exploitability}
                  </span>
                </div>
              </div>
              <div className="text-[10px] text-slate-500 mb-1">{a.os}</div>
              <div className="grid grid-cols-3 gap-2 text-[10px]">
                <div><div className="text-slate-400 font-medium">Criticality</div><div className="text-slate-700">{a.criticality}</div></div>
                <div><div className="text-slate-400 font-medium">Open Ports</div><div className="text-slate-700 font-mono">{a.ports}</div></div>
                <div><div className="text-slate-400 font-medium">Services</div><div className="text-slate-700">{a.services}</div></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Remediate Tab ────────────────────────────────────────────────────────────
function RemediateTab({ selectedPath }) {
  const [actionStates, setActionStates] = useState({})

  const toggleAction = (key, newState) => {
    setActionStates(prev => ({ ...prev, [key]: prev[key] === newState ? null : newState }))
  }

  const summaryStats = [
    { label: 'Toxic Combinations',  value: '3',  color: 'text-red-600' },
    { label: 'Score Elevations',    value: '3',  color: 'text-orange-600' },
    { label: 'Noise Suppressed',    value: '2',  color: 'text-green-600' },
    { label: 'Active Risk Factors', value: '18', color: 'text-slate-800' },
    { label: 'Max Adjusted Score',  value: '97', color: 'text-red-600' },
    { label: 'Remediation Actions', value: '12', color: 'text-indigo-600' },
  ]

  const toxicCombos = [
    {
      title: 'Critical CVE + Over-Privileged IAM + Internet-Facing',
      severity: 'CRITICAL', asset: 'api-gateway-prod.acme.com',
      mitre: 'T1190 → T1078.004 → T1530',
      items: [
        { label: 'CVE:', value: 'Critical CVE (CVE-2024-3094)' },
        { label: 'IAM:', value: 'Over-Privileged IAM Role (AdministratorAccess)' },
        { label: 'Exposure:', value: 'Internet-Facing (port 443)' },
        { label: 'Path to Crown Jewel:', value: 'API Gateway → Auth Service → PostgreSQL (PII)' },
      ],
    },
    {
      title: 'Kerberoastable SPN + WriteDACL + Tier-0 Proximity',
      severity: 'CRITICAL', asset: 'svc_backup@acme.corp',
      mitre: 'T1558.003 → T1222 → T1003.006',
      items: [
        { label: 'Identity:', value: 'Kerberoastable SPN (weak password)' },
        { label: 'ACL:', value: 'WriteDACL on AdminSDHolder' },
        { label: 'Topology:', value: '2 hops from Domain Controller' },
        { label: 'Path to Crown Jewel:', value: 'svc_backup → AdminSDHolder → DCSync → DA' },
      ],
    },
    {
      title: 'Public S3 + Cached Credentials + No Auth Redis',
      severity: 'CRITICAL', asset: 'redis-cache-01.internal',
      mitre: 'T1552 → T1078.002 → T1003',
      items: [
        { label: 'Config:', value: 'No Authentication on Redis (port 6379)' },
        { label: 'Credential:', value: 'Service account credentials cached in memory' },
        { label: 'Topology:', value: 'Network path to LDAP/AD identity store' },
        { label: 'Path to Crown Jewel:', value: 'Redis Cache → Cached Creds → LDAP / AD' },
      ],
    },
  ]

  const scoringItems = [
    { asset: 'API Gateway',     reason: 'Toxic Combination: CVE + IAM + Internet-facing (+24%)', base: 73, adjusted: 97, delta: '+24%', positive: true },
    { asset: 'Jump Server',     reason: 'Choke Point (+19%): converges 5 attack paths',          base: 68, adjusted: 87, delta: '+19%', positive: true },
    { asset: 'Redis Cache',     reason: 'Choke Point (+29%): no auth + credential store',        base: 65, adjusted: 94, delta: '+29%', positive: true },
    { asset: 'Dev Test Server', reason: 'No Reachability: isolated VLAN, no external paths',     base: 62, adjusted: 27, delta: '-57%', positive: false },
    { asset: 'Staging DB',      reason: 'Dormant: no verified credential or service path',       base: 58, adjusted: 28, delta: '-51%', positive: false },
  ]

  // Build remediation actions — either from selected path or all paths combined
  const allActions = selectedPath
    ? selectedPath.remediation
    : ATTACK_PATHS.flatMap((ap, apIdx) =>
        ap.remediation.map((r, rIdx) => ({ ...r, pathId: ap.id, pathTitle: ap.title }))
      ).filter((r, i, arr) => arr.findIndex(x => x.action === r.action) === i).slice(0, 12)

  const priorityColor = {
    CRITICAL: { bg: 'bg-red-50', border: 'border-red-200', badge: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
    HIGH:     { bg: 'bg-orange-50', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500' },
    MEDIUM:   { bg: 'bg-yellow-50', border: 'border-yellow-200', badge: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' },
    LOW:      { bg: 'bg-green-50', border: 'border-green-200', badge: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
  }

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-6 gap-3">
        {summaryStats.map(s => (
          <div key={s.label} className="bg-white rounded-lg border border-slate-200 p-3 text-center">
            <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recommended Remediation Actions */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-indigo-600" />
            <h3 className="font-semibold text-slate-800 text-sm">
              Recommended Remediation Actions
              {selectedPath && <span className="font-normal text-slate-500 ml-1">— {selectedPath.title}</span>}
            </h3>
          </div>
          <div className="flex gap-2 text-[10px]">
            <span className="flex items-center gap-1 text-slate-500">
              <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span>Critical
            </span>
            <span className="flex items-center gap-1 text-slate-500">
              <span className="w-2 h-2 rounded-full bg-orange-500 inline-block"></span>High
            </span>
            <span className="flex items-center gap-1 text-slate-500">
              <span className="w-2 h-2 rounded-full bg-yellow-500 inline-block"></span>Medium
            </span>
          </div>
        </div>
        <p className="text-[11px] text-slate-500 mb-3">
          Prioritized remediation steps ranked by risk impact — address Critical items immediately to break active attack chains.
        </p>

        <div className="space-y-2">
          {allActions.map((action, idx) => {
            const c = priorityColor[action.priority] || priorityColor.LOW
            const key = `${action.action}-${idx}`
            const state = actionStates[key]
            return (
              <div key={key} className={`border ${c.border} ${c.bg} rounded-lg p-3 flex items-center gap-3`}>
                <span className={`w-2 h-2 rounded-full shrink-0 ${c.dot}`}></span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${c.badge}`}>{action.priority}</span>
                    {action.pathId && (
                      <span className="text-[10px] text-slate-400 font-mono">CID {action.pathId}</span>
                    )}
                  </div>
                  <div className="text-[12px] font-medium text-slate-800 leading-tight">{action.action}</div>
                  <div className="flex gap-3 mt-1 text-[10px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> ETA: {action.eta}
                    </span>
                    <span className="flex items-center gap-1">
                      <Wrench className="w-3 h-3" /> Effort: {action.effort}
                    </span>
                    {state === 'fixed' && <span className="text-green-600 font-medium flex items-center gap-1"><CheckCircle className="w-3 h-3" />Marked as Fixed</span>}
                    {state === 'suppressed' && <span className="text-slate-500 font-medium flex items-center gap-1"><EyeOff className="w-3 h-3" />Suppressed</span>}
                    {state === 'ticket' && <span className="text-blue-600 font-medium flex items-center gap-1"><Ticket className="w-3 h-3" />Ticket Created</span>}
                  </div>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button
                    onClick={() => toggleAction(key, 'fixed')}
                    className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded border transition-colors
                      ${state === 'fixed' ? 'bg-green-600 text-white border-green-600' : 'border-green-300 text-green-700 hover:bg-green-50'}`}
                  >
                    <CheckCircle className="w-3 h-3" /> Mark Fixed
                  </button>
                  <button
                    onClick={() => toggleAction(key, 'ticket')}
                    className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded border transition-colors
                      ${state === 'ticket' ? 'bg-blue-600 text-white border-blue-600' : 'border-blue-300 text-blue-700 hover:bg-blue-50'}`}
                  >
                    <Ticket className="w-3 h-3" /> Create Ticket
                  </button>
                  <button
                    onClick={() => toggleAction(key, 'suppressed')}
                    className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded border transition-colors
                      ${state === 'suppressed' ? 'bg-slate-400 text-white border-slate-400' : 'border-slate-300 text-slate-500 hover:bg-slate-50'}`}
                  >
                    <EyeOff className="w-3 h-3" /> Suppress
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Toxic Combination Identification */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-4 h-4 text-red-500" />
          <h3 className="font-semibold text-slate-800 text-sm">Toxic Combination Identification</h3>
        </div>
        <div className="space-y-3">
          {toxicCombos.map(tc => (
            <div key={tc.title} className="border border-red-200 bg-red-50/20 rounded-lg p-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <SeverityBadge level={tc.severity} />
                    <span className="text-[11px] font-semibold text-slate-800">{tc.title}</span>
                  </div>
                  <div className="flex gap-3 text-[10px] text-slate-500 ml-5">
                    <span>Asset: <span className="font-mono text-slate-700">{tc.asset}</span></span>
                    <span className="font-mono text-indigo-500">{tc.mitre}</span>
                  </div>
                </div>
                <button className="text-[10px] border border-slate-300 text-slate-500 hover:bg-slate-100 px-2 py-0.5 rounded shrink-0">
                  Suppress
                </button>
              </div>
              <div className="space-y-1 ml-5">
                {tc.items.map(item => (
                  <div key={item.label} className="flex gap-2 text-[10px]">
                    <span className="text-slate-400 font-medium w-28 shrink-0">{item.label}</span>
                    <span className={item.label === 'Path to Crown Jewel:' ? 'font-mono text-slate-700' : 'text-slate-600'}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contextual Risk Scoring */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-indigo-600" />
          <h3 className="font-semibold text-slate-800 text-sm">Contextual Risk Scoring</h3>
        </div>
        <p className="text-[11px] text-slate-500 mb-3">
          Dynamic risk scores adjusted by topological position — elevated for assets on active attack paths, suppressed for isolated assets.
        </p>
        <div className="space-y-2">
          {scoringItems.map(item => (
            <div key={item.asset} className="border border-slate-200 rounded-lg p-3 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-slate-800 mb-0.5">{item.asset}</div>
                <div className="text-[10px] text-slate-500">{item.reason}</div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-[10px] text-slate-400">Base → Adjusted</div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-mono text-slate-500">{item.base}</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  <span className={`text-xs font-mono font-bold ${item.positive ? 'text-red-600' : 'text-green-600'}`}>{item.adjusted}</span>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${item.positive ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
                  {item.delta}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────
export default function AttackPathInsights() {
  const [activeTab, setActiveTab] = useState('discover')
  const [selectedPath, setSelectedPath] = useState(null)

  const etmNavItems = [
    { label: 'Add-ons',             icon: Plus },
    { label: 'Cyber Risk Assistant',icon: Bot },
    { label: 'Home',                icon: Home },
    { label: 'Dashboard',           icon: LayoutDashboard },
    { label: 'Inventory',           icon: Package },
    { label: 'Risk Management',     icon: ShieldAlert },
    { label: 'Attack Path',         icon: GitBranch, active: true },
  ]

  const tabs = [
    { id: 'discover',  label: '01  Discover',  icon: Eye,    desc: 'Browse & filter attack paths' },
    { id: 'analyze',   label: '02  Analyze',   icon: Target, desc: 'Drill into a specific path' },
    { id: 'remediate', label: '03  Remediate', icon: Wrench, desc: 'Recommended remediation actions' },
  ]

  const handleSelectPath = (path) => {
    setSelectedPath(path)
    setActiveTab('analyze')
  }

  return (
    <div className="flex h-screen bg-[hsl(220,20%,97%)] overflow-hidden">
      <div className="flex flex-col flex-1 overflow-hidden">

        {/* Qualys top header */}
        <header className="flex items-center justify-between px-4 py-2 bg-white border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded bg-[#E5002B] flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-slate-800">
              Qualys
              <span className="font-normal text-slate-400 ml-1">Enterprise TruRisk™ Platform</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button className="p-1.5 rounded hover:bg-slate-100 text-slate-400"><Search className="w-4 h-4" /></button>
            <button className="p-1.5 rounded hover:bg-slate-100 text-slate-400"><Bell className="w-4 h-4" /></button>
            <button className="p-1.5 rounded hover:bg-slate-100 text-slate-400"><Settings className="w-4 h-4" /></button>
            <button className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-semibold">A</button>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* ETM sidebar */}
          <aside className="w-44 bg-[hsl(220,30%,18%)] flex flex-col shrink-0 border-r border-slate-700">
            <div className="px-3 py-3 border-b border-slate-700">
              <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">ETM</div>
              <div className="text-xs font-semibold text-white">Enterprise TruRisk Management</div>
            </div>
            <nav className="flex-1 py-2">
              {etmNavItems.map(item => (
                <button
                  key={item.label}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-left text-[11px] transition-colors
                    ${item.active ? 'bg-indigo-600 text-white font-medium' : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'}`}
                >
                  <item.icon className="w-3.5 h-3.5 shrink-0" />
                  {item.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 overflow-y-auto">
            <div className="p-5">

              {/* Page heading */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <GitBranch className="w-5 h-5 text-indigo-600" />
                    <h1 className="text-lg font-bold text-slate-800">Attack Path Insights</h1>
                  </div>
                  <p className="text-[11px] text-slate-500">Qualys TotalCloud — Adversarial mapping, analysis &amp; risk-correlated remediation</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Last scan: 4 min ago
                  </span>
                  <button className="text-[11px] bg-indigo-600 text-white px-3 py-1.5 rounded hover:bg-indigo-700 transition-colors flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5" /> Re-scan
                  </button>
                </div>
              </div>

              {/* Tabs — styled per image UX: 01 Discover, 02 Analyze, 03 Remediate */}
              <div className="flex border-b border-slate-200 mb-5 gap-1">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px rounded-t-lg
                      ${activeTab === tab.id
                        ? 'border-indigo-600 text-indigo-600 bg-indigo-50/60'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                    {tab.id === 'analyze' && selectedPath && (
                      <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full font-semibold">
                        CID {selectedPath.id}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              {activeTab === 'discover'  && <DiscoverTab onSelectPath={handleSelectPath} />}
              {activeTab === 'analyze'   && <AnalyzeTab selectedPath={selectedPath} onSelectPath={(p) => { setSelectedPath(p); if (!p) {} }} />}
              {activeTab === 'remediate' && <RemediateTab selectedPath={selectedPath} />}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
