import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── Rule-based fraud analyser (runs entirely in the browser) ───────────────────
function analyseTransaction({ contactType, amount, prepayment, channel, urgency, notes }) {
  const amountNum = parseFloat(amount) || 0
  const prepaymentNum = prepayment ? parseFloat(prepayment) : 0

  let score = 5
  const flags = []
  const greens = []

  if (contactType === 'New') {
    score += 20
    flags.push('You have never dealt with this contact before — there is no established trust or track record.')
  } else if (contactType === 'Known') {
    score += 5
    flags.push('You know this contact but have limited prior trading history to rely on.')
  } else if (contactType === 'Repeat') {
    score -= 15
    greens.push('Repeat contact with an established trading relationship — this significantly reduces risk.')
  }

  if (prepaymentNum > 75) {
    score += 40
    flags.push(`Prepayment of ${prepaymentNum}% is extremely high — paying more than 75% upfront before receiving goods is a strong fraud indicator.`)
  } else if (prepaymentNum > 50) {
    score += 30
    flags.push(`Prepayment of ${prepaymentNum}% is very high. Legitimate sellers rarely need more than half the value upfront.`)
  } else if (prepaymentNum > 25) {
    score += 18
    flags.push(`Prepayment of ${prepaymentNum}% is above the typical safe threshold of 25% for an unverified trade.`)
  } else if (prepaymentNum > 0) {
    score += 6
    flags.push(`A ${prepaymentNum}% prepayment has been requested — modest, but verify the goods before any payment.`)
  } else {
    greens.push('No prepayment requested — payment on delivery is the safest arrangement.')
  }

  if (channel === 'Unknown platform') {
    score += 26
    flags.push('Communication is happening on an unknown or unverifiable platform — a classic tactic used to avoid accountability.')
  } else if (channel === 'SMS') {
    score += 12
    flags.push('SMS communication cannot be easily verified or traced back to a real identity.')
  } else if (channel === 'WhatsApp') {
    score += 5
    flags.push('WhatsApp is widely used but numbers can be spoofed — confirm the identity through another channel if possible.')
  } else if (channel === 'In person') {
    score -= 10
    greens.push('In-person transactions allow you to verify goods and the person\'s identity before handing over money.')
  }

  if (urgency === 'High pressure') {
    score += 28
    flags.push('High pressure or urgency tactics detected — scammers deliberately rush victims to prevent careful thinking.')
  } else if (urgency === 'Moderate') {
    score += 12
    flags.push('Some pressure noted. Legitimate trades rarely require urgency — take your time to verify.')
  } else {
    greens.push('No urgency pressure — the relaxed pace is a positive sign.')
  }

  if (amountNum >= 50000 && contactType === 'New') {
    score += 12
    flags.push(`A high-value transaction of ZAR ${amountNum.toLocaleString()} with a new, unverified contact carries significant financial risk.`)
  } else if (amountNum >= 10000 && contactType === 'New') {
    score += 6
    flags.push(`ZAR ${amountNum.toLocaleString()} is a substantial amount to transact with someone you have never dealt with before.`)
  } else if (amountNum < 500) {
    score -= 4
    greens.push(`The low transaction amount (ZAR ${amountNum.toLocaleString()}) limits your exposure even if something goes wrong.`)
  }

  if (notes) {
    const lower = notes.toLowerCase()
    if (['urgent', 'emergency', 'asap', 'today only', 'last chance', 'limited', 'expire'].some((w) => lower.includes(w))) {
      score += 10
      flags.push('Your notes mention urgency language — a well-known pressure tactic used in scams.')
    }
    if (['western union', 'bitcoin', 'crypto', 'gift card', 'wire transfer', 'advance fee'].some((w) => lower.includes(w))) {
      score += 20
      flags.push('Your notes reference a payment method frequently associated with fraud.')
    }
  }

  score = Math.min(100, Math.max(0, Math.round(score)))
  const riskLevel = score >= 65 ? 'HIGH' : score >= 34 ? 'MEDIUM' : 'LOW'
  const reasons = [...flags, ...(riskLevel !== 'HIGH' ? greens : [])].slice(0, 5)
  if (reasons.length === 0) reasons.push('All checked indicators are within normal safe trading parameters.')

  let recommendation
  if (riskLevel === 'HIGH') {
    const topFactor = prepaymentNum > 50
      ? 'Do not pay any upfront amount until you can verify the goods in person.'
      : urgency === 'High pressure'
        ? 'Stop — do not let the urgency rush you. Walk away and take 24 hours to verify this contact independently.'
        : "Pause this transaction. Independently verify the contact's identity through a trusted third party before proceeding."
    recommendation = `This transaction has multiple high-risk indicators. ${topFactor} If in doubt, walk away — a legitimate seller will always allow you time to verify.`
  } else if (riskLevel === 'MEDIUM') {
    const action = channel === 'In person'
      ? 'Inspect the goods thoroughly before handing over any payment.'
      : 'Ask to inspect goods in person before any payment, or arrange a cash-on-delivery agreement.'
    recommendation = `Proceed carefully. ${action} Request a small test transaction if possible, and confirm this contact's identity through at least one other trusted source before committing the full amount.`
  } else {
    recommendation = 'This trade looks relatively safe based on the information provided. Still, never pay the full amount until you have verified the goods or service. Keep a record of all communication and agree on the delivery terms in writing before proceeding.'
  }

  return { riskLevel, riskScore: score, reasons, recommendation }
}

// ── Risk level config ──────────────────────────────────────────────────────────
const RISK = {
  LOW: {
    color: '#00FF88',
    border: 'border-[#00FF88]/25',
    bg: 'bg-[#00FF88]/[0.04]',
    glow: 'shadow-[0_0_50px_rgba(0,255,136,0.12)]',
    badge: 'bg-[#00FF88]/15 text-[#00FF88]',
    dot: 'bg-[#00FF88]',
    label: 'Low Risk',
    headline: 'Transaction looks safe',
  },
  MEDIUM: {
    color: '#F59E0B',
    border: 'border-amber-500/25',
    bg: 'bg-amber-500/[0.04]',
    glow: 'shadow-[0_0_50px_rgba(245,158,11,0.12)]',
    badge: 'bg-amber-500/15 text-amber-400',
    dot: 'bg-amber-400',
    label: 'Medium Risk',
    headline: 'Proceed with caution',
  },
  HIGH: {
    color: '#EF4444',
    border: 'border-red-500/25',
    bg: 'bg-red-500/[0.04]',
    glow: 'shadow-[0_0_50px_rgba(239,68,68,0.15)]',
    badge: 'bg-red-500/15 text-red-400',
    dot: 'bg-red-400',
    label: 'High Risk',
    headline: 'High risk — be very careful',
  },
}

// ── Circular score SVG ─────────────────────────────────────────────────────────
function CircularScore({ score, color }) {
  const r = 42
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ

  return (
    <svg width="120" height="120" viewBox="0 0 100 100">
      {/* Track */}
      <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="7" />
      {/* Progress */}
      <motion.circle
        cx="50" cy="50" r={r}
        fill="none"
        stroke={color}
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.6, ease: [0.34, 1.56, 0.64, 1] }}
        transform="rotate(-90 50 50)"
      />
      {/* Score */}
      <text x="50" y="45" textAnchor="middle" dominantBaseline="middle"
        fill={color} fontSize="22" fontWeight="800" fontFamily="Inter,sans-serif">
        {score}
      </text>
      <text x="50" y="61" textAnchor="middle"
        fill="rgba(255,255,255,0.28)" fontSize="6.5" fontFamily="Inter,sans-serif" letterSpacing="1.5">
        RISK SCORE
      </text>
    </svg>
  )
}

// ── Field label ────────────────────────────────────────────────────────────────
function Label({ children, required }) {
  return (
    <label className="block text-sm font-medium text-gray-300 mb-2.5">
      {children}
      {required && <span className="text-[#00FF88] ml-0.5">*</span>}
    </label>
  )
}

// ── Toggle button group ────────────────────────────────────────────────────────
function ToggleGroup({ options, value, onChange }) {
  return (
    <div className={`grid gap-2.5`} style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}>
      {options.map((opt) => {
        const active = value === opt.value
        return (
          <motion.button
            key={opt.value}
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={() => onChange(opt.value)}
            className={`py-3 px-2 rounded-xl text-sm font-medium transition-all border flex flex-col items-center gap-0.5 ${
              active
                ? 'bg-[#00FF88]/12 border-[#00FF88]/45 text-[#00FF88]'
                : 'border-white/[0.08] text-gray-400 hover:border-white/[0.14] hover:text-white'
            }`}
          >
            <span className="font-semibold leading-tight">{opt.label}</span>
            {opt.sub && <span className="text-[10px] opacity-55 leading-tight">{opt.sub}</span>}
          </motion.button>
        )
      })}
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
const EMPTY_FORM = { contactType: '', amount: '', prepayment: '', channel: '', urgency: '', notes: '' }

export default function Checker() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const set = (field) => (val) => {
    setForm((f) => ({ ...f, [field]: val }))
    if (error) setError(null)
  }
  const handleInput = (e) => set(e.target.name)(e.target.value)

  const isValid = form.contactType && form.amount && form.channel && form.urgency

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!isValid) return
    setLoading(true)
    setError(null)
    setResult(null)
    setTimeout(() => {
      setResult(analyseTransaction(form))
      setLoading(false)
    }, 800)
  }

  const reset = () => { setResult(null); setForm(EMPTY_FORM) }

  const cfg = result ? RISK[result.riskLevel] : null

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-24 pb-20">
      <div className="max-w-xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight">
            Transaction <span className="text-[#00FF88]">Checker</span>
          </h1>
          <p className="text-gray-500 text-base">
            Fill in the details below — our AI analyses the risk in seconds.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* ── FORM ── */}
          {!result && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="glass rounded-2xl p-6 sm:p-8"
            >
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Contact Type */}
                <div>
                  <Label required>Contact Type</Label>
                  <ToggleGroup
                    value={form.contactType}
                    onChange={set('contactType')}
                    options={[
                      { value: 'New', label: 'New', sub: 'Never dealt with' },
                      { value: 'Known', label: 'Known', sub: 'Met before' },
                      { value: 'Repeat', label: 'Repeat', sub: 'Regular contact' },
                    ]}
                  />
                </div>

                {/* Amount */}
                <div>
                  <Label required>Transaction Amount</Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-bold tracking-wider select-none pointer-events-none">ZAR</span>
                    <input
                      type="number" name="amount" value={form.amount}
                      onChange={handleInput} placeholder="0.00" min="0" step="any"
                      className="input-field !pl-14"
                    />
                  </div>
                </div>

                {/* Prepayment */}
                <div>
                  <Label>Prepayment Requested <span className="text-gray-600 font-normal">(optional)</span></Label>
                  <div className="relative">
                    <input
                      type="number" name="prepayment" value={form.prepayment}
                      onChange={handleInput} placeholder="0" min="0" max="100"
                      className="input-field pr-10"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm select-none">%</span>
                  </div>
                  <p className="text-gray-600 text-xs mt-1.5">Leave blank if no prepayment was requested</p>
                </div>

                {/* Channel */}
                <div>
                  <Label required>Communication Channel</Label>
                  <select name="channel" value={form.channel} onChange={handleInput} className="input-field">
                    <option value="">Select channel...</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="SMS">SMS</option>
                    <option value="In person">In person</option>
                    <option value="Unknown platform">Unknown platform</option>
                  </select>
                </div>

                {/* Urgency */}
                <div>
                  <Label required>Urgency / Pressure Level</Label>
                  <ToggleGroup
                    value={form.urgency}
                    onChange={set('urgency')}
                    options={[
                      { value: 'None', label: 'None', sub: 'Relaxed' },
                      { value: 'Moderate', label: 'Moderate', sub: 'Some pressure' },
                      { value: 'High pressure', label: 'High', sub: 'Urgent / pushy' },
                    ]}
                  />
                </div>

                {/* Notes */}
                <div>
                  <Label>Extra Notes <span className="text-gray-600 font-normal">(optional)</span></Label>
                  <textarea
                    name="notes" value={form.notes} onChange={handleInput}
                    placeholder="Any other details about this trade that seem relevant..."
                    rows={3} className="input-field resize-none"
                  />
                </div>

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={!isValid || loading}
                  whileHover={isValid && !loading ? { scale: 1.02 } : {}}
                  whileTap={isValid && !loading ? { scale: 0.98 } : {}}
                  className={`w-full py-4 rounded-xl font-bold text-[15px] transition-all duration-200 ${
                    isValid && !loading
                      ? 'bg-[#00FF88] text-black shadow-[0_8px_28px_rgba(0,255,136,0.22)] hover:bg-[#00e07a]'
                      : 'bg-white/[0.05] text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-3">
                      <svg className="animate-spin w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                        <path fill="currentColor" opacity="0.75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Analysing transaction...
                    </span>
                  ) : (
                    'Analyse Transaction'
                  )}
                </motion.button>

                <p className="text-gray-600 text-xs text-center">
                  * Required fields. Your data is never stored.
                </p>
              </form>
            </motion.div>
          )}

          {/* ── RESULT CARD ── */}
          {result && cfg && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
              className={`rounded-2xl p-6 sm:p-8 border ${cfg.border} ${cfg.bg} ${cfg.glow}`}
            >
              {/* Score + level */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
                <div className="flex-shrink-0">
                  <CircularScore score={result.riskScore} color={cfg.color} />
                </div>
                <div>
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-2 ${cfg.badge}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                    {cfg.label}
                  </span>
                  <h2 className="text-2xl font-bold text-white leading-tight">{cfg.headline}</h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Score: <span style={{ color: cfg.color }} className="font-semibold">{result.riskScore}/100</span>
                  </p>
                </div>
              </div>

              {/* Risk factors */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Risk Factors</h3>
                <ul className="space-y-2.5">
                  {result.reasons.map((reason, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.07 }}
                      className="flex items-start gap-3 text-gray-300 text-sm leading-relaxed"
                    >
                      <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-[7px]" style={{ background: cfg.color }} />
                      {reason}
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Recommendation */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                className={`p-5 rounded-xl border ${cfg.border} mb-6`}
                style={{ background: `${cfg.color}08` }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="6.5" stroke={cfg.color} strokeWidth="1.3" />
                    <path d="M8 5v3.5" stroke={cfg.color} strokeWidth="1.5" strokeLinecap="round" />
                    <circle cx="8" cy="11" r="0.65" fill={cfg.color} />
                  </svg>
                  <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: cfg.color }}>
                    Recommendation
                  </span>
                </div>
                <p className="text-white text-sm leading-relaxed">{result.recommendation}</p>
              </motion.div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 no-print">
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={reset}
                  className="flex-1 py-3.5 rounded-xl font-bold text-sm bg-[#00FF88] text-black hover:bg-[#00e07a] transition-colors"
                >
                  Check Another Trade
                </motion.button>
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-3.5 rounded-xl font-semibold text-sm border border-white/[0.1] text-gray-400 hover:border-white/20 hover:text-white transition-colors"
                >
                  Save / Print Report
                </button>
              </div>

              <p className="text-gray-600 text-xs text-center mt-4">
                Assessment is advisory only. Always apply your own judgement.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
