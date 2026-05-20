import { motion } from 'framer-motion'
import T from '../i18n/translations'
import { useAppSettings } from '../context/SettingsContext'

const RISK_COLOR = { LOW: '#00FF88', MEDIUM: '#F59E0B', HIGH: '#EF4444' }

function fmt(iso) {
  return new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })
}

export default function HomeScreen({ onCheck, history }) {
  const { lang } = useAppSettings()
  const t = T[lang] || T.en

  const total   = history.length
  const safe    = history.filter(h => h.riskLevel === 'LOW').length
  const flagged = history.filter(h => h.riskLevel === 'HIGH').length
  const recent  = history.slice(0, 4)

  const riskLabel = (level) => ({
    LOW: t.risk_low, MEDIUM: t.risk_med, HIGH: t.risk_high,
  }[level] || level)

  return (
    <div className="screen-scroll">
      <div className="px-5 pt-6 pb-8">

        {/* Header */}
        <div className="flex items-start justify-between mb-7">
          <div>
            <p className="text-[#00FF88] text-[10px] font-bold uppercase tracking-[0.15em] mb-1">TrustTrade</p>
            <h1 className="text-white text-[28px] font-black leading-tight tracking-tight">
              {t.home_line1}<br />
              <span className="text-gradient">{t.home_line2}</span>
            </h1>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#00FF88] flex items-center justify-center flex-shrink-0 mt-1"
            style={{ boxShadow: '0 0 24px rgba(0,255,136,0.35)' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L4 5.5v6C4 16.02 7.58 20.54 12 22c4.42-1.46 8-5.98 8-10.5v-6L12 2z" fill="#000" />
              <path d="M9 12l2 2 4-4" stroke="#00FF88" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Stats row — only show after first check */}
        {total > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-3 gap-2.5 mb-5"
          >
            <div className="stat-card">
              <div className="stat-value">{total}</div>
              <div className="stat-label">{t.home_checks}</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: '#00FF88' }}>{safe}</div>
              <div className="stat-label">{t.home_safe}</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: '#EF4444' }}>{flagged}</div>
              <div className="stat-label">{t.home_flagged}</div>
            </div>
          </motion.div>
        )}

        {/* Main CTA card */}
        <motion.button
          whileTap={{ scale: 0.975 }}
          onClick={onCheck}
          className="w-full rounded-2xl p-5 text-left relative overflow-hidden mb-4"
          style={{ background: 'linear-gradient(135deg, #00FF88 0%, #00cc6a 100%)', boxShadow: '0 8px 32px rgba(0,255,136,0.2)' }}
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        >
          <div className="absolute right-3 -bottom-2 opacity-[0.12]">
            <svg width="100" height="100" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L4 5.5v6C4 16.02 7.58 20.54 12 22c4.42-1.46 8-5.98 8-10.5v-6L12 2z" fill="#000" />
            </svg>
          </div>
          <p className="text-black/55 text-[10px] font-bold uppercase tracking-widest mb-1.5">{t.home_cta_badge}</p>
          <p className="text-black text-xl font-black tracking-tight mb-1">{t.home_cta_title}</p>
          <p className="text-black/55 text-[13px]">{t.home_cta_sub}</p>
        </motion.button>

        {/* Offline badge */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="flex items-center gap-3 rounded-xl px-4 py-3 mb-7"
          style={{ background: 'rgba(0,255,136,0.04)', border: '1px solid rgba(0,255,136,0.12)' }}
        >
          <div className="w-2 h-2 rounded-full bg-[#00FF88] flex-shrink-0 pulse-dot" />
          <p className="text-gray-400 text-[13px]">{t.home_offline}</p>
        </motion.div>

        {/* Recent Activity */}
        {recent.length > 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
            <p className="text-gray-600 text-[10px] font-bold uppercase tracking-[0.12em] mb-3">{t.home_recent}</p>
            <div className="space-y-2">
              {recent.map((e, i) => (
                <motion.div
                  key={e.id}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.04 }}
                  className="flex items-center gap-3 rounded-xl px-4 py-3.5"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: RISK_COLOR[e.riskLevel] }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold">
                      ZAR {e.amount.toLocaleString('en-ZA')}
                    </p>
                    <p className="text-gray-600 text-xs mt-0.5">{e.contactType} · {e.channel}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[11px] font-bold" style={{ color: RISK_COLOR[e.riskLevel] }}>{riskLabel(e.riskLevel)}</p>
                    <p className="text-gray-700 text-[10px] mt-0.5">{fmt(e.date)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-center py-10"
          >
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="16" rx="3" stroke="#333" strokeWidth="1.5" />
                <path d="M7 9h10M7 13h7" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-gray-600 text-sm font-medium">{t.home_empty_title}</p>
            <p className="text-gray-700 text-xs mt-1">{t.home_empty_sub}</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
