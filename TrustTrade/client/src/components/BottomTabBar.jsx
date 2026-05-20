import { motion } from 'framer-motion'
import T from '../i18n/translations'
import { useAppSettings } from '../context/SettingsContext'

const G = '#00FF88'
const D = '#444'

const HomeIcon  = ({ a }) => <svg width="23" height="23" viewBox="0 0 24 24" fill="none"><path d="M3 12L12 3l9 9" stroke={a?G:D} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" stroke={a?G:D} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill={a?'rgba(0,255,136,0.12)':'none'}/></svg>
const CheckIcon = ({ a }) => <svg width="23" height="23" viewBox="0 0 24 24" fill="none"><path d="M12 2L4 5.5v6C4 16.02 7.58 20.54 12 22c4.42-1.46 8-5.98 8-10.5v-6L12 2z" stroke={a?G:D} strokeWidth="1.8" strokeLinejoin="round" fill={a?'rgba(0,255,136,0.12)':'none'}/><path d="M9 12l2 2 4-4" stroke={a?G:D} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/></svg>
const LogsIcon  = ({ a }) => <svg width="23" height="23" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="16" rx="3" stroke={a?G:D} strokeWidth="1.8" fill={a?'rgba(0,255,136,0.12)':'none'}/><path d="M7 9h10M7 13h7M7 17h5" stroke={a?G:D} strokeWidth="1.6" strokeLinecap="round"/></svg>
const InfoIcon  = ({ a }) => <svg width="23" height="23" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={a?G:D} strokeWidth="1.8" fill={a?'rgba(0,255,136,0.12)':'none'}/><path d="M12 8v.01M12 11v5" stroke={a?G:D} strokeWidth="2.1" strokeLinecap="round"/></svg>

export default function BottomTabBar({ active, onChange, logsEnabled = true }) {
  const { lang } = useAppSettings()
  const t = T[lang] || T.en

  const TABS = [
    { id: 'home',  label: t.nav_home,  Icon: HomeIcon },
    { id: 'check', label: t.nav_check, Icon: CheckIcon },
    { id: 'logs',  label: t.nav_logs,  Icon: LogsIcon },
    { id: 'info',  label: t.nav_info,  Icon: InfoIcon },
  ]
  const tabs = logsEnabled ? TABS : TABS.filter(tab => tab.id !== 'logs')

  return (
    <nav className="tab-bar">
      {tabs.map(({ id, label, Icon }) => {
        const isActive = active === id
        return (
          <button key={id} className="tab-btn" onClick={() => onChange(id)}>
            <motion.div
              animate={{ y: isActive ? -2 : 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              <Icon a={isActive} />
            </motion.div>
            <span className="tab-label" style={{ color: isActive ? G : D }}>
              {label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
