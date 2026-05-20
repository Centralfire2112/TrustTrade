import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import T from '../i18n/translations'
import { useAppSettings } from '../context/SettingsContext'

const G = '#00FF88'

const LANGS = [
  { code: 'en', label: 'English' },
  { code: 'af', label: 'Afrikaans' },
  { code: 'zu', label: 'isiZulu' },
]

function Accordion({ title, children }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <button className="w-full flex items-center justify-between px-4 py-4 text-left" onClick={() => setOpen(v => !v)}>
        <span className="text-white text-sm font-semibold">{title}</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>
          <path d="M4 6l4 4 4-4" stroke="#555" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="px-4 pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function SettingCard({ selected, danger, onClick, title, sub }) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-xl px-4 py-3.5 text-left transition-all"
      style={{
        background: selected
          ? (danger ? 'rgba(255,50,50,0.06)' : 'rgba(0,255,136,0.07)')
          : 'rgba(255,255,255,0.03)',
        border: selected
          ? `1.5px solid ${danger ? 'rgba(255,100,100,0.55)' : G}`
          : '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <p style={{ color: selected ? (danger ? '#ff7070' : G) : 'white', fontWeight: 600, fontSize: 14, marginBottom: 2, fontFamily: 'Inter, sans-serif' }}>
        {selected ? '✓ ' : ''}{title}
      </p>
      <p style={{ color: '#555', fontSize: 12, fontFamily: 'Inter, sans-serif' }}>{sub}</p>
    </button>
  )
}

export default function InfoScreen() {
  const { lang, logsEnabled, updateLanguage, updateLogsEnabled } = useAppSettings()
  const t = T[lang] || T.en

  return (
    <div className="screen-scroll">
      <div className="px-5 pt-6 pb-10">

        {/* Logo block */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[#00FF88] flex items-center justify-center mb-4"
            style={{ boxShadow: '0 0 32px rgba(0,255,136,0.3)' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L4 5.5v6C4 16.02 7.58 20.54 12 22c4.42-1.46 8-5.98 8-10.5v-6L12 2z" fill="#000" />
              <path d="M9 12l2 2 4-4" stroke="#00FF88" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="text-white text-2xl font-black tracking-tight mb-1">TrustTrade</h1>
          <p className="text-gray-500 text-sm max-w-xs leading-relaxed">{t.info_sub}</p>
        </div>

        {/* Privacy badge */}
        <div className="flex items-center gap-3 rounded-2xl px-4 py-4 mb-6"
          style={{ background: 'rgba(0,255,136,0.05)', border: '1px solid rgba(0,255,136,0.15)' }}>
          <div className="w-9 h-9 rounded-xl bg-[#00FF88]/10 flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L4 5.5v6C4 16.02 7.58 20.54 12 22c4.42-1.46 8-5.98 8-10.5v-6L12 2z" stroke="#00FF88" strokeWidth="1.8" fill="rgba(0,255,136,0.1)" />
              <path d="M9 12l2 2 4-4" stroke="#00FF88" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <p className="text-white text-sm font-bold mb-0.5">{t.info_priv_title}</p>
            <p className="text-gray-500 text-xs">{t.info_priv_sub}</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2.5 mb-6">
          {[
            { value: '15+', label: t.info_rf },
            { value: '0',   label: t.info_ds },
            { value: '<1s', label: t.info_an },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-value text-[#00FF88] !text-lg">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* How it works */}
        <p className="text-gray-600 text-[10px] font-bold uppercase tracking-[0.12em] mb-3">{t.info_how}</p>
        <div className="space-y-2 mb-6">
          <Accordion title={t.info_scoring}>
            <p className="text-gray-400 text-sm leading-relaxed">{t.info_scoring_desc}</p>
          </Accordion>
          <Accordion title={t.info_who}>
            <p className="text-gray-400 text-sm leading-relaxed">{t.info_who_desc}</p>
          </Accordion>
          <Accordion title={t.info_limits}>
            <p className="text-gray-400 text-sm leading-relaxed">{t.info_limits_desc}</p>
          </Accordion>
        </div>

        {/* Quick safety tips */}
        <p className="text-gray-600 text-[10px] font-bold uppercase tracking-[0.12em] mb-3">{t.info_tips}</p>
        <div className="space-y-2 mb-8">
          {t.tips.map((tip, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
              className="flex items-start gap-3 rounded-xl px-4 py-3"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span className="text-[#00FF88] text-xs font-black flex-shrink-0 mt-0.5">0{i + 1}</span>
              <p className="text-gray-300 text-sm leading-snug">{tip}</p>
            </motion.div>
          ))}
        </div>

        {/* ── Language ───────────────────────────────────── */}
        <p className="text-gray-600 text-[10px] font-bold uppercase tracking-[0.12em] mb-1">{t.info_language}</p>
        <p className="text-gray-600 text-xs mb-3">{t.info_lang_sub}</p>
        <div className="space-y-2 mb-7">
          {LANGS.map(l => (
            <button
              key={l.code}
              onClick={() => updateLanguage(l.code)}
              className="w-full flex items-center gap-3 rounded-xl px-4 py-3.5 text-left transition-all"
              style={{
                background: lang === l.code ? 'rgba(0,255,136,0.07)' : 'rgba(255,255,255,0.03)',
                border: lang === l.code ? `1.5px solid ${G}` : '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <span style={{ color: lang === l.code ? G : '#ccc', fontWeight: 600, fontSize: 14, flex: 1, fontFamily: 'Inter, sans-serif' }}>
                {l.label}
              </span>
              {lang === l.code && <span style={{ color: G, fontSize: 14, fontWeight: 700 }}>✓</span>}
            </button>
          ))}
        </div>

        {/* ── Data Storage ───────────────────────────────── */}
        <p className="text-gray-600 text-[10px] font-bold uppercase tracking-[0.12em] mb-1">{t.info_data_title}</p>
        <p className="text-gray-600 text-xs mb-3">{t.info_data_sub}</p>
        <div className="space-y-2 mb-8">
          <SettingCard
            selected={logsEnabled}
            onClick={() => updateLogsEnabled(true)}
            title={t.ob_data_yes}
            sub={t.ob_data_yes_sub}
          />
          <SettingCard
            selected={!logsEnabled}
            danger
            onClick={() => updateLogsEnabled(false)}
            title={t.ob_data_no}
            sub={t.ob_data_no_sub}
          />
        </div>

        {/* Version footer */}
        <div className="text-center">
          <p className="text-gray-700 text-xs">{t.info_footer1}</p>
          <p className="text-gray-800 text-xs mt-0.5">{t.info_footer2}</p>
        </div>

      </div>
    </div>
  )
}
