import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import BottomTabBar from './components/BottomTabBar'
import SidebarNav   from './components/SidebarNav'
import HomeScreen    from './screens/HomeScreen'
import CheckScreen   from './screens/CheckScreen'
import HistoryScreen from './screens/HistoryScreen'
import InfoScreen    from './screens/InfoScreen'
import OnboardingScreen from './screens/OnboardingScreen'
import { useHistory } from './hooks/useHistory'
import { useSettings } from './hooks/useSettings'
import { SettingsContext } from './context/SettingsContext'

const isDesktop = typeof window !== 'undefined' && window.electronAPI?.isDesktop === true

const slide = {
  initial:    { opacity: 0, y: 8 },
  animate:    { opacity: 1, y: 0 },
  exit:       { opacity: 0, y: -8 },
  transition: { duration: 0.18 },
}

export default function App() {
  const { settings, saveSettings, updateLanguage, updateLogsEnabled } = useSettings()
  const [tab, setTab] = useState('home')

  const lang        = settings?.language    || 'en'
  const logsEnabled = settings?.logsEnabled ?? true
  const history     = useHistory(logsEnabled)

  if (!settings) {
    return <OnboardingScreen onComplete={saveSettings} />
  }

  const handleTabChange = (id) => {
    if (id === 'logs' && !logsEnabled) return
    setTab(id)
  }

  const ctxValue = { lang, logsEnabled, updateLanguage, updateLogsEnabled }

  const content = (
    <AnimatePresence mode="wait">
      <motion.div key={tab} className="screen-slide" {...slide}>
        {tab === 'home'  && <HomeScreen  onCheck={() => setTab('check')} history={history.history} />}
        {tab === 'check' && <CheckScreen onSave={history.addEntry} logsEnabled={logsEnabled} />}
        {tab === 'logs'  && <HistoryScreen {...history} />}
        {tab === 'info'  && <InfoScreen />}
      </motion.div>
    </AnimatePresence>
  )

  if (isDesktop) {
    return (
      <SettingsContext.Provider value={ctxValue}>
        <div className="app-shell desktop">
          <SidebarNav active={tab} onChange={handleTabChange} logsEnabled={logsEnabled} />
          <div className="screen-content">{content}</div>
        </div>
      </SettingsContext.Provider>
    )
  }

  return (
    <SettingsContext.Provider value={ctxValue}>
      <div className="app-shell">
        <div className="screen-content">{content}</div>
        <BottomTabBar active={tab} onChange={handleTabChange} logsEnabled={logsEnabled} />
      </div>
    </SettingsContext.Provider>
  )
}
