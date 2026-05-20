import { useState } from 'react'

const KEY = 'tt_settings_v1'
const HIST_KEY = 'tt_history_v1'

export function useSettings() {
  const [settings, setSettings] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY) || 'null') }
    catch { return null }
  })

  const _persist = (s) => {
    localStorage.setItem(KEY, JSON.stringify(s))
    setSettings(s)
  }

  const saveSettings = (language, logsEnabled) => {
    _persist({ language, logsEnabled, onboardingDone: true })
  }

  const updateLanguage = (language) => {
    _persist({ ...settings, language })
  }

  const updateLogsEnabled = (logsEnabled) => {
    if (!logsEnabled) localStorage.removeItem(HIST_KEY)
    _persist({ ...settings, logsEnabled })
  }

  return { settings, saveSettings, updateLanguage, updateLogsEnabled }
}
