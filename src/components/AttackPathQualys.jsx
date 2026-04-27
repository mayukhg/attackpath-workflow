import { useState } from 'react'
import {
  Search, Bell, Settings, User, ChevronRight, Home, LayoutDashboard,
  Package, ShieldAlert, GitBranch, Shield, AlertTriangle, CheckCircle2,
  ArrowRight, Monitor, Database, Server, Cloud, Lock, Key, Users, Bot, Plus
} from 'lucide-react'

// ─── Severity Badge ────────────────────────────────────────────────────────
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

// ─── Discovery Tab ─────────────────────────────────────────────────────────
function DiscoveryTab() {
  const stats = [
    { label: 'App Traces', value: '7' },
    { label: 'Avg Path Depth', value: '3.8' },
    { label: 'Entry Points', value: '4' },
    { label: 'Crown Jewels Reached', value: '2' },
    { label: 'Enriched Assets', value: '12' },
  ]

  const flowNodes = [
    { label: 'Web App (React)', icon: '🖥️', severity: null, isStart: true },
    { label: 'API Gateway', icon: '🖥️', severity: 'MEDIUM', edge: 'HTTPS' },
    { label: 'GraphQL /query', icon: '🖥️', severity: 'HIGH', edge: 'GraphQL' },
    { label: 'Auth Service', icon: '🖥️', severity: 'MEDIUM', edge: 'JWT Bypass' },
    { label: 'Redis Cache', icon: '🖥️', severity: 'HIGH', edge: 'Query Injection' },
    { label: 'PostgreSQL (PII)', icon: null, severity: 'CRITICAL', edge: 'JDBC Direct', isCrown: true },
    { label: 'LDAP / AD', icon: null, severity: 'CRITICAL', edge: 'Cached Creds', isCrown: true },
  ]

  const assets = [
    {
      name: 'api-gateway-prod', severity: 'CRITICAL', exploitability: 'High',
      os: 'Amazon Linux 2', criticality: 'Mission Critical',
      ports: '443, 8080, 9090', services: 'Kong API Gateway, Prometheus Exporter',
    },
    {
      name: 'redis-cache-01', severity: 'CRITICAL', exploitability: 'Critical',
      os: 'Ubuntu 22.04 LTS', criticality: 'High',
      ports: '6379', services: 'Redis 7.2 (no auth)',
    },
    {
      name: 'auth-service-01', severity: 'HIGH', exploitability: 'Medium',
      os: 'Alpine Linux 3.18', criticality: 'Mission Critical',
      ports: '8443, 5432', services: 'Spring Boot 3.1, PostgreSQL Client',
    },
    {
      name: 'dev-test-server', severity: 'LOW', exploitability: 'None (isolated)',
      os: 'Windows Server 2019', criticality: 'Low',
      ports: '3389, 445', services: 'RDP, SMB',
    },
  ]

  const identities = [
    {
      user: 'jsmith', severity: 'HIGH',
      groups: ['IT-Helpdesk', 'Remote-Users', 'VPN-Full-Access'],
      gpos: ['GPO: WS-Config', 'GPO: Remote-Access'],
      escalation: 'High — group nesting grants GenericAll on service accounts',
    },
    {
      user: 'svc_backup', severity: 'CRITICAL',
      groups: ['Backup-Operators', 'Server-Admins (nested)'],
      gpos: ['GPO: ServerConfig', 'GPO: Backup-Policy'],
      escalation: 'Critical — Kerberoastable SPN + WriteDACL on AdminSDHolder',
    },
    {
      user: 'admin.jones', severity: 'CRITICAL',
      groups: ['Domain Admins', 'Schema Admins', 'Enterprise Admins'],
      gpos: ['GPO: DC-Hardening', 'GPO: Admin-Audit'],
      escalation: 'Critical — triple admin group membership, Tier-0 asset',
    },
    {
      user: 'dev.contractor', severity: 'MEDIUM',
      groups: ['Developers', 'AWS-ReadOnly', 'Jenkins-Deploy'],
      gpos: ['GPO: Dev-Workstation'],
      escalation: 'Medium — Jenkins deploy group enables CI/CD pipeline abuse',
    },
  ]

  const edgeLabels = ['HTTPS', 'GraphQL', 'JWT Bypass', 'Query Injection', 'JDBC Direct', 'Session Hijack', 'LDAP Bind', 'Cached Creds']

  return (
    <div className="space-y-5">
      {/* Stats bar */}
      <div className="grid grid-cols-5 gap-3">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-lg border border-slate-200 p-3 text-center">
            <div className="text-xl font-bold text-slate-800">{s.value}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Multi-Step Application Tracing */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-slate-800 text-sm">Multi-Step Application Tracing — Web/API to Backend</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-green-600 font-medium bg-green-50 border border-green-200 px-2 py-0.5 rounded">100%</span>
          </div>
        </div>
        <p className="text-[11px] text-slate-500 mb-4">End-to-end trace from application entry points through to Crown Jewels</p>

        {/* Edge labels legend */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {edgeLabels.map(e => (
            <span key={e} className="text-[10px] bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-full">{e}</span>
          ))}
        </div>

        {/* Flow diagram */}
        <div className="flex items-center gap-0 overflow-x-auto pb-2">
          {flowNodes.map((node, i) => (
            <div key={node.label} className="flex items-center">
              {/* Edge label above arrow (except first) */}
              <div className="flex flex-col items-center">
                {i > 0 && (
                  <div className="flex flex-col items-center mx-1">
                    <span className="text-[9px] text-indigo-500 font-medium mb-0.5 whitespace-nowrap">{node.edge}</span>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                )}
              </div>
              {/* Node */}
              <div className={`flex flex-col items-center min-w-[80px] ${node.isCrown ? 'opacity-100' : ''}`}>
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
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Asset Metadata Enrichment */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <h3 className="font-semibold text-slate-800 text-sm mb-1">Asset Metadata Enrichment</h3>
        <p className="text-[11px] text-slate-500 mb-3">Enriched asset context for exploitability assessment</p>
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
                <div>
                  <div className="text-slate-400 font-medium">Criticality</div>
                  <div className="text-slate-700">{a.criticality}</div>
                </div>
                <div>
                  <div className="text-slate-400 font-medium">Open Ports</div>
                  <div className="text-slate-700 font-mono">{a.ports}</div>
                </div>
                <div>
                  <div className="text-slate-400 font-medium">Services</div>
                  <div className="text-slate-700">{a.services}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Basic Identity Mapping */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <h3 className="font-semibold text-slate-800 text-sm mb-1">Basic Identity Mapping</h3>
        <p className="text-[11px] text-slate-500 mb-3">AD identity mapping — User, Group Membership, GPOs</p>
        <div className="grid grid-cols-2 gap-3">
          {identities.map(id => (
            <div key={id.user} className="border border-slate-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-800 font-mono">{id.user}</span>
                <SeverityBadge level={id.severity} />
              </div>
              <div className="space-y-1.5 text-[10px]">
                <div>
                  <div className="text-slate-400 font-medium mb-1">Group Membership</div>
                  <div className="flex flex-wrap gap-1">
                    {id.groups.map(g => (
                      <span key={g} className="bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded">{g}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 font-medium mb-1">GPOs Applied</div>
                  <div className="flex flex-wrap gap-1">
                    {id.gpos.map(g => (
                      <span key={g} className="bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded">{g}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 font-medium mb-0.5">Escalation Risk</div>
                  <div className={`${id.severity === 'CRITICAL' ? 'text-red-600' : id.severity === 'HIGH' ? 'text-orange-600' : 'text-yellow-600'}`}>
                    {id.escalation}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Analysis Tab ──────────────────────────────────────────────────────────
function AnalysisTab() {
  const attackPaths = [
    {
      target: 'Customer PII Database', severity: 'CRITICAL', score: 97,
      path: 'Internet → GraphQL API → Redis Cache → PostgreSQL (PII)',
      hops: '4 hops', gaps: '3 gaps chained', mitre: 'T1190 → T1021 → T1565',
    },
    {
      target: 'Authentication Service', severity: 'CRITICAL', score: 94,
      path: 'S3 Config → SSH Key → Auth Service → PostgreSQL (PII)',
      hops: '4 hops', gaps: '2 gaps chained', mitre: 'T1530 → T1552 → T1078',
    },
    {
      target: 'Domain Controller (Tier-0)', severity: 'CRITICAL', score: 91,
      path: 'VPN → Workstation → Local Admin → SYSTEM → DCSync → Domain Admin',
      hops: '6 hops', gaps: '4 gaps chained', mitre: 'T1078 → T1548 → T1068 → T1003',
    },
    {
      target: 'Active Directory', severity: 'HIGH', score: 82,
      path: 'GraphQL → Redis → Cached Creds → LDAP / AD',
      hops: '4 hops', gaps: '2 gaps chained', mitre: 'T1190 → T1552 → T1078.002',
    },
  ]

  const summaryStats = [
    { label: 'Chained Gaps', value: '11' },
    { label: 'Escalation Paths', value: '6' },
    { label: 'Kerberoastable SPNs', value: '3' },
    { label: 'Tier-0 Exposure', value: '2' },
  ]

  const gapChains = [
    {
      title: 'Cloud Misconfig + Software CVE → Data Exfiltration',
      severity: 'CRITICAL', mitre: 'T1530 → T1552 → T1078',
      items: [
        { label: 'Cloud Misconfig:', value: 'S3 bucket with public-read ACL exposes config files' },
        { label: 'Software CVE:', value: 'CVE-2024-22234 in Spring Boot auth bypass' },
        { label: 'Chained Path:', value: 'S3 Config → SSH Key → Auth Service → PostgreSQL (PII)' },
      ],
    },
    {
      title: 'Weak Authentication + Network Misconfig → Lateral Movement',
      severity: 'CRITICAL', mitre: 'T1190 → T1021 → T1565',
      items: [
        { label: 'Weak Auth:', value: 'Redis cache with no authentication on port 6379' },
        { label: 'Network Misconfig:', value: 'No segmentation between cache tier and database tier' },
        { label: 'Chained Path:', value: 'GraphQL → Redis Cache → PostgreSQL (PII)' },
      ],
    },
    {
      title: 'API Exposure + Identity Weakness → Privilege Escalation',
      severity: 'HIGH', mitre: 'T1190 → T1552 → T1078.002',
      items: [
        { label: 'API Exposure:', value: 'GraphQL introspection enabled, unlimited query depth' },
        { label: 'Identity Weakness:', value: 'Service account with LDAP bind credentials cached in Redis' },
        { label: 'Chained Path:', value: 'GraphQL → Redis → Cached Creds → LDAP / AD' },
      ],
    },
  ]

  const escalationNodes = [
    { label: 'jsmith\n(Std User)', severity: 'LOW', technique: 'T1078.002' },
    { label: 'Local Admin\n(WS-047)', severity: 'MEDIUM', technique: 'UAC Bypass' },
    { label: 'svc_deploy', severity: 'HIGH', technique: 'Kerberoast' },
    { label: 'NT AUTHORITY\nSYSTEM', severity: 'CRITICAL', technique: 'Kernel Exploit' },
    { label: 'Server Admin\n(OU=Servers)', severity: 'HIGH', technique: 'Token Impersonation' },
    { label: 'DCSync\nCapability', severity: 'CRITICAL', technique: 'WriteDACL' },
    { label: 'Domain Admin', severity: 'CRITICAL', technique: 'DCSync' },
  ]

  const escalationSteps = [
    { step: 'Standard User', level: 'LOW', mitre: 'MITRE T1078.002', desc: 'Attacker begins as jsmith — a marketing dept standard user with no admin privileges' },
    { step: 'Local Admin', level: 'MEDIUM', mitre: 'MITRE T1548.002', desc: 'UAC bypass on workstation WS-047 grants local administrator access' },
    { step: 'SYSTEM', level: 'CRITICAL', mitre: 'MITRE T1068', desc: 'Kernel exploit CVE-2024-1086 escalates from Local Admin to NT AUTHORITY\\SYSTEM' },
    { step: 'Service Account', level: 'HIGH', mitre: 'MITRE T1558.003', desc: 'Kerberoasting cracks svc_deploy SPN password (weak 8-char password)' },
    { step: 'DCSync', level: 'CRITICAL', mitre: 'MITRE T1003.006', desc: 'WriteDACL on AdminSDHolder enables DCSync replication rights' },
    { step: 'Domain Admin', level: 'CRITICAL', mitre: 'MITRE T1003.006', desc: 'Full domain compromise — attacker extracts all credential hashes via DCSync' },
  ]

  return (
    <div className="space-y-5">
      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-3">
        {summaryStats.map(s => (
          <div key={s.label} className="bg-white rounded-lg border border-slate-200 p-3 text-center">
            <div className="text-xl font-bold text-slate-800">{s.value}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Top Critical Attack Paths */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <h3 className="font-semibold text-slate-800 text-sm mb-1">Top Critical Attack Paths</h3>
        <p className="text-[11px] text-slate-500 mb-3">Validated paths ranked by compound risk to critical assets</p>
        <div className="space-y-2.5">
          {attackPaths.map(ap => (
            <div key={ap.target} className={`border rounded-lg p-3 ${ap.severity === 'CRITICAL' ? 'border-red-200 bg-red-50/30' : 'border-orange-200 bg-orange-50/30'}`}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <SeverityBadge level={ap.severity} />
                  <span className="text-xs font-semibold text-slate-800">{ap.target}</span>
                </div>
                <span className={`text-sm font-bold ${ap.severity === 'CRITICAL' ? 'text-red-600' : 'text-orange-600'}`}>
                  Score: {ap.score}
                </span>
              </div>
              <div className="text-[11px] text-slate-600 font-mono mb-1.5 bg-slate-100 px-2 py-1 rounded">
                {ap.path}
              </div>
              <div className="flex gap-3 text-[10px] text-slate-500">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 inline-block"></span>
                  {ap.hops}
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 inline-block"></span>
                  {ap.gaps}
                </span>
                <span className="flex items-center gap-1 font-mono text-indigo-600">
                  {ap.mitre}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Gap Chaining */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <h3 className="font-semibold text-slate-800 text-sm mb-1">Security Gap Chaining</h3>
        <p className="text-[11px] text-slate-500 mb-3">Disparate exposures chained into contiguous attack paths</p>
        <div className="space-y-2.5">
          {gapChains.map(gc => (
            <div key={gc.title} className={`border rounded-lg p-3 ${gc.severity === 'CRITICAL' ? 'border-red-200 bg-red-50/20' : 'border-orange-200 bg-orange-50/20'}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <SeverityBadge level={gc.severity} />
                  <span className="text-[11px] font-semibold text-slate-800">{gc.title}</span>
                </div>
                <span className="text-[10px] font-mono text-indigo-500">{gc.mitre}</span>
              </div>
              <div className="space-y-1">
                {gc.items.map(item => (
                  <div key={item.label} className="flex gap-2 text-[10px]">
                    <span className="text-slate-500 font-medium w-28 shrink-0">{item.label}</span>
                    <span className={item.label === 'Chained Path:' ? 'font-mono text-slate-700' : 'text-slate-600'}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Privilege Escalation Flow */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-slate-800 text-sm">Privilege Escalation Mapping — Standard User to Domain Admin</h3>
          <span className="text-xs text-green-600 font-medium bg-green-50 border border-green-200 px-2 py-0.5 rounded">100%</span>
        </div>
        <p className="text-[11px] text-slate-500 mb-4">Complete escalation chain from least-privileged to full domain control</p>

        {/* Technique labels */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {['UAC Bypass','Kerberoast','Kernel Exploit','SPN Crack','Token Impersonation','WriteDACL','DCSync'].map(t => (
            <span key={t} className="text-[10px] bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-full">{t}</span>
          ))}
        </div>

        {/* Flow */}
        <div className="flex items-center gap-0 overflow-x-auto pb-2">
          {escalationNodes.map((node, i) => (
            <div key={node.label} className="flex items-center">
              {i > 0 && (
                <div className="flex flex-col items-center mx-1">
                  <span className="text-[9px] text-indigo-500 font-medium mb-0.5 whitespace-nowrap">{node.technique}</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              )}
              <div className="flex flex-col items-center min-w-[72px]">
                <div className={`w-11 h-11 rounded-lg flex items-center justify-center border-2 mb-1
                  ${node.severity === 'CRITICAL' ? 'border-red-400 bg-red-50' :
                    node.severity === 'HIGH' ? 'border-orange-400 bg-orange-50' :
                    node.severity === 'MEDIUM' ? 'border-yellow-400 bg-yellow-50' :
                    'border-blue-300 bg-blue-50'}`}>
                  <User className="w-4 h-4 text-slate-600" />
                </div>
                <span className="text-[10px] text-slate-700 font-medium text-center leading-tight whitespace-pre-line">{node.label}</span>
                <SeverityBadge level={node.severity} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Escalation Progression */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <h3 className="font-semibold text-slate-800 text-sm mb-3">Escalation Progression — Step by Step</h3>
        <div className="space-y-2">
          {escalationSteps.map((s, i) => (
            <div key={s.step} className="flex gap-3 items-start">
              <div className="flex flex-col items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0
                  ${s.level === 'CRITICAL' ? 'bg-red-500' :
                    s.level === 'HIGH' ? 'bg-orange-500' :
                    s.level === 'MEDIUM' ? 'bg-yellow-500' : 'bg-blue-400'}`}>
                  {i + 1}
                </div>
                {i < escalationSteps.length - 1 && <div className="w-px h-4 bg-slate-200 mt-0.5"></div>}
              </div>
              <div className="pb-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-semibold text-slate-800">{s.step}</span>
                  <SeverityBadge level={s.level} />
                  <span className="text-[10px] font-mono text-indigo-500">{s.mitre}</span>
                </div>
                <p className="text-[11px] text-slate-500">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Risk & Action Tab ─────────────────────────────────────────────────────
function RiskActionTab() {
  const [filter, setFilter] = useState('all')

  const summaryStats = [
    { label: 'Toxic Combinations', value: '3' },
    { label: 'Score Elevations', value: '3' },
    { label: 'Choke Points', value: '2' },
    { label: 'Noise Suppressed', value: '2' },
    { label: 'Active Risk Factors', value: '9' },
    { label: 'Max Adjusted Score', value: '97' },
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
    {
      asset: 'API Gateway', reason: 'Toxic Combination: CVE + IAM + Internet-facing (+24%)',
      base: 73, adjusted: 97, delta: '+24%', positive: true,
    },
    {
      asset: 'Jump Server', reason: 'Choke Point (+19%): converges 5 attack paths',
      base: 68, adjusted: 87, delta: '+19%', positive: true,
    },
    {
      asset: 'Redis Cache', reason: 'Choke Point (+29%): no auth + credential store',
      base: 65, adjusted: 94, delta: '+29%', positive: true,
    },
    {
      asset: 'Dev Test Server', reason: 'No Reachability: isolated VLAN, no external paths (−57%)',
      base: 62, adjusted: 27, delta: '-57%', positive: false,
    },
    {
      asset: 'Staging DB', reason: 'Dormant: no verified credential or service path (−51%)',
      base: 58, adjusted: 28, delta: '-51%', positive: false,
    },
  ]

  return (
    <div className="space-y-5">
      {/* Stats bar */}
      <div className="grid grid-cols-6 gap-3">
        {summaryStats.map(s => (
          <div key={s.label} className="bg-white rounded-lg border border-slate-200 p-3 text-center">
            <div className="text-xl font-bold text-slate-800">{s.value}</div>
            <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Toxic Combinations */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <h3 className="font-semibold text-slate-800 text-sm mb-3">Toxic Combination Identification</h3>
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
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-800 text-sm">Contextual Risk Scoring</h3>
          <button className="text-[11px] border border-slate-300 text-slate-600 px-2.5 py-1 rounded hover:bg-slate-50">
            Showing all
          </button>
        </div>
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
export default function AttackPathQualys({ embedded = false }) {
  const [activeTab, setActiveTab] = useState('discovery')

  const etmNavItems = [
    { label: 'Add-ons', icon: Plus },
    { label: 'Cyber Risk Assistant', icon: Bot },
    { label: 'Home', icon: Home },
    { label: 'Dashboard', icon: LayoutDashboard },
    { label: 'Inventory', icon: Package },
    { label: 'Risk Management', icon: ShieldAlert },
    { label: 'Attack Path', icon: GitBranch, active: true },
  ]

  const tabs = [
    { id: 'discovery', label: 'Discovery' },
    { id: 'analysis', label: 'Analysis' },
    { id: 'risk', label: 'Risk & Action' },
  ]

  if (embedded) {
    return (
      <div className="flex-1 overflow-y-auto bg-[hsl(220,20%,97%)] p-5">
        <h1 className="text-lg font-bold text-slate-800 mb-3">Attack Path</h1>
        <div className="flex border-b border-slate-200 mb-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px
                ${activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {activeTab === 'discovery' && <DiscoveryTab />}
        {activeTab === 'analysis'  && <AnalysisTab />}
        {activeTab === 'risk'      && <RiskActionTab />}
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-[hsl(220,20%,97%)] overflow-hidden">

      {/* ── Qualys content area (full) ── */}
      <div className="flex flex-col flex-1 overflow-hidden">

        {/* Qualys top header */}
        <header className="flex items-center justify-between px-4 py-2 bg-white border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-3">
            {/* Qualys logo placeholder */}
            <div className="w-7 h-7 rounded bg-[#E5002B] flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-slate-800">
              Qualys
              <span className="font-normal text-slate-400 ml-1">Enterprise TruRisk™ Platform</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button className="p-1.5 rounded hover:bg-slate-100 text-slate-400 transition-colors">
              <Search className="w-4 h-4" />
            </button>
            <button className="p-1.5 rounded hover:bg-slate-100 text-slate-400 transition-colors">
              <Bell className="w-4 h-4" />
            </button>
            <button className="p-1.5 rounded hover:bg-slate-100 text-slate-400 transition-colors">
              <Settings className="w-4 h-4" />
            </button>
            <button className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-semibold">
              A
            </button>
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
                  onClick={() => {
                    if (item.label === 'Risk Management') window.location.hash = '/risk-management'
                    if (item.label === 'Attack Path')     window.location.hash = '/insights'
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-left text-[11px] transition-colors
                    ${item.active
                      ? 'bg-indigo-600 text-white font-medium'
                      : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'}`}
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
              <h1 className="text-lg font-bold text-slate-800 mb-3">Attack Path</h1>

              {/* Tabs */}
              <div className="flex border-b border-slate-200 mb-4">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px
                      ${activeTab === tab.id
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              {activeTab === 'discovery' && <DiscoveryTab />}
              {activeTab === 'analysis' && <AnalysisTab />}
              {activeTab === 'risk' && <RiskActionTab />}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
