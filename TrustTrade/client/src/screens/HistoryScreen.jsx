import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import T from '../i18n/translations'
import { useAppSettings } from '../context/SettingsContext'

const RISK_COLOR  = { LOW: '#00FF88', MEDIUM: '#F59E0B', HIGH: '#EF4444' }
const RISK_BG     = { LOW: 'rgba(0,255,136,0.08)', MEDIUM: 'rgba(245,158,11,0.08)', HIGH: 'rgba(239,68,68,0.08)' }
const RISK_BORDER = { LOW: 'rgba(0,255,136,0.18)', MEDIUM: 'rgba(245,158,11,0.18)', HIGH: 'rgba(239,68,68,0.18)' }

const FILTERS = ['All', 'LOW', 'MEDIUM', 'HIGH']

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: '2-digit' })
}
function fmtTime(iso) {
  return new Date(iso).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })
}

function ExpandedCard({ entry, onRemove, t }) {
  const c = RISK_COLOR[entry.riskLevel]
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22 }}
      className="overflow-hidden"
    >
      <div className="px-4 pb-4 pt-1 space-y-3">
        {/* Details grid */}
        <div className="grid grid-cols-2 gap-2">
          {[
            [t.hist_contact, entry.contactType],
            [t.hist_channel, entry.channel],
            [t.hist_urgency, entry.urgency],
            [t.hist_prepay,  entry.prepayment ? `${entry.prepayment}%` : t.hist_none],
          ].map(([k, v]) => (
            <div key={k} className="rounded-xl px-3 py-2.5" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <p className="text-gray-600 text-[10px] font-bold uppercase tracking-wider mb-0.5">{k}</p>
              <p className="text-white text-sm font-semibold">{v}</p>
            </div>
          ))}
        </div>

        {/* Risk factors */}
        {entry.reasons && entry.reasons.length > 0 && (
          <div>
            <p className="text-gray-600 text-[10px] font-bold uppercase tracking-wider mb-2">{t.res_factors}</p>
            <div className="space-y-1.5">
              {entry.reasons.map((r, i) => (
                <div key={i} className="flex items-start gap-2.5 rounded-lg px-3 py-2.5"
                  style={{ background: RISK_BG[entry.riskLevel], border: `1px solid ${RISK_BORDER[entry.riskLevel]}` }}>
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: c }} />
                  <p className="text-gray-300 text-xs leading-relaxed">{r}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendation */}
        <div className="rounded-xl px-3.5 py-3"
          style={{ background: RISK_BG[entry.riskLevel], border: `1px solid ${RISK_BORDER[entry.riskLevel]}` }}>
          <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: c }}>{t.res_rec}</p>
          <p className="text-gray-300 text-xs leading-relaxed">{entry.recommendation}</p>
        </div>

        {/* Delete */}
        <button onClick={onRemove}
          className="w-full py-3 rounded-xl text-red-500 text-sm font-semibold transition-all"
          style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
          {t.hist_delete}
        </button>
      </div>
    </motion.div>
  )
}

function LogCard({ entry, onRemove, t }) {
  const [open, setOpen] = useState(false)
  const c = RISK_COLOR[entry.riskLevel]
  const riskLabel = { LOW: t.risk_low, MEDIUM: t.risk_med, HIGH: t.risk_high }[entry.riskLevel] || entry.riskLevel

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <button className="w-full text-left px-4 py-4 flex items-center gap-3" onClick={() => setOpen(v => !v)}>
        {/* Score ring */}
        <div className="flex-shrink-0 relative w-11 h-11">
          <svg width="44" height="44" viewBox="0 0 44 44">
            <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
            <circle cx="22" cy="22" r="18" fill="none" stroke={c} strokeWidth="4" strokeLinecap="round"
              strokeDasharray={`${(entry.riskScore / 100) * 113.1} 113.1`}
              transform="rotate(-90 22 22)" />
            <text x="22" y="22" textAnchor="middle" dominantBaseline="middle" fill={c} fontSize="10" fontWeight="800" fontFamily="Inter,sans-serif">{entry.riskScore}</text>
          </svg>
        </div>
        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-white text-sm font-bold truncate">ZAR {entry.amount.toLocaleString('en-ZA')}</p>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wide flex-shrink-0"
              style={{ background: RISK_BG[entry.riskLevel], color: c, border: `1px solid ${RISK_BORDER[entry.riskLevel]}` }}>
              {riskLabel}
            </span>
          </div>
          <p className="text-gray-600 text-xs">{entry.contactType} · {entry.channel}</p>
        </div>
        {/* Date + chevron */}
        <div className="text-right flex-shrink-0">
          <p className="text-gray-600 text-[11px]">{fmtDate(entry.date)}</p>
          <p className="text-gray-700 text-[10px]">{fmtTime(entry.date)}</p>
          <svg className="ml-auto mt-1" width="14" height="14" viewBox="0 0 16 16" fill="none"
            style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
            <path d="M4 6l4 4 4-4" stroke="#555" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </button>
      <AnimatePresence>
        {open && <ExpandedCard entry={entry} onRemove={onRemove} t={t} />}
      </AnimatePresence>
    </div>
  )
}

export default function HistoryScreen({ history, removeEntry, clearHistory }) {
  const { lang } = useAppSettings()
  const t = T[lang] || T.en

  const [filter, setFilter]               = useState('All')
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  const filtered = filter === 'All' ? history : history.filter(e => e.riskLevel === filter)

  const filterLabel = (f) => ({
    'All': t.filt_all, 'LOW': t.filt_safe, 'MEDIUM': t.filt_caution, 'HIGH': t.filt_high,
  }[f] || f)

  return (
    <div className="screen-scroll">
      <div className="px-5 pt-6 pb-8">

        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-gray-600 text-[10px] font-bold uppercase tracking-[0.12em] mb-1">{t.hist_sub}</p>
            <h1 className="text-white text-2xl font-black tracking-tight">{t.hist_title}</h1>
          </div>
          {history.length > 0 && (
            <button onClick={() => setShowClearConfirm(true)}
              className="mt-1 text-red-500/70 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
              style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.1)' }}>
              {t.hist_clear}
            </button>
          )}
        </div>

        {/* Confirm clear */}
        <AnimatePresence>
          {showClearConfirm && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="rounded-2xl px-4 py-4 mb-4 flex items-center gap-3"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <p className="text-gray-300 text-sm flex-1">
                {t.hist_confirm_pre} {history.length} {t.hist_confirm_suf}
              </p>
              <button onClick={() => { clearHistory(); setShowClearConfirm(false) }}
                className="text-red-400 text-sm font-bold px-3 py-1.5 rounded-lg"
                style={{ background: 'rgba(239,68,68,0.15)' }}>
                {t.hist_yes}
              </button>
              <button onClick={() => setShowClearConfirm(false)}
                className="text-gray-500 text-sm font-bold px-3 py-1.5 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.05)' }}>
                {t.hist_no}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter pills */}
        {history.length > 0 && (
          <div className="flex gap-2 mb-5 overflow-x-auto pb-1 -mx-1 px-1">
            {FILTERS.map(f => {
              const active = filter === f
              const c = f === 'LOW' ? '#00FF88' : f === 'MEDIUM' ? '#F59E0B' : f === 'HIGH' ? '#EF4444' : '#aaa'
              return (
                <button key={f} onClick={() => setFilter(f)}
                  className="flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all"
                  style={{
                    background: active ? (f === 'All' ? 'rgba(255,255,255,0.1)' : RISK_BG[f] || 'rgba(255,255,255,0.1)') : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${active ? c : 'rgba(255,255,255,0.08)'}`,
                    color: active ? c : '#555',
                  }}>
                  {filterLabel(f)}
                </button>
              )
            })}
          </div>
        )}

        {/* Count */}
        {filtered.length > 0 && (
          <p className="text-gray-700 text-xs mb-3">
            {filtered.length}{filter !== 'All' ? ` · ${filterLabel(filter)}` : ''}
          </p>
        )}

        {/* List */}
        {filtered.length > 0 ? (
          <div className="space-y-2.5">
            {filtered.map((entry, i) => (
              <motion.div key={entry.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <LogCard entry={entry} onRemove={() => removeEntry(entry.id)} t={t} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="16" rx="3" stroke="#333" strokeWidth="1.5" />
                <path d="M7 9h10M7 13h7M7 17h5" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-gray-600 text-sm font-medium">
              {history.length === 0 ? t.hist_empty_title : t.hist_no_match}
            </p>
            <p className="text-gray-700 text-xs mt-1">
              {history.length === 0 ? t.hist_empty_sub : t.hist_try_filter}
            </p>
          </div>
        )}

      </div>
    </div>
  )
}
