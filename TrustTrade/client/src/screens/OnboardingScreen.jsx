import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import T from '../i18n/translations'

const LANGS = [
  { code: 'en', label: 'English' },
  { code: 'af', label: 'Afrikaans' },
  { code: 'zu', label: 'isiZulu' },
]

const G = '#00FF88'

function ShieldIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L4 5.5v6C4 16.02 7.58 20.54 12 22c4.42-1.46 8-5.98 8-10.5v-6L12 2z" fill="#000" />
      <path d="M9 12l2 2 4-4" stroke={G} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M15 19l-7-7 7-7" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const card = (selected, danger = false) => ({
  width: '100%',
  padding: '16px 18px',
  marginBottom: 10,
  borderRadius: 14,
  border: selected
    ? `1.5px solid ${danger ? 'rgba(255,100,100,0.55)' : G}`
    : '1px solid rgba(255,255,255,0.08)',
  background: selected
    ? danger ? 'rgba(255,50,50,0.06)' : 'rgba(0,255,136,0.07)'
    : 'rgba(255,255,255,0.03)',
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'border-color 0.15s, background 0.15s',
  outline: 'none',
})

const primaryBtn = (enabled) => ({
  width: '100%',
  padding: '15px',
  borderRadius: 14,
  border: 'none',
  background: enabled ? G : 'rgba(255,255,255,0.06)',
  color: enabled ? '#000' : '#444',
  fontWeight: 700,
  fontSize: 15,
  fontFamily: 'Inter, sans-serif',
  cursor: enabled ? 'pointer' : 'not-allowed',
  transition: 'background 0.18s, color 0.18s',
  marginTop: 4,
})

export default function OnboardingScreen({ onComplete }) {
  const [step, setStep] = useState(1)
  const [lang, setLang] = useState(null)
  const [logsEnabled, setLogsEnabled] = useState(null)

  const t = T[lang] || T.en

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#0A0A0A',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 20px',
      zIndex: 100,
      overflowY: 'auto',
    }}>
      <AnimatePresence mode="wait">

        {step === 1 && (
          <motion.div key="step1"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.22 }}
            style={{ width: '100%', maxWidth: 400 }}
          >
            {/* Logo */}
            <div style={{ textAlign: 'center', marginBottom: 36 }}>
              <div style={{
                width: 56, height: 56, background: G, borderRadius: 16,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 14px',
                boxShadow: '0 0 30px rgba(0,255,136,0.4)',
              }}>
                <ShieldIcon />
              </div>
              <h1 style={{ color: 'white', fontWeight: 800, fontSize: 26, margin: 0, fontFamily: 'Inter, sans-serif' }}>
                Trust<span style={{ color: G }}>Trade</span>
              </h1>
              <p style={{ color: '#444', fontSize: 12, marginTop: 6, fontFamily: 'Inter, sans-serif', letterSpacing: '0.04em' }}>
                English · Afrikaans · isiZulu
              </p>
            </div>

            {/* Prompt in all 3 languages */}
            <p style={{ color: '#666', fontSize: 13, textAlign: 'center', marginBottom: 20, fontFamily: 'Inter, sans-serif', lineHeight: 1.6 }}>
              Choose your language<br />
              Kies jou taal<br />
              Khetha ulimi lwakho
            </p>

            {/* Language cards */}
            {LANGS.map(l => (
              <button key={l.code} onClick={() => setLang(l.code)} style={card(lang === l.code)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: lang === l.code ? 'rgba(0,255,136,0.15)' : 'rgba(255,255,255,0.05)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18, flexShrink: 0,
                  }}>
                    🌍
                  </div>
                  <span style={{
                    color: lang === l.code ? G : 'white',
                    fontWeight: 600, fontSize: 15,
                    fontFamily: 'Inter, sans-serif',
                    flex: 1,
                  }}>
                    {l.label}
                  </span>
                  {lang === l.code && (
                    <span style={{ color: G, fontSize: 16, fontWeight: 700 }}>✓</span>
                  )}
                </div>
              </button>
            ))}

            {/* Next */}
            <button
              onClick={() => setStep(2)}
              disabled={!lang}
              style={{ ...primaryBtn(!!lang), marginTop: 14 }}
            >
              {lang ? T[lang].ob_next : 'Next / Volgende / Okulandelayo'}
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.22 }}
            style={{ width: '100%', maxWidth: 400 }}
          >
            {/* Back */}
            <button
              onClick={() => setStep(1)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 4,
                color: '#666', fontSize: 13, padding: '0 0 24px 0',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              <ChevronLeft /> {t.ob_back}
            </button>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{ fontSize: 42, marginBottom: 12 }}>🔒</div>
              <h2 style={{
                color: 'white', fontWeight: 800, fontSize: 22,
                margin: '0 0 10px', fontFamily: 'Inter, sans-serif',
              }}>
                {t.ob_data_title}
              </h2>
              <p style={{ color: '#666', fontSize: 14, lineHeight: 1.6, fontFamily: 'Inter, sans-serif', margin: 0 }}>
                {t.ob_data_sub}
              </p>
            </div>

            {/* Yes card */}
            <button onClick={() => setLogsEnabled(true)} style={card(logsEnabled === true)}>
              <div style={{
                color: logsEnabled === true ? G : 'white',
                fontWeight: 600, fontSize: 15, marginBottom: 4,
                fontFamily: 'Inter, sans-serif',
              }}>
                {logsEnabled === true ? '✓ ' : ''}{t.ob_data_yes}
              </div>
              <div style={{ color: '#555', fontSize: 13, fontFamily: 'Inter, sans-serif' }}>
                {t.ob_data_yes_sub}
              </div>
            </button>

            {/* No card */}
            <button onClick={() => setLogsEnabled(false)} style={{ ...card(logsEnabled === false, true), marginBottom: 20 }}>
              <div style={{
                color: logsEnabled === false ? '#ff7070' : 'white',
                fontWeight: 600, fontSize: 15, marginBottom: 4,
                fontFamily: 'Inter, sans-serif',
              }}>
                {logsEnabled === false ? '✓ ' : ''}{t.ob_data_no}
              </div>
              <div style={{ color: '#555', fontSize: 13, fontFamily: 'Inter, sans-serif' }}>
                {t.ob_data_no_sub}
              </div>
            </button>

            {/* Get Started */}
            <button
              onClick={() => onComplete(lang, logsEnabled)}
              disabled={logsEnabled === null}
              style={primaryBtn(logsEnabled !== null)}
            >
              {t.ob_start}
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}
