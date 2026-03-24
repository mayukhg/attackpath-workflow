import { useState, useEffect } from 'react'
import AttackPathQualys from './components/AttackPathQualys'
import AttackPathInsights from './components/AttackPathInsights'

export default function App() {
  const [route, setRoute] = useState(window.location.hash)

  useEffect(() => {
    const onHash = () => setRoute(window.location.hash)
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  if (route === '#/insights') return <AttackPathInsights />
  return <AttackPathQualys />
}
