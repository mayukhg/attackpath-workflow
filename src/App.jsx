import { useState, useEffect } from 'react'
import QualysShell from './components/QualysShell'
import SharedSidebar from './components/SharedSidebar'
import HomePage from './components/HomePage'
import RiskManagementPage from './components/RiskManagementPage'
import AttackPathOnboarding from './components/AttackPathOnboarding'

function parseRoute(hash) {
  const h = hash || '#/home'
  if (h === '#/' || h === '' || h === '#/home') return 'home'
  if (h.startsWith('#/onboarding')) return 'onboarding'
  if (
    h.startsWith('#/findings') ||
    h.startsWith('#/risk-management') ||
    h.startsWith('#/attack-path') ||
    h.startsWith('#/insights')
  ) {
    return 'risk-management'
  }
  return 'home'
}

function EtmLayout({ activeItem, children }) {
  return (
    <QualysShell variant="etm">
      <div className="flex flex-1 overflow-hidden relative min-w-0">
        <SharedSidebar activeItem={activeItem} expanded={false} />
        <div className="flex-1 h-full overflow-hidden min-w-0 ml-11">
          {children}
        </div>
      </div>
    </QualysShell>
  )
}

export default function App() {
  const [route, setRoute] = useState(() => parseRoute(window.location.hash))

  useEffect(() => {
    const onHash = () => setRoute(parseRoute(window.location.hash))
    window.addEventListener('hashchange', onHash)
    if (!window.location.hash || window.location.hash === '#') {
      window.location.hash = '/home'
    }
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  if (route === 'home') {
    return (
      <EtmLayout activeItem="Home">
        <HomePage />
      </EtmLayout>
    )
  }

  if (route === 'onboarding') {
    return (
      <EtmLayout activeItem="Attack Path Onboarding">
        <AttackPathOnboarding />
      </EtmLayout>
    )
  }

  return (
    <EtmLayout activeItem="Risk Management">
      <RiskManagementPage />
    </EtmLayout>
  )
}
