import { useState } from 'react'
import {
  Search, Bell, Settings, Shield, AlertTriangle, ArrowRight,
  Database, Users, Bot, Plus, Home, LayoutDashboard, Package,
  GitBranch, ChevronRight, Filter, Clock, Target, Zap, Eye,
  Wrench, CheckCircle, XCircle, AlertCircle, ShieldAlert,
  TrendingUp, RefreshCw, Ticket, EyeOff, User, Server, Cloud,
  Link2, X, Globe, Activity, Cpu, Key, Sliders, Wifi, Layers,
  Tag, Settings2
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
  // ── New resources for Path A: Cloud-to-Core Infrastructure Pivot ─────────────
  { id: 'res-saas-tenant',    name: 'saas-tenant-acme.okta.com',     type: 'SaaS Application',       severity: 'HIGH',     exploitability: 'High',     os: 'Okta / Microsoft 365 (SaaS)',     criticality: 'High',             ports: '443',           services: 'SaaS IdP — MFA disabled on 12 accounts (Qualys SaaSDR)' },
  { id: 'res-cloud-mgmt-a',   name: 'aws-mgmt-console-acme-prod',    type: 'Cloud Console',          severity: 'CRITICAL', exploitability: 'Critical', os: 'AWS Management Console',          criticality: 'Mission Critical', ports: '443',           services: 'AWS Console — Service Account Key hardcoded in GitHub repo (Qualys CSPM)' },
  { id: 'res-ec2-pwnkit',     name: 'ec2-linux-pwnkit-prod-01',      type: 'Server',                 severity: 'CRITICAL', exploitability: 'Critical', os: 'Ubuntu 20.04 LTS (polkit 0.105)', criticality: 'High',             ports: '22, 443, 8080', services: 'Linux App Server — CVE-2021-4034 PwnKit unpatched (Qualys VMDR)' },
  { id: 'res-always-on-vpn',  name: 'vpn-always-on-cloud-vpc-01',    type: 'VPN',                    severity: 'HIGH',     exploitability: 'High',     os: 'Cisco AnyConnect / AWS VPN',      criticality: 'High',             ports: '443, 1194',     services: 'Always-On Cloud VPN — unrestricted corporate routing (Qualys CSAM)' },
  { id: 'res-onprem-sql',     name: 'sql-srv-onprem-pii-01',         type: 'Database',               severity: 'CRITICAL', exploitability: 'High',     os: 'SQL Server 2019 / Windows',       criticality: 'Mission Critical', ports: '1433',          services: 'On-Prem SQL Server — PII store, Public role misconfiguration (Qualys PC)' },
  // ── New resources for Path B: Shadow-IT API Breach ───────────────────────────
  { id: 'res-shadow-subdomain', name: 'uat-hidden.acme-corp.io',     type: 'Web Asset',              severity: 'HIGH',     exploitability: 'High',     os: 'Ubuntu 22.04 (Shadow UAT)',       criticality: 'Low',              ports: '80, 443',       services: 'Unmanaged UAT environment — not in asset inventory (Qualys EASM)' },
  { id: 'res-shadow-api',       name: 'api-uat.acme-corp.io/v2',     type: 'API Gateway',            severity: 'HIGH',     exploitability: 'High',     os: 'Node.js 18 / Express',            criticality: 'Medium',           ports: '443, 3000',     services: 'Undocumented API — BOLA, no object-level authorization (Qualys API Security)' },
  { id: 'res-web-shell',        name: 'webserver-uat-01',             type: 'Web Server',             severity: 'CRITICAL', exploitability: 'Critical', os: 'Nginx 1.21 / PHP 8.1',            criticality: 'High',             ports: '80, 443',       services: 'UAT Web Server — web shell persisted, no FIM deployed (Qualys FIM)' },
  { id: 'res-container-host',   name: 'container-host-uat-01',       type: 'Container Orchestration',severity: 'CRITICAL', exploitability: 'Critical', os: 'Docker 24 / runc (no seccomp)',    criticality: 'Mission Critical', ports: '2375, 8080',    services: 'Container Host — privileged runtime, no Pod Security Admission (Qualys Container Security)' },
  // ── New resources for Path C: Supply Chain & Hybrid Identity Pivot ───────────
  { id: 'res-vuln-lib',         name: 'npm:log4j-dep@2.14.1',        type: 'Software Package',       severity: 'CRITICAL', exploitability: 'Critical', os: 'npm Registry (supply chain)',     criticality: 'Mission Critical', ports: 'N/A',           services: 'Vulnerable npm Package — RCE via transitive dependency (Qualys VMDR SCA)' },
  { id: 'res-cicd-pipeline',    name: 'jenkins-cicd-pipeline-sc',    type: 'CI/CD',                  severity: 'HIGH',     exploitability: 'High',     os: 'Jenkins 2.414 LTS',               criticality: 'High',             ports: '8080, 443',     services: 'CI/CD Pipeline — no SCA scan, no secret detection gate (Qualys TotalCloud)' },
  { id: 'res-prod-k8s',         name: 'prod-k8s-cluster-eks-01',     type: 'Container Orchestration',severity: 'CRITICAL', exploitability: 'Critical', os: 'Kubernetes 1.29 / EKS',           criticality: 'Mission Critical', ports: '6443, 10250',   services: 'Production EKS Cluster — no admission controller, vulnerable runtime (Qualys Container Security)' },
  { id: 'res-pod-iam',          name: 'iam-role-pod-write-prod',     type: 'IAM Role',               severity: 'CRITICAL', exploitability: 'Critical', os: 'AWS IAM (IRSA / IMDS)',           criticality: 'Mission Critical', ports: 'N/A',           services: 'Pod-attached IAM Role — Write permissions on prod, IMDS reachable (Qualys CSPM CIEM)' },
  { id: 'res-hybrid-ad',        name: 'entra-connect-sync-01',       type: 'Identity Federation',    severity: 'CRITICAL', exploitability: 'High',     os: 'Microsoft Entra ID Connect 2.x',  criticality: 'Mission Critical', ports: '443, 9090',     services: 'Entra ID Connect — password writeback enabled, full on-prem AD sync (Qualys PC)' },
  // ── New resources for Path D: Identity Vault Compromise ──────────────────────
  { id: 'res-bt-appliance',   name: 'beyondtrust-rs-appliance-01',  type: 'PAM Appliance',          severity: 'CRITICAL', exploitability: 'Critical', os: 'BeyondTrust RS 23.x (internet-facing)', criticality: 'Mission Critical', ports: '443, 8080',     services: 'BeyondTrust Remote Support — CVE-2026-1731 pre-auth RCE (Qualys EASM + VMDR)' },
  { id: 'res-cred-vault',     name: 'pam-credential-vault-prod-01', type: 'Credential Vault',       severity: 'CRITICAL', exploitability: 'Critical', os: 'BeyondTrust Vault / CyberArk',         criticality: 'Mission Critical', ports: '443, 8443',     services: 'PAM Credential Vault — all privileged account passwords stored (Qualys CSAM + PC)' },
  { id: 'res-crown-dbs',      name: 'core-dbs-backup-prod-cluster', type: 'Backup System',          severity: 'CRITICAL', exploitability: 'High',     os: 'Windows Server 2022 / SQL + Veeam',    criticality: 'Mission Critical', ports: '1433, 9392',    services: 'Core Databases + Backup Systems — ransomware / exfiltration target (Qualys VMDR + EDR)' },
  // ── New resources for Path 6003: VPN Brute-Force → AD Takeover ───────────────
  { id: 'res-win-server-unpatched', name: 'win-srv-2019-legacy-01',      type: 'Server',                 severity: 'CRITICAL', exploitability: 'Critical', os: 'Windows Server 2019 (unpatched)',          criticality: 'High',             ports: '445, 3389, 135',  services: 'Legacy Windows Server — MS17-010 (EternalBlue) unpatched, NTLMv1 enabled (Qualys VMDR)' },
  // ── New resources for Path 7004: Shadow API RCE → Container Escape → AD Takeover
  { id: 'res-struts-appserver',     name: 'app-srv-struts-uat-01',       type: 'Web Server',             severity: 'CRITICAL', exploitability: 'Critical', os: 'Apache Struts 2.5.30 / Tomcat 9',         criticality: 'High',             ports: '8080, 443',       services: 'Apache Struts App — CVE-2023-50164 file upload RCE (Qualys VMDR + FIM)' },
  { id: 'res-runc-container',       name: 'container-runc-uat-01',       type: 'Container Orchestration',severity: 'CRITICAL', exploitability: 'Critical', os: 'Docker 20.10 / runc 1.0.0-rc10',          criticality: 'Mission Critical', ports: '2375, 8080',      services: 'Container Runtime — CVE-2019-5736 runc escape, host binary overwrite (Qualys Container Security)' },
  { id: 'res-host-root',            name: 'container-host-root-uat-01',  type: 'Server',                 severity: 'CRITICAL', exploitability: 'Critical', os: 'Ubuntu 22.04 LTS / Linux 5.15',           criticality: 'Mission Critical', ports: '22, 445',         services: 'Container Host — root access, LSASS/Kerberos credential material in memory (Qualys Multi-Vector EDR)' },
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
  // ── Path 6003: VPN Brute-Force → AD Takeover ────────────────────────────────
  {
    id: 6003,
    title: 'VPN Brute-Force — Unpatched Windows Host to Active Directory Takeover',
    severity: 'CRITICAL',
    entry: 'VPN Gateway (Weak MFA / SMS OTP)',
    target: 'Domain Controller (Tier-0)',
    hops: 6, gaps: 5, score: 9.5,
    resourceIds: ['res-vpn-gateway', 'res-win-server-unpatched', 'res-workstation', 'res-domain-ctrl'],
    mitre: 'T1110 → T1068 → T1003.001 → T1550.002 → T1003.006',
    path: 'VPN Gateway → Windows Server → Local Admin → NTLM Hash → Workstation → Domain Controller',
    status: 'open',
    flowNodes: [
      { label: 'VPN Gateway',       icon: '🔐', severity: null,       isStart: true,                                   resourceId: 'res-vpn-gateway' },
      { label: 'Windows Server',    icon: '🖥️', severity: 'CRITICAL', edge: 'Brute Force Login',                      resourceId: 'res-win-server-unpatched' },
      { label: 'Local Admin',       icon: '👤', severity: 'HIGH',     edge: 'MS17-010 EternalBlue' },
      { label: 'NTLM Hash',         icon: '🔑', severity: 'CRITICAL', edge: 'LSASS Dump (Mimikatz)' },
      { label: 'Workstation',       icon: '💻', severity: 'HIGH',     edge: 'Pass-the-Hash',                           resourceId: 'res-workstation' },
      { label: 'Domain Controller', icon: null,  severity: 'CRITICAL', edge: 'DCSync Attack',                          resourceId: 'res-domain-ctrl', isCrown: true },
    ],
    gaps_detail: [
      { label: 'Weak VPN MFA:',         value: 'VPN using SMS-based OTP — bypassable via SIM-swap or SS7 interception. No FIDO2 or certificate-based authentication enforced for remote access (Qualys VMDR + Policy Compliance)' },
      { label: 'Shared Local Admin:',   value: 'Identical local administrator password across all Windows servers — compromise of one host yields lateral movement to all peers via Pass-the-Hash (Qualys Policy Compliance)' },
      { label: 'MS17-010 Unpatched:',   value: 'EternalBlue vulnerability (CVE-2017-0144) unpatched on internal Windows Server 2019 — unauthenticated RCE allows attacker to elevate to SYSTEM without credentials (Qualys VMDR)' },
      { label: 'NTLMv1 Domain-Wide:',   value: 'NTLMv1 enabled across all domain controllers — harvested NTLM hashes cracked offline in minutes using commodity GPU hardware (Qualys Policy Compliance)' },
      { label: 'No Credential Guard:',  value: 'Credential Guard not deployed on workstations — LSASS memory accessible to Mimikatz, enabling full NTLM hash extraction without any detection (Qualys Multi-Vector EDR)' },
    ],
    remediation: [
      { priority: 'CRITICAL', action: 'Replace SMS OTP with FIDO2 phishing-resistant MFA (hardware security keys) for all VPN identities — block all legacy auth protocols at the VPN gateway (Qualys Policy Compliance)',                                  effort: 'Medium', eta: '3 days',  roi: 9.2, resourceId: 'res-vpn-gateway' },
      { priority: 'CRITICAL', action: 'Deploy Microsoft LAPS (Local Administrator Password Solution) — enforce unique, auto-rotating local admin passwords on every Windows host to eliminate lateral Pass-the-Hash movement (Qualys Policy Compliance)',    effort: 'Low',    eta: '1 day',   roi: 9.5, resourceId: 'res-win-server-unpatched' },
      { priority: 'CRITICAL', action: 'Emergency patch CVE-2017-0144 (MS17-010 EternalBlue) across all Windows servers via Qualys VMDR one-click patch job — prioritise internet-accessible and internal hosts',                                           effort: 'Medium', eta: '2 days',  roi: 8.8, resourceId: 'res-win-server-unpatched' },
      { priority: 'HIGH',     action: 'Disable NTLMv1 domain-wide via Group Policy — enforce NTLMv2 minimum and enable LDAP signing + channel binding on all domain controllers (Qualys Policy Compliance)',                                               effort: 'Low',    eta: '4 hours', roi: 8.1, resourceId: 'res-domain-ctrl' },
      { priority: 'HIGH',     action: 'Enable Windows Credential Guard on all domain-joined workstations — prevents LSASS memory access by Mimikatz and similar credential dumping tools (Qualys Policy Compliance)',                                       effort: 'Medium', eta: '3 days',  roi: 7.3, resourceId: 'res-workstation' },
      { priority: 'HIGH',     action: 'Add all Tier-0 privileged accounts (Domain Admins, Schema Admins) to the Protected Users security group — prevents NTLM authentication and credential caching for highest-value identities (Qualys Policy Compliance)', effort: 'Low',  eta: '2 hours', roi: 8.6, resourceId: 'res-domain-ctrl' },
      { priority: 'MEDIUM',   action: 'Enrol all privileged identities in a PAM solution with just-in-time access — replace standing Domain Admin privileges with time-limited, session-recorded elevations (Qualys CSAM)',                                effort: 'High',   eta: '1 week',  roi: 4.1, resourceId: null },
    ],
  },
  // ── 3 new cross-domain attack paths (displayed first) ────────────────────────
  {
    id: 7001,
    title: 'Cloud-to-Core Infrastructure Pivot — SaaS Tenant to On-Prem PII Database',
    severity: 'CRITICAL',
    entry: 'SaaS Tenant (MFA Disabled)',
    target: 'On-Prem SQL Server (PII)',
    hops: 5, gaps: 4, score: 9.6,
    resourceIds: ['res-saas-tenant', 'res-cloud-mgmt-a', 'res-ec2-pwnkit', 'res-always-on-vpn', 'res-onprem-sql'],
    mitre: 'T1078.004 → T1552.001 → T1068 → T1021.007 → T1048',
    path: 'SaaS Tenant → Cloud Mgmt Console → EC2 Instance (PwnKit) → Always-On VPN → On-Prem SQL Server',
    status: 'open',
    flowNodes: [
      { label: 'SaaS Tenant',        icon: '☁️', severity: null,       isStart: true,                   resourceId: 'res-saas-tenant' },
      { label: 'Cloud Mgmt Console', icon: '🖥️', severity: 'CRITICAL', edge: 'Hardcoded SA Key',        resourceId: 'res-cloud-mgmt-a' },
      { label: 'EC2 Linux Instance', icon: '🖥️', severity: 'CRITICAL', edge: 'PwnKit PrivEsc',          resourceId: 'res-ec2-pwnkit' },
      { label: 'Always-On VPN',      icon: '🔐', severity: 'HIGH',     edge: 'VPN Tunnel Pivot',        resourceId: 'res-always-on-vpn' },
      { label: 'On-Prem SQL Server', icon: null,  severity: 'CRITICAL', edge: 'Public DB Permissions',  resourceId: 'res-onprem-sql', isCrown: true },
    ],
    gaps_detail: [
      { label: 'MFA Disabled (SaaS):',    value: 'SaaS tenant user account has MFA disabled — single-factor phishing or credential stuffing sufficient for initial access (Qualys SaaSDR)' },
      { label: 'Hardcoded SA Key:',       value: 'Service Account Key found in public GitHub repository — no key rotation or secret scanning policy enforced (Qualys CSPM)' },
      { label: 'PwnKit Unpatched:',       value: 'EC2 instance running vulnerable polkit version (CVE-2021-4034) — local privilege escalation to root in seconds (Qualys VMDR)' },
      { label: 'Unrestricted VPN Scope:', value: 'Always-On cloud VPC VPN has unrestricted routing — attacker scans entire corporate network from cloud instance (Qualys CSAM)' },
      { label: 'Chained Path:',          value: 'SaaS MFA Bypass → Hardcoded SA Key → EC2 Root (PwnKit) → VPN Internal Pivot → On-Prem SQL PII Exfiltration' },
    ],
    remediation: [
      { priority: 'CRITICAL', action: 'Enforce MFA on all SaaS tenant accounts via Conditional Access — block legacy auth protocols (Qualys SaaSDR)',                         effort: 'Low',    eta: '2 hours', roi: 9.6, resourceId: 'res-saas-tenant' },
      { priority: 'CRITICAL', action: 'Immediately rotate and revoke exposed Service Account Keys — remove from all repositories and enable secret scanning (Qualys CSPM)', effort: 'Low',    eta: '30 mins', roi: 9.8, resourceId: 'res-cloud-mgmt-a' },
      { priority: 'HIGH',     action: 'Patch CVE-2021-4034 (PwnKit) across all EC2 Linux instances via Qualys VMDR patch management',                                       effort: 'Medium', eta: '1 day',   roi: 7.1, resourceId: 'res-ec2-pwnkit' },
      { priority: 'HIGH',     action: 'Apply VPN network segmentation — restrict cloud-to-corporate routing to required services only (Qualys CSAM)',                       effort: 'Medium', eta: '3 days',  roi: 5.4, resourceId: 'res-always-on-vpn' },
      { priority: 'MEDIUM',   action: 'Enforce least-privilege SQL Server permissions — remove Public role and audit all database access grants (Qualys Policy Compliance)', effort: 'Medium', eta: '2 days',  roi: 3.9, resourceId: 'res-onprem-sql' },
    ],
  },
  {
    id: 7002,
    title: 'Shadow-IT API Breach — Unmanaged Asset to Active Directory Takeover',
    severity: 'CRITICAL',
    entry: 'Shadow Subdomain (EASM Discovery)',
    target: 'Active Directory',
    hops: 5, gaps: 4, score: 9.4,
    resourceIds: ['res-shadow-subdomain', 'res-shadow-api', 'res-web-shell', 'res-container-host', 'res-domain-ctrl'],
    mitre: 'T1590.001 → T1190 → T1505.003 → T1611 → T1003.001',
    path: 'Shadow Subdomain → BOLA API → Web Shell → Container Escape → NTLM Hash Dump → AD Domain Admin',
    status: 'open',
    flowNodes: [
      { label: 'Shadow Subdomain',    icon: '🌐', severity: null,       isStart: true,                   resourceId: 'res-shadow-subdomain' },
      { label: 'Shadow API Endpoint', icon: '🖥️', severity: 'HIGH',     edge: 'BOLA Exploitation',       resourceId: 'res-shadow-api' },
      { label: 'Web Shell',           icon: '🌐', severity: 'CRITICAL', edge: 'Script Injection',        resourceId: 'res-web-shell' },
      { label: 'Container Host',      icon: '☸️', severity: 'CRITICAL', edge: 'Container Escape',        resourceId: 'res-container-host' },
      { label: 'Active Directory',    icon: null,  severity: 'CRITICAL', edge: 'NTLM Hash + DA Abuse',   resourceId: 'res-domain-ctrl', isCrown: true },
    ],
    gaps_detail: [
      { label: 'Unmanaged Asset:',    value: 'UAT subdomain not in asset inventory — discovered via DNS brute-forcing with no security controls or authentication (Qualys EASM)' },
      { label: 'BOLA Vulnerability:', value: 'Shadow API has no object-level authorization — attacker accesses any user\'s data by modifying object IDs in API requests (Qualys API Security)' },
      { label: 'No FIM on UAT:',      value: 'Web shell written to server filesystem without triggering alerts — File Integrity Monitoring not deployed on UAT environment (Qualys FIM)' },
      { label: 'Insecure Container:', value: 'Container running with privileged flag and host namespace access — escape to underlying host is trivial (Qualys Container Security)' },
      { label: 'Chained Path:',       value: 'DNS Brute-Force → BOLA API Exploit → Web Shell Persistence → Container Escape → NTLM Hash Dump → Domain Admin Impersonation' },
    ],
    remediation: [
      { priority: 'CRITICAL', action: 'Enumerate and decommission all shadow UAT subdomains — enforce asset registration policy via Qualys EASM continuous discovery',              effort: 'Medium', eta: '3 days',  roi: 7.8, resourceId: 'res-shadow-subdomain' },
      { priority: 'CRITICAL', action: 'Implement BOLA controls — enforce object-level authorization on all API endpoints and enable API inventory (Qualys API Security)',         effort: 'Medium', eta: '2 days',  roi: 8.2, resourceId: 'res-shadow-api' },
      { priority: 'HIGH',     action: 'Deploy Qualys FIM across all web-facing servers including UAT environments to detect unauthorized file system changes',                    effort: 'Medium', eta: '2 days',  roi: 6.5, resourceId: 'res-web-shell' },
      { priority: 'HIGH',     action: 'Enforce restrictive container security policies — disable privileged containers in all namespaces (Qualys Container Security)',            effort: 'Low',    eta: '4 hours', roi: 8.5, resourceId: 'res-container-host' },
      { priority: 'MEDIUM',   action: 'Deploy Qualys Multi-Vector EDR on all container hosts to detect NTLM hash dumping and lateral credential abuse',                          effort: 'High',   eta: '5 days',  roi: 3.6, resourceId: 'res-domain-ctrl' },
    ],
  },
  {
    id: 7003,
    title: 'Supply Chain & Hybrid Identity Pivot — Vulnerable Library to On-Prem AD',
    severity: 'CRITICAL',
    entry: 'Vulnerable Third-Party Library (Supply Chain)',
    target: 'On-Prem Active Directory (Hybrid Identity Sync)',
    hops: 5, gaps: 4, score: 9.3,
    resourceIds: ['res-vuln-lib', 'res-cicd-pipeline', 'res-prod-k8s', 'res-pod-iam', 'res-hybrid-ad'],
    mitre: 'T1195.001 → T1072 → T1610 → T1528 → T1484.002',
    path: 'Vulnerable Library → CI/CD Pipeline → Prod K8s → Pod IAM Role → Entra Connect → On-Prem AD',
    status: 'open',
    flowNodes: [
      { label: 'Vulnerable Library', icon: '📦', severity: null,       isStart: true,                   resourceId: 'res-vuln-lib' },
      { label: 'CI/CD Pipeline',     icon: '⚙️', severity: 'HIGH',     edge: 'Unscanned Build Deploy',  resourceId: 'res-cicd-pipeline' },
      { label: 'Prod K8s Cluster',   icon: '☸️', severity: 'CRITICAL', edge: 'Vulnerability Exploit',   resourceId: 'res-prod-k8s' },
      { label: 'Cloud IAM Role',     icon: '🔑', severity: 'CRITICAL', edge: 'Pod IAM Role Theft',      resourceId: 'res-pod-iam' },
      { label: 'On-Prem AD (Sync)',  icon: null,  severity: 'CRITICAL', edge: 'Entra Connect Abuse',    resourceId: 'res-hybrid-ad', isCrown: true },
    ],
    gaps_detail: [
      { label: 'Unscanned Dependency:', value: 'Developer pulls malicious / outdated package into build without SCA scan — critical CVE undetected in dependency tree (Qualys VMDR SCA)' },
      { label: 'No Pipeline Gate:',     value: 'CI/CD build deployed without vulnerability or secret scanning — no quality gate blocking vulnerable images reaching production (Qualys TotalCloud)' },
      { label: 'No Runtime Policy:',   value: 'Container runtime permits exploit code execution — no admission controller blocking vulnerable workloads from scheduling (Qualys Container Security)' },
      { label: 'Over-Privileged Pod:', value: 'Pod-attached IAM role has Write permissions on production resources — RCE code steals credentials via IMDS (Qualys CSPM CIEM)' },
      { label: 'Chained Path:',       value: 'Malicious Library → Unscanned CI/CD Deploy → K8s Shell → Pod IAM Theft → Entra ID Connect Sync → On-Prem AD Password Reset → Domain Admin' },
    ],
    remediation: [
      { priority: 'CRITICAL', action: 'Enforce SCA gates in CI/CD — block builds with critical CVEs using Qualys VMDR Software Composition Analysis',                               effort: 'Medium', eta: '1 day',   roi: 8.9, resourceId: 'res-vuln-lib' },
      { priority: 'CRITICAL', action: 'Add vulnerability scanning and secret detection to all CI/CD pipelines before deployment (Qualys TotalCloud / Container Security)',          effort: 'Medium', eta: '2 days',  roi: 7.6, resourceId: 'res-cicd-pipeline' },
      { priority: 'HIGH',     action: 'Implement Kubernetes admission controller to block vulnerable and unsigned container images from production namespaces',                     effort: 'Low',    eta: '4 hours', roi: 8.3, resourceId: 'res-prod-k8s' },
      { priority: 'HIGH',     action: 'Apply least-privilege to all pod-attached IAM roles — remove Write permissions from all workload identities (Qualys CSPM CIEM)',           effort: 'Low',    eta: '2 hours', roi: 8.7, resourceId: 'res-pod-iam' },
      { priority: 'MEDIUM',   action: 'Audit Entra ID Connect configuration — restrict password writeback to privileged accounts and enable sync activity alerting (Qualys PC)',  effort: 'Medium', eta: '2 days',  roi: 4.2, resourceId: 'res-hybrid-ad' },
    ],
  },
  // ── Path D: Identity Vault Compromise ──────────────────────────────────────
  {
    id: 8001,
    title: 'Identity Vault Compromise — PAM Appliance RCE to Full Domain Ransomware',
    severity: 'CRITICAL',
    entry: 'Internet Exposure (BeyondTrust Appliance)',
    target: 'Core Databases + Backups',
    hops: 5, gaps: 4, score: 9.9,
    resourceIds: ['res-bt-appliance', 'res-cred-vault', 'res-domain-ctrl', 'res-crown-dbs'],
    mitre: 'T1190 → T1505.003 → T1555 → T1078.002 → T1486',
    path: 'Internet → BeyondTrust RCE → Webshell/RAT → PAM Vault → Domain Admin → DBs + Backups (Ransomware)',
    status: 'open',
    flowNodes: [
      { label: 'Internet Exposure',     icon: '🌐', severity: null,       isStart: true },
      { label: 'BeyondTrust Appliance', icon: '🔐', severity: 'CRITICAL', edge: 'Pre-auth RCE CVE-2026-1731', resourceId: 'res-bt-appliance' },
      { label: 'Webshell / RAT',        icon: '🦠', severity: 'CRITICAL', edge: 'Webshell + RAT Deploy' },
      { label: 'Credential Vault',      icon: '🔒', severity: 'CRITICAL', edge: 'PAM Vault Access',           resourceId: 'res-cred-vault' },
      { label: 'Domain Admin',          icon: '👤', severity: 'CRITICAL', edge: 'AD Enum + DA Creation',      resourceId: 'res-domain-ctrl' },
      { label: 'DBs + Backups',         icon: null,  severity: 'CRITICAL', edge: 'Exfiltration + Ransomware', resourceId: 'res-crown-dbs', isCrown: true },
    ],
    gaps_detail: [
      { label: 'Internet-Exposed PAM:', value: 'BeyondTrust appliance publicly reachable — CVE-2026-1731 pre-auth RCE requires zero credentials. Wormable and remotely exploitable with no user interaction (Qualys EASM + VMDR)' },
      { label: 'Webshell Persistence:', value: 'Attacker writes webshell to BeyondTrust document root and deploys RAT — FIM not deployed on PAM appliance for real-time file change detection (Qualys FIM + Multi-Vector EDR)' },
      { label: 'PAM Vault Unguarded:', value: 'Compromised appliance service account has direct vault access — no vault access anomaly detection or session recording on privileged account retrieval (Qualys CSAM + Policy Compliance)' },
      { label: 'AD Enumeration Free:', value: 'No controls on bulk AD enumeration — attacker creates Domain Admin accounts using vault credentials without triggering SIEM or EDR alerts (Qualys Multi-Vector EDR + Policy Compliance)' },
      { label: 'Chained Path:', value: 'Internet RCE → Webshell + RAT Persistence → PAM Vault Credential Dump → AD Domain Admin Creation → Crown Jewel DB Exfiltration + Ransomware Deployment' },
    ],
    remediation: [
      { priority: 'CRITICAL', action: 'Remove BeyondTrust appliance from internet immediately — restrict to internal network only and apply CVE-2026-1731 emergency patch (Qualys EASM + VMDR)',             effort: 'Low',    eta: '2 hours', roi: 9.9, resourceId: 'res-bt-appliance' },
      { priority: 'CRITICAL', action: 'Deploy Qualys FIM on all PAM appliances — real-time alert on any unauthorized file writes to document root or service directories (Qualys FIM + Multi-Vector EDR)', effort: 'Low',    eta: '4 hours', roi: 9.5, resourceId: 'res-bt-appliance' },
      { priority: 'CRITICAL', action: 'Enforce least-privilege on PAM vault service accounts — enable vault access session logging and anomaly alerting (Qualys CSAM + Policy Compliance)',                 effort: 'Medium', eta: '1 day',   roi: 8.8, resourceId: 'res-cred-vault' },
      { priority: 'HIGH',     action: 'Deploy Qualys Multi-Vector EDR across all domain-joined systems — enable anomalous AD enumeration and new privileged account creation alerts',                      effort: 'High',   eta: '5 days',  roi: 5.2, resourceId: 'res-domain-ctrl' },
      { priority: 'HIGH',     action: 'Implement immutable backup snapshots and database activity monitoring — detect mass file-modification indicative of ransomware (Qualys VMDR + Multi-Vector EDR)',    effort: 'Medium', eta: '3 days',  roi: 4.8, resourceId: 'res-crown-dbs' },
    ],
  },
  // ── Path 7004: Shadow API RCE → Container Escape → AD Takeover ───────────────
  {
    id: 7004,
    title: 'Shadow API Breach — RCE Chain & Container Escape to Full Domain Compromise',
    severity: 'CRITICAL',
    entry: 'UAT Dev Environment (DNS Enumeration)',
    target: 'Active Directory',
    hops: 6, gaps: 5, score: 9.7,
    resourceIds: ['res-shadow-subdomain', 'res-shadow-api', 'res-struts-appserver', 'res-runc-container', 'res-host-root', 'res-domain-ctrl'],
    mitre: 'T1590.001 → T1190 → T1505.003 → T1611 → T1003.001 → T1550.002',
    path: 'UAT Subdomain → BOLA Shadow API → CVE-2023-50164 RCE + Web Shell → CVE-2019-5736 Container Escape → NTLM/Kerberos Dump → Domain Admin (Pass-the-Hash / Zerologon)',
    status: 'open',
    flowNodes: [
      { label: 'UAT Dev Environment', icon: '🌐', severity: null,       isStart: true,                          resourceId: 'res-shadow-subdomain' },
      { label: 'Shadow API (BOLA)',   icon: '🖥️', severity: 'HIGH',     edge: 'DNS Enumeration + BOLA',         resourceId: 'res-shadow-api' },
      { label: 'RCE + Web Shell',     icon: '🦠', severity: 'CRITICAL', edge: 'CVE-2023-50164 File Upload',     resourceId: 'res-struts-appserver' },
      { label: 'Container Escape',    icon: '☸️', severity: 'CRITICAL', edge: 'CVE-2019-5736 runc Overwrite',   resourceId: 'res-runc-container' },
      { label: 'Credential Dump',     icon: '🔑', severity: 'CRITICAL', edge: 'Host Root → LSASS/Kerberos',    resourceId: 'res-host-root' },
      { label: 'Domain Admin',        icon: null,  severity: 'CRITICAL', edge: 'Pass-the-Hash / Zerologon',     resourceId: 'res-domain-ctrl', isCrown: true },
    ],
    gaps_detail: [
      { label: 'Unmonitored UAT:',       value: 'uat-api.dev.domain.com externally accessible via DNS brute-force — not in asset inventory, no WAF or authentication controls, monitored below production standard (Qualys EASM)' },
      { label: 'BOLA on Shadow API:',    value: 'Undocumented API endpoint lacks object-level authorization — attacker manipulates object IDs to access other users\' data, exposes backend structure and internal identifiers (Qualys API Security)' },
      { label: 'CVE-2023-50164 RCE:',   value: 'Apache Struts 2 vulnerable file upload mechanism exploited to achieve Remote Code Execution — web shell deployed for persistent command execution without any user interaction (Qualys VMDR + FIM)' },
      { label: 'CVE-2019-5736 Escape:', value: 'Container running runc ≤1.0-rc6 — attacker overwrites host runc binary to escape container and gain root on the underlying host, collapsing all container isolation (Qualys Container Security)' },
      { label: 'Credential Exposure:',  value: 'Host root access enables LSASS memory read and Kerberos ticket extraction — NTLM hashes and TGTs harvested for Pass-the-Hash / Pass-the-Ticket and potential Zerologon (CVE-2020-1472) escalation (Qualys Multi-Vector EDR)' },
    ],
    remediation: [
      { priority: 'CRITICAL', action: 'Run Qualys EASM continuous discovery — immediately catalogue and gate all externally reachable UAT/dev subdomains; enforce asset registration before any environment goes live',                                       effort: 'Low',    eta: '4 hours', roi: 9.7, resourceId: 'res-shadow-subdomain' },
      { priority: 'CRITICAL', action: 'Deploy Qualys API Security — enforce object-level authorization on every API endpoint, build complete shadow API inventory, and block undocumented endpoints at the API gateway',                                     effort: 'Medium', eta: '2 days',  roi: 8.9, resourceId: 'res-shadow-api' },
      { priority: 'CRITICAL', action: 'Patch CVE-2023-50164 (Apache Struts file upload RCE) via Qualys VMDR patch management — enforce strict server-side file type validation and deploy FIM to alert on any unauthorized writes to web directories',      effort: 'Low',    eta: '1 day',   roi: 9.4, resourceId: 'res-struts-appserver' },
      { priority: 'CRITICAL', action: 'Upgrade runc to ≥1.0-rc7 to patch CVE-2019-5736 — enforce read-only container filesystems, drop all Linux capabilities, apply seccomp profiles and Qualys Container Security runtime policy to all workloads',     effort: 'Medium', eta: '2 days',  roi: 8.6, resourceId: 'res-runc-container' },
      { priority: 'HIGH',     action: 'Deploy Qualys Multi-Vector EDR on all container hosts — enable LSASS protection, Credential Guard, and alert on Kerberos ticket anomalies and Pass-the-Hash lateral movement patterns',                             effort: 'High',   eta: '5 days',  roi: 6.3, resourceId: 'res-host-root' },
      { priority: 'HIGH',     action: 'Patch CVE-2020-1472 (Zerologon) on all domain controllers and enforce Secure Channel enforcement mode — add Domain Controllers to Protected Users group and enable DC shadow detection (Qualys VMDR + Policy Compliance)', effort: 'Low', eta: '4 hours', roi: 8.8, resourceId: 'res-domain-ctrl' },
      { priority: 'MEDIUM',   action: 'Enforce network micro-segmentation — block all direct connectivity between UAT/dev environments and production AD; require explicit jump-host with MFA and session recording for any cross-segment access',           effort: 'High',   eta: '1 week',  roi: 4.5, resourceId: null },
    ],
  },
  // ── Existing paths ───────────────────────────────────────────────────────────
  {
    id: 5014,
    title: 'Publicly Exposed VM with No Encryption on EBS',
    severity: 'CRITICAL',
    entry: 'Internet (Web API)',
    target: 'Customer PII Database',
    hops: 4,
    gaps: 3,
    score: 9.7,
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
    score: 9.4,
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
    score: 9.1,
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
    score: 8.2,
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
    score: 7.9,
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
  { asset: 'API Gateway',            resourceId: 'res-graphql-api',        reason: 'Toxic Combination: CVE + IAM + Internet-facing (+24%)',                              base: 7.3, adjusted: 9.7,  delta: '+24%', positive: true  },
  { asset: 'Jump Server',            resourceId: null,                      reason: 'Choke Point (+19%): converges 5 attack paths',                                      base: 6.8, adjusted: 8.7,  delta: '+19%', positive: true  },
  { asset: 'Redis Cache',            resourceId: 'res-redis-cache',         reason: 'Choke Point (+29%): no auth + credential store',                                    base: 6.5, adjusted: 9.4,  delta: '+29%', positive: true  },
  { asset: 'Dev Test Server',        resourceId: null,                      reason: 'No Reachability: isolated VLAN, no external paths',                                 base: 6.2, adjusted: 2.7,  delta: '-57%', positive: false },
  { asset: 'Staging DB',             resourceId: null,                      reason: 'Dormant: no verified credential or service path',                                   base: 5.8, adjusted: 2.8,  delta: '-51%', positive: false },
  { asset: 'BeyondTrust Appliance',  resourceId: 'res-bt-appliance',        reason: 'Internet-Exposed PAM + Pre-auth RCE + Vault Access + Full Domain Path (+29%)',      base: 7.1, adjusted: 10.0, delta: '+29%', positive: true  },
  { asset: 'Windows Server (Legacy)',resourceId: 'res-win-server-unpatched', reason: 'MS17-010 Unpatched + Shared Local Admin + NTLMv1 + No Credential Guard (+27%)',    base: 6.8, adjusted: 9.5,  delta: '+27%', positive: true  },
  { asset: 'Shadow API',             resourceId: 'res-shadow-api',          reason: 'BOLA + Unmanaged Asset + No FIM + Container Escape Path (+28%)',                    base: 6.7, adjusted: 9.6,  delta: '+28%', positive: true  },
  { asset: 'Cloud Mgmt Console',     resourceId: 'res-cloud-mgmt-a',        reason: 'Hardcoded SA Key + SaaS MFA Bypass + Direct VPN Pivot to Corp Net (+26%)',         base: 7.0, adjusted: 9.5,  delta: '+26%', positive: true  },
  { asset: 'Prod K8s Cluster',       resourceId: 'res-prod-k8s',            reason: 'Unscanned Supply Chain + Over-Privileged Pod IAM + Hybrid AD Sync Path (+25%)',    base: 6.8, adjusted: 9.3,  delta: '+25%', positive: true  },
  { asset: 'Apache Struts Server',   resourceId: 'res-struts-appserver',    reason: 'CVE-2023-50164 RCE + Shadow API Entry + Container Escape Chain + AD Path (+30%)',  base: 6.9, adjusted: 9.8,  delta: '+30%', positive: true  },
  { asset: 'runc Container Host',    resourceId: 'res-runc-container',      reason: 'CVE-2019-5736 Container Escape + Host Root + Credential Dump + Domain Path (+28%)', base: 7.0, adjusted: 9.7,  delta: '+28%', positive: true  },
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
  {
    title: 'Shared Local Admin Password + MS17-010 + NTLMv1 + No Credential Guard',
    severity: 'CRITICAL', resourceId: 'res-win-server-unpatched', asset: 'win-srv-2019-legacy-01',
    mitre: 'T1110 → T1068 → T1003.001 → T1550.002 → T1003.006',
    items: [
      { label: 'Identity Gap:',       value: 'Identical local admin password across all Windows servers — single hash enables Pass-the-Hash to every peer host without cracking (Qualys Policy Compliance)' },
      { label: 'Vulnerability:',      value: 'CVE-2017-0144 (MS17-010 EternalBlue) unpatched — unauthenticated SYSTEM-level RCE from any network-adjacent position (Qualys VMDR)' },
      { label: 'Protocol Weakness:',  value: 'NTLMv1 enabled domain-wide — captured hashes cracked offline in minutes with commodity hardware; no Kerberos-only policy enforced' },
      { label: 'Path to Crown Jewel:', value: 'VPN Brute Force → EternalBlue Exploit → Local Admin → LSASS Dump → Pass-the-Hash → DCSync → Full Domain Compromise' },
    ],
  },
  {
    title: 'Internet-Exposed PAM + Pre-auth RCE + Credential Vault + Domain Admin Creation',
    severity: 'CRITICAL', resourceId: 'res-bt-appliance', asset: 'beyondtrust-rs-appliance-01',
    mitre: 'T1190 → T1505.003 → T1555 → T1078.002 → T1486',
    items: [
      { label: 'Internet Exposure:',   value: 'BeyondTrust PAM appliance reachable from internet — zero-click pre-auth RCE (CVE-2026-1731) requires no credentials (Qualys EASM + VMDR)' },
      { label: 'Persistence:',         value: 'Webshell and RAT deployed post-exploitation — no FIM or behavioral EDR on PAM appliance to detect unauthorized file writes' },
      { label: 'Choke Point (Vault):', value: 'Compromised appliance holds keys to all privileged identities — single host compromise equals full domain credential access (Qualys CSAM)' },
      { label: 'Path to Crown Jewel:', value: 'BeyondTrust RCE → Webshell → PAM Vault Dump → Domain Admin → Core DB Exfiltration + Enterprise Ransomware' },
    ],
  },
  {
    title: 'SaaS MFA Disabled + Hardcoded SA Key + Always-On VPN + Public SQL Permissions',
    severity: 'CRITICAL', resourceId: 'res-cloud-mgmt-a', asset: 'aws-mgmt-console-acme-prod',
    mitre: 'T1078.004 → T1552.001 → T1021.007 → T1048',
    items: [
      { label: 'Identity Gap:',        value: 'SaaS tenant MFA disabled — credential stuffing bypasses all single-factor authentication controls (Qualys SaaSDR)' },
      { label: 'Credential Exposure:', value: 'Service Account Key hardcoded in GitHub repository — no rotation, no detection policy (Qualys CSPM)' },
      { label: 'Network Pivot:',       value: 'Always-On Cloud VPN provides unrestricted access to corporate network from compromised EC2 instance' },
      { label: 'Path to Crown Jewel:', value: 'SaaS Bypass → SA Key → EC2 PwnKit Root → VPN Pivot → On-Prem SQL PII Exfiltration' },
    ],
  },
  {
    title: 'Shadow Asset + BOLA API + Privileged Container + AD NTLM Hash Dump',
    severity: 'CRITICAL', resourceId: 'res-container-host', asset: 'container-host-uat-01',
    mitre: 'T1590.001 → T1190 → T1611 → T1003.001',
    items: [
      { label: 'Asset Gap:',          value: 'UAT subdomain not in asset inventory — no security controls, monitoring, or authentication deployed (Qualys EASM)' },
      { label: 'API Vulnerability:',  value: 'Broken Object Level Authorization on undocumented API endpoint — any user object accessible without checks (Qualys API Security)' },
      { label: 'Container Risk:',     value: 'Privileged container runtime with host namespace access — breakout to underlying host is trivial (Qualys Container Security)' },
      { label: 'Path to Crown Jewel:', value: 'Shadow DNS → BOLA Exploit → Web Shell → Container Escape → NTLM Hash → Domain Admin' },
    ],
  },
  {
    title: 'Vulnerable Library + Unscanned CI/CD + Pod IAM Write + Hybrid AD Sync',
    severity: 'CRITICAL', resourceId: 'res-prod-k8s', asset: 'prod-k8s-cluster-eks-01',
    mitre: 'T1195.001 → T1610 → T1528 → T1484.002',
    items: [
      { label: 'Supply Chain:',       value: 'Critical CVE in transitive npm dependency — undetected without SCA scanning gate in CI/CD pipeline (Qualys VMDR SCA)' },
      { label: 'Pipeline Gap:',       value: 'No vulnerability or secret scan gate — vulnerable images deployed to production Kubernetes cluster unchecked (Qualys TotalCloud)' },
      { label: 'IAM Privilege:',      value: 'Pod-attached IAM role has Write access to production — RCE/SSRF code exfiltrates credentials via IMDS (Qualys CSPM CIEM)' },
      { label: 'Path to Crown Jewel:', value: 'Malicious Package → CI/CD → K8s Shell → Pod IAM → Entra Connect → On-Prem AD Domain Admin' },
    ],
  },
  {
    title: 'Shadow API BOLA + CVE-2023-50164 RCE + CVE-2019-5736 Container Escape + Zerologon',
    severity: 'CRITICAL', resourceId: 'res-struts-appserver', asset: 'app-srv-struts-uat-01',
    mitre: 'T1590.001 → T1190 → T1505.003 → T1611 → T1003.001 → T1550.002',
    items: [
      { label: 'API Flaw:',           value: 'BOLA on undocumented shadow API endpoint — no object-level authorization, exposes backend structure and all user records (Qualys API Security)' },
      { label: 'RCE Exploit:',        value: 'CVE-2023-50164 Apache Struts file upload RCE — web shell deployed for persistent remote execution without any credentials (Qualys VMDR + FIM)' },
      { label: 'Container Escape:',   value: 'CVE-2019-5736 runc overwrite — container isolation completely bypassed, host root access achieved in seconds (Qualys Container Security)' },
      { label: 'Path to Crown Jewel:', value: 'DNS Enum → BOLA API → Struts RCE → runc Escape → LSASS Dump → Pass-the-Hash / Zerologon → Full Domain Admin' },
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
    'SaaS Application': '☁️', 'Cloud Console': '🖥️', 'Web Asset': '🌐',
    'Web Server': '🌐', 'Container Orchestration': '☸️', 'Software Package': '📦',
    'CI/CD': '⚙️', 'Identity Federation': '🔗',
    'PAM Appliance': '🔐', 'Credential Vault': '🔒', 'Backup System': '💾',
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
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-base shrink-0">{typeIcon[resource.type] || '🖥️'}</span>
              <span className="text-xs font-mono font-semibold text-white truncate" title={resource.name}>{resource.name}</span>
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
                <span className="text-slate-200 font-semibold w-20 shrink-0">{item.label}</span>
                <span className="text-slate-200 font-mono break-all">{item.value}</span>
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
                    <span className={`text-[10px] font-bold ${p.score >= 9.0 ? 'text-red-600' : 'text-orange-600'}`}>
                      QVSS {p.score}
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
  const [sharedPopup,   setSharedPopup]     = useState(null)  // { ap, resources[] }

  const openSharedPopup = (e, ap) => {
    e.stopPropagation()
    const resources = ap.resourceIds
      .map(rid => ({ resource: RESOURCES.find(r => r.id === rid), paths: getPathsByResourceId(rid) }))
      .filter(({ resource, paths }) => resource && paths.length > 1)
      .map(({ resource, paths }) => ({ resource, otherPaths: paths.filter(p => p.id !== ap.id) }))
    setSharedPopup({ ap, resources })
  }

  const stats = [
    { label: 'Total Paths',          value: '11', icon: GitBranch,     color: 'text-white'       },
    { label: 'Critical Paths',       value: '9',  icon: AlertTriangle,  color: 'text-red-600'     },
    { label: 'Avg QVSS Score',        value: '9.4', icon: TrendingUp,    color: 'text-orange-600'  },
    { label: 'Crown Jewels at Risk', value: '8',  icon: Target,         color: 'text-purple-600'  },
    { label: 'Entry Points',         value: '6',  icon: Zap,            color: 'text-blue-400'    },
  ]

  const entryPoints = [
    { label: 'Internet / Web API',    count: 4 },
    { label: 'VPN Entry',             count: 2 },
    { label: 'SaaS / Cloud Tenant',   count: 1 },
    { label: 'Shadow IT / EASM',      count: 1 },
    { label: 'Supply Chain / Library',count: 1 },
    { label: 'Lambda / Serverless',   count: 1 },
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
              <div className="text-[10px] text-slate-300 leading-tight font-medium">{s.label}</div>
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
              <div className="text-[10px] text-slate-300 font-semibold uppercase tracking-wider mb-2">Severity</div>
              <div className="space-y-1">
                {[['all','All',11],['CRITICAL','Critical',9],['HIGH','High',2],['MEDIUM','Medium',0]].map(([val,label,count]) => (
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
              <div className="text-[10px] text-slate-300 font-semibold uppercase tracking-wider mb-2">Entry Point Type</div>
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
            <div className="text-[10px] text-slate-300 font-semibold uppercase tracking-wider mb-2">Time Range</div>
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
              <span className="text-[11px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full font-medium">{filtered.length} of {ATTACK_PATHS.length}</span>
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
          <div className="grid grid-cols-[64px_1fr_100px_80px_70px_120px_80px_90px] gap-2 px-3 py-2 bg-slate-700/60 border-b border-slate-600 text-[10px] font-bold text-slate-200 uppercase tracking-wider">
            <div>CID</div>
            <div>Attack Path Title / Chain</div>
            <div>Crown Jewel</div>
            <div>Severity</div>
            <div>Hops / Gaps</div>
            <div className="flex items-center gap-1">
              <Link2 className="w-3 h-3" />
              Resources
            </div>
            <div>QVSS Score</div>
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
                  <div className="text-[11px] font-mono text-slate-200 font-semibold">{ap.id}</div>
                  <div>
                    <div className="text-[12px] font-semibold text-white group-hover:text-indigo-300 leading-tight mb-0.5">{ap.title}</div>
                    <div className="text-[10px] font-mono text-slate-300 leading-tight truncate">{ap.path}</div>
                  </div>
                  <div className="text-[10px] text-slate-100 leading-tight font-medium">{ap.target}</div>
                  <div><SeverityBadge level={ap.severity} /></div>
                  <div className="text-[11px] text-slate-300">{ap.hops} hops / {ap.gaps} gaps</div>

                  {/* Resources cell — shows count + shared badge */}
                  <div className="flex flex-col gap-1 items-start" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] font-semibold text-slate-200">{ap.resourceIds.length}</span>
                      <span className="text-[10px] text-slate-300">resources</span>
                    </div>
                    {sharedCount > 0 ? (
                      <button
                        onClick={e => openSharedPopup(e, ap)}
                        className="text-[9px] bg-orange-900/30 text-orange-300 border border-orange-700/50 px-1.5 py-0.5 rounded-full font-semibold flex items-center gap-0.5 hover:bg-orange-900/60 hover:border-orange-500 transition-colors cursor-pointer"
                      >
                        <Link2 className="w-2.5 h-2.5" />
                        {sharedCount} shared
                      </button>
                    ) : (
                      <span className="text-[9px] text-green-400 bg-green-900/20 border border-green-700/50 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                        <CheckCircle className="w-2.5 h-2.5" />
                        unique
                      </span>
                    )}
                  </div>

                  <div className={`text-sm font-bold ${ap.score >= 9.0 ? 'text-red-600' : ap.score >= 7.5 ? 'text-orange-600' : 'text-yellow-600'}`}>{ap.score}</div>
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

      {/* ── Shared Resources Modal ── */}
      {sharedPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={() => setSharedPopup(null)}>
          <div
            className="bg-slate-800 border border-slate-600 rounded-xl shadow-2xl w-[820px] max-h-[75vh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between px-5 py-4 border-b border-slate-700 shrink-0">
              <div>
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-orange-400" />
                  Shared Resources
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Resources on <span className="text-slate-200 font-semibold">AP-{sharedPopup.ap.id}</span> that appear in multiple attack paths
                </p>
              </div>
              <button onClick={() => setSharedPopup(null)} className="text-slate-400 hover:text-white transition-colors ml-4 mt-0.5">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Table */}
            <div className="overflow-y-auto flex-1">
              <table className="w-full text-[11px] border-collapse">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-slate-700/80 text-slate-300 uppercase tracking-wider text-[9px] font-semibold">
                    <th className="text-left px-4 py-2.5 w-[200px]">Resource</th>
                    <th className="text-left px-3 py-2.5 w-[90px]">Type</th>
                    <th className="text-left px-3 py-2.5 w-[80px]">Severity</th>
                    <th className="text-left px-3 py-2.5 w-[80px]">Criticality</th>
                    <th className="text-left px-3 py-2.5">Related Attack Path</th>
                    <th className="text-left px-3 py-2.5 w-[80px]">Path Severity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60">
                  {sharedPopup.resources.flatMap(({ resource, otherPaths }) =>
                    otherPaths.map((p, pi) => (
                      <tr key={`${resource.id}-${p.id}`} className="hover:bg-slate-700/30 transition-colors">
                        {/* Resource name — only show on first row for this resource */}
                        <td className="px-4 py-2.5 align-top">
                          {pi === 0 && (
                            <div>
                              <div className="font-mono font-semibold text-white text-[11px]">{resource.name}</div>
                              <div className="text-slate-400 text-[9px] mt-0.5">{resource.ports}</div>
                            </div>
                          )}
                        </td>
                        <td className="px-3 py-2.5 align-top">
                          {pi === 0 && (
                            <span className="text-[9px] bg-slate-700 text-slate-300 border border-slate-600 px-1.5 py-0.5 rounded-full whitespace-nowrap">{resource.type}</span>
                          )}
                        </td>
                        <td className="px-3 py-2.5 align-top">
                          {pi === 0 && <SeverityBadge level={resource.severity} />}
                        </td>
                        <td className="px-3 py-2.5 align-top">
                          {pi === 0 && (
                            <span className="text-slate-300 text-[10px]">{resource.criticality}</span>
                          )}
                        </td>
                        <td className="px-3 py-2.5 align-top">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[9px] bg-indigo-900/40 text-indigo-300 border border-indigo-700/50 px-1.5 py-0.5 rounded shrink-0">AP-{p.id}</span>
                            <span className="text-slate-300 leading-snug">{p.title}</span>
                          </div>
                        </td>
                        <td className="px-3 py-2.5 align-top">
                          <SeverityBadge level={p.severity} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer count */}
            <div className="px-5 py-2.5 border-t border-slate-700 shrink-0 text-[10px] text-slate-300">
              {sharedPopup.resources.length} shared resource{sharedPopup.resources.length > 1 ? 's' : ''} · {sharedPopup.resources.reduce((s, r) => s + r.otherPaths.length, 0)} related path entries
            </div>
          </div>
        </div>
      )}
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
                    <span className="text-sm font-bold text-red-600">QVSS: {ap.score}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-400" />
                  </div>
                </div>
                <div className="text-[10px] font-mono text-slate-300 bg-slate-700/60 px-2 py-1 rounded">{ap.path}</div>
                <div className="flex gap-3 mt-1.5 text-[10px] text-slate-300">
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
            <span className={`text-sm font-bold px-2 py-0.5 rounded ${selectedPath.score >= 9.0 ? 'bg-red-900/30 text-red-300' : 'bg-orange-900/30 text-orange-300'}`}>
              QVSS {selectedPath.score}
            </span>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div>
            <h3 className="font-bold text-white text-base">{selectedPath.title}</h3>
            <div className="flex items-center gap-3 mt-1">
              <SeverityBadge level={selectedPath.severity} />
              <span className="text-[11px] text-slate-200">{selectedPath.hops} hops · {selectedPath.gaps} gaps chained</span>
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
          'Serverless': '⚡', 'IAM Role': '👤', 'Server': '🖥️',
          'SaaS Application': '☁️', 'Cloud Console': '🖥️', 'Web Asset': '🌐',
          'Web Server': '🌐', 'Container Orchestration': '☸️', 'Software Package': '📦',
          'CI/CD': '⚙️', 'Identity Federation': '🔗',
          'PAM Appliance': '🔐', 'Credential Vault': '🔒', 'Backup System': '💾',
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
              <span className="text-[10px] text-slate-300">— {pathResources.length} assets · {Object.keys(typeCounts).length} types · {selectedPath.hops} hops</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(typeCounts).map(([type, count]) => (
                <div key={type} className="flex items-center gap-1.5 bg-slate-700/40 border border-slate-700 rounded-lg px-2.5 py-1.5">
                  <span className="text-base leading-none">{typeIcons[type] || '🖥️'}</span>
                  <div>
                    <div className="text-xs font-bold text-white leading-none">{count}</div>
                    <div className="text-[9px] text-slate-300 leading-tight mt-0.5">{type}</div>
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
                  <div className="text-[9px] text-red-500 leading-tight mt-0.5">QVSS Score</div>
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
          <h3 className="font-semibold text-white text-sm">Attack Path Visualization</h3>
          <span className="text-xs text-green-400 font-medium bg-green-900/20 border border-green-700/50 px-2 py-0.5 rounded">Validated</span>
        </div>
        <p className="text-[11px] text-slate-300 mb-1">
          Entry: <span className="font-semibold text-white">{selectedPath.entry}</span> &nbsp;→&nbsp; Crown Jewel: <span className="font-semibold text-red-300">{selectedPath.target}</span>
        </p>
        <p className="text-[10px] text-indigo-200 mb-4 flex items-center gap-1 font-medium">
          <ArrowRight className="w-3 h-3" /> Click any edge arrow to inspect the security gap · Hover any node for asset metadata
        </p>
        <div className="flex items-center gap-0 overflow-x-auto pb-44">
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
                    <span className="text-[10px] text-indigo-200 font-semibold mb-0.5 whitespace-nowrap">{node.edge}</span>
                    <ArrowRight className={`w-4 h-4 ${selectedEdge === i ? 'text-indigo-300' : 'text-slate-300'}`} />
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
                  {/* Hover metadata tooltip — smart horizontal positioning to avoid overflow clipping */}
                  {hoveredNode === node.resourceId && resource && (
                    <div className={`absolute top-full mt-2 z-20 w-52 bg-slate-800 border border-slate-700 rounded-lg shadow-xl p-2.5 text-left pointer-events-none ${
                      i < Math.ceil(selectedPath.flowNodes.length / 3)
                        ? 'left-0'
                        : i >= Math.floor(2 * selectedPath.flowNodes.length / 3)
                          ? 'right-0'
                          : 'left-1/2 -translate-x-1/2'
                    }`}>
                      <div className="text-[11px] font-semibold text-white mb-1.5 font-mono truncate">{resource.name}</div>
                      <div className="space-y-1">
                        {[
                          { k: 'OS',            v: resource.os },
                          { k: 'Ports',         v: resource.ports },
                          { k: 'Exploitability',v: resource.exploitability },
                          { k: 'Criticality',   v: resource.criticality },
                        ].map(row => (
                          <div key={row.k} className="flex gap-2 text-[10px]">
                            <span className="text-slate-300 w-20 shrink-0">{row.k}</span>
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
          <div className="mt-3 border border-indigo-500/60 bg-indigo-950/60 rounded-lg p-3.5">
            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-[11px] font-bold text-indigo-100 bg-indigo-600/50 border border-indigo-400/40 px-2 py-0.5 rounded">
                Security Gap #{selectedEdge}
              </span>
              <span className="text-xs font-bold text-white">
                {selectedPath.flowNodes[selectedEdge].edge}
              </span>
              <button onClick={() => setSelectedEdge(null)} className="ml-auto text-indigo-300 hover:text-white transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            {selectedPath.gaps_detail[selectedEdge - 1] && (
              <div className="space-y-1 mb-2.5">
                <div className="flex gap-2 text-[11px]">
                  <span className="text-indigo-200 font-semibold w-28 shrink-0">{selectedPath.gaps_detail[selectedEdge - 1].label}</span>
                  <span className="text-slate-100 leading-relaxed">{selectedPath.gaps_detail[selectedEdge - 1].value}</span>
                </div>
              </div>
            )}
            <div className="text-[10px] text-indigo-300 font-medium">Click another edge arrow to inspect, or × to dismiss.</div>
          </div>
        )}
      </div>

      {/* ── 5. Asset Metadata (diagram order: after flow graph) ── */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-white text-sm">Asset Metadata</h3>
          <span className="text-[10px] text-teal-400 bg-teal-900/20 border border-teal-700/50 px-2 py-0.5 rounded font-medium flex items-center gap-1">
            <Link2 className="w-3 h-3" />
            {sharedIds.length > 0 ? `${sharedIds.length} shared across paths` : 'All resources unique to this path'}
          </span>
        </div>
        <p className="text-[11px] text-slate-300 mb-3">Qualys-enriched asset context — OS, services, criticality, exploitability, and cross-path membership</p>
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

      {/* ── 6. Asset Risk Scoring ── */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-indigo-400" />
          <h3 className="font-semibold text-white text-sm">Asset Risk Scoring</h3>
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
                    <span className="text-xs font-mono text-slate-400">{item.base.toFixed(1)}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                    <span className={`text-xs font-mono font-bold ${item.positive ? 'text-red-600' : 'text-green-400'}`}>{item.adjusted.toFixed(1)}</span>
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
          <h3 className="font-semibold text-white text-sm">Toxic Combinations</h3>
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

      {/* ── Ready to Remediate? Decision Gate ─────────────────────────── */}
      <div className="bg-slate-800 rounded-lg border-2 border-green-700/50 p-5">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 rounded-full bg-green-900/30 border-2 border-green-600/50 flex items-center justify-center">
            <Wrench className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base mb-1">Ready to Remediate?</h3>
            <p className="text-[11px] text-slate-400 max-w-md">
              You've traced the full attack chain, reviewed shared resources, contextual QVSS scores, and toxic combinations.
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

// ─── Alternate remediation options helper ────────────────────────────────────
const getAlternates = (action) => {
  const riskMap   = { CRITICAL: 88, HIGH: 72, MEDIUM: 52, LOW: 28 }
  const base      = riskMap[action.priority] || 50
  const effortNext = { Low: 'Medium', Medium: 'High', High: 'High' }
  const etaNext    = { Low: '1 day',  Medium: '1 week', High: '2 weeks' }
  return [
    {
      label: 'Compensating Control',
      badge: 'Quick',
      badgeColor: 'bg-yellow-900/40 text-yellow-300 border border-yellow-700/50',
      desc: 'Deploy monitoring, alerting and access restrictions as an interim measure while planning full remediation.',
      effort: 'Low',
      eta: '2–4 hours',
      riskReduction: Math.max(base - 32, 10),
    },
    {
      label: 'Recommended Fix',
      badge: '★ Preferred',
      badgeColor: 'bg-emerald-900/40 text-emerald-300 border border-emerald-700/50',
      desc: action.action,
      effort: action.effort,
      eta: action.eta,
      riskReduction: base,
      preferred: true,
    },
    {
      label: 'Hardened Implementation',
      badge: 'Max Coverage',
      badgeColor: 'bg-blue-900/40 text-blue-300 border border-blue-700/50',
      desc: 'Full remediation with additional defense-in-depth controls, automated policy enforcement, and continuous monitoring.',
      effort: effortNext[action.effort] || 'High',
      eta: etaNext[action.effort] || '1 week',
      riskReduction: Math.min(base + 8, 97),
    },
  ]
}

// ─── Remediate Tab ────────────────────────────────────────────────────────────
function RemediateTab({ selectedPath, onSelectPath, onOpenResource, onNavigateToAnalyze }) {
  const [actionStates,    setActionStates]    = useState({})
  const [roiTooltip,      setRoiTooltip]      = useState(null)  // key whose ROI panel is open
  const [detailOpen,      setDetailOpen]      = useState(null)  // key whose detail/alts panel is open
  const [remediatedBanner, setRemediatedBanner] = useState(false)

  const toggleAction = (key, newState) => {
    setActionStates(prev => ({ ...prev, [key]: prev[key] === newState ? null : newState }))
  }

  const markComplete = (key) => {
    setActionStates(prev => {
      const next = { ...prev, [key]: prev[key] === 'complete' ? null : 'complete' }
      if (next[key] === 'complete') setRemediatedBanner(true)
      return next
    })
  }

  const openDetail = (key) => {
    const opening = detailOpen !== key
    setDetailOpen(opening ? key : null)
    if (opening) setActionStates(prev => ({ ...prev, [key]: 'detail' }))
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
      {/* Back to Analyze */}
      {onNavigateToAnalyze && (
        <button
          onClick={onNavigateToAnalyze}
          className="text-[11px] text-slate-400 hover:text-indigo-400 flex items-center gap-1 transition-colors"
        >
          ← Back to Analyze
        </button>
      )}

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

        {/* ── Remediated success banner ── */}
        {remediatedBanner && (
          <div className="mb-3 flex items-center gap-3 bg-emerald-950/60 border border-emerald-600/70 rounded-lg px-4 py-3">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <div className="flex-1">
              <p className="text-emerald-300 font-semibold text-sm">Attack Path has been remediated</p>
              <p className="text-emerald-500 text-[10px] mt-0.5">You have successfully remediated this attack path.</p>
            </div>
            <button onClick={() => setRemediatedBanner(false)} className="text-emerald-600 hover:text-emerald-300 transition-colors shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

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
            const isRoiOpen    = roiTooltip === key
            const isDetailOpen = detailOpen === key
            const scoreColor   = roiScore >= 70 ? 'text-green-400' : roiScore >= 40 ? 'text-orange-500' : 'text-slate-400'
            const borderColor  = roiScore >= 70 ? 'border-green-600/50' : roiScore >= 40 ? 'border-orange-600/50' : 'border-slate-700'
            const alternates   = getAlternates(action)

            return (
              <div key={key} className={`border ${c.border} ${c.bg} rounded-lg overflow-hidden transition-opacity ${state === 'complete' ? 'opacity-50' : ''}`}>
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
                      {state === 'detail'     && <span className="text-sky-400 font-medium flex items-center gap-1"><Eye className="w-3 h-3" />Viewed Detail</span>}
                      {state === 'suppressed' && <span className="text-slate-400 font-medium flex items-center gap-1"><EyeOff className="w-3 h-3" />Suppressed</span>}
                      {state === 'ticket'     && <span className="text-blue-400 font-medium flex items-center gap-1"><Ticket className="w-3 h-3" />Ticket Created</span>}
                      {state === 'complete'   && <span className="text-emerald-400 font-medium flex items-center gap-1"><CheckCircle className="w-3 h-3" />Completed</span>}
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
                    onClick={() => openDetail(key)}
                    className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded border transition-colors
                      ${isDetailOpen ? 'bg-sky-600 text-white border-sky-600' : 'border-sky-600 text-sky-400 hover:bg-sky-900/20'}`}
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
                  <button
                    onClick={() => markComplete(key)}
                    className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded border transition-colors
                      ${state === 'complete' ? 'bg-emerald-600 text-white border-emerald-600' : 'border-emerald-600 text-emerald-400 hover:bg-emerald-900/20'}`}
                  >
                    <CheckCircle className="w-3 h-3" /> Mark Complete
                  </button>
                </div>
                </div>{/* end main action row */}

                {/* ── Alternate Remediation Options panel ── */}
                {isDetailOpen && (
                  <div className="border-t border-slate-700 bg-slate-900/80 p-3 text-[10px] leading-relaxed">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="font-semibold text-slate-100 text-[11px] flex items-center gap-1.5">
                        🔀 Alternate Remediation Options
                      </span>
                      <button onClick={() => setDetailOpen(null)} className="text-slate-400 hover:text-white text-xs">✕ close</button>
                    </div>
                    <div className="space-y-2">
                      {alternates.map((alt, i) => (
                        <div key={i} className={`rounded-lg border p-2.5 ${alt.preferred ? 'border-emerald-700/60 bg-emerald-900/10' : 'border-slate-700 bg-slate-800/50'}`}>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${alt.badgeColor}`}>{alt.badge}</span>
                              <span className="text-[11px] font-semibold text-slate-200">{alt.label}</span>
                            </div>
                            {/* Risk Reduction % */}
                            <div className="flex items-center gap-1 shrink-0">
                              <TrendingUp className={`w-3 h-3 ${alt.riskReduction >= 70 ? 'text-emerald-400' : alt.riskReduction >= 45 ? 'text-orange-400' : 'text-slate-400'}`} />
                              <span className={`font-bold text-[13px] font-mono ${alt.riskReduction >= 70 ? 'text-emerald-400' : alt.riskReduction >= 45 ? 'text-orange-400' : 'text-slate-400'}`}>
                                {alt.riskReduction}%
                              </span>
                              <span className="text-slate-500 text-[9px]">risk↓</span>
                            </div>
                          </div>
                          <p className="text-slate-400 mb-1.5 leading-snug">{alt.desc}</p>
                          <div className="flex gap-4 text-slate-500">
                            <span className="flex items-center gap-1"><Wrench className="w-2.5 h-2.5" /> {alt.effort}</span>
                            <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> {alt.eta}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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

// ─── InitialConfigurationTab (step wizard) ────────────────────────────────────
function InitialConfigurationTab() {
  const [step, setStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState(new Set())

  const [crownJewelPresets, setCrownJewelPresets] = useState([
    { id: 'preset-dc',   label: 'Domain Controllers',      desc: 'Tier-0 AD / Kerberos',             on: true  },
    { id: 'preset-pci',  label: 'PCI Payment Gateways',    desc: 'Cardholder data scope',             on: true  },
    { id: 'preset-db',   label: 'Production Databases',    desc: 'PII / financial data stores',       on: true  },
    { id: 'preset-pam',  label: 'PAM / Credential Vaults', desc: 'BeyondTrust, CyberArk, HashiCorp',  on: true  },
    { id: 'preset-iam',  label: 'IAM Control Planes',      desc: 'AWS Root, Azure Tenant Admin',      on: false },
    { id: 'preset-k8s',  label: 'Prod K8s Clusters',       desc: 'EKS / AKS control plane',           on: false },
    { id: 'preset-cicd', label: 'CI/CD Pipelines',         desc: 'Jenkins, GitHub Actions runners',   on: false },
    { id: 'preset-aiml', label: 'ML Model Registries',     desc: 'SageMaker, Azure ML, MLflow',       on: false },
  ])
  const [customJewels,     setCustomJewels]     = useState([])
  const [customJewelInput, setCustomJewelInput] = useState('')
  const [customJewelType,  setCustomJewelType]  = useState('Database')

  const [policyToggles, setPolicyToggles] = useState([
    { id: 'cisaKev',    label: 'CISA KEV Vulnerabilities',    desc: 'Auto-create remediation tickets for known exploited CVEs',      risk: 'HIGH',   on: true  },
    { id: 'nonProd',    label: 'Non-Production Environments', desc: 'Apply compensating controls to UAT / dev assets automatically', risk: 'MEDIUM', on: false },
    { id: 'shadowIt',   label: 'Shadow IT / EASM Findings',   desc: 'Auto-quarantine unmanaged assets exceeding risk threshold',     risk: 'HIGH',   on: true  },
    { id: 'mfaEnforce', label: 'MFA Enforcement (Weak Auth)', desc: 'Auto-push MFA policy to accounts missing 2FA via ISPM',        risk: 'LOW',    on: true  },
    { id: 'patchVerif', label: 'Patch-Verified Remediations', desc: 'Auto-close findings after VMDR confirms patch applied',        risk: 'LOW',    on: false },
    { id: 'credGuard',  label: 'Credential Guard Rollout',    desc: 'Auto-deploy Credential Guard GPO to unprotected endpoints',    risk: 'MEDIUM', on: false },
  ])

  const [domains,     setDomains]     = useState(['acme.com', 'acme-corp.io'])
  const [domainInput, setDomainInput] = useState('')

  const STEPS = [
    { title: 'Sensor Fabric Activation', icon: Wifi,   desc: 'Connect your data collection integrations' },
    { title: 'Identity & Domain Sync',   icon: Users,  desc: 'Sync AD, IAM, and cloud identity sources' },
    { title: 'Crown Jewel Selector',     icon: Target, desc: 'Tag mission-critical assets for priority scoring' },
    { title: 'External Surface Mapping', icon: Globe,  desc: 'Configure EASM root domains for asset discovery' },
    { title: 'Autonomous Policy Opt-in', icon: Zap,    desc: 'Define risk categories for ETM auto-remediation' },
  ]

  const sensors = [
    { id: 'wiz',   label: 'Wiz Connector',   product: 'Wiz (3rd party)',  icon: Layers,   status: 'connected', count: '5,841 resources', detail: 'Last sync: 6 min ago — AWS + Azure workloads' },
    { id: 'aqua',  label: 'Aqua Connector',  product: 'Aqua Security',    icon: Shield,   status: 'connected', count: '312 images',      detail: 'Last scan: 12 min ago — container image registry' },
    { id: 'vmdr',  label: 'VMDR Agents',     product: 'Qualys VMDR',      icon: Cpu,      status: 'connected', count: '2,847 agents',    detail: 'Last sync: 3 min ago' },
    { id: 'easm',  label: 'EASM Discovery',  product: 'Qualys EASM',      icon: Globe,    status: 'connected', count: '14,203 assets',   detail: 'Continuous crawl active' },
    { id: 'aws',   label: 'AWS Connector',   product: 'AWS / CSPM',       icon: Cloud,    status: 'connected', count: '3,412 resources', detail: 'us-east-1, eu-west-1' },
    { id: 'azure', label: 'Azure Connector', product: 'Azure / CSPM',     icon: Cloud,    status: 'warning',   count: '891 resources',   detail: 'Missing: Storage + Key Vault scopes' },
    { id: 'edr',   label: 'EDR / FIM',       product: 'Multi-Vector EDR', icon: Activity, status: 'connected', count: '1,203 endpoints', detail: 'FIM + process monitoring active' },
  ]

  const identityConnectors = [
    { id: 'ad',      label: 'Active Directory',   product: 'Qualys ISPM', icon: Users, status: 'connected',    detail: 'acme.corp — 4,821 users, 312 groups',        syncedAt: '8 min ago'  },
    { id: 'entra',   label: 'Microsoft Entra ID', product: 'Qualys ISPM', icon: Cloud, status: 'connected',    detail: 'Entra Connect — password writeback: ON',     syncedAt: '8 min ago'  },
    { id: 'aws-iam', label: 'AWS IAM',            product: 'Qualys CIEM', icon: Key,   status: 'warning',      detail: '847 roles — 37% carry AdministratorAccess',  syncedAt: '15 min ago' },
    { id: 'gcp-iam', label: 'GCP IAM',            product: 'Qualys CIEM', icon: Key,   status: 'disconnected', detail: 'Service account not configured',              syncedAt: null         },
  ]

  const statusConfig = {
    connected:    { color: 'text-emerald-400', dot: 'bg-emerald-400', label: 'Connected',       border: 'border-emerald-700/40', pulse: true  },
    warning:      { color: 'text-amber-400',   dot: 'bg-amber-400',   label: 'Needs Attention', border: 'border-amber-700/40',   pulse: false },
    disconnected: { color: 'text-slate-500',   dot: 'bg-slate-600',   label: 'Disconnected',    border: 'border-slate-700/40',   pulse: false },
  }

  const riskColor = {
    HIGH:   'text-red-400 bg-red-900/30 border-red-700/40',
    MEDIUM: 'text-amber-400 bg-amber-900/30 border-amber-700/40',
    LOW:    'text-emerald-400 bg-emerald-900/30 border-emerald-700/40',
  }

  const toggleCrown     = (id) => setCrownJewelPresets(p => p.map(x => x.id === id ? { ...x, on: !x.on } : x))
  const togglePolicy    = (id) => setPolicyToggles(p => p.map(x => x.id === id ? { ...x, on: !x.on } : x))
  const addDomain       = ()   => { if (domainInput.trim() && !domains.includes(domainInput.trim())) { setDomains(d => [...d, domainInput.trim()]); setDomainInput('') } }
  const removeDomain    = (d)  => setDomains(prev => prev.filter(x => x !== d))
  const addCustomJewel  = ()   => { if (customJewelInput.trim()) { setCustomJewels(prev => [...prev, { id: `cj-${Date.now()}`, label: customJewelInput.trim(), type: customJewelType }]); setCustomJewelInput('') } }
  const removeCustomJewel = (id) => setCustomJewels(prev => prev.filter(x => x.id !== id))

  const goNext = () => { setCompletedSteps(s => new Set([...s, step])); if (step < STEPS.length - 1) setStep(s => s + 1) }
  const goBack = () => setStep(s => Math.max(s - 1, 0))

  const renderStepContent = () => {
    switch (step) {

      case 0: return (
        <div className="space-y-2">
          {sensors.map(sensor => {
            const sc = statusConfig[sensor.status]
            const Icon = sensor.icon
            return (
              <div key={sensor.id} className={`flex items-center gap-3 p-3 rounded-lg bg-slate-900/50 border ${sc.border}`}>
                <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-medium text-white">{sensor.label}</span>
                    <span className="text-[10px] text-slate-500">{sensor.product}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">{sensor.detail}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className={`text-[11px] font-semibold ${sc.color}`}>{sensor.count}</div>
                  <div className="flex items-center gap-1 justify-end mt-0.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${sc.dot} ${sc.pulse ? 'animate-pulse' : ''}`} />
                    <span className={`text-[10px] ${sc.color}`}>{sc.label}</span>
                  </div>
                </div>
                {sensor.status === 'warning' && (
                  <button className="ml-1 px-2.5 py-1 bg-amber-700/60 hover:bg-amber-700 text-amber-200 text-[10px] rounded font-medium transition-colors shrink-0">Fix</button>
                )}
              </div>
            )
          })}
          <button className="w-full mt-1 py-2.5 rounded-lg border border-dashed border-teal-700/50 text-[11px] text-teal-400 hover:bg-teal-900/20 transition-colors flex items-center justify-center gap-1.5">
            <Plus className="w-3.5 h-3.5" /> Add New Sensor
          </button>
        </div>
      )

      case 1: return (
        <div className="space-y-2">
          {identityConnectors.map(conn => {
            const sc = statusConfig[conn.status]
            const Icon = conn.icon
            return (
              <div key={conn.id} className={`flex items-center gap-3 p-3 rounded-lg bg-slate-900/50 border ${sc.border}`}>
                <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-medium text-white">{conn.label}</span>
                    <span className="text-[10px] text-slate-500">{conn.product}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">{conn.detail}</div>
                </div>
                <div className="text-right shrink-0">
                  {conn.syncedAt && <div className="text-[10px] text-slate-500 mb-0.5">{conn.syncedAt}</div>}
                  <div className="flex items-center gap-1 justify-end">
                    <div className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                    <span className={`text-[10px] ${sc.color}`}>{sc.label}</span>
                  </div>
                </div>
                {conn.status === 'disconnected' && (
                  <button className="ml-1 px-2.5 py-1 bg-indigo-700 hover:bg-indigo-600 text-white text-[10px] rounded font-medium transition-colors shrink-0">Connect</button>
                )}
              </div>
            )
          })}
          <button className="w-full mt-1 py-2.5 rounded-lg border border-dashed border-purple-700/50 text-[11px] text-purple-400 hover:bg-purple-900/20 transition-colors flex items-center justify-center gap-1.5">
            <Plus className="w-3.5 h-3.5" /> Add Identity Source
          </button>
        </div>
      )

      case 2: return (
        <div>
          <div className="space-y-1.5 mb-4">
            {crownJewelPresets.map(preset => (
              <div key={preset.id} onClick={() => toggleCrown(preset.id)}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all
                  ${preset.on ? 'bg-yellow-900/10 border-yellow-700/40' : 'bg-slate-900/40 border-slate-700/60 hover:border-slate-600'}`}>
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${preset.on ? 'bg-yellow-500 border-yellow-500' : 'border-slate-600'}`}>
                  {preset.on && <CheckCircle className="w-3 h-3 text-slate-900" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-[12px] font-medium ${preset.on ? 'text-yellow-200' : 'text-slate-300'}`}>{preset.label}</div>
                  <div className="text-[10px] text-slate-500">{preset.desc}</div>
                </div>
                {preset.on && <span className="text-[9px] bg-yellow-900/40 text-yellow-400 border border-yellow-700/40 px-1.5 py-0.5 rounded font-semibold shrink-0">CROWN JEWEL</span>}
              </div>
            ))}
          </div>
          <div className="border-t border-slate-700 pt-4">
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-2">Manually Tag an Asset</div>
            <div className="flex gap-2 mb-2">
              <input type="text" value={customJewelInput} onChange={e => setCustomJewelInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addCustomJewel()}
                placeholder="Hostname or asset name"
                className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-[11px] text-white placeholder-slate-500 focus:outline-none focus:border-yellow-500" />
              <select value={customJewelType} onChange={e => setCustomJewelType(e.target.value)}
                className="bg-slate-900 border border-slate-600 rounded-lg px-2 py-2 text-[11px] text-white focus:outline-none focus:border-yellow-500">
                <option>Database</option><option>Domain Controller</option><option>Application Server</option>
                <option>Network Device</option><option>PAM / Vault</option><option>Cloud Resource</option><option>Custom</option>
              </select>
              <button onClick={addCustomJewel} className="px-3 py-2 bg-yellow-700 hover:bg-yellow-600 text-white text-[11px] rounded-lg font-medium transition-colors">+ Tag</button>
            </div>
            {customJewels.length === 0 ? (
              <div className="text-center py-4 text-[10px] text-slate-600 border border-dashed border-slate-700 rounded-lg">No custom assets tagged yet</div>
            ) : (
              <div className="space-y-1.5">
                {customJewels.map(jewel => (
                  <div key={jewel.id} className="flex items-center gap-2 p-2.5 bg-yellow-900/10 border border-yellow-700/40 rounded-lg">
                    <Target className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] font-medium text-yellow-200 truncate">{jewel.label}</div>
                      <div className="text-[10px] text-slate-500">{jewel.type}</div>
                    </div>
                    <span className="text-[9px] bg-yellow-900/40 text-yellow-400 border border-yellow-700/40 px-1.5 py-0.5 rounded font-semibold">CROWN JEWEL</span>
                    <button onClick={() => removeCustomJewel(jewel.id)} className="text-slate-600 hover:text-red-400 transition-colors"><X className="w-3.5 h-3.5" /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )

      case 3: return (
        <div>
          <div className="flex gap-2 mb-3">
            <input type="text" value={domainInput} onChange={e => setDomainInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addDomain()}
              placeholder="Enter root domain (e.g. acme.com)"
              className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-[11px] text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
            <button onClick={addDomain} className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white text-[11px] rounded-lg font-medium transition-colors">Add Domain</button>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {domains.map(d => (
              <span key={d} className="flex items-center gap-1.5 bg-blue-900/30 border border-blue-700/40 text-blue-300 text-[11px] px-2.5 py-1.5 rounded-full font-medium">
                <Globe className="w-3 h-3" />{d}
                <button onClick={() => removeDomain(d)} className="text-blue-500 hover:text-red-400 transition-colors ml-0.5"><X className="w-2.5 h-2.5" /></button>
              </span>
            ))}
          </div>
          <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-2">Latest EASM Crawl Results</div>
          <div className="space-y-3">
            {[
              { domain: 'acme.com',     subdomains: 847, shadow: 3, apis: 12, risk: 'HIGH'     },
              { domain: 'acme-corp.io', subdomains: 203, shadow: 4, apis: 7,  risk: 'CRITICAL' },
            ].map(r => (
              <div key={r.domain} className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[12px] font-semibold text-white">{r.domain}</span>
                  <SeverityBadge level={r.risk} />
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-slate-800 rounded-lg p-2">
                    <div className="text-[16px] font-bold text-white">{r.subdomains}</div>
                    <div className="text-[10px] text-slate-400">Subdomains</div>
                  </div>
                  <div className="bg-red-900/20 rounded-lg p-2 border border-red-800/30">
                    <div className="text-[16px] font-bold text-red-400">{r.shadow}</div>
                    <div className="text-[10px] text-slate-400">Shadow IT</div>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-2">
                    <div className="text-[16px] font-bold text-white">{r.apis}</div>
                    <div className="text-[10px] text-slate-400">APIs Found</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )

      case 4: return (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-[11px] text-slate-400">Select which risk categories the ETM engine acts on autonomously — "Fix It Safely"</p>
            <span className="text-[10px] bg-red-900/30 text-red-400 border border-red-700/40 px-2 py-0.5 rounded-full font-medium shrink-0 ml-3">
              {policyToggles.filter(p => p.on).length}/{policyToggles.length} active
            </span>
          </div>
          <div className="space-y-2">
            {policyToggles.map(policy => (
              <div key={policy.id} onClick={() => togglePolicy(policy.id)}
                className={`flex items-center gap-4 p-3.5 rounded-lg border cursor-pointer transition-all
                  ${policy.on ? 'bg-indigo-900/20 border-indigo-700/50' : 'bg-slate-900/40 border-slate-700/50 hover:border-slate-600'}`}>
                <div className={`relative w-9 h-5 rounded-full shrink-0 transition-colors duration-200 ${policy.on ? 'bg-indigo-600' : 'bg-slate-700'}`}>
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${policy.on ? 'translate-x-4' : 'translate-x-0.5'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-[12px] font-medium ${policy.on ? 'text-white' : 'text-slate-400'}`}>{policy.label}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded border font-semibold ${riskColor[policy.risk]}`}>{policy.risk}</span>
                  </div>
                  <div className="text-[11px] text-slate-500">{policy.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )

      default: return null
    }
  }

  const currentStep = STEPS[step]
  const StepIcon    = currentStep.icon
  const isLast      = step === STEPS.length - 1

  return (
    <div className="flex flex-col" style={{ minHeight: 0 }}>

      {/* ── Step Indicator ────────────────────────────────────────── */}
      <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 mb-4 shrink-0">
        <div className="flex items-start">
          {STEPS.map((s, i) => {
            const isDone    = completedSteps.has(i)
            const isCurrent = i === step
            const Icon      = s.icon
            return (
              <div key={i} className="flex items-start flex-1">
                <div className="flex flex-col items-center flex-1">
                  <button
                    onClick={() => setStep(i)}
                    className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all
                      ${isDone    ? 'bg-emerald-600 border-emerald-500' :
                        isCurrent ? 'bg-indigo-600 border-indigo-400 ring-2 ring-indigo-400/30' :
                                    'bg-slate-800 border-slate-600 hover:border-slate-500'}`}>
                    {isDone
                      ? <CheckCircle className="w-4 h-4 text-white" />
                      : <Icon className={`w-4 h-4 ${isCurrent ? 'text-white' : 'text-slate-500'}`} />
                    }
                  </button>
                  <div className={`text-[9px] mt-1.5 font-medium text-center leading-tight max-w-[72px]
                    ${isDone ? 'text-emerald-400' : isCurrent ? 'text-indigo-300' : 'text-slate-600'}`}>
                    {s.title}
                  </div>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`h-0.5 w-8 mt-4 mx-0.5 shrink-0 transition-colors ${completedSteps.has(i) ? 'bg-emerald-600' : 'bg-slate-700'}`} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Step Content Card ─────────────────────────────────────── */}
      <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5 overflow-y-auto flex-1">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-indigo-900/40 border border-indigo-700/40 flex items-center justify-center shrink-0">
            <StepIcon className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <div className="text-[13px] font-semibold text-white">{currentStep.title}</div>
            <div className="text-[11px] text-slate-400">{currentStep.desc}</div>
          </div>
          <div className="ml-auto text-[10px] text-slate-500 font-medium shrink-0">Step {step + 1} of {STEPS.length}</div>
        </div>
        {renderStepContent()}
      </div>

      {/* ── Navigation ────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700 shrink-0">
        <button
          onClick={goBack}
          disabled={step === 0}
          className="px-4 py-2 rounded-lg border border-slate-600 text-slate-300 text-[12px] font-medium hover:bg-slate-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2">
          <ChevronRight className="w-3.5 h-3.5 rotate-180" /> Back
        </button>
        <div className="flex gap-1.5 items-center">
          {STEPS.map((_, i) => (
            <button key={i} onClick={() => setStep(i)}
              className={`h-2 rounded-full transition-all duration-200 ${i === step ? 'bg-indigo-400 w-5' : completedSteps.has(i) ? 'bg-emerald-500 w-2' : 'bg-slate-700 w-2'}`} />
          ))}
        </div>
        {isLast ? (
          <button
            onClick={() => setCompletedSteps(new Set([0, 1, 2, 3, 4]))}
            className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[12px] font-semibold transition-colors flex items-center gap-2">
            <CheckCircle className="w-3.5 h-3.5" /> Complete Setup
          </button>
        ) : (
          <button
            onClick={goNext}
            className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[12px] font-semibold transition-colors flex items-center gap-2">
            Next <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

    </div>
  )
}

// ─── ConfigurationTab ──────────────────────────────────────────────────────────
function ConfigurationTab() {
  const [crownJewelPresets, setCrownJewelPresets] = useState([
    { id: 'preset-dc',   label: 'Domain Controllers',     desc: 'Tier-0 AD / Kerberos',               on: true  },
    { id: 'preset-pci',  label: 'PCI Payment Gateways',   desc: 'Cardholder data scope',               on: true  },
    { id: 'preset-db',   label: 'Production Databases',   desc: 'PII / financial data stores',         on: true  },
    { id: 'preset-pam',  label: 'PAM / Credential Vaults',desc: 'BeyondTrust, CyberArk, HashiCorp',    on: true  },
    { id: 'preset-iam',  label: 'IAM Control Planes',     desc: 'AWS Root, Azure Tenant Admin',        on: false },
    { id: 'preset-k8s',  label: 'Prod K8s Clusters',      desc: 'EKS / AKS control plane',             on: false },
    { id: 'preset-cicd', label: 'CI/CD Pipelines',        desc: 'Jenkins, GitHub Actions runners',     on: false },
    { id: 'preset-aiml', label: 'ML Model Registries',    desc: 'SageMaker, Azure ML, MLflow',         on: false },
  ])
  const [customJewels, setCustomJewels] = useState([])
  const [customJewelInput, setCustomJewelInput] = useState('')
  const [customJewelType, setCustomJewelType] = useState('Database')

  const [policyToggles, setPolicyToggles] = useState([
    { id: 'cisaKev',    label: 'CISA KEV Vulnerabilities',    desc: 'Auto-create remediation tickets for known exploited CVEs',       risk: 'HIGH',   on: true  },
    { id: 'nonProd',    label: 'Non-Production Environments', desc: 'Apply compensating controls to UAT / dev assets automatically',  risk: 'MEDIUM', on: false },
    { id: 'shadowIt',   label: 'Shadow IT / EASM Findings',   desc: 'Auto-quarantine unmanaged assets exceeding risk threshold',      risk: 'HIGH',   on: true  },
    { id: 'mfaEnforce', label: 'MFA Enforcement (Weak Auth)', desc: 'Auto-push MFA policy to accounts missing 2FA via ISPM',         risk: 'LOW',    on: true  },
    { id: 'patchVerif', label: 'Patch-Verified Remediations', desc: 'Auto-close findings after VMDR confirms patch applied',         risk: 'LOW',    on: false },
    { id: 'credGuard',  label: 'Credential Guard Rollout',    desc: 'Auto-deploy Credential Guard GPO to unprotected endpoints',     risk: 'MEDIUM', on: false },
  ])

  const [domains, setDomains] = useState(['acme.com', 'acme-corp.io'])
  const [domainInput, setDomainInput] = useState('')

  const toggleCrown  = (id) => setCrownJewelPresets(p => p.map(x => x.id === id ? { ...x, on: !x.on } : x))
  const togglePolicy = (id) => setPolicyToggles(p => p.map(x => x.id === id ? { ...x, on: !x.on } : x))
  const addDomain    = () => {
    if (domainInput.trim() && !domains.includes(domainInput.trim())) {
      setDomains(d => [...d, domainInput.trim()])
      setDomainInput('')
    }
  }
  const removeDomain      = (d)  => setDomains(prev => prev.filter(x => x !== d))
  const addCustomJewel    = ()   => {
    if (customJewelInput.trim()) {
      setCustomJewels(prev => [...prev, { id: `cj-${Date.now()}`, label: customJewelInput.trim(), type: customJewelType }])
      setCustomJewelInput('')
    }
  }
  const removeCustomJewel = (id) => setCustomJewels(prev => prev.filter(x => x.id !== id))

  const sensors = [
    { id: 'wiz',   label: 'Wiz Connector',    product: 'Wiz (3rd party)',    icon: Layers,   status: 'connected',    count: '5,841 resources', detail: 'Last sync: 6 min ago — AWS + Azure workloads' },
    { id: 'aqua',  label: 'Aqua Connector',   product: 'Aqua Security',      icon: Shield,   status: 'connected',    count: '312 images',      detail: 'Last scan: 12 min ago — container image registry' },
    { id: 'vmdr',  label: 'VMDR Agents',      product: 'Qualys VMDR',        icon: Cpu,      status: 'connected',    count: '2,847 agents',    detail: 'Last sync: 3 min ago' },
    { id: 'easm',  label: 'EASM Discovery',   product: 'Qualys EASM',        icon: Globe,    status: 'connected',    count: '14,203 assets',   detail: 'Continuous crawl active' },
    { id: 'aws',   label: 'AWS Connector',    product: 'AWS / CSPM',         icon: Cloud,    status: 'connected',    count: '3,412 resources', detail: 'us-east-1, eu-west-1' },
    { id: 'azure', label: 'Azure Connector',  product: 'Azure / CSPM',       icon: Cloud,    status: 'warning',      count: '891 resources',   detail: 'Missing: Storage + Key Vault scopes' },
    { id: 'edr',   label: 'EDR / FIM',        product: 'Multi-Vector EDR',   icon: Activity, status: 'connected',    count: '1,203 endpoints', detail: 'FIM + process monitoring active' },
  ]

  const identityConnectors = [
    { id: 'ad',      label: 'Active Directory',   product: 'Qualys ISPM', icon: Users, status: 'connected',    detail: 'acme.corp — 4,821 users, 312 groups',          syncedAt: '8 min ago'  },
    { id: 'entra',   label: 'Microsoft Entra ID', product: 'Qualys ISPM', icon: Cloud, status: 'connected',    detail: 'Entra Connect — password writeback: ON',       syncedAt: '8 min ago'  },
    { id: 'aws-iam', label: 'AWS IAM',            product: 'Qualys CIEM', icon: Key,   status: 'warning',      detail: '847 roles — 37% carry AdministratorAccess',    syncedAt: '15 min ago' },
    { id: 'gcp-iam', label: 'GCP IAM',            product: 'Qualys CIEM', icon: Key,   status: 'disconnected', detail: 'Service account not configured',                syncedAt: null         },
  ]

  const statusConfig = {
    connected:    { color: 'text-emerald-400', dot: 'bg-emerald-400', label: 'Connected',       border: 'border-emerald-700/40', pulse: true  },
    warning:      { color: 'text-amber-400',   dot: 'bg-amber-400',   label: 'Needs Attention', border: 'border-amber-700/40',   pulse: false },
    disconnected: { color: 'text-slate-500',   dot: 'bg-slate-600',   label: 'Disconnected',    border: 'border-slate-700/40',   pulse: false },
  }

  const riskColor = {
    HIGH:   'text-red-400 bg-red-900/30 border-red-700/40',
    MEDIUM: 'text-amber-400 bg-amber-900/30 border-amber-700/40',
    LOW:    'text-emerald-400 bg-emerald-900/30 border-emerald-700/40',
  }

  const connectedSensors = sensors.filter(s => s.status === 'connected').length
  const progress = Math.round((connectedSensors / sensors.length) * 100)

  return (
    <div className="space-y-5">

      {/* ── Progress Banner ───────────────────────────────────────────── */}
      <div className="rounded-xl border border-indigo-700/50 bg-indigo-900/20 p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-semibold text-white">Sensor Fabric Configuration</span>
              <span className="text-[10px] bg-indigo-700/40 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-600/40 font-medium">SETUP MODE</span>
            </div>
            <p className="text-[11px] text-slate-400">Configure the Autonomous Sensor Fabric, identity integrations, crown jewels, and risk policy to activate full attack path analysis.</p>
          </div>
          <div className="text-right shrink-0 ml-4">
            <div className="text-2xl font-bold text-indigo-300">{progress}%</div>
            <div className="text-[10px] text-slate-400">fabric active</div>
          </div>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-1.5">
          <div className="bg-indigo-500 h-1.5 rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex gap-4 mt-2">
          <span className="text-[10px] text-emerald-400">✓ {connectedSensors} sensors connected</span>
          <span className="text-[10px] text-amber-400">⚠ 1 needs attention</span>
        </div>
      </div>

      {/* ── Row 1: Sensor Fabric | Identity Sync ─────────────────────── */}
      <div className="grid grid-cols-2 gap-4">

        {/* 1. Sensor Fabric Activation */}
        <section className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-lg bg-teal-900/40 border border-teal-700/40 flex items-center justify-center">
              <Wifi className="w-3.5 h-3.5 text-teal-400" />
            </div>
            <div>
              <div className="text-[12px] font-semibold text-white">1. Sensor Fabric Activation</div>
              <div className="text-[10px] text-slate-400">Real-time health of data collection integrations</div>
            </div>
            <span className="ml-auto text-[10px] font-semibold text-teal-300">{connectedSensors}/{sensors.length}</span>
          </div>
          <div className="space-y-2">
            {sensors.map(sensor => {
              const sc   = statusConfig[sensor.status]
              const Icon = sensor.icon
              return (
                <div key={sensor.id} className={`flex items-center gap-3 p-2.5 rounded-lg bg-slate-900/50 border ${sc.border}`}>
                  <div className="w-7 h-7 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                    <Icon className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-medium text-white">{sensor.label}</span>
                      <span className="text-[9px] text-slate-500">{sensor.product}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">{sensor.detail}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className={`text-[10px] font-semibold ${sc.color}`}>{sensor.count}</div>
                    <div className="flex items-center gap-1 justify-end mt-0.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${sc.dot} ${sc.pulse ? 'animate-pulse' : ''}`} />
                      <span className={`text-[9px] ${sc.color}`}>{sc.label}</span>
                    </div>
                  </div>
                  {sensor.status === 'warning' && (
                    <button className="ml-1 px-2 py-1 bg-amber-700/60 hover:bg-amber-700 text-amber-200 text-[9px] rounded font-medium transition-colors shrink-0">Fix</button>
                  )}
                </div>
              )
            })}
          </div>
          <button className="w-full mt-2 py-2 rounded-lg border border-dashed border-teal-700/50 text-[11px] text-teal-400 hover:bg-teal-900/20 transition-colors flex items-center justify-center gap-1.5">
            <Plus className="w-3 h-3" /> Add New Sensor
          </button>
        </section>

        {/* 2. Identity & Domain Sync */}
        <section className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-lg bg-purple-900/40 border border-purple-700/40 flex items-center justify-center">
              <Users className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div>
              <div className="text-[12px] font-semibold text-white">2. Identity &amp; Domain Sync</div>
              <div className="text-[10px] text-slate-400">AD/IAM integrations for lateral movement mapping</div>
            </div>
          </div>
          <div className="space-y-2 mb-2">
            {identityConnectors.map(conn => {
              const sc   = statusConfig[conn.status]
              const Icon = conn.icon
              return (
                <div key={conn.id} className={`flex items-center gap-3 p-2.5 rounded-lg bg-slate-900/50 border ${sc.border}`}>
                  <div className="w-7 h-7 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                    <Icon className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-medium text-white">{conn.label}</span>
                      <span className="text-[9px] text-slate-500">{conn.product}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">{conn.detail}</div>
                  </div>
                  <div className="text-right shrink-0">
                    {conn.syncedAt && <div className="text-[9px] text-slate-500 mb-0.5">{conn.syncedAt}</div>}
                    <div className="flex items-center gap-1 justify-end">
                      <div className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                      <span className={`text-[9px] ${sc.color}`}>{sc.label}</span>
                    </div>
                  </div>
                  {conn.status === 'disconnected' && (
                    <button className="ml-1 px-2 py-1 bg-indigo-700 hover:bg-indigo-600 text-white text-[9px] rounded font-medium transition-colors shrink-0">Connect</button>
                  )}
                </div>
              )
            })}
          </div>
          <button className="w-full py-2 rounded-lg border border-dashed border-purple-700/50 text-[11px] text-purple-400 hover:bg-purple-900/20 transition-colors flex items-center justify-center gap-1.5">
            <Plus className="w-3 h-3" /> Add Identity Source
          </button>
        </section>
      </div>

      {/* ── Row 2: Crown Jewel Selector | External Surface Mapping ──── */}
      <div className="grid grid-cols-2 gap-4">

        {/* 3. Crown Jewel Selector */}
        <section className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-lg bg-yellow-900/40 border border-yellow-700/40 flex items-center justify-center">
              <Target className="w-3.5 h-3.5 text-yellow-400" />
            </div>
            <div>
              <div className="text-[12px] font-semibold text-white">3. Crown Jewel Selector</div>
              <div className="text-[10px] text-slate-400">Tag mission-critical asset classes for blast radius scoring</div>
            </div>
          </div>
          {/* Presets */}
          <div className="space-y-1.5 mb-3">
            {crownJewelPresets.map(preset => (
              <div key={preset.id} onClick={() => toggleCrown(preset.id)}
                className={`flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-all
                  ${preset.on ? 'bg-yellow-900/10 border-yellow-700/40' : 'bg-slate-900/40 border-slate-700/60 hover:border-slate-600'}`}>
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${preset.on ? 'bg-yellow-500 border-yellow-500' : 'border-slate-600'}`}>
                  {preset.on && <CheckCircle className="w-3 h-3 text-slate-900" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-[11px] font-medium ${preset.on ? 'text-yellow-200' : 'text-slate-300'}`}>{preset.label}</div>
                  <div className="text-[10px] text-slate-500">{preset.desc}</div>
                </div>
                {preset.on && <span className="text-[9px] bg-yellow-900/40 text-yellow-400 border border-yellow-700/40 px-1.5 py-0.5 rounded font-semibold shrink-0">CROWN JEWEL</span>}
              </div>
            ))}
          </div>
          {/* Manual tag */}
          <div className="border-t border-slate-700 pt-3">
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-2">Manually Tag an Asset</div>
            <div className="flex gap-2 mb-2">
              <input type="text" value={customJewelInput} onChange={e => setCustomJewelInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addCustomJewel()}
                placeholder="Hostname or asset name"
                className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-2.5 py-1.5 text-[11px] text-white placeholder-slate-500 focus:outline-none focus:border-yellow-500" />
              <select value={customJewelType} onChange={e => setCustomJewelType(e.target.value)}
                className="bg-slate-900 border border-slate-600 rounded-lg px-2 py-1.5 text-[11px] text-white focus:outline-none focus:border-yellow-500">
                <option>Database</option><option>Domain Controller</option><option>Application Server</option>
                <option>Network Device</option><option>PAM / Vault</option><option>Cloud Resource</option><option>Custom</option>
              </select>
              <button onClick={addCustomJewel} className="px-2.5 py-1.5 bg-yellow-700 hover:bg-yellow-600 text-white text-[10px] rounded-lg font-medium transition-colors">+ Tag</button>
            </div>
            {customJewels.length === 0 ? (
              <div className="text-center py-3 text-[10px] text-slate-600 border border-dashed border-slate-700 rounded-lg">No custom assets tagged yet</div>
            ) : (
              <div className="space-y-1.5">
                {customJewels.map(jewel => (
                  <div key={jewel.id} className="flex items-center gap-2 p-2 bg-yellow-900/10 border border-yellow-700/40 rounded-lg">
                    <Target className="w-3 h-3 text-yellow-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-medium text-yellow-200 truncate">{jewel.label}</div>
                      <div className="text-[9px] text-slate-500">{jewel.type}</div>
                    </div>
                    <span className="text-[9px] bg-yellow-900/40 text-yellow-400 border border-yellow-700/40 px-1.5 py-0.5 rounded font-semibold">CROWN JEWEL</span>
                    <button onClick={() => removeCustomJewel(jewel.id)} className="text-slate-600 hover:text-red-400 transition-colors"><X className="w-3 h-3" /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 4. External Surface Mapping */}
        <section className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-lg bg-blue-900/40 border border-blue-700/40 flex items-center justify-center">
              <Globe className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div>
              <div className="text-[12px] font-semibold text-white">4. External Surface Mapping</div>
              <div className="text-[10px] text-slate-400">EASM root domains — discover shadow subdomains &amp; APIs</div>
            </div>
          </div>
          <div className="flex gap-2 mb-3">
            <input type="text" value={domainInput} onChange={e => setDomainInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addDomain()}
              placeholder="Enter root domain (e.g. acme.com)"
              className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-[11px] text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
            <button onClick={addDomain} className="px-3 py-2 bg-blue-700 hover:bg-blue-600 text-white text-[11px] rounded-lg font-medium transition-colors">Add</button>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {domains.map(d => (
              <span key={d} className="flex items-center gap-1.5 bg-blue-900/30 border border-blue-700/40 text-blue-300 text-[10px] px-2 py-1 rounded-full font-medium">
                <Globe className="w-2.5 h-2.5" />{d}
                <button onClick={() => removeDomain(d)} className="text-blue-500 hover:text-red-400 transition-colors"><X className="w-2.5 h-2.5" /></button>
              </span>
            ))}
          </div>
          <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-2">Latest EASM Crawl</div>
          <div className="space-y-2">
            {[
              { domain: 'acme.com',     subdomains: 847, shadow: 3, apis: 12, risk: 'HIGH'     },
              { domain: 'acme-corp.io', subdomains: 203, shadow: 4, apis: 7,  risk: 'CRITICAL' },
            ].map(r => (
              <div key={r.domain} className="bg-slate-900/60 border border-slate-700/60 rounded-lg p-2.5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-medium text-white">{r.domain}</span>
                  <SeverityBadge level={r.risk} />
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-slate-800 rounded p-1.5">
                    <div className="text-[13px] font-bold text-white">{r.subdomains}</div>
                    <div className="text-[9px] text-slate-400">Subdomains</div>
                  </div>
                  <div className="bg-red-900/20 rounded p-1.5 border border-red-800/30">
                    <div className="text-[13px] font-bold text-red-400">{r.shadow}</div>
                    <div className="text-[9px] text-slate-400">Shadow IT</div>
                  </div>
                  <div className="bg-slate-800 rounded p-1.5">
                    <div className="text-[13px] font-bold text-white">{r.apis}</div>
                    <div className="text-[9px] text-slate-400">APIs Found</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── Row 3: Autonomous Policy Opt-in ──────────────────────────── */}
      <section className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-red-900/40 border border-red-700/40 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-red-400" />
            </div>
            <div>
              <div className="text-[12px] font-semibold text-white">5. Autonomous Policy Opt-in</div>
              <div className="text-[10px] text-slate-400">Classify which risk categories the ETM engine acts on autonomously — "Fix It Safely"</div>
            </div>
          </div>
          <span className="text-[10px] bg-red-900/30 text-red-400 border border-red-700/40 px-2 py-0.5 rounded-full font-medium">
            {policyToggles.filter(p => p.on).length}/{policyToggles.length} active
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {policyToggles.map(policy => (
            <div key={policy.id} onClick={() => togglePolicy(policy.id)}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all
                ${policy.on ? 'bg-indigo-900/20 border-indigo-700/50' : 'bg-slate-900/40 border-slate-700/50 hover:border-slate-600'}`}>
              <div className={`relative w-9 h-5 rounded-full shrink-0 transition-colors duration-200 ${policy.on ? 'bg-indigo-600' : 'bg-slate-700'}`}>
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${policy.on ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className={`text-[11px] font-medium ${policy.on ? 'text-white' : 'text-slate-400'}`}>{policy.label}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded border font-semibold ${riskColor[policy.risk]}`}>{policy.risk}</span>
                </div>
                <div className="text-[10px] text-slate-500 leading-tight">{policy.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}

// ─── Shared data & helpers for Current Release tabs ──────────────────────────
const CR_TAG_GROUPS = [
  {
    group: 'Environment',        source: 'CSAM',
    color: 'indigo',
    tags: ['Production', 'Staging', 'Development', 'UAT', 'Disaster Recovery', 'Sandbox'],
    defaultOn: ['Production', 'UAT'],
  },
  {
    group: 'Asset Criticality',  source: 'UAI',
    color: 'red',
    tags: ['Mission Critical', 'High', 'Medium', 'Low', 'Unclassified'],
    defaultOn: ['Mission Critical', 'High'],
  },
  {
    group: 'Cloud Provider',     source: 'CSAM',
    color: 'blue',
    tags: ['AWS', 'Azure', 'GCP', 'On-Premises', 'Hybrid'],
    defaultOn: ['AWS', 'Azure'],
  },
  {
    group: 'Asset Type',         source: 'UAI',
    color: 'teal',
    tags: ['Server', 'Workstation', 'Container', 'Database', 'Network Device', 'Serverless', 'IoT'],
    defaultOn: ['Server', 'Database', 'Container'],
  },
  {
    group: 'Business Unit',      source: 'CSAM',
    color: 'purple',
    tags: ['Finance', 'Engineering', 'HR', 'Sales', 'Operations', 'Legal', 'Marketing'],
    defaultOn: ['Finance', 'Engineering'],
  },
  {
    group: 'Compliance Scope',   source: 'UAI',
    color: 'amber',
    tags: ['PCI-DSS', 'HIPAA', 'SOC 2', 'ISO 27001', 'FedRAMP', 'GDPR'],
    defaultOn: ['PCI-DSS', 'SOC 2'],
  },
]

const CR_COLOR = {
  indigo: { pill: 'bg-indigo-900/30 border-indigo-700/50 text-indigo-300',   active: 'bg-indigo-600 border-indigo-500 text-white',   badge: 'bg-indigo-900/40 text-indigo-300 border-indigo-700/40', header: 'text-indigo-400' },
  red:    { pill: 'bg-red-900/20 border-red-700/40 text-red-400',            active: 'bg-red-600 border-red-500 text-white',         badge: 'bg-red-900/30 text-red-300 border-red-700/40',         header: 'text-red-400' },
  blue:   { pill: 'bg-blue-900/30 border-blue-700/50 text-blue-300',         active: 'bg-blue-600 border-blue-500 text-white',       badge: 'bg-blue-900/30 text-blue-300 border-blue-700/40',      header: 'text-blue-400' },
  teal:   { pill: 'bg-teal-900/20 border-teal-700/40 text-teal-300',         active: 'bg-teal-600 border-teal-500 text-white',       badge: 'bg-teal-900/30 text-teal-300 border-teal-700/40',      header: 'text-teal-400' },
  purple: { pill: 'bg-purple-900/30 border-purple-700/50 text-purple-300',   active: 'bg-purple-600 border-purple-500 text-white',   badge: 'bg-purple-900/30 text-purple-300 border-purple-700/40',header: 'text-purple-400' },
  amber:  { pill: 'bg-amber-900/20 border-amber-700/40 text-amber-300',      active: 'bg-amber-600 border-amber-500 text-white',     badge: 'bg-amber-900/30 text-amber-300 border-amber-700/40',   header: 'text-amber-400' },
}

const CR_DEFAULT_SELECTED = new Set(
  CR_TAG_GROUPS.flatMap(g => g.defaultOn.map(t => `${g.group}::${t}`))
)

const CR_DEFAULT_IPS = [
  { id: 'ip-1', range: '10.0.0.0/8',      label: 'Corporate Internal Network',  added: '2 days ago' },
  { id: 'ip-2', range: '172.16.0.0/12',   label: 'Private VPN Range',           added: '2 days ago' },
  { id: 'ip-3', range: '192.168.1.0/24',  label: 'HQ Office LAN',               added: '5 days ago' },
]

// Shared Tag Selector section JSX renderer
function TagSelectorSection({ selectedTags, onToggle }) {
  const totalSelected = selectedTags.size
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] text-slate-400">Select tags from CSAM / UAI to scope which assets are included in attack path analysis.</p>
        <span className="text-[10px] font-semibold bg-indigo-900/30 text-indigo-300 border border-indigo-700/40 px-2 py-0.5 rounded-full shrink-0 ml-3">{totalSelected} selected</span>
      </div>
      <div className="space-y-4">
        {CR_TAG_GROUPS.map(group => {
          const c = CR_COLOR[group.color]
          return (
            <div key={group.group}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] font-semibold uppercase tracking-wider ${c.header}`}>{group.group}</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded border font-medium ${c.badge}`}>{group.source}</span>
                <div className="flex-1 h-px bg-slate-700/60" />
                <span className="text-[9px] text-slate-500">
                  {group.tags.filter(t => selectedTags.has(`${group.group}::${t}`)).length}/{group.tags.length}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {group.tags.map(tag => {
                  const key = `${group.group}::${tag}`
                  const on  = selectedTags.has(key)
                  return (
                    <button
                      key={tag}
                      onClick={() => onToggle(key)}
                      className={`px-2.5 py-1 rounded-full border text-[11px] font-medium transition-all ${on ? c.active : c.pill + ' hover:opacity-80'}`}>
                      {on && <span className="mr-1 text-[10px]">✓</span>}
                      {tag}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Shared IP Whitelist section JSX renderer
function IpWhitelistSection({ ipRanges, setIpRanges }) {
  const [ipInput,   setIpInput]   = useState('')
  const [ipLabel,   setIpLabel]   = useState('')

  const addIp = () => {
    const val = ipInput.trim()
    if (!val) return
    const cidr = /^[\d.]+\/\d+$/.test(val) || /^[\d.]+$/.test(val)
    setIpRanges(prev => [...prev, { id: `ip-${Date.now()}`, range: val, label: ipLabel.trim() || 'Custom Range', added: 'just now' }])
    setIpInput(''); setIpLabel('')
  }

  return (
    <div>
      <p className="text-[11px] text-slate-400 mb-4">
        Whitelist IP addresses or CIDR ranges so the EASM engine can identify shadow assets that belong to your organisation but are not yet in inventory.
      </p>
      {/* Input row */}
      <div className="flex gap-2 mb-4">
        <input
          type="text" value={ipInput} onChange={e => setIpInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addIp()}
          placeholder="IP address or CIDR (e.g. 10.0.0.0/8)"
          className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-[11px] text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
        <input
          type="text" value={ipLabel} onChange={e => setIpLabel(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addIp()}
          placeholder="Label (optional)"
          className="w-44 bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-[11px] text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
        <button onClick={addIp}
          className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white text-[11px] rounded-lg font-semibold transition-colors flex items-center gap-1.5">
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </div>
      {/* Whitelisted ranges */}
      {ipRanges.length === 0 ? (
        <div className="text-center py-6 text-[11px] text-slate-600 border border-dashed border-slate-700 rounded-lg">
          No IP ranges whitelisted yet
        </div>
      ) : (
        <div className="space-y-2">
          {ipRanges.map(ip => (
            <div key={ip.id} className="flex items-center gap-3 p-3 bg-slate-900/60 border border-blue-700/30 rounded-lg">
              <div className="w-7 h-7 rounded-md bg-blue-900/30 border border-blue-700/40 flex items-center justify-center shrink-0">
                <Globe className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-mono font-semibold text-white">{ip.range}</span>
                  <span className="text-[10px] text-slate-400">{ip.label}</span>
                </div>
                <div className="text-[10px] text-slate-500">Added {ip.added}</div>
              </div>
              <span className="text-[9px] bg-blue-900/30 text-blue-300 border border-blue-700/40 px-1.5 py-0.5 rounded font-medium shrink-0">WHITELISTED</span>
              <button onClick={() => setIpRanges(prev => prev.filter(x => x.id !== ip.id))}
                className="text-slate-600 hover:text-red-400 transition-colors ml-1">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="mt-3 p-3 bg-slate-900/40 border border-slate-700/50 rounded-lg">
        <p className="text-[10px] text-slate-500 leading-relaxed">
          <span className="text-slate-400 font-medium">How it works:</span> The EASM crawler compares discovered external assets against whitelisted ranges. Assets within these ranges that are not in your CSAM inventory are flagged as <span className="text-amber-400 font-medium">Shadow IT</span> and automatically added to attack path analysis as potential entry points.
        </p>
      </div>
    </div>
  )
}

// ─── CurrentReleaseInitialConfigTab (2-step wizard) ──────────────────────────
function CurrentReleaseInitialConfigTab() {
  const [step, setStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState(new Set())
  const [selectedTags, setSelectedTags] = useState(new Set(CR_DEFAULT_SELECTED))
  const [ipRanges, setIpRanges] = useState([...CR_DEFAULT_IPS])

  const STEPS = [
    { title: 'Asset Tag Selection',              icon: Tag,    desc: 'Choose CSAM / UAI tags to scope attack path coverage' },
    { title: 'Shadow Asset IP Identification',   icon: Globe,  desc: 'Whitelist IP ranges for EASM shadow asset discovery' },
  ]

  const toggleTag = (key) => setSelectedTags(prev => {
    const next = new Set(prev)
    next.has(key) ? next.delete(key) : next.add(key)
    return next
  })

  const goNext = () => { setCompletedSteps(s => new Set([...s, step])); if (step < STEPS.length - 1) setStep(s => s + 1) }
  const goBack = () => setStep(s => Math.max(s - 1, 0))

  const currentStep = STEPS[step]
  const StepIcon    = currentStep.icon
  const isLast      = step === STEPS.length - 1

  return (
    <div className="flex flex-col" style={{ minHeight: 0 }}>

      {/* Step Indicator */}
      <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 mb-4 shrink-0">
        <div className="flex items-start">
          {STEPS.map((s, i) => {
            const isDone    = completedSteps.has(i)
            const isCurrent = i === step
            const Icon      = s.icon
            return (
              <div key={i} className="flex items-start flex-1">
                <div className="flex flex-col items-center flex-1">
                  <button
                    onClick={() => setStep(i)}
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all
                      ${isDone    ? 'bg-emerald-600 border-emerald-500' :
                        isCurrent ? 'bg-indigo-600 border-indigo-400 ring-2 ring-indigo-400/30' :
                                    'bg-slate-800 border-slate-600 hover:border-slate-500'}`}>
                    {isDone ? <CheckCircle className="w-5 h-5 text-white" />
                            : <Icon className={`w-5 h-5 ${isCurrent ? 'text-white' : 'text-slate-500'}`} />}
                  </button>
                  <div className={`text-[10px] mt-2 font-medium text-center max-w-[100px]
                    ${isDone ? 'text-emerald-400' : isCurrent ? 'text-indigo-300' : 'text-slate-600'}`}>
                    {s.title}
                  </div>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`h-0.5 w-16 mt-5 mx-2 shrink-0 transition-colors ${completedSteps.has(i) ? 'bg-emerald-600' : 'bg-slate-700'}`} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5 overflow-y-auto flex-1">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-indigo-900/40 border border-indigo-700/40 flex items-center justify-center shrink-0">
            <StepIcon className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <div className="text-[13px] font-semibold text-white">{currentStep.title}</div>
            <div className="text-[11px] text-slate-400">{currentStep.desc}</div>
          </div>
          <div className="ml-auto text-[10px] text-slate-500 font-medium shrink-0">Step {step + 1} of {STEPS.length}</div>
        </div>
        {step === 0 && <TagSelectorSection selectedTags={selectedTags} onToggle={toggleTag} />}
        {step === 1 && <IpWhitelistSection ipRanges={ipRanges} setIpRanges={setIpRanges} />}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700 shrink-0">
        <button onClick={goBack} disabled={step === 0}
          className="px-4 py-2 rounded-lg border border-slate-600 text-slate-300 text-[12px] font-medium hover:bg-slate-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2">
          <ChevronRight className="w-3.5 h-3.5 rotate-180" /> Back
        </button>
        <div className="flex gap-1.5 items-center">
          {STEPS.map((_, i) => (
            <button key={i} onClick={() => setStep(i)}
              className={`h-2 rounded-full transition-all duration-200 ${i === step ? 'bg-indigo-400 w-5' : completedSteps.has(i) ? 'bg-emerald-500 w-2' : 'bg-slate-700 w-2'}`} />
          ))}
        </div>
        {isLast ? (
          <button onClick={() => setCompletedSteps(new Set([0, 1]))}
            className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[12px] font-semibold transition-colors flex items-center gap-2">
            <CheckCircle className="w-3.5 h-3.5" /> Complete Setup
          </button>
        ) : (
          <button onClick={goNext}
            className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[12px] font-semibold transition-colors flex items-center gap-2">
            Next <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

    </div>
  )
}

// ─── CurrentReleaseConfigTab (flat single-screen) ────────────────────────────
function CurrentReleaseConfigTab() {
  const [selectedTags, setSelectedTags] = useState(new Set(CR_DEFAULT_SELECTED))
  const [ipRanges,     setIpRanges]     = useState([...CR_DEFAULT_IPS])

  const toggleTag = (key) => setSelectedTags(prev => {
    const next = new Set(prev)
    next.has(key) ? next.delete(key) : next.add(key)
    return next
  })

  return (
    <div className="space-y-5">

      {/* Section 1 — Tag Selection */}
      <section className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-lg bg-indigo-900/40 border border-indigo-700/40 flex items-center justify-center">
            <Tag className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div>
            <div className="text-[12px] font-semibold text-white">1. Asset Tag Selection</div>
            <div className="text-[10px] text-slate-400">Prepopulated from CSAM / UAI — select tags to scope attack path analysis</div>
          </div>
          <span className="ml-auto text-[10px] font-semibold bg-indigo-900/30 text-indigo-300 border border-indigo-700/40 px-2 py-0.5 rounded-full shrink-0">
            {selectedTags.size} selected
          </span>
        </div>
        <TagSelectorSection selectedTags={selectedTags} onToggle={toggleTag} />
      </section>

      {/* Section 2 — IP Whitelist */}
      <section className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-lg bg-blue-900/40 border border-blue-700/40 flex items-center justify-center">
            <Globe className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div>
            <div className="text-[12px] font-semibold text-white">2. Shadow Asset IP Identification</div>
            <div className="text-[10px] text-slate-400">Add / whitelist IP ranges for EASM shadow asset discovery</div>
          </div>
          <span className="ml-auto text-[10px] font-semibold bg-blue-900/30 text-blue-300 border border-blue-700/40 px-2 py-0.5 rounded-full shrink-0">
            {ipRanges.length} range{ipRanges.length !== 1 ? 's' : ''}
          </span>
        </div>
        <IpWhitelistSection ipRanges={ipRanges} setIpRanges={setIpRanges} />
      </section>

    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function AttackPathInsights({ embedded = false }) {
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
    { id: 'discover',   label: '01  Discover',   icon: Eye,    desc: 'Browse & filter attack paths' },
    { id: 'analyze',    label: '02  Analyze',    icon: Target, desc: 'Drill into a specific path'  },
    { id: 'remediate',  label: '03  Remediate',  icon: Wrench, desc: 'Recommended remediation actions' },
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

  // ── Shared inner content (tabs + tab body) ──────────────────────────────────
  const innerContent = (
    <div className={embedded ? 'flex flex-col h-full bg-slate-900' : ''}>
      {/* Page heading — hidden when embedded */}
      {!embedded && (
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <GitBranch className="w-5 h-5 text-indigo-400" />
              <h1 className="text-lg font-bold text-white">Attack Paths</h1>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className={`flex border-b border-slate-700 gap-1 ${embedded ? 'px-5 pt-4 shrink-0' : 'mb-5'}`}>
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
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className={embedded ? 'flex-1 overflow-y-auto px-5 py-4' : ''}>
        {activeTab === 'discover'   && <DiscoverTab onSelectPath={handleSelectPath} onOpenResource={handleOpenResource} />}
        {activeTab === 'analyze'    && <AnalyzeTab  selectedPath={selectedPath} onSelectPath={(p) => { setSelectedPath(p); if (!p) setActiveTab('discover') }} onOpenResource={handleOpenResource} onNavigateToRemediate={() => setActiveTab('remediate')} />}
        {activeTab === 'remediate'  && <RemediateTab selectedPath={selectedPath} onSelectPath={handleSelectPath} onOpenResource={handleOpenResource} onNavigateToAnalyze={() => setActiveTab('analyze')} />}
        {activeTab === 'initial'    && <InitialConfigurationTab />}
        {activeTab === 'configure'  && <ConfigurationTab />}
        {activeTab === 'cr-initial' && <CurrentReleaseInitialConfigTab />}
        {activeTab === 'cr-config'  && <CurrentReleaseConfigTab />}
      </div>

      {/* Resource Detail Panel */}
      {resourcePanelId && (
        <ResourceDetailPanel
          resourceId={resourcePanelId}
          onClose={handleCloseResource}
          onSelectPath={handleSelectPath}
        />
      )}
    </div>
  )

  // ── Embedded mode — no outer chrome ─────────────────────────────────────────
  if (embedded) return innerContent

  // ── Standalone mode — full page with header + sidebar ───────────────────────
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
                  onClick={() => {
                    if (item.label === 'Risk Management') window.location.hash = '/risk-management'
                  }}
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
              {innerContent}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
