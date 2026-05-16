import { useState } from 'react'
import { X } from 'lucide-react'

export default function AttackPathOnboarding() {
  // Section 1: Crown Jewels
  const [tags, setTags] = useState(['Customer Database', 'Source Code Repository', 'Financial Records'])
  const AVAILABLE_TAGS = ['Customer Database', 'Source Code Repository', 'Financial Records', 'PCI-DSS', 'PII', 'Production', 'Authentication Server']

  // Section 3: Exclusions
  const [exemptIps, setExemptIps] = useState('')
  const [exemptDomains, setExemptDomains] = useState('')
  const [serviceAccounts, setServiceAccounts] = useState('')

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
    <div className="flex flex-col text-slate-200 p-8 max-w-7xl mx-auto w-full gap-8">
      
      <div className="grid grid-cols-2 gap-8 items-start">
        
        {/* Left Column: Crown Jewels Definition */}
        <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-6 flex flex-col shadow-sm">
          <h2 className="text-lg font-semibold text-white mb-2">Crown Jewels Definition</h2>
          <p className="text-[13px] text-slate-400 mb-6 leading-relaxed">Identifies crown jewels as per your environment which will then be used for attack path computation</p>
          <label className="text-[11px] text-slate-400 mb-2 uppercase font-medium tracking-wider">Tags</label>
          <div className="border border-blue-500/50 rounded-md bg-slate-900/50 p-3 min-h-[120px] focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
            <select 
              onChange={handleAddTag}
              className="w-full bg-transparent border-none outline-none text-[13px] text-slate-400 cursor-pointer mb-3"
              defaultValue=""
            >
              <option value="" disabled className="bg-slate-800 text-slate-400">Enter tags for critical assets</option>
              {AVAILABLE_TAGS.filter(t => !tags.includes(t)).map(tag => (
                <option key={tag} value={tag} className="bg-slate-800 text-slate-200">{tag}</option>
              ))}
            </select>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <div key={tag} className="flex items-center gap-1 bg-slate-700/60 text-slate-300 px-3 py-1.5 rounded-md text-[12px] font-medium border border-slate-600/50">
                  {tag}
                  <button onClick={() => handleRemoveTag(tag)} className="hover:text-white ml-1">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Exclusions */}
        <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-6 flex flex-col shadow-sm">
          <h2 className="text-lg font-semibold text-white mb-1">Exclusions</h2>
          <p className="text-[13px] text-slate-400 mb-6 pb-4 border-b border-slate-700/50 leading-relaxed">
            The below entries will be ignored as part of attack path computation
          </p>
          
          <div className="flex flex-col gap-5">
            <div>
              <label className="text-[12px] text-slate-300 mb-2 block">Exempted IPs</label>
              <input 
                type="text" 
                value={exemptIps} onChange={e => setExemptIps(e.target.value)}
                placeholder="e.g. VPN gateways"
                className="w-full bg-slate-900/80 border border-slate-700 rounded-md px-3 py-2.5 text-[13px] text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className="text-[12px] text-slate-300 mb-2 block">Exempted Domains</label>
              <input 
                type="text" 
                value={exemptDomains} onChange={e => setExemptDomains(e.target.value)}
                placeholder="e.g. trusted partners"
                className="w-full bg-slate-900/80 border border-slate-700 rounded-md px-3 py-2.5 text-[13px] text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className="text-[12px] text-slate-300 mb-2 block">Service Accounts to Ignore</label>
              <input 
                type="text" 
                value={serviceAccounts} onChange={e => setServiceAccounts(e.target.value)}
                placeholder="e.g. svc_backup_01"
                className="w-full bg-slate-900/80 border border-slate-700 rounded-md px-3 py-2.5 text-[13px] text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
        </div>

      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-4 pt-8 mt-4">
        <button className="text-[14px] font-medium text-slate-400 hover:text-slate-200 transition-colors px-4 py-2.5">
          Cancel
        </button>
        <button className="px-8 py-2.5 text-[14px] font-medium bg-[#0ea5e9] hover:bg-[#0284c7] text-white rounded transition-colors shadow-sm">
          Submit
        </button>
      </div>

    </div>
  )
}
