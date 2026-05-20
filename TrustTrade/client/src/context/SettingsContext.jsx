import { createContext, useContext } from 'react'

export const SettingsContext = createContext({
  lang: 'en',
  logsEnabled: true,
  updateLanguage: () => {},
  updateLogsEnabled: () => {},
})

export const useAppSettings = () => useContext(SettingsContext)
