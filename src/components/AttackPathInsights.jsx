import { useState } from 'react'
import {
  Search, Bell, Settings, Shield, AlertTriangle, ArrowRight,
  Database, Users, Bot, Plus, Home, LayoutDashboard, Package,
  GitBranch, ChevronRight, Filter, Clock, Target, Zap, Eye,
  Wrench, CheckCircle, XCircle, AlertCircle, ShieldAlert,
  TrendingUp, RefreshCw, Ticket, EyeOff, User, Server, Cloud,
  Link2, X
} from 'lucide-react'

// ─── Severity Badge ──────────────────────────────────────────────────────────
function SeverityBadge({ level }) {
  const colors = {
    CRITICAL: 'bg-red-900/30 text-red-300 border border-red-700/50',
    HIGH:     'bg-orange-900/30 text-orange-300 border border-orange-700/50',
    MEDIUM:   'bg-yellow-900/30 text-yellow-300 border border-yellow-700/50',
    LOW:      'bg-green-900/30 text-green-400 border border-green-700/50',
  }
  return (
    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${colors[level] || colors.LOW}`}>
      {level}
    </span>
  )
}

// ─── Status Pill ─────────────────────────────────────────────────────────────
function StatusPill({ status }) {
  const map = {
    open:       'bg-red-900/30 text-red-300 border-red-700/50',
    inprogress: 'bg-yellow-900/30 text-yellow-300 border-yellow-700/50',
    resolved:   'bg-green-900/30 text-green-400 border-green-700/50',
  }
  const labels = { open: 'Open', inprogress: 'In Progress', resolved: 'Resolved' }
  return (
    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${map[status]}`}>
      {labels[status]}
    </span>
  )
}

// ─── RESOURCES — Centralised resource store ───────────────────────────────────
// Each resource has a unique ID. Attack paths reference resources by ID,
// enabling a true many-to-many relationship.
const RESOURCES = [
  { id: 'res-graphql-api',  name: 'api-gateway-prod',       type: 'API Gateway',       severity: 'CRITICAL', exploitability: 'High',     os: 'Amazon Linux 2',       criticality: 'Mission Critical', ports: '443, 8080',   services: 'Kong API Gateway / GraphQL' },
  { id: 'res-redis-cache',  name: 'redis-cache-01',          type: 'Cache',             severity: 'CRITICAL', exploitability: 'Critical', os: 'Ubuntu 22.04 LTS',     criticality: 'High',             ports: '6379',         services: 'Redis 7.2 (no auth)' },
  { id: 'res-auth-service', name: 'auth-service-01',         type: 'Auth Service',      severity: 'HIGH',     exploitability: 'Medium',   os: 'Alpine Linux 3.18',    criticality: 'Mission Critical', ports: '8443, 5432',  services: 'Spring Boot 3.1' },
  { id: 'res-postgres-pii', name: 'postgres-pii-db',         type: 'Database',          severity: 'CRITICAL', exploitability: 'High',     os: 'PostgreSQL 15 / RDS',  criticality: 'Mission Critical', ports: '5432',         services: 'PostgreSQL 15 (PII Store)' },
  { id: 'res-s3-config',    name: 's3-config-bucket',        type: 'Cloud Storage',     severity: 'HIGH',     exploitability: 'High',     os: 'AWS S3',               criticality: 'High',             ports: '443',          services: 'S3 (Public Read ACL)' },
  { id: 'res-vpn-gateway',  name: 'vpn-gateway-01',          type: 'VPN',               severity: 'MEDIUM',   exploitability: 'Medium',   os: 'Palo Alto PAN-OS',     criticality: 'High',             ports: '443, 1194',   services: 'GlobalProtect VPN' },
  { id: 'res-workstation',  name: 'workstation-ws047',       type: 'Endpoint',          severity: 'MEDIUM',   exploitability: 'Medium',   os: 'Windows 11 22H2',      criticality: 'Low',              ports: '3389, 445',   services: 'RDP, SMB, WinRM' },
  { id: 'res-domain-ctrl',  name: 'dc01.acme.corp',          type: 'Domain Controller', severity: 'CRITICAL', exploitability: 'Critical', os: 'Windows Server 2022',  criticality: 'Mission Critical', ports: '389, 636, 88', services: 'AD DS, Kerberos, LDAP' },
  { id: 'res-ldap-ad',      name: 'ldap-ad-store',           type: 'Identity Store',    severity: 'CRITICAL', exploitability: 'High',     os: 'Windows Server 2019',  criticality: 'Mission Critical', ports: '389, 636',    services: 'LDAP / Active Directory' },
  { id: 'res-lambda-fn',    name: 'lambda-sql-executor',     type: 'Serverless',        severity: 'HIGH',     exploitability: 'High',     os: 'AWS Lambda (Node 18)', criticality: 'High',             ports: '443',          services: 'Public Lambda (no auth)' },
  { id: 'res-iam-role',     name: 'iam-role-lambda-admin',   type: 'IAM Role',          severity: 'CRITICAL', exploitability: 'Critical', os: 'AWS IAM',              criticality: 'Mission Critical', ports: 'N/A',          services: 'AdministratorAccess policy' },
  { id: 'res-rds-db',       name: 'rds-prod-db-01',          type: 'Database',          severity: 'CRITICAL', exploitability: 'High',     os: 'AWS RDS (MySQL 8)',    criticality: 'Mission Critical', ports: '3306',         services: 'MySQL 8 (Production DB)' },
]

// ─── Many-to-many helpers ─────────────────────────────────────────────────────
// One attack path → many resources
const getResourcesByPathId = (pathId) => {
  const path = ATTACK_PATHS.find(p => p.id === pathId)
  if (!path) return []
  return path.resourceIds.map(rid => RESOURCES.find(r => r.id === rid)).filter(Boolean)
}

// One resource → many attack paths  (the inverse relationship)
const getPathsByResourceId = (resourceId) =>
  ATTACK_PATHS.filter(p => p.resourceIds.includes(resourceId))

// IDs of resources within a path that are also referenced by at least one other path
const getSharedResourceIds = (pathId) => {
  const path = ATTACK_PATHS.find(p => p.id === pathId)
  if (!path) return []
  return path.resourceIds.filter(rid => getPathsByResourceId(rid).length > 1)
}

// ─── Attack Path data ─────────────────────────────────────────────────────────
// `resources` (plain count) replaced by `resourceIds[]` — references into RESOURCES store.
// Each flowNode may carry an optional `resourceId` linking it to a RESOURCES entry.
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
    resourceIds: ['res-graphql-api', 'res-redis-cache', 'res-auth-service', 'res-postgres-pii'],
    mitre: 'T1190 → T1021 → T1565',
    path: 'Internet → GraphQL API → Redis Cache → PostgreSQL (PII)',
    status: 'open',
    flowNodes: [
      { label: 'Internet',         icon: '🌐', severity: null,       isStart: true },
      { label: 'GraphQL API',      icon: '🖥️', severity: 'HIGH',     edge: 'HTTPS',           resourceId: 'res-graphql-api'  },
      { label: 'Redis Cache',      icon: '🖥️', severity: 'CRITICAL', edge: 'JWT Bypass',      resourceId: 'res-redis-cache'  },
      { label: 'Auth Service',     icon: '🖥️', severity: 'MEDIUM',   edge: 'Query Injection', resourceId: 'res-auth-service' },
      { label: 'PostgreSQL (PII)', icon: null,  severity: 'CRITICAL', edge: 'JDBC Direct',     resourceId: 'res-postgres-pii', isCrown: true },
    ],
    gaps_detail: [
      { label: 'Weak Auth:',       value: 'Redis cache with no authentication on port 6379' },
      { label: 'Network Misconfig:', value: 'No segmentation between cache tier and database tier' },
      { label: 'Chained Path:',    value: 'GraphQL → Redis Cache → PostgreSQL (PII)' },
    ],
    remediation: [
      { priority: 'CRITICAL', action: 'Patch CVE-2024-3094 on api-gateway-prod',                       effort: 'Low',    eta: '1 day',   roi: 8.2, resourceId: 'res-graphql-api'  },
      { priority: 'CRITICAL', action: 'Enable authentication on Redis port 6379',                      effort: 'Low',    eta: '4 hours', roi: 9.1, resourceId: 'res-redis-cache'  },
      { priority: 'HIGH',     action: 'Add network segmentation between cache and DB tiers',           effort: 'Medium', eta: '3 days',  roi: 4.5, resourceId: null               },
      { priority: 'MEDIUM',   action: 'Remove AdministratorAccess IAM role from api-gateway',          effort: 'Low',    eta: '2 hours', roi: 6.3, resourceId: 'res-graphql-api'  },
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
    resourceIds: ['res-s3-config', 'res-auth-service', 'res-postgres-pii'],
    mitre: 'T1530 → T1552 → T1078',
    path: 'S3 Config → SSH Key → Auth Service → PostgreSQL (PII)',
    status: 'open',
    flowNodes: [
      { label: 'S3 Bucket',        icon: '☁️', severity: null,       isStart: true,              resourceId: 'res-s3-config'    },
      { label: 'SSH Key Leak',     icon: '🔑', severity: 'CRITICAL', edge: 'Public Read'                                        },
      { label: 'Auth Service',     icon: '🖥️', severity: 'HIGH',     edge: 'SSH Key',            resourceId: 'res-auth-service' },
      { label: 'PostgreSQL (PII)', icon: null,  severity: 'CRITICAL', edge: 'Service Auth',       resourceId: 'res-postgres-pii', isCrown: true },
    ],
    gaps_detail: [
      { label: 'Cloud Misconfig:', value: 'S3 bucket with public-read ACL exposes config files' },
      { label: 'Software CVE:',    value: 'CVE-2024-22234 in Spring Boot auth bypass' },
      { label: 'Chained Path:',    value: 'S3 Config → SSH Key → Auth Service → PostgreSQL (PII)' },
    ],
    remediation: [
      { priority: 'CRITICAL', action: 'Block public access on S3 config bucket immediately',           effort: 'Low',    eta: '30 mins', roi: 9.4, resourceId: 'res-s3-config'    },
      { priority: 'CRITICAL', action: 'Rotate all SSH keys exposed in S3 objects',                    effort: 'Medium', eta: '2 hours', roi: 7.8, resourceId: 'res-s3-config'    },
      { priority: 'HIGH',     action: 'Apply Spring Boot CVE-2024-22234 patch',                       effort: 'Low',    eta: '1 day',   roi: 6.1, resourceId: 'res-auth-service' },
      { priority: 'MEDIUM',   action: 'Enforce bucket policy with deny public-read statements',        effort: 'Low',    eta: '1 hour',  roi: 5.2, resourceId: 'res-s3-config'    },
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
    resourceIds: ['res-vpn-gateway', 'res-workstation', 'res-domain-ctrl'],
    mitre: 'T1078 → T1548 → T1068 → T1003',
    path: 'VPN → Workstation → Local Admin → SYSTEM → DCSync → Domain Admin',
    status: 'inprogress',
    flowNodes: [
      { label: 'VPN',          icon: '🔐', severity: null,       isStart: true,              resourceId: 'res-vpn-gateway'  },
      { label: 'Workstation',  icon: '🖥️', severity: 'MEDIUM',   edge: 'Authenticated',      resourceId: 'res-workstation'  },
      { label: 'Local Admin',  icon: '👤', severity: 'HIGH',     edge: 'UAC Bypass'                                         },
      { label: 'NT SYSTEM',    icon: '👤', severity: 'CRITICAL', edge: 'Kernel Exploit'                                     },
      { label: 'Domain Admin', icon: null,  severity: 'CRITICAL', edge: 'DCSync',             resourceId: 'res-domain-ctrl', isCrown: true },
    ],
    gaps_detail: [
      { label: 'Identity:',    value: 'Kerberoastable SPN (weak password)' },
      { label: 'ACL Abuse:',   value: 'WriteDACL on AdminSDHolder' },
      { label: 'Chained Path:', value: 'svc_backup → AdminSDHolder → DCSync → Domain Admin' },
    ],
    remediation: [
      { priority: 'CRITICAL', action: 'Patch Kernel CVE-2024-1086 on all workstations',               effort: 'High',   eta: '1 week',  roi: 5.3, resourceId: 'res-workstation'  },
      { priority: 'CRITICAL', action: 'Remove WriteDACL from svc_backup on AdminSDHolder',            effort: 'Low',    eta: '1 hour',  roi: 8.7, resourceId: 'res-domain-ctrl'  },
      { priority: 'HIGH',     action: 'Reset svc_backup password with 25+ char policy',               effort: 'Low',    eta: '30 mins', roi: 7.2, resourceId: null               },
      { priority: 'HIGH',     action: 'Enable Credential Guard on all workstations',                  effort: 'High',   eta: '5 days',  roi: 3.9, resourceId: 'res-workstation'  },
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
    resourceIds: ['res-graphql-api', 'res-redis-cache', 'res-ldap-ad'],
    mitre: 'T1190 → T1552 → T1078.002',
    path: 'GraphQL → Redis → Cached Creds → LDAP / AD',
    status: 'open',
    flowNodes: [
      { label: 'GraphQL',      icon: '🖥️', severity: null,       isStart: true,              resourceId: 'res-graphql-api'  },
      { label: 'Redis Cache',  icon: '🖥️', severity: 'HIGH',     edge: 'Introspection',      resourceId: 'res-redis-cache'  },
      { label: 'Cached Creds', icon: '🔑', severity: 'HIGH',     edge: 'Memory Dump'                                        },
      { label: 'LDAP / AD',    icon: null,  severity: 'CRITICAL', edge: 'LDAP Bind',          resourceId: 'res-ldap-ad', isCrown: true },
    ],
    gaps_detail: [
      { label: 'API Exposure:',      value: 'GraphQL introspection enabled, unlimited query depth' },
      { label: 'Identity Weakness:', value: 'Service account with LDAP bind credentials cached in Redis' },
      { label: 'Chained Path:',      value: 'GraphQL → Redis → Cached Creds → LDAP / AD' },
    ],
    remediation: [
      { priority: 'HIGH',   action: 'Disable GraphQL introspection in production',                  effort: 'Low',    eta: '2 hours', roi: 7.4, resourceId: 'res-graphql-api'  },
      { priority: 'HIGH',   action: 'Enable MFA for all IAM users with console access',             effort: 'Medium', eta: '2 days',  roi: 4.8, resourceId: null               },
      { priority: 'MEDIUM', action: 'Flush Redis and clear cached service credentials',              effort: 'Low',    eta: '1 hour',  roi: 5.6, resourceId: 'res-redis-cache'  },
      { priority: 'MEDIUM', action: 'Implement Redis AUTH and TLS for data-in-transit',              effort: 'Medium', eta: '3 days',  roi: 3.2, resourceId: 'res-redis-cache'  },
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
    resourceIds: ['res-lambda-fn', 'res-iam-role', 'res-rds-db'],
    mitre: 'T1190 → T1078.004 → T1530',
    path: 'Internet → Lambda (Over-privileged) → RDS SQL Execution',
    status: 'open',
    flowNodes: [
      { label: 'Internet',     icon: '🌐', severity: null,       isStart: true                                              },
      { label: 'Lambda Fn',    icon: '⚡', severity: 'HIGH',     edge: 'API Trigger',        resourceId: 'res-lambda-fn'    },
      { label: 'IAM Role',     icon: '🔑', severity: 'CRITICAL', edge: 'Admin Assume',       resourceId: 'res-iam-role'     },
      { label: 'RDS Database', icon: null,  severity: 'CRITICAL', edge: 'SQL Execute',        resourceId: 'res-rds-db', isCrown: true },
    ],
    gaps_detail: [
      { label: 'Lambda Exposure:',  value: 'Public Lambda with no auth executing arbitrary SQL' },
      { label: 'IAM Over-privilege:', value: 'Lambda IAM role has RDS full access + S3 read' },
      { label: 'Chained Path:',     value: 'Internet → Lambda → IAM Role → RDS SQL Execution' },
    ],
    remediation: [
      { priority: 'CRITICAL', action: 'Add authorizer to public Lambda function endpoint',          effort: 'Low',    eta: '4 hours', roi: 9.2, resourceId: 'res-lambda-fn'    },
      { priority: 'HIGH',     action: 'Scope Lambda IAM role to minimum required permissions',     effort: 'Medium', eta: '1 day',   roi: 6.7, resourceId: 'res-iam-role'     },
      { priority: 'MEDIUM',   action: 'Enable RDS IAM database authentication',                    effort: 'Medium', eta: '2 days',  roi: 4.1, resourceId: 'res-rds-db'       },
      { priority: 'LOW',      action: 'Enable AWS CloudTrail logging for Lambda invocations',      effort: 'Low',    eta: '1 hour',  roi: 2.8, resourceId: 'res-lambda-fn'    },
    ],
  },
]

// ─── Module-level Contextual Risk & Toxic Combo data ─────────────────────────
// Defined here so both AnalyzeTab and RemediateTab can reference them.
const SCORING_ITEMS = [
  { asset: 'API Gateway',     resourceId: 'res-graphql-api', reason: 'Toxic Combination: CVE + IAM + Internet-facing (+24%)', base: 73, adjusted: 97, delta: '+24%', positive: true  },
  { asset: 'Jump Server',     resourceId: null,              reason: 'Choke Point (+19%): converges 5 attack paths',          base: 68, adjusted: 87, delta: '+19%', positive: true  },
  { asset: 'Redis Cache',     resourceId: 'res-redis-cache', reason: 'Choke Point (+29%): no auth + credential store',        base: 65, adjusted: 94, delta: '+29%', positive: true  },
  { asset: 'Dev Test Server', resourceId: null,              reason: 'No Reachability: isolated VLAN, no external paths',     base: 62, adjusted: 27, delta: '-57%', positive: false },
  { asset: 'Staging DB',      resourceId: null,              reason: 'Dormant: no verified credential or service path',       base: 58, adjusted: 28, delta: '-51%', positive: false },
]

const TOXIC_COMBOS = [
  {
    title: 'Critical CVE + Over-Privileged IAM + Internet-Facing',
    severity: 'CRITICAL', resourceId: 'res-graphql-api', asset: 'api-gateway-prod.acme.com',
    mitre: 'T1190 → T1078.004 → T1530',
    items: [
      { label: 'CVE:',               value: 'Critical CVE (CVE-2024-3094)' },
      { label: 'IAM:',               value: 'Over-Privileged IAM Role (AdministratorAccess)' },
      { label: 'Exposure:',          value: 'Internet-Facing (port 443)' },
      { label: 'Path to Crown Jewel:', value: 'API Gateway → Auth Service → PostgreSQL (PII)' },
    ],
  },
  {
    title: 'Kerberoastable SPN + WriteDACL + Tier-0 Proximity',
    severity: 'CRITICAL', resourceId: 'res-domain-ctrl', asset: 'svc_backup@acme.corp',
    mitre: 'T1558.003 → T1222 → T1003.006',
    items: [
      { label: 'Identity:',          value: 'Kerberoastable SPN (weak password)' },
      { label: 'ACL:',               value: 'WriteDACL on AdminSDHolder' },
      { label: 'Topology:',          value: '2 hops from Domain Controller' },
      { label: 'Path to Crown Jewel:', value: 'svc_backup → AdminSDHolder → DCSync → DA' },
    ],
  },
  {
    title: 'Public S3 + Cached Credentials + No Auth Redis',
    severity: 'CRITICAL', resourceId: 'res-redis-cache', asset: 'redis-cache-01.internal',
    mitre: 'T1552 → T1078.002 → T1003',
    items: [
      { label: 'Config:',            value: 'No Authentication on Redis (port 6379)' },
      { label: 'Credential:',        value: 'Service account credentials cached in memory' },
      { label: 'Topology:',          value: 'Network path to LDAP/AD identity store' },
      { label: 'Path to Crown Jewel:', value: 'Redis Cache → Cached Creds → LDAP / AD' },
    ],
  },
]

// ─── ROI Score Engine ─────────────────────────────────────────────────────────
// Computes a 0–100 ROI score for each remediation action based on:
//   Risk Reduction Value  = severity pts × path multiplier + toxic combo bonus + elevated score bonus
//   Remediation Cost      = effort weight × ETA weight
//   ROI Score             = clamp( round( RRV / Cost / MAX_RAW × 100 ), 0, 100 )

const SEVERITY_PTS   = { CRITICAL: 40, HIGH: 30, MEDIUM: 20, LOW: 10 }
const EFFORT_WEIGHT  = { Low: 1, Medium: 2, High: 3 }
const ETA_WEIGHT = (eta = '') => {
  const s = eta.toLowerCase()
  if (s.includes('min') || (s.includes('hour') && parseInt(s) <= 4)) return 1
  if ((s.includes('hour') && parseInt(s) > 4) || (s.includes('day') && parseInt(s) <= 1)) return 2
  if (s.includes('day') && parseInt(s) <= 4) return 3
  return 4   // 5+ days / 1 week+
}
const TOXIC_RES_IDS    = new Set(TOXIC_COMBOS.map(tc => tc.resourceId).filter(Boolean))
const ELEVATED_RES_IDS = new Set(SCORING_ITEMS.filter(s => s.positive && s.resourceId).map(s => s.resourceId))
const ROI_MAX_RAW = 110  // CRITICAL(40)×2paths + toxic(20) + elevated(10) = 110, cost=1

function computeRoi(action) {
  const severityPts    = SEVERITY_PTS[action.priority]  ?? 10
  const pathCount      = action.resourceId ? getPathsByResourceId(action.resourceId).length : 1
  const pathMultiplier = Math.max(1, pathCount)
  const toxicBonus     = TOXIC_RES_IDS.has(action.resourceId)    ? 20 : 0
  const elevatedBonus  = ELEVATED_RES_IDS.has(action.resourceId) ? 10 : 0

  const rrv  = severityPts * pathMultiplier + toxicBonus + elevatedBonus

  const effortW = EFFORT_WEIGHT[action.effort] ?? 1
  const etaW    = ETA_WEIGHT(action.eta)
  const cost    = effortW * etaW

  const raw   = rrv / cost
  const score = Math.min(Math.round(raw / ROI_MAX_RAW * 100), 100)

  return {
    score,
    breakdown: {
      severityPts, pathCount, pathMultiplier, toxicBonus, elevatedBonus,
      rrv, effortW, etaW, cost, raw: Math.round(raw * 10) / 10,
    },
  }
}

// ─── Resource Detail Panel (slide-over) ──────────────────────────────────────
// Surfaces the inverse relationship: given a resource, which attack paths is it part of?
function ResourceDetailPanel({ resourceId, onClose, onSelectPath }) {
  const resource = RESOURCES.find(r => r.id === resourceId)
  const paths = resource ? getPathsByResourceId(resourceId) : []

  if (!resource) return null

  const typeIcon = {
    'API Gateway': '🖥️', 'Cache': '🖥️', 'Auth Service': '🖥️',
    'Database': '🗄️', 'Cloud Storage': '☁️', 'VPN': '🔐',
    'Endpoint': '💻', 'Domain Controller': '🏛️', 'Identity Store': '🔑',
    'Serverless': '⚡', 'IAM Role': '🔑', 'Server': '🖥️',
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[1px]" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-80 bg-slate-800 shadow-2xl flex flex-col border-l border-slate-700 overflow-y-auto">
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-700 bg-slate-700/40 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-200 rounded flex items-center justify-center">
              <Server className="w-3.5 h-3.5 text-slate-300" />
            </div>
            <span className="text-sm font-semibold text-white">Resource Detail</span>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-200 text-slate-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Resource metadata */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-start justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <span className="text-base">{typeIcon[resource.type] || '🖥️'}</span>
              <span className="text-xs font-mono font-semibold text-white">{resource.name}</span>
            </div>
            <SeverityBadge level={resource.severity} />
          </div>
          <div className="text-[10px] text-slate-400 mb-3 ml-6">{resource.type}</div>

          <div className={`text-[10px] font-medium px-1.5 py-0.5 rounded border inline-block mb-3
            ${resource.exploitability === 'Critical' || resource.exploitability === 'High'
              ? 'bg-red-900/20 text-red-600 border-red-700/50'
              : resource.exploitability === 'Medium'
              ? 'bg-yellow-900/20 text-yellow-600 border-yellow-700/50'
              : 'bg-slate-700/40 text-slate-400 border-slate-700'}`}>
            Exploitability: {resource.exploitability}
          </div>

          <div className="space-y-1.5">
            {[
              { label: 'OS / Platform', value: resource.os },
              { label: 'Criticality',   value: resource.criticality },
              { label: 'Open Ports',    value: resource.ports },
              { label: 'Services',      value: resource.services },
            ].map(item => (
              <div key={item.label} className="flex gap-2 text-[10px]">
                <span className="text-slate-400 font-medium w-24 shrink-0">{item.label}</span>
                <span className="text-slate-200 font-mono">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Attack paths this resource is part of */}
        <div className="p-4">
          <div className="flex items-center gap-1.5 mb-3">
            <Link2 className="w-3.5 h-3.5 text-teal-300" />
            <span className="text-xs font-semibold text-slate-200">
              Part of {paths.length} Attack Path{paths.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="space-y-2">
            {paths.map(p => (
              <button
                key={p.id}
                onClick={() => { onSelectPath(p); onClose() }}
                className="w-full text-left border border-slate-700 rounded-lg p-3 hover:border-indigo-600 hover:bg-indigo-900/20 transition-colors group"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <SeverityBadge level={p.severity} />
                    <span className="text-[10px] font-mono text-slate-400">AP-{p.id}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-bold ${p.score >= 90 ? 'text-red-600' : 'text-orange-600'}`}>
                      Score {p.score}
                    </span>
                    <StatusPill status={p.status} />
                  </div>
                </div>
                <div className="text-[11px] font-medium text-slate-200 group-hover:text-indigo-300 leading-tight">{p.title}</div>
                <div className="text-[9px] font-mono text-slate-400 mt-0.5 truncate">{p.path}</div>
              </button>
            ))}
          </div>

          {paths.length > 1 && (
            <div className="mt-3 p-2.5 bg-teal-900/20 border border-teal-700/50 rounded-lg">
              <div className="text-[10px] text-teal-200 font-medium">
                💡 Remediating this resource reduces combined risk across all {paths.length} paths.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Discover Tab ─────────────────────────────────────────────────────────────
function DiscoverTab({ onSelectPath, onOpenResource }) {
  const [severityFilter, setSeverityFilter] = useState('all')
  const [searchQuery, setSearchQuery]       = useState('')

  const stats = [
    { label: 'Total Paths',          value: '14', icon: GitBranch,    color: 'text-white'  },
    { label: 'Critical Paths',       value: '5',  icon: AlertTriangle, color: 'text-red-600'   },
    { label: 'Avg Risk Score',       value: '73', icon: TrendingUp,    color: 'text-orange-600' },
    { label: 'Crown Jewels at Risk', value: '2',  icon: Target,        color: 'text-purple-600' },
    { label: 'Entry Points',         value: '4',  icon: Zap,           color: 'text-blue-400'   },
  ]

  const entryPoints = [
    { label: 'Internet / Web API',  count: 6 },
    { label: 'S3 / Cloud Storage',  count: 3 },
    { label: 'VPN Entry',           count: 3 },
    { label: 'Lambda / Serverless', count: 2 },
  ]

  const filtered = ATTACK_PATHS.filter(p => {
    const matchSev    = severityFilter === 'all' || p.severity === severityFilter
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
          <div key={s.label} className="bg-slate-800 rounded-lg border border-slate-700 p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-700/40 border border-slate-700 flex items-center justify-center shrink-0">
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <div>
              <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-[10px] text-slate-400 leading-tight">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        {/* Quick Filters */}
        <div className="w-52 shrink-0 space-y-3">
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-3">
            <div className="flex items-center gap-1.5 mb-3">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs font-semibold text-slate-200">Quick Filters</span>
            </div>
            <div className="mb-3">
              <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-2">Severity</div>
              <div className="space-y-1">
                {[['all','All',14],['CRITICAL','Critical',5],['HIGH','High',7],['MEDIUM','Medium',2]].map(([val,label,count]) => (
                  <button
                    key={val}
                    onClick={() => setSeverityFilter(val)}
                    className={`w-full flex items-center justify-between px-2 py-1 rounded text-[11px] transition-colors
                      ${severityFilter === val ? 'bg-indigo-900/30 text-indigo-300 font-medium' : 'text-slate-300 hover:bg-slate-700/40'}`}
                  >
                    <span>{label}</span>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded
                      ${val === 'CRITICAL' ? 'bg-red-900/30 text-red-300' :
                        val === 'HIGH'     ? 'bg-orange-900/30 text-orange-300' :
                        val === 'MEDIUM'   ? 'bg-yellow-900/30 text-yellow-300' :
                        'bg-slate-700 text-slate-300'}`}>{count}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-2">Entry Point Type</div>
              <div className="space-y-1">
                {entryPoints.map(ep => (
                  <div key={ep.label} className="flex items-center justify-between px-2 py-1 text-[11px] text-slate-300">
                    <span>{ep.label}</span>
                    <span className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded font-medium">{ep.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg border border-slate-700 p-3">
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-2">Time Range</div>
            {['Last 7 Days','Last 30 Days','Last 90 Days'].map((t, i) => (
              <button key={t} className={`w-full text-left px-2 py-1 text-[11px] rounded transition-colors
                ${i === 1 ? 'bg-indigo-900/30 text-indigo-300 font-medium' : 'text-slate-300 hover:bg-slate-700/40'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Attack Paths Table */}
        <div className="flex-1 bg-slate-800 rounded-lg border border-slate-700">
          <div className="p-3 border-b border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white">Attack Paths</span>
              <span className="text-[11px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full font-medium">{filtered.length} of 14</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search assets..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-7 pr-3 py-1 text-[11px] border border-slate-700 rounded text-slate-200 placeholder:text-slate-400 bg-slate-700 focus:outline-none focus:border-indigo-400 w-52"
                />
              </div>
              <button className="p-1.5 rounded border border-slate-700 text-slate-400 hover:bg-slate-700/40">
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Column headers — includes new Resources column */}
          <div className="grid grid-cols-[64px_1fr_100px_80px_70px_120px_80px_90px] gap-2 px-3 py-2 bg-slate-700/40 border-b border-slate-700 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            <div>CID</div>
            <div>Attack Path Title / Chain</div>
            <div>Crown Jewel</div>
            <div>Severity</div>
            <div>Hops / Gaps</div>
            <div className="flex items-center gap-1">
              <Link2 className="w-3 h-3" />
              Resources
            </div>
            <div>Risk Score</div>
            <div>Action</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-slate-700">
            {filtered.map(ap => {
              const sharedCount = ap.resourceIds.filter(rid => getPathsByResourceId(rid).length > 1).length
              return (
                <div
                  key={ap.id}
                  className="grid grid-cols-[64px_1fr_100px_80px_70px_120px_80px_90px] gap-2 px-3 py-3 items-center hover:bg-slate-700/40 transition-colors group cursor-pointer"
                  onClick={() => onSelectPath(ap)}
                >
                  <div className="text-[11px] font-mono text-slate-400 font-semibold">{ap.id}</div>
                  <div>
                    <div className="text-[12px] font-semibold text-white group-hover:text-indigo-300 leading-tight mb-0.5">{ap.title}</div>
                    <div className="text-[10px] font-mono text-slate-400 leading-tight truncate">{ap.path}</div>
                  </div>
                  <div className="text-[10px] text-slate-300 leading-tight">{ap.target}</div>
                  <div><SeverityBadge level={ap.severity} /></div>
                  <div className="text-[11px] text-slate-300">{ap.hops} hops / {ap.gaps} gaps</div>

                  {/* Resources cell — shows count + shared badge */}
                  <div className="flex flex-col gap-1 items-start" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] font-semibold text-slate-200">{ap.resourceIds.length}</span>
                      <span className="text-[10px] text-slate-400">resources</span>
                    </div>
                    {sharedCount > 0 ? (
                      <span className="text-[9px] bg-orange-900/30 text-orange-300 border border-orange-700/50 px-1.5 py-0.5 rounded-full font-semibold flex items-center gap-0.5">
                        <Link2 className="w-2.5 h-2.5" />
                        {sharedCount} shared
                      </span>
                    ) : (
                      <span className="text-[9px] text-green-400 bg-green-900/20 border border-green-700/50 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                        <CheckCircle className="w-2.5 h-2.5" />
                        unique
                      </span>
                    )}
                  </div>

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
              )
            })}
          </div>

          <div className="px-3 py-2 border-t border-slate-700 flex items-center justify-between">
            <span className="text-[10px] text-slate-400">Showing {filtered.length} paths</span>
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
              <button className="px-2 py-0.5 border border-slate-700 rounded hover:bg-slate-700/40">‹</button>
              <button className="px-2 py-0.5 border border-indigo-600 rounded bg-indigo-900/30 text-indigo-300 font-medium">1</button>
              <button className="px-2 py-0.5 border border-slate-700 rounded hover:bg-slate-700/40">›</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Analyze Tab ──────────────────────────────────────────────────────────────
function AnalyzeTab({ selectedPath, onSelectPath, onOpenResource, onNavigateToRemediate }) {
  const [expandedStep, setExpandedStep] = useState(null)
  const [selectedEdge,  setSelectedEdge]  = useState(null)
  const [hoveredNode,   setHoveredNode]   = useState(null)

  const escalationSteps = [
    { step: 'Standard User',   level: 'LOW',      mitre: 'T1078.002', desc: 'Attacker begins as jsmith — a marketing dept standard user with no admin privileges' },
    { step: 'Local Admin',     level: 'MEDIUM',   mitre: 'T1548.002', desc: 'UAC bypass on workstation WS-047 grants local administrator access' },
    { step: 'SYSTEM',          level: 'CRITICAL', mitre: 'T1068',     desc: 'Kernel exploit CVE-2024-1086 escalates from Local Admin to NT AUTHORITY\\SYSTEM' },
    { step: 'Service Account', level: 'HIGH',     mitre: 'T1558.003', desc: 'Kerberoasting cracks svc_deploy SPN password (weak 8-char password)' },
    { step: 'DCSync',          level: 'CRITICAL', mitre: 'T1003.006', desc: 'WriteDACL on AdminSDHolder enables DCSync replication rights' },
    { step: 'Domain Admin',    level: 'CRITICAL', mitre: 'T1003.006', desc: 'Full domain compromise — attacker extracts all credential hashes via DCSync' },
  ]

  // Derive assets from the centralized RESOURCES store via the selected path's resourceIds
  const pathResources = selectedPath ? getResourcesByPathId(selectedPath.id) : []

  // IDs of resources shared with other paths (for the warning banner)
  const sharedIds = selectedPath ? getSharedResourceIds(selectedPath.id) : []

  if (!selectedPath) {
    return (
      <div className="space-y-4">
        <div className="bg-indigo-900/30 border border-indigo-700 rounded-lg p-4 flex items-center gap-3">
          <Eye className="w-5 h-5 text-indigo-400 shrink-0" />
          <div>
            <div className="text-sm font-semibold text-indigo-200">Select an Attack Path to Analyze</div>
            <div className="text-[11px] text-indigo-400 mt-0.5">Click any attack path from the Discover tab, or select one below to drill into its full detail.</div>
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
          <h3 className="font-semibold text-white text-sm mb-3">Top Critical Attack Paths — Select to Analyze</h3>
          <div className="space-y-2.5">
            {ATTACK_PATHS.filter(p => p.severity === 'CRITICAL').map((ap, i) => (
              <button
                key={ap.id}
                onClick={() => onSelectPath(ap)}
                className="w-full text-left border border-slate-700 rounded-lg p-3 hover:border-indigo-600 hover:bg-indigo-900/20 transition-colors group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-indigo-800/40 text-indigo-300 flex items-center justify-center text-[10px] font-bold shrink-0">{i+1}</div>
                    <SeverityBadge level={ap.severity} />
                    <span className="text-xs font-semibold text-white group-hover:text-indigo-300">{ap.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-red-600">Score: {ap.score}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-400" />
                  </div>
                </div>
                <div className="text-[10px] font-mono text-slate-400 bg-slate-700/40 px-2 py-1 rounded">{ap.path}</div>
                <div className="flex gap-3 mt-1.5 text-[10px] text-slate-400">
                  <span>{ap.hops} hops</span>
                  <span>{ap.gaps} gaps chained</span>
                  <span className="font-mono text-indigo-300">{ap.mitre}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Path header */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => onSelectPath(null)}
            className="text-[11px] text-slate-400 hover:text-indigo-400 flex items-center gap-1"
          >
            ← Back to all paths
          </button>
          <div className="flex gap-2">
            <StatusPill status={selectedPath.status} />
            <span className={`text-sm font-bold px-2 py-0.5 rounded ${selectedPath.score >= 90 ? 'bg-red-900/30 text-red-300' : 'bg-orange-900/30 text-orange-300'}`}>
              Risk {selectedPath.score}
            </span>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div>
            <h3 className="font-bold text-white text-base">{selectedPath.title}</h3>
            <div className="flex items-center gap-3 mt-1">
              <SeverityBadge level={selectedPath.severity} />
              <span className="text-[11px] text-slate-400">{selectedPath.hops} hops · {selectedPath.gaps} gaps chained</span>
              <span className="text-[10px] font-mono text-indigo-400">{selectedPath.mitre}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Asset Type Breakdown — replaces generic metric cards */}
      {(() => {
        const typeIcons = {
          'API Gateway': '🖥️', 'Cache': '🗄️', 'Auth Service': '🔐',
          'Database': '💾', 'Cloud Storage': '☁️', 'VPN': '🔒',
          'Endpoint': '💻', 'Domain Controller': '🏛️', 'Identity Store': '🔑',
          'Serverless': '⚡', 'IAM Role': '👤',
        }
        const typeCounts = pathResources.reduce((acc, r) => {
          acc[r.type] = (acc[r.type] || 0) + 1
          return acc
        }, {})
        return (
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-3">
            <div className="flex items-center gap-2 mb-2.5">
              <Package className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs font-semibold text-slate-200">Asset Type Breakdown</span>
              <span className="text-[10px] text-slate-400">— {pathResources.length} assets · {Object.keys(typeCounts).length} types · {selectedPath.hops} hops</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(typeCounts).map(([type, count]) => (
                <div key={type} className="flex items-center gap-1.5 bg-slate-700/40 border border-slate-700 rounded-lg px-2.5 py-1.5">
                  <span className="text-base leading-none">{typeIcons[type] || '🖥️'}</span>
                  <div>
                    <div className="text-xs font-bold text-white leading-none">{count}</div>
                    <div className="text-[9px] text-slate-400 leading-tight mt-0.5">{type}</div>
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-1.5 bg-orange-900/20 border border-orange-700/50 rounded-lg px-2.5 py-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-orange-500" />
                <div>
                  <div className="text-xs font-bold text-orange-300 leading-none">{selectedPath.gaps}</div>
                  <div className="text-[9px] text-orange-500 leading-tight mt-0.5">Gaps Chained</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-red-900/20 border border-red-700/50 rounded-lg px-2.5 py-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                <div>
                  <div className="text-xs font-bold text-red-300 leading-none">{selectedPath.score}</div>
                  <div className="text-[9px] text-red-500 leading-tight mt-0.5">Risk Score</div>
                </div>
              </div>
            </div>
          </div>
        )
      })()}

      {/* Shared resources warning banner — shown only when ≥1 resource is shared */}
      {sharedIds.length > 0 && (
        <div className="bg-orange-900/20 border border-orange-700/50 rounded-lg p-3 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="text-xs font-semibold text-orange-200 mb-1">
              {sharedIds.length} resource{sharedIds.length > 1 ? 's' : ''} in this path are shared with other attack paths
            </div>
            <div className="flex flex-wrap gap-1.5 items-center">
              {sharedIds.map(rid => {
                const res = RESOURCES.find(r => r.id === rid)
                const pathCount = getPathsByResourceId(rid).length
                return res ? (
                  <button
                    key={rid}
                    onClick={() => onOpenResource(rid)}
                    className="text-[10px] bg-orange-900/30 text-orange-200 border border-orange-600/50 px-2 py-0.5 rounded-full hover:bg-orange-800/40 transition-colors font-mono flex items-center gap-1"
                  >
                    {res.name}
                    <span className="bg-orange-300 text-orange-900 px-1 rounded-full text-[9px] font-bold">×{pathCount}</span>
                  </button>
                ) : null
              })}
              <span className="text-[10px] text-orange-600">— remediating these reduces risk across multiple paths.</span>
            </div>
          </div>
        </div>
      )}

      {/* Attack Path Flow Visualization — edges are clickable to inspect security gaps */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-white text-sm">Asset Type Breakdown &amp; Attack Flow</h3>
          <span className="text-xs text-green-400 font-medium bg-green-900/20 border border-green-700/50 px-2 py-0.5 rounded">Validated</span>
        </div>
        <p className="text-[11px] text-slate-400 mb-1">
          Entry: <span className="font-medium text-slate-200">{selectedPath.entry}</span> &nbsp;→&nbsp; Crown Jewel: <span className="font-medium text-red-300">{selectedPath.target}</span>
        </p>
        <p className="text-[10px] text-indigo-300 mb-4 flex items-center gap-1">
          <ArrowRight className="w-3 h-3" /> Click any edge arrow to inspect the security gap · Hover any node for asset metadata
        </p>
        <div className="flex items-center gap-0 overflow-x-auto pb-20">
          {selectedPath.flowNodes.map((node, i) => {
            const sharedPathCount = node.resourceId ? getPathsByResourceId(node.resourceId).length : 0
            const isShared = sharedPathCount > 1
            const resource  = node.resourceId ? RESOURCES.find(r => r.id === node.resourceId) : null
            return (
              <div key={node.label} className="flex items-center">
                {/* Clickable edge */}
                {i > 0 && (
                  <button
                    onClick={() => setSelectedEdge(selectedEdge === i ? null : i)}
                    className={`flex flex-col items-center mx-1 px-2 py-1 rounded-lg border transition-all
                      ${selectedEdge === i
                        ? 'bg-indigo-800/40 border-indigo-600 shadow-sm'
                        : 'border-transparent hover:bg-indigo-900/30 hover:border-indigo-700'}`}
                    title="Click to inspect security gap"
                  >
                    <span className="text-[9px] text-indigo-300 font-medium mb-0.5 whitespace-nowrap">{node.edge}</span>
                    <ArrowRight className={`w-4 h-4 ${selectedEdge === i ? 'text-indigo-400' : 'text-slate-400'}`} />
                  </button>
                )}
                {/* Hoverable node */}
                <div
                  className="relative flex flex-col items-center min-w-[88px]"
                  onMouseEnter={() => resource && setHoveredNode(node.resourceId)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl border-2 mb-1 cursor-default
                    ${node.isCrown         ? 'border-red-400 bg-red-900/20' :
                      node.severity === 'CRITICAL' ? 'border-red-600/50 bg-red-900/20' :
                      node.severity === 'HIGH'     ? 'border-orange-600/50 bg-orange-900/20' :
                      node.severity === 'MEDIUM'   ? 'border-yellow-300 bg-yellow-900/20' :
                      'border-blue-500 bg-blue-50'}`}>
                    {node.icon ? <span>{node.icon}</span> : <Database className="w-5 h-5 text-slate-300" />}
                  </div>
                  <span className="text-[10px] text-slate-200 font-medium text-center leading-tight">{node.label}</span>
                  {node.severity && <SeverityBadge level={node.severity} />}
                  {node.isCrown && <span className="text-[9px] text-red-600 font-semibold mt-0.5">👑 Crown Jewel</span>}
                  {node.resourceId && isShared && (
                    <button
                      onClick={() => onOpenResource(node.resourceId)}
                      className="mt-1 text-[9px] text-teal-300 bg-teal-900/20 border border-teal-700/50 px-1.5 py-0.5 rounded-full flex items-center gap-0.5 hover:bg-teal-900/30 transition-colors whitespace-nowrap"
                    >
                      <Link2 className="w-2.5 h-2.5" />
                      In {sharedPathCount} paths
                    </button>
                  )}
                  {/* Hover metadata tooltip — appears below node to avoid overflow clipping */}
                  {hoveredNode === node.resourceId && resource && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-20 w-52 bg-slate-800 border border-slate-700 rounded-lg shadow-xl p-2.5 text-left pointer-events-none">
                      <div className="text-[11px] font-semibold text-white mb-1.5 font-mono truncate">{resource.name}</div>
                      <div className="space-y-1">
                        {[
                          { k: 'OS',            v: resource.os },
                          { k: 'Ports',         v: resource.ports },
                          { k: 'Exploitability',v: resource.exploitability },
                          { k: 'Criticality',   v: resource.criticality },
                        ].map(row => (
                          <div key={row.k} className="flex gap-2 text-[9px]">
                            <span className="text-slate-400 w-20 shrink-0">{row.k}</span>
                            <span className={`font-medium ${row.k === 'Exploitability' && (row.v === 'Critical' || row.v === 'High') ? 'text-red-600' : 'text-slate-200'}`}>{row.v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Security Gap detail — shown when an edge is selected */}
        {selectedEdge !== null && selectedPath.flowNodes[selectedEdge] && (
          <div className="mt-3 border border-indigo-700 bg-indigo-900/20 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-semibold text-indigo-300 bg-indigo-800/40 px-2 py-0.5 rounded">
                Security Gap #{selectedEdge}
              </span>
              <span className="text-[11px] font-semibold text-white">
                {selectedPath.flowNodes[selectedEdge].edge}
              </span>
              <button onClick={() => setSelectedEdge(null)} className="ml-auto text-indigo-400 hover:text-indigo-400">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            {selectedPath.gaps_detail[selectedEdge - 1] && (
              <div className="space-y-1 mb-2">
                <div className="flex gap-2 text-[10px]">
                  <span className="text-slate-400 font-medium w-28 shrink-0">{selectedPath.gaps_detail[selectedEdge - 1].label}</span>
                  <span className="text-slate-300">{selectedPath.gaps_detail[selectedEdge - 1].value}</span>
                </div>
              </div>
            )}
            <div className="text-[10px] text-indigo-300">Click another edge arrow to inspect, or × to dismiss.</div>
          </div>
        )}
      </div>

      {/* ── 5. Asset Metadata Enrichment (diagram order: after flow graph) ── */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-white text-sm">Asset Metadata Enrichment</h3>
          <span className="text-[10px] text-teal-400 bg-teal-900/20 border border-teal-700/50 px-2 py-0.5 rounded font-medium flex items-center gap-1">
            <Link2 className="w-3 h-3" />
            {sharedIds.length > 0 ? `${sharedIds.length} shared across paths` : 'All resources unique to this path'}
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mb-3">Qualys-enriched asset context — OS, services, criticality, exploitability, and cross-path membership</p>
        <div className="grid grid-cols-2 gap-3">
          {pathResources.map(a => {
            const otherPaths = getPathsByResourceId(a.id).filter(p => p.id !== selectedPath.id)
            return (
              <div
                key={a.id}
                className={`border rounded-lg p-3 ${otherPaths.length > 0 ? 'border-teal-700/50 bg-teal-900/20' : 'border-slate-700'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-white font-mono">{a.name}</span>
                    {otherPaths.length > 0 && (
                      <button
                        onClick={() => onOpenResource(a.id)}
                        className="text-[9px] bg-teal-900/30 text-teal-300 border border-teal-700/50 px-1.5 py-0.5 rounded-full hover:bg-teal-800/40 transition-colors flex items-center gap-0.5"
                      >
                        <Link2 className="w-2.5 h-2.5" />
                        ×{otherPaths.length + 1} paths
                      </button>
                    )}
                  </div>
                  <div className="flex gap-1.5">
                    <SeverityBadge level={a.severity} />
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border
                      ${a.exploitability === 'Critical' || a.exploitability === 'High' ? 'bg-red-900/20 text-red-600 border-red-700/50' :
                        a.exploitability === 'Medium' ? 'bg-yellow-900/20 text-yellow-600 border-yellow-700/50' :
                        'bg-slate-700/40 text-slate-400 border-slate-700'}`}>
                      Exploitability: {a.exploitability}
                    </span>
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 mb-1">{a.os}</div>
                <div className="grid grid-cols-3 gap-2 text-[10px]">
                  <div><div className="text-slate-400 font-medium">Criticality</div><div className="text-slate-200">{a.criticality}</div></div>
                  <div><div className="text-slate-400 font-medium">Open Ports</div><div className="text-slate-200 font-mono">{a.ports}</div></div>
                  <div><div className="text-slate-400 font-medium">Services</div><div className="text-slate-200">{a.services}</div></div>
                </div>
                {otherPaths.length > 0 ? (
                  <div className="mt-2 pt-2 border-t border-teal-700/50 flex items-center gap-1.5 flex-wrap">
                    <Link2 className="w-3 h-3 text-teal-300 shrink-0" />
                    <span className="text-[10px] text-teal-300">Also in {otherPaths.length} other path{otherPaths.length > 1 ? 's' : ''}:</span>
                    {otherPaths.map(p => (
                      <button key={p.id} onClick={() => onSelectPath(p)}
                        className="text-[9px] bg-indigo-900/30 text-indigo-300 border border-indigo-700 px-1.5 py-0.5 rounded hover:bg-indigo-800/40 transition-colors font-mono">
                        AP-{p.id}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="mt-2 pt-2 border-t border-slate-600/50 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-green-500 shrink-0" />
                    <span className="text-[10px] text-green-400">Unique to this path</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ── 6. Contextual Risk Scoring ── */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-indigo-400" />
          <h3 className="font-semibold text-white text-sm">Contextual Risk Scoring</h3>
        </div>
        <p className="text-[11px] text-slate-400 mb-3">
          Dynamic scores adjusted by topological position — elevated for chokepoints, suppressed for isolated assets.
        </p>
        <div className="space-y-2">
          {SCORING_ITEMS.map(item => {
            const pathCount = item.resourceId ? getPathsByResourceId(item.resourceId).length : 0
            return (
              <div key={item.asset} className="border border-slate-700 rounded-lg p-3 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-semibold text-white">{item.asset}</span>
                    {pathCount > 1 && (
                      <button onClick={() => onOpenResource(item.resourceId)}
                        className="text-[9px] bg-teal-900/20 text-teal-300 border border-teal-700/50 px-1.5 py-0.5 rounded-full hover:bg-teal-900/30 transition-colors flex items-center gap-0.5">
                        <Link2 className="w-2.5 h-2.5" /> In {pathCount} paths
                      </button>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400">{item.reason}</div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-[10px] text-slate-400">Base → Adjusted</div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono text-slate-400">{item.base}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                    <span className={`text-xs font-mono font-bold ${item.positive ? 'text-red-600' : 'text-green-400'}`}>{item.adjusted}</span>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${item.positive ? 'bg-red-900/30 text-red-600' : 'bg-green-900/30 text-green-400'}`}>{item.delta}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── 7. Toxic Combinations ── */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-4 h-4 text-red-500" />
          <h3 className="font-semibold text-white text-sm">Toxic Combination Identification</h3>
        </div>
        <div className="space-y-3">
          {TOXIC_COMBOS.map(tc => {
            const tcPaths = tc.resourceId ? getPathsByResourceId(tc.resourceId) : []
            return (
              <div key={tc.title} className="border border-red-700/50 bg-red-900/10 rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <SeverityBadge level={tc.severity} />
                      <span className="text-[11px] font-semibold text-white">{tc.title}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-slate-400 ml-5">
                      <span>Asset: {tc.resourceId ? (
                        <button onClick={() => onOpenResource(tc.resourceId)}
                          className="font-mono text-indigo-300 bg-indigo-900/30 border border-indigo-700 px-1.5 py-0.5 rounded hover:bg-indigo-800/40 transition-colors inline-flex items-center gap-1">
                          {tc.asset}<Link2 className="w-2.5 h-2.5" />
                        </button>
                      ) : <span className="font-mono text-slate-200">{tc.asset}</span>}</span>
                      <span className="font-mono text-indigo-300">{tc.mitre}</span>
                      {tcPaths.length > 1 && (
                        <span className="text-teal-400 flex items-center gap-0.5"><Link2 className="w-3 h-3" /> Spans {tcPaths.length} paths</span>
                      )}
                    </div>
                  </div>
                  <button className="text-[10px] border border-slate-600 text-slate-400 hover:bg-slate-700 px-2 py-0.5 rounded shrink-0">Suppress</button>
                </div>
                <div className="space-y-1 ml-5">
                  {tc.items.map(item => (
                    <div key={item.label} className="flex gap-2 text-[10px]">
                      <span className="text-slate-400 font-medium w-28 shrink-0">{item.label}</span>
                      <span className={item.label === 'Path to Crown Jewel:' ? 'font-mono text-slate-200' : 'text-slate-300'}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── 8. Privilege Escalation Mapping ── */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-white text-sm">Privilege Escalation Mapping — Standard User to Domain Admin</h3>
          <span className="text-xs text-green-400 font-medium bg-green-900/20 border border-green-700/50 px-2 py-0.5 rounded">MITRE ATT&CK Mapped</span>
        </div>
        <p className="text-[11px] text-slate-400 mb-4">Step-by-step escalation chain from least-privileged account to full domain compromise</p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {['UAC Bypass','Kerberoast','Kernel Exploit','Token Impersonation','WriteDACL','DCSync'].map(t => (
            <span key={t} className="text-[10px] bg-slate-700 text-slate-300 border border-slate-700 px-2 py-0.5 rounded-full">{t}</span>
          ))}
        </div>
        <div className="space-y-2">
          {escalationSteps.map((s, i) => (
            <button key={s.step} onClick={() => setExpandedStep(expandedStep === i ? null : i)}
              className="w-full flex gap-3 items-start text-left hover:bg-slate-700/40 rounded-lg p-1.5 transition-colors group">
              <div className="flex flex-col items-center shrink-0">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white
                  ${s.level === 'CRITICAL' ? 'bg-red-900/200' : s.level === 'HIGH' ? 'bg-orange-900/200' : s.level === 'MEDIUM' ? 'bg-yellow-900/200' : 'bg-blue-400'}`}>
                  {i + 1}
                </div>
                {i < escalationSteps.length - 1 && <div className="w-px h-4 bg-slate-200 mt-0.5" />}
              </div>
              <div className="flex-1 pb-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-semibold text-white">{s.step}</span>
                  <SeverityBadge level={s.level} />
                  <span className="text-[10px] font-mono text-indigo-300">{s.mitre}</span>
                  <ChevronRight className={`w-3.5 h-3.5 text-slate-400 ml-auto transition-transform ${expandedStep === i ? 'rotate-90' : ''}`} />
                </div>
                {expandedStep === i && (
                  <p className="text-[11px] text-slate-400 mt-1 bg-slate-700/40 px-2 py-1.5 rounded border border-slate-700">{s.desc}</p>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── 9. Identity & Lateral Movement ── */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
        <div className="flex items-center gap-2 mb-1">
          <Users className="w-4 h-4 text-purple-600" />
          <h3 className="font-semibold text-white text-sm">Identity &amp; Lateral Movement</h3>
        </div>
        <p className="text-[11px] text-slate-400 mb-3">AD identities exposed on this path — group memberships, GPO risks, and escalation potential</p>
        <div className="space-y-2">
          {[
            { name: 'svc_backup',               type: 'Service Account',      risk: 'CRITICAL', badge: 'WriteDACL / Kerberoastable', detail: 'Kerberoastable SPN with weak 8-char password · WriteDACL on AdminSDHolder' },
            { name: 'admin.jones',               type: 'Domain User',           risk: 'CRITICAL', badge: 'Domain Admin',               detail: 'Member of Domain Admins · GPO full-control · Active login sessions on Tier-0' },
            { name: 'Unrestricted PowerShell GPO',type: 'Group Policy Object',  risk: 'HIGH',     badge: 'GPO Exposure',               detail: 'PowerShell execution unrestricted via GPO — allows lateral tool deployment' },
            { name: 'Unconstrained Delegation',  type: 'Kerberos Risk',         risk: 'CRITICAL', badge: 'Kerberos / TGT Capture',     detail: 'svc_backup permitted for unconstrained delegation — TGT of any authenticating user captured' },
          ].map(id => (
            <div key={id.name} className="border border-slate-700 rounded-lg p-3 flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-purple-900/20 border border-purple-700/50 flex items-center justify-center shrink-0">
                <User className="w-3.5 h-3.5 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <span className="text-xs font-semibold text-white font-mono">{id.name}</span>
                  <span className="text-[9px] bg-slate-700 text-slate-300 border border-slate-700 px-1.5 py-0.5 rounded-full">{id.type}</span>
                  <span className="text-[9px] bg-purple-900/20 text-purple-700 border border-purple-700/50 px-1.5 py-0.5 rounded-full">{id.badge}</span>
                </div>
                <div className="text-[10px] text-slate-400">{id.detail}</div>
              </div>
              <SeverityBadge level={id.risk} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Ready to Remediate? Decision Gate ─────────────────────────── */}
      <div className="bg-slate-800 rounded-lg border-2 border-green-700/50 p-5">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 rounded-full bg-green-900/30 border-2 border-green-600/50 flex items-center justify-center">
            <Wrench className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base mb-1">Ready to Remediate?</h3>
            <p className="text-[11px] text-slate-400 max-w-md">
              You've traced the full attack chain, reviewed shared resources, contextual risk scores, and toxic combinations.
              Take action on <span className="font-semibold text-slate-200">AP-{selectedPath.id}</span> now.
            </p>
          </div>
          <button
            onClick={onNavigateToRemediate}
            className="flex items-center gap-2 bg-green-600 text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:bg-green-700 transition-colors shadow-sm"
          >
            <ArrowRight className="w-4 h-4" />
            Click "Remediate" → Tab 03
          </button>
          <div className="flex items-center gap-2 text-[10px] text-teal-300 bg-teal-900/20 border border-teal-700/50 px-3 py-1.5 rounded-full">
            <CheckCircle className="w-3.5 h-3.5 text-teal-300 shrink-0" />
            Path Risk Understood · Actions Queued
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Remediate Tab ────────────────────────────────────────────────────────────
function RemediateTab({ selectedPath, onSelectPath, onOpenResource }) {
  const [actionStates, setActionStates] = useState({})
  const [roiTooltip,   setRoiTooltip]   = useState(null)   // key of action whose tooltip is open

  const toggleAction = (key, newState) => {
    setActionStates(prev => ({ ...prev, [key]: prev[key] === newState ? null : newState }))
  }

  const actionCount = selectedPath ? selectedPath.remediation.length : 12
  const avgRoi = selectedPath
    ? Math.round(selectedPath.remediation.reduce((s, a) => s + computeRoi(a).score, 0) / selectedPath.remediation.length)
    : 64

  const summaryStats = [
    { label: 'Toxic Combos',     value: String(TOXIC_COMBOS.length),                            color: 'text-red-600'    },
    { label: 'Score Elevated',   value: String(SCORING_ITEMS.filter(s => s.positive).length),   color: 'text-orange-500' },
    { label: 'ROI Score',        value: String(avgRoi),                                          color: 'text-green-500'  },
  ]

  const allActions = selectedPath
    ? selectedPath.remediation
    : ATTACK_PATHS.flatMap((ap) =>
        ap.remediation.map(r => ({ ...r, pathId: ap.id, pathTitle: ap.title }))
      ).filter((r, i, arr) => arr.findIndex(x => x.action === r.action) === i).slice(0, 12)

  const priorityColor = {
    CRITICAL: { bg: 'bg-red-900/20',    border: 'border-red-700/50',    badge: 'bg-red-900/30 text-red-300',       dot: 'bg-red-900/200'    },
    HIGH:     { bg: 'bg-orange-900/20', border: 'border-orange-700/50', badge: 'bg-orange-900/30 text-orange-300', dot: 'bg-orange-900/200' },
    MEDIUM:   { bg: 'bg-yellow-900/20', border: 'border-yellow-700/50', badge: 'bg-yellow-900/30 text-yellow-300', dot: 'bg-yellow-900/200' },
    LOW:      { bg: 'bg-green-900/20',  border: 'border-green-700/50',  badge: 'bg-green-900/30 text-green-400',   dot: 'bg-green-900/200'  },
  }

  return (
    <div className="space-y-5">
      {/* Stats — 3 cards matching diagram */}
      <div className="grid grid-cols-3 gap-3">
        {summaryStats.map(s => (
          <div key={s.label} className="bg-slate-800 rounded-lg border border-slate-700 p-3 text-center">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-[11px] text-slate-400 mt-0.5 leading-tight">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recommended Remediation Actions */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-indigo-400" />
            <h3 className="font-semibold text-white text-sm">
              Recommended Remediation Actions
              {selectedPath && <span className="font-normal text-slate-400 ml-1">— {selectedPath.title}</span>}
            </h3>
          </div>
          <div className="flex gap-2 text-[10px]">
            <span className="flex items-center gap-1 text-slate-400"><span className="w-2 h-2 rounded-full bg-red-900/200 inline-block" />Critical</span>
            <span className="flex items-center gap-1 text-slate-400"><span className="w-2 h-2 rounded-full bg-orange-900/200 inline-block" />High</span>
            <span className="flex items-center gap-1 text-slate-400"><span className="w-2 h-2 rounded-full bg-yellow-900/200 inline-block" />Medium</span>
          </div>
        </div>
        <p className="text-[11px] text-slate-400 mb-3">
          Prioritized remediation steps ranked by risk impact. Actions on shared resources reduce risk across multiple paths simultaneously.
        </p>

        <div className="space-y-2">
          {allActions.map((action, idx) => {
            const c   = priorityColor[action.priority] || priorityColor.LOW
            const key = `${action.action}-${idx}`
            const state = actionStates[key]

            // Cross-path impact: how many paths contain the resource this action targets?
            const affectedPaths = action.resourceId
              ? getPathsByResourceId(action.resourceId)
              : []
            const crossPathCount = affectedPaths.length

            const { score: roiScore, breakdown: roiB } = computeRoi(action)
            const isRoiOpen  = roiTooltip === key
            const scoreColor = roiScore >= 70 ? 'text-green-400' : roiScore >= 40 ? 'text-orange-500' : 'text-slate-400'
            const borderColor = roiScore >= 70 ? 'border-green-600/50' : roiScore >= 40 ? 'border-orange-600/50' : 'border-slate-700'

            return (
              <div key={key} className={`border ${c.border} ${c.bg} rounded-lg overflow-hidden`}>
                {/* ── Main action row ── */}
                <div className="p-3 flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${c.dot}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${c.badge}`}>{action.priority}</span>
                      {action.pathId && (
                        <span className="text-[10px] text-slate-400 font-mono">CID {action.pathId}</span>
                      )}
                    </div>
                    <div className="text-[12px] font-medium text-white leading-tight">{action.action}</div>
                    <div className="flex flex-wrap gap-3 mt-1 text-[10px] text-slate-400">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> ETA: {action.eta}</span>
                      <span className="flex items-center gap-1"><Wrench className="w-3 h-3" /> Effort: {action.effort}</span>
                      {crossPathCount > 1 && (
                        <button
                          onClick={() => onOpenResource(action.resourceId)}
                          className="flex items-center gap-1 text-teal-400 hover:text-teal-200 transition-colors"
                        >
                          <Link2 className="w-3 h-3" />
                          Affects {crossPathCount} paths — click to view
                        </button>
                      )}
                      {state === 'detail'      && <span className="text-sky-400 font-medium flex items-center gap-1"><Eye className="w-3 h-3" />Viewed Detail</span>}
                      {state === 'suppressed' && <span className="text-slate-400 font-medium flex items-center gap-1"><EyeOff className="w-3 h-3" />Suppressed</span>}
                      {state === 'ticket'     && <span className="text-blue-400 font-medium flex items-center gap-1"><Ticket className="w-3 h-3" />Ticket Created</span>}
                    </div>
                  </div>
                  {/* ROI badge — click to expand/collapse breakdown */}
                  <button
                    onClick={() => setRoiTooltip(isRoiOpen ? null : key)}
                    className={`shrink-0 text-center px-2 py-1 rounded-lg border ${borderColor} bg-slate-700/40 min-w-[52px] cursor-pointer`}
                  >
                    <div className={`text-sm font-bold leading-none ${scoreColor}`}>{roiScore}</div>
                    <div className="text-[9px] text-slate-400 mt-0.5">ROI {isRoiOpen ? '▲' : '▼'}</div>
                  </button>
                <div className="flex gap-1.5 shrink-0">
                  <button
                    onClick={() => toggleAction(key, 'detail')}
                    className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded border transition-colors
                      ${state === 'detail' ? 'bg-sky-600 text-white border-sky-600' : 'border-sky-600 text-sky-400 hover:bg-sky-900/20'}`}
                  >
                    <Eye className="w-3 h-3" /> More Detail
                  </button>
                  <button
                    onClick={() => toggleAction(key, 'ticket')}
                    className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded border transition-colors
                      ${state === 'ticket' ? 'bg-blue-600 text-white border-blue-600' : 'border-blue-500 text-blue-300 hover:bg-blue-900/20'}`}
                  >
                    <Ticket className="w-3 h-3" /> Create Ticket
                  </button>
                  <button
                    onClick={() => toggleAction(key, 'suppressed')}
                    className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded border transition-colors
                      ${state === 'suppressed' ? 'bg-slate-400 text-white border-slate-400' : 'border-slate-600 text-slate-400 hover:bg-slate-700/40'}`}
                  >
                    <EyeOff className="w-3 h-3" /> Suppress
                  </button>
                </div>
                </div>{/* end main action row */}

                {/* ── ROI Breakdown panel (inline, no z-index needed) ── */}
                {isRoiOpen && (
                  <div className="border-t border-slate-700 bg-slate-900 text-white p-3 text-[10px] leading-relaxed">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-slate-100 text-[11px] flex items-center gap-1.5">
                        📊 ROI Score Breakdown
                      </span>
                      <button
                        onClick={() => setRoiTooltip(null)}
                        className="text-slate-400 hover:text-white text-xs"
                      >✕ close</button>
                    </div>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                      {/* Left col — Risk Reduction Value */}
                      <div>
                        <div className="text-slate-400 uppercase tracking-wide text-[9px] font-semibold mb-1">Risk Reduction Value</div>
                        <div className="space-y-0.5">
                          <div className="flex justify-between"><span className="text-slate-300">Severity ({action.priority})</span><span className="font-mono text-slate-100">+{roiB.severityPts} pts</span></div>
                          <div className="flex justify-between"><span className="text-slate-300">Path multiplier ({roiB.pathCount} paths)</span><span className="font-mono text-slate-100">×{roiB.pathMultiplier}</span></div>
                          {roiB.toxicBonus > 0 && <div className="flex justify-between"><span className="text-red-300">Toxic combo</span><span className="font-mono text-red-200">+{roiB.toxicBonus} pts</span></div>}
                          {roiB.elevatedBonus > 0 && <div className="flex justify-between"><span className="text-orange-300">Score elevated</span><span className="font-mono text-orange-200">+{roiB.elevatedBonus} pts</span></div>}
                          <div className="flex justify-between border-t border-slate-700 pt-0.5 mt-0.5 font-semibold"><span className="text-slate-200">Total RRV</span><span className="font-mono text-white">{roiB.rrv} pts</span></div>
                        </div>
                      </div>
                      {/* Right col — Remediation Cost + Final Score */}
                      <div>
                        <div className="text-slate-400 uppercase tracking-wide text-[9px] font-semibold mb-1">Remediation Cost</div>
                        <div className="space-y-0.5 mb-2">
                          <div className="flex justify-between"><span className="text-slate-300">Effort ({action.effort})</span><span className="font-mono text-slate-100">weight {roiB.effortW}</span></div>
                          <div className="flex justify-between"><span className="text-slate-300">ETA ({action.eta})</span><span className="font-mono text-slate-100">weight {roiB.etaW}</span></div>
                          <div className="flex justify-between border-t border-slate-700 pt-0.5 mt-0.5 font-semibold"><span className="text-slate-200">Total Cost</span><span className="font-mono text-white">{roiB.cost}</span></div>
                        </div>
                        <div className="border-t border-slate-600 pt-1.5 space-y-0.5">
                          <div className="flex justify-between"><span className="text-slate-300">Raw ({roiB.rrv} ÷ {roiB.cost})</span><span className="font-mono text-slate-100">{roiB.raw}</span></div>
                          <div className="flex justify-between"><span className="text-slate-300">Normalised (÷110 ×100)</span><span className={`font-bold font-mono text-[13px] ${scoreColor}`}>{roiScore}</span></div>
                        </div>
                      </div>
                    </div>
                    <div className="text-slate-400 italic text-[9px] mt-2 pt-1.5 border-t border-slate-700">
                      Max score = CRITICAL (40) × 2 paths + toxic bonus (20) + elevated bonus (10), cost = 1 (Low effort, ≤4h ETA)
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function AttackPathInsights() {
  const [activeTab,       setActiveTab]       = useState('discover')
  const [selectedPath,    setSelectedPath]    = useState(null)
  const [resourcePanelId, setResourcePanelId] = useState(null)  // null = panel closed

  const etmNavItems = [
    { label: 'Add-ons',              icon: Plus },
    { label: 'Cyber Risk Assistant', icon: Bot },
    { label: 'Home',                 icon: Home },
    { label: 'Dashboard',            icon: LayoutDashboard },
    { label: 'Inventory',            icon: Package },
    { label: 'Risk Management',      icon: ShieldAlert },
    { label: 'Attack Path',          icon: GitBranch, active: true },
  ]

  const tabs = [
    { id: 'discover',  label: '01  Discover',  icon: Eye,    desc: 'Browse & filter attack paths' },
    { id: 'analyze',   label: '02  Analyze',   icon: Target, desc: 'Drill into a specific path'  },
    { id: 'remediate', label: '03  Remediate', icon: Wrench, desc: 'Recommended remediation actions' },
  ]

  const handleSelectPath = (path) => {
    setSelectedPath(path)
    setActiveTab('analyze')
  }

  const handleOpenResource = (resourceId) => {
    setResourcePanelId(resourceId)
  }

  const handleCloseResource = () => {
    setResourcePanelId(null)
  }

  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden">
      <div className="flex flex-col flex-1 overflow-hidden">

        {/* Qualys top header */}
        <header className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded bg-[#E5002B] flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-white">
              Qualys
              <span className="font-normal text-slate-400 ml-1">Enterprise TruRisk™ Platform</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button className="p-1.5 rounded hover:bg-slate-700 text-slate-400"><Search className="w-4 h-4" /></button>
            <button className="p-1.5 rounded hover:bg-slate-700 text-slate-400"><Bell className="w-4 h-4" /></button>
            <button className="p-1.5 rounded hover:bg-slate-700 text-slate-400"><Settings className="w-4 h-4" /></button>
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
                    <GitBranch className="w-5 h-5 text-indigo-400" />
                    <h1 className="text-lg font-bold text-white">Attack Path Insights</h1>
                  </div>
                  <p className="text-[11px] text-slate-400">Qualys TotalCloud — Adversarial mapping, analysis &amp; risk-correlated remediation</p>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-slate-700 mb-5 gap-1">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px rounded-t-lg
                      ${activeTab === tab.id
                        ? 'border-indigo-600 text-indigo-400 bg-indigo-900/20'
                        : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-700/40'}`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                    {tab.id === 'analyze' && selectedPath && (
                      <span className="text-[10px] bg-indigo-800/40 text-indigo-300 px-1.5 py-0.5 rounded-full font-semibold">
                        CID {selectedPath.id}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              {activeTab === 'discover'  && <DiscoverTab onSelectPath={handleSelectPath} onOpenResource={handleOpenResource} />}
              {activeTab === 'analyze'   && <AnalyzeTab  selectedPath={selectedPath} onSelectPath={(p) => { setSelectedPath(p) }} onOpenResource={handleOpenResource} onNavigateToRemediate={() => setActiveTab('remediate')} />}
              {activeTab === 'remediate' && <RemediateTab selectedPath={selectedPath} onSelectPath={handleSelectPath} onOpenResource={handleOpenResource} />}
            </div>
          </main>
        </div>
      </div>

      {/* Resource Detail Panel — rendered at root level so it overlays the full app */}
      {resourcePanelId && (
        <ResourceDetailPanel
          resourceId={resourcePanelId}
          onClose={handleCloseResource}
          onSelectPath={handleSelectPath}
        />
      )}
    </div>
  )
}
