import { motion } from 'framer-motion'
import T from '../i18n/translations'
import { useAppSettings } from '../context/SettingsContext'
import logoImg from '../assets/logo.jpeg'

const G = '#00FF88'

const HomeIcon   = ({ a }) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 12L12 3l9 9" stroke={a?G:'#555'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" stroke={a?G:'#555'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill={a?'rgba(0,255,136,0.12)':'none'}/></svg>
const CheckIcon  = ({ a }) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2L4 5.5v6C4 16.02 7.58 20.54 12 22c4.42-1.46 8-5.98 8-10.5v-6L12 2z" stroke={a?G:'#555'} strokeWidth="1.8" strokeLinejoin="round" fill={a?'rgba(0,255,136,0.12)':'none'}/><path d="M9 12l2 2 4-4" stroke={a?G:'#555'} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/></svg>
const LogsIcon   = ({ a }) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="16" rx="3" stroke={a?G:'#555'} strokeWidth="1.8" fill={a?'rgba(0,255,136,0.12)':'none'}/><path d="M7 9h10M7 13h7M7 17h5" stroke={a?G:'#555'} strokeWidth="1.6" strokeLinecap="round"/></svg>
const InfoIcon   = ({ a }) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={a?G:'#555'} strokeWidth="1.8" fill={a?'rgba(0,255,136,0.12)':'none'}/><path d="M12 8v.01M12 11v5" stroke={a?G:'#555'} strokeWidth="2.1" strokeLinecap="round"/></svg>

export default function SidebarNav({ active, onChange, logsEnabled = true }) {
  const { lang } = useAppSettings()
  const t = T[lang] || T.en

  const TABS = [
    { id: 'home',  label: t.nav_home,       Icon: HomeIcon },
    { id: 'check', label: t.nav_check_long, Icon: CheckIcon },
    { id: 'logs',  label: t.nav_logs,       Icon: LogsIcon },
    { id: 'info',  label: t.nav_info,       Icon: InfoIcon },
  ]
  const tabs = logsEnabled ? TABS : TABS.filter(tab => tab.id !== 'logs')

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <img src={logoImg} alt="TrustTrade" style={{ width: 36, height: 36, objectFit: 'contain', borderRadius: 6 }} />
        </div>
        <div>
          <p className="sidebar-logo-name">Trust<span style={{ color: G }}>Trade</span></p>
          <p className="sidebar-logo-sub">v1.0 · Offline</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {tabs.map(({ id, label, Icon }) => {
          const a = active === id
          return (
            <motion.button
              key={id}
              onClick={() => onChange(id)}
              whileTap={{ scale: 0.98 }}
              className={`sidebar-item ${a ? 'sidebar-item-active' : ''}`}
            >
              <Icon a={a} />
              <span className="sidebar-item-label">{label}</span>
              {a && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="sidebar-indicator"
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
            </motion.button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-offline-badge">
          <span className="sidebar-dot" />
          <span className="sidebar-offline-label">{t.sidebar_offline}</span>
        </div>
        <p className="sidebar-footer-sub">{t.sidebar_offline_sub}</p>
      </div>
    </aside>
  )
}
