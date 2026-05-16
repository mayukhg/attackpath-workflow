import { useState } from 'react'
import { Target, X } from 'lucide-react'

export default function AttackPathOnboarding() {
  const [tags, setTags] = useState(['Production', 'Crit-Sec', 'AWS-West', 'Internal', 'Database'])
  const AVAILABLE_TAGS = ['Cloud', 'External', 'PCI-DSS', 'Legacy', 'Linux', 'Windows', 'Web', 'API']
  
  const [ips, setIps] = useState(['192.168.1.0/24', '10.0.0.5'])
  const [ipInput, setIpInput] = useState('')

  const handleAddTag = (e) => {
    const selectedTag = e.target.value
    if (selectedTag && !tags.includes(selectedTag)) {
      setTags([...tags, selectedTag])
    }
    e.target.value = '' // Reset select after picking
  }

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove))
  }

  const handleAddIp = (e) => {
    if (e.key === 'Enter' && ipInput.trim()) {
      setIps([...ips, ipInput.trim()])
      setIpInput('')
    }
  }

  const handleRemoveIp = (ipToRemove) => {
    setIps(ips.filter(ip => ip !== ipToRemove))
  }

  return (
    <div className="flex flex-col h-full bg-[#0d1117] text-white">
      {/* Header */}
      <div className="px-5 pt-4 pb-4 border-b border-slate-700/40 shrink-0">
        <h1 className="text-lg font-semibold text-white flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-400" />
          Attack Path Onboarding
        </h1>
        <p className="text-[12px] text-slate-400 mt-1">
          Configure the scope and exclusions for attack path computation.
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        
        {/* Section 1 */}
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-5">
          <h2 className="text-[14px] font-semibold text-white mb-1">1. Define Asset scope</h2>
          <p className="text-[11px] text-slate-400 mb-4">
            List of tags relating to assets which should be part of attack path computation
          </p>
          
          <div className="bg-slate-900/50 border border-slate-700 rounded p-3 min-h-[100px] flex flex-col">
            <div className="flex flex-wrap gap-2 mb-2 flex-1">
              {tags.map(tag => (
                <div key={tag} className="flex items-center gap-1 bg-blue-600/20 text-blue-400 border border-blue-500/30 px-2 py-1 rounded text-[12px]">
                  {tag}
                  <button onClick={() => handleRemoveTag(tag)} className="hover:text-blue-300 ml-1">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <select 
                onChange={handleAddTag}
                className="bg-transparent border-none outline-none text-[12px] text-slate-400 cursor-pointer flex-1 min-w-[200px]"
                defaultValue=""
              >
                <option value="" disabled className="bg-slate-800 text-slate-400">Select an asset tag to add...</option>
                {AVAILABLE_TAGS.filter(t => !tags.includes(t)).map(tag => (
                  <option key={tag} value={tag} className="bg-slate-800 text-slate-200">{tag}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2 */}
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-5">
          <h2 className="text-[14px] font-semibold text-white mb-1">2. Exclusion for Shadow IT detection</h2>
          <p className="text-[11px] text-slate-400 mb-4">
            List of IPs which should be excluded from Shadow IT discovery during attack path computation
          </p>

          <div className="bg-slate-900/50 border border-slate-700 rounded p-3 min-h-[100px] flex flex-col">
            <div className="flex flex-wrap gap-2 mb-2 flex-1">
              {ips.map(ip => (
                <div key={ip} className="flex items-center gap-1 bg-slate-700 text-slate-200 px-2 py-1 rounded text-[12px]">
                  {ip}
                  <button onClick={() => handleRemoveIp(ip)} className="hover:text-slate-100 ml-1">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <input 
                type="text" 
                value={ipInput}
                onChange={e => setIpInput(e.target.value)}
                onKeyDown={handleAddIp}
                placeholder="Type an IP address and press Enter..."
                className="bg-transparent border-none outline-none text-[12px] text-white placeholder:text-slate-600 min-w-[250px] flex-1"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-700/40">
          <button className="px-4 py-2 text-[12px] font-semibold text-slate-300 hover:text-white transition-colors">
            Cancel
          </button>
          <button className="px-4 py-2 text-[12px] font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors">
            Save Configuration
          </button>
        </div>

      </div>
    </div>
  )
}
