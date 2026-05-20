import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import T from '../i18n/translations'
import { useAppSettings } from '../context/SettingsContext'

// ── Fraud analyser (100% in-browser, no network) ───────────────────────────────
function fill(str, vars) {
  return str.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '')
}

function analyseTransaction({ contactType, amount, prepayment, channel, urgency, notes }, t) {
  const amountNum     = parseFloat(amount) || 0
  const prepaymentNum = prepayment ? parseFloat(prepayment) : 0
  let score = 5
  const flags  = []
  const greens = []

  if (contactType === 'New')    { score += 20; flags.push(t.flag_new_contact) }
  else if (contactType === 'Known')  { score += 5;  flags.push(t.flag_known_contact) }
  else if (contactType === 'Repeat') { score -= 15; greens.push(t.green_repeat_contact) }

  if (prepaymentNum > 75)      { score += 40; flags.push(fill(t.flag_prepay_extreme,   { pct: prepaymentNum })) }
  else if (prepaymentNum > 50) { score += 30; flags.push(fill(t.flag_prepay_very_high, { pct: prepaymentNum })) }
  else if (prepaymentNum > 25) { score += 18; flags.push(fill(t.flag_prepay_high,      { pct: prepaymentNum })) }
  else if (prepaymentNum > 0)  { score += 6;  flags.push(fill(t.flag_prepay_modest,    { pct: prepaymentNum })) }
  else { greens.push(t.green_no_prepay) }

  if (channel === 'Unknown platform') { score += 26; flags.push(t.flag_unknown_platform) }
  else if (channel === 'SMS')         { score += 12; flags.push(t.flag_sms) }
  else if (channel === 'WhatsApp')    { score += 5;  flags.push(t.flag_whatsapp) }
  else if (channel === 'In person')   { score -= 10; greens.push(t.green_inperson) }

  if (urgency === 'High pressure') { score += 28; flags.push(t.flag_high_pressure) }
  else if (urgency === 'Moderate') { score += 12; flags.push(t.flag_moderate_pressure) }
  else { greens.push(t.green_no_pressure) }

  const fmtAmt = amountNum.toLocaleString()
  if (amountNum >= 50000 && contactType === 'New')      { score += 12; flags.push(fill(t.flag_high_amount_new,   { amt: fmtAmt })) }
  else if (amountNum >= 10000 && contactType === 'New') { score += 6;  flags.push(fill(t.flag_medium_amount_new, { amt: fmtAmt })) }
  else if (amountNum < 500) { score -= 4; greens.push(fill(t.green_low_amount, { amt: fmtAmt })) }

  if (notes) {
    const l = notes.toLowerCase()
    if (['urgent','emergency','asap','today only','last chance','limited','expire'].some(w => l.includes(w)))  { score += 10; flags.push(t.flag_urgency_notes) }
    if (['western union','bitcoin','crypto','gift card','wire transfer','advance fee'].some(w => l.includes(w))) { score += 20; flags.push(t.flag_fraud_payment) }
  }

  score = Math.min(100, Math.max(0, Math.round(score)))
  const riskLevel = score >= 65 ? 'HIGH' : score >= 34 ? 'MEDIUM' : 'LOW'
  const reasons   = [...flags, ...(riskLevel !== 'HIGH' ? greens : [])].slice(0, 5)
  if (reasons.length === 0) reasons.push(t.green_all_safe)

  let recommendation
  if (riskLevel === 'HIGH') {
    recommendation = prepaymentNum > 50 ? t.rec_high_prepay
      : urgency === 'High pressure'     ? t.rec_high_pressure
      : t.rec_high_default
  } else if (riskLevel === 'MEDIUM') {
    recommendation = channel === 'In person' ? t.rec_med_inperson : t.rec_med_default
  } else {
    recommendation = t.rec_low
  }

  return { riskLevel, riskScore: score, reasons, recommendation }
}

// ── Risk config built from translations ───────────────────────────────────────
function getRisk(t) {
  return {
    LOW:    { color: '#00FF88', label: t.risk_low,  headline: t.risk_low_h,  bg: 'rgba(0,255,136,0.06)',  border: 'rgba(0,255,136,0.2)' },
    MEDIUM: { color: '#F59E0B', label: t.risk_med,  headline: t.risk_med_h,  bg: 'rgba(245,158,11,0.06)', border: 'rgba(245,158,11,0.2)' },
    HIGH:   { color: '#EF4444', label: t.risk_high, headline: t.risk_high_h, bg: 'rgba(239,68,68,0.06)',  border: 'rgba(239,68,68,0.2)' },
  }
}

// ── Sub-components ─────────────────────────────────────────────────────────────
function SectionLabel({ children }) {
  return <p className="text-gray-600 text-[10px] font-bold uppercase tracking-[0.12em] mb-2.5">{children}</p>
}

function ToggleGrid({ options, value, onChange, cols = 3 }) {
  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {options.map(o => {
        const active = value === o.value
        return (
          <motion.button
            key={o.value} type="button" whileTap={{ scale: 0.95 }}
            onClick={() => onChange(o.value)}
            className="py-3 px-2 rounded-xl text-center transition-all"
            style={{
              background: active ? 'rgba(0,255,136,0.1)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${active ? 'rgba(0,255,136,0.4)' : 'rgba(255,255,255,0.07)'}`,
            }}
          >
            <span className="block text-sm font-semibold" style={{ color: active ? '#00FF88' : '#aaa' }}>{o.label}</span>
            {o.sub && <span className="block text-[10px] mt-0.5" style={{ color: active ? 'rgba(0,255,136,0.6)' : '#555' }}>{o.sub}</span>}
          </motion.button>
        )
      })}
    </div>
  )
}

function ScoreRing({ score, color }) {
  const r = 38; const circ = 2 * Math.PI * r
  return (
    <svg width="100" height="100" viewBox="0 0 90 90">
      <circle cx="45" cy="45" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
      <motion.circle
        cx="45" cy="45" r={r} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round"
        strokeDasharray={circ} initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ - (score / 100) * circ }}
        transition={{ duration: 1.4, ease: [0.34, 1.56, 0.64, 1] }}
        transform="rotate(-90 45 45)"
      />
      <text x="45" y="40" textAnchor="middle" dominantBaseline="middle" fill={color} fontSize="20" fontWeight="800" fontFamily="Inter,sans-serif">{score}</text>
      <text x="45" y="55" textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="6" fontFamily="Inter,sans-serif" letterSpacing="1.5">RISK SCORE</text>
    </svg>
  )
}

// ── Result bottom sheet ────────────────────────────────────────────────────────
function ResultSheet({ result, form, onSave, onReset, saved, logsEnabled, t }) {
  const RISK = getRisk(t)
  const cfg  = RISK[result.riskLevel]
  return (
    <>
      <motion.div className="sheet-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onReset} />
      <motion.div
        className="sheet-panel"
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 320, damping: 34 }}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        <div className="px-5 pt-4 pb-6">
          {/* Score + level */}
          <div className="flex items-center gap-5 mb-6">
            <ScoreRing score={result.riskScore} color={cfg.color} />
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-2"
                style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.color }} />
                {cfg.label}
              </span>
              <h2 className="text-white text-2xl font-black tracking-tight leading-tight">{cfg.headline}</h2>
              <p className="text-gray-600 text-xs mt-1">{t.res_score}: <span style={{ color: cfg.color }} className="font-bold">{result.riskScore}/100</span></p>
            </div>
          </div>

          {/* Risk factors */}
          <div className="mb-5">
            <SectionLabel>{t.res_factors}</SectionLabel>
            <div className="space-y-2">
              {result.reasons.map((r, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + i * 0.06 }}
                  className="flex items-start gap-3 rounded-xl px-3.5 py-3"
                  style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: cfg.color }} />
                  <p className="text-gray-300 text-[13px] leading-relaxed">{r}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recommendation */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="rounded-xl px-4 py-4 mb-6"
            style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: cfg.color }}>{t.res_rec}</p>
            <p className="text-white text-sm leading-relaxed">{result.recommendation}</p>
          </motion.div>

          {/* Actions */}
          <div className="flex gap-3">
            {logsEnabled && (
              <motion.button whileTap={{ scale: 0.96 }}
                onClick={() => onSave(form, result)}
                disabled={saved}
                className="flex-1 py-4 rounded-xl font-bold text-[14px] transition-all"
                style={{
                  background: saved ? 'rgba(0,255,136,0.08)' : '#00FF88',
                  color: saved ? '#00FF88' : '#000',
                  border: saved ? '1px solid rgba(0,255,136,0.3)' : 'none',
                }}>
                {saved ? t.res_saved : t.res_save}
              </motion.button>
            )}
            <motion.button whileTap={{ scale: 0.96 }} onClick={onReset}
              className="flex-1 py-4 rounded-xl font-bold text-[14px] text-gray-400"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}>
              {t.res_new}
            </motion.button>
          </div>
          <p className="text-gray-700 text-xs text-center mt-4">{t.res_disclaimer}</p>
        </div>
      </motion.div>
    </>
  )
}

// ── Main screen ────────────────────────────────────────────────────────────────
const EMPTY = { contactType: '', amount: '', prepayment: '', channel: '', urgency: '', notes: '' }

export default function CheckScreen({ onSave, logsEnabled = true }) {
  const { lang } = useAppSettings()
  const t = T[lang] || T.en

  const [form,    setForm]    = useState(EMPTY)
  const [result,  setResult]  = useState(null)
  const [loading, setLoading] = useState(false)
  const [saved,   setSaved]   = useState(false)

  const set         = (field) => (val) => setForm(f => ({ ...f, [field]: val }))
  const handleInput = e => set(e.target.name)(e.target.value)
  const isValid     = form.contactType && form.amount && form.channel && form.urgency

  const handleSubmit = () => {
    if (!isValid || loading) return
    setLoading(true)
    setTimeout(() => { setResult(analyseTransaction(form, t)); setLoading(false) }, 700)
  }

  const handleSave = (f, r) => { onSave(f, r); setSaved(true) }
  const reset = () => { setResult(null); setForm(EMPTY); setSaved(false) }

  return (
    <div className="screen-scroll">
      {/* Header */}
      <div className="px-5 pt-6 pb-2">
        <p className="text-gray-600 text-[10px] font-bold uppercase tracking-[0.12em] mb-1">{t.check_sub}</p>
        <h1 className="text-white text-2xl font-black tracking-tight">{t.check_title}</h1>
      </div>

      {/* Form */}
      <div className="px-5 py-4 space-y-6">

        {/* Contact type */}
        <div>
          <SectionLabel>{t.check_contact}</SectionLabel>
          <ToggleGrid value={form.contactType} onChange={set('contactType')} options={[
            { value: 'New',    label: t.opt_new,    sub: t.opt_new_s },
            { value: 'Known',  label: t.opt_known,  sub: t.opt_known_s },
            { value: 'Repeat', label: t.opt_repeat, sub: t.opt_repeat_s },
          ]} />
        </div>

        {/* Amount */}
        <div>
          <SectionLabel>{t.check_amount}</SectionLabel>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 text-xs font-bold tracking-wider pointer-events-none">ZAR</span>
            <input type="number" name="amount" value={form.amount} onChange={handleInput}
              placeholder="0.00" min="0" step="any" inputMode="decimal"
              className="input-field !pl-14 !text-base" />
          </div>
        </div>

        {/* Prepayment */}
        <div>
          <SectionLabel>{t.check_prepayment} <span className="text-gray-700 normal-case font-normal">{t.check_opt}</span></SectionLabel>
          <div className="relative">
            <input type="number" name="prepayment" value={form.prepayment} onChange={handleInput}
              placeholder="0" min="0" max="100" inputMode="decimal"
              className="input-field pr-10" />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 text-sm pointer-events-none">%</span>
          </div>
          <p className="text-gray-700 text-xs mt-1.5 pl-0.5">{t.check_prepayment_hint}</p>
        </div>

        {/* Channel */}
        <div>
          <SectionLabel>{t.check_channel}</SectionLabel>
          <ToggleGrid value={form.channel} onChange={set('channel')} cols={2} options={[
            { value: 'WhatsApp',         label: 'WhatsApp' },
            { value: 'In person',        label: t.opt_inperson },
            { value: 'SMS',              label: 'SMS' },
            { value: 'Unknown platform', label: t.opt_unknown },
          ]} />
        </div>

        {/* Urgency */}
        <div>
          <SectionLabel>{t.check_urgency}</SectionLabel>
          <ToggleGrid value={form.urgency} onChange={set('urgency')} options={[
            { value: 'None',          label: t.opt_none,     sub: t.opt_none_s },
            { value: 'Moderate',      label: t.opt_moderate, sub: t.opt_moderate_s },
            { value: 'High pressure', label: t.opt_high,     sub: t.opt_high_s },
          ]} />
        </div>

        {/* Notes */}
        <div>
          <SectionLabel>{t.check_notes} <span className="text-gray-700 normal-case font-normal">{t.check_opt}</span></SectionLabel>
          <textarea name="notes" value={form.notes} onChange={handleInput}
            placeholder={t.check_notes_ph}
            rows={3} className="input-field resize-none !text-sm" />
        </div>

        <div className="h-4" />
      </div>

      {/* Sticky CTA */}
      <div className="sticky-cta">
        <motion.button
          whileTap={isValid && !loading ? { scale: 0.97 } : {}}
          onClick={handleSubmit}
          disabled={!isValid || loading}
          className="w-full py-4 rounded-2xl font-black text-[15px] tracking-tight transition-all"
          style={{
            background: isValid && !loading ? '#00FF88' : 'rgba(255,255,255,0.05)',
            color: isValid && !loading ? '#000' : '#444',
            boxShadow: isValid && !loading ? '0 8px 28px rgba(0,255,136,0.22)' : 'none',
          }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-3">
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                <path fill="currentColor" opacity="0.75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {t.check_analysing}
            </span>
          ) : t.check_btn}
        </motion.button>
        <p className="text-gray-700 text-xs text-center mt-2">{t.check_footer}</p>
      </div>

      {/* Result sheet */}
      <AnimatePresence>
        {result && (
          <ResultSheet
            result={result} form={form}
            onSave={handleSave} onReset={reset}
            saved={saved} logsEnabled={logsEnabled}
            t={t}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
