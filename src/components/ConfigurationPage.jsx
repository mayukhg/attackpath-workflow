import { useState } from 'react'
import AttackPathOnboarding from './AttackPathOnboarding'

export default function ConfigurationPage() {
  const [activeTab, setActiveTab] = useState('Attack Path Config')
  const tabs = ['Connectors', 'Company Profile', 'Custom Attributes', 'Attack Path Config']

  return (
    <div className="flex flex-col h-full bg-[#1b1d24] text-white">
      {/* Header */}
      <div className="px-8 py-6 bg-[#1b1d24]">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <span className="text-slate-400">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="18" x2="20" y2="18"></line></svg>
          </span> 
          Configuration
        </h1>
        {/* Tabs */}
        <div className="flex gap-8 border-b border-slate-700/50 px-1">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-[14px] font-medium transition-colors relative ${
                activeTab === tab ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-blue-600 rounded-t-sm" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-[#1b1d24]">
        {activeTab === 'Attack Path Config' ? (
          <AttackPathOnboarding />
        ) : (
          <div className="p-8 text-slate-500 text-sm">
            {activeTab} configuration panel placeholder.
          </div>
        )}
      </div>
    </div>
  )
}
