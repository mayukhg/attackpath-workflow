import { useState } from 'react'
import { Target, X, Server, Network, UserCircle, Shield, FolderGit2 } from 'lucide-react'

export default function AttackPathOnboarding() {
  // Section 1: Crown Jewels
  const [tags, setTags] = useState(['Customer Database', 'Source Code Repository', 'Financial Records'])
  const AVAILABLE_TAGS = ['Customer Database', 'Source Code Repository', 'Financial Records', 'PCI-DSS', 'PII', 'Production', 'Authentication Server']

  // Section 2: Identity Sources
  const [identitySources, setIdentitySources] = useState({ ad: true, aws: false, okta: true })

  // Section 3: Exclusions
  const [exemptIps, setExemptIps] = useState('')
  const [exemptDomains, setExemptDomains] = useState('')
  const [serviceAccounts, setServiceAccounts] = useState('')

  // Section 4: Risk SLA
  const [riskTolerance, setRiskTolerance] = useState(2) // 1=Low, 2=Medium, 3=High

  const handleAddTag = (e) => {
    const selectedTag = e.target.value
    if (selectedTag && !tags.includes(selectedTag)) {
      setTags([...tags, selectedTag])
    }
    e.target.value = ''
  }

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove))
  }

  return (
    <div className="flex flex-col h-full bg-[#0d1117] text-slate-200 overflow-y-auto">
      
      {/* Container to match screenshot style */}
      <div className="max-w-5xl mx-auto w-full p-8 flex flex-col gap-6 min-h-min pb-20">
        
        {/* Header */}
        <div className="bg-slate-900/50 p-6 rounded-t-lg border-b-0">
          <h1 className="text-2xl font-bold text-white">Attack Path Configuration Wizard</h1>
        </div>

        {/* 2x2 Grid */}
        <div className="grid grid-cols-2 gap-6">
          
          {/* Top Left: Crown Jewels Definition */}
          <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-6 flex flex-col shadow-sm">
            <h2 className="text-lg font-semibold text-white mb-4">Crown Jewels Definition</h2>
            <label className="text-[11px] text-slate-400 mb-2 uppercase font-medium tracking-wider">Tags</label>
            <div className="border border-blue-500/50 rounded-md bg-slate-900/50 p-3 min-h-[120px] focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
              <select 
                onChange={handleAddTag}
                className="w-full bg-transparent border-none outline-none text-[12px] text-slate-400 cursor-pointer mb-3"
                defaultValue=""
              >
                <option value="" disabled className="bg-slate-800 text-slate-400">Enter tags for critical assets</option>
                {AVAILABLE_TAGS.filter(t => !tags.includes(t)).map(tag => (
                  <option key={tag} value={tag} className="bg-slate-800 text-slate-200">{tag}</option>
                ))}
              </select>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <div key={tag} className="flex items-center gap-1 bg-slate-700/60 text-slate-300 px-2.5 py-1 rounded-md text-[11px] font-medium border border-slate-600/50">
                    {tag}
                    <button onClick={() => handleRemoveTag(tag)} className="hover:text-white ml-1">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Right: Identity Sources */}
          <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-6 flex flex-col shadow-sm">
            <h2 className="text-lg font-semibold text-white mb-2">Identity Sources</h2>
            <p className="text-[12px] text-slate-400 mb-6">Choose the Identity providers which should be considered as input data sources for attack path computation</p>
            
            <div className="flex flex-col gap-4">
              {/* Active Directory */}
              <div className="flex items-center justify-between py-2 border-b border-slate-700/50">
                <div className="flex items-center gap-3">
                  <Network className="w-5 h-5 text-blue-400" />
                  <span className="text-[13px] font-medium text-slate-200">Active Directory</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={identitySources.ad} onChange={() => setIdentitySources({...identitySources, ad: !identitySources.ad})} />
                  <div className="w-9 h-5 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>
              {/* AWS IAM */}
              <div className="flex items-center justify-between py-2 border-b border-slate-700/50">
                <div className="flex items-center gap-3">
                  <Server className="w-5 h-5 text-orange-400" />
                  <span className="text-[13px] font-medium text-slate-200">AWS IAM</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={identitySources.aws} onChange={() => setIdentitySources({...identitySources, aws: !identitySources.aws})} />
                  <div className="w-9 h-5 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>
              {/* Okta */}
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <UserCircle className="w-5 h-5 text-blue-500" />
                  <span className="text-[13px] font-medium text-slate-200">Okta</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={identitySources.okta} onChange={() => setIdentitySources({...identitySources, okta: !identitySources.okta})} />
                  <div className="w-9 h-5 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Bottom Left: Exclusions & Tuning */}
          <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-6 flex flex-col shadow-sm">
            <h2 className="text-lg font-semibold text-white mb-1">Exclusions</h2>
            <p className="text-[12px] text-slate-400 mb-5 pb-4 border-b border-slate-700/50">
              The below entries will be ignored as part of attack path computation
            </p>
            
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-[11px] text-slate-300 mb-1.5 block">Exempted IPs</label>
                <input 
                  type="text" 
                  value={exemptIps} onChange={e => setExemptIps(e.target.value)}
                  placeholder="e.g. VPN gateways"
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-md px-3 py-2 text-[12px] text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-300 mb-1.5 block">Exempted Domains</label>
                <input 
                  type="text" 
                  value={exemptDomains} onChange={e => setExemptDomains(e.target.value)}
                  placeholder="e.g. trusted partners"
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-md px-3 py-2 text-[12px] text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-300 mb-1.5 block">Service Accounts to Ignore</label>
                <input 
                  type="text" 
                  value={serviceAccounts} onChange={e => setServiceAccounts(e.target.value)}
                  placeholder="e.g. svc_backup_01"
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-md px-3 py-2 text-[12px] text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Bottom Right: Risk Baseline SLA */}
          <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-6 flex flex-col shadow-sm">
            <h2 className="text-lg font-semibold text-white mb-2">Risk Baseline SLA</h2>
            <p className="text-[12px] text-slate-400 mb-8 leading-relaxed">
              Set the baseline threshold for your environment. Attack paths will only be generated and prioritized based on the risk level selected
            </p>
            
            <div className="relative mb-10 px-2">
              <input 
                type="range" min="1" max="3" step="1" 
                value={riskTolerance} onChange={e => setRiskTolerance(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-white"
              />
              <div className="absolute top-1/2 left-0 w-full h-1.5 -z-10 bg-slate-700 rounded-lg -translate-y-1/2 pointer-events-none">
                <div 
                  className="h-full bg-blue-500 rounded-l-lg transition-all" 
                  style={{ width: `${(riskTolerance - 1) * 50}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center mt-auto">
              <div className={`transition-opacity ${riskTolerance === 1 ? 'opacity-100' : 'opacity-40'}`}>
                <div className="text-[12px] font-semibold text-slate-200 mb-2">Low Risk<br/>Tolerance</div>
                <div className="text-[10px] text-slate-400 leading-tight">Generates all possible attack paths, including theoretical routes and paths stemming from low-severity or non-exploited exposures.</div>
              </div>
              <div className={`transition-opacity ${riskTolerance === 2 ? 'opacity-100' : 'opacity-40'}`}>
                <div className="text-[12px] font-semibold text-slate-200 mb-2">Medium Risk<br/>Tolerance</div>
                <div className="text-[10px] text-slate-400 leading-tight">Generates attack paths originating from high-severity vulnerabilities and known misconfigurations that possess a probable route to critical assets.</div>
              </div>
              <div className={`transition-opacity ${riskTolerance === 3 ? 'opacity-100' : 'opacity-40'}`}>
                <div className="text-[12px] font-semibold text-slate-200 mb-2">High Risk<br/>Tolerance</div>
                <div className="text-[10px] text-slate-400 leading-tight">Generates only attack paths originating from critical, actively exploited exposures that possess a direct, verified route to your Crown Jewels.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-700/50 mt-2">
          <button className="text-[13px] font-medium text-slate-400 hover:text-slate-200 transition-colors">
            Cancel
          </button>
          <button className="px-6 py-2 text-[13px] font-medium bg-[#0ea5e9] hover:bg-[#0284c7] text-white rounded transition-colors shadow-sm">
            Submit
          </button>
        </div>

      </div>
    </div>
  )
}
